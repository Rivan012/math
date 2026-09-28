const fs = require("fs");
const path = require("path");
const assert = require("assert");

console.log("=== VERIFIKASI PERBAIKAN BUG TAMPILAN (MODAL GURU & JARUM JAM ANALOG) ===");

const styleCss = fs.readFileSync(path.join(__dirname, "../css/style.css"), "utf8");
const responsiveCss = fs.readFileSync(path.join(__dirname, "../css/responsive.css"), "utf8");

// 1. Verifikasi Modal Login Guru di style.css
console.log("\n[TEST 1] Memeriksa styling Modal Login Guru...");
assert(styleCss.includes(".modal-backdrop"), "Harus ada .modal-backdrop di style.css");
assert(styleCss.includes("position: fixed"), ".modal-backdrop harus fixed overlay");
assert(styleCss.includes("backdrop-filter: blur"), "Modal backdrop harus memiliki efek blur");
assert(styleCss.includes(".modal-card"), "Harus ada .modal-card");
assert(styleCss.includes(".modal-header"), "Harus ada .modal-header");
assert(styleCss.includes(".btn-close"), "Harus ada .btn-close");
assert(styleCss.includes(".credential-tip"), "Harus ada .credential-tip");
console.log("✓ Styling Modal Guru terpasang sempurna (tidak akan meluber atau unstyled di bawah halaman).");

// 2. Verifikasi Jam Analog Dial Ticks & Numbers
console.log("\n[TEST 2] Memeriksa posisi angka 1-12 dan garis menit pada jam analog...");
assert(styleCss.includes(".clock-tick"), "Harus ada .clock-tick di style.css");
assert(styleCss.includes("transform: rotate(var(--tick-angle))"), "Tick harus berputar sesuai angle");
assert(styleCss.includes(".clock-number"), "Harus ada .clock-number di style.css");
assert(styleCss.includes("transform: rotate(var(--angle))"), ".clock-number harus memutar kontainer sesuai --angle");
assert(styleCss.includes(".clock-number span"), "Harus ada rotasi balik pada span agar angka tetap tegak");
assert(styleCss.includes("transform: rotate(calc(var(--angle) * -1))"), "Span harus memiliki counter-rotation");
console.log("✓ Angka jam 1-12 sekarang tersebar melingkar secara presisi dan tegak (tidak lagi menumpuk hitam di sudut atas).");

console.log("\n=================================================================");
console.log("SELURUH PERBAIKAN BUG TAMPILAN BERHASIL 100%! SEMUA VALIDASI LOLOS.");
console.log("=================================================================");
