const TOTAL_SECTIONS = 6;
let currentSection = 0;
const surveyForm = document.getElementById('surveyForm');
const sections = document.querySelectorAll('.survey-section');

const FIELD_LABELS = {
    travelFrequency:     'How often do you travel with a group?',
    groupSize:           'Typical group size',
    multiCurrency:       'Group travels with different currencies?',
    currencyDifficulty:  'Difficulty splitting costs (1 = easy, 5 = hard)',
    biggestChallenge:    'Biggest challenge managing group expenses',
    disputes:            'Had disputes over who owes what?',
    currentMethod:       'Current method for splitting expenses',
    currentSatisfaction: 'Satisfaction with current method (1 = low, 5 = high)',
    desiredFeatures:     'Most valuable features',
    pricingModel:        'Preferred pricing model',
    additionalComments:  'Additional suggestions',
    email:               'Email for early access'
};

document.addEventListener('DOMContentLoaded', () => {
    initSurvey();
    setupEventListeners();
    restoreSurveyState();
});

function initSurvey() {
    if (sections.length === 0) return;
    showSection(0);
    updateProgressBar();
    updateButtonStates();
}

function setupEventListeners() {
    document.getElementById('nextBtn').addEventListener('click', nextSection);
    document.getElementById('prevBtn').addEventListener('click', prevSection);
    surveyForm.addEventListener('change', saveSurveyState);
    surveyForm.addEventListener('input', saveSurveyState);
    document.getElementById('submitBtn').addEventListener('click', function(e) {
        e.preventDefault();
        submitToFormspree();
    });
}

function showSection(index) {
    sections.forEach(section => section.classList.remove('active'));
    if (sections[index]) {
        sections[index].classList.add('active');
        currentSection = index;
        updateProgressBar();
        updateButtonStates();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function nextSection() {
    if (currentSection < sections.length - 1) {
        showSection(currentSection + 1);
    }
}

function prevSection() {
    if (currentSection > 0) {
        showSection(currentSection - 1);
    }
}

function updateProgressBar() {
    const pct = ((currentSection + 1) / TOTAL_SECTIONS) * 100;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('currentSection').textContent = currentSection + 1;
}

function updateButtonStates() {
    const prevBtn   = document.getElementById('prevBtn');
    const nextBtn   = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    prevBtn.style.display   = currentSection === 0 ? 'none' : 'block';
    nextBtn.style.display   = currentSection === sections.length - 1 ? 'none' : 'block';
    submitBtn.style.display = currentSection === sections.length - 1 ? 'block' : 'none';
}

async function submitToFormspree() {
    saveSurveyState();
    const formData = new FormData(surveyForm);
    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
            showThankYou();
        } else {
            showThankYou();
        }
    } catch (err) {
        showThankYou();
    }
}

function showThankYou() {
    surveyForm.style.display = 'none';
    document.querySelector('.progress-bar').style.display = 'none';
    document.querySelector('.progress-text').style.display = 'none';

    const saved = localStorage.getItem('avaiasurvey_state');
    let data = {};
    if (saved) {
        try { data = JSON.parse(saved); } catch(e) {}
    }

    const order = [
        'travelFrequency','groupSize','multiCurrency',
        'currencyDifficulty','biggestChallenge','disputes',
        'currentMethod','currentSatisfaction',
        'desiredFeatures','pricingModel',
        'additionalComments','email'
    ];

    let summaryHTML = '';
    order.forEach(key => {
        let value = data[key];
        if (!value || (Array.isArray(value) && value.length === 0)) return;
        if (Array.isArray(value)) value = value.join(', ');
        value = String(value).trim();
        if (!value) return;
        const label = FIELD_LABELS[key] || key;
        summaryHTML += '<div class="summary-item"><div class="summary-q">' + label + '</div><div class="summary-a">' + value + '</div></div>';
    });

    const successEl = document.getElementById('successMessage');
    document.getElementById('summaryContent').innerHTML = summaryHTML || '<p style="color:rgba(252,232,229,.4)">No answers recorded.</p>';
    successEl.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveSurveyState() {
    const formData = new FormData(surveyForm);
    const data = {};
    for (const [key, value] of formData.entries()) {
        if (data[key]) {
            data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
        } else {
            data[key] = value;
        }
    }
    localStorage.setItem('avaiasurvey_state', JSON.stringify(data));
}

function restoreSurveyState() {
    const saved = localStorage.getItem('avaiasurvey_state');
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (Array.isArray(value)) {
                value.forEach(v => {
                    const input = document.querySelector('input[name="' + key + '"][value="' + v + '"]');
                    if (input) input.checked = true;
                });
            } else {
                const input = document.querySelector('input[name="' + key + '"], textarea[name="' + key + '"]');
                if (input) {
                    if (input.type === 'radio' || input.type === 'checkbox') {
                        const specific = document.querySelector('input[name="' + key + '"][value="' + value + '"]');
                        if (specific) specific.checked = true;
                    } else {
                        input.value = value;
                    }
                }
            }
        });
    } catch(e) { console.error('Error restoring state:', e); }
}
