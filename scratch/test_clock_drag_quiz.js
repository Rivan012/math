const fs = require('fs');
const quizJs = fs.readFileSync('js/quiz.js', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

console.log('=== TEST CLOCK_DRAG QUIZ FEATURE ===');

// 1. Check questions Q001 to Q004
const hasClockDragQuestions = quizJs.includes('type: "clock_drag"') && quizJs.includes('targetHour: 5') && quizJs.includes('targetHour: 7');
console.log('1. Soal kuis Unit 1 bertipe clock_drag:', hasClockDragQuestions ? 'OK' : 'FAIL');

// 2. Check submitClockDragAnswer function
const hasSubmitFunc = quizJs.includes('function submitClockDragAnswer(question)');
console.log('2. Fungsi submitClockDragAnswer tersedia:', hasSubmitFunc ? 'OK' : 'FAIL');

// 3. Check submit button in renderAnswers says "Jawab"
const hasSubmitBtn = quizJs.includes('btn-clock-submit') && quizJs.includes('<span>Jawab</span>') && quizJs.includes('submitClockDragAnswer');
console.log('3. Tombol submit "Jawab" ringkas & jelas terpasang:', hasSubmitBtn ? 'OK' : 'FAIL');

// 4. Check CSS for clock_drag
const hasClockSubmitCss = styleCss.includes('.btn-clock-submit') && styleCss.includes('.clock-drag-answer-grid') && styleCss.includes('.btn-clock-submit.clock-correct');
console.log('4. CSS styling tombol kuis jam terpasang:', hasClockSubmitCss ? 'OK' : 'FAIL');

// 5. Check timeout handling
const hasTimeoutDrag = quizJs.includes('if (question && question.type === "clock_drag")');
console.log('5. Handler timeout untuk clock_drag terpasang:', hasTimeoutDrag ? 'OK' : 'FAIL');

// 6. Check clean clock (no spoiler readout, no step buttons during quiz)
const hasCleanClock = quizJs.includes('currentQuizClock = createClock(12, 0, 280, true, false);') &&
                      quizJs.includes('if (isInteractive && showControls)');
console.log('6. Tampilan jam kuis bersih tanpa bocoran angka digital & tombol:', hasCleanClock ? 'OK' : 'FAIL');

if (hasClockDragQuestions && hasSubmitFunc && hasSubmitBtn && hasClockSubmitCss && hasTimeoutDrag && hasCleanClock) {
  console.log('\n=== SEMUA FITUR KUIS GESER JARUM JAM VALID & BERSIH! ===');
  process.exit(0);
} else {
  console.error('Ada pengujian yang gagal!');
  process.exit(1);
}
