import { randomUUID, randomBytes } from 'node:crypto';

function newId() {
  return randomUUID();
}

function newToken() {
  return randomBytes(18).toString('base64url');
}

export function createRepo(db) {
  return {
    createPoll({ title, description, location, timezone, options }) {
      const pollId = newId();
      const adminToken = newToken();
      const createdAt = new Date().toISOString();

      db.exec('BEGIN');
      try {
        db.prepare(
          `INSERT INTO polls (id, title, description, location, timezone, admin_token, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, 'open', ?)`
        ).run(pollId, title.trim(), description?.trim() ?? '', location?.trim() ?? '', timezone, adminToken, createdAt);

        const insertOption = db.prepare(
          `INSERT INTO options (id, poll_id, starts_at, duration_minutes, sort_order) VALUES (?, ?, ?, ?, ?)`
        );
        options.forEach((option, index) => {
          insertOption.run(
            newId(),
            pollId,
            new Date(option.startsAt).toISOString(),
            Number(option.durationMinutes),
            index
          );
        });
        db.exec('COMMIT');
      } catch (err) {
        db.exec('ROLLBACK');
        throw err;
      }

      return { id: pollId, adminToken };
    },

    getPoll(pollId) {
      const row = db.prepare('SELECT * FROM polls WHERE id = ?').get(pollId);
      if (!row) return null;
      return mapPoll(row);
    },

    getPollByAdminToken(pollId, adminToken) {
      const row = db
        .prepare('SELECT * FROM polls WHERE id = ? AND admin_token = ?')
        .get(pollId, adminToken);
      if (!row) return null;
      return mapPoll(row);
    },

    getOptions(pollId) {
      return db
        .prepare('SELECT * FROM options WHERE poll_id = ? ORDER BY sort_order ASC')
        .all(pollId)
        .map((row) => ({
          id: row.id,
          pollId: row.poll_id,
          startsAt: row.starts_at,
          durationMinutes: row.duration_minutes,
        }));
    },

    getParticipants(pollId) {
      return db
        .prepare('SELECT * FROM participants WHERE poll_id = ? ORDER BY created_at ASC')
        .all(pollId)
        .map((row) => ({ id: row.id, pollId: row.poll_id, name: row.name, editToken: row.edit_token }));
    },

    getResponses(pollId) {
      return db
        .prepare(
          `SELECT r.participant_id AS participantId, r.option_id AS optionId, r.value
           FROM responses r
           JOIN participants p ON p.id = r.participant_id
           WHERE p.poll_id = ?`
        )
        .all(pollId);
    },

    findParticipantByEditToken(pollId, editToken) {
      const row = db
        .prepare('SELECT * FROM participants WHERE poll_id = ? AND edit_token = ?')
        .get(pollId, editToken);
      if (!row) return null;
      return { id: row.id, pollId: row.poll_id, name: row.name, editToken: row.edit_token };
    },

    /**
     * Creates or updates a participant and their responses in one transaction.
     * Returns { participantId, editToken }.
     */
    submitVote({ pollId, editToken, name, responses }) {
      db.exec('BEGIN');
      try {
        let participant = editToken
          ? db
              .prepare('SELECT * FROM participants WHERE poll_id = ? AND edit_token = ?')
              .get(pollId, editToken)
          : null;

        let participantId;
        let finalToken = editToken;
        const createdAt = new Date().toISOString();

        if (participant) {
          participantId = participant.id;
          db.prepare('UPDATE participants SET name = ? WHERE id = ?').run(name.trim(), participantId);
        } else {
          participantId = newId();
          finalToken = newToken();
          db.prepare(
            `INSERT INTO participants (id, poll_id, name, edit_token, created_at) VALUES (?, ?, ?, ?, ?)`
          ).run(participantId, pollId, name.trim(), finalToken, createdAt);
        }

        const upsert = db.prepare(
          `INSERT INTO responses (participant_id, option_id, value) VALUES (?, ?, ?)
           ON CONFLICT (participant_id, option_id) DO UPDATE SET value = excluded.value`
        );
        for (const [optionId, value] of Object.entries(responses)) {
          upsert.run(participantId, optionId, value);
        }

        db.exec('COMMIT');
        return { participantId, editToken: finalToken };
      } catch (err) {
        db.exec('ROLLBACK');
        throw err;
      }
    },

    finalizePoll(pollId, optionId) {
      db.prepare(`UPDATE polls SET status = 'finalized', finalized_option_id = ? WHERE id = ?`).run(
        optionId,
        pollId
      );
    },

    reopenPoll(pollId) {
      db.prepare(`UPDATE polls SET status = 'open', finalized_option_id = NULL WHERE id = ?`).run(pollId);
    },
  };
}

function mapPoll(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    timezone: row.timezone,
    adminToken: row.admin_token,
    status: row.status,
    finalizedOptionId: row.finalized_option_id,
    createdAt: row.created_at,
  };
}
