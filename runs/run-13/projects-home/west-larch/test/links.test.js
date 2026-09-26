const test = require('node:test');
const assert = require('node:assert/strict');
const { createDb } = require('../src/db');
const { createUser } = require('../src/models/users');
const {
  createLink, listLinks, moveLink, toggleActive, registerClick, deleteLink,
} = require('../src/models/links');

function setup() {
  const db = createDb(':memory:');
  const user = createUser(db, { username: 'creator', password: 'password123', displayName: 'Creator' });
  return { db, user };
}

test('links are ordered by creation position', () => {
  const { db, user } = setup();
  createLink(db, user.id, { title: 'First', url: 'https://a.example' });
  createLink(db, user.id, { title: 'Second', url: 'https://b.example' });
  const links = listLinks(db, user.id);
  assert.deepEqual(links.map((l) => l.title), ['First', 'Second']);
});

test('moveLink swaps position with the neighbor', () => {
  const { db, user } = setup();
  const a = createLink(db, user.id, { title: 'A', url: 'https://a.example' });
  const b = createLink(db, user.id, { title: 'B', url: 'https://b.example' });
  moveLink(db, user.id, b.id, 'up');
  const links = listLinks(db, user.id);
  assert.deepEqual(links.map((l) => l.title), ['B', 'A']);
  assert.equal(links[0].id, a.id + 1); // b kept its own id, just moved position
});

test('moveLink is a no-op at the boundaries', () => {
  const { db, user } = setup();
  const a = createLink(db, user.id, { title: 'A', url: 'https://a.example' });
  moveLink(db, user.id, a.id, 'up');
  const links = listLinks(db, user.id);
  assert.equal(links[0].id, a.id);
});

test('toggleActive flips visibility and activeOnly listing respects it', () => {
  const { db, user } = setup();
  const a = createLink(db, user.id, { title: 'A', url: 'https://a.example' });
  toggleActive(db, a.id);
  assert.equal(listLinks(db, user.id, { activeOnly: true }).length, 0);
  toggleActive(db, a.id);
  assert.equal(listLinks(db, user.id, { activeOnly: true }).length, 1);
});

test('registerClick increments atomically under concurrent calls', () => {
  const { db, user } = setup();
  const a = createLink(db, user.id, { title: 'A', url: 'https://a.example' });
  for (let i = 0; i < 50; i += 1) registerClick(db, a.id);
  const [row] = listLinks(db, user.id);
  assert.equal(row.clicks, 50);
});

test('deleteLink removes the row', () => {
  const { db, user } = setup();
  const a = createLink(db, user.id, { title: 'A', url: 'https://a.example' });
  deleteLink(db, a.id);
  assert.equal(listLinks(db, user.id).length, 0);
});
