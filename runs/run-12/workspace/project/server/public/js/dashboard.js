const form = document.getElementById('create-form');
const errorEl = document.getElementById('create-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.hidden = true;

  const data = new FormData(form);
  const body = { url: data.get('url'), code: data.get('code') || undefined };

  const res = await fetch('/api/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    errorEl.textContent = payload.error || 'Something went wrong creating that link.';
    errorEl.hidden = false;
    return;
  }

  window.location.reload();
});

document.querySelectorAll('.btn-delete').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const code = btn.dataset.code;
    if (!confirm(`Delete short link "${code}"? This also deletes its click history.`)) return;
    const res = await fetch(`/api/links/${encodeURIComponent(code)}`, { method: 'DELETE' });
    if (res.ok) window.location.reload();
  });
});
