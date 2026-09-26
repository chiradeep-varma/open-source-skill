'use strict';

process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test-password-only';

const test = require('node:test');
const assert = require('node:assert/strict');
const Database = require('better-sqlite3');
const { migrate } = require('../src/db');
const models = require('../src/models');

function freshDb() {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  migrate(db);
  return db;
}

test('creating a component defaults to operational', () => {
  const db = freshDb();
  const c = models.createComponent(db, { name: 'API', description: '', group_name: '', position: 0 });
  assert.equal(c.status, 'operational');
});

test('creating an incident also writes its first update and links components', () => {
  const db = freshDb();
  const api = models.createComponent(db, { name: 'API', description: '', group_name: '', position: 0 });

  const incident = models.createIncident(db, {
    title: 'API errors',
    impact: 'major',
    status: 'investigating',
    body: 'Seeing elevated error rates.',
    componentIds: [api.id],
  });

  assert.equal(incident.status, 'investigating');
  assert.equal(incident.resolved_at, null);

  const updates = models.getIncidentUpdates(db, incident.id);
  assert.equal(updates.length, 1);
  assert.equal(updates[0].body, 'Seeing elevated error rates.');

  const linked = models.getIncidentComponents(db, incident.id);
  assert.equal(linked.length, 1);
  assert.equal(linked[0].id, api.id);
});

test('resolving an incident stamps resolved_at and appends an update, not a new incident', () => {
  const db = freshDb();
  const incident = models.createIncident(db, {
    title: 'DB slow',
    impact: 'minor',
    status: 'investigating',
    body: 'Looking into slow queries.',
    componentIds: [],
  });

  const resolved = models.addIncidentUpdate(db, incident.id, {
    body: 'Fixed a missing index.',
    status: 'resolved',
  });

  assert.equal(resolved.status, 'resolved');
  assert.ok(resolved.resolved_at, 'resolved_at should be set');
  assert.equal(models.getIncidentUpdates(db, incident.id).length, 2);
});

test('listIncidents with onlyUnresolved excludes resolved incidents and maintenance', () => {
  const db = freshDb();
  const open = models.createIncident(db, {
    title: 'Open incident',
    impact: 'minor',
    status: 'investigating',
    body: 'start',
    componentIds: [],
  });
  const toResolve = models.createIncident(db, {
    title: 'Will resolve',
    impact: 'minor',
    status: 'investigating',
    body: 'start',
    componentIds: [],
  });
  models.addIncidentUpdate(db, toResolve.id, { body: 'done', status: 'resolved' });
  models.createIncident(db, {
    title: 'Maintenance window',
    impact: 'maintenance',
    status: 'scheduled',
    body: 'planned',
    componentIds: [],
  });

  const unresolved = models.listIncidents(db, { onlyUnresolved: true });
  assert.equal(unresolved.length, 1);
  assert.equal(unresolved[0].id, open.id);
});
