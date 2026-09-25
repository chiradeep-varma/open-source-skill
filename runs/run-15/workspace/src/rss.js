'use strict';

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildIncidentsRss({ siteTitle, siteDescription, baseUrl, incidents }) {
  const items = incidents
    .map((incident) => {
      const link = `${baseUrl}/incidents/${incident.id}`;
      const pubDate = new Date(incident.created_at).toUTCString();
      return `    <item>
      <title>${escapeXml(incident.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(incident.latestBody || incident.title)}</description>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteTitle)} status</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml(siteDescription)}</description>
${items}
  </channel>
</rss>
`;
}

module.exports = { buildIncidentsRss };
