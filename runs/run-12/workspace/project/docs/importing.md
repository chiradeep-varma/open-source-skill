# Importing from Bitly

sunny-thicket isn't affiliated with or endorsed by Bitly. This importer exists so links you've already shared don't have to be recreated by hand if you decide to self-host instead.

## Exporting your links from Bitly

From your Bitly dashboard, use their bulk link export to download a CSV of your links. Bitly's export includes columns such as `long_url` (the destination) and `link` (your full `bit.ly/...` short URL), plus metadata like title and creation date.

## Importing into sunny-thicket

```bash
curl -b cookies.txt \
  -H "Content-Type: text/csv" \
  --data-binary @bitly-export.csv \
  http://localhost:3000/api/import/bitly-csv
```

Or with an API token instead of a session cookie:

```bash
curl -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: text/csv" \
  --data-binary @bitly-export.csv \
  http://localhost:3000/api/import/bitly-csv
```

The response lists what was imported and what was skipped (and why):

```json
{
  "imported": [ { "code": "3AbCdEf", "long_url": "https://example.com/...", ... } ],
  "skipped": [ { "row": [...], "reason": "missing long_url" } ]
}
```

## What carries over, and what doesn't

| Carries over | Doesn't carry over |
|---|---|
| Destination URL | Historical click counts/analytics from Bitly (Bitly's export doesn't include per-click data, only aggregate counts, so there's nothing to import) |
| The short code itself, reused from your `bit.ly/<code>` link where possible | Tags, campaign/UTM metadata, archived status |
| Title, if present in the export | Bitly's branded-domain links — you'll need your own domain and `BASE_URL` configured |

If a code is already taken locally, that row still imports — it just gets a freshly generated code instead, rather than being dropped.

**Note:** this importer was built from Bitly's publicly documented export format, not tested against a real Bitly export file (none was available while building this). If your export has different column names, open an issue or adjust `server/import/bitlyCsv.js`, which looks for `long_url`/`longurl`/`original_url`/`destination` and `link`/`bitlink`/`short_url`/`shorturl` headers (case-insensitive).
