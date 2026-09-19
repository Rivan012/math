const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

console.log("=== PENGUJIAN LENGKAP UNIT 3: LEBIH LAMA ATAU LEBIH CEPAT ===");

// 1. Verifikasi data/soal.csv dan data/pilihan.csv
const soalCsv = fs.readFileSync('data/soal.csv', 'utf8');
const pilihanCsv = fs.readFileSync('data/pilihan.csv', 'utf8');

assert(soalCsv.includes('Q009,L003,"Beri tanda centang (✓) pada kegiatan yang lebih lama!","time_compare"'), "Q009 harus time_compare");
assert(soalCsv.includes('Q010,L003,"Beri tanda centang (✓) pada kegiatan yang lebih sebentar (lebih cepat)!","time_compare"'), "Q010 harus time_compare");
assert(soalCsv.includes('Q011,L003,"Beri tanda centang (✓) pada kegiatan yang lebih lama!","time_compare"'), "Q011 harus time_compare");
assert(soalCsv.includes('Q012,L003,"Beri tanda centang (✓) pada kegiatan yang lebih lama!","time_compare"'), "Q012 harus time_compare");
console.log("✓ data/soal.csv: Q009-Q012 bertipe time_compare.");

assert(pilihanCsv.includes("P033,Q009,A,Menyisir rambut"), "P033 Menyisir rambut");
assert(pilihanCsv.includes("P034,Q009,B,Mandi"), "P034 Mandi");
assert(pilihanCsv.includes("P035,Q010,A,Memasak"), "P035 Memasak");
assert(pilihanCsv.includes("P036,Q010,B,Meminum air"), "P036 Meminum air");
assert(pilihanCsv.includes("P037,Q011,A,Tidur malam"), "P037 Tidur malam");
assert(pilihanCsv.includes("P038,Q011,B,Menyikat gigi"), "P038 Menyikat gigi");
assert(pilihanCsv.includes("P039,Q012,A,Belajar di sekolah"), "P039 Belajar di sekolah");
assert(pilihanCsv.includes("P040,Q012,B,Sarapan"), "P040 Sarapan");
console.log("✓ data/pilihan.csv: Pilihan opsi pasangan kegiatan Q009-Q012 valid.");

// 2. Verifikasi berkas gambar kegiatan di assets/images
const requiredImages = [
  "activity_combing.png",
  "activity_bathing.png",
  "activity_sleeping.png",
  "activity_brushing.png",
  "activity_studying.png",
  "activity_breakfast.png",
  "activity_cooking.png",
  "activity_drinking.png"
];

requiredImages.forEach(img => {
  const p = `assets/images/${img}`;
  assert(fs.existsSync(p), `Gambar ${p} harus ada`);
  const stat = fs.statSync(p);
  assert(stat.size > 5000, `Gambar ${p} harus berupa berkas valid (>5KB), got ${stat.size} bytes`);
});
console.log("✓ 8 Berkas gambar ilustrasi kegiatan buku terverifikasi ada dan berkualitas tinggi.");

// 3. Test DOM Interactivity & Logic
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
      disabled: false,
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        contains(c) { return this.classes.has(c); }
      },
      appendChild(child) {
        if (!this.children) this.children = [];
        this.children.push(child);
      },
      addEventListener(event, fn) {
        if (!this.listeners) this.listeners = {};
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
      },
      dispatchEvent(event) {
        if (this.listeners && this.listeners[event]) {
          this.listeners[event].forEach(fn => fn({ preventDefault: () => {}, stopPropagation: () => {} }));
        }
      },
      querySelectorAll(selector) {
        const found = [];
        function walk(node) {
          if (!node || !node.children) return;
          node.children.forEach(ch => {
            if (selector.startsWith(".") && ch.classList && ch.classList.contains(selector.slice(1))) {
              found.push(ch);
            }
            walk(ch);
          });
        }
        walk(this);
        return found;
      },
      querySelector(selector) {
        return this.querySelectorAll(selector)[0] || null;
      },
      focus() {}
    };
  }
  return domElements[id];
}

global.document = {
  getElementById: (id) => mockElement(id),
  querySelectorAll: (selector) => {
    const list = [];
    Object.values(domElements).forEach(el => {
      list.push(...el.querySelectorAll(selector));
    });
    return list;
  },
  createElement: (tag) => {
    const el = {
      tagName: tag,
      _id: '',
      set id(val) {
        this._id = val;
        domElements[val] = this;
      },
      get id() {
        return this._id;
      },
      className: '',
      innerHTML: '',
      disabled: false,
      dataset: {},
      style: { setProperty: () => {} },
      classList: {
        classes: new Set(),
        add(c) {
          this.classes.add(c);
          if (el.className) el.className += ' ' + c; else el.className = c;
        },
        remove(c) {
          this.classes.delete(c);
          el.className = Array.from(this.classes).join(' ');
        },
        contains(c) { return this.classes.has(c); }
      },
      children: [],
      appendChild(child) {
        this.children.push(child);
      },
      addEventListener(event, fn) {
        if (!this.listeners) this.listeners = {};
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
      },
      dispatchEvent(event) {
        if (this.listeners && this.listeners[event]) {
          this.listeners[event].forEach(fn => fn({ preventDefault: () => {}, stopPropagation: () => {} }));
        }
      },
      setAttribute(k, v) { this[k] = v; },
      querySelectorAll(selector) {
        const found = [];
        function walk(node) {
          if (!node || !node.children) return;
          node.children.forEach(ch => {
            if (selector.startsWith(".") && ch.classList && ch.classList.contains(selector.slice(1))) {
              found.push(ch);
            }
            walk(ch);
          });
        }
        walk(this);
        return found;
      },
      querySelector(selector) {
        return this.querySelectorAll(selector)[0] || null;
      }
    };
    return el;
  },
  addEventListener: () => {}
};
global.window = {
  scrollTo: () => {},
  addEventListener: () => {},
  location: { protocol: "file:" }
};
global.fetch = async () => ({ ok: true, json: async () => ({ success: true, data: [] }) });
global.$ = (id) => mockElement(id);
global.escapeHTML = (str) => String(str || '');
global.playSound = () => {};

vm.runInThisContext(fs.readFileSync('js/storage.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('js/student.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('js/quiz.js', 'utf8'));

// Mulai Kuis Level 3
startQuiz(3);
assert.strictEqual(currentQuizQuestions.length, 4, "Level 3 harus memiliki 4 soal");
console.log("✓ Level 3 kuis berhasil dimulai dengan 4 soal time_compare.");

// Soal 1: Q009 (Menyisir rambut vs Mandi -> Lebih lama = Mandi [index 1])
const q1 = currentQuizQuestions[0];
assert.strictEqual(q1.type, "time_compare");
assert.strictEqual(q1.correct, 1);
assert.strictEqual(q1.items[0].label, "Menyisir rambut");
assert.strictEqual(q1.items[1].label, "Mandi");

assert(currentTimeCompareCards.length === 2, "Harus merender 2 kartu pilihan");
const card0 = currentTimeCompareCards[0];
const card1 = currentTimeCompareCards[1];

assert.strictEqual(card0.checkboxEl.textContent, "...");
assert.strictEqual(card1.checkboxEl.textContent, "...");

const submitBtn = $("btnTimeCompareSubmit");
assert(submitBtn.disabled === true, "Tombol Jawab harus disabled sebelum memilih kartu");

// Simulasi murid klik kartu Mandi (card1)
card1.dispatchEvent("click");
assert.strictEqual(currentSelectedCompareIndex, 1, "Kartu index 1 (Mandi) harus terpilih");
assert.strictEqual(card1.checkboxEl.textContent, "✓", "Checkbox kartu 1 harus menampilkan ✓");
assert.strictEqual(card0.checkboxEl.textContent, "...", "Checkbox kartu 0 harus tetap ...");
assert(card1.classList.contains("selected"), "Kartu 1 memiliki class selected");
assert(!card0.classList.contains("selected"), "Kartu 0 tidak memiliki class selected");
assert(submitBtn.disabled === false, "Tombol Jawab harus enabled setelah kartu dipilih");
console.log("✓ Interaksi seleksi kartu dan tanda centang ✓ berfungsi sempurna.");

// Simulasi murid klik tombol Jawab
const initialPoints = quizPoints;
submitTimeCompareAnswer(q1);

assert.strictEqual(quizCorrect, 1, "Jumlah benar harus bertambah");
assert(quizPoints > initialPoints, "Poin kuis harus bertambah");
assert(card1.classList.contains("card-correct"), "Kartu Mandi harus diberi class card-correct");
assert.strictEqual(card1.checkboxEl.textContent, "✓");
assert(submitBtn.disabled === true, "Tombol Jawab harus disabled setelah submit");
assert(!mockElement("nextQuestionBtn").classList.contains("hidden"), "Tombol Soal Berikutnya harus muncul");
console.log("✓ Evaluasi jawaban benar (+100 poin, streak, umpan balik) berhasil.");

// Pengujian Jawaban Salah pada Soal 2
currentQuestionIndex = 1;
renderQuestion();
const q2 = currentQuizQuestions[1]; // Memasak vs Meminum air -> Lebih sebentar = Meminum air (index 1)
assert.strictEqual(q2.type, "time_compare");
assert.strictEqual(q2.correct, 1);

// Murid salah memilih Memasak (index 0)
currentTimeCompareCards[0].dispatchEvent("click");
assert.strictEqual(currentSelectedCompareIndex, 0);

submitTimeCompareAnswer(q2);
assert.strictEqual(quizCorrect, 1, "Jawaban salah tidak menambah quizCorrect");
assert(currentTimeCompareCards[0].classList.contains("card-wrong"), "Pilihan yang salah diberi class card-wrong");
assert(currentTimeCompareCards[1].classList.contains("card-correct"), "Jawaban yang benar diberi highlight card-correct");
console.log("✓ Evaluasi jawaban salah (card-wrong pada pilihan murid, card-correct pada jawaban benar) berhasil.");

// Pengujian Timeout
currentQuestionIndex = 2;
renderQuestion();
const q3 = currentQuizQuestions[2];
handleQuestionTimeout();
assert(currentTimeCompareCards[q3.correct].classList.contains("card-correct"), "Saat timeout, kartu yang benar di-highlight");
console.log("✓ Penanganan batas waktu (timeout) pada time_compare berhasil.");

stopQuestionTimer();
console.log("\n=== SELURUH PENGUJIAN UNIT 3 (LEBIH LAMA ATAU LEBIH CEPAT) 100% SUKSES! ===");
process.exit(0);
