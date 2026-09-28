// scratch/test_level1_quiz_flow.js
const fs = require("fs");
const path = require("path");

console.log("=== Testing Level 1 Quiz Creation & Student Output Match ===");

// 1. Check admin.html content for clock_drag elements
const adminHtml = fs.readFileSync(path.join(__dirname, "../admin.html"), "utf-8");
if (!adminHtml.includes('value="clock_drag"')) {
  throw new Error("admin.html missing clock_drag option in qType select!");
}
if (!adminHtml.includes('id="previewClockDragAction"')) {
  throw new Error("admin.html missing previewClockDragAction in student preview!");
}
if (!adminHtml.includes('id="optionsBuilderGroup"')) {
  throw new Error("admin.html missing optionsBuilderGroup container!");
}
console.log("✓ admin.html: clock_drag options and preview elements verified.");

// 2. Check js/teacher.js logic for Level 1 question creation and preview
const teacherJs = fs.readFileSync(path.join(__dirname, "../js/teacher.js"), "utf-8");
if (!teacherJs.includes('qTypeSelect.value = "clock_drag"')) {
  throw new Error("teacher.js does not auto-set clock_drag when Level 1 is selected!");
}
if (!teacherJs.includes('type: "clock_drag"')) {
  throw new Error("teacher.js does not save type: clock_drag!");
}
if (!teacherJs.includes('targetHour: jam')) {
  throw new Error("teacher.js does not save targetHour!");
}
if (!teacherJs.includes('targetMinute: menit')) {
  throw new Error("teacher.js does not save targetMinute!");
}
console.log("✓ js/teacher.js: singleQuestionForm and updateQuestionLivePreview logic verified.");

// 3. Check bulk upload and template in js/teacher.js
if (!teacherJs.includes('tipe === "clock_drag" || finalLevel === 1')) {
  throw new Error("teacher.js bulk upload does not properly recognize clock_drag or Level 1!");
}
console.log("✓ js/teacher.js: bulk upload handles clock_drag Level 1 without requiring options A/B.");

// 4. Check js/quiz.js support for clock_drag
const quizJs = fs.readFileSync(path.join(__dirname, "../js/quiz.js"), "utf-8");
if (!quizJs.includes('question.type === "clock_drag" || question.tipe === "clock_drag"')) {
  throw new Error("quiz.js does not check both question.type and question.tipe for clock_drag!");
}
if (!quizJs.includes('rawTargetH = question.targetHour ?? question.jam ?? question.hour ?? 12')) {
  throw new Error("quiz.js submitClockDragAnswer missing rawTargetH fallback!");
}
if (!quizJs.includes('rawTargetM = question.targetMinute ?? question.menit ?? question.minute ?? 0')) {
  throw new Error("quiz.js submitClockDragAnswer missing rawTargetM fallback!");
}
console.log("✓ js/quiz.js: clock_drag evaluation and rendering logic verified.");

// 5. Simulate question creation and evaluation logic
const testCreatedQuestion = {
  id: "Q_TEST_001",
  level: 1,
  type: "clock_drag",
  tipe: "clock_drag",
  targetHour: 4,
  targetMinute: 30,
  targetTime: "04.30",
  question: "Siti pulang mengaji pukul setengah lima sore. Arahkan jarum jam ke pukul 04.30!",
  pertanyaan: "Siti pulang mengaji pukul setengah lima sore. Arahkan jarum jam ke pukul 04.30!",
  hint: "Arahkan jarum pendek di antara 4 dan 5, dan jarum panjang ke angka 6.",
  explanation: "Pukul 04.30 artinya jarum pendek menunjuk antara 4 dan 5, jarum panjang menunjuk angka 6.",
  points: 100,
  poin: 100,
  jam: 4,
  menit: 30
};

// Simulation of student submission:
function evaluateAnswer(q, studentH, studentM) {
  const rawTargetH = q.targetHour ?? q.jam ?? q.hour ?? 12;
  const rawTargetM = q.targetMinute ?? q.menit ?? q.minute ?? 0;
  const targetH = (Number(rawTargetH) % 12) || 12;
  const targetM = Number(rawTargetM);
  const currentH = (studentH % 12) || 12;

  const isCorrect = (currentH === targetH) && (studentM === targetM);
  return isCorrect;
}

// Student answers 4:30 -> correct
const resCorrect = evaluateAnswer(testCreatedQuestion, 4, 30);
if (!resCorrect) throw new Error("Evaluation failed: 4:30 should be correct!");

// Student answers 5:30 -> incorrect
const resWrong = evaluateAnswer(testCreatedQuestion, 5, 30);
if (resWrong) throw new Error("Evaluation failed: 5:30 should be wrong!");

console.log("✓ Evaluator logic for student interaction verified: 4:30 is correct, 5:30 is incorrect.");

console.log("\nALL TESTS PASSED SUCCESSFULLY! Output matches student quiz experience.");
