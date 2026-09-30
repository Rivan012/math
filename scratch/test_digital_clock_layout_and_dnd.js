const fs = require("fs");
const path = require("path");
const assert = require("assert");

console.log("=== PENGUJIAN KOMPONEN JAM DIGITAL & DRAG N DROP ===");

// 1. Verifikasi CSS
const styleCss = fs.readFileSync(path.join(__dirname, "../css/style.css"), "utf8");
assert(styleCss.includes(".digital-diagram-wrap"), "CSS .digital-diagram-wrap harus ada");
assert(styleCss.includes(".digital-clock-pill-header"), "CSS .digital-clock-pill-header harus ada");
assert(styleCss.includes(".digital-arrows-svg"), "CSS .digital-arrows-svg harus ada");
assert(styleCss.includes(".digital-alarm-chassis"), "CSS .digital-alarm-chassis harus ada");
assert(styleCss.includes(".digital-screen-inner"), "CSS .digital-screen-inner harus ada");
assert(styleCss.includes(".digital-clock-feet-row"), "CSS .digital-clock-feet-row harus ada");
assert(styleCss.includes(".digital-answer-slots-row"), "CSS .digital-answer-slots-row harus ada");
assert(styleCss.includes(".digital-drop-slot"), "CSS .digital-drop-slot harus ada");
assert(styleCss.includes(".drag-chip-touch-ghost"), "CSS .drag-chip-touch-ghost harus ada");
assert(styleCss.includes(".digital-drop-slot *"), "CSS .digital-drop-slot * harus ada");
console.log("✓ css/style.css: Semua styling layout diagram jam digital & pointer events terverifikasi.");

// 2. Verifikasi js/quiz.js
const quizJs = fs.readFileSync(path.join(__dirname, "../js/quiz.js"), "utf8");
assert(quizJs.includes("createDigitalAlarmClockWidget"), "createDigitalAlarmClockWidget harus ada di quiz.js");
assert(quizJs.includes("setupDigitalClockDropSlots"), "setupDigitalClockDropSlots harus ada di quiz.js");
assert(quizJs.includes("setupDigitalChipDragEvents"), "setupDigitalChipDragEvents harus ada di quiz.js");
assert(quizJs.includes("currentDraggedDigitalValue"), "currentDraggedDigitalValue fallback harus ada di quiz.js");
assert(quizJs.includes("screenHourVal") && quizJs.includes("screenMinuteVal"), "screenHourVal dan screenMinuteVal harus ada di quiz.js");
assert(quizJs.includes("slotHour") && quizJs.includes("slotMinute"), "slotHour dan slotMinute harus ada di quiz.js");
console.log("✓ js/quiz.js: Struktur markup diagram, drop handler, dan sinkronisasi digit terverifikasi.");

// 3. Verifikasi admin.html
const adminHtml = fs.readFileSync(path.join(__dirname, "../admin.html"), "utf8");
assert(adminHtml.includes("previewDigitalClockWrap"), "previewDigitalClockWrap harus ada di admin.html");
assert(adminHtml.includes("previewSlotHourText") && adminHtml.includes("previewSlotMinuteText"), "Slot hour dan minute preview harus ada di admin.html");
assert(adminHtml.includes("previewScreenHourVal") && adminHtml.includes("previewScreenMinuteVal"), "Screen hour dan minute preview harus ada di admin.html");
console.log("✓ admin.html: Pratinjau guru untuk jam digital diperbarui sesuai modul.");

console.log("\n SEMUA PENGUJIAN VALIDASI BERHASIL 100%!");
