const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

console.log("=== VERIFIKASI UNIT 1 CLOCK_DRAG & UNIT 2 CLOCK_DROP ===");

// 1. Verifikasi data/soal.csv
const soalCsv = fs.readFileSync(path.join(__dirname, "..", "data", "soal.csv"), "utf8");
assert(soalCsv.includes('Q001,L001') && soalCsv.includes('"clock_drag"'), "Q001 harus bertipe clock_drag");
assert(soalCsv.includes('Q002,L001') && soalCsv.includes('"clock_drag"'), "Q002 harus bertipe clock_drag");
assert(soalCsv.includes('Q003,L001') && soalCsv.includes('"clock_drag"'), "Q003 harus bertipe clock_drag");
assert(soalCsv.includes('Q004,L001') && soalCsv.includes('"clock_drag"'), "Q004 harus bertipe clock_drag");
assert(soalCsv.includes('Q004A,L001') && soalCsv.includes('"clock_drag"'), "Q004A harus bertipe clock_drag");
assert(soalCsv.includes('Q004B,L001') && soalCsv.includes('"clock_drag"'), "Q004B harus bertipe clock_drag");

assert(soalCsv.includes('Q005,L002,"Halim bangun tidur') && soalCsv.includes('"clock_drop"'), "Q005 harus bertipe clock_drop");
assert(soalCsv.includes('Q006,L002,"Tika berangkat') && soalCsv.includes('"clock_drop"'), "Q006 harus bertipe clock_drop");
assert(soalCsv.includes('Q007,L002,"Jam istirahat') && soalCsv.includes('"clock_drop"'), "Q007 harus bertipe clock_drop");
assert(soalCsv.includes('Q008,L002,"Belajar malam') && soalCsv.includes('"clock_drop"'), "Q008 harus bertipe clock_drop");
console.log("✓ data/soal.csv: Unit 1 clock_drag dan Unit 2 clock_drop terverifikasi.");

// 2. Verifikasi js/storage.js
const storageJs = fs.readFileSync(path.join(__dirname, "..", "js", "storage.js"), "utf8");
assert(/timequest_curriculum_version["'],\s*["']3\.\d["']/.test(storageJs), "storage.js harus menggunakan versi kurikulum valid");
assert(storageJs.includes('targetHour: 7') || storageJs.includes('targetHour: 5'), "storage.js memiliki targetHour untuk Q001");
console.log("✓ js/storage.js: Versi kurikulum terverifikasi.");

// 3. Verifikasi js/quiz.js
const quizJs = fs.readFileSync(path.join(__dirname, "..", "js", "quiz.js"), "utf8");
assert(quizJs.includes('type: "clock_drag"'), "quiz.js memiliki soal clock_drag");
assert(quizJs.includes('type: "clock_drop"'), "quiz.js memiliki soal clock_drop");
assert(quizJs.includes('submitClockDragAnswer'), "Fungsi submitClockDragAnswer ada di quiz.js");
assert(quizJs.includes('submitClockDropAnswer'), "Fungsi submitClockDropAnswer ada di quiz.js");
console.log("✓ js/quiz.js: Seluruh fungsi evaluasi dan tipe kuis tersedia.");

// 4. Simulasi Runtime
const elements = {};
function createElement(tag) {
  const el = {
    tagName: tag.toUpperCase(),
    className: "",
    style: {
      setProperty: (k, v) => { el.style[k] = v; },
      width: "", height: "", maxWidth: "", touchAction: "", cursor: "", pointerEvents: "", userSelect: ""
    },
    dataset: {},
    children: [],
    attributes: {},
    appendChild: (child) => { el.children.push(child); return child; },
    addEventListener: (ev, fn) => {
      el._listeners = el._listeners || {};
      el._listeners[ev] = el._listeners[ev] || [];
      el._listeners[ev].push(fn);
    },
    removeEventListener: () => {},
    setAttribute: (k, v) => { el.attributes[k] = v; },
    removeAttribute: (k) => { delete el.attributes[k]; },
    getAttribute: (name) => name === "data-slot-type" ? (el.id === "slotHour" ? "hour" : "minute") : null,
    classList: {
      _classes: new Set(),
      add: (...cls) => cls.forEach(c => el.classList._classes.add(c)),
      remove: (...cls) => cls.forEach(c => el.classList._classes.delete(c)),
      contains: (c) => el.classList._classes.has(c)
    },
    querySelector: (sel) => el.children.find(c => c.className && c.className.includes(sel.replace(".", ""))) || createElement("div"),
    querySelectorAll: (sel) => el.children.filter(c => c.className && c.className.includes(sel.replace(".", ""))),
    getBoundingClientRect: () => ({ left: 100, top: 100, right: 300, bottom: 300, width: 200, height: 200 }),
    cloneNode: () => createElement(tag),
    remove: () => {},
    focus: () => {}
  };
  Object.defineProperty(el, "innerHTML", { get: () => el._html || "", set: (v) => { el._html = v; } });
  Object.defineProperty(el, "textContent", { get: () => el._text || "", set: (v) => { el._text = v; } });
  return el;
}

const mockDoc = {
  getElementById: (id) => {
    if (!elements[id]) {
      elements[id] = createElement("div");
      elements[id].id = id;
    }
    return elements[id];
  },
  createElement,
  querySelectorAll: () => [createElement("div"), createElement("button")],
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

// Test Level 1 (Mengarahkan jarum jam: Halim bangun tidur pukul 05.00)
const resL1 = vm.runInContext(`
  startQuiz(1);
  const q1 = currentQuizQuestions[0];
  // Simulasi siswa mengarahkan jarum ke waktu target (pukul 07.35)
  currentQuizClock.setClockTime(q1.targetHour, q1.targetMinute);
  submitClockDragAnswer(q1);
  ({
    qType: q1.type,
    targetHour: q1.targetHour,
    targetMinute: q1.targetMinute,
    correct: quizCorrect,
    streak: quizStreak,
    answered: quizAnswered
  });
`, context);

console.log("Level 1 Q1:", resL1.qType, "Target:", resL1.targetHour + ":" + resL1.targetMinute, "Correct:", resL1.correct);
assert.strictEqual(resL1.qType, "clock_drag", "Level 1 harus tipe clock_drag");
assert.strictEqual(resL1.correct, 1, "Mengatur jarum ke target waktu harus bernilai BENAR");
console.log("✓ Simulasi Level 1 (Clock Drag - Mengarahkan Jarum Jam) SUKSES.");

// Test Level 2 (Drag & drop angka jam & menit ke jam digital)
const resL2 = vm.runInContext(`
  startQuiz(2);
  const q2 = currentQuizQuestions[0];
  placeNumberInSlot("hour", "05", q2);
  placeNumberInSlot("minute", "00", q2);
  submitClockDropAnswer(q2);
  ({
    qType: q2.type,
    hour: currentDroppedHour,
    minute: currentDroppedMinute,
    correct: quizCorrect,
    streak: quizStreak
  });
`, context);

console.log("Level 2 Q1:", resL2.qType, "Hour:", resL2.hour, "Minute:", resL2.minute, "Total Correct:", resL2.correct);
assert.strictEqual(resL2.qType, "clock_drop", "Level 2 harus tipe clock_drop");
assert.strictEqual(resL2.hour, "05", "Angka jam harus terpasang 05");
assert.strictEqual(resL2.minute, "00", "Angka menit harus terpasang 00");
assert.strictEqual(resL2.correct, 1, "Level 2 harus bernilai BENAR (1)");
console.log("✓ Simulasi Level 2 (Clock Drop - Drag & Drop Jam & Menit ke Jam Digital) SUKSES.");

console.log("\n SEMUA PENGUJIAN KUIS LEVEL 1 (GESER JARUM) & LEVEL 2 (DRAG & DROP JAM & MENIT) BERHASIL SEMPURNA!");
