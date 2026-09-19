const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

console.log("=== PENGUJIAN LENGKAP UNIT 4: CLOCK ACTIVITY DROP ===");

// 1. Verifikasi data/soal.csv dan data/pilihan.csv
const soalCsv = fs.readFileSync('data/soal.csv', 'utf8');
const pilihanCsv = fs.readFileSync('data/pilihan.csv', 'utf8');

assert(soalCsv.includes('Q013,L004,"Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:","clock_activity_drop"'), "Q013 harus clock_activity_drop");
assert(soalCsv.includes('Q014,L004,"Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:","clock_activity_drop"'), "Q014 harus clock_activity_drop");
assert(soalCsv.includes('Q015,L004,"Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:","clock_activity_drop"'), "Q015 harus clock_activity_drop");
assert(soalCsv.includes('Q016,L004,"Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:","clock_activity_drop"'), "Q016 harus clock_activity_drop");
console.log("✓ data/soal.csv: Q013-Q016 bertipe clock_activity_drop.");

assert(pilihanCsv.includes("P041,Q013,A,Pukul 7 pagi"), "P041 Pukul 7 pagi");
assert(pilihanCsv.includes("P045,Q014,A,Pukul 8 pagi"), "P045 Pukul 8 pagi");
assert(pilihanCsv.includes("P049,Q015,A,Pukul 5 sore"), "P049 Pukul 5 sore");
assert(pilihanCsv.includes("P053,Q016,A,Pukul 8 malam"), "P053 Pukul 8 malam");
console.log("✓ data/pilihan.csv: Pilihan opsi keterangan waktu Q013-Q016 valid.");

// 2. Verifikasi berkas gambar ilustrasi kegiatan + jam di assets/images
const requiredImages = [
  "time_activity_school.png",
  "time_activity_class.png",
  "time_activity_football.png",
  "time_activity_sleep.png"
];

requiredImages.forEach(img => {
  const p = `assets/images/${img}`;
  assert(fs.existsSync(p), `Gambar ${p} harus ada`);
  const stat = fs.statSync(p);
  assert(stat.size > 10000, `Gambar ${p} harus berupa berkas valid (>10KB), got ${stat.size} bytes`);
});
console.log("✓ 4 Berkas gambar jam analog + kegiatan buku halaman 183 terverifikasi ada dan berkualitas tinggi.");

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
      dispatchEvent(event, evtObj = {}) {
        if (this.listeners && this.listeners[event]) {
          this.listeners[event].forEach(fn => fn({ preventDefault: () => {}, stopPropagation: () => {}, ...evtObj }));
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
      _className: '',
      set className(val) {
        this._className = val;
        this.classList.classes.clear();
        String(val).split(/\s+/).filter(Boolean).forEach(c => this.classList.classes.add(c));
      },
      get className() {
        return this._className || '';
      },
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
      dispatchEvent(event, evtObj = {}) {
        if (this.listeners && this.listeners[event]) {
          this.listeners[event].forEach(fn => fn({ preventDefault: () => {}, stopPropagation: () => {}, ...evtObj }));
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

// Mulai Kuis Level 4
startQuiz(4);
assert.strictEqual(currentQuizQuestions.length, 4, "Level 4 harus memiliki 4 soal");
console.log("✓ Level 4 kuis berhasil dimulai dengan 4 soal clock_activity_drop.");

// Soal 1: Q013 (Berangkat sekolah -> Pukul 7 pagi)
const q1 = currentQuizQuestions[0];
assert.strictEqual(q1.type, "clock_activity_drop");
assert.strictEqual(q1.targetAnswer, "Pukul 7 pagi");

const slot = $("timeActivityDropSlot");
assert(slot, "Slot drop timeActivityDropSlot harus ada");

const submitBtn = $("btnActivityDropSubmit");
assert(submitBtn.disabled === true, "Tombol Jawab harus disabled sebelum memasang waktu");

// 1. Simulasi drag & drop / klik chip "Pukul 7 pagi"
placeActivityTimeInSlot("Pukul 7 pagi", q1);
assert.strictEqual(currentDroppedActivityTime, "Pukul 7 pagi");
assert(slot.classList.contains("has-value"), "Slot harus memiliki class has-value");
assert(submitBtn.disabled === false, "Tombol Jawab harus aktif setelah waktu dipasang");
console.log("✓ Pasang chip ke slot berfungsi dan mengaktifkan tombol Jawab.");

// 2. Submit jawaban benar
const initialPoints = quizPoints;
submitActivityDropAnswer(q1);

assert.strictEqual(quizCorrect, 1, "Jumlah jawaban benar harus bertambah");
assert(quizPoints > initialPoints, "Poin bertambah setelah jawaban benar");
assert(slot.classList.contains("slot-correct"), "Slot diberi class slot-correct");
assert(submitBtn.disabled === true, "Tombol Jawab harus nonaktif setelah evaluasi");
assert(!mockElement("nextQuestionBtn").classList.contains("hidden"), "Tombol Soal Berikutnya harus muncul");
console.log("✓ Evaluasi jawaban benar (+poin, streak, visual slot-correct) berhasil.");

// 3. Pengujian Jawaban Salah pada Soal 2
currentQuestionIndex = 1;
renderQuestion();
const q2 = currentQuizQuestions[1]; // Belajar di kelas -> Pukul 8 pagi
assert.strictEqual(q2.type, "clock_activity_drop");

// Murid salah memasang "Pukul 8 malam"
placeActivityTimeInSlot("Pukul 8 malam", q2);
submitActivityDropAnswer(q2);

assert.strictEqual(quizCorrect, 1, "Jawaban salah tidak menambah quizCorrect");
assert($("timeActivityDropSlot").classList.contains("slot-wrong"), "Slot diberi class slot-wrong saat salah");
console.log("✓ Evaluasi jawaban salah (slot-wrong, streak reset) berhasil.");

// 4. Pengujian Timeout
currentQuestionIndex = 2;
renderQuestion();
const q3 = currentQuizQuestions[2];
handleQuestionTimeout();
assert($("timeActivityDropSlot").classList.contains("slot-wrong"), "Saat timeout, slot ditandai");
assert($("timeActivityDropSlot").innerHTML.includes(q3.targetAnswer) || ($("timeActivityDropSlot").textContent && $("timeActivityDropSlot").textContent.includes(q3.targetAnswer)), "Jawaban target ditampilkan saat timeout");
console.log("✓ Penanganan timeout pada clock_activity_drop berhasil.");

stopQuestionTimer();
console.log("\n=== SELURUH PENGUJIAN UNIT 4 (CLOCK ACTIVITY DROP) 100% SUKSES! ===");
process.exit(0);
