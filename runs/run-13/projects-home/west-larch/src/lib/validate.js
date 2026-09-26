const RESERVED_USERNAMES = new Set([
  'signup', 'login', 'logout', 'dashboard', 'api', 'static', 'assets',
  'css', 'js', 'l', 'favicon.ico', 'robots.txt', 'admin', 'www', 'app',
]);

const USERNAME_RE = /^[a-z0-9_-]{3,30}$/;

function validateUsername(username) {
  if (typeof username !== 'string') return 'Username is required.';
  const u = username.trim().toLowerCase();
  if (!USERNAME_RE.test(u)) {
    return 'Username must be 3-30 characters: lowercase letters, numbers, "_" or "-".';
  }
  if (RESERVED_USERNAMES.has(u)) {
    return 'That username is reserved. Try another.';
  }
  return null;
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  return null;
}

function validateLinkTitle(title) {
  if (typeof title !== 'string' || title.trim().length === 0) {
    return 'Link title is required.';
  }
  if (title.trim().length > 100) {
    return 'Link title must be 100 characters or fewer.';
  }
  return null;
}

function validateLinkUrl(url) {
  if (typeof url !== 'string') return 'Link URL is required.';
  let parsed;
  try {
    parsed = new URL(url.trim());
  } catch {
    return 'Enter a full URL, including https://';
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return 'Links must start with http:// or https://';
  }
  return null;
}

const THEMES = ['paper', 'ink', 'moss', 'clay', 'slate'];

function validateTheme(theme) {
  return THEMES.includes(theme) ? null : 'Unknown theme.';
}

module.exports = {
  RESERVED_USERNAMES,
  THEMES,
  validateUsername,
  validatePassword,
  validateLinkTitle,
  validateLinkUrl,
  validateTheme,
};
