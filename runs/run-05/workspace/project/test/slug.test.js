const test = require('node:test');
const assert = require('node:assert/strict');
const { randomSlug, isValidCustomSlug } = require('../src/lib/slug');

test('randomSlug produces the requested length using a safe alphabet', () => {
  const slug = randomSlug(7);
  assert.equal(slug.length, 7);
  assert.match(slug, /^[a-zA-Z0-9]+$/);
  // Ambiguous characters should never appear.
  assert.doesNotMatch(slug, /[0O1lI]/);
});

test('randomSlug is not obviously constant across calls', () => {
  const samples = new Set(Array.from({ length: 20 }, () => randomSlug()));
  assert.ok(samples.size > 1, 'expected variety across 20 generated slugs');
});

test('isValidCustomSlug accepts reasonable slugs', () => {
  assert.ok(isValidCustomSlug('my-link_1'));
  assert.ok(isValidCustomSlug('abc'));
});

test('isValidCustomSlug rejects too short, invalid chars, and reserved words', () => {
  assert.ok(!isValidCustomSlug('ab'));
  assert.ok(!isValidCustomSlug('has space'));
  assert.ok(!isValidCustomSlug('slash/es'));
  assert.ok(!isValidCustomSlug('api'));
  assert.ok(!isValidCustomSlug('login'));
  assert.ok(!isValidCustomSlug(''));
  assert.ok(!isValidCustomSlug(undefined));
});
