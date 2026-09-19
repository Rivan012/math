const fs = require('fs');
const path = require('path');

console.log("--- Starting Flipbook & Quizizz Verification ---");

const htmlPath = path.join(__dirname, '..', 'siswa.html');
const cssPath = path.join(__dirname, '..', 'css', 'style.css');
const responsivePath = path.join(__dirname, '..', 'css', 'responsive.css');
const studentJsPath = path.join(__dirname, '..', 'js', 'student.js');
const quizJsPath = path.join(__dirname, '..', 'js', 'quiz.js');
const appJsPath = path.join(__dirname, '..', 'js', 'app.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const responsive = fs.readFileSync(responsivePath, 'utf8');
const studentJs = fs.readFileSync(studentJsPath, 'utf8');
const quizJs = fs.readFileSync(quizJsPath, 'utf8');
const appJs = fs.readFileSync(appJsPath, 'utf8');

// 1. Check HTML elements
const requiredHtmlIds = [
  'flipbookContainer',
  'flipbookPageBadge',
  'flipbookChapterTitle',
  'flipbookProgressPercent',
  'flipbookProgressFill',
  'flipbookBook',
  'flipbookPageContent',
  'prevPageBtn',
  'nextPageBtn',
  'flipbookDots',
  'quizStreakBanner',
  'quizStreakCount',
  'quizCard',
  'floatingScoreContainer',
  'quizTimerBar',
  'quizTimerText',
  'answerGrid'
];

for (const id of requiredHtmlIds) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`FAIL: Missing ID in siswa.html: ${id}`);
    process.exit(1);
  }
}
console.log(`PASS: All ${requiredHtmlIds.length} required HTML IDs found.`);

// 2. Check CSS classes
const requiredCssClasses = [
  '.flipbook-container',
  '.flipbook-book',
  '.flipbook-page-sheet',
  '.anim-flip-in',
  '.reader-clock-card',
  '.flipbook-dots',
  '.flipbook-dot.active',
  '.reader-completion-box',
  '.quiz-streak-badge',
  '.streak-dot-glow',
  '.floating-score-container',
  '.floating-score-tag',
  '.quiz-timer-track',
  '.quiz-timer-bar',
  '.quizizz-answer-grid',
  '.ans-red',
  '.ans-blue',
  '.ans-amber',
  '.ans-green',
  '.selected-correct',
  '.anim-quiz-shake',
  '.quiz-feedback-quizizz'
];

for (const cls of requiredCssClasses) {
  if (!css.includes(cls)) {
    console.error(`FAIL: Missing CSS class in style.css: ${cls}`);
    process.exit(1);
  }
}
console.log(`PASS: All ${requiredCssClasses.length} required CSS classes found in style.css.`);

// 3. Check Web Audio sounds in app.js
const requiredSounds = ['pageTurn', 'streak', 'tick', 'timeUp', 'correct', 'wrong'];
for (const s of requiredSounds) {
  if (!appJs.includes(`"${s}"`)) {
    console.error(`FAIL: Missing sound in app.js: ${s}`);
    process.exit(1);
  }
}
console.log(`PASS: All synthesized sound types present in app.js.`);

// 4. Check Flipbook function signatures in student.js
const requiredStudentFns = ['openMaterial', 'renderFlipbook', 'flipToPage', 'initStudentEvents'];
for (const fn of requiredStudentFns) {
  if (!studentJs.includes(`function ${fn}`)) {
    console.error(`FAIL: Missing function in student.js: ${fn}`);
    process.exit(1);
  }
}
console.log(`PASS: All Flipbook functions present in student.js.`);

// 5. Check Quizizz function signatures in quiz.js
const requiredQuizFns = ['startQuestionTimer', 'stopQuestionTimer', 'handleQuestionTimeout', 'updateStreakBanner', 'showFloatingScore', 'renderAnswers'];
for (const fn of requiredQuizFns) {
  if (!quizJs.includes(`function ${fn}`)) {
    console.error(`FAIL: Missing function in quiz.js: ${fn}`);
    process.exit(1);
  }
}
console.log(`PASS: All Quizizz functions present in quiz.js.`);

// 6. Check responsive rules
if (!responsive.includes('.quizizz-answer-grid') || !responsive.includes('.flipbook-page-sheet')) {
  console.error('FAIL: Missing responsive rules for Quizizz or Flipbook in responsive.css');
  process.exit(1);
}
console.log('PASS: Responsive mobile overrides present in responsive.css.');

console.log("\nALL STATIC VERIFICATION TESTS PASSED SUCCESSFULLY! ✅");
