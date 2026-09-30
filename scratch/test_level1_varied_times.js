const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

console.log("=== PENGUJIAN 6 SOAL LEVEL 1 DENGAN VARIASI WAKTU ===");

const quizJs = fs.readFileSync('js/quiz.js', 'utf8');
const storageJs = fs.readFileSync('js/storage.js', 'utf8');
const soalCsv = fs.readFileSync('data/soal.csv', 'utf8');

// 1. Verifikasi data/soal.csv memuat 6 variasi waktu
const expectedTimes = ["07.35", "12.00", "01.45", "08.00", "04.30", "11.20"];
for (const t of expectedTimes) {
  assert(soalCsv.includes(`"${t}"`), `soal.csv harus memuat target waktu ${t}`);
}
console.log("✓ data/soal.csv: Semua 6 variasi waktu terverifikasi.");

// 2. Mock environment untuk quiz.js
function createElement(tag) {
  return {
    tagName: tag.toUpperCase(),
    style: {
      setProperty: () => {},
      getPropertyValue: () => ""
    },
    classList: {
      classes: new Set(),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); },
      toggle(c) { if (this.classes.has(c)) this.classes.delete(c); else this.classes.add(c); },
      contains(c) { return this.classes.has(c); }
    },
    children: [],
    appendChild(child) { this.children.push(child); return child; },
    removeChild(child) { this.children = this.children.filter(c => c !== child); },
    remove() {},
    focus() {},
    blur() {},
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    getAttribute() { return null; },
    querySelector() { return createElement("div"); },
    querySelectorAll() { return []; }
  };
}

const elements = {};
const mockDoc = {
  getElementById: (id) => {
    if (!elements[id]) {
      elements[id] = createElement("div");
      elements[id].id = id;
    }
    return elements[id];
  },
  createElement,
  querySelectorAll: () => [],
  querySelector: () => createElement("button"),
  body: createElement("body")
};

const context = {
  document: mockDoc,
  window: { addEventListener: () => {}, removeEventListener: () => {} },
  $: (id) => mockDoc.getElementById(id),
  escapeHTML: (str) => String(str || ""),
  showToast: () => {},
  playSound: () => {},
  showStudentPage: () => {},
  console: console,
  setInterval: () => 123,
  clearInterval: () => {},
  setTimeout: (fn) => fn()
};

vm.createContext(context);
vm.runInContext(quizJs, context);

// Jalankan kuis level 1 dan uji ke-6 soal
const testResults = vm.runInContext(`
  startQuiz(1);
  const results = [];
  const qList = [...currentQuizQuestions];
  for (let i = 0; i < qList.length; i++) {
    const q = qList[i];
    // Siswa memutar jam ke waktu target
    isAnswerSubmitted = false;
    quizAnswered = false;
    currentQuizClock.setClockTime(q.targetHour, q.targetMinute);
    const timeBefore = currentQuizClock.getClockTime();
    console.log("Checking question:", q.id, "target:", q.targetHour, q.targetMinute, "clock set to:", timeBefore);
    const scoreBefore = quizCorrect;
    submitClockDragAnswer(q);
    const correct = (quizCorrect === scoreBefore + 1);
    console.log("Result:", correct, "scoreBefore:", scoreBefore, "quizCorrect:", quizCorrect);
    results.push({
      id: q.id,
      targetH: q.targetHour,
      targetM: q.targetMinute,
      correct
    });
  }
  results;
`, context);

console.log("Hasil simulasi 6 soal Level 1:", testResults);
assert.strictEqual(testResults.length, 6, "Harus ada 6 soal di Level 1");
for (const r of testResults) {
  assert(r.correct, `Soal ${r.id} (target: ${r.targetH}:${r.targetM}) harus benar saat diarahkan tepat`);
}

console.log("=== SEMUA 6 SOAL LEVEL 1 LOLOS VALIDASI & EVALUASI 100%! ===");
