const fs = require("fs");
const path = require("path");
const assert = require("assert");

console.log("=== VERIFIKASI FITUR KUIS 1 & KUIS 2 (MAX 3X SALAH & KEYPAD INPUT) ===");

// 1. Baca kode quiz.js
let quizCode = fs.readFileSync(path.join(__dirname, "../js/quiz.js"), "utf-8");

// Mock environment DOM minimal
const elements = {};
function mockElement(id, tag = "div") {
  const el = {
    id,
    tagName: tag.toUpperCase(),
    className: "",
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); el.className = Array.from(this._classes).join(" "); },
      remove(c) { this._classes.delete(c); el.className = Array.from(this._classes).join(" "); },
      contains(c) { return this._classes.has(c); },
      toggle(c, force) {
        if (force === undefined) {
          if (this.contains(c)) this.remove(c); else this.add(c);
        } else if (force) {
          this.add(c);
        } else {
          this.remove(c);
        }
      }
    },
    style: {},
    children: [],
    appendChild(child) { this.children.push(child); return child; },
    querySelector(sel) {
      if (sel === ".slot-display-val") return el._displayVal || (el._displayVal = mockElement("", "span"));
      if (sel === "#btnClockDropSubmit" || sel === ".btn-clock-submit") return elements["btnClockDropSubmit"] || mockElement("btnClockDropSubmit", "button");
      return null;
    },
    querySelectorAll(sel) { return []; },
    remove() {},
    addEventListener(evt, fn) { this._listeners = this._listeners || {}; (this._listeners[evt] = this._listeners[evt] || []).push(fn); },
    dispatchEvent(evt) { if (this._listeners && this._listeners[evt]) this._listeners[evt].forEach(fn => fn({ preventDefault: () => {} })); },
    textContent: "",
    innerHTML: "",
    disabled: false,
    focus() {}
  };
  elements[id] = el;
  return el;
}

global.document = {
  createElement(tag) { return mockElement("", tag); },
  getElementById(id) { return elements[id] || mockElement(id); },
  querySelector(sel) {
    if (sel.startsWith("#")) return elements[sel.slice(1)] || mockElement(sel.slice(1));
    if (sel === ".btn-clock-submit") return elements["btnClockDropSubmit"] || elements["btnClockSubmit"] || mockElement("btnClockSubmit", "button");
    return mockElement("", "div");
  },
  querySelectorAll(sel) { return []; }
};
global.window = {
  addEventListener() {},
  removeEventListener() {}
};
global.$ = (id) => global.document.getElementById(id);
global.escapeHTML = (s) => s;
global.playSound = () => {};
global.showFloatingScore = () => {};

// Siapkan elemen UI kuis yang dibutuhkan
mockElement("quizCard");
mockElement("quizFeedback");
mockElement("nextQuestionBtn");
mockElement("hintBtn");
mockElement("slotHour");
mockElement("slotMinute");
mockElement("screenHourVal");
mockElement("screenMinuteVal");
mockElement("screenHourDrop");
mockElement("screenMinuteDrop");
mockElement("alarmClockChassis");
mockElement("quizPoints");
mockElement("streakBanner");
mockElement("streakCount");
mockElement("answerGrid");

// Jalankan kode quiz.js dalam context
const vm = require("vm");
const context = vm.createContext({
  ...global,
  console,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {}
});
vm.runInContext(quizCode, context);

console.log("✓ Berhasil memuat dan mengevaluasi quiz.js dalam virtual environment.");

// Helper untuk set dan get state dalam context
function setVar(name, val) {
  context.__tempVal = val;
  vm.runInContext(`${name} = __tempVal;`, context);
}
function getVar(name) {
  return vm.runInContext(name, context);
}

// =========================================================================
// TEST 1: KUIS 1 (clock_drag) - Maksimal 3x Salah
// =========================================================================
console.log("\n[TEST 1] Memvalidasi Kuis 1 (clock_drag) - Percobaan Maksimal 3x Salah:");

const q1 = {
  id: "Q001",
  level: 1,
  type: "clock_drag",
  targetHour: 7,
  targetMinute: 35,
  targetTime: "07.35"
};

// Reset state
setVar("currentQuizQuestions", [q1]);
setVar("currentQuestionIndex", 0);
setVar("quizAnswered", false);
setVar("currentWrongAttempts", 0);

// Mock clock hands: Jawaban salah 1 (05.00 != 07.35)
setVar("currentQuizClock", {
  getClockTime: () => ({ hour: 5, minute: 0 }),
  setClockTime: (h, m) => {}
});

// Percobaan Salah 1
vm.runInContext(`submitClockDragAnswer(currentQuizQuestions[0]);`, context);
assert.strictEqual(getVar("currentWrongAttempts"), 1, "Percobaan 1 salah harus menambah currentWrongAttempts ke 1");
assert.strictEqual(getVar("quizAnswered"), false, "Kuis tidak boleh selesai pada salah ke-1");
assert(elements["quizFeedback"].innerHTML.includes("2 kali lagi"), "Feedback harus menampilkan sisa 2 kesempatan lagi");
console.log("  ✓ Salah ke-1: Status kuis belum selesai, feedback sisa 2 kesempatan.");

// Percobaan Salah 2
setVar("currentQuizClock", {
  getClockTime: () => ({ hour: 6, minute: 15 }),
  setClockTime: (h, m) => {}
});
vm.runInContext(`submitClockDragAnswer(currentQuizQuestions[0]);`, context);
assert.strictEqual(getVar("currentWrongAttempts"), 2, "Percobaan 2 salah harus menambah currentWrongAttempts ke 2");
assert.strictEqual(getVar("quizAnswered"), false, "Kuis tidak boleh selesai pada salah ke-2");
assert(elements["quizFeedback"].innerHTML.includes("1 kali lagi"), "Feedback harus menampilkan sisa 1 kesempatan lagi");
console.log("  ✓ Salah ke-2: Status kuis belum selesai, feedback sisa 1 kesempatan.");

// Percobaan Salah 3 (Kesempatan Habis)
setVar("currentQuizClock", {
  getClockTime: () => ({ hour: 8, minute: 20 }),
  setClockTime: (h, m) => {}
});
vm.runInContext(`submitClockDragAnswer(currentQuizQuestions[0]);`, context);
assert.strictEqual(getVar("currentWrongAttempts"), 3, "Percobaan 3 salah harus mencatat 3 attempts");
assert.strictEqual(getVar("quizAnswered"), true, "Kuis HARUS selesai pada salah ke-3");
assert(elements["quizFeedback"].innerHTML.includes("Kesempatan Habis"), "Feedback harus menampilkan 'Kesempatan Habis'");
assert(elements["quizFeedback"].innerHTML.includes("07.35"), "Feedback harus menampilkan jawaban yang benar (07.35)");
console.log("  ✓ Salah ke-3: Kesempatan habis, jawaban benar diungkap, kuis selesai.");

// Uji coba jawaban BENAR pada kuis 1
setVar("currentQuestionIndex", 0);
setVar("quizAnswered", false);
setVar("currentWrongAttempts", 0);
setVar("currentQuizClock", {
  getClockTime: () => ({ hour: 7, minute: 35 }),
  setClockTime: (h, m) => {}
});
vm.runInContext(`submitClockDragAnswer(currentQuizQuestions[0]);`, context);
assert.strictEqual(getVar("quizAnswered"), true, "Kuis harus selesai jika jawaban benar");
assert(elements["quizFeedback"].innerHTML.includes("Posisi Jarum Tepat"), "Feedback jawaban benar harus muncul");
console.log("  ✓ Jawaban benar: Terverifikasi langsung sukses dan poin bertambah.");

// =========================================================================
// TEST 2: KUIS 2 (clock_drop) - Bukan Drag & Drop, Pakai Keypad & Max 3x Salah
// =========================================================================
console.log("\n[TEST 2] Memvalidasi Kuis 2 (clock_drop) - Pakai Keypad Input & Max 3x Salah:");

const q2 = {
  id: "Q005",
  level: 2,
  type: "clock_drop",
  targetHour: "05",
  targetMinute: "00",
  question: "Halim bangun tidur pukul 5 pagi. Pasangkan angka (jam) dan (menit) yang tepat pada jam digital!"
};

// Verifikasi renderAnswers untuk clock_drop menghasilkan time-keypad-container
elements["answerGrid"].children = [];
setVar("currentQuizQuestions", [q2]);
setVar("currentQuestionIndex", 0);
vm.runInContext(`renderAnswers(currentQuizQuestions[0]);`, context);
const hasKeypad = elements["answerGrid"].children.some(c => c.className === "time-keypad-container");
assert.strictEqual(hasKeypad, true, "renderAnswers untuk clock_drop HARUS merender time-keypad-container (bukan chips drag n drop)!");
console.log("  ✓ renderAnswers: Memastikan Kuis 2 merender time-keypad-container (Virtual Numpad/Keypad)!");

// Reset state untuk evaluasi submit
setVar("quizAnswered", false);
setVar("currentWrongAttempts", 0);

// Percobaan 1: Murid input 07:30 (Salah)
setVar("currentDroppedHour", "07");
setVar("currentDroppedMinute", "30");
vm.runInContext(`submitClockDropAnswer(currentQuizQuestions[0]);`, context);

assert.strictEqual(getVar("currentWrongAttempts"), 1, "Salah ke-1 clock_drop harus mencatat 1 attempt");
assert.strictEqual(getVar("quizAnswered"), false, "Kuis tidak boleh selesai pada salah ke-1");
assert(elements["quizFeedback"].innerHTML.includes("2 kali lagi"), "Feedback clock_drop harus menampilkan sisa 2 kesempatan lagi");
console.log("  ✓ Salah ke-1: Status kuis belum selesai, feedback sisa 2 kesempatan.");

// Percobaan 2: Murid input 06:00 (Salah)
setVar("currentDroppedHour", "06");
setVar("currentDroppedMinute", "00");
vm.runInContext(`submitClockDropAnswer(currentQuizQuestions[0]);`, context);

assert.strictEqual(getVar("currentWrongAttempts"), 2, "Salah ke-2 clock_drop harus mencatat 2 attempts");
assert.strictEqual(getVar("quizAnswered"), false, "Kuis tidak boleh selesai pada salah ke-2");
assert(elements["quizFeedback"].innerHTML.includes("1 kali lagi"), "Feedback clock_drop harus menampilkan sisa 1 kesempatan lagi");
console.log("  ✓ Salah ke-2: Status kuis belum selesai, feedback sisa 1 kesempatan.");

// Percobaan 3: Murid input 08:00 (Salah ke-3 / Kesempatan Habis)
setVar("currentDroppedHour", "08");
setVar("currentDroppedMinute", "00");
vm.runInContext(`submitClockDropAnswer(currentQuizQuestions[0]);`, context);

assert.strictEqual(getVar("currentWrongAttempts"), 3, "Salah ke-3 clock_drop harus mencatat 3 attempts");
assert.strictEqual(getVar("quizAnswered"), true, "Kuis HARUS selesai pada salah ke-3");
assert(elements["quizFeedback"].innerHTML.includes("Kesempatan Habis"), "Feedback harus menampilkan 'Kesempatan Habis'");
assert(elements["quizFeedback"].innerHTML.includes("05:00"), "Feedback harus menampilkan waktu yang benar (05:00)");
console.log("  ✓ Salah ke-3: Kesempatan habis, jawaban benar diungkap, kuis selesai.");

// Percobaan Benar: Murid input 05:00
setVar("currentQuestionIndex", 0);
setVar("quizAnswered", false);
setVar("currentWrongAttempts", 0);
setVar("currentDroppedHour", "05");
setVar("currentDroppedMinute", "00");
vm.runInContext(`submitClockDropAnswer(currentQuizQuestions[0]);`, context);

assert.strictEqual(getVar("quizAnswered"), true, "Kuis harus selesai jika jawaban benar");
assert(elements["quizFeedback"].innerHTML.includes("Hebat!"), "Feedback jawaban benar harus muncul");
console.log("  ✓ Jawaban benar: Terverifikasi langsung sukses (05:00)!");

console.log("\n========================================================");
console.log("✓ SEMUA FITUR KUIS 1 DAN KUIS 2 TERVERIFIKASI 100% SUKSES!");
console.log("========================================================");
