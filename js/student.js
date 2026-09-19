/* =========================================================
   TIME QUEST
   student.js - Beranda Siswa, Peta Level, dan Materi Belajar
   ========================================================= */

"use strict";

const LEVELS = [
  {
    id: 1,
    title: "Desa Jam",
    icon: "assets/icons/level-1.svg",
    description: "Mengenal jam dan jarum jam"
  },
  {
    id: 2,
    title: "Menara Waktu",
    icon: "assets/icons/level-2.svg",
    description: "Membaca jam analog dan digital"
  },
  {
    id: 3,
    title: "Stasiun Waktu",
    icon: "assets/icons/level-3.svg",
    description: "Mengenal jam dan menit"
  },
  {
    id: 4,
    title: "Sekolah Waktu",
    icon: "assets/icons/level-4.svg",
    description: "Urutan kegiatan berdasarkan waktu"
  },
  {
    id: 5,
    title: "Istana Waktu",
    icon: "assets/icons/level-5.svg",
    description: "Tantangan membaca durasi"
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
  if (homeLevel) homeLevel.textContent = Math.min(completed + 1, 5) + " / 5";

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
function renderLevels() {
  const grid = $("levelGrid");
  if (!grid) return;

  grid.innerHTML = "";

  LEVELS.forEach(level => {
    const completedLevels = currentStudent.completedLevels || [];
    const unlocked = level.id === 1 || completedLevels.includes(level.id - 1);
    const completed = completedLevels.includes(level.id);

    const card = document.createElement("div");
    card.className = "level-card " + (completed ? "completed" : unlocked ? "unlocked" : "locked");

    const statusHtml = completed
      ? `<span class="level-status-pill done"><img src="assets/icons/check-circle.svg" width="14" height="14" alt=""> Tuntas</span>`
      : unlocked
        ? `<span class="level-status-pill ready">Buka Misi →</span>`
        : `<span class="level-status-pill locked"><img src="assets/icons/lock.svg" width="14" height="14" alt=""> Terkunci</span>`;

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
    `;

    if (unlocked) {
      card.addEventListener("click", () => {
        openMaterial(level.id);
      });
    }

    grid.appendChild(card);
  });
}

/**
 * Membuka materi belajar untuk level tertentu
 * @param {number} levelId 
 */
function openMaterial(levelId = 1) {
  currentMaterialLevel = levelId;
  showStudentPage("materialScreen");
  renderStudentMaterials(levelId);
}

/**
 * Merender daftar materi pembelajaran secara dinamis dari storage
 * @param {number} levelId 
 */
function renderStudentMaterials(levelId = 1) {
  const container = $("materialList");
  if (!container) return;

  const materials = typeof getMaterials === "function" ? getMaterials() : [];
  if (!materials || materials.length === 0) return;

  // Prioritaskan materi untuk level yang sedang dibuka
  let relevant = materials.filter(m => Number(m.level) === Number(levelId));
  if (relevant.length === 0) {
    relevant = materials;
  }

  container.innerHTML = "";

  relevant.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "material-card";

    let demoHtml = "";
    // Contoh jam peraga jika relevan
    const isClockDemo = item.level === 1 || item.level === 2 || 
                        (item.title && (item.title.toLowerCase().includes("jam") || item.title.toLowerCase().includes("waktu")));
    
    if (isClockDemo && (index === 0 || index === 1)) {
      const isHalfHour = item.level === 3 || (item.title && item.title.toLowerCase().includes("setengah"));
      const hourDeg = isHalfHour ? "75deg" : "90deg";
      const minDeg = isHalfHour ? "180deg" : "0deg";
      const digitalTime = isHalfHour ? "02:30" : "03:00";
      const demoDesc = isHalfHour 
        ? "Jarum pendek di antara 2 & 3, jarum panjang di angka 6." 
        : "Jarum pendek di angka 3, jarum panjang tepat di 12.";

      demoHtml = `
        <div class="clock-demo-card">
          <div class="clock-demo-viewport">
            <div class="clock-face material-dynamic-clock" aria-label="${escapeHTML(item.title)}">
              <!-- Ticks -->
              <div class="clock-tick major" style="--tick-angle: 0deg;"></div>
              <div class="clock-tick major" style="--tick-angle: 30deg;"></div>
              <div class="clock-tick major" style="--tick-angle: 60deg;"></div>
              <div class="clock-tick major" style="--tick-angle: 90deg;"></div>
              <div class="clock-tick major" style="--tick-angle: 120deg;"></div>
              <div class="clock-tick major" style="--tick-angle: 150deg;"></div>
              <div class="clock-tick major" style="--tick-angle: 180deg;"></div>
              <div class="clock-tick major" style="--tick-angle: 210deg;"></div>
              <div class="clock-tick major" style="--tick-angle: 240deg;"></div>
              <div class="clock-tick major" style="--tick-angle: 270deg;"></div>
              <div class="clock-tick major" style="--tick-angle: 300deg;"></div>
              <div class="clock-tick major" style="--tick-angle: 330deg;"></div>
              <!-- Numbers -->
              <div class="clock-number" style="--angle: 30deg;"><span>1</span></div>
              <div class="clock-number" style="--angle: 60deg;"><span>2</span></div>
              <div class="clock-number" style="--angle: 90deg;"><span>3</span></div>
              <div class="clock-number" style="--angle: 120deg;"><span>4</span></div>
              <div class="clock-number" style="--angle: 150deg;"><span>5</span></div>
              <div class="clock-number" style="--angle: 180deg;"><span>6</span></div>
              <div class="clock-number" style="--angle: 210deg;"><span>7</span></div>
              <div class="clock-number" style="--angle: 240deg;"><span>8</span></div>
              <div class="clock-number" style="--angle: 270deg;"><span>9</span></div>
              <div class="clock-number" style="--angle: 300deg;"><span>10</span></div>
              <div class="clock-number" style="--angle: 330deg;"><span>11</span></div>
              <div class="clock-number" style="--angle: 360deg;"><span>12</span></div>
              <!-- Hands -->
              <div class="clock-hand hour-hand" style="transform:translateX(-50%) rotate(${hourDeg});"></div>
              <div class="clock-hand minute-hand" style="transform:translateX(-50%) rotate(${minDeg});"></div>
              <div class="clock-center"></div>
            </div>
          </div>
          <div class="clock-demo-info">
            <span class="demo-tag">Peraga Visual</span>
            <div class="digital-badge">${digitalTime}</div>
            <p class="muted small">${demoDesc}</p>
          </div>
        </div>
      `;
    }

    const tipHtml = item.tip ? `
      <div class="tip-banner">
        <img src="assets/icons/lightbulb.svg" width="18" height="18" alt="" style="vertical-align:-3px;margin-right:4px;">
        <strong>Kunci Belajar:</strong> ${escapeHTML(item.tip)}
      </div>
    ` : "";

    card.innerHTML = `
      <div class="material-step-badge">${index + 1}</div>
      <div class="material-text">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap;">
          <h3 style="margin-bottom:0;">${escapeHTML(item.judul || item.title)}</h3>
          <span class="badge badge-accent" style="font-size:0.75rem;">Misi Level ${item.level}</span>
        </div>
        <p>${escapeHTML(item.isi || item.content)}</p>
        ${demoHtml}
        ${tipHtml}
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * Inisialisasi event listener navigasi siswa
 */
function initStudentEvents() {
  const continueBtn = $("continueLearningBtn");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      openMaterial(1);
    });
  }

  const materialBackBtn = $("materialBackBtn");
  if (materialBackBtn) {
    materialBackBtn.addEventListener("click", () => {
      showStudentPage("homeScreen");
      renderHome();
    });
  }

  const startQuizBtn = $("startQuizBtn");
  if (startQuizBtn) {
    startQuizBtn.addEventListener("click", () => {
      if (typeof startQuiz === "function") {
        startQuiz(currentMaterialLevel);
      }
    });
  }
}
