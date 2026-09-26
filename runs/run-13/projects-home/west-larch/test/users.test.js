const test = require('node:test');
const assert = require('node:assert/strict');
const { createDb } = require('../src/db');
const { createUser, getUserByUsername, verifyPassword } = require('../src/models/users');

test('usernames are unique regardless of case, enforced by the database', () => {
  const db = createDb(':memory:');
  createUser(db, { username: 'Alice', password: 'password123', displayName: 'Alice' });
  assert.throws(() => {
    createUser(db, { username: 'alice', password: 'password123', displayName: 'Alice2' });
  }, /UNIQUE/);
});

test('getUserByUsername is case-insensitive', () => {
  const db = createDb(':memory:');
  createUser(db, { username: 'Alice', password: 'password123', displayName: 'Alice' });
  assert.ok(getUserByUsername(db, 'ALICE'));
});

test('verifyPassword only accepts the right password', () => {
  const db = createDb(':memory:');
  const user = createUser(db, { username: 'bob', password: 'correct-horse', displayName: 'Bob' });
  assert.equal(verifyPassword(user, 'correct-horse'), true);
  assert.equal(verifyPassword(user, 'wrong'), false);
});
