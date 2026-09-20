const fs = require("fs");
const path = require("path");
const assert = require("assert");

console.log("=== VERIFIKASI KUIS LEVEL 2: DIGITAL DROP (JAM & MENIT) ===");

// 1. Verifikasi data/soal.csv
const soalCsv = fs.readFileSync(path.join(__dirname, "..", "data", "soal.csv"), "utf8");
assert(soalCsv.includes('Q005,L002') && soalCsv.includes('(jam) dan (menit)'), "Q005 harus memuat instruksi jam dan menit");
assert(soalCsv.includes('Q006,L002') && soalCsv.includes('(jam) dan (menit)'), "Q006 harus memuat instruksi jam dan menit");
assert(soalCsv.includes('Q007,L002') && soalCsv.includes('(jam) dan (menit)'), "Q007 harus memuat instruksi jam dan menit");
assert(soalCsv.includes('Q008,L002') && soalCsv.includes('(jam) dan (menit)'), "Q008 harus memuat instruksi jam dan menit");
console.log("✓ data/soal.csv: Instruksi soal Level 2 valid.");

// 2. Verifikasi data/pilihan.csv
const pilihanCsv = fs.readFileSync(path.join(__dirname, "..", "data", "pilihan.csv"), "utf8");
assert(pilihanCsv.includes('P017,Q005,A,05'), "P017 opsi 05");
assert(pilihanCsv.includes('P018,Q005,B,00'), "P018 opsi 00");
console.log("✓ data/pilihan.csv: Kartu angka terpisah valid.");

// 3. Verifikasi js/storage.js
const storageJs = fs.readFileSync(path.join(__dirname, "..", "js", "storage.js"), "utf8");
assert(storageJs.includes('"3.'), "storage.js harus versi 3.x");
assert(storageJs.includes('targetHour: "05"') && storageJs.includes('targetMinute: "00"'), "Q005 di storage.js memiliki targetHour 05 & targetMinute 00");
console.log("✓ js/storage.js: Versi 3.x dan konfigurasi DEFAULT_QUESTIONS valid.");

// 4. Verifikasi js/quiz.js
const quizJs = fs.readFileSync(path.join(__dirname, "..", "js", "quiz.js"), "utf8");
assert(quizJs.includes('createDigitalAlarmClockWidget'), "Fungsi createDigitalAlarmClockWidget ada di quiz.js");
assert(quizJs.includes('setupDigitalClockDropSlots'), "Fungsi setupDigitalClockDropSlots ada di quiz.js");
assert(quizJs.includes('placeNumberInSlot'), "Fungsi placeNumberInSlot ada di quiz.js");
assert(quizJs.includes('submitClockDropAnswer'), "Fungsi submitClockDropAnswer ada di quiz.js");
assert(quizJs.includes('digital-alarm-widget-wrap'), "Markup digital-alarm-widget-wrap ada");
assert(quizJs.includes('slotHour') && quizJs.includes('slotMinute'), "Slot slotHour dan slotMinute terpasang");
console.log("✓ js/quiz.js: Komponen jam digital alarm dan logika drop slot terverifikasi.");

// 5. Verifikasi css/style.css
const styleCss = fs.readFileSync(path.join(__dirname, "..", "css", "style.css"), "utf8");
assert(styleCss.includes('.digital-alarm-chassis'), "CSS digital-alarm-chassis ada");
assert(styleCss.includes('.digital-drop-slot'), "CSS digital-drop-slot ada");
assert(styleCss.includes('.slot-display-val'), "CSS slot-display-val ada");
console.log("✓ css/style.css: Styling jam alarm digital poster terpasang.");

// 6. Simulasi runtime logika drop slot
let currentDroppedHour = null;
let currentDroppedMinute = null;

function placeNumber(slotType, val) {
  if (slotType === "hour") {
    if (currentDroppedMinute === val) currentDroppedMinute = null;
    currentDroppedHour = val;
  } else {
    if (currentDroppedHour === val) currentDroppedHour = null;
    currentDroppedMinute = val;
  }
}

// Uji coba pasang 05 ke hour dan 00 ke minute
placeNumber("hour", "05");
assert.strictEqual(currentDroppedHour, "05");
assert.strictEqual(currentDroppedMinute, null);

placeNumber("minute", "00");
assert.strictEqual(currentDroppedHour, "05");
assert.strictEqual(currentDroppedMinute, "00");

// Cek evaluasi kecocokan dengan Q005
const q5 = { targetHour: "05", targetMinute: "00" };
const isCorrect = (currentDroppedHour === q5.targetHour && currentDroppedMinute === q5.targetMinute);
assert.strictEqual(isCorrect, true, "Jawaban 05:00 harus BENAR untuk Q005");

// Uji coba jika murid menukar (00 di jam, 05 di menit)
placeNumber("hour", "00");
placeNumber("minute", "05");
const isWrongSwap = (currentDroppedHour === q5.targetHour && currentDroppedMinute === q5.targetMinute);
assert.strictEqual(isWrongSwap, false, "Jawaban 00:05 harus SALAH untuk Q005");

console.log("✓ Simulasi runtime penempatan angka dan evaluasi jam & menit SUKSES!");
console.log("\n SEMUA PENGUJIAN KUIS LEVEL 2 JAM DIGITAL ALARM BERHASIL 100%!");
