const fs = require('fs');
const path = require('path');

console.log("=== PENGUJIAN INTEGRITAS SELURUH MATERI INTERAKTIF (BUKU TEKS RESMI KELAS 2 SD) ===");

const studentJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'student.js'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

// 1. Verifikasi Selector CSS Baru
const requiredCss = [
  '.digital-interactive-console',
  '.btn-digi-step',
  '.read-aloud-banner',
  '.preset-digi-btn',
  '.materi3-container',
  '.materi3-header-card',
  '.materi3-grid',
  '.materi3-card',
  '.materi3-info-banner',
  '.sky-simulator-card',
  '.sky-phase-tabs',
  '.phase-tab',
  '.sky-viewport',
  '.sky-pagi',
  '.sky-siang',
  '.sky-sore',
  '.sky-malam',
  '.routine-solver-card',
  '.routine-cards-deck',
  '.routine-arrange-card',
  '.btn-swap',
  '.btn-check-routine'
];

requiredCss.forEach(cls => {
  if (!styleCss.includes(cls)) {
    console.error(`❌ CSS class hilang: ${cls}`);
    process.exit(1);
  }
});
console.log(`✓ Sebanyak ${requiredCss.length} CSS class peraga interaktif terdefinisi lengkap di style.css.`);

// 2. Verifikasi konten renderFlipbookContent di js/student.js
const requiredTokens = [
  // M003 Digital Interactive Console
  'digital-interactive-console',
  'digiHourText',
  'digiMinText',
  'btn-digi-step',
  'read-aloud-banner',
  'preset-digi-btn',
  // M005 4 Panel Buku Teks & Sort Game
  'materi3-container',
  'materi3_header.png',
  'materi3_minum.png',
  'materi3_memasak.png',
  'materi3_tidur.png',
  'materi3_gosok_gigi.png',
  'materi3-grid',
  'materi3InfoBanner',
  // M007 Sky Simulator (Hal. 183-184)
  'sky-simulator-card',
  'sky-phase-tabs',
  'skyViewport',
  'skyClockBadge',
  'skyHeadline',
  'timeline-sequence-banner',
  // M008 Routine Sequence Arranger (Hal. 186 Soal 4)
  'routine-solver-card',
  'routineCardsDeck',
  'btnCheckRoutine',
  'btnResetRoutine'
];

requiredTokens.forEach(tok => {
  if (!studentJs.includes(tok)) {
    console.error(`❌ Token interaktivitas hilang di js/student.js: ${tok}`);
    process.exit(1);
  }
});
console.log(`✓ Seluruh ${requiredTokens.length} modul peraga interaktif buku teks terverifikasi di js/student.js.`);

// 3. Verifikasi Logika Interaksi Flipbook
if (!studentJs.includes('function renderDigi(') || !studentJs.includes('mat3Cards.forEach')) {
  console.error("❌ Event handler digital console atau materi 3 interaktif hilang");
  process.exit(1);
}
console.log("✓ Event listener simulator digital & peraga materi 3 terpasang.");

if (!studentJs.includes('phaseTabs.forEach') || !studentJs.includes('skyViewport.className =')) {
  console.error("❌ Logika pergantian 4 fase waktu langit hilang");
  process.exit(1);
}
console.log("✓ Logika simulator siklus langit 4 waktu (Pagi, Siang, Sore, Malam) terpasang.");

if (!studentJs.includes('renderDeck()') || !studentJs.includes('btnCheck.addEventListener')) {
  console.error("❌ Logika penyusun urutan rutinitas harian hilang");
  process.exit(1);
}
console.log("✓ Logika permainan susun urutan kegiatan harian (Hal. 186 Soal 4) terpasang.");

console.log("\n=== SELURUH PENGUJIAN MATERI INTERAKTIF BUKU TEKS BERHASIL 100%! ===");
