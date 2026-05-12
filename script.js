/* ═══════════════════════════════════════════════════
   Avaia Survey — script.js
   Multi-step navigation + Web3Forms submission
   ═══════════════════════════════════════════════════

   SETUP: Replace the value below with your free key
   from https://web3forms.com
   ═══════════════════════════════════════════════════ */

const WEB3FORMS_KEY = 'YOUR_ACCESS_KEY_HERE';

const TOTAL_SECTIONS = 4;

/* ── Progress ── */
function updateProgress(step) {
  const pct = ((step - 1) / TOTAL_SECTIONS) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('currentStep').textContent = step;
}

/* ── Show a section ── */
function showSection(n) {
  document.querySelectorAll('.survey-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('section-' + n);
  if (target) target.classList.add('active');
  updateProgress(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Next ── */
function goNext(currentSection) {
  if (currentSection < TOTAL_SECTIONS) {
    showSection(currentSection + 1);
  }
}

/* ── Back ── */
function goPrev(currentSection) {
  if (currentSection > 1) {
    showSection(currentSection - 1);
  }
}

/* ── Collect all answers ── */
function collectAnswers() {
  const get   = name => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : 'Not answered';
  };

  const checks = () =>
    [...document.querySelectorAll('input[name="features"]:checked')]
      .map(c => c.value).join(', ') || 'None selected';

  return {
    role:             get('role'),
    frequency:        get('frequency'),
    group_size:       get('group_size'),
    frustration:      get('frustration'),
    current_solution: get('current_solution'),
    satisfaction:     get('satisfaction') + ' / 5',
    features:         checks(),
    nps:              get('nps') + ' / 10',
    followup:         get('followup'),
    name:             document.getElementById('f_name').value.trim()  || '(not provided)',
    email:            document.getElementById('f_email').value.trim() || '(not provided)',
    comments:         document.getElementById('f_comments').value.trim() || '(none)',
  };
}

/* ── Render summary on success screen ── */
function renderSummary(data) {
  const labels = {
    role:             'Traveller type',
    frequency:        'Trip frequency',
    group_size:       'Group size',
    frustration:      'Biggest frustration',
    current_solution: 'Current solution',
    satisfaction:     'Satisfaction score',
    features:         'Desired features',
    nps:              'NPS score',
    followup:         'Follow-up consent',
    comments:         'Additional comments',
  };

  const grid = document.getElementById('summaryGrid');
  grid.innerHTML = Object.entries(labels).map(([key, label]) => `
    <div class="summary-item">
      <div class="summary-q">${label}</div>
      <div class="summary-a">${data[key]}</div>
    </div>
  `).join('');
}

/* ── Submit to Web3Forms ── */
async function submitSurvey() {
  const name  = document.getElementById('f_name').value.trim();
  const email = document.getElementById('f_email').value.trim();

  if (!name || !email) {
    alert('Please fill in your name and email before submitting.');
    return;
  }

  const btn = document.getElementById('submitBtn');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  const answers = collectAnswers();

  /* Build form data for Web3Forms */
  const payload = new FormData();
  payload.append('access_key', WEB3FORMS_KEY);
  payload.append('subject',    'New Avaia Survey Response');
  payload.append('from_name',  'Avaia Survey');
  payload.append('botcheck',   '');

  /* Respondent identity */
  payload.append('name',  answers.name);
  payload.append('email', answers.email);

  /* Survey answers */
  payload.append('Traveller type',      answers.role);
  payload.append('Trip frequency',      answers.frequency);
  payload.append('Group size',          answers.group_size);
  payload.append('Biggest frustration', answers.frustration);
  payload.append('Current solution',    answers.current_solution);
  payload.append('Satisfaction (1-5)',  answers.satisfaction);
  payload.append('Desired features',    answers.features);
  payload.append('NPS (0-10)',          answers.nps);
  payload.append('Follow-up consent',   answers.followup);
  payload.append('Additional comments', answers.comments);

  try {
    const res  = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body:   payload,
    });
    const data = await res.json();

    if (data.success) {
      /* Hide all sections and header progress */
      document.querySelectorAll('.survey-section').forEach(s => s.style.display = 'none');
      document.getElementById('progressFill').parentElement.style.display = 'none';
      document.querySelector('.progress-text').style.display = 'none';

      /* Show success */
      const screen = document.getElementById('successScreen');
      screen.style.display = 'block';
      screen.scrollIntoView({ behavior: 'smooth' });

      renderSummary(answers);
    } else {
      showError();
      btn.textContent = 'Submit ✈';
      btn.disabled = false;
    }
  } catch (err) {
    showError();
    btn.textContent = 'Submit ✈';
    btn.disabled = false;
  }
}

function showError() {
  const banner = document.getElementById('errorBanner');
  banner.style.display = 'block';
  banner.scrollIntoView({ behavior: 'smooth' });
}

/* ── Init ── */
updateProgress(1);
