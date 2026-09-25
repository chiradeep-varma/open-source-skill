'use strict';

// Thin query layer over better-sqlite3. Every function takes `db` explicitly
// so tests can pass an in-memory database instead of the real one.

function listComponents(db) {
  return db.prepare('SELECT * FROM components ORDER BY position ASC, id ASC').all();
}

function getComponent(db, id) {
  return db.prepare('SELECT * FROM components WHERE id = ?').get(id);
}

function createComponent(db, { name, description, group_name, position }) {
  const info = db
    .prepare(
      'INSERT INTO components (name, description, group_name, position) VALUES (?, ?, ?, ?)'
    )
    .run(name, description || '', group_name || '', position || 0);
  return getComponent(db, info.lastInsertRowid);
}

function updateComponent(db, id, { name, description, group_name, position, status }) {
  db.prepare(
    `UPDATE components
     SET name = ?, description = ?, group_name = ?, position = ?, status = ?,
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
     WHERE id = ?`
  ).run(name, description || '', group_name || '', position || 0, status, id);
  return getComponent(db, id);
}

function setComponentStatus(db, id, status) {
  db.prepare(
    `UPDATE components SET status = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?`
  ).run(status, id);
  return getComponent(db, id);
}

function deleteComponent(db, id) {
  db.prepare('DELETE FROM components WHERE id = ?').run(id);
}

function listIncidents(db, { limit, onlyUnresolved } = {}) {
  let sql = 'SELECT * FROM incidents';
  const clauses = [];
  if (onlyUnresolved) clauses.push("status != 'resolved' AND impact != 'maintenance'");
  if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
  sql += ' ORDER BY created_at DESC, id DESC';
  if (limit) sql += ` LIMIT ${Number(limit)}`;
  return db.prepare(sql).all();
}

function listActiveMaintenances(db) {
  return db
    .prepare(
      "SELECT * FROM incidents WHERE impact = 'maintenance' AND status != 'completed' ORDER BY scheduled_for ASC"
    )
    .all();
}

function getIncident(db, id) {
  return db.prepare('SELECT * FROM incidents WHERE id = ?').get(id);
}

function getIncidentComponents(db, incidentId) {
  return db
    .prepare(
      `SELECT c.* FROM components c
       JOIN incident_components ic ON ic.component_id = c.id
       WHERE ic.incident_id = ?
       ORDER BY c.position ASC`
    )
    .all(incidentId);
}

function getIncidentUpdates(db, incidentId) {
  return db
    .prepare('SELECT * FROM incident_updates WHERE incident_id = ? ORDER BY created_at ASC, id ASC')
    .all(incidentId);
}

function createIncident(
  db,
  { title, impact, status, body, componentIds, scheduled_for, scheduled_until }
) {
  const tx = db.transaction(() => {
    const info = db
      .prepare(
        `INSERT INTO incidents (title, impact, status, scheduled_for, scheduled_until)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(title, impact, status, scheduled_for || null, scheduled_until || null);
    const incidentId = info.lastInsertRowid;

    db.prepare(
      'INSERT INTO incident_updates (incident_id, body, status) VALUES (?, ?, ?)'
    ).run(incidentId, body, status);

    const insertLink = db.prepare(
      'INSERT INTO incident_components (incident_id, component_id) VALUES (?, ?)'
    );
    for (const componentId of componentIds || []) {
      insertLink.run(incidentId, componentId);
    }

    return incidentId;
  });

  const incidentId = tx();
  return getIncident(db, incidentId);
}

function addIncidentUpdate(db, incidentId, { body, status }) {
  const tx = db.transaction(() => {
    db.prepare(
      'INSERT INTO incident_updates (incident_id, body, status) VALUES (?, ?, ?)'
    ).run(incidentId, body, status);

    const resolvedAt = status === 'resolved' || status === 'completed'
      ? "strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"
      : 'resolved_at';

    db.prepare(
      `UPDATE incidents SET status = ?, resolved_at = ${resolvedAt} WHERE id = ?`
    ).run(status, incidentId);
  });
  tx();
  return getIncident(db, incidentId);
}

function findUser(db, username) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
}

module.exports = {
  listComponents,
  getComponent,
  createComponent,
  updateComponent,
  setComponentStatus,
  deleteComponent,
  listIncidents,
  listActiveMaintenances,
  getIncident,
  getIncidentComponents,
  getIncidentUpdates,
  createIncident,
  addIncidentUpdate,
  findUser,
};
