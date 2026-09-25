const form = document.getElementById('create-form');
const errorEl = document.getElementById('create-error');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.slug) delete data.slug;

    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      const body = await res.json().catch(() => ({}));
      errorEl.textContent = body.error || 'Something went wrong.';
      errorEl.hidden = false;
    }
  });
}

document.querySelectorAll('[data-delete]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const slug = btn.getAttribute('data-delete');
    if (!confirm(`Delete short link "${slug}"? This also deletes its click history.`)) return;
    const res = await fetch(`/api/links/${encodeURIComponent(slug)}`, { method: 'DELETE' });
    if (res.ok) window.location.reload();
  });
});
