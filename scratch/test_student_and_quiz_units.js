const fs = require('fs');
const vm = require('vm');

console.log("=== PENGUJIAN LOGIKA SISWA & KUIS 4 UNIT ===");

const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; }
};

const domElements = {};
function mockElement(id) {
  if (!domElements[id]) {
    domElements[id] = {
      id,
      textContent: '',
      innerHTML: '',
      style: {},
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        contains(c) { return this.classes.has(c); }
      },
      appendChild(child) {},
      addEventListener(event, fn) {},
      querySelectorAll(selector) { return []; },
      querySelector(selector) { return null; },
      focus() {}
    };
  }
  return domElements[id];
}

global.document = {
  getElementById: (id) => mockElement(id),
  querySelectorAll: () => [],
  createElement: (tag) => ({
    tagName: tag,
    className: '',
    innerHTML: '',
    dataset: {},
    style: { setProperty: () => {} },
    classList: { add: () => {}, remove: () => {} },
    appendChild: () => {},
    addEventListener: () => {},
    setAttribute: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  }),
  addEventListener: () => {}
};
global.window = {
  scrollTo: () => {},
  addEventListener: () => {},
  location: { protocol: "file:" } // Treat as offline/file in node test so fetch is skipped
};
global.fetch = async (url) => ({
  ok: true,
  json: async () => ({ success: true, data: [] })
});
global.$ = (id) => mockElement(id);
global.escapeHTML = (str) => String(str || '');

// Load scripts in context
vm.runInThisContext(fs.readFileSync('js/storage.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('js/student.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('js/quiz.js', 'utf8'));

// 1. Inisialisasi data
seedInitialDataIfEmpty();

console.log("✓ STORAGE: default materials count:", getMaterials().length);
console.log("✓ STORAGE: default questions count:", getQuestions().length);
console.log("✓ LEVELS count in student.js:", LEVELS.length);
console.log("✓ LEVELS titles:", LEVELS.map(l => l.title).join(" | "));

if (LEVELS.length !== 4) throw new Error("LEVELS must have 4 units");
if (getMaterials().length !== 8) throw new Error("Materials must have 8 modules");
if (getQuestions().length !== 16) throw new Error("Questions must have 16 questions");

// 2. Test student session & rendering
currentStudent = createStudent("Rivan", "Kelas 2 SD", "budi");
saveCurrentStudent();

renderHome();
console.log("✓ renderHome() homeLevel:", mockElement("homeLevel").textContent);
if (mockElement("homeLevel").textContent !== "1 / 4") {
  throw new Error(`Expected homeLevel '1 / 4', got '${mockElement("homeLevel").textContent}'`);
}

// 3. Test openMaterial for all 4 units
for (let u = 1; u <= 4; u++) {
  openMaterial(u);
  const title = mockElement("flipbookChapterTitle").textContent;
  const badge = mockElement("flipbookPageBadge").textContent;
  console.log(`✓ openMaterial(${u}): ${title} - ${badge}`);
  if (!title.includes(`Bab ${u}`)) {
    throw new Error(`Failed to open Unit ${u}: ${title}`);
  }
}

// 4. Test startQuiz for all 4 units
for (let u = 1; u <= 4; u++) {
  startQuiz(u);
  console.log(`✓ startQuiz(${u}): Total soal = ${currentQuizQuestions.length}`);
  if (currentQuizQuestions.length !== 4) {
    throw new Error(`Unit ${u} should have 4 questions, got ${currentQuizQuestions.length}`);
  }
  const q = currentQuizQuestions[0];
  console.log(`  Soal 1 Unit ${u}: "${q.question.substring(0, 45)}..." [Tipe: ${q.type}]`);
}

console.log("\n=== SELURUH PENGUJIAN LOGIKA & KURIKULUM BERHASIL SEMPURNA ===");
stopQuestionTimer();
process.exit(0);
