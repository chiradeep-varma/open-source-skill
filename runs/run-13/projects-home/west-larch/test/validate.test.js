const test = require('node:test');
const assert = require('node:assert/strict');
const {
  validateUsername, validatePassword, validateLinkUrl, validateLinkTitle, validateTheme,
} = require('../src/lib/validate');

test('validateUsername accepts normal handles', () => {
  assert.equal(validateUsername('bhaskar_99'), null);
});

test('validateUsername rejects reserved words', () => {
  assert.match(validateUsername('dashboard'), /reserved/);
});

test('validateUsername rejects bad characters and short names', () => {
  assert.ok(validateUsername('a'));
  assert.ok(validateUsername('Has Spaces'));
  assert.ok(validateUsername('caps-not-allowed-because-not-lowercase-CAPS'));
});

test('validatePassword enforces minimum length', () => {
  assert.equal(validatePassword('longenough1'), null);
  assert.ok(validatePassword('short'));
});

test('validateLinkUrl requires http(s)', () => {
  assert.equal(validateLinkUrl('https://example.com/x'), null);
  assert.ok(validateLinkUrl('javascript:alert(1)'));
  assert.ok(validateLinkUrl('not a url'));
});

test('validateLinkTitle requires non-empty, bounded text', () => {
  assert.equal(validateLinkTitle('My link'), null);
  assert.ok(validateLinkTitle(''));
  assert.ok(validateLinkTitle('x'.repeat(200)));
});

test('validateTheme only accepts known themes', () => {
  assert.equal(validateTheme('moss'), null);
  assert.ok(validateTheme('rainbow'));
});
