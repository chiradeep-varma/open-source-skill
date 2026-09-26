function renderTable(elId, rows) {
  const el = document.getElementById(elId);
  if (!rows.length) {
    el.innerHTML = '<tr><td class="muted">No data yet</td></tr>';
    return;
  }
  el.innerHTML = rows
    .map((r) => `<tr><td>${escapeHtml(r.label || '(direct)')}</td><td>${r.count}</td></tr>`)
    .join('');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function main() {
  const res = await fetch(`/api/stats/${encodeURIComponent(window.TRIMLY_SLUG)}`);
  const stats = await res.json();

  renderTable('tbl-referrers', stats.top_referrers);
  renderTable('tbl-browsers', stats.top_browsers);
  renderTable('tbl-os', stats.top_os);
  renderTable('tbl-devices', stats.top_devices);
  renderTable('tbl-countries', stats.top_countries);

  new Chart(document.getElementById('clicksChart'), {
    type: 'line',
    data: {
      labels: stats.clicks_by_day.map((d) => d.date),
      datasets: [
        {
          label: 'Clicks',
          data: stats.clicks_by_day.map((d) => d.count),
          borderColor: '#5b8cff',
          backgroundColor: 'rgba(91,140,255,0.15)',
          tension: 0.25,
          fill: true,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });
}

main();
