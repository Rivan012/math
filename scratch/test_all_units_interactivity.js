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
  '.interactive-duration-container',
  '.kira-story-card',
  '.duration-bars-simulator',
  '.btn-sim-play',
  '.kira-verdict-box',
  '.sort-game-card',
  '.activity-chips-pool',
  '.chip-act',
  '.baskets-grid',
  '.basket-pill',
  '.compare-arena-container',
  '.battle-card',
  '.battle-versus-grid',
  '.battle-btn',
  '.battle-btn.choice-correct',
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
  // M005 Kira Duration Simulator & Sort Game
  'kira-story-card',
  'barOlahraga',
  'barMandi',
  'btnPlayKiraSim',
  'kiraVerdictBox',
  'sort-game-card',
  'activityChipsPool',
  'basketSebentarItems',
  'basketLamaItems',
  // M006 Battle Rounds (Hal. 185-186)
  'compare-arena-container',
  'data-round="1"',
  'data-round="2"',
  'data-round="3"',
  'data-round="4"',
  'Menyisir Rambut',
  'Tidur Malam',
  'Belajar di Sekolah',
  'Mencuci Tangan',
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
if (!studentJs.includes('function renderDigi(') || !studentJs.includes('btnKira.addEventListener')) {
  console.error("❌ Event handler digital console atau simulator Kira hilang");
  process.exit(1);
}
console.log("✓ Event listener simulator digital & durasi waktu Kira terpasang.");

if (!studentJs.includes('battleCards.forEach') || !studentJs.includes('choice === winner')) {
  console.error("❌ Logika evaluasi timbangan durasi 4 ronde hilang");
  process.exit(1);
}
console.log("✓ Logika interaksi timbangan durasi 4 ronde (Hal. 185–186) terpasang.");

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
