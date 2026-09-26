const { createLink } = require('../models/links');

// Bitly's bulk link export is a CSV with headers such as:
// "long_url","link","title","created_at","archived"
// where "link" (or "bitlink") is the full short URL, e.g. "https://bit.ly/3AbCdEf".
// We only need the destination URL and the trailing short code; everything
// else in a real export (tags, archived flag, clicks-at-export-time) is
// ignored since it doesn't carry over to a differently-shaped instance.

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

function codeFromShortUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

function findColumn(header, candidates) {
  const lower = header.map((h) => h.trim().toLowerCase());
  for (const name of candidates) {
    const idx = lower.indexOf(name);
    if (idx !== -1) return idx;
  }
  return -1;
}

/**
 * @param {string} csvText
 * @returns {{ imported: Array, skipped: Array }}
 */
function importBitlyCsv(csvText) {
  const rows = parseCsv(csvText);
  if (rows.length === 0) return { imported: [], skipped: [] };

  const [header, ...dataRows] = rows;
  const longUrlIdx = findColumn(header, ['long_url', 'longurl', 'original_url', 'destination']);
  const shortUrlIdx = findColumn(header, ['link', 'bitlink', 'short_url', 'shorturl']);
  const titleIdx = findColumn(header, ['title']);

  if (longUrlIdx === -1) {
    const err = new Error(
      'Could not find a "long_url" column in this CSV. Expected a Bitly export with a long_url column.'
    );
    err.status = 400;
    throw err;
  }

  const imported = [];
  const skipped = [];

  for (const cells of dataRows) {
    const longUrl = (cells[longUrlIdx] || '').trim();
    const shortUrl = shortUrlIdx !== -1 ? (cells[shortUrlIdx] || '').trim() : '';
    const title = titleIdx !== -1 ? (cells[titleIdx] || '').trim() : '';
    const suggestedCode = shortUrl ? codeFromShortUrl(shortUrl) : null;

    if (!longUrl) {
      skipped.push({ row: cells, reason: 'missing long_url' });
      continue;
    }

    try {
      const link = createLink({ longUrl, code: suggestedCode || undefined, title: title || undefined });
      imported.push(link);
    } catch (e) {
      // Code collision or invalid slug: fall back to an auto-generated code
      // rather than dropping the row, since the destination URL is still valid.
      try {
        const link = createLink({ longUrl, title: title || undefined });
        imported.push(link);
      } catch (e2) {
        skipped.push({ row: cells, reason: e2.message });
      }
    }
  }

  return { imported, skipped };
}

module.exports = { importBitlyCsv, parseCsv };
