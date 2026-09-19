const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

console.log("=== PENGUJIAN RESTORASI UNIT 1 & PENERAPAN DRAG & DROP KE MATERI 2 ===");

// 1. Verifikasi data/soal.csv
const soalCsv = fs.readFileSync(path.join(__dirname, "..", "data", "soal.csv"), "utf8");
assert(soalCsv.includes('Q001,L001,"Halim bangun tidur') && soalCsv.includes('"clock"'), "Q001 harus tipe clock");
assert(soalCsv.includes('Q004,L001,"Kira bersiap') && soalCsv.includes('"clock"'), "Q004 harus tipe clock");
assert(soalCsv.includes('Q005,L002,"Halim bangun tidur') && soalCsv.includes('"clock_drop"'), "Q005 harus tipe clock_drop");
assert(soalCsv.includes('Q008,L002,"Belajar malam') && soalCsv.includes('"clock_drop"'), "Q008 harus tipe clock_drop");
console.log("✓ data/soal.csv: Unit 1 bertipe clock (MCQ), Unit 2 bertipe clock_drop (Jam Digital).");

// 2. Verifikasi data/pilihan.csv
const pilihanCsv = fs.readFileSync(path.join(__dirname, "..", "data", "pilihan.csv"), "utf8");
assert(pilihanCsv.includes("P001,Q001,A,Pukul 05.00"), "P001 harus Pukul 05.00");
assert(pilihanCsv.includes("P017,Q005,A,05:00"), "P017 harus 05:00");
assert(pilihanCsv.includes("P030,Q008,B,09:30"), "P030 harus 09:30");
console.log("✓ data/pilihan.csv: Pilihan opsi sinkron dengan soal.");

// 3. Verifikasi storage.js dan quiz.js
const storageJs = fs.readFileSync(path.join(__dirname, "..", "js", "storage.js"), "utf8");
assert(storageJs.includes('"2.7"'), "Versi kurikulum harus 2.7");
const quizJs = fs.readFileSync(path.join(__dirname, "..", "js", "quiz.js"), "utf8");
assert(quizJs.includes('type: "clock"'), "Unit 1 bertipe clock di quiz.js");
assert(quizJs.includes('type: "clock_drop"'), "Unit 2 bertipe clock_drop di quiz.js");
console.log("✓ storage.js & quiz.js: Versi 2.7 dan konfigurasi soal terverifikasi.");

// 4. Simulasi Runtime
const elements = {};
function createElement(tag) {
  const el = {
    tagName: tag.toUpperCase(),
    className: "",
    style: { setProperty: () => {} },
    dataset: {},
    children: [],
    attributes: {},
    appendChild: (child) => { el.children.push(child); return child; },
    addEventListener: () => {},
    removeEventListener: () => {},
    setAttribute: (k, v) => { el.attributes[k] = v; },
    removeAttribute: (k) => { delete el.attributes[k]; },
    classList: {
      _classes: new Set(),
      add: (...cls) => cls.forEach(c => el.classList._classes.add(c)),
      remove: (...cls) => cls.forEach(c => el.classList._classes.delete(c)),
      contains: (c) => el.classList._classes.has(c)
    },
    querySelector: () => createElement("button"),
    querySelectorAll: () => [createElement("div"), createElement("button")],
    cloneNode: () => createElement(tag),
    remove: () => {},
    focus: () => {}
  };
  Object.defineProperty(el, "innerHTML", { get: () => el._html || "", set: (v) => { el._html = v; } });
  Object.defineProperty(el, "textContent", { get: () => el._text || "", set: (v) => { el._text = v; } });
  return el;
}

const mockDoc = {
  getElementById: (id) => elements[id] || (elements[id] = createElement("div")),
  createElement: createElement,
  querySelectorAll: () => [createElement("div"), createElement("div")],
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

// Test Level 1 (MCQ Jam Analog)
const resL1 = vm.runInContext(`
  startQuiz(1);
  const q1 = currentQuizQuestions[0];
  const btn = document.createElement("button");
  selectAnswer(0, btn, q1);
  ({ qType: q1.type, correct: quizCorrect, answered: quizAnswered })
`, context);

console.log("Level 1 Q1:", resL1.qType, "Correct:", resL1.correct);
assert.strictEqual(resL1.qType, "clock", "Level 1 harus tipe clock (MCQ)");
assert.strictEqual(resL1.correct, 1, "Jawaban Level 1 harus benar");
console.log("✓ Simulasi Level 1 (Mengenal Jam Analog - MCQ) berhasil.");

// Test Level 2 (Drag & Drop Jam Digital)
const resL2 = vm.runInContext(`
  startQuiz(2);
  const q2 = currentQuizQuestions[0];
  placeAnswerInSlot("05:00", q2, 0);
  submitClockDropAnswer(q2);
  ({ qType: q2.type, correct: quizCorrect, answered: quizAnswered, dropped: currentDroppedAnswer })
`, context);

console.log("Level 2 Q1:", resL2.qType, "Correct:", resL2.correct, "Dropped:", resL2.dropped);
assert.strictEqual(resL2.qType, "clock_drop", "Level 2 harus tipe clock_drop");
assert.strictEqual(resL2.dropped, "05:00", "Kartu 05:00 harus terpasang di drop zone");
console.log("✓ Simulasi Level 2 (Mengenal Jam Digital - Drag & Drop) berhasil.");

console.log("\n SEMUA PENGUJIAN RESTORASI & PENERAPAN BERHASIL!");
