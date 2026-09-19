/* =========================================================
   TIME QUEST
   student.js - Beranda Siswa, Peta Level, dan Materi Belajar
   ========================================================= */

"use strict";

const LEVELS = [
  {
    id: 1,
    title: "Mengenal Jam Analog",
    icon: "assets/icons/level-1.svg",
    description: "Anatomi jarum jam, jarum menit, dan membaca jam tepat"
  },
  {
    id: 2,
    title: "Mengenal Jam Digital",
    icon: "assets/icons/level-2.svg",
    description: "Membaca jam angka dan perbandingannya dengan analog"
  },
  {
    id: 3,
    title: "Lebih Lama atau Lebih Cepat",
    icon: "assets/icons/level-3.svg",
    description: "Membandingkan durasi berbagai kegiatan sehari-hari"
  },
  {
    id: 4,
    title: "Mengenal Waktu Kegiatan",
    icon: "assets/icons/level-4.svg",
    description: "Mengenal waktu pagi, siang, sore, dan malam"
  }
];

let currentMaterialLevel = 1;

/**
 * Berpindah tab/halaman di dalam antarmuka siswa
 * @param {string} id 
 */
function showStudentPage(id) {
  document.querySelectorAll(".student-page").forEach(page => {
    page.classList.add("hidden");
  });

  const target = $(id);
  if (target) {
    target.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/**
 * Menampilkan beranda siswa dengan statistik terbaru
 */
function renderHome() {
  if (!currentStudent) return;

  const completed = currentStudent.completedLevels ? currentStudent.completedLevels.length : 0;

  const homePoints = $("homePoints");
  const homeStars = $("homeStars");
  const homeMaterial = $("homeMaterial");
  const homeLevel = $("homeLevel");
  const homeProgress = $("homeProgress");
  const homeProgressText = $("homeProgressText");
  const hudPoints = $("hudPoints");
  const hudStars = $("hudStars");

  if (homePoints) homePoints.textContent = currentStudent.points || 0;
  if (homeStars) homeStars.textContent = currentStudent.stars || 0;
  if (hudPoints) hudPoints.textContent = currentStudent.points || 0;
  if (hudStars) hudStars.textContent = currentStudent.stars || 0;
  if (homeMaterial) homeMaterial.textContent = (currentStudent.materialProgress || 0) + "%";
  if (homeLevel) homeLevel.textContent = Math.min(completed + 1, 4) + " / 4";

  const progress = Math.round((completed / LEVELS.length) * 100);
  if (homeProgress) homeProgress.style.width = progress + "%";
  if (homeProgressText) homeProgressText.textContent = progress + "%";

  renderLevels();
  if (typeof renderLeaderboardPreview === "function") {
    renderLeaderboardPreview();
  }
}

/**
 * Merender daftar kartu level (1 s.d. 5) pada grid
 */
/**
 * Cek apakah siswa sudah membaca materi level tertentu
 * @param {number} levelId
 * @returns {boolean}
 */
function hasStudiedLevel(levelId) {
  if (!currentStudent) return false;
  const studied = currentStudent.studiedLevels || [];
  return studied.includes(levelId);
}

/**
 * Tandai bahwa siswa telah membaca materi level tertentu
 * @param {number} levelId
 */
function markLevelStudied(levelId) {
  if (!currentStudent) return;
  if (!currentStudent.studiedLevels) currentStudent.studiedLevels = [];
  if (!currentStudent.studiedLevels.includes(levelId)) {
    currentStudent.studiedLevels.push(levelId);
    if (typeof saveCurrentStudent === "function") saveCurrentStudent();
  }
}

/**
 * Menampilkan modal edukasi "Pelajari Materi Dulu" jika siswa belum baca materi
 * @param {number} levelId
 */
function showNeedStudyModal(levelId) {
  const modal = $("needStudyModal");
  if (!modal) return;

  const badge = $("needStudyBadge");
  const levelInfo = LEVELS.find(l => l.id === levelId);
  if (badge && levelInfo) {
    badge.textContent = `Misi ${levelId}: ${levelInfo.title}`;
  }

  // Simpan levelId di modal agar tombol tahu level mana
  modal.dataset.levelId = levelId;
  modal.classList.remove("hidden");
}

/**
 * Menutup modal edukasi "Pelajari Materi Dulu"
 */
function closeNeedStudyModal() {
  const modal = $("needStudyModal");
  if (modal) modal.classList.add("hidden");
}

/**
 * Memulai kuis untuk level tertentu dengan pengecekan materi
 * @param {number} levelId
 */
function tryStartQuizForLevel(levelId) {
  const completedLevels = currentStudent ? (currentStudent.completedLevels || []) : [];
  const unlocked = levelId === 1 || completedLevels.includes(levelId - 1);
  if (!unlocked) return;

  // Jika belum baca materi, tampilkan modal reminder
  if (!hasStudiedLevel(levelId) && !completedLevels.includes(levelId)) {
    showNeedStudyModal(levelId);
    return;
  }

  // Langsung mulai kuis
  if (typeof startQuiz === "function") {
    startQuiz(levelId);
  }
}

function renderLevels() {
  const grid = $("levelGrid");
  if (!grid) return;

  grid.innerHTML = "";

  LEVELS.forEach(level => {
    const completedLevels = currentStudent.completedLevels || [];
    const unlocked = level.id === 1 || completedLevels.includes(level.id - 1);
    const completed = completedLevels.includes(level.id);
    const studied = hasStudiedLevel(level.id);

    const card = document.createElement("div");
    card.className = "level-card " + (completed ? "completed" : unlocked ? "unlocked" : "locked");

    // Status pill
    const statusHtml = completed
      ? `<span class="level-status-pill done"><img src="assets/icons/check-circle.svg" width="14" height="14" alt=""> Tuntas</span>`
      : studied
        ? `<span class="level-status-pill studying">Sudah Belajar</span>`
        : unlocked
          ? `<span class="level-status-pill ready">Buka Misi</span>`
          : `<span class="level-status-pill locked"><img src="assets/icons/lock.svg" width="14" height="14" alt=""> Terkunci</span>`;

    // Tombol Materi
    let materiClass, materiLabel;
    if (!unlocked) {
      materiClass = "btn-card-action btn-materi is-locked";
      materiLabel = `<img src="assets/icons/lock.svg" width="14" height="14" alt=""> Terkunci`;
    } else if (studied || completed) {
      materiClass = "btn-card-action btn-materi is-understood";
      materiLabel = `<img src="assets/icons/book.svg" width="14" height="14" alt=""> Baca Ulang`;
    } else {
      materiClass = "btn-card-action btn-materi is-primary";
      materiLabel = `<img src="assets/icons/book.svg" width="14" height="14" alt=""> Materi`;
    }

    // Tombol Kuis
    let quizClass, quizLabel;
    if (!unlocked) {
      quizClass = "btn-card-action btn-quiz is-locked";
      quizLabel = `<img src="assets/icons/lock.svg" width="14" height="14" alt=""> Terkunci`;
    } else if (completed) {
      quizClass = "btn-card-action btn-quiz is-completed";
      quizLabel = `<img src="assets/icons/trophy.svg" width="14" height="14" alt=""> Kuis Ulang`;
    } else if (studied) {
      quizClass = "btn-card-action btn-quiz is-ready";
      quizLabel = `<img src="assets/icons/trophy.svg" width="14" height="14" alt=""> Mulai Kuis`;
    } else {
      quizClass = "btn-card-action btn-quiz is-need-study";
      quizLabel = `<img src="assets/icons/trophy.svg" width="14" height="14" alt=""> Kuis`;
    }

    card.innerHTML = `
      <div class="level-card-top">
        <div class="level-badge-wrap">
          <img src="${level.icon}" class="level-icon-img" width="28" height="28" alt="">
          <span class="level-badge-num">Misi ${level.id}</span>
        </div>
        ${statusHtml}
      </div>
      <div class="level-card-body">
        <div class="level-title">${escapeHTML(level.title)}</div>
        <p class="level-desc">${escapeHTML(level.description)}</p>
      </div>
      <div class="level-card-actions-2">
        <button class="${materiClass}" data-level="${level.id}" data-action="materi" type="button">${materiLabel}</button>
        <button class="${quizClass}" data-level="${level.id}" data-action="quiz" type="button">${quizLabel}</button>
      </div>
    `;

    // Event listener untuk tombol Materi
    const materiBtn = card.querySelector('[data-action="materi"]');
    if (materiBtn && unlocked) {
      materiBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openMaterial(level.id);
      });
    }

    // Event listener untuk tombol Kuis
    const quizBtn = card.querySelector('[data-action="quiz"]');
    if (quizBtn && unlocked) {
      quizBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        tryStartQuizForLevel(level.id);
      });
    }

    grid.appendChild(card);
  });
}

/* =========================================================
   SISTEM FLIPBOOK INTERAKTIF MATERI WAKTU
   ========================================================= */

let currentFlipbookPage = 0;
let flipbookMaterials = [];

/**
 * Membuka materi belajar bergaya Flipbook untuk level tertentu
 * @param {number} levelId 
 */
function openMaterial(levelId = 1) {
  currentMaterialLevel = levelId;

  const materials = typeof getMaterials === "function" ? getMaterials() : [];
  let relevant = materials.filter(m => Number(m.level) === Number(levelId));
  if (relevant.length === 0) {
    relevant = materials;
  }

  flipbookMaterials = relevant.length > 0 ? relevant : (typeof DEFAULT_MATERIALS !== "undefined" ? DEFAULT_MATERIALS : []);
  currentFlipbookPage = 0;

  showStudentPage("materialScreen");
  renderFlipbook();

  // Scroll halus ke atas buku
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Merender lembar buku Flipbook yang sedang aktif
 */
function renderFlipbook() {
  const container = $("flipbookPageContent");
  const badge = $("flipbookPageBadge");
  const titleEl = $("flipbookChapterTitle");
  const percentEl = $("flipbookProgressPercent");
  const fillEl = $("flipbookProgressFill");
  const prevBtn = $("prevPageBtn");
  const nextBtn = $("nextPageBtn");
  const dotsContainer = $("flipbookDots");

  if (!container || flipbookMaterials.length === 0) return;

  const totalPages = flipbookMaterials.length;
  const currentIndex = Math.max(0, Math.min(currentFlipbookPage, totalPages - 1));
  const currentItem = flipbookMaterials[currentIndex];

  const pageNum = currentIndex + 1;
  const progressPercent = Math.round((pageNum / totalPages) * 100);

  // Update Header & Bar Kemajuan Membaca
  if (badge) badge.textContent = `Halaman ${pageNum} dari ${totalPages}`;
  if (titleEl) titleEl.textContent = `Bab ${currentItem.level || currentMaterialLevel}: ${currentItem.judul || currentItem.title || "Materi Waktu"}`;
  if (percentEl) percentEl.textContent = `${progressPercent}%`;
  if (fillEl) fillEl.style.width = `${progressPercent}%`;

  // Render Titik Navigasi Halaman
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "flipbook-dot" + (i === currentIndex ? " active" : "");
      dot.setAttribute("aria-label", `Halaman ${i + 1}`);
      dot.addEventListener("click", () => {
        flipToPage(i);
      });
      dotsContainer.appendChild(dot);
    }
  }

  // Update Tombol Navigasi
  if (prevBtn) {
    prevBtn.disabled = currentIndex === 0;
  }
  if (nextBtn) {
    if (currentIndex === totalPages - 1) {
      nextBtn.innerHTML = `Mulai Kuis Level ${currentMaterialLevel} →`;
      nextBtn.className = "btn btn-game-primary flipbook-nav-btn is-finish";
    } else {
      nextBtn.innerHTML = `Halaman Berikutnya →`;
      nextBtn.className = "btn btn-game-primary flipbook-nav-btn";
    }
  }

  // Siapkan Lembar Peraga Visual Interaktif berdasarkan 4 Unit Kurikulum
  const demoHtml = getMaterialExhibitHtml(currentItem);

  // Catatan Pembelajaran (Menggunakan SVG lightbulb)
  const tipHtml = currentItem.tip ? `
    <div class="reader-tip-box">
      <img src="assets/icons/lightbulb.svg" width="18" height="18" alt="" style="flex-shrink:0;">
      <div>
        <strong>Catatan Penting:</strong> ${escapeHTML(currentItem.tip)}
      </div>
    </div>
  ` : "";

  // Banner Lembar Terakhir (Menggunakan SVG check-circle)
  let finalCelebrationHtml = "";
  if (currentIndex === totalPages - 1) {
    finalCelebrationHtml = `
      <div class="reader-completion-box">
        <img src="assets/icons/check-circle.svg" width="28" height="28" alt="" style="flex-shrink:0;">
        <div>
          <h4>Seluruh Materi Unit Ini Selesai Dipelajari</h4>
          <p>Kamu telah memahami konsep waktu pada bab ini. Sekarang pilih langkah selanjutnya:</p>
          <div class="completion-btn-row">
            <button class="btn btn-game-primary btn-sm" id="flipbookStartQuizBtn" type="button">
              <img src="assets/icons/trophy.svg" width="16" height="16" alt=""> Mulai Kuis Level ${currentMaterialLevel}
            </button>
            <button class="btn btn-outline btn-sm" id="flipbookBackHomeBtn" type="button">
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    `;

    // Tandai kemajuan materi 100% dan level sudah dipelajari
    if (currentStudent) {
      currentStudent.materialProgress = 100;
      markLevelStudied(currentMaterialLevel);
      if (typeof saveCurrentStudent === "function") {
        saveCurrentStudent();
      }
    }
  }

  // Render Konten Lembar Buku Tanpa Tumpukan Badge Slop
  container.innerHTML = `
    <div class="reader-sheet-inner">
      <header class="reader-page-header">
        <span class="reader-chapter-kicker">Unit ${currentItem.level || currentMaterialLevel}</span>
        <h2 class="reader-page-title">${escapeHTML(currentItem.judul || currentItem.title || "Materi Waktu")}</h2>
      </header>

      <div class="reader-body-text">
        <p>${escapeHTML(currentItem.isi || currentItem.content || "")}</p>
      </div>

      ${demoHtml}
      ${tipHtml}
      ${finalCelebrationHtml}
    </div>
  `;

  // Hubungkan interaksi tombol peraga di dalam lembar
  initFlipbookInteractiveEvents(container);

  // Hubungkan tombol di banner completion (halaman terakhir)
  const flipbookStartQuizBtn = container.querySelector("#flipbookStartQuizBtn");
  if (flipbookStartQuizBtn) {
    flipbookStartQuizBtn.addEventListener("click", () => {
      if (typeof startQuiz === "function") {
        startQuiz(currentMaterialLevel);
      }
    });
  }
  const flipbookBackHomeBtn = container.querySelector("#flipbookBackHomeBtn");
  if (flipbookBackHomeBtn) {
    flipbookBackHomeBtn.addEventListener("click", () => {
      showStudentPage("homeScreen");
      renderHome();
    });
  }

  // Animasi lembaran masuk
  container.classList.remove("anim-flip-in");
  void container.offsetWidth; // Trigger reflow
  container.classList.add("anim-flip-in");
}

/**
 * Menghasilkan markup HTML untuk peraga visual interaktif 4 Unit Kurikulum
 * @param {Object} item 
 * @returns {string}
 */
function getMaterialExhibitHtml(item) {
  const levelNum = Number(item.level || currentMaterialLevel);
  const itemId = item.id || "";

  // =========================================================
  // UNIT 1: MENGENAL JAM ANALOG
  // =========================================================
  if (levelNum === 1) {
    if (itemId === "M001" || itemId.includes("1")) {
      // Halim bangun tidur pukul 05.00 (Buku Matematika Hal. 178)
      return `
        <div class="reader-clock-card">
          <div class="clock-anatomy-wrapper">
            <div class="clock-callout callout-left">
              <span class="callout-badge red">Jarum Pendek</span>
              <p class="callout-desc">Menunjuk angka <strong>5</strong><br>Menunjukkan <strong>JAM</strong></p>
            </div>

            <div class="reader-clock-viewport">
              <div class="clock-face material-dynamic-clock interactive-clock-face" id="flipbookClockFace" aria-label="Jam analog Halim bangun tidur 05.00">
                ${generateClockTicks()}
                ${generateClockNumbers()}
                <!-- Jarum Pendek di 5 (150deg) & Jarum Panjang di 12 (0deg) -->
                <div class="clock-hand hour-hand red-hand draggable-hand" id="flipbookHourHand" style="transform:translateX(-50%) rotate(150deg);">
                  <div class="hand-grab-handle hour-handle" title="Tarik jarum jam (merah)"></div>
                </div>
                <div class="clock-hand minute-hand blue-hand draggable-hand" id="flipbookMinuteHand" style="transform:translateX(-50%) rotate(0deg);">
                  <div class="hand-grab-handle minute-handle" title="Tarik jarum menit (biru)"></div>
                </div>
                <div class="clock-center"></div>
              </div>
            </div>

            <div class="clock-callout callout-right">
              <span class="callout-badge blue">Jarum Panjang</span>
              <p class="callout-desc">Menunjuk angka <strong>12</strong><br>Menunjukkan <strong>MENIT (00)</strong></p>
            </div>
          </div>

          <div class="reader-clock-meta">
            <div class="digital-badge" id="flipbookDigitalBadge">05.00</div>
            <p class="reader-clock-caption" id="flipbookClockCaption">
              Halim bangun tidur pukul <strong>05.00</strong> (Pukul lima tepat).
            </p>
          </div>
        </div>
      `;
    }

    // M002: Membaca Jam Tepat dan Setengah
    return `
      <div class="reader-clock-card">
        <div class="reader-clock-viewport">
          <div class="clock-face material-dynamic-clock interactive-clock-face" id="flipbookClockFace">
            ${generateClockTicks()}
            ${generateClockNumbers()}
            <div class="clock-hand hour-hand red-hand draggable-hand" id="flipbookHourHand" style="transform:translateX(-50%) rotate(150deg);">
              <div class="hand-grab-handle hour-handle" title="Tarik jarum jam (merah)"></div>
            </div>
            <div class="clock-hand minute-hand blue-hand draggable-hand" id="flipbookMinuteHand" style="transform:translateX(-50%) rotate(0deg);">
              <div class="hand-grab-handle minute-handle" title="Tarik jarum menit (biru)"></div>
            </div>
            <div class="clock-center"></div>
          </div>
        </div>

        <div class="reader-clock-meta">
          <div class="digital-badge" id="flipbookDigitalBadge">05.00</div>
          <p class="reader-clock-caption" id="flipbookClockCaption">Pukul 5 tepat (Jarum panjang di angka 12)</p>
        </div>

        <div class="clock-preset-buttons" role="group" aria-label="Pilihan contoh jam">
          <button type="button" class="preset-btn active" data-h="5" data-m="0" data-deg-h="150" data-deg-m="0" data-desc="Pukul 05.00 tepat (Halim bangun tidur)">
            Pukul 05.00
          </button>
          <button type="button" class="preset-btn" data-h="7" data-m="0" data-deg-h="210" data-deg-m="0" data-desc="Pukul 07.00 tepat (Berangkat sekolah)">
            Pukul 07.00
          </button>
          <button type="button" class="preset-btn" data-h="4" data-m="30" data-deg-h="135" data-deg-m="180" data-desc="Pukul 04.30 (Setengah lima)">
            Pukul 04.30
          </button>
          <button type="button" class="preset-btn" data-h="6" data-m="30" data-deg-h="195" data-deg-m="180" data-desc="Pukul 06.30 (Setengah tujuh)">
            Pukul 06.30
          </button>
        </div>
      </div>
    `;
  }

  // =========================================================
  // UNIT 2: MENGENAL JAM DIGITAL
  // =========================================================
  if (levelNum === 2) {
    if (itemId === "M003" || itemId.includes("3")) {
      // Anatomi Jam Digital (Buku Matematika Hal. 178, 180, 181)
      return `
        <div class="reader-clock-card">
          <div class="digital-interactive-console">
            <!-- Layar Digital LED Bercahaya -->
            <div class="digital-screen-large glow">
              <span class="digi-part hour-part" id="digiHourText">05</span>
              <span class="digi-colon">:</span>
              <span class="digi-part min-part" id="digiMinText">00</span>
            </div>

            <!-- Tombol Pengatur Waktu Taktil (Anak Kelas 2 SD) -->
            <div class="digital-adjust-controls">
              <div class="adjust-group">
                <span class="adjust-label">Atur Jam (Kiri)</span>
                <div class="adjust-btns">
                  <button type="button" class="btn-digi-step" data-digi-act="-h" title="Kurangi 1 jam">-1 Jam</button>
                  <button type="button" class="btn-digi-step" data-digi-act="+h" title="Tambah 1 jam">+1 Jam</button>
                </div>
              </div>
              <div class="adjust-group">
                <span class="adjust-label">Atur Menit (Kanan)</span>
                <div class="adjust-btns">
                  <button type="button" class="btn-digi-step" data-digi-act="-m" title="Kurangi 15 menit">-15 Mnt</button>
                  <button type="button" class="btn-digi-step" data-digi-act="+m" title="Tambah 15 menit">+15 Mnt</button>
                </div>
              </div>
            </div>

            <!-- Pembeda Anatomi: Jam (Kiri) vs Pemisah vs Menit (Kanan) -->
            <div class="digital-labels-grid">
              <div class="digital-label-card left-label">
                <span class="label-kicker">Bagian Kiri (<strong id="lblHour">05</strong>)</span>
                <p>Menunjukkan <strong>JAM</strong></p>
              </div>
              <div class="digital-label-card center-label">
                <span class="label-kicker">Tanda (:)</span>
                <p>Pemisah Jam & Menit</p>
              </div>
              <div class="digital-label-card right-label">
                <span class="label-kicker">Bagian Kanan (<strong id="lblMin">00</strong>)</span>
                <p>Menunjukkan <strong>MENIT</strong></p>
              </div>
            </div>
          </div>

          <div class="reader-clock-meta">
            <div class="read-aloud-banner">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              <span id="digiReadAloud">Jam ini dibaca: <strong>Pukul 05.00 tepat</strong> (Halim bangun tidur)</span>
            </div>
          </div>

          <div class="clock-preset-buttons" role="group" aria-label="Jadwal Digital Tika & Halim">
            <button type="button" class="preset-digi-btn active" data-h="5" data-m="0" data-read="Pukul 05.00 tepat (Halim bangun tidur - Hal. 178)">05:00 Bangun Tidur</button>
            <button type="button" class="preset-digi-btn" data-h="6" data-m="0" data-read="Pukul 06.00 pagi (Tika sarapan - Hal. 179)">06:00 Sarapan</button>
            <button type="button" class="preset-digi-btn" data-h="7" data-m="0" data-read="Pukul 07.00 pagi (Masuk sekolah - Hal. 179)">07:00 Masuk Sekolah</button>
            <button type="button" class="preset-digi-btn" data-h="12" data-m="0" data-read="Pukul 12.00 siang (Makan di Kantin Sehat - Hal. 180)">12:00 Kantin Sehat</button>
            <button type="button" class="preset-digi-btn" data-h="4" data-m="0" data-read="Pukul 04.00 sore (Tika bermain bersama adik - Hal. 180)">16:00 Bermain Sore</button>
            <button type="button" class="preset-digi-btn" data-h="9" data-m="0" data-read="Pukul 09.00 malam (Tika tidur malam - Hal. 181)">21:00 Tidur Malam</button>
          </div>
        </div>
      `;
    }

    // M004: Membaca Jam Digital Sehari-hari (Perbandingan Analog & Digital)
    return `
      <div class="reader-clock-card">
        <div class="dual-clock-comparison">
          <div class="dual-clock-item">
            <span class="dual-clock-title">Jam Analog</span>
            <div class="clock-face material-dynamic-clock mini interactive-clock-face" id="flipbookDualAnalog">
              ${generateClockTicks()}
              ${generateClockNumbers()}
              <div class="clock-hand hour-hand red-hand draggable-hand" id="dualHourHand" style="transform:translateX(-50%) rotate(210deg);">
                <div class="hand-grab-handle hour-handle" title="Tarik jarum jam (merah)"></div>
              </div>
              <div class="clock-hand minute-hand blue-hand draggable-hand" id="dualMinuteHand" style="transform:translateX(-50%) rotate(0deg);">
                <div class="hand-grab-handle minute-handle" title="Tarik jarum menit (biru)"></div>
              </div>
              <div class="clock-center"></div>
            </div>
          </div>

          <div class="dual-clock-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14m-4-4 4 4-4 4"/></svg>
            <span class="small muted">Sama Dengan</span>
          </div>

          <div class="dual-clock-item">
            <span class="dual-clock-title">Jam Digital</span>
            <div class="digital-badge large" id="dualDigitalDisplay">07:00</div>
          </div>
        </div>

        <div class="reader-clock-meta">
          <p class="reader-clock-caption" id="dualCaption">Pukul 07.00 tepat (Masuk sekolah)</p>
        </div>

        <div class="clock-preset-buttons" role="group" aria-label="Pilihan perbandingan jam">
          <button type="button" class="dual-preset-btn active" data-time="07:00" data-deg-h="210" data-deg-m="0" data-desc="Pukul 07.00 tepat (Masuk sekolah)">
            07:00
          </button>
          <button type="button" class="dual-preset-btn" data-time="05:00" data-deg-h="150" data-deg-m="0" data-desc="Pukul 05.00 tepat (Bangun tidur)">
            05:00
          </button>
          <button type="button" class="dual-preset-btn" data-time="09:30" data-deg-h="285" data-deg-m="180" data-desc="Pukul 09.30 (Setengah sepuluh / istirahat)">
            09:30
          </button>
          <button type="button" class="dual-preset-btn" data-time="12:00" data-deg-h="360" data-deg-m="0" data-desc="Pukul 12.00 tepat (Makan siang)">
            12:00
          </button>
        </div>
      </div>
    `;
  }

  // =========================================================
  // UNIT 3: LEBIH LAMA ATAU LEBIH CEPAT (SEBENTAR)
  // =========================================================
  if (levelNum === 3) {
    if (itemId === "M005" || itemId.includes("5")) {
      // Lama dan Sebentarnya Waktu (Cerita Olahraga Minggu Kira - Buku Hal. 182 & 185)
      return `
        <div class="interactive-duration-container">
          <!-- Cerita Olahraga Minggu Kira (Hal. 182) -->
          <div class="kira-story-card">
            <div class="kira-story-header">
              <span class="story-badge">Cerita Buku Matematika Hal. 182</span>
              <h4>Olahraga Minggu Bersama Kira</h4>
            </div>
            <p class="kira-story-text">
              Kira berolahraga lari mengelilingi taman mulai <strong>pukul 6 sampai pukul 7 pagi (1 jam)</strong>. 
              Setelah berolahraga, Kira mandi agar badan segar kembali <strong>(15 menit)</strong>.
            </p>

            <!-- Visual Bar Durasi Real-Time -->
            <div class="duration-bars-simulator">
              <div class="sim-row">
                <div class="sim-label">
                  <span class="sim-name">Kira Berolahraga Lari</span>
                  <span class="sim-time-val">1 Jam (60 Menit)</span>
                </div>
                <div class="sim-track">
                  <div class="sim-fill fill-long" id="barOlahraga" style="width: 100%;">
                    <span class="fill-text">LEBIH LAMA</span>
                  </div>
                </div>
              </div>

              <div class="sim-row">
                <div class="sim-label">
                  <span class="sim-name">Kira Mandi Segar</span>
                  <span class="sim-time-val">15 Menit</span>
                </div>
                <div class="sim-track">
                  <div class="sim-fill fill-short" id="barMandi" style="width: 25%;">
                    <span class="fill-text">LEBIH SEBENTAR</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="sim-action-row">
              <button type="button" class="btn-sim-play" id="btnPlayKiraSim">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>Mulai Simulasi Waktu Kira</span>
              </button>
            </div>

            <!-- Kesimpulan Resmi Buku Teks -->
            <div class="kira-verdict-box" id="kiraVerdictBox">
              <div class="verdict-item primary">
                <span class="verdict-check">✓</span>
                <span><strong>Berolahraga</strong> LEBIH LAMA dari <strong>mandi</strong>.</span>
              </div>
              <div class="verdict-item secondary">
                <span class="verdict-check">✓</span>
                <span><strong>Mandi</strong> LEBIH SEBENTAR dari <strong>berolahraga</strong>.</span>
              </div>
            </div>
          </div>

          <!-- Permainan Sortir Keranjang Taktil: Sebentar vs Lama -->
          <div class="sort-game-card">
            <div class="sort-header">
              <h4>Permainan Edukasi: Kelompokkan Kegiatan</h4>
              <p>Sentuh salah satu kegiatan di bawah untuk melihat kelompok durasinya!</p>
            </div>

            <div class="activity-chips-pool" id="activityChipsPool">
              <button type="button" class="chip-act" data-type="sebentar" data-dur="~ 1 Menit">Meminum Segelas Air</button>
              <button type="button" class="chip-act" data-type="lama" data-dur="~ 8 Jam">Tidur Malam</button>
              <button type="button" class="chip-act" data-type="sebentar" data-dur="~ 2 Menit">Menyikat Gigi</button>
              <button type="button" class="chip-act" data-type="lama" data-dur="~ 5 Jam">Belajar di Sekolah</button>
              <button type="button" class="chip-act" data-type="sebentar" data-dur="~ 30 Detik">Mencuci Tangan</button>
              <button type="button" class="chip-act" data-type="lama" data-dur="~ 2 Jam">Memasak Rendang</button>
            </div>

            <div class="baskets-grid">
              <div class="basket-card basket-sebentar" id="basketSebentar">
                <div class="basket-badge green">Kegiatan Sebentar (Menit / Detik)</div>
                <div class="basket-items" id="basketSebentarItems">
                  <span class="basket-placeholder">Sentuh kegiatan sebentar di atas</span>
                </div>
              </div>
              <div class="basket-card basket-lama" id="basketLama">
                <div class="basket-badge purple">Kegiatan Lama (Berjam-jam)</div>
                <div class="basket-items" id="basketLamaItems">
                  <span class="basket-placeholder">Sentuh kegiatan lama di atas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // M006: Membandingkan Durasi Kegiatan
    return `
      <div class="compare-arena-container">
        <div class="arena-header">
          <span class="arena-badge">Ayo Berlatih Hal. 185–186 Soal 3</span>
          <h4>Tantangan: Mana yang Lebih Lama?</h4>
          <p>Pilihlah kegiatan yang membutuhkan waktu <strong>LEBIH LAMA</strong> pada setiap ronde!</p>
        </div>

        <div class="battle-rounds-list">
          <!-- Ronde 1: Menyisir Rambut vs Mandi (Hal. 185 3a) -->
          <div class="battle-card" data-round="1" data-winner="b">
            <div class="battle-num">Ronde 1 (Hal. 185 Soal 3a)</div>
            <div class="battle-versus-grid">
              <button type="button" class="battle-btn" data-choice="a">
                <span class="choice-title">Menyisir Rambut</span>
                <span class="choice-time">~ 1 Menit</span>
              </button>
              <span class="vs-badge">VS</span>
              <button type="button" class="battle-btn" data-choice="b">
                <span class="choice-title">Mandi</span>
                <span class="choice-time">~ 15 Menit</span>
              </button>
            </div>
            <div class="battle-feedback"></div>
          </div>

          <!-- Ronde 2: Tidur Malam vs Menyikat Gigi (Hal. 185 3b) -->
          <div class="battle-card" data-round="2" data-winner="a">
            <div class="battle-num">Ronde 2 (Hal. 185 Soal 3b)</div>
            <div class="battle-versus-grid">
              <button type="button" class="battle-btn" data-choice="a">
                <span class="choice-title">Tidur Malam</span>
                <span class="choice-time">~ 8 Jam</span>
              </button>
              <span class="vs-badge">VS</span>
              <button type="button" class="battle-btn" data-choice="b">
                <span class="choice-title">Menyikat Gigi</span>
                <span class="choice-time">~ 2 Menit</span>
              </button>
            </div>
            <div class="battle-feedback"></div>
          </div>

          <!-- Ronde 3: Belajar di Sekolah vs Sarapan (Hal. 185 3c) -->
          <div class="battle-card" data-round="3" data-winner="a">
            <div class="battle-num">Ronde 3 (Hal. 185 Soal 3c)</div>
            <div class="battle-versus-grid">
              <button type="button" class="battle-btn" data-choice="a">
                <span class="choice-title">Belajar di Sekolah</span>
                <span class="choice-time">~ 5 Jam</span>
              </button>
              <span class="vs-badge">VS</span>
              <button type="button" class="battle-btn" data-choice="b">
                <span class="choice-title">Sarapan Pagi</span>
                <span class="choice-time">~ 15 Menit</span>
              </button>
            </div>
            <div class="battle-feedback"></div>
          </div>

          <!-- Ronde 4: Mencuci Tangan vs Bermain Bola (Hal. 186 3d) -->
          <div class="battle-card" data-round="4" data-winner="b">
            <div class="battle-num">Ronde 4 (Hal. 186 Soal 3d)</div>
            <div class="battle-versus-grid">
              <button type="button" class="battle-btn" data-choice="a">
                <span class="choice-title">Mencuci Tangan</span>
                <span class="choice-time">~ 30 Detik</span>
              </button>
              <span class="vs-badge">VS</span>
              <button type="button" class="battle-btn" data-choice="b">
                <span class="choice-title">Bermain Bola</span>
                <span class="choice-time">~ 1 Jam</span>
              </button>
            </div>
            <div class="battle-feedback"></div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================
  // UNIT 4: MENGENAL WAKTU KEGIATAN
  // =========================================================
  if (levelNum === 4) {
    if (itemId === "M007" || itemId.includes("7")) {
      // Pembagian 4 Waktu Langit & Tanda Alam (Buku Hal. 183 - 184)
      return `
        <div class="sky-simulator-card">
          <!-- Pilihan 4 Fase Waktu -->
          <div class="sky-phase-tabs" role="tablist">
            <button type="button" class="phase-tab active" data-phase="pagi">
              <span class="phase-tab-badge">Fajar</span>
              <span class="phase-name">Pagi Hari</span>
            </button>
            <button type="button" class="phase-tab" data-phase="siang">
              <span class="phase-tab-badge">Terik</span>
              <span class="phase-name">Siang Hari</span>
            </button>
            <button type="button" class="phase-tab" data-phase="sore">
              <span class="phase-tab-badge">Senja</span>
              <span class="phase-name">Sore Hari</span>
            </button>
            <button type="button" class="phase-tab" data-phase="malam">
              <span class="phase-tab-badge">Gelap</span>
              <span class="phase-name">Malam Hari</span>
            </button>
          </div>

          <!-- Viewport Langit yang Berubah Warna & Suasana Dinamis -->
          <div class="sky-viewport sky-pagi" id="skyViewport">
            <div class="sky-info-overlay">
              <div class="sky-clock-badge" id="skyClockBadge">Pukul 06.00 Pagi</div>
              <h3 class="sky-headline" id="skyHeadline">Matahari Baru Terbit</h3>
              <p class="sky-nature-desc" id="skyNatureDesc">Udara masih sejuk, langit berwarna cerah fajar, ayam berkokok menyambut hari.</p>
            </div>
          </div>

          <!-- Kartu Cerita Rutinitas Konkret Buku Teks (Hal. 179-181) -->
          <div class="sky-activity-card" id="skyActivityCard">
            <div class="act-kicker" id="skyActKicker">Kegiatan Pagi Hari:</div>
            <div class="act-content" id="skyActContent">
              Halim bangun tidur (05.00), mandi, sarapan bersama keluarga (06.00), dan bersiap berangkat sekolah (07.00).
            </div>
          </div>

          <!-- Alur Runtut 4 Waktu Buku Teks (Hal. 183) -->
          <div class="timeline-sequence-banner">
            <span class="seq-step active" id="seqPagi">Pagi Hari</span>
            <span class="seq-arrow">→</span>
            <span class="seq-step" id="seqSiang">Siang Hari</span>
            <span class="seq-arrow">→</span>
            <span class="seq-step" id="seqSore">Sore Hari</span>
            <span class="seq-arrow">→</span>
            <span class="seq-step" id="seqMalam">Malam Hari</span>
          </div>
        </div>
      `;
    }

    // M008: Jadwal Waktu Kegiatan Sehari-hari & Urutan Rutinitas (Hal. 184 & 186 Soal 4)
    return `
      <div class="routine-solver-card">
        <div class="routine-header">
          <span class="routine-badge">Ayo Berlatih Hal. 186 Soal 4</span>
          <h4>Permainan: Urutkan Waktu Kegiatan Seharian!</h4>
          <p>Susunlah 4 kegiatan harian Tika berikut agar berurutan dari <strong>Pagi → Siang → Sore → Malam</strong>.</p>
        </div>

        <!-- 4 Slot Urutan Kartu -->
        <div class="routine-cards-deck" id="routineCardsDeck"></div>

        <div class="routine-controls-row">
          <button type="button" class="btn-check-routine" id="btnCheckRoutine">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Periksa Urutan</span>
          </button>
          <button type="button" class="btn-reset-routine" id="btnResetRoutine">Acak Ulang</button>
        </div>

        <div class="routine-feedback-banner" id="routineFeedbackBanner"></div>
      </div>
    `;
  }

  return "";
}

/**
 * Helper menghasilkan 60 tanda dial jam analog
 */
function generateClockTicks() {
  let html = "";
  for (let m = 0; m < 60; m++) {
    const isMajor = m % 5 === 0;
    html += `<div class="clock-tick ${isMajor ? "major" : "minor"}" style="--tick-angle: ${m * 6}deg;"></div>`;
  }
  return html;
}

/**
 * Helper menghasilkan angka 1 sampai 12 jam analog
 */
function generateClockNumbers() {
  let html = "";
  for (let n = 1; n <= 12; n++) {
    html += `<div class="clock-number" style="--angle: ${n * 30}deg;"><span>${n}</span></div>`;
  }
  return html;
}

/**
 * Mengaitkan event click ke tombol interaktif pada peraga lembar flipbook
 * @param {HTMLElement} container 
 */
function initFlipbookInteractiveEvents(container) {
  if (!container || typeof container.querySelectorAll !== "function") return;

  // Preset Jam Analog (Level 1)
  const presetBtns = container.querySelectorAll(".preset-btn");
  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      presetBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const degH = btn.getAttribute("data-deg-h");
      const degM = btn.getAttribute("data-deg-m");
      const desc = btn.getAttribute("data-desc");
      const textH = btn.getAttribute("data-h");
      const textM = btn.getAttribute("data-m");

      const hourHand = container.querySelector("#flipbookHourHand");
      const minuteHand = container.querySelector("#flipbookMinuteHand");
      const badge = container.querySelector("#flipbookDigitalBadge");
      const caption = container.querySelector("#flipbookClockCaption");

      if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${degH}deg)`;
      if (minuteHand) minuteHand.style.transform = `translateX(-50%) rotate(${degM}deg)`;
      if (badge) badge.textContent = `${String(textH).padStart(2, "0")}.${String(textM).padStart(2, "0")}`;
      if (caption) caption.textContent = desc;

      if (typeof playSound === "function") playSound("tick");
    });
  });

  // Preset Jam Dual Analog-Digital (Level 2)
  const dualBtns = container.querySelectorAll(".dual-preset-btn");
  dualBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      dualBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const degH = btn.getAttribute("data-deg-h");
      const degM = btn.getAttribute("data-deg-m");
      const time = btn.getAttribute("data-time");
      const desc = btn.getAttribute("data-desc");

      const hourHand = container.querySelector("#dualHourHand");
      const minuteHand = container.querySelector("#dualMinuteHand");
      const digitalDisplay = container.querySelector("#dualDigitalDisplay");
      const caption = container.querySelector("#dualCaption");

      if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${degH}deg)`;
      if (minuteHand) minuteHand.style.transform = `translateX(-50%) rotate(${degM}deg)`;
      if (digitalDisplay) digitalDisplay.textContent = time;
      if (caption) caption.textContent = desc;

      if (typeof playSound === "function") playSound("tick");
    });
  });

  // Helper fungsi untuk memutar jarum jam dengan sentuhan jari / mouse drag
  function setupDraggableClock(clockFace, hourHand, minuteHand, onTimeChanged) {
    if (!clockFace || !hourHand || !minuteHand) return;
    let activeHand = null;
    let curH = 5;
    let curM = 0;

    function getMetrics(clientX, clientY) {
      const rect = clockFace.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      let deg = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;
      if (deg < 0) deg += 360;
      const dist = Math.hypot(dx, dy);
      const radius = rect.width / 2;
      return { deg, dist, radius };
    }

    function applyChange() {
      const hourAngle = ((curH % 12) + curM / 60) * 30;
      const minuteAngle = curM * 6;
      hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
      minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
      if (typeof onTimeChanged === "function") {
        onTimeChanged(curH, curM);
      }
      if (typeof playSound === "function") playSound("tick");
    }

    clockFace.addEventListener("pointerdown", (e) => {
      if (e.isPrimary === false) return;
      const { dist, radius } = getMetrics(e.clientX, e.clientY);
      const target = e.target;
      if (target.classList.contains("hour-handle") || target === hourHand || target.closest(".hour-hand") === hourHand) {
        activeHand = "hour";
      } else if (target.classList.contains("minute-handle") || target === minuteHand || target.closest(".minute-hand") === minuteHand) {
        activeHand = "minute";
      } else {
        activeHand = dist < (radius * 0.55) ? "hour" : "minute";
      }

      if (clockFace.setPointerCapture) {
        try { clockFace.setPointerCapture(e.pointerId); } catch (err) {}
      }
      clockFace.classList.add("is-dragging");
    });

    clockFace.addEventListener("pointermove", (e) => {
      if (!activeHand) return;
      const { deg } = getMetrics(e.clientX, e.clientY);

      if (activeHand === "minute") {
        const nearest5 = (Math.round(deg / 30) * 5) % 60;
        if (nearest5 !== curM) {
          curM = nearest5;
          applyChange();
        }
      } else if (activeHand === "hour") {
        let nearestH = Math.round(deg / 30) % 12;
        if (nearestH === 0) nearestH = 12;
        if (nearestH !== curH) {
          curH = nearestH;
          applyChange();
        }
      }
    });

    function endDrag(e) {
      if (activeHand) {
        if (clockFace.releasePointerCapture) {
          try { clockFace.releasePointerCapture(e.pointerId); } catch (err) {}
        }
        activeHand = null;
        clockFace.classList.remove("is-dragging");
      }
    }

    clockFace.addEventListener("pointerup", endDrag);
    clockFace.addEventListener("pointercancel", endDrag);
  }

  // Aktifkan Drag untuk Jam Analog Flipbook Unit 1
  const flipClock = container.querySelector("#flipbookClockFace");
  const fHour = container.querySelector("#flipbookHourHand");
  const fMinute = container.querySelector("#flipbookMinuteHand");
  const fBadge = container.querySelector("#flipbookDigitalBadge");
  const fCaption = container.querySelector("#flipbookClockCaption");

  if (flipClock && fHour && fMinute) {
    setupDraggableClock(flipClock, fHour, fMinute, (h, m) => {
      presetBtns.forEach(b => b.classList.remove("active"));
      if (fBadge) fBadge.textContent = `${String(h).padStart(2, "0")}.${String(m).padStart(2, "0")}`;
      if (fCaption) {
        if (m === 0) {
          fCaption.innerHTML = `Pukul <strong>${h}.00</strong> tepat (Jarum panjang di angka 12)`;
        } else if (m === 30) {
          const nextH = (h % 12) + 1;
          fCaption.innerHTML = `Pukul <strong>${String(h).padStart(2, "0")}.30</strong> (Setengah ${nextH})`;
        } else {
          fCaption.innerHTML = `Pukul <strong>${String(h).padStart(2, "0")}.${String(m).padStart(2, "0")}</strong>`;
        }
      }
    });
  }

  // Aktifkan Drag untuk Jam Analog Perbandingan Unit 2
  const dualClock = container.querySelector("#flipbookDualAnalog");
  const dHour = container.querySelector("#dualHourHand");
  const dMinute = container.querySelector("#dualMinuteHand");
  const dDisplay = container.querySelector("#dualDigitalDisplay");
  const dCaption = container.querySelector("#dualCaption");

  if (dualClock && dHour && dMinute) {
    setupDraggableClock(dualClock, dHour, dMinute, (h, m) => {
      dualBtns.forEach(b => b.classList.remove("active"));
      const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      if (dDisplay) dDisplay.textContent = timeStr;
      if (dCaption) {
        if (m === 0) {
          dCaption.innerHTML = `Pukul <strong>${timeStr}</strong> tepat`;
        } else {
          dCaption.innerHTML = `Pukul <strong>${timeStr}</strong>`;
        }
      }
    });
  }

  // 1. Digital Interactive Console (Unit 2 - M003)
  const digiConsole = container.querySelector(".digital-interactive-console");
  if (digiConsole) {
    let dH = 5;
    let dM = 0;
    const hourText = digiConsole.querySelector("#digiHourText");
    const minText = digiConsole.querySelector("#digiMinText");
    const lblH = digiConsole.querySelector("#lblHour");
    const lblM = digiConsole.querySelector("#lblMin");
    const readAloud = container.querySelector("#digiReadAloud");
    const presetDigiBtns = container.querySelectorAll(".preset-digi-btn");

    function renderDigi(h, m, customRead = null) {
      dH = (Number(h) % 12) || 12;
      dM = Number(m) % 60;
      const hStr = String(dH).padStart(2, "0");
      const mStr = String(dM).padStart(2, "0");

      if (hourText) hourText.textContent = hStr;
      if (minText) minText.textContent = mStr;
      if (lblH) lblH.textContent = hStr;
      if (lblM) lblM.textContent = mStr;

      if (readAloud) {
        if (customRead) {
          readAloud.innerHTML = `Jam ini dibaca: <strong>${customRead}</strong>`;
        } else if (dM === 0) {
          readAloud.innerHTML = `Jam ini dibaca: <strong>Pukul ${hStr}.00 tepat</strong>`;
        } else if (dM === 30) {
          const nextH = (dH % 12) + 1;
          readAloud.innerHTML = `Jam ini dibaca: <strong>Pukul ${hStr}.30 (Setengah ${nextH})</strong>`;
        } else {
          readAloud.innerHTML = `Jam ini dibaca: <strong>Pukul ${hStr} lewat ${mStr} menit</strong>`;
        }
      }
      if (typeof playSound === "function") playSound("tick");
    }

    digiConsole.querySelectorAll(".btn-digi-step").forEach(btn => {
      btn.addEventListener("click", () => {
        presetDigiBtns.forEach(b => b.classList.remove("active"));
        const act = btn.getAttribute("data-digi-act");
        if (act === "+h") {
          renderDigi((dH % 12) + 1, dM);
        } else if (act === "-h") {
          renderDigi(dH - 1 <= 0 ? 12 : dH - 1, dM);
        } else if (act === "+m") {
          let nm = dM + 15;
          let nh = dH;
          if (nm >= 60) {
            nm -= 60;
            nh = (dH % 12) + 1;
          }
          renderDigi(nh, nm);
        } else if (act === "-m") {
          let nm = dM - 15;
          let nh = dH;
          if (nm < 0) {
            nm += 60;
            nh = dH - 1 <= 0 ? 12 : dH - 1;
          }
          renderDigi(nh, nm);
        }
      });
    });

    presetDigiBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        presetDigiBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const h = btn.getAttribute("data-h");
        const m = btn.getAttribute("data-m");
        const read = btn.getAttribute("data-read");
        renderDigi(h, m, read);
      });
    });
  }

  // 2. Kira Duration Simulator & Sorting Game (Unit 3 - M005)
  const btnKira = container.querySelector("#btnPlayKiraSim");
  if (btnKira) {
    const barOlahraga = container.querySelector("#barOlahraga");
    const barMandi = container.querySelector("#barMandi");
    const verdictBox = container.querySelector("#kiraVerdictBox");

    btnKira.addEventListener("click", () => {
      btnKira.disabled = true;
      if (barOlahraga) barOlahraga.style.width = "0%";
      if (barMandi) barMandi.style.width = "0%";
      if (verdictBox) verdictBox.style.opacity = "0.3";

      if (typeof playSound === "function") playSound("tick");

      setTimeout(() => {
        if (barMandi) {
          barMandi.style.transition = "width 0.8s ease";
          barMandi.style.width = "25%";
        }
      }, 200);

      setTimeout(() => {
        if (barOlahraga) {
          barOlahraga.style.transition = "width 1.6s ease";
          barOlahraga.style.width = "100%";
        }
      }, 300);

      setTimeout(() => {
        if (verdictBox) {
          verdictBox.style.transition = "opacity 0.4s ease";
          verdictBox.style.opacity = "1";
        }
        btnKira.disabled = false;
        if (typeof playSound === "function") playSound("correct");
      }, 1900);
    });
  }

  // Permainan Sortir Keranjang (Sebentar vs Lama)
  const chipsPool = container.querySelector("#activityChipsPool");
  if (chipsPool) {
    const basketSebentarItems = container.querySelector("#basketSebentarItems");
    const basketLamaItems = container.querySelector("#basketLamaItems");

    chipsPool.querySelectorAll(".chip-act").forEach(chip => {
      chip.addEventListener("click", () => {
        const type = chip.getAttribute("data-type");
        const dur = chip.getAttribute("data-dur");
        const text = chip.textContent;

        const targetBasket = type === "sebentar" ? basketSebentarItems : basketLamaItems;
        if (targetBasket) {
          // Hapus placeholder jika ada
          const placeholder = targetBasket.querySelector(".basket-placeholder");
          if (placeholder) placeholder.remove();

          const itemPill = document.createElement("div");
          itemPill.className = `basket-pill ${type}`;
          itemPill.innerHTML = `<span>${text}</span> <small>${dur}</small>`;
          targetBasket.appendChild(itemPill);

          chip.style.display = "none";
          if (typeof playSound === "function") playSound("tick");

          const remaining = chipsPool.querySelectorAll(".chip-act:not([style*='display: none'])");
          if (remaining.length === 0) {
            chipsPool.innerHTML = `<div class="praise-banner">🎉 Hebat! Kamu sudah mengelompokkan semua kegiatan dengan benar!</div>`;
            if (typeof playSound === "function") playSound("correct");
          }
        }
      });
    });
  }

  // 3. Duration Battle Rounds (Unit 3 - M006)
  const battleCards = container.querySelectorAll(".battle-card");
  battleCards.forEach(card => {
    const winner = card.getAttribute("data-winner");
    const btns = card.querySelectorAll(".battle-btn");
    const feedback = card.querySelector(".battle-feedback");

    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        const choice = btn.getAttribute("data-choice");
        btns.forEach(b => b.classList.remove("choice-correct", "choice-wrong"));

        if (choice === winner) {
          btn.classList.add("choice-correct");
          if (feedback) {
            const winnerTitle = btn.querySelector(".choice-title")?.textContent || "";
            const winnerTime = btn.querySelector(".choice-time")?.textContent || "";
            feedback.innerHTML = `<span class="fb-success">✓ Benar! <strong>${winnerTitle} (${winnerTime})</strong> membutuhkan waktu LEBIH LAMA!</span>`;
          }
          if (typeof playSound === "function") playSound("correct");
        } else {
          btn.classList.add("choice-wrong");
          if (feedback) {
            feedback.innerHTML = `<span class="fb-hint">Kurang tepat. Pilihlah kegiatan yang butuh waktu berjam-jam atau lebih panjang!</span>`;
          }
          if (typeof playSound === "function") playSound("wrong");
        }
      });
    });
  });

  // 4. Sky & 4 Time Phases Simulator (Unit 4 - M007)
  const phaseTabs = container.querySelectorAll(".sky-phase-tabs .phase-tab");
  if (phaseTabs.length > 0) {
    const skyViewport = container.querySelector("#skyViewport");
    const skyClockBadge = container.querySelector("#skyClockBadge");
    const skyHeadline = container.querySelector("#skyHeadline");
    const skyNatureDesc = container.querySelector("#skyNatureDesc");
    const skyActKicker = container.querySelector("#skyActKicker");
    const skyActContent = container.querySelector("#skyActContent");

    const phaseData = {
      pagi: {
        skyClass: "sky-pagi",
        badge: "Pukul 06.00 Pagi",
        headline: "Matahari Baru Terbit",
        nature: "Udara masih sejuk, ayam jantan berkokok, langit berwarna fajar keemasan menyambut hari.",
        actKicker: "Kegiatan Pagi Hari (Hal. 179 Buku Teks):",
        actContent: "Halim bangun tidur pukul 05.00, mandi, Tika sarapan pagi pukul 06.00, lalu berangkat sekolah pukul 07.00.",
        seqId: "#seqPagi"
      },
      siang: {
        skyClass: "sky-siang",
        badge: "Pukul 12.00 Siang",
        headline: "Matahari Terik di Puncak Langit",
        nature: "Matahari berada tepat di atas kepala, suasana sangat terang benderang dan udara terasa hangat.",
        actKicker: "Kegiatan Siang Hari (Hal. 180 Buku Teks):",
        actContent: "Tika dan teman-teman belajar di kelas, lalu istirahat dan makan siang bersama di Kantin Sehat pukul 12.00 siang.",
        seqId: "#seqSiang"
      },
      sore: {
        skyClass: "sky-sore",
        badge: "Pukul 16.00 Sore",
        headline: "Matahari Mulai Condong ke Barat",
        nature: "Sinar matahari mulai redup, langit berubah warna jingga keemasan menjelang waktu senja.",
        actKicker: "Kegiatan Sore Hari (Hal. 180 Buku Teks):",
        actContent: "Tika bermain bersama adik di taman dekat rumah pukul 4 sore (16.00), setelah itu mandi sore agar badan segar.",
        seqId: "#seqSore"
      },
      malam: {
        skyClass: "sky-malam",
        badge: "Pukul 21.00 Malam",
        headline: "Langit Gelap Berbintang",
        nature: "Matahari telah terbenam, rembulan dan ribuan bintang bersinar menerangi kegelapan malam yang tenang.",
        actKicker: "Kegiatan Malam Hari (Hal. 181 Buku Teks):",
        actContent: "Makan malam bersama keluarga, mengulang pelajaran sekolah, dan Tika tidur malam sejak pukul 9 malam (21.00).",
        seqId: "#seqMalam"
      }
    };

    phaseTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        phaseTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const phase = tab.getAttribute("data-phase");
        const data = phaseData[phase];
        if (!data) return;

        if (skyViewport) {
          skyViewport.className = `sky-viewport ${data.skyClass}`;
        }
        if (skyClockBadge) skyClockBadge.textContent = data.badge;
        if (skyHeadline) skyHeadline.textContent = data.headline;
        if (skyNatureDesc) skyNatureDesc.textContent = data.nature;
        if (skyActKicker) skyActKicker.textContent = data.actKicker;
        if (skyActContent) skyActContent.textContent = data.actContent;

        container.querySelectorAll(".timeline-sequence-banner .seq-step").forEach(s => s.classList.remove("active"));
        const activeSeq = container.querySelector(data.seqId);
        if (activeSeq) activeSeq.classList.add("active");

        if (typeof playSound === "function") playSound("tick");
      });
    });
  }

  // 5. Routine Sequence Arranger Game (Unit 4 - M008 - Hal. 186 Soal 4)
  const routineDeck = container.querySelector("#routineCardsDeck");
  if (routineDeck) {
    const routineItems = [
      { id: 1, label: "Pagi (06.00)", title: "Sarapan Pagi", desc: "Makan bersama keluarga sebelum sekolah (Hal. 179)" },
      { id: 2, label: "Siang (12.00)", title: "Makan di Kantin Sehat", desc: "Makan siang bersama teman saat istirahat (Hal. 180)" },
      { id: 3, label: "Sore (16.00)", title: "Bermain Bersama Adik", desc: "Bermain di taman dekat rumah (Hal. 180)" },
      { id: 4, label: "Malam (21.00)", title: "Tidur Malam Nyenyak", desc: "Istirahat malam sejak pukul 9 malam (Hal. 181)" }
    ];

    let currentOrder = [3, 1, 4, 2];

    function renderDeck() {
      routineDeck.innerHTML = "";
      currentOrder.forEach((itemId, idx) => {
        const item = routineItems.find(r => r.id === itemId);
        if (!item) return;

        const card = document.createElement("div");
        card.className = "routine-arrange-card";
        card.innerHTML = `
          <div class="card-slot-badge">Slot ${idx + 1}</div>
          <div class="card-title">${item.title}</div>
          <div class="card-time-tag">${item.label}</div>
          <p class="card-desc">${item.desc}</p>
          <div class="card-actions">
            <button type="button" class="btn-swap left" ${idx === 0 ? "disabled" : ""} data-idx="${idx}" data-dir="-1" title="Geser ke kiri">◀ Geser</button>
            <button type="button" class="btn-swap right" ${idx === currentOrder.length - 1 ? "disabled" : ""} data-idx="${idx}" data-dir="1" title="Geser ke kanan">Geser ▶</button>
          </div>
        `;
        routineDeck.appendChild(card);
      });

      routineDeck.querySelectorAll(".btn-swap").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-idx"), 10);
          const dir = parseInt(btn.getAttribute("data-dir"), 10);
          const targetIdx = idx + dir;
          if (targetIdx >= 0 && targetIdx < currentOrder.length) {
            const temp = currentOrder[idx];
            currentOrder[idx] = currentOrder[targetIdx];
            currentOrder[targetIdx] = temp;
            renderDeck();
            if (typeof playSound === "function") playSound("tick");
          }
        });
      });
    }

    renderDeck();

    const btnCheck = container.querySelector("#btnCheckRoutine");
    const btnReset = container.querySelector("#btnResetRoutine");
    const fbBanner = container.querySelector("#routineFeedbackBanner");

    if (btnCheck) {
      btnCheck.addEventListener("click", () => {
        const isCorrect = currentOrder.every((id, idx) => id === idx + 1);
        if (isCorrect) {
          if (fbBanner) {
            fbBanner.className = "routine-feedback-banner success";
            fbBanner.innerHTML = `🎉 <strong>Luar Biasa!</strong> Urutan kegiatan seharian sudah tepat: <em>Pagi (Sarapan) → Siang (Kantin Sehat) → Sore (Bermain) → Malam (Tidur Nyenyak)</em>.`;
          }
          if (typeof playSound === "function") playSound("correct");
        } else {
          if (fbBanner) {
            fbBanner.className = "routine-feedback-banner error";
            fbBanner.innerHTML = `❌ <strong>Belum Tepat.</strong> Ingat urutan waktu: Pagi (Sarapan) → Siang (Kantin) → Sore (Bermain) → Malam (Tidur). Gunakan tombol ◀ Geser ▶ untuk menukar posisi kartu!`;
          }
          if (typeof playSound === "function") playSound("wrong");
        }
      });
    }

    if (btnReset) {
      btnReset.addEventListener("click", () => {
        currentOrder = [4, 2, 1, 3];
        renderDeck();
        if (fbBanner) {
          fbBanner.className = "routine-feedback-banner";
          fbBanner.innerHTML = "";
        }
        if (typeof playSound === "function") playSound("tick");
      });
    }
  }
}

/**
 * Berpindah ke lembar tertentu pada Flipbook
 * @param {number} targetPage 
 */
function flipToPage(targetPage) {
  if (targetPage < 0 || targetPage >= flipbookMaterials.length) return;
  if (targetPage === currentFlipbookPage) return;

  currentFlipbookPage = targetPage;
  if (typeof playSound === "function") {
    playSound("pageTurn");
  }
  renderFlipbook();
}

/**
 * Inisialisasi event listener navigasi siswa, keyboard & gesture
 */
function initStudentEvents() {
  // === Tombol Hero: Pelajari Materi ===
  const continueBtn = $("continueLearningBtn");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      openMaterial(1);
    });
  }

  // === Tombol Hero: Langsung Kuis ===
  const heroQuizBtn = $("heroStartQuizBtn");
  if (heroQuizBtn) {
    heroQuizBtn.addEventListener("click", () => {
      // Cari level pertama yang belum selesai
      const completedLevels = currentStudent ? (currentStudent.completedLevels || []) : [];
      let targetLevel = 1;
      for (let i = 1; i <= 4; i++) {
        if (!completedLevels.includes(i)) {
          targetLevel = i;
          break;
        }
      }
      tryStartQuizForLevel(targetLevel);
    });
  }

  // === Tombol "Kuis Level Ini" di navbar reader (materi) ===
  const materialToQuizBtn = $("materialToQuizBtn");
  if (materialToQuizBtn) {
    materialToQuizBtn.addEventListener("click", () => {
      if (typeof startQuiz === "function") {
        startQuiz(currentMaterialLevel);
      }
    });
  }

  // === Tombol "Baca Materi" di navbar kuis ===
  const quizReviewMaterialBtn = $("quizReviewMaterialBtn");
  if (quizReviewMaterialBtn) {
    quizReviewMaterialBtn.addEventListener("click", () => {
      openMaterial(currentMaterialLevel);
    });
  }

  // === Modal "Pelajari Materi Dulu" ===
  const needStudyCloseBtn = $("needStudyCloseBtn");
  if (needStudyCloseBtn) {
    needStudyCloseBtn.addEventListener("click", closeNeedStudyModal);
  }

  const needStudyOpenMateriBtn = $("needStudyOpenMateriBtn");
  if (needStudyOpenMateriBtn) {
    needStudyOpenMateriBtn.addEventListener("click", () => {
      const modal = $("needStudyModal");
      const levelId = modal ? Number(modal.dataset.levelId || 1) : 1;
      closeNeedStudyModal();
      openMaterial(levelId);
    });
  }

  const needStudyBypassQuizBtn = $("needStudyBypassQuizBtn");
  if (needStudyBypassQuizBtn) {
    needStudyBypassQuizBtn.addEventListener("click", () => {
      const modal = $("needStudyModal");
      const levelId = modal ? Number(modal.dataset.levelId || 1) : 1;
      closeNeedStudyModal();
      // Bypass: langsung mulai kuis tanpa baca materi
      if (typeof startQuiz === "function") {
        startQuiz(levelId);
      }
    });
  }

  // === Kembali dari Materi ke Beranda ===
  const materialBackBtn = $("materialBackBtn");
  if (materialBackBtn) {
    materialBackBtn.addEventListener("click", () => {
      showStudentPage("homeScreen");
      renderHome();
    });
  }

  // Navigasi Lembar Flipbook Sebelumnya
  const prevBtn = $("prevPageBtn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentFlipbookPage > 0) {
        flipToPage(currentFlipbookPage - 1);
      }
    });
  }

  // Navigasi Lembar Flipbook Selanjutnya / Selesai Kuis
  const nextBtn = $("nextPageBtn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentFlipbookPage < flipbookMaterials.length - 1) {
        flipToPage(currentFlipbookPage + 1);
      } else {
        // Jika sudah di lembar terakhir, langsung mulai kuis
        if (typeof startQuiz === "function") {
          startQuiz(currentMaterialLevel);
        }
      }
    });
  }

  // Dukungan Keyboard Panah Kiri dan Kanan untuk Membalik Lembar
  document.addEventListener("keydown", event => {
    const matScreen = $("materialScreen");
    if (matScreen && !matScreen.classList.contains("hidden")) {
      if (event.key === "ArrowLeft") {
        if (currentFlipbookPage > 0) flipToPage(currentFlipbookPage - 1);
      } else if (event.key === "ArrowRight") {
        if (currentFlipbookPage < flipbookMaterials.length - 1) {
          flipToPage(currentFlipbookPage + 1);
        }
      }
    }
  });

  // Dukungan Gesture Usap (Touch Swipe) di Layar Ponsel
  const bookEl = $("flipbookBook");
  if (bookEl) {
    let touchStartX = 0;
    let touchEndX = 0;

    bookEl.addEventListener("touchstart", e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    bookEl.addEventListener("touchend", e => {
      touchEndX = e.changedTouches[0].screenX;
      const diffX = touchEndX - touchStartX;
      if (Math.abs(diffX) > 45) {
        if (diffX < 0) {
          // Swipe kiri -> halaman berikutnya
          if (currentFlipbookPage < flipbookMaterials.length - 1) {
            flipToPage(currentFlipbookPage + 1);
          }
        } else {
          // Swipe kanan -> halaman sebelumnya
          if (currentFlipbookPage > 0) {
            flipToPage(currentFlipbookPage - 1);
          }
        }
      }
    }, { passive: true });
  }
}

