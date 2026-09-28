const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- TESTING RESULT SCREEN, LEADERBOARD & NEED STUDY MODAL STYLES ---');

const cssContent = fs.readFileSync(path.join(__dirname, '../css/style.css'), 'utf8');
const responsiveContent = fs.readFileSync(path.join(__dirname, '../css/responsive.css'), 'utf8');
const siswaHtml = fs.readFileSync(path.join(__dirname, '../siswa.html'), 'utf8');
const quizJs = fs.readFileSync(path.join(__dirname, '../js/quiz.js'), 'utf8');

// 1. Check required CSS classes in style.css
const requiredClasses = [
  '#resultScreen',
  '.result-hero-card',
  '.result-badge-top',
  '.result-heading',
  '.result-score-box',
  '.result-score-value',
  '.result-score-value.score-high',
  '.result-score-value.score-med',
  '.result-score-value.score-low',
  '.score-caption',
  '.result-stars',
  '.result-star',
  '.result-stats-grid',
  '.result-stat-card',
  '.stat-card-title',
  '.result-feedback-card',
  '.result-cta-row',
  '#leaderboardScreen',
  '.leaderboard-hero',
  '.podium-layout',
  '.podium-card',
  '.podium-card.first',
  '.podium-rank-tag',
  '.podium-avatar',
  '.podium-name',
  '.podium-points',
  '.leaderboard-table-card',
  '.rank-table',
  '.table-scroll-container',
  '.need-study-modal-card',
  '.need-study-top',
  '.need-study-icon-wrap',
  '.need-study-heading',
  '.need-study-desc',
  '.need-study-footer',
  '.nav-back-row',
  '.center'
];

requiredClasses.forEach(cls => {
  assert(cssContent.includes(cls), `Missing CSS class/id: ${cls}`);
  console.log(`[PASS] Found in style.css: ${cls}`);
});

// 2. Check mobile responsiveness
assert(responsiveContent.includes('#resultScreen'), 'Missing #resultScreen in responsive.css');
assert(responsiveContent.includes('.result-score-box'), 'Missing .result-score-box in responsive.css');
assert(responsiveContent.includes('.podium-layout'), 'Missing .podium-layout in responsive.css');
console.log('[PASS] Responsive rules verified in responsive.css');

// 3. Check siswa.html has proper markup & buttons
assert(siswaHtml.includes('id="resultScreen"'), 'Missing id="resultScreen" in siswa.html');
assert(siswaHtml.includes('resultHomeBtn'), 'Missing resultHomeBtn in siswa.html');
assert(siswaHtml.includes('resultLeaderboardBtn'), 'Missing resultLeaderboardBtn in siswa.html');
assert(siswaHtml.includes('retryQuizBtn'), 'Missing retryQuizBtn in siswa.html');
assert(siswaHtml.includes('id="leaderboardScreen"'), 'Missing id="leaderboardScreen" in siswa.html');
assert(siswaHtml.includes('leaderboardBackBtn'), 'Missing leaderboardBackBtn in siswa.html');
assert(siswaHtml.includes('needStudyModal'), 'Missing needStudyModal in siswa.html');
console.log('[PASS] siswa.html has all required IDs and structures');

// 4. Check quiz.js renderResult
assert(quizJs.includes('score-high') && quizJs.includes('score-low'), 'quiz.js should assign score classes');
console.log('[PASS] quiz.js renderResult handles dynamic classes properly');

console.log('--- ALL TESTS PASSED SUCCESSFULLY! ---');
