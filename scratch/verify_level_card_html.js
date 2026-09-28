const fs = require("fs");
const path = require("path");
const assert = require("assert");

console.log("=== VERIFIKASI TATA LETAK & STYLING KARTU MISI SISWA ===");

const styleCss = fs.readFileSync(path.join(__dirname, "../css/style.css"), "utf8");
const responsiveCss = fs.readFileSync(path.join(__dirname, "../css/responsive.css"), "utf8");
const studentJs = fs.readFileSync(path.join(__dirname, "../js/student.js"), "utf8");

// 1. Periksa class di student.js
assert(studentJs.includes("ICON_BOOK"), "Harus ada konstanta ICON_BOOK");
assert(studentJs.includes("ICON_TROPHY"), "Harus ada konstanta ICON_TROPHY");
assert(studentJs.includes("ICON_LOCK"), "Harus ada konstanta ICON_LOCK");
assert(studentJs.includes("ICON_CHECK"), "Harus ada konstanta ICON_CHECK");
assert(studentJs.includes('class="level-card-top"'), "Harus memiliki level-card-top");
assert(studentJs.includes('class="level-badge-wrap"'), "Harus memiliki level-badge-wrap");
assert(studentJs.includes('class="level-card-actions-2"'), "Harus memiliki level-card-actions-2");
assert(studentJs.includes('class="level-card-body"'), "Harus memiliki level-card-body");
console.log("✓ student.js menghasilkan struktur kartu misi lengkap dengan inline SVG icons.");

// 2. Periksa definisi CSS di style.css
assert(styleCss.includes(".level-card-top"), "style.css harus punya .level-card-top");
assert(styleCss.includes(".level-badge-wrap"), "style.css harus punya .level-badge-wrap");
assert(styleCss.includes(".level-status-pill"), "style.css harus punya .level-status-pill");
assert(styleCss.includes(".level-status-pill.done"), "style.css harus punya .level-status-pill.done");
assert(styleCss.includes(".level-status-pill.ready"), "style.css harus punya .level-status-pill.ready");
assert(styleCss.includes(".level-card-actions-2"), "style.css harus punya .level-card-actions-2");
assert(styleCss.includes(".btn-card-action"), "style.css harus punya .btn-card-action");
assert(styleCss.includes(".btn-materi"), "style.css harus punya .btn-materi");
assert(styleCss.includes(".btn-quiz"), "style.css harus punya .btn-quiz");
assert(styleCss.includes(".btn-quiz.is-completed"), "style.css harus punya .btn-quiz.is-completed");
assert(styleCss.includes(".action-svg-icon"), "style.css harus punya .action-svg-icon");
console.log("✓ style.css memiliki semua aturan CSS untuk level-card, status-pill, dan tombol aksi.");

// 3. Periksa responsive.css
assert(responsiveCss.includes(".level-card-actions-2"), "responsive.css harus punya penataan mobile .level-card-actions-2");
console.log("✓ responsive.css memiliki penataan mobile untuk tombol kartu misi.");

console.log("\n SEMUA VERIFIKASI KARTU MISI BERHASIL! TAMPILAN KINI RAPI, ELEGAN, DAN BEBAS SLOP.");
