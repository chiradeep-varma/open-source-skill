(function () {
  var data = window.__FORMSTEAD__;
  if (!data || !data.questions || data.questions.length === 0) return;

  var form = document.getElementById('formstead-form');
  var blocks = Array.prototype.slice.call(document.querySelectorAll('.question-block'));
  var nextBtn = document.getElementById('btn-next');
  var backBtn = document.getElementById('btn-back');
  var progressFill = document.getElementById('progress-fill');
  var questions = data.questions;
  var rulesByQuestion = data.rulesByQuestion || {};

  document.body.classList.add('js-enhanced');

  function blockFor(id) {
    return document.querySelector('.question-block[data-question-id="' + id + '"]');
  }

  function getAnswerValue(id) {
    var block = blockFor(id);
    if (!block) return '';
    var checked = block.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
    if (checked.length) {
      return Array.prototype.map.call(checked, function (el) { return el.value; }).join(', ');
    }
    var field = block.querySelector('input, textarea');
    return field ? field.value : '';
  }

  function isAnswered(id, required) {
    if (!required) return true;
    return getAnswerValue(id).trim().length > 0;
  }

  function matchRule(rule, value) {
    var val = String(value || '').toLowerCase();
    var target = String(rule.value || '').toLowerCase();
    if (rule.operator === 'equals') return val === target;
    if (rule.operator === 'not_equals') return val !== target;
    if (rule.operator === 'contains') return val.indexOf(target) !== -1;
    return false;
  }

  // Returns the next question id, the string "end" to submit now, or null
  // when the default question order is simply exhausted.
  function computeNext(currentId) {
    var rules = rulesByQuestion[currentId] || [];
    var value = getAnswerValue(currentId);
    for (var i = 0; i < rules.length; i++) {
      if (matchRule(rules[i], value)) {
        if (rules[i].target_is_end) return 'end';
        return rules[i].target_question_id;
      }
    }
    var idx = questions.findIndex(function (q) { return q.id === currentId; });
    var nextQ = questions[idx + 1];
    return nextQ ? nextQ.id : null;
  }

  var visitedStack = [questions[0].id];
  var currentIndex = 0;

  function render() {
    blocks.forEach(function (b) { b.classList.remove('active'); });
    var currentId = visitedStack[currentIndex];
    var block = blockFor(currentId);
    if (block) block.classList.add('active');
    backBtn.disabled = currentIndex === 0;

    var defaultIdx = questions.findIndex(function (q) { return q.id === currentId; });
    nextBtn.textContent = defaultIdx === questions.length - 1 ? 'Submit' : 'Next';

    var pct = Math.round(((currentIndex + 1) / questions.length) * 100);
    progressFill.style.width = Math.min(pct, 100) + '%';

    var input = block && block.querySelector('input, textarea');
    if (input && typeof input.focus === 'function') input.focus({ preventScroll: true });
  }

  function goNext() {
    var currentId = visitedStack[currentIndex];
    var required = questions.find(function (q) { return q.id === currentId; }).required;
    if (!isAnswered(currentId, required)) {
      var block = blockFor(currentId);
      block.style.outline = '2px solid #b3261e';
      setTimeout(function () { block.style.outline = 'none'; }, 900);
      return;
    }

    var next = computeNext(currentId);
    if (next === 'end' || next === null) {
      form.submit();
      return;
    }

    if (currentIndex === visitedStack.length - 1) {
      visitedStack.push(next);
    } else if (visitedStack[currentIndex + 1] !== next) {
      visitedStack = visitedStack.slice(0, currentIndex + 1);
      visitedStack.push(next);
    }
    currentIndex += 1;
    render();
  }

  function goBack() {
    if (currentIndex === 0) return;
    currentIndex -= 1;
    render();
  }

  nextBtn.addEventListener('click', goNext);
  backBtn.addEventListener('click', goBack);

  form.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'textarea') return;
    e.preventDefault();
    goNext();
  });

  render();
})();
