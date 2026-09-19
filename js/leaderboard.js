/* =========================================================
   TIME QUEST
   leaderboard.js - Papan Peringkat dan Podium Juara
   Bebas Emoji AI Slop - Menggunakan Ikon Vektor Orisinal
   ========================================================= */

"use strict";

/**
 * Mengambil daftar siswa yang diurutkan berdasarkan perolehan poin tertinggi
 * @returns {Array} 
 */
function getSortedStudents() {
  return getStudents().sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return (b.lastScore || 0) - (a.lastScore || 0);
  });
}

/**
 * Merender tabel leaderboard lengkap
 */
function renderLeaderboard() {
  const students = getSortedStudents();
  renderPodium(students);

  const body = $("leaderboardBody");
  if (!body) return;

  body.innerHTML = "";

  if (students.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="4" class="center muted" style="padding: 24px;">
          Belum ada peserta petualang yang menyelesaikan kuis.
        </td>
      </tr>
    `;
    return;
  }

  students.forEach((student, index) => {
    const row = document.createElement("tr");

    if (currentStudent && student.id === currentStudent.id) {
      row.classList.add("current");
    }

    const rankBadge = index === 0
      ? `<img src="assets/icons/rank-1.svg" width="24" height="24" alt="Juara 1" class="rank-icon-img">`
      : index === 1
        ? `<img src="assets/icons/rank-2.svg" width="24" height="24" alt="Juara 2" class="rank-icon-img">`
        : index === 2
          ? `<img src="assets/icons/rank-3.svg" width="24" height="24" alt="Juara 3" class="rank-icon-img">`
          : `<span class="rank-num">${index + 1}</span>`;
    const avatarHtml = typeof getAvatarImg === "function" ? getAvatarImg(student.avatar, 34) : "";

    row.innerHTML = `
      <td><div class="rank-badge-cell">${rankBadge}</div></td>
      <td>
        <div style="display:inline-flex;align-items:center;gap:10px;">
          ${avatarHtml}
          <span>${escapeHTML(student.name)}</span>
        </div>
      </td>
      <td><strong>${student.lastScore !== null && student.lastScore !== undefined ? student.lastScore : "-"}</strong></td>
      <td><span class="badge badge-yellow" style="font-weight:900;">${student.points} Poin</span></td>
    `;

    body.appendChild(row);
  });
}

/**
 * Merender visualisasi podium untuk 3 besar
 * @param {Array} students 
 */
function renderPodium(students) {
  const podium = $("podium");
  if (!podium) return;

  podium.innerHTML = "";

  const topThree = students.slice(0, 3);

  if (topThree.length === 0) {
    podium.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        Belum ada siswa yang menyelesaikan kuis. Ayo mulai tantanganmu!
      </div>
    `;
    return;
  }

  // Posisi podium klasik: 2 (Kiri), 1 (Tengah/Juara), 3 (Kanan)
  const order = [1, 0, 2];

  order.forEach(index => {
    const student = topThree[index];
    if (!student) return;

    const rank = index + 1;
    const medalBadgeHtml = rank === 1
      ? `<img src="assets/icons/rank-1.svg" width="20" height="20" alt=""> Juara 1`
      : rank === 2
        ? `<img src="assets/icons/rank-2.svg" width="20" height="20" alt=""> Juara 2`
        : `<img src="assets/icons/rank-3.svg" width="20" height="20" alt=""> Juara 3`;
    const avatarHtml = typeof getAvatarImg === "function" ? getAvatarImg(student.avatar, 64) : "";

    const card = document.createElement("div");
    card.className = "podium-card " + (rank === 1 ? "first" : "");

    card.innerHTML = `
      <div class="podium-rank-tag">
        ${medalBadgeHtml}
      </div>

      <div class="podium-avatar">
        ${avatarHtml}
      </div>

      <div class="podium-name">
        ${escapeHTML(student.name)}
      </div>

      <div class="podium-points">
        ${student.points} Poin
      </div>
    `;

    podium.appendChild(card);
  });
}

/**
 * Merender cuplikan mini leaderboard di beranda siswa
 */
function renderLeaderboardPreview() {
  const students = getSortedStudents().slice(0, 3);
  const container = $("homeLeaderboardPreview");
  if (!container) return;

  container.innerHTML = "";

  if (students.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        Belum ada catatan skor siswa.<br>
        Jadilah yang pertama menuntaskan misi waktu!
      </div>
    `;
    return;
  }

  students.forEach((student, index) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "12px";
    row.style.padding = "10px 4px";
    row.style.borderBottom = "1.5px solid var(--border-light)";

    const rankBadge = index === 0
      ? `<img src="assets/icons/rank-1.svg" width="22" height="22" alt="1">`
      : index === 1
        ? `<img src="assets/icons/rank-2.svg" width="22" height="22" alt="2">`
        : `<img src="assets/icons/rank-3.svg" width="22" height="22" alt="3">`;
    const avatarHtml = typeof getAvatarImg === "function" ? getAvatarImg(student.avatar, 32) : "";

    row.innerHTML = `
      <div class="rank-badge-cell" style="width:24px;">${rankBadge}</div>
      ${avatarHtml}
      <span style="flex:1;font-weight:800;font-size:0.95rem;">${escapeHTML(student.name)}</span>
      <span class="badge badge-yellow" style="font-weight:900;">${student.points} Poin</span>
    `;

    container.appendChild(row);
  });
}

/**
 * Inisialisasi event listener navigasi leaderboard
 */
function initLeaderboardEvents() {
  const backBtn = $("leaderboardBackBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      showStudentPage("homeScreen");
      renderHome();
    });
  }

  const homeLeaderboardBtn = $("homeLeaderboardBtn");
  if (homeLeaderboardBtn) {
    homeLeaderboardBtn.addEventListener("click", () => {
      renderLeaderboard();
      showStudentPage("leaderboardScreen");
    });
  }
}
