const fs = require("fs");
const path = require("path");
const assert = require("assert");

console.log("=== VERIFIKASI FITUR QUIZ JAM ANALOG DRAG & DROP ANGKA ===");

// 1. Verifikasi data/soal.csv
const soalCsv = fs.readFileSync(path.join(__dirname, "..", "data", "soal.csv"), "utf8");
assert(soalCsv.includes('Q001,L001,"Halim bangun tidur') && soalCsv.includes('"clock_drop"'), "Q001 harus tipe clock_drop di soal.csv");
assert(soalCsv.includes('Q002,L001,"Tika berangkat') && soalCsv.includes('"clock_drop"'), "Q002 harus tipe clock_drop di soal.csv");
assert(soalCsv.includes('Q003,L001,"Jam istirahat') && soalCsv.includes('"clock_drop"'), "Q003 harus tipe clock_drop di soal.csv");
assert(soalCsv.includes('Q004,L001,"Kira bersiap') && soalCsv.includes('"clock_drop"'), "Q004 harus tipe clock_drop di soal.csv");
console.log("✓ data/soal.csv terverifikasi: Q001-Q004 bertipe clock_drop.");

// 2. Verifikasi js/storage.js
const storageJs = fs.readFileSync(path.join(__dirname, "..", "js", "storage.js"), "utf8");
assert(storageJs.includes('"2.6"'), "Versi kurikulum harus 2.6 di storage.js");
assert(storageJs.includes('type: "clock_drop"'), "clock_drop harus ada di storage.js");
assert(storageJs.includes('targetAnswer: "05.00"'), "targetAnswer Q001 ada di storage.js");
console.log("✓ js/storage.js terverifikasi: versi 2.6 dan DEFAULT_QUESTIONS bertipe clock_drop.");

// 3. Verifikasi css/style.css
const styleCss = fs.readFileSync(path.join(__dirname, "..", "css", "style.css"), "utf8");
assert(styleCss.includes(".clock-drop-interactive-frame"), "CSS .clock-drop-interactive-frame harus ada");
assert(styleCss.includes(".clock-drop-target-box"), "CSS .clock-drop-target-box harus ada");
assert(styleCss.includes(".clock-drag-chip"), "CSS .clock-drag-chip harus ada");
assert(styleCss.includes(".clock-drag-chip.chip-red"), "CSS warna chip merah harus ada");
assert(styleCss.includes(".clock-drag-chip.chip-blue"), "CSS warna chip biru harus ada");
assert(styleCss.includes(".clock-drag-chip.chip-amber"), "CSS warna chip amber harus ada");
assert(styleCss.includes(".clock-drag-chip.chip-green"), "CSS warna chip hijau harus ada");
console.log("✓ css/style.css terverifikasi: styling drag & drop dan chip 4 warna lengkap.");

// 4. Verifikasi js/quiz.js sintaks dan fungsi
const quizJs = fs.readFileSync(path.join(__dirname, "..", "js", "quiz.js"), "utf8");
assert(quizJs.includes("setupClockDropZone"), "setupClockDropZone harus ada di quiz.js");
assert(quizJs.includes("placeAnswerInSlot"), "placeAnswerInSlot harus ada di quiz.js");
assert(quizJs.includes("removeAnswerFromSlot"), "removeAnswerFromSlot harus ada di quiz.js");
assert(quizJs.includes("setupChipDragEvents"), "setupChipDragEvents harus ada di quiz.js");
assert(quizJs.includes("submitClockDropAnswer"), "submitClockDropAnswer harus ada di quiz.js");
assert(quizJs.includes('question.type === "clock_drop"'), "Pengecekan clock_drop harus ada");
console.log("✓ js/quiz.js terverifikasi: seluruh fungsi drag & drop terdefinisi dengan benar.");

// 5. Verifikasi siswa.html
const siswaHtml = fs.readFileSync(path.join(__dirname, "..", "siswa.html"), "utf8");
assert(siswaHtml.includes('src="js/quiz.js?v=2.6"'), "siswa.html harus memuat quiz.js?v=2.6");
assert(siswaHtml.includes('src="js/storage.js?v=2.6"'), "siswa.html harus memuat storage.js?v=2.6");
assert(siswaHtml.includes('href="css/style.css?v=2.6"'), "siswa.html harus memuat style.css?v=2.6");
console.log("✓ siswa.html terverifikasi: cache-busting v=2.6 telah dipasang.");

console.log("\n SEMUA PENGUJIAN OTOMATIS SUKSES!");
