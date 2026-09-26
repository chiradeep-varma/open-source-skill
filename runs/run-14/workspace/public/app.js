(function () {
  'use strict';

  // ---- Home page: dynamic option rows + local-time -> UTC conversion on submit ----
  var addRowBtn = document.getElementById('add-row');
  var rowsContainer = document.getElementById('option-rows');
  var timezoneField = document.getElementById('timezone');

  if (timezoneField) {
    try {
      timezoneField.value = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch (e) {
      /* keep default UTC */
    }
  }

  function rowTemplate() {
    var row = document.createElement('div');
    row.className = 'option-row';
    row.innerHTML =
      '<div class="field">' +
      '<input type="datetime-local" class="starts-at-local" required />' +
      '<input type="hidden" name="startsAt" class="starts-at-utc" />' +
      '</div>' +
      '<div class="field duration">' +
      '<select name="durationMinutes">' +
      '<option value="30">30 min</option>' +
      '<option value="60" selected>1 hour</option>' +
      '<option value="90">1.5 hours</option>' +
      '<option value="120">2 hours</option>' +
      '</select>' +
      '</div>' +
      '<button type="button" class="ghost small remove-row" title="Remove this time">Remove</button>';
    return row;
  }

  if (addRowBtn && rowsContainer) {
    addRowBtn.addEventListener('click', function () {
      rowsContainer.appendChild(rowTemplate());
    });
    rowsContainer.addEventListener('click', function (evt) {
      if (evt.target.classList.contains('remove-row')) {
        var rows = rowsContainer.querySelectorAll('.option-row');
        if (rows.length > 1) evt.target.closest('.option-row').remove();
      }
    });
  }

  var createForm = document.getElementById('create-form');
  if (createForm) {
    createForm.addEventListener('submit', function (evt) {
      var locals = createForm.querySelectorAll('.starts-at-local');
      for (var i = 0; i < locals.length; i++) {
        var localInput = locals[i];
        var hidden = localInput.parentElement.querySelector('.starts-at-utc');
        if (!localInput.value) continue;
        var d = new Date(localInput.value);
        if (isNaN(d.getTime())) continue;
        hidden.value = d.toISOString();
      }
    });
  }

  // ---- Poll page: render local times, admin link, vote grid ----
  var localTimeEls = document.querySelectorAll('.local-time');
  localTimeEls.forEach(function (el) {
    var utc = el.getAttribute('data-utc');
    if (!utc) return;
    var d = new Date(utc);
    if (isNaN(d.getTime())) return;
    el.textContent = new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  });

  var participantLinkBox = document.getElementById('participant-link');
  if (participantLinkBox && window.__POLL__) {
    var url = window.location.origin + '/p/' + window.__POLL__.id;
    participantLinkBox.textContent = url;
  }

  var isAdmin = document.body.getAttribute('data-admin') === 'true';
  if (window.__POLL__ && !isAdmin) {
    var storageKey = 'rf:editToken:' + window.__POLL__.id;
    var params = new URLSearchParams(window.location.search);
    var storedToken = null;
    try {
      storedToken = localStorage.getItem(storageKey);
    } catch (e) {
      /* localStorage unavailable (private mode etc.) — degrade to always-new-participant */
    }
    if (storedToken && !params.get('t')) {
      params.set('t', storedToken);
      window.location.replace(window.location.pathname + '?' + params.toString());
      return;
    }
  }

  var ORDER = ['yes', 'if_need_be', 'no'];
  var ICONS = { yes: '✓', if_need_be: '~', no: '✕' };

  function nextValue(current) {
    if (!current) return 'yes';
    var idx = ORDER.indexOf(current);
    return ORDER[(idx + 1) % ORDER.length];
  }

  var voteGrid = document.getElementById('vote-grid');
  if (voteGrid) {
    voteGrid.addEventListener('click', function (evt) {
      var btn = evt.target.closest('.vote-btn');
      if (!btn) return;
      var next = nextValue(btn.getAttribute('data-value'));
      btn.setAttribute('data-value', next);
      btn.textContent = ICONS[next];
      btn.className = 'vote-btn active';
    });
  }

  var saveBtn = document.getElementById('save-vote');
  if (saveBtn && window.__POLL__) {
    saveBtn.addEventListener('click', function () {
      var status = document.getElementById('vote-status');
      var name = document.getElementById('name').value.trim();
      if (!name) {
        status.textContent = 'Please enter your name.';
        return;
      }
      var responses = {};
      voteGrid.querySelectorAll('.vote-btn').forEach(function (btn) {
        var v = btn.getAttribute('data-value');
        if (v) responses[btn.getAttribute('data-option')] = v;
      });

      var storageKey = 'rf:editToken:' + window.__POLL__.id;
      var editToken = null;
      try {
        editToken = localStorage.getItem(storageKey);
      } catch (e) {}

      status.textContent = 'Saving…';
      fetch('/api/polls/' + window.__POLL__.id + '/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, editToken: editToken, responses: responses }),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok) throw new Error(data.error || 'Could not save your vote.');
            return data;
          });
        })
        .then(function (data) {
          try {
            localStorage.setItem(storageKey, data.editToken);
          } catch (e) {}
          status.textContent = 'Saved. Reloading results…';
          window.location.reload();
        })
        .catch(function (err) {
          status.textContent = err.message;
        });
    });
  }
})();
