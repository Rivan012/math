/* =========================================================
   TIME QUEST
   student.js - Beranda Siswa, Peta Level, dan Materi Belajar
   ========================================================= */

"use strict";

const ICON_BOOK = `<svg class="action-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
const ICON_TROPHY = `<svg class="action-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"></path><path d="M6 2h12v7a6 6 0 0 1-12 0V2z"></path></svg>`;
const ICON_LOCK = `<svg class="action-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
const ICON_CHECK = `<svg class="action-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

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
  },
  {
    id: 5,
    title: "Kuis Campuran Waktu",
    icon: "assets/icons/level-5.svg",
    description: "Uji kemampuanmu mengenal jam dan waktu!"
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
  if (homeLevel) homeLevel.textContent = Math.min(completed + 1, LEVELS.length) + " / " + LEVELS.length;

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

  // Jika belum baca materi, tampilkan modal reminder (skip untuk level quiz-only)
  if (levelId !== 5 && !hasStudiedLevel(levelId) && !completedLevels.includes(levelId)) {
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
      ? `<span class="level-status-pill done">${ICON_CHECK} Tuntas</span>`
      : studied
        ? `<span class="level-status-pill studying">Sudah Belajar</span>`
        : unlocked
          ? `<span class="level-status-pill ready">Buka Misi</span>`
          : `<span class="level-status-pill locked">${ICON_LOCK} Terkunci</span>`;

    // Tombol Materi (hidden for quiz-only levels)
    let materiClass, materiLabel;
    const isQuizOnly = level.id === 5;
    if (isQuizOnly) {
      materiClass = "btn-card-action btn-materi hidden";
      materiLabel = "";
    } else if (!unlocked) {
      materiClass = "btn-card-action btn-materi is-locked";
      materiLabel = `${ICON_LOCK} Terkunci`;
    } else if (studied || completed) {
      materiClass = "btn-card-action btn-materi is-understood";
      materiLabel = `${ICON_BOOK} Baca Ulang`;
    } else {
      materiClass = "btn-card-action btn-materi is-primary";
      materiLabel = `${ICON_BOOK} Baca Materi`;
    }

    // Tombol Kuis
    let quizClass, quizLabel;
    if (!unlocked) {
      quizClass = "btn-card-action btn-quiz is-locked";
      quizLabel = `${ICON_LOCK} Terkunci`;
    } else if (completed) {
      quizClass = "btn-card-action btn-quiz is-completed";
      quizLabel = `${ICON_TROPHY} Kuis Ulang`;
    } else if (studied) {
      quizClass = "btn-card-action btn-quiz is-ready";
      quizLabel = `${ICON_TROPHY} Mulai Kuis`;
    } else {
      quizClass = "btn-card-action btn-quiz is-need-study";
      quizLabel = `${ICON_TROPHY} Mulai Kuis`;
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
        <button class="${quizClass}${isQuizOnly ? ' btn-full-width' : ''}" data-level="${level.id}" data-action="quiz" type="button">${quizLabel}</button>
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

      ${currentItem.img ? `
        <div class="reader-custom-img-wrap" style="text-align:center;margin:16px 0;">
          <img src="${currentItem.img}" alt="${escapeHTML(currentItem.judul || 'Materi')}" style="max-width:100%;max-height:260px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);object-fit:contain;background:#fff;border:1px solid var(--border);">
        </div>
      ` : ""}

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
            <div class="clock-face material-dynamic-clock interactive-clock-face" id="flipbookDualAnalog">
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
    // Lama dan Sebentarnya Waktu (Buku Teks Kurikulum Merdeka Matematika Kelas 2)
    return `
        <div class="materi3-container">
          <!-- 1. Header Banner Asli Buku Teks: "Lama dan sebentarnya waktu" -->
          <div class="materi3-header-card">
            <img src="assets/images/materi3_header.png" alt="Lama dan sebentarnya waktu" class="materi3-header-img">
          </div>

          <!-- 2. Bilah Filter & Mode Poster Buku Asli -->
          <div class="materi3-controls-bar">
            <div class="materi3-filter-group" role="group" aria-label="Filter Durasi Waktu">
              <button type="button" class="materi3-filter-btn active" data-filter="all">Semua (4)</button>
              <button type="button" class="materi3-filter-btn" data-filter="sebentar">⏱️ Sebentar (2)</button>
              <button type="button" class="materi3-filter-btn" data-filter="lama">⏳ Lama (2)</button>
            </div>
            <button type="button" class="materi3-toggle-poster-btn" id="btnTogglePoster">
              📖 Lihat Lembar Buku Asli
            </button>
          </div>

          <!-- Tampilan Lembar Buku Lengkap (Bisa Dibuka/Ditutup) -->
          <div class="materi3-poster-view hidden" id="materi3PosterView">
            <img src="assets/images/materi3_full.png" alt="Lembar Buku Matematika Asli: Lama dan Sebentarnya Waktu" class="materi3-poster-img">
          </div>

          <!-- 3. Grid 4 Kartu Panel Ilustrasi Asli (2x2 Persis Seperti Gambar Buku) -->
          <div class="materi3-grid" id="materi3Grid">
            <!-- Panel 1: Meminum (Sebentar) -->
            <div class="materi3-card" data-category="sebentar" data-act="minum" tabindex="0" role="button" aria-label="Meminum memerlukan waktu sebentar">
              <div class="materi3-card-badge sebentar">
                <span class="badge-icon">⏱️</span> SEBENTAR
              </div>
              <div class="materi3-img-wrap">
                <img src="assets/images/materi3_minum.png" alt="Meminum memerlukan waktu sebentar" class="materi3-card-img">
              </div>
              <div class="materi3-card-footer">
                <h4 class="materi3-card-title">Meminum</h4>
                <p class="materi3-card-caption">Meminum memerlukan waktu <strong>sebentar</strong>.</p>
                <span class="materi3-card-time">Durasi: beberapa detik hingga 1 menit</span>
              </div>
            </div>

            <!-- Panel 2: Memasak (Lama) -->
            <div class="materi3-card" data-category="lama" data-act="memasak" tabindex="0" role="button" aria-label="Memasak memerlukan waktu lama">
              <div class="materi3-card-badge lama">
                <span class="badge-icon">⏳</span> LAMA
              </div>
              <div class="materi3-img-wrap">
                <img src="assets/images/materi3_memasak.png" alt="Memasak memerlukan waktu lama" class="materi3-card-img">
              </div>
              <div class="materi3-card-footer">
                <h4 class="materi3-card-title">Memasak</h4>
                <p class="materi3-card-caption">Memasak memerlukan waktu <strong>lama</strong>.</p>
                <span class="materi3-card-time">Durasi: 30 menit hingga berjam-jam</span>
              </div>
            </div>

            <!-- Panel 3: Tidur (Lama) -->
            <div class="materi3-card" data-category="lama" data-act="tidur" tabindex="0" role="button" aria-label="Tidur memerlukan waktu lama">
              <div class="materi3-card-badge lama">
                <span class="badge-icon">⏳</span> LAMA
              </div>
              <div class="materi3-img-wrap">
                <img src="assets/images/materi3_tidur.png" alt="Tidur memerlukan waktu lama" class="materi3-card-img">
              </div>
              <div class="materi3-card-footer">
                <h4 class="materi3-card-title">Tidur Malam</h4>
                <p class="materi3-card-caption">Tidur memerlukan waktu <strong>lama</strong>.</p>
                <span class="materi3-card-time">Durasi: sekitar 8 jam dari malam ke pagi</span>
              </div>
            </div>

            <!-- Panel 4: Gosok Gigi (Sebentar) -->
            <div class="materi3-card" data-category="sebentar" data-act="gosok" tabindex="0" role="button" aria-label="Gosok gigi memerlukan waktu sebentar">
              <div class="materi3-card-badge sebentar">
                <span class="badge-icon">⏱️</span> SEBENTAR
              </div>
              <div class="materi3-img-wrap">
                <img src="assets/images/materi3_gosok_gigi.png" alt="Gosok gigi memerlukan waktu sebentar" class="materi3-card-img">
              </div>
              <div class="materi3-card-footer">
                <h4 class="materi3-card-title">Gosok Gigi</h4>
                <p class="materi3-card-caption">Gosok gigi memerlukan waktu <strong>sebentar</strong>.</p>
                <span class="materi3-card-time">Durasi: sekitar 2 menit di wastafel</span>
              </div>
            </div>
          </div>

          <!-- 4. Papan Edukasi Interaktif Dinamis saat Kartu Disentuh -->
          <div class="materi3-info-banner" id="materi3InfoBanner">
            <div class="info-icon">💡</div>
            <div class="info-text" id="materi3InfoText">
              <strong>Sentuh salah satu kartu kegiatan di atas</strong> untuk melihat penjelasan konsep waktu!
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
        <div class="sky-simulator-card materi4-poster-container">
          <!-- Poster Header Banner -->
          <div class="materi4-poster-header">
            <img src="assets/images/waktu_header_full.png" alt="Pagi, siang, sore dan malam" class="materi4-header-img">
          </div>

          <!-- Pilihan 4 Fase Waktu -->
          <div class="sky-phase-tabs" role="tablist">
            <button type="button" class="phase-tab active" data-phase="pagi">
              <span class="phase-tab-badge">05.00</span>
              <span class="phase-name">Pagi Hari</span>
            </button>
            <button type="button" class="phase-tab" data-phase="siang">
              <span class="phase-tab-badge">01.00</span>
              <span class="phase-name">Siang Hari</span>
            </button>
            <button type="button" class="phase-tab" data-phase="sore">
              <span class="phase-tab-badge">04.00</span>
              <span class="phase-name">Sore Hari</span>
            </button>
            <button type="button" class="phase-tab" data-phase="malam">
              <span class="phase-tab-badge">09.00</span>
              <span class="phase-name">Malam Hari</span>
            </button>
          </div>

          <!-- Poster 2x2 Grid (4 Waktu Kegiatan) -->
          <div class="materi4-grid">
            <div class="materi4-card active" data-phase="pagi" tabindex="0" role="button" aria-label="Aku bangun tidur pukul 5 pagi">
              <img src="assets/images/waktu_pagi.png" alt="Aku bangun tidur pukul 5 pagi." class="materi4-img">
            </div>
            <div class="materi4-card" data-phase="siang" tabindex="0" role="button" aria-label="Nando pulang sekolah pukul 1 siang">
              <img src="assets/images/waktu_siang.png" alt="Nando pulang sekolah pukul 1 siang." class="materi4-img">
            </div>
            <div class="materi4-card" data-phase="sore" tabindex="0" role="button" aria-label="Aku bermain di taman pukul 4 sore">
              <img src="assets/images/waktu_sore.png" alt="Aku bermain di taman pukul 4 sore." class="materi4-img">
            </div>
            <div class="materi4-card" data-phase="malam" tabindex="0" role="button" aria-label="Nando belajar pukul 9 malam">
              <img src="assets/images/waktu_malam.png" alt="Nando belajar pukul 9 malam." class="materi4-img">
            </div>
          </div>

          <!-- Viewport Langit yang Berubah Warna & Suasana Dinamis -->
          <div class="sky-viewport sky-pagi" id="skyViewport">
            <div class="sky-info-overlay">
              <div class="sky-clock-badge" id="skyClockBadge">Pukul 05.00 Pagi</div>
              <h3 class="sky-headline" id="skyHeadline">Aku bangun tidur pukul 5 pagi.</h3>
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
            <span class="seq-step active" id="seqPagi">Pagi (05.00)</span>
            <span class="seq-arrow">→</span>
            <span class="seq-step" id="seqSiang">Siang (01.00)</span>
            <span class="seq-arrow">→</span>
            <span class="seq-step" id="seqSore">Sore (04.00)</span>
            <span class="seq-arrow">→</span>
            <span class="seq-step" id="seqMalam">Malam (09.00)</span>
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

  // 2. Materi 3 Interaktif: 4 Panel Durasi Buku Teks (M005)
  const mat3Cards = container.querySelectorAll(".materi3-card");
  const mat3InfoText = container.querySelector("#materi3InfoText");
  const mat3FilterBtns = container.querySelectorAll(".materi3-filter-btn");
  const btnTogglePoster = container.querySelector("#btnTogglePoster");
  const posterView = container.querySelector("#materi3PosterView");

  if (mat3Cards.length > 0) {
    const actDetails = {
      minum: "💧 <strong>Meminum air</strong> memerlukan waktu <strong>SEBENTAR</strong> (hanya beberapa detik hingga 1 menit).",
      memasak: "🍳 <strong>Memasak makanan</strong> memerlukan waktu <strong>LAMA</strong> (harus menunggu matang di kompor sekitar 30 menit hingga berjam-jam).",
      tidur: "🌙 <strong>Tidur malam</strong> memerlukan waktu <strong>LAMA</strong> (tubuh kita beristirahat sepanjang malam sekitar 8 jam hingga pagi hari).",
      gosok: "🪥 <strong>Gosok gigi</strong> memerlukan waktu <strong>SEBENTAR</strong> (cukup menyikat gigi secara merata sekitar 2 menit di wastafel)."
    };

    mat3Cards.forEach(card => {
      card.addEventListener("click", () => {
        mat3Cards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        const act = card.getAttribute("data-act");
        if (mat3InfoText && actDetails[act]) {
          mat3InfoText.innerHTML = actDetails[act];
        }
        if (typeof playSound === "function") playSound("tick");
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    mat3FilterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        mat3FilterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.getAttribute("data-filter");

        mat3Cards.forEach(card => {
          const cat = card.getAttribute("data-category");
          if (filter === "all" || cat === filter) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
        if (typeof playSound === "function") playSound("tick");
      });
    });

    if (btnTogglePoster && posterView) {
      btnTogglePoster.addEventListener("click", () => {
        const isHidden = posterView.classList.toggle("hidden");
        btnTogglePoster.textContent = isHidden ? "📖 Lihat Lembar Buku Asli" : "✕ Tutup Lembar Buku";
        if (typeof playSound === "function") playSound("tick");
      });
    }
  }

  // 4. Sky & 4 Time Phases Simulator (Unit 4 - M007)
  const phaseTabs = container.querySelectorAll(".sky-phase-tabs .phase-tab");
  if (phaseTabs.length > 0) {
    const skyViewport = container.querySelector("#skyViewport");
    const skyClockBadge = container.querySelector("#skyClockBadge");
    const skyHeadline = container.querySelector("#skyHeadline");
    const skyNatureDesc = container.querySelector("#skyNatureDesc");
    const skyActKicker = container.querySelector("#skyActKicker");
    const skyActContent = container.querySelector("#skyActContent");
    const posterCards = container.querySelectorAll(".materi4-card");

    const phaseData = {
      pagi: {
        skyClass: "sky-pagi",
        badge: "Pukul 05.00 Pagi",
        headline: "Aku bangun tidur pukul 5 pagi.",
        nature: "Matahari mulai terbit di ufuk timur, udara sejuk fajar menyapa saat bangun pagi.",
        actKicker: "Kegiatan Pagi Hari:",
        actContent: "Halim dan Tika bangun tidur pukul 05.00 pagi, merapikan kasur, mandi, sarapan, dan bersiap sekolah.",
        seqId: "#seqPagi"
      },
      siang: {
        skyClass: "sky-siang",
        badge: "Pukul 01.00 Siang",
        headline: "Nando pulang sekolah pukul 1 siang.",
        nature: "Matahari berada tinggi di atas kepala, suasana hangat dan terang benderang di siang hari.",
        actKicker: "Kegiatan Siang Hari:",
        actContent: "Nando dan teman-teman selesai belajar di sekolah dan berjalan pulang ke rumah pukul 1 siang (13.00).",
        seqId: "#seqSiang"
      },
      sore: {
        skyClass: "sky-sore",
        badge: "Pukul 04.00 Sore",
        headline: "Aku bermain di taman pukul 4 sore.",
        nature: "Sinar matahari mulai teduh dan condong ke barat, waktu yang pas untuk bermain di luar rumah.",
        actKicker: "Kegiatan Sore Hari:",
        actContent: "Bermain perosotan di taman bersama teman-teman pukul 4 sore (16.00), lalu mandi sore.",
        seqId: "#seqSore"
      },
      malam: {
        skyClass: "sky-malam",
        badge: "Pukul 09.00 Malam",
        headline: "Nando belajar pukul 9 malam.",
        nature: "Langit gelap dihiasi bulan dan bintang, suasana tenang untuk belajar dan beristirahat malam.",
        actKicker: "Kegiatan Malam Hari:",
        actContent: "Nando mengulang pelajaran sekolah di meja belajar hingga pukul 9 malam (21.00) sebelum tidur nyenyak.",
        seqId: "#seqMalam"
      }
    };

    function selectPhase(phase) {
      phaseTabs.forEach(t => t.classList.toggle("active", t.getAttribute("data-phase") === phase));
      posterCards.forEach(c => c.classList.toggle("active", c.getAttribute("data-phase") === phase));

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
    }

    phaseTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        selectPhase(tab.getAttribute("data-phase"));
      });
    });

    posterCards.forEach(card => {
      card.addEventListener("click", () => {
        selectPhase(card.getAttribute("data-phase"));
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
      for (let i = 1; i <= LEVELS.length; i++) {
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

