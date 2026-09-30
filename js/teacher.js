/* =========================================================
   TIME QUEST
   teacher.js - Dashboard Guru, Rekap Nilai, Peringkat & Autentikasi Admin
   Sesuai Panduan AGENT.md & Bebas AI-Slop
   ========================================================= */

"use strict";

// Helper Fallback jika app.js tidak dimuat di admin.html
if (typeof window.$ !== "function") {
  window.$ = function(id) {
    return document.getElementById(id);
  };
}

if (typeof window.escapeHTML !== "function") {
  window.escapeHTML = function(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };
}

if (typeof window.formatDate !== "function") {
  window.formatDate = function(timestamp) {
    if (!timestamp) return "-";
    try {
      return new Date(Number(timestamp)).toLocaleString("id-ID", {
        dateStyle: "short",
        timeStyle: "short"
      });
    } catch (e) {
      return "-";
    }
  };
}

if (typeof window.showToast !== "function") {
  window.showToast = function(message, type = "") {
    const toast = $("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.className = "toast";

    if (type) {
      toast.classList.add(type);
    }

    clearTimeout(window.showToast.timer);
    toast.classList.remove("hidden");

    window.showToast.timer = setTimeout(() => {
      toast.classList.add("hidden");
    }, 2800);
  };
}

let currentTeacherTab = "students";

/**
 * Mengambil data sesi pengajar dari sessionStorage
 * @returns {Object|null}
 */
function getTeacherSession() {
  try {
    const raw = sessionStorage.getItem("timequest_teacher") || localStorage.getItem("timequest_teacher");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Menghapus data sesi pengajar
 */
function clearTeacherSession() {
  try {
    sessionStorage.removeItem("timequest_teacher");
    localStorage.removeItem("timequest_teacher");
  } catch (e) {
    console.error("Gagal menghapus sesi guru:", e);
  }
}

/**
 * Membuka antarmuka guru dan memuat data dashboard (Kompatibilitas)
 */
function openTeacherApp() {
  const teacherApp = $("teacherApp");
  if (teacherApp && teacherApp.classList.contains("screen")) {
    if (typeof showScreen === "function") {
      showScreen("teacherApp");
    } else {
      teacherApp.classList.add("active");
    }
  }
  setTeacherTab("students");
  renderTeacherDashboard();
}

/**
 * Berpindah tab pada panel guru (Daftar Siswa, Hasil Penilaian, Peringkat)
 * @param {string} tab 
 */
function setTeacherTab(tab) {
  currentTeacherTab = tab;

  document.querySelectorAll(".teacher-tab").forEach(button => {
    button.classList.toggle("active", button.dataset.tab === tab);
    button.setAttribute("aria-selected", button.dataset.tab === tab ? "true" : "false");
  });

  const studentsTab = $("teacherStudentsTab");
  const resultsTab = $("teacherResultsTab");
  const rankingTab = $("teacherRankingTab");
  const materialsTab = $("teacherMaterialsTab");
  const questionsTab = $("teacherQuestionsTab");

  if (studentsTab) studentsTab.classList.toggle("hidden", tab !== "students");
  if (resultsTab) resultsTab.classList.toggle("hidden", tab !== "results");
  if (rankingTab) rankingTab.classList.toggle("hidden", tab !== "ranking");
  if (materialsTab) materialsTab.classList.toggle("hidden", tab !== "materials");
  if (questionsTab) questionsTab.classList.toggle("hidden", tab !== "questions");

  renderTeacherDashboard();
}

/**
 * Menghitung metrik ringkasan kelas dan merender tab aktif
 */
function renderTeacherDashboard() {
  const students = typeof getStudents === "function" ? getStudents() : [];
  const completed = students.filter(student => student.lastScore !== null && student.lastScore !== undefined);

  const average = completed.length
    ? Math.round(completed.reduce((sum, student) => sum + student.lastScore, 0) / completed.length)
    : 0;

  const totalEl = $("teacherTotalStudents");
  const compEl = $("teacherCompleted");
  const avgEl = $("teacherAverage");

  if (totalEl) totalEl.textContent = students.length;
  if (compEl) compEl.textContent = completed.length;
  if (avgEl) avgEl.textContent = completed.length ? `${average}/100` : "0";

  if (currentTeacherTab === "students") renderTeacherStudents();
  if (currentTeacherTab === "results") renderTeacherResults();
  if (currentTeacherTab === "ranking") renderTeacherRanking();
  if (currentTeacherTab === "materials") renderTeacherMaterials();
  if (currentTeacherTab === "questions") renderTeacherQuestions();
}

/**
 * Merender tabel seluruh siswa yang terdaftar
 */
function renderTeacherStudents() {
  const body = $("teacherStudentsBody");
  if (!body) return;

  body.innerHTML = "";
  const students = typeof getStudents === "function" ? getStudents() : [];

  if (students.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            Belum ada data siswa yang login di aplikasi ini.
          </div>
        </td>
      </tr>
    `;
    return;
  }

  students.forEach((student, index) => {
    const row = document.createElement("tr");
    const avatarHtml = typeof getAvatarImg === "function" ? getAvatarImg(student.avatar, 32) : "";

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <div style="display:inline-flex;align-items:center;gap:10px;">
          ${avatarHtml}
          <strong>${escapeHTML(student.name)}</strong>
        </div>
      </td>
      <td>${escapeHTML(student.className)}</td>
      <td>
        <span class="status-dot">
          ${student.lastScore === null || student.lastScore === undefined ? "Belum kuis" : "Selesai"}
        </span>
      </td>
      <td><span class="badge badge-yellow" style="font-weight:900;">${student.points ?? 0} Poin</span></td>
      <td><strong>${student.lastScore !== null && student.lastScore !== undefined ? student.lastScore : "-"}</strong></td>
    `;

    body.appendChild(row);
  });
}

/**
 * Merender tabel riwayat hasil kuis siswa
 */
function renderTeacherResults() {
  const body = $("teacherResultsBody");
  if (!body) return;

  body.innerHTML = "";
  const allStudents = typeof getStudents === "function" ? getStudents() : [];
  const students = allStudents.filter(student => student.lastScore !== null && student.lastScore !== undefined);

  if (students.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            Belum ada data nilai kuis siswa. Siswa belum menyelesaikan quiz.
          </div>
        </td>
      </tr>
    `;
    return;
  }

  // Urutkan nilai tertinggi ke terendah
  students.sort((a, b) => b.lastScore - a.lastScore);

  students.forEach(student => {
    const row = document.createElement("tr");
    const avatarHtml = typeof getAvatarImg === "function" ? getAvatarImg(student.avatar, 32) : "";

    row.innerHTML = `
      <td>
        <div style="display:inline-flex;align-items:center;gap:10px;">
          ${avatarHtml}
          <div>
            <strong>${escapeHTML(student.name)}</strong>
            <div class="muted small">${escapeHTML(student.className)}</div>
          </div>
        </div>
      </td>
      <td>${student.lastCorrect ?? 0} / ${student.lastTotal ?? 0}</td>
      <td><strong style="color:var(--blue);font-size:1.1rem;">${student.lastScore}</strong></td>
      <td><span class="badge badge-yellow" style="font-weight:900;">${student.points ?? 0}</span></td>
      <td>${student.lastHints ?? 0}</td>
      <td>${formatDate(student.lastPlayed)}</td>
    `;

    body.appendChild(row);
  });
}

/**
 * Merender peringkat siswa di tab Ruang Guru
 */
function renderTeacherRanking() {
  const container = $("teacherRanking");
  if (!container) return;

  container.innerHTML = "";
  const students = typeof getSortedStudents === "function" ? getSortedStudents() : (typeof getStudents === "function" ? getStudents() : []);

  if (students.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        Belum ada siswa yang terdata.
      </div>
    `;
    return;
  }

  students.forEach((student, index) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "14px";
    row.style.padding = "12px 6px";
    row.style.borderBottom = "1.5px solid var(--border-light)";

    const rankBadge = index === 0
      ? `<img src="assets/icons/rank-1.svg" width="24" height="24" alt="Juara 1">`
      : index === 1
        ? `<img src="assets/icons/rank-2.svg" width="24" height="24" alt="Juara 2">`
        : index === 2
          ? `<img src="assets/icons/rank-3.svg" width="24" height="24" alt="Juara 3">`
          : `<span class="rank-num">${index + 1}</span>`;
    const avatarHtml = typeof getAvatarImg === "function" ? getAvatarImg(student.avatar, 38) : "";

    row.innerHTML = `
      <div class="rank-badge-cell" style="width:30px;">${rankBadge}</div>
      ${avatarHtml}
      <div style="flex:1;">
        <strong>${escapeHTML(student.name)}</strong>
        <div class="muted small">${escapeHTML(student.className)}</div>
      </div>
      <div style="text-align:right;">
        <span class="badge badge-yellow" style="font-weight:900;font-size:0.92rem;">${student.points ?? 0} Poin</span>
        <div class="muted small" style="margin-top:2px;">Nilai: ${student.lastScore ?? "-"}</div>
      </div>
    `;

    container.appendChild(row);
  });
}

/**
 * Navigasi Subtab pada Tab Kelola Materi
 * @param {string} subtabKey ('mat-list', 'mat-create', 'mat-upload')
 */
function setMaterialSubtab(subtabKey) {
  const tabContainer = $("teacherMaterialsTab");
  if (!tabContainer) return;

  tabContainer.querySelectorAll(".admin-subnav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.subtab === subtabKey);
  });

  const views = {
    "mat-list": $("matSubtabList"),
    "mat-create": $("matSubtabCreate"),
    "mat-upload": $("matSubtabUpload")
  };

  Object.keys(views).forEach(key => {
    const el = views[key];
    if (el) el.classList.toggle("hidden", key !== subtabKey);
  });

  if (subtabKey === "mat-list") {
    renderTeacherMaterials();
  } else if (subtabKey === "mat-create") {
    updateMaterialLivePreview();
  }
}

/**
 * Navigasi Subtab pada Tab Kelola Soal Kuis
 * @param {string} subtabKey ('q-list', 'q-create', 'q-upload')
 */
function setQuestionSubtab(subtabKey) {
  const tabContainer = $("teacherQuestionsTab");
  if (!tabContainer) return;

  tabContainer.querySelectorAll(".admin-subnav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.subtab === subtabKey);
  });

  const views = {
    "q-list": $("qSubtabList"),
    "q-create": $("qSubtabCreate"),
    "q-upload": $("qSubtabUpload")
  };

  Object.keys(views).forEach(key => {
    const el = views[key];
    if (el) el.classList.toggle("hidden", key !== subtabKey);
  });

  if (subtabKey === "q-list") {
    renderTeacherQuestions();
  } else if (subtabKey === "q-create") {
    updateQuestionLivePreview();
  }
}

/**
 * Memperbarui Pratinjau Langsung (Live Preview) Kartu Materi Murid
 */
function updateMaterialLivePreview() {
  const level = $("matLevel") ? $("matLevel").value : "1";
  const judul = $("matJudul") ? $("matJudul").value.trim() : "";
  const isi = $("matIsi") ? $("matIsi").value.trim() : "";
  const tip = $("matTip") ? $("matTip").value.trim() : "";

  const stepEl = $("previewMatStep");
  const judulEl = $("previewMatJudul");
  const levelBadge = $("previewMatLevelBadge");
  const isiEl = $("previewMatIsi");
  const tipWrap = $("previewMatTipWrap");
  const tipEl = $("previewMatTip");

  if (stepEl) stepEl.textContent = level;
  if (levelBadge) levelBadge.textContent = `Misi Level ${level}`;
  if (judulEl) judulEl.textContent = judul || "Judul Modul Materi";
  if (isiEl) {
    isiEl.textContent = isi || "Tuliskan materi pada formulir di sebelah kiri untuk melihat tampilan langsung di sini...";
  }

  if (tipWrap && tipEl) {
    if (tip) {
      tipWrap.style.display = "flex";
      tipEl.textContent = tip;
    } else {
      tipWrap.style.display = "none";
    }
  }

  // Pratinjau Gambar / SVG Materi yang Diunggah
  const matImg = $("matImg") ? $("matImg").value : "";
  const matImgWrap = $("previewMatImgWrap");
  const matImgEl = $("previewMatImg");
  if (matImgWrap && matImgEl) {
    if (matImg) {
      matImgWrap.style.display = "block";
      matImgEl.src = matImg;
    } else {
      matImgWrap.style.display = "none";
    }
  }
}

/**
 * Memperbarui Pratinjau Langsung (Live Preview) Kuis Murid & Animasi Jam Analog
 */
function updateQuestionLivePreview() {
  const level = $("qLevel") ? $("qLevel").value : "1";
  const tipe = $("qType") ? $("qType").value : "clock_drag";
  const qText = $("qText") ? $("qText").value.trim() : "";
  const isClockDrag = tipe === "clock_drag";
  const isClockDrop = tipe === "clock_drop";
  const isTimeCompare = tipe === "time_compare";
  const isActivityDrop = tipe === "clock_activity_drop";
  const isClock = tipe === "clock";

  const defaultPoints = (isClockDrag || isClockDrop || isTimeCompare || isActivityDrop) ? 100 : 20;
  const points = $("qPoints") ? $("qPoints").value : defaultPoints;
  const hint = $("qHint") ? $("qHint").value.trim() : "";

  const hour = parseInt($("qClockHour") ? $("qClockHour").value : 5, 10) || 12;
  const minute = parseInt($("qClockMinute") ? $("qClockMinute").value : 0, 10) || 0;

  const digiH = ($("qDigitalHour") ? $("qDigitalHour").value.trim() : "05").padStart(2, "0");
  const digiM = ($("qDigitalMinute") ? $("qDigitalMinute").value.trim() : "00").padStart(2, "0");
  const chip1 = ($("qChip1") ? $("qChip1").value.trim() : "07").padStart(2, "0");
  const chip2 = ($("qChip2") ? $("qChip2").value.trim() : "30").padStart(2, "0");
  const chip3 = ($("qChip3") ? $("qChip3").value.trim() : digiH).padStart(2, "0");
  const chip4 = ($("qChip4") ? $("qChip4").value.trim() : "12").padStart(2, "0");
  const chip5 = ($("qChip5") ? $("qChip5").value.trim() : digiM).padStart(2, "0");
  const chip6 = ($("qChip6") ? $("qChip6").value.trim() : "06").padStart(2, "0");

  // Sinkronisasi baris pengaturan jam & opsi builder
  const clockSettingsRow = $("clockSettingsRow");
  const clockSettingsLabel = $("clockSettingsLabel");
  const clockSettingsBadge = $("clockSettingsBadge");
  const clockSettingsDesc = $("clockSettingsDesc");
  const digitalClockSettingsRow = $("digitalClockSettingsRow");
  const timeCompareSettingsRow = $("timeCompareSettingsRow");
  const activityDropSettingsRow = $("activityDropSettingsRow");
  const optionsBuilderGroup = $("optionsBuilderGroup");
  const questionImageUploadRow = $("questionImageUploadRow");

  if (clockSettingsRow) {
    clockSettingsRow.classList.toggle("hidden", !isClockDrag && !isClock);
    if (clockSettingsLabel) {
      clockSettingsLabel.textContent = isClockDrag
        ? "Target Waktu Jam Analog (Kunci Jawaban):"
        : "Waktu Jam Analog yang Ditampilkan:";
    }
    if (clockSettingsBadge) {
      clockSettingsBadge.textContent = isClockDrag ? "Mode Siswa: Putar Jam (L1)" : "Mode Pilihan Ganda";
    }
    if (clockSettingsDesc) {
      clockSettingsDesc.innerHTML = isClockDrag
        ? 'Murid akan memutar/mengarahkan jarum jam dan menit ke posisi target waktu ini, lalu menekan tombol <strong>"Jawab"</strong>.'
        : 'Jam analog statis akan menampilkan waktu ini di soal, dan murid memilih salah satu opsi A, B, C, atau D.';
    }
  }

  if (digitalClockSettingsRow) {
    digitalClockSettingsRow.style.display = isClockDrop ? "block" : "none";
  }

  if (timeCompareSettingsRow) {
    timeCompareSettingsRow.style.display = isTimeCompare ? "block" : "none";
  }

  if (activityDropSettingsRow) {
    activityDropSettingsRow.style.display = isActivityDrop ? "block" : "none";
  }

  if (optionsBuilderGroup) {
    optionsBuilderGroup.style.display = (isClockDrag || isClockDrop || isTimeCompare || isActivityDrop) ? "none" : "block";
  }

  // Tampilkan uploader gambar kustom untuk soal pilihan ganda / teks
  if (questionImageUploadRow) {
    questionImageUploadRow.style.display = (!isClockDrag && !isClockDrop && !isTimeCompare && !isActivityDrop) ? "block" : "none";
  }

  // Pratinjau Gambar Ilustrasi Soal Kustom (Opsional)
  const qCustomImg = $("qCustomImg") ? $("qCustomImg").value : "";
  const previewQuestionImgWrap = $("previewQuestionImgWrap");
  const previewQuestionCustomImg = $("previewQuestionCustomImg");
  if (previewQuestionImgWrap && previewQuestionCustomImg) {
    if (qCustomImg && !isClockDrag && !isClockDrop && !isTimeCompare && !isActivityDrop) {
      previewQuestionImgWrap.style.display = "block";
      previewQuestionCustomImg.src = qCustomImg;
    } else {
      previewQuestionImgWrap.style.display = "none";
    }
  }

  // Elements Pratinjau Langsung
  const previewQPointsBadge = $("previewQPointsBadge");
  const previewQText = $("previewQText");
  const previewClockWrap = $("previewClockWrap");
  const previewHourHand = $("previewHourHand");
  const previewMinuteHand = $("previewMinuteHand");
  const previewDigitalClockWrap = $("previewDigitalClockWrap");
  const previewSlotHourText = $("previewSlotHourText");
  const previewSlotMinuteText = $("previewSlotMinuteText");
  const previewClockDropAction = $("previewClockDropAction");
  const previewTimeCompareWrap = $("previewTimeCompareWrap");
  const previewTimeCompareAction = $("previewTimeCompareAction");
  const previewActivityDropWrap = $("previewActivityDropWrap");
  const previewActivityDropAction = $("previewActivityDropAction");
  const previewOptionsGrid = $("previewOptionsGrid");
  const previewClockDragAction = $("previewClockDragAction");

  if (previewQPointsBadge) previewQPointsBadge.textContent = `${points || defaultPoints} Poin`;

  const targetStr = `${String(hour).padStart(2, "0")}.${String(minute).padStart(2, "0")}`;
  if (previewQText) {
    if (qText) {
      previewQText.textContent = qText;
    } else if (isClockDrag) {
      previewQText.textContent = `Halim bangun tidur pukul ${hour} pagi. Arahkan jarum jam ke pukul ${targetStr}!`;
    } else if (isClockDrop) {
      previewQText.textContent = `Halim bangun tidur pukul ${parseInt(digiH, 10) || 5} pagi. Pasangkan angka (jam) dan (menit) yang tepat pada jam digital!`;
    } else if (isTimeCompare) {
      previewQText.textContent = "Beri tanda centang (✓) pada kegiatan yang lebih lama!";
    } else if (isActivityDrop) {
      previewQText.textContent = "Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:";
    } else {
      previewQText.textContent = "Pukul berapakah yang ditunjukkan jam di atas?";
    }
  }

  // Tampilkan atau sembunyikan jam analog
  if (previewClockWrap) {
    previewClockWrap.style.display = (isClockDrag || isClock) ? "flex" : "none";
  }

  if ((isClockDrag || isClock) && previewHourHand && previewMinuteHand) {
    const safeHour = Math.min(Math.max(hour, 1), 12);
    const safeMin = Math.min(Math.max(minute, 0), 59);
    const hDeg = ((safeHour % 12) * 30) + (safeMin * 0.5);
    const mDeg = safeMin * 6;
    previewHourHand.style.transform = `translateX(-50%) rotate(${hDeg}deg)`;
    previewMinuteHand.style.transform = `translateX(-50%) rotate(${mDeg}deg)`;
  }

  // Tampilkan atau sembunyikan jam digital alarm (L2)
  if (previewDigitalClockWrap) {
    previewDigitalClockWrap.style.display = isClockDrop ? "block" : "none";
    if (previewSlotHourText) previewSlotHourText.textContent = digiH;
    if (previewSlotMinuteText) previewSlotMinuteText.textContent = digiM;
    const prevScrH = $("previewScreenHourVal");
    const prevScrM = $("previewScreenMinuteVal");
    if (prevScrH) prevScrH.textContent = digiH;
    if (prevScrM) prevScrM.textContent = digiM;
  }

  // Visibilitas tombol Jawab (clock_drag / clock_drop) vs Opsi Pilihan Ganda (MCQ)
  if (previewClockDragAction) {
    previewClockDragAction.style.display = isClockDrag ? "block" : "none";
  }

  if (previewClockDropAction) {
    previewClockDropAction.style.display = isClockDrop ? "block" : "none";
    if ($("previewChip1")) $("previewChip1").innerHTML = `<span>${escapeHTML(chip1)}</span>`;
    if ($("previewChip2")) $("previewChip2").innerHTML = `<span>${escapeHTML(chip2)}</span>`;
    if ($("previewChip3")) $("previewChip3").innerHTML = `<span>${escapeHTML(chip3)}</span>`;
    if ($("previewChip4")) $("previewChip4").innerHTML = `<span>${escapeHTML(chip4)}</span>`;
    if ($("previewChip5")) $("previewChip5").innerHTML = `<span>${escapeHTML(chip5)}</span>`;
    if ($("previewChip6")) $("previewChip6").innerHTML = `<span>${escapeHTML(chip6)}</span>`;
  }

  // Pratinjau Level 3: Perbandingan Kegiatan (time_compare)
  if (previewTimeCompareWrap) {
    previewTimeCompareWrap.style.display = isTimeCompare ? "flex" : "none";
    if (isTimeCompare) {
      const label1 = $("qCompareLabel1") ? $("qCompareLabel1").value.trim() || "Kegiatan 1" : "Menyisir rambut";
      const img1 = $("qCompareImg1") ? $("qCompareImg1").value.trim() || "assets/images/activity_combing.png" : "assets/images/activity_combing.png";
      const label2 = $("qCompareLabel2") ? $("qCompareLabel2").value.trim() || "Kegiatan 2" : "Mandi";
      const img2 = $("qCompareImg2") ? $("qCompareImg2").value.trim() || "assets/images/activity_bathing.png" : "assets/images/activity_bathing.png";

      const radio = document.querySelector('input[name="qTimeCompareCorrect"]:checked');
      const correctIdx = radio ? parseInt(radio.value, 10) : 1;

      if ($("previewCompareLabel0")) $("previewCompareLabel0").textContent = label1;
      if ($("previewCompareImg0")) $("previewCompareImg0").src = img1;
      if ($("previewCompareLabel1")) $("previewCompareLabel1").textContent = label2;
      if ($("previewCompareImg1")) $("previewCompareImg1").src = img2;

      const card0 = $("previewCompareCard0");
      const card1 = $("previewCompareCard1");
      const chk0 = $("previewCompareChk0");
      const chk1 = $("previewCompareChk1");

      if (card0) {
        card0.classList.toggle("selected", correctIdx === 0);
        card0.classList.toggle("card-correct", correctIdx === 0);
      }
      if (card1) {
        card1.classList.toggle("selected", correctIdx === 1);
        card1.classList.toggle("card-correct", correctIdx === 1);
      }
      if (chk0) chk0.textContent = correctIdx === 0 ? "✓" : "...";
      if (chk1) chk1.textContent = correctIdx === 1 ? "✓" : "...";
    }
  }

  if (previewTimeCompareAction) {
    previewTimeCompareAction.style.display = isTimeCompare ? "block" : "none";
  }

  // Pratinjau Level 4: Waktu Kegiatan (clock_activity_drop)
  if (previewActivityDropWrap) {
    previewActivityDropWrap.style.display = isActivityDrop ? "flex" : "none";
    if (isActivityDrop) {
      const actCorrectAns = $("qActivityCorrectAnswer") ? $("qActivityCorrectAnswer").value.trim() || "Pukul 7 pagi" : "Pukul 7 pagi";
      const actImg = ($("qActivityImg") && $("qActivityImg").dataset.customUrl && ($("qActivityImg").value === "custom" || $("qActivityImg").value.startsWith("data:")))
        ? $("qActivityImg").dataset.customUrl
        : ($("qActivityImg") ? $("qActivityImg").value : "assets/images/time_activity_school.png");
      const actChip1 = $("qActChip1") ? $("qActChip1").value.trim() || actCorrectAns : "Pukul 7 pagi";
      const actChip2 = $("qActChip2") ? $("qActChip2").value.trim() || "Pukul 7 malam" : "Pukul 7 malam";
      const actChip3 = $("qActChip3") ? $("qActChip3").value.trim() || "Pukul 8 pagi" : "Pukul 8 pagi";
      const actChip4 = $("qActChip4") ? $("qActChip4").value.trim() || "Pukul 12 siang" : "Pukul 12 siang";

      if ($("previewActivityImg")) $("previewActivityImg").src = actImg;
      if ($("previewActivitySlotText")) $("previewActivitySlotText").textContent = actCorrectAns;

      const c1El = $("previewActChip1");
      const c2El = $("previewActChip2");
      const c3El = $("previewActChip3");
      const c4El = $("previewActChip4");

      if (c1El) {
        c1El.innerHTML = `<span>${escapeHTML(actChip1)}</span>`;
        c1El.classList.toggle("is-placed-slot", actChip1.toLowerCase() === actCorrectAns.toLowerCase());
      }
      if (c2El) {
        c2El.innerHTML = `<span>${escapeHTML(actChip2)}</span>`;
        c2El.classList.toggle("is-placed-slot", actChip2.toLowerCase() === actCorrectAns.toLowerCase());
      }
      if (c3El) {
        c3El.innerHTML = `<span>${escapeHTML(actChip3)}</span>`;
        c3El.classList.toggle("is-placed-slot", actChip3.toLowerCase() === actCorrectAns.toLowerCase());
      }
      if (c4El) {
        c4El.innerHTML = `<span>${escapeHTML(actChip4)}</span>`;
        c4El.classList.toggle("is-placed-slot", actChip4.toLowerCase() === actCorrectAns.toLowerCase());
      }
    }
  }

  if (previewActivityDropAction) {
    previewActivityDropAction.style.display = isActivityDrop ? "block" : "none";
  }

  if (previewOptionsGrid) {
    previewOptionsGrid.style.display = (isClockDrag || isClockDrop || isTimeCompare || isActivityDrop) ? "none" : "grid";
  }

  // Teks Opsi Jawaban MCQ
  const optA = $("qOptA") ? $("qOptA").value.trim() : "";
  const optB = $("qOptB") ? $("qOptB").value.trim() : "";
  const optC = $("qOptC") ? $("qOptC").value.trim() : "";
  const optD = $("qOptD") ? $("qOptD").value.trim() : "";
  const correctKey = $("qCorrectKey") ? $("qCorrectKey").value : "A";

  const previewOptTextA = $("previewOptTextA");
  const previewOptTextB = $("previewOptTextB");
  const previewOptTextC = $("previewOptTextC");
  const previewOptTextD = $("previewOptTextD");

  const previewOptA = $("previewOptA");
  const previewOptB = $("previewOptB");
  const previewOptC = $("previewOptC");
  const previewOptD = $("previewOptD");

  if (previewOptTextA) previewOptTextA.textContent = optA || "Pilihan A";
  if (previewOptTextB) previewOptTextB.textContent = optB || "Pilihan B";
  if (previewOptTextC) previewOptTextC.textContent = optC || "Pilihan C";
  if (previewOptTextD) previewOptTextD.textContent = optD || "Pilihan D";

  if (previewOptA) previewOptA.classList.toggle("is-answer", correctKey === "A");
  if (previewOptB) previewOptB.classList.toggle("is-answer", correctKey === "B");
  if (previewOptC) previewOptC.classList.toggle("is-answer", correctKey === "C");
  if (previewOptD) previewOptD.classList.toggle("is-answer", correctKey === "D");

  // Petunjuk Hint
  const previewHintWrap = $("previewHintWrap");
  const previewHintText = $("previewHintText");
  if (previewHintWrap && previewHintText) {
    if (hint) {
      previewHintWrap.style.display = "block";
      previewHintText.textContent = hint;
    } else {
      previewHintWrap.style.display = "none";
    }
  }
}

/**
 * Merender daftar materi pembelajaran yang tersimpan
 */
function renderTeacherMaterials() {
  const body = $("teacherMaterialsBody");
  if (!body) return;

  const allMaterials = typeof getMaterials === "function" ? getMaterials() : [];

  // Update badge count utama & badge per level
  const badge = $("matCountBadge");
  if (badge) badge.textContent = allMaterials.length;

  const countAll = allMaterials.length;
  const countL1 = allMaterials.filter(m => String(m.level) === "1").length;
  const countL2 = allMaterials.filter(m => String(m.level) === "2").length;
  const countL3 = allMaterials.filter(m => String(m.level) === "3").length;
  const countL4 = allMaterials.filter(m => String(m.level) === "4").length;

  if ($("pillMatCountAll")) $("pillMatCountAll").textContent = countAll;
  if ($("pillMatCountL1")) $("pillMatCountL1").textContent = countL1;
  if ($("pillMatCountL2")) $("pillMatCountL2").textContent = countL2;
  if ($("pillMatCountL3")) $("pillMatCountL3").textContent = countL3;
  if ($("pillMatCountL4")) $("pillMatCountL4").textContent = countL4;

  const filterVal = $("filterMaterialLevel") ? $("filterMaterialLevel").value : "all";
  const searchVal = $("searchMaterialInput") ? $("searchMaterialInput").value.trim().toLowerCase() : "";

  // Sinkronisasi status aktif tombol pill bar level materi
  document.querySelectorAll("#matLevelPillsBar .level-pill-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.level === filterVal);
  });

  const quickAddMatBtn = $("btnQuickAddMatForLevel");
  if (quickAddMatBtn) {
    quickAddMatBtn.textContent = filterVal === "all" ? "➕ Tambah Materi Baru" : `➕ Tambah Materi Level ${filterVal}`;
  }

  body.innerHTML = "";
  let filtered = allMaterials;

  if (filterVal !== "all") {
    filtered = filtered.filter(m => String(m.level) === filterVal);
  }

  if (searchVal) {
    filtered = filtered.filter(m => {
      const judul = (m.judul || m.title || "").toLowerCase();
      const isi = (m.isi || m.content || "").toLowerCase();
      const tip = (m.tip || "").toLowerCase();
      return judul.includes(searchVal) || isi.includes(searchVal) || tip.includes(searchVal);
    });
  }

  if (filtered.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            ${searchVal ? "Tidak ada materi pembelajaran yang cocok dengan kata kunci pencarian." : "Belum ada modul materi pembelajaran untuk level yang dipilih."}
          </div>
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach((mat, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><span class="badge badge-primary">Level ${mat.level}</span></td>
      <td><strong>${escapeHTML(mat.judul || mat.title)}</strong></td>
      <td style="max-width:300px;line-height:1.4;"><span class="small">${escapeHTML(mat.isi || mat.content)}</span></td>
      <td><span class="muted small">${escapeHTML(mat.tip || "-")}</span></td>
      <td style="text-align:center;">
        <button type="button" class="btn btn-outline btn-sm" style="padding:4px 8px;color:var(--pink);border-color:var(--pink);font-size:0.8rem;" onclick="handleDeleteMaterial('${escapeHTML(mat.id)}')">
          Hapus
        </button>
      </td>
    `;
    body.appendChild(row);
  });
}

/**
 * Handler hapus materi oleh guru
 * @param {string} id 
 */
window.handleDeleteMaterial = function(id) {
  if (!confirm("Apakah Anda yakin ingin menghapus materi pembelajaran ini?")) return;
  const materials = typeof getMaterials === "function" ? getMaterials() : [];
  const updated = materials.filter(m => String(m.id) !== String(id));
  if (typeof saveMaterials === "function") {
    saveMaterials(updated);
  }
  showToast("Materi berhasil dihapus.", "success");
  renderTeacherMaterials();
};

/**
 * Merender daftar soal kuis yang tersimpan
 */
function renderTeacherQuestions() {
  const body = $("teacherQuestionsBody");
  if (!body) return;

  const allQuestions = typeof getQuestions === "function" ? getQuestions() : [];

  // Update badge count utama & badge per level
  const badge = $("qCountBadge");
  if (badge) badge.textContent = allQuestions.length;

  const countAll = allQuestions.length;
  const countL1 = allQuestions.filter(q => String(q.level) === "1").length;
  const countL2 = allQuestions.filter(q => String(q.level) === "2").length;
  const countL3 = allQuestions.filter(q => String(q.level) === "3").length;
  const countL4 = allQuestions.filter(q => String(q.level) === "4").length;

  if ($("pillQCountAll")) $("pillQCountAll").textContent = countAll;
  if ($("pillQCountL1")) $("pillQCountL1").textContent = countL1;
  if ($("pillQCountL2")) $("pillQCountL2").textContent = countL2;
  if ($("pillQCountL3")) $("pillQCountL3").textContent = countL3;
  if ($("pillQCountL4")) $("pillQCountL4").textContent = countL4;

  const filterVal = $("filterQuestionLevel") ? $("filterQuestionLevel").value : "all";
  const filterType = $("filterQuestionType") ? $("filterQuestionType").value : "all";
  const searchVal = $("searchQuestionInput") ? $("searchQuestionInput").value.trim().toLowerCase() : "";

  // Sinkronisasi status aktif tombol pill bar level kuis
  document.querySelectorAll("#qLevelPillsBar .level-pill-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.level === filterVal);
  });

  const quickAddQBtn = $("btnQuickAddQForLevel");
  if (quickAddQBtn) {
    quickAddQBtn.textContent = filterVal === "all" ? "➕ Buat Soal Baru" : `➕ Buat Soal Level ${filterVal}`;
  }

  body.innerHTML = "";
  let filtered = allQuestions;

  if (filterVal !== "all") {
    filtered = filtered.filter(q => String(q.level) === filterVal);
  }

  if (filterType !== "all") {
    filtered = filtered.filter(q => (q.type || q.tipe || "clock") === filterType);
  }

  if (searchVal) {
    filtered = filtered.filter(q => {
      const qText = (q.pertanyaan || q.question || "").toLowerCase();
      const hint = (q.hint || "").toLowerCase();
      const explanation = (q.penjelasan || q.explanation || "").toLowerCase();
      const optionsText = Array.isArray(q.pilihan || q.options) ? (q.pilihan || q.options).join(" ").toLowerCase() : "";
      return qText.includes(searchVal) || hint.includes(searchVal) || explanation.includes(searchVal) || optionsText.includes(searchVal);
    });
  }

  if (filtered.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            ${searchVal ? "Tidak ada soal kuis yang cocok dengan kata kunci pencarian." : "Belum ada soal kuis untuk level/tipe yang dipilih."}
          </div>
        </td>
      </tr>
    `;
    return;
  }

  const letters = ["A", "B", "C", "D"];

  filtered.forEach((q, index) => {
    const row = document.createElement("tr");
    const qType = q.type || q.tipe || (q.level === 1 ? "clock_drag" : "text");
    const isClockDrag = qType === "clock_drag";
    const isClock = qType === "clock";
    const isClockDrop = qType === "clock_drop";
    const isTimeCompare = qType === "time_compare";
    const isActivityDrop = qType === "clock_activity_drop";

    let typeBadge = `<span class="badge badge-outline">Teks</span>`;
    let targetLabel = "";
    let answerHtml = "";

    if (isClockDrag) {
      typeBadge = `<span class="badge badge-accent">🕒 Putar Jam (L1)</span>`;
      const h = q.targetHour ?? q.jam ?? 12;
      const m = q.targetMinute ?? q.menit ?? 0;
      const targetStr = `${String(h).padStart(2, "0")}.${String(m).padStart(2, "0")}`;
      targetLabel = `<div class="muted small" style="margin-top:2px;">🎯 Target: <strong>Pukul ${targetStr}</strong></div>`;
      answerHtml = `<span class="badge badge-green" style="font-weight:900;">Pukul ${targetStr}</span>`;
    } else if (isClockDrop) {
      typeBadge = `<span class="badge badge-blue">🔢 Jam Digital (L2)</span>`;
      const h = q.targetHour ?? "05";
      const m = q.targetMinute ?? "00";
      targetLabel = `<div class="muted small" style="margin-top:2px;">🎯 Jam: ${h} : ${m}</div>`;
      answerHtml = `<span class="badge badge-green" style="font-weight:900;">${h}:${m}</span>`;
    } else if (isTimeCompare) {
      typeBadge = `<span class="badge badge-yellow">⏱️ Perbandingan (L3)</span>`;
      const ansText = Array.isArray(q.options) && q.correct !== undefined ? q.options[q.correct] : (q.options ? q.options[0] : "-");
      answerHtml = `<span class="badge badge-green" style="font-weight:900;">${escapeHTML(ansText)}</span>`;
    } else if (isActivityDrop) {
      typeBadge = `<span class="badge badge-accent">📅 Waktu Kegiatan (L4)</span>`;
      answerHtml = `<span class="badge badge-green" style="font-weight:900;">${escapeHTML(q.targetAnswer || "-")}</span>`;
    } else if (isClock) {
      typeBadge = `<span class="badge badge-accent">🕒 Analog (MCQ)</span>`;
      const h = q.jam ?? 12;
      const m = q.menit ?? 0;
      targetLabel = `<div class="muted small" style="margin-top:2px;">🕒 Pukul ${String(h).padStart(2, "0")}.${String(m).padStart(2, "0")}</div>`;
      let correctKeyLetter = "A";
      let correctText = "";
      const opts = q.pilihan || q.options || [];
      if (typeof q.kunci === "number") {
        correctKeyLetter = letters[q.kunci] || "A";
        correctText = opts[q.kunci] || "";
      } else if (typeof q.kunci === "string") {
        correctKeyLetter = q.kunci.toUpperCase();
        const idx = letters.indexOf(correctKeyLetter);
        if (idx !== -1) correctText = opts[idx] || "";
      }
      answerHtml = `<span class="badge badge-green" style="font-weight:900;">${correctKeyLetter}</span> <span class="small" style="margin-left:4px;font-weight:600;">${escapeHTML(correctText)}</span>`;
    } else {
      let correctKeyLetter = "A";
      let correctText = "";
      const opts = q.pilihan || q.options || [];
      if (typeof q.kunci === "number" || typeof q.correct === "number") {
        const kIdx = q.kunci !== undefined ? q.kunci : q.correct;
        correctKeyLetter = letters[kIdx] || "A";
        correctText = opts[kIdx] || "";
      } else if (typeof q.kunci === "string") {
        correctKeyLetter = q.kunci.toUpperCase();
        const idx = letters.indexOf(correctKeyLetter);
        if (idx !== -1) correctText = opts[idx] || "";
      }
      answerHtml = `<span class="badge badge-green" style="font-weight:900;">${correctKeyLetter}</span> <span class="small" style="margin-left:4px;font-weight:600;">${escapeHTML(correctText)}</span>`;
    }

    row.innerHTML = `
      <td>${index + 1}</td>
      <td><span class="badge badge-primary">Lvl ${q.level}</span></td>
      <td>${typeBadge}</td>
      <td style="line-height:1.4;">
        <strong>${escapeHTML(q.pertanyaan || q.question || "")}</strong>
        ${targetLabel}
        ${q.hint ? `<div class="muted small" style="margin-top:2px;">💡 <em>Hint:</em> ${escapeHTML(q.hint)}</div>` : ""}
      </td>
      <td>${answerHtml}</td>
      <td><span class="badge badge-yellow" style="font-weight:900;">${q.poin ?? q.points ?? (isClockDrag ? 100 : 20)}</span></td>
      <td style="text-align:center;">
        <button type="button" class="btn btn-outline btn-sm" style="padding:4px 8px;color:var(--pink);border-color:var(--pink);font-size:0.8rem;" onclick="handleDeleteQuestion('${escapeHTML(q.id)}')">
          Hapus
        </button>
      </td>
    `;
    body.appendChild(row);
  });
}

/**
 * Handler hapus soal kuis oleh guru
 * @param {string} id 
 */
window.handleDeleteQuestion = function(id) {
  if (!confirm("Apakah Anda yakin ingin menghapus soal kuis ini?")) return;
  const questions = typeof getQuestions === "function" ? getQuestions() : [];
  const updated = questions.filter(q => String(q.id) !== String(id));
  if (typeof saveQuestions === "function") {
    saveQuestions(updated);
  }
  showToast("Soal kuis berhasil dihapus.", "success");
  renderTeacherQuestions();
};

/**
 * Memeriksa status autentikasi di halaman admin.html
 */
function checkAdminAuth() {
  const session = getTeacherSession();
  const loginView = $("adminLoginView");
  const dashboardView = $("adminDashboardView");
  const teacherNameBadge = $("teacherNameBadge");
  const syncStatusBadge = $("syncStatusBadge");
  const studentsStorageBadge = $("studentsStorageBadge");

  // Perbarui indikator koneksi server
  const isServer = typeof IS_SERVER_MODE !== "undefined" && IS_SERVER_MODE;
  if (syncStatusBadge) {
    if (isServer) {
      syncStatusBadge.textContent = "🟢 Server Terhubung (Real-time)";
      syncStatusBadge.className = "badge badge-green";
      syncStatusBadge.title = "Data otomatis tersinkronisasi antar-browser dan tersimpan ke data/siswa.csv";
    } else {
      syncStatusBadge.textContent = "🟡 Berkas Offline (file:///)";
      syncStatusBadge.className = "badge badge-yellow";
      syncStatusBadge.title = "Aplikasi berjalan offline di satu peramban via file:///. Gunakan 'node server.js' untuk sinkronisasi antar-browser.";
    }
  }

  if (studentsStorageBadge) {
    studentsStorageBadge.textContent = isServer
      ? "Tersinkron ke data/siswa.csv"
      : "Tersimpan di LocalStorage";
  }

  if (session) {
    // Pengajar sudah login
    if (loginView) loginView.classList.add("hidden");
    if (dashboardView) dashboardView.classList.remove("hidden");
    if (teacherNameBadge) {
      teacherNameBadge.textContent = session.nama || "Panel Pengajar";
    }
    setTeacherTab("students");
    renderTeacherDashboard();
  } else {
    // Belum login
    if (loginView && dashboardView) {
      // Halaman mandiri admin.html yang memiliki view login terpisah
      loginView.classList.remove("hidden");
      dashboardView.classList.add("hidden");
    } else {
      // Jika tidak ada login view khusus di halaman ini, tetap render dashboard
      setTeacherTab("students");
      renderTeacherDashboard();
    }
  }
}

/**
 * Inisialisasi event listener tab, form login, logout, dan ekspor CSV
 */
/**
 * Membaca berkas spreadsheet (Excel .xlsx / .xls atau .csv) dan mengembalikannya sebagai array baris objek
 * @param {File} file 
 * @returns {Promise<Array<Object>>}
 */
function readSpreadsheetFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve([]);
      return;
    }

    // Jika XLSX (SheetJS) tersedia di browser (mendukung file .xlsx, .xls, maupun .csv)
    if (typeof XLSX !== "undefined") {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          if (!firstSheetName) {
            resolve([]);
            return;
          }
          const worksheet = workbook.Sheets[firstSheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          resolve(rows);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = err => reject(err);
      reader.readAsArrayBuffer(file);
      return;
    }

    // Fallback jika XLSX tidak termuat dan berkas berupa CSV teks
    if (typeof CSV !== "undefined" && typeof CSV.parse === "function") {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const text = e.target.result;
          const rows = CSV.parse(text, true);
          resolve(rows);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = err => reject(err);
      reader.readAsText(file, "UTF-8");
      return;
    }

    reject(new Error("Modul parser spreadsheet (XLSX/CSV) tidak tersedia."));
  });
}

function initTeacherEvents() {
  // Tab Navigasi Guru
  document.querySelectorAll(".teacher-tab").forEach(button => {
    button.addEventListener("click", () => {
      setTeacherTab(button.dataset.tab);
    });
  });

  // Tombol Ekspor Nilai ke Excel (.xlsx)
  const exportBtn = $("exportResultsBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      if (typeof exportResultsToExcel === "function") {
        exportResultsToExcel();
      } else if (typeof exportResultsToCSV === "function") {
        exportResultsToCSV();
      } else {
        showToast("Modul ekspor spreadsheet belum siap.", "error");
      }
    });
  }

  // Tombol Kosongkan Riwayat Nilai Siswa
  const clearResultsBtn = $("clearResultsBtn");
  if (clearResultsBtn) {
    clearResultsBtn.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin mengosongkan seluruh riwayat hasil kuis murid? Nilai, benar/salah, dan waktu pengerjaan akan direset.")) {
        const students = typeof getStudents === "function" ? getStudents() : [];
        students.forEach(s => {
          s.lastScore = null;
          s.lastCorrect = 0;
          s.lastTotal = 0;
          s.lastHints = 0;
          s.lastPlayed = null;
        });
        if (typeof saveStudents === "function") {
          saveStudents(students);
        }
        showToast("Seluruh riwayat nilai kuis berhasil dikosongkan.", "success");
        renderTeacherDashboard();
      }
    });
  }

  // Tombol Sinkronkan Data dari Server
  const refreshStudentsBtn = $("refreshStudentsBtn");
  if (refreshStudentsBtn) {
    refreshStudentsBtn.addEventListener("click", async () => {
      refreshStudentsBtn.disabled = true;
      refreshStudentsBtn.textContent = "⏳ Menyinkronkan...";
      if (typeof fetchStudentsFromServer === "function") {
        await fetchStudentsFromServer();
      }
      renderTeacherDashboard();
      setTimeout(() => {
        refreshStudentsBtn.disabled = false;
        refreshStudentsBtn.textContent = "🔄 Sinkronkan Data";
      }, 500);
      showToast("Data murid berhasil disegarkan.", "success");
    });
  }

  // Tombol Kosongkan Data Seluruh Siswa
  const clearStudentsBtn = $("clearStudentsBtn");
  if (clearStudentsBtn) {
    clearStudentsBtn.addEventListener("click", async () => {
      if (confirm("Apakah Anda yakin ingin menghapus seluruh data siswa terdaftar? Daftar siswa akan menjadi kosong.")) {
        if (typeof saveStudents === "function") {
          saveStudents([]);
        }
        if (typeof Storage !== "undefined" && typeof Storage.set === "function") {
          Storage.set("timequest_initialized", true);
        }
        // Jika mode server, kosongkan berkas data/siswa.csv di server
        if (typeof IS_SERVER_MODE !== "undefined" && IS_SERVER_MODE) {
          try {
            await fetch("/api/students/reset", { method: "POST" });
          } catch (e) {
            console.warn("Gagal mereset siswa di server:", e);
          }
        }
        showToast("Daftar murid berhasil dibersihkan.", "success");
        renderTeacherDashboard();
      }
    });
  }

  // Tombol Logout Guru di Halaman Admin
  const teacherLogoutBtn = $("teacherLogoutBtn");
  if (teacherLogoutBtn) {
    teacherLogoutBtn.addEventListener("click", () => {
      clearTeacherSession();
      showToast("Berhasil keluar dari Ruang Guru.");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 300);
    });
  }

  // =========================================================
  // KELOLA MATERI (FORM SATU PER SATU & BULK CSV)
  // =========================================================

  // 1. Form Tambah Materi Satu per Satu
  const singleMaterialForm = $("singleMaterialForm");
  if (singleMaterialForm) {
    singleMaterialForm.addEventListener("submit", event => {
      event.preventDefault();

      const level = parseInt($("matLevel").value, 10) || 1;
      const judul = $("matJudul").value.trim();
      const isi = $("matIsi").value.trim();
      const tip = $("matTip") ? $("matTip").value.trim() : "";
      const img = $("matImg") ? $("matImg").value : "";

      if (!judul || !isi) {
        showToast("Judul dan penjelasan materi wajib diisi.", "error");
        return;
      }

      const materials = typeof getMaterials === "function" ? getMaterials() : [];
      const newMaterial = {
        id: "mat_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        level,
        judul,
        isi,
        tip,
        img: img || undefined
      };

      materials.push(newMaterial);
      if (typeof saveMaterials === "function") {
        saveMaterials(materials);
      }

      singleMaterialForm.reset();
      if ($("matImg")) $("matImg").value = "";
      if ($("thumbMatImg")) $("thumbMatImg").src = "assets/icons/book-open.svg";
      if ($("labelUploadedMat")) { $("labelUploadedMat").style.display = "none"; $("labelUploadedMat").textContent = ""; }
      if ($("btnClearMatImg")) $("btnClearMatImg").style.display = "none";
      if ($("fileMatImg")) $("fileMatImg").value = "";

      $("matLevel").value = String(level);
      updateMaterialLivePreview();
      showToast("Materi baru berhasil disimpan & diterbitkan!", "success");
      setMaterialSubtab("mat-list");
    });
  }

  // 2. Pemilihan Berkas CSV Materi (Klik & Drag-and-Drop)
  const matFileInput = $("materialCsvInput");
  const matFileLabel = $("materialFileSelected");
  const matDropzone = $("materialDropzone");
  const btnBrowseMat = $("btnBrowseMaterialCsv");

  if (btnBrowseMat && matFileInput) {
    btnBrowseMat.addEventListener("click", () => matFileInput.click());
  }

  if (matFileInput && matFileLabel) {
    matFileInput.addEventListener("change", () => {
      if (matFileInput.files && matFileInput.files.length > 0) {
        matFileLabel.textContent = `Berkas dipilih: ${matFileInput.files[0].name}`;
        matFileLabel.classList.remove("hidden");
      } else {
        matFileLabel.textContent = "";
        matFileLabel.classList.add("hidden");
      }
    });
  }

  if (matDropzone && matFileInput && matFileLabel) {
    ["dragenter", "dragover"].forEach(eventName => {
      matDropzone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        matDropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(eventName => {
      matDropzone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        matDropzone.classList.remove("dragover");
      });
    });

    matDropzone.addEventListener("drop", e => {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        matFileInput.files = e.dataTransfer.files;
        matFileLabel.textContent = `Berkas dipilih: ${matFileInput.files[0].name}`;
        matFileLabel.classList.remove("hidden");
      }
    });
  }

  // 3. Tombol Eksekusi Upload Bulk Excel / CSV Materi
  // 3. Tombol Eksekusi Upload Bulk Excel / CSV Materi (Mendukung Target Level & Mode Ganti/Tambah)
  const btnUploadMatCsv = $("btnUploadMaterialCsv");
  if (btnUploadMatCsv && matFileInput) {
    btnUploadMatCsv.addEventListener("click", async () => {
      if (!matFileInput.files || matFileInput.files.length === 0) {
        showToast("Pilih berkas Excel (.xlsx) atau CSV materi terlebih dahulu.", "error");
        return;
      }

      const file = matFileInput.files[0];
      const targetLevelVal = $("uploadMaterialTargetLevel") ? $("uploadMaterialTargetLevel").value : "all";
      const importMode = document.querySelector('input[name="matImportMode"]:checked')?.value || "append";

      try {
        const parsedRows = await readSpreadsheetFile(file);
        if (!Array.isArray(parsedRows) || parsedRows.length === 0) {
          showToast("Berkas spreadsheet kosong atau format baris tidak terbaca.", "error");
          return;
        }

        let currentMaterials = typeof getMaterials === "function" ? getMaterials() : [];

        // Jika mode replace, hapus materi lama pada level target atau semua level
        if (importMode === "replace") {
          if (targetLevelVal !== "all") {
            currentMaterials = currentMaterials.filter(m => String(m.level) !== targetLevelVal);
          } else {
            currentMaterials = [];
          }
        }

        let addedCount = 0;
        parsedRows.forEach((row, idx) => {
          const keys = Object.keys(row);
          const getVal = keyName => {
            const found = keys.find(k => k.trim().toLowerCase() === keyName.toLowerCase());
            return found ? String(row[found]).trim() : "";
          };

          const rawLevel = parseInt(getVal("level"), 10) || 1;
          const finalLevel = targetLevelVal !== "all" ? parseInt(targetLevelVal, 10) : Math.min(Math.max(rawLevel, 1), 4);
          const judul = getVal("judul") || getVal("title");
          const isi = getVal("isi") || getVal("penjelasan") || getVal("content");
          const tip = getVal("tip") || getVal("tips") || "";

          if (judul && isi) {
            currentMaterials.push({
              id: "mat_bulk_" + Date.now() + "_" + idx,
              level: finalLevel,
              judul,
              isi,
              tip
            });
            addedCount++;
          }
        });

        if (addedCount > 0) {
          if (typeof saveMaterials === "function") {
            saveMaterials(currentMaterials);
          }
          const levelInfo = targetLevelVal !== "all" ? `Level ${targetLevelVal}` : "Semua Level";
          showToast(`Berhasil menambahkan ${addedCount} materi baru untuk ${levelInfo}!`, "success");
          matFileInput.value = "";
          if (matFileLabel) {
            matFileLabel.textContent = "";
            matFileLabel.classList.add("hidden");
          }
          if (targetLevelVal !== "all" && $("filterMaterialLevel")) {
            $("filterMaterialLevel").value = targetLevelVal;
          }
          setMaterialSubtab("mat-list");
        } else {
          showToast("Tidak ada baris materi yang valid. Pastikan kolom header bernama 'judul' dan 'isi'.", "error");
        }
      } catch (err) {
        console.error("Gagal membaca berkas materi:", err);
        showToast("Terjadi kesalahan saat memproses berkas spreadsheet materi.", "error");
      }
    });
  }

  // 4. Unduh Template Excel Materi (.xlsx) Mendukung per Level
  function downloadMaterialTemplate(targetLevel = "all") {
    const allRows = [
      ["level", "judul", "isi", "tip"],
      [1, "Mengenal Jarum Jam Pendek & Panjang", "Jarum pendek menunjukkan jam dan jarum panjang menunjukkan menit. Pada jam tepat, jarum panjang selalu di angka 12.", "Jarum pendek = Jam, jarum panjang = Menit."],
      [1, "Membaca Jam Bulat Tepat", "Jika jarum pendek di angka 5 dan jarum panjang di angka 12, maka dibaca pukul 5 tepat (05.00).", "Angka 12 pada jarum panjang selalu bernilai menit 00."],
      [2, "Mengenal Format Jam Digital", "Jam digital menampilkan waktu menggunakan angka. Dua angka di depan menunjukkan jam, dan dua angka di belakang menunjukkan menit.", "Format: [JAM] : [MENIT]"],
      [2, "Membaca Waktu 05:00 pada Jam Digital", "Angka 05 di depan adalah jam 5, dan angka 00 di belakang adalah menit 00 (tepat).", "05:00 dibaca pukul lima tepat."],
      [3, "Arti Waktu Lama dan Sebentar", "Kegiatan yang memerlukan waktu banyak disebut waktu lama (contoh: tidur malam, belajar di sekolah). Kegiatan yang cepat selesai disebut waktu sebentar (contoh: minum, menggosok gigi).", "Lama = butuh banyak waktu, Sebentar = butuh sedikit waktu."],
      [3, "Membandingkan Durasi Dua Kegiatan", "Memasak sup memerlukan waktu lebih lama daripada mencuci tangan. Mencuci tangan memerlukan waktu lebih sebentar daripada memasak.", "Bandingkan berapa lama kegiatan biasanya berlangsung."],
      [4, "Mengenal Waktu Pagi, Siang, Sore, dan Malam", "Pukul 6 pagi waktu sarapan dan bersiap sekolah. Pukul 1 siang pulang sekolah. Pukul 4 sore bermain di taman. Pukul 8 malam belajar dan tidur.", "Perhatikan posisi jarum jam dan kondisi waktu kegiatan."],
      [4, "Menuliskan Keterangan Waktu Kegiatan", "Tuliskan keterangan lengkap seperti 'Pukul 7 pagi' atau 'Pukul 8 malam' sesuai dengan gambar kegiatan.", "Bedakan pagi (berangkat sekolah) dan malam (tidur)."]
    ];

    let rows = [allRows[0]];
    if (targetLevel !== "all") {
      rows.push(...allRows.slice(1).filter(r => String(r[0]) === String(targetLevel)));
    } else {
      rows = allRows;
    }

    const fileName = targetLevel === "all" ? "template_materi_semua_level.xlsx" : `template_materi_level_${targetLevel}.xlsx`;

    if (typeof XLSX !== "undefined") {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws["!cols"] = [{ wch: 8 }, { wch: 35 }, { wch: 60 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, ws, "Template Materi");
      XLSX.writeFile(wb, fileName);
      showToast(`Template Excel materi (${targetLevel === "all" ? "Semua Level" : "Level " + targetLevel}) berhasil diunduh!`, "success");
    } else if (typeof CSV !== "undefined" && typeof CSV.stringify === "function") {
      const headers = rows[0];
      const dataRows = rows.slice(1).map(r => r.map(String));
      const csvContent = CSV.stringify(headers, dataRows);
      CSV.download(fileName.replace(".xlsx", ".csv"), csvContent);
      showToast("Template CSV materi berhasil diunduh!", "success");
    }
  }

  const btnTemplateMat = $("btnTemplateMaterialCsv");
  if (btnTemplateMat) {
    btnTemplateMat.addEventListener("click", () => downloadMaterialTemplate("all"));
  }

  document.querySelectorAll(".btn-template-mat-level").forEach(btn => {
    btn.addEventListener("click", () => {
      downloadMaterialTemplate(btn.dataset.level);
    });
  });

  // 5. Reset Materi ke Data Awal
  const btnResetMat = $("btnResetMaterials");
  if (btnResetMat) {
    btnResetMat.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin mengembalikan seluruh materi ke data default? Modul materi yang baru Anda tambahkan akan terhapus.")) {
        if (typeof resetMaterials === "function") {
          resetMaterials();
        }
        showToast("Materi pembelajaran berhasil dikembalikan ke default.", "success");
        renderTeacherMaterials();
      }
    });
  }

  // 6. Filter Level Materi
  const filterMatLevel = $("filterMaterialLevel");
  if (filterMatLevel) {
    filterMatLevel.addEventListener("change", renderTeacherMaterials);
  }

  // 6b. Filter Pill Bar Level Materi & Tombol Cepat Tambah Materi Level Ini
  document.querySelectorAll("#matLevelPillsBar .level-pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const level = btn.dataset.level || "all";
      if ($("filterMaterialLevel")) {
        $("filterMaterialLevel").value = level;
      }
      renderTeacherMaterials();
    });
  });

  const btnQuickAddMat = $("btnQuickAddMatForLevel");
  if (btnQuickAddMat) {
    btnQuickAddMat.addEventListener("click", () => {
      const currentLevel = $("filterMaterialLevel") ? $("filterMaterialLevel").value : "all";
      if (currentLevel !== "all" && $("matLevel")) {
        $("matLevel").value = currentLevel;
      }
      setMaterialSubtab("mat-create");
      updateMaterialLivePreview();
      const inputJudul = $("matJudul");
      if (inputJudul) inputJudul.focus();
    });
  }

  // =========================================================
  // KELOLA SOAL KUIS (FORM SATU PER SATU & BULK CSV)
  // =========================================================

  // 1. Toggle Jam Analog & Visibilitas Opsi saat Tipe Soal Berubah
  const qTypeSelect = $("qType");
  if (qTypeSelect) {
    qTypeSelect.addEventListener("change", () => {
      updateQuestionLivePreview();
    });
  }

  // 1b. Otomatisasi pemilihan tipe soal saat level kuis diubah
  const qLevelSelect = $("qLevel");
  if (qLevelSelect) {
    qLevelSelect.addEventListener("change", () => {
      const selectedLvl = qLevelSelect.value;
      if (qTypeSelect) {
        if (selectedLvl === "1") {
          qTypeSelect.value = "clock_drag";
        } else if (selectedLvl === "2") {
          qTypeSelect.value = "clock_drop";
        } else if (selectedLvl === "3") {
          qTypeSelect.value = "time_compare";
        } else if (selectedLvl === "4") {
          qTypeSelect.value = "clock_activity_drop";
        } else {
          qTypeSelect.value = "text";
        }
      }
      const pointsInput = $("qPoints");
      if (pointsInput) {
        pointsInput.value = (selectedLvl === "1" || selectedLvl === "2" || selectedLvl === "3" || selectedLvl === "4") ? "100" : "20";
      }
      const qTextInput = $("qText");
      if (qTextInput && !qTextInput.value.trim()) {
        if (selectedLvl === "1") {
          qTextInput.placeholder = "Contoh: Halim bangun tidur pukul 5 pagi. Arahkan jarum jam ke pukul 05.00!";
        } else if (selectedLvl === "2") {
          qTextInput.placeholder = "Contoh: Halim bangun tidur pukul 5 pagi. Pasangkan angka (jam) dan (menit) yang tepat pada jam digital!";
        } else if (selectedLvl === "3") {
          qTextInput.placeholder = "Contoh: Beri tanda centang (✓) pada kegiatan yang lebih lama!";
        } else if (selectedLvl === "4") {
          qTextInput.placeholder = "Contoh: Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:";
        } else {
          qTextInput.placeholder = "Contoh: Kalimat pertanyaan soal kuis...";
        }
      }
      updateQuestionLivePreview();
    });
  }

  // 2. Form Tambah Soal Satu per Satu
  const singleQuestionForm = $("singleQuestionForm");
  if (singleQuestionForm) {
    singleQuestionForm.addEventListener("submit", event => {
      event.preventDefault();

      const level = parseInt($("qLevel").value, 10) || 1;
      const tipe = $("qType").value;
      const pertanyaan = $("qText").value.trim();
      const isClockDrag = tipe === "clock_drag";
      const isClockDrop = tipe === "clock_drop";
      const isTimeCompare = tipe === "time_compare";
      const isActivityDrop = tipe === "clock_activity_drop";
      const poin = parseInt($("qPoints").value, 10) || ((isClockDrag || isClockDrop || isTimeCompare || isActivityDrop) ? 100 : 20);
      const hint = $("qHint") ? $("qHint").value.trim() : "";
      const penjelasan = $("qExplanation") ? $("qExplanation").value.trim() : "";

      if (!pertanyaan) {
        showToast("Kalimat pertanyaan soal kuis wajib diisi.", "error");
        return;
      }

      let newQuestion;

      if (isClockDrag) {
        // Tipe Level 1: Putar Jarum Jam Analog (clock_drag)
        const jam = parseInt($("qClockHour").value, 10) || 5;
        const menit = parseInt($("qClockMinute").value, 10) || 0;
        const targetStr = `${String(jam).padStart(2, "0")}.${String(menit).padStart(2, "0")}`;

        newQuestion = {
          id: "Q" + String(Date.now()).slice(-4),
          level,
          type: "clock_drag",
          tipe: "clock_drag",
          targetHour: jam,
          targetMinute: menit,
          targetTime: targetStr,
          question: pertanyaan,
          pertanyaan: pertanyaan,
          hint: hint || `Arahkan jarum pendek merah ke angka ${jam}, dan jarum panjang biru ke angka ${menit === 0 ? 12 : Math.round(menit / 5)}.`,
          explanation: penjelasan || `Pukul ${targetStr} artinya jarum pendek (merah) menunjuk angka ${jam} dan jarum panjang (biru) menunjuk angka ${menit === 0 ? 12 : Math.round(menit / 5)}.`,
          penjelasan: penjelasan || `Pukul ${targetStr} artinya jarum pendek (merah) menunjuk angka ${jam} dan jarum panjang (biru) menunjuk angka ${menit === 0 ? 12 : Math.round(menit / 5)}.`,
          points: poin,
          poin: poin,
          jam,
          menit
        };
      } else if (isClockDrop) {
        // Tipe Level 2: Drag & Drop Angka Jam Digital (clock_drop)
        const digiH = ($("qDigitalHour") ? $("qDigitalHour").value.trim() : "05").padStart(2, "0");
        const digiM = ($("qDigitalMinute") ? $("qDigitalMinute").value.trim() : "00").padStart(2, "0");
        const chip1 = ($("qChip1") ? $("qChip1").value.trim() : "07").padStart(2, "0");
        const chip2 = ($("qChip2") ? $("qChip2").value.trim() : "30").padStart(2, "0");
        const chip3 = ($("qChip3") ? $("qChip3").value.trim() : digiH).padStart(2, "0");
        const chip4 = ($("qChip4") ? $("qChip4").value.trim() : "12").padStart(2, "0");
        const chip5 = ($("qChip5") ? $("qChip5").value.trim() : digiM).padStart(2, "0");
        const chip6 = ($("qChip6") ? $("qChip6").value.trim() : "06").padStart(2, "0");
        const chips = [chip1, chip2, chip3, chip4, chip5, chip6];

        newQuestion = {
          id: "Q" + String(Date.now()).slice(-4),
          level,
          type: "clock_drop",
          tipe: "clock_drop",
          targetHour: digiH,
          targetMinute: digiM,
          targetTime: `${digiH}:${digiM}`,
          question: pertanyaan,
          pertanyaan: pertanyaan,
          options: chips,
          pilihan: chips,
          hint: hint || `Pasangkan angka ${digiH} pada kotak Jam dan angka ${digiM} pada kotak Menit.`,
          explanation: penjelasan || `Pukul ${digiH}:${digiM} pada jam digital: angka jam diisi ${digiH} dan angka menit diisi ${digiM} (${digiH}:${digiM}).`,
          penjelasan: penjelasan || `Pukul ${digiH}:${digiM} pada jam digital: angka jam diisi ${digiH} dan angka menit diisi ${digiM} (${digiH}:${digiM}).`,
          points: poin,
          poin: poin
        };
      } else if (isTimeCompare) {
        // Tipe Level 3: Perbandingan Durasi Kegiatan (time_compare)
        const label1 = ($("qCompareLabel1") ? $("qCompareLabel1").value.trim() : "Menyisir rambut") || "Menyisir rambut";
        const img1 = ($("qCompareImg1") ? $("qCompareImg1").value.trim() : "assets/images/activity_combing.png") || "assets/images/activity_combing.png";
        const label2 = ($("qCompareLabel2") ? $("qCompareLabel2").value.trim() : "Mandi") || "Mandi";
        const img2 = ($("qCompareImg2") ? $("qCompareImg2").value.trim() : "assets/images/activity_bathing.png") || "assets/images/activity_bathing.png";
        const correctRadio = document.querySelector('input[name="qTimeCompareCorrect"]:checked');
        const correctIdx = correctRadio ? parseInt(correctRadio.value, 10) : 1;
        const correctLabel = correctIdx === 0 ? label1 : label2;

        newQuestion = {
          id: "Q" + String(Date.now()).slice(-4),
          level: 3,
          type: "time_compare",
          tipe: "time_compare",
          question: pertanyaan,
          pertanyaan: pertanyaan,
          items: [
            { label: label1, img: img1 },
            { label: label2, img: img2 }
          ],
          options: [label1, label2],
          pilihan: [label1, label2],
          correct: correctIdx,
          kunci: correctIdx === 0 ? "A" : "B",
          hint: hint || `Bandingkan durasi waktu antara kegiatan ${label1} dan ${label2}.`,
          explanation: penjelasan || `Kegiatan ${correctLabel} adalah jawaban yang benar.`,
          penjelasan: penjelasan || `Kegiatan ${correctLabel} adalah jawaban yang benar.`,
          points: poin,
          poin: poin
        };
      } else if (isActivityDrop) {
        // Tipe Level 4: Pasangkan Waktu Kegiatan (clock_activity_drop)
        const targetAns = ($("qActivityCorrectAnswer") ? $("qActivityCorrectAnswer").value.trim() : "Pukul 7 pagi") || "Pukul 7 pagi";
        const actImg = ($("qActivityImg") && $("qActivityImg").dataset.customUrl && ($("qActivityImg").value === "custom" || $("qActivityImg").value.startsWith("data:")))
          ? $("qActivityImg").dataset.customUrl
          : (($("qActivityImg") ? $("qActivityImg").value : "assets/images/time_activity_school.png") || "assets/images/time_activity_school.png");
        const chip1 = ($("qActChip1") ? $("qActChip1").value.trim() : targetAns) || targetAns;
        const chip2 = ($("qActChip2") ? $("qActChip2").value.trim() : "Pukul 7 malam") || "Pukul 7 malam";
        const chip3 = ($("qActChip3") ? $("qActChip3").value.trim() : "Pukul 8 pagi") || "Pukul 8 pagi";
        const chip4 = ($("qActChip4") ? $("qActChip4").value.trim() : "Pukul 12 siang") || "Pukul 12 siang";
        const chips = [chip1, chip2, chip3, chip4];
        let correctIdx = chips.findIndex(c => c.toLowerCase() === targetAns.toLowerCase());
        if (correctIdx === -1) correctIdx = 0;

        newQuestion = {
          id: "Q" + String(Date.now()).slice(-4),
          level: 4,
          type: "clock_activity_drop",
          tipe: "clock_activity_drop",
          img: actImg,
          targetAnswer: targetAns,
          question: pertanyaan,
          pertanyaan: pertanyaan,
          options: chips,
          pilihan: chips,
          correct: correctIdx,
          kunci: ["A", "B", "C", "D"][correctIdx],
          hint: hint || `Perhatikan gambar kegiatan dan cocokkan dengan pilihan waktu ${targetAns}.`,
          explanation: penjelasan || `Kegiatan pada gambar berlangsung tepat pada ${targetAns}.`,
          penjelasan: penjelasan || `Kegiatan pada gambar berlangsung tepat pada ${targetAns}.`,
          points: poin,
          poin: poin
        };
      } else {
        // Tipe Pilihan Ganda (clock atau text)
        const optA = $("qOptA") ? $("qOptA").value.trim() : "";
        const optB = $("qOptB") ? $("qOptB").value.trim() : "";
        const optC = $("qOptC") ? $("qOptC").value.trim() : "";
        const optD = $("qOptD") ? $("qOptD").value.trim() : "";
        const correctKeyLetter = $("qCorrectKey") ? $("qCorrectKey").value : "A";

        if (!optA || !optB || !optC || !optD) {
          showToast("Untuk tipe pilihan ganda, semua opsi (A, B, C, D) wajib diisi.", "error");
          return;
        }

        const letterMap = { "A": 0, "B": 1, "C": 2, "D": 3 };
        const keyIndex = letterMap[correctKeyLetter] ?? 0;

        let jam = 12;
        let menit = 0;
        if (tipe === "clock") {
          jam = parseInt($("qClockHour").value, 10) || 12;
          menit = parseInt($("qClockMinute").value, 10) || 0;
        }

        const qCustomImg = $("qCustomImg") ? $("qCustomImg").value : "";

        newQuestion = {
          id: "q_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          level,
          type: tipe,
          tipe,
          img: qCustomImg || undefined,
          question: pertanyaan,
          pertanyaan,
          options: [optA, optB, optC, optD],
          pilihan: [optA, optB, optC, optD],
          correct: keyIndex,
          kunci: keyIndex,
          hint,
          explanation: penjelasan,
          penjelasan: penjelasan,
          points: poin,
          poin: poin,
          jam: tipe === "clock" ? jam : undefined,
          menit: tipe === "clock" ? menit : undefined
        };
      }

      const questions = typeof getQuestions === "function" ? getQuestions() : [];
      questions.push(newQuestion);
      if (typeof saveQuestions === "function") {
        saveQuestions(questions);
      }

      singleQuestionForm.reset();

      // Reset state upload gambar / SVG untuk Level 3, Level 4, dan Soal Umum
      if ($("qCompareImg1")) $("qCompareImg1").value = "assets/images/activity_combing.png";
      if ($("thumbCompareImg1")) $("thumbCompareImg1").src = "assets/images/activity_combing.png";
      if ($("selectCompareImg1Preset")) $("selectCompareImg1Preset").value = "assets/images/activity_combing.png";
      if ($("labelUploadedCompare1")) { $("labelUploadedCompare1").style.display = "none"; $("labelUploadedCompare1").textContent = ""; }
      if ($("fileCompareImg1")) $("fileCompareImg1").value = "";

      if ($("qCompareImg2")) $("qCompareImg2").value = "assets/images/activity_bathing.png";
      if ($("thumbCompareImg2")) $("thumbCompareImg2").src = "assets/images/activity_bathing.png";
      if ($("selectCompareImg2Preset")) $("selectCompareImg2Preset").value = "assets/images/activity_bathing.png";
      if ($("labelUploadedCompare2")) { $("labelUploadedCompare2").style.display = "none"; $("labelUploadedCompare2").textContent = ""; }
      if ($("fileCompareImg2")) $("fileCompareImg2").value = "";

      if ($("qActivityImg")) {
        $("qActivityImg").value = "assets/images/time_activity_school.png";
        delete $("qActivityImg").dataset.customUrl;
      }
      if ($("thumbActivityImg")) $("thumbActivityImg").src = "assets/images/time_activity_school.png";
      if ($("labelUploadedActivity")) { $("labelUploadedActivity").style.display = "none"; $("labelUploadedActivity").textContent = ""; }
      if ($("fileActivityImg")) $("fileActivityImg").value = "";

      if ($("qCustomImg")) $("qCustomImg").value = "";
      if ($("thumbQuestionImg")) $("thumbQuestionImg").src = "assets/icons/clock.svg";
      if ($("labelUploadedQuestionImg")) { $("labelUploadedQuestionImg").style.display = "none"; $("labelUploadedQuestionImg").textContent = ""; }
      if ($("btnClearQuestionImg")) $("btnClearQuestionImg").style.display = "none";
      if ($("fileQuestionImg")) $("fileQuestionImg").value = "";
      $("qLevel").value = String(level);
      $("qType").value = level === 1 ? "clock_drag" : (level === 2 ? "clock_drop" : (level === 3 ? "time_compare" : (level === 4 ? "clock_activity_drop" : "text")));
      $("qPoints").value = (level >= 1 && level <= 4) ? "100" : "20";
      document.querySelectorAll(".option-radio-btn").forEach(b => b.classList.toggle("selected", b.dataset.key === "A"));
      document.querySelectorAll(".option-builder-item").forEach(item => {
        item.classList.toggle("is-correct", item.id === "optItemA");
      });
      if ($("qCorrectKey")) $("qCorrectKey").value = "A";
      updateQuestionLivePreview();
      const typeLabel = isClockDrag ? "Putar Jam" : (isClockDrop ? "Jam Digital" : (isTimeCompare ? "Perbandingan Waktu" : (isActivityDrop ? "Waktu Kegiatan" : "Pilihan Ganda")));
      showToast(`Soal kuis level ${level} (${typeLabel}) berhasil disimpan & diterbitkan!`, "success");
      setQuestionSubtab("q-list");
    });
  }

  // 3. Pemilihan Berkas CSV Soal (Klik & Drag-and-Drop)
  const qFileInput = $("questionCsvInput");
  const qFileLabel = $("questionFileSelected");
  const qDropzone = $("questionDropzone");
  const btnBrowseQ = $("btnBrowseQuestionCsv");

  if (btnBrowseQ && qFileInput) {
    btnBrowseQ.addEventListener("click", () => qFileInput.click());
  }

  if (qFileInput && qFileLabel) {
    qFileInput.addEventListener("change", () => {
      if (qFileInput.files && qFileInput.files.length > 0) {
        qFileLabel.textContent = `Berkas dipilih: ${qFileInput.files[0].name}`;
        qFileLabel.classList.remove("hidden");
      } else {
        qFileLabel.textContent = "";
        qFileLabel.classList.add("hidden");
      }
    });
  }

  if (qDropzone && qFileInput && qFileLabel) {
    ["dragenter", "dragover"].forEach(eventName => {
      qDropzone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        qDropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(eventName => {
      qDropzone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        qDropzone.classList.remove("dragover");
      });
    });

    qDropzone.addEventListener("drop", e => {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        qFileInput.files = e.dataTransfer.files;
        qFileLabel.textContent = `Berkas dipilih: ${qFileInput.files[0].name}`;
        qFileLabel.classList.remove("hidden");
      }
    });
  }

  // 4. Tombol Eksekusi Upload Bulk Excel / CSV Soal (Mendukung Target Level & Mode Ganti/Tambah)
  const btnUploadQCsv = $("btnUploadQuestionCsv");
  if (btnUploadQCsv && qFileInput) {
    btnUploadQCsv.addEventListener("click", async () => {
      if (!qFileInput.files || qFileInput.files.length === 0) {
        showToast("Pilih berkas Excel (.xlsx) atau CSV soal kuis terlebih dahulu.", "error");
        return;
      }

      const file = qFileInput.files[0];
      const targetLevelVal = $("uploadQuestionTargetLevel") ? $("uploadQuestionTargetLevel").value : "all";
      const importMode = document.querySelector('input[name="qImportMode"]:checked')?.value || "append";

      try {
        const parsedRows = await readSpreadsheetFile(file);
        if (!Array.isArray(parsedRows) || parsedRows.length === 0) {
          showToast("Berkas spreadsheet kosong atau format baris tidak terbaca.", "error");
          return;
        }

        let currentQuestions = typeof getQuestions === "function" ? getQuestions() : [];

        // Jika mode replace, hapus soal kuis lama pada level target atau semua level
        if (importMode === "replace") {
          if (targetLevelVal !== "all") {
            currentQuestions = currentQuestions.filter(q => String(q.level) !== targetLevelVal);
          } else {
            currentQuestions = [];
          }
        }

        let addedCount = 0;
        const letterMap = { "A": 0, "B": 1, "C": 2, "D": 3 };

        parsedRows.forEach((row, idx) => {
          const keys = Object.keys(row);
          const getVal = keyName => {
            const found = keys.find(k => k.trim().toLowerCase() === keyName.toLowerCase());
            return found ? String(row[found]).trim() : "";
          };

          const rawLevel = parseInt(getVal("level"), 10) || 1;
          const finalLevel = targetLevelVal !== "all" ? parseInt(targetLevelVal, 10) : Math.min(Math.max(rawLevel, 1), 4);
          const pertanyaan = getVal("pertanyaan") || getVal("soal") || getVal("question");
          const tipeRaw = (getVal("tipe") || getVal("type")).toLowerCase();
          
          let tipe = "clock_drag";
          if (tipeRaw === "text" || tipeRaw === "teks") {
            tipe = "text";
          } else if (tipeRaw.includes("drag")) {
            tipe = "clock_drag";
          } else if (tipeRaw.includes("drop") || tipeRaw.includes("digital")) {
            tipe = "clock_drop";
          } else if (tipeRaw.includes("compare") || tipeRaw.includes("lama")) {
            tipe = "time_compare";
          } else if (tipeRaw.includes("activity")) {
            tipe = "clock_activity_drop";
          } else if (finalLevel === 1) {
            tipe = "clock_drag";
          } else {
            tipe = "text";
          }

          const optA = getVal("pilihan_a") || getVal("opsi_a") || getVal("a");
          const optB = getVal("pilihan_b") || getVal("opsi_b") || getVal("b");
          const optC = getVal("pilihan_c") || getVal("opsi_c") || getVal("c");
          const optD = getVal("pilihan_d") || getVal("opsi_d") || getVal("d");

          const rawKunci = getVal("kunci") || getVal("jawaban") || getVal("answer") || "A";
          let keyIndex = 0;
          if (letterMap[rawKunci.toUpperCase()] !== undefined) {
            keyIndex = letterMap[rawKunci.toUpperCase()];
          } else if (!isNaN(parseInt(rawKunci, 10))) {
            keyIndex = Math.min(Math.max(parseInt(rawKunci, 10), 0), 3);
          }

          const hint = getVal("hint") || getVal("petunjuk") || "";
          const penjelasan = getVal("penjelasan") || getVal("pembahasan") || "";
          const poin = parseInt(getVal("poin") || getVal("points"), 10) || (finalLevel === 1 || tipe === "clock_drag" ? 100 : 25);

          const jam = parseInt(getVal("jam") || getVal("hour"), 10) || 12;
          const menit = parseInt(getVal("menit") || getVal("minute"), 10) || 0;

          if (tipe === "clock_drag" || finalLevel === 1) {
            if (pertanyaan) {
              const targetStr = `${String(jam).padStart(2, "0")}.${String(menit).padStart(2, "0")}`;
              currentQuestions.push({
                id: "q_bulk_" + Date.now() + "_" + idx,
                level: 1,
                type: "clock_drag",
                tipe: "clock_drag",
                targetHour: jam,
                targetMinute: menit,
                targetTime: targetStr,
                question: pertanyaan,
                pertanyaan: pertanyaan,
                hint: hint || `Arahkan jarum pendek merah ke angka ${jam}, dan jarum panjang biru ke angka ${menit === 0 ? 12 : Math.round(menit / 5)}.`,
                explanation: penjelasan || `Pukul ${targetStr} artinya jarum pendek (merah) di angka ${jam} dan jarum panjang (biru) di angka ${menit === 0 ? 12 : Math.round(menit / 5)}.`,
                penjelasan: penjelasan || `Pukul ${targetStr} artinya jarum pendek (merah) di angka ${jam} dan jarum panjang (biru) di angka ${menit === 0 ? 12 : Math.round(menit / 5)}.`,
                points: poin,
                poin: poin,
                jam,
                menit
              });
              addedCount++;
            }
          } else if (tipe === "clock_drop" || finalLevel === 2) {
            if (pertanyaan) {
              const digiH = String(jam || 5).padStart(2, "0");
              const digiM = String(menit !== undefined && menit !== "" ? menit : 0).padStart(2, "0");
              const chip1 = optA ? String(optA).padStart(2, "0") : digiH;
              const chip2 = optB ? String(optB).padStart(2, "0") : digiM;
              const chip3 = optC ? String(optC).padStart(2, "0") : "07";
              const chip4 = optD ? String(optD).padStart(2, "0") : "30";
              const chips = [chip1, chip2, chip3, chip4];

              currentQuestions.push({
                id: "q_bulk_" + Date.now() + "_" + idx,
                level: 2,
                type: "clock_drop",
                tipe: "clock_drop",
                targetHour: digiH,
                targetMinute: digiM,
                targetTime: `${digiH}:${digiM}`,
                question: pertanyaan,
                pertanyaan: pertanyaan,
                options: chips,
                pilihan: chips,
                hint: hint || `Pasangkan angka ${digiH} pada kotak Jam dan angka ${digiM} pada kotak Menit.`,
                explanation: penjelasan || `Pukul ${digiH}:${digiM} pada jam digital: angka jam diisi ${digiH} dan angka menit diisi ${digiM} (${digiH}:${digiM}).`,
                penjelasan: penjelasan || `Pukul ${digiH}:${digiM} pada jam digital: angka jam diisi ${digiH} dan angka menit diisi ${digiM} (${digiH}:${digiM}).`,
                points: poin || 100,
                poin: poin || 100
              });
              addedCount++;
            }
          } else if (tipe === "time_compare" || finalLevel === 3) {
            if (pertanyaan) {
              const label1 = optA || "Menyisir rambut";
              const label2 = optB || "Mandi";
              const correctIdx = (keyIndex === 0 || keyIndex === 1) ? keyIndex : 1;
              const img1 = getVal("gambar_a") || "assets/images/activity_combing.png";
              const img2 = getVal("gambar_b") || "assets/images/activity_bathing.png";

              currentQuestions.push({
                id: "q_bulk_" + Date.now() + "_" + idx,
                level: 3,
                type: "time_compare",
                tipe: "time_compare",
                question: pertanyaan,
                pertanyaan: pertanyaan,
                items: [
                  { label: label1, img: img1 },
                  { label: label2, img: img2 }
                ],
                options: [label1, label2],
                pilihan: [label1, label2],
                correct: correctIdx,
                kunci: correctIdx === 0 ? "A" : "B",
                hint: hint || `Bandingkan durasi waktu antara ${label1} dan ${label2}.`,
                explanation: penjelasan || `Kegiatan ${correctIdx === 0 ? label1 : label2} adalah jawaban yang benar.`,
                penjelasan: penjelasan || `Kegiatan ${correctIdx === 0 ? label1 : label2} adalah jawaban yang benar.`,
                points: poin || 100,
                poin: poin || 100
              });
              addedCount++;
            }
          } else if (tipe === "clock_activity_drop" || finalLevel === 4) {
            if (pertanyaan) {
              const targetAns = rawKunci.length > 1 ? rawKunci : (optA || "Pukul 7 pagi");
              const actImg = getVal("gambar") || "assets/images/time_activity_school.png";
              const chip1 = optA || targetAns;
              const chip2 = optB || "Pukul 7 malam";
              const chip3 = optC || "Pukul 8 pagi";
              const chip4 = optD || "Pukul 12 siang";
              const chips = [chip1, chip2, chip3, chip4];
              let correctIdx = chips.findIndex(c => c.toLowerCase() === targetAns.toLowerCase());
              if (correctIdx === -1) correctIdx = (keyIndex >= 0 && keyIndex < 4) ? keyIndex : 0;

              currentQuestions.push({
                id: "q_bulk_" + Date.now() + "_" + idx,
                level: 4,
                type: "clock_activity_drop",
                tipe: "clock_activity_drop",
                img: actImg,
                targetAnswer: targetAns,
                question: pertanyaan,
                pertanyaan: pertanyaan,
                options: chips,
                pilihan: chips,
                correct: correctIdx,
                kunci: ["A", "B", "C", "D"][correctIdx],
                hint: hint || `Perhatikan gambar kegiatan dan pasangkan keterangan waktu kegiatan yang tepat (${targetAns}).`,
                explanation: penjelasan || `Kegiatan pada gambar berlangsung tepat pada ${targetAns}.`,
                penjelasan: penjelasan || `Kegiatan pada gambar berlangsung tepat pada ${targetAns}.`,
                points: poin || 100,
                poin: poin || 100
              });
              addedCount++;
            }
          } else if (pertanyaan && optA && optB) {
            const options = [optA, optB];
            if (optC) options.push(optC);
            if (optD) options.push(optD);

            currentQuestions.push({
              id: "q_bulk_" + Date.now() + "_" + idx,
              level: finalLevel,
              type: tipe,
              tipe,
              pertanyaan,
              question: pertanyaan,
              pilihan: options,
              options,
              kunci: keyIndex,
              correct: keyIndex,
              hint,
              penjelasan,
              explanation: penjelasan,
              poin,
              points: poin,
              jam: tipe === "clock" ? jam : undefined,
              menit: tipe === "clock" ? menit : undefined
            });
            addedCount++;
          }
        });

        if (addedCount > 0) {
          if (typeof saveQuestions === "function") {
            saveQuestions(currentQuestions);
          }
          const levelInfo = targetLevelVal !== "all" ? `Level ${targetLevelVal}` : "Semua Level";
          showToast(`Berhasil menambahkan ${addedCount} soal kuis baru untuk ${levelInfo}!`, "success");
          qFileInput.value = "";
          if (qFileLabel) {
            qFileLabel.textContent = "";
            qFileLabel.classList.add("hidden");
          }
          if (targetLevelVal !== "all" && $("filterQuestionLevel")) {
            $("filterQuestionLevel").value = targetLevelVal;
          }
          setQuestionSubtab("q-list");
        } else {
          showToast("Tidak ada baris soal yang valid. Pastikan kolom pertanyaan dan opsi pilihan terisi.", "error");
        }
      } catch (err) {
        console.error("Gagal membaca berkas soal:", err);
        showToast("Terjadi kesalahan saat memproses berkas spreadsheet soal.", "error");
      }
    });
  }

  // 5. Unduh Template Excel Soal Kuis (.xlsx) Mendukung per Level
  function downloadQuestionTemplate(targetLevel = "all") {
    const headers = ["level", "pertanyaan", "tipe", "pilihan_a", "pilihan_b", "pilihan_c", "pilihan_d", "kunci", "hint", "penjelasan", "poin", "jam", "menit"];
    const allRows = [
      headers,
      [1, "Halim bangun tidur pukul 5 pagi. Arahkan jarum jam ke pukul 05.00!", "clock_drag", "", "", "", "", "05.00", "Arahkan jarum pendek merah ke angka 5, dan jarum panjang biru ke 12.", "Pukul 05.00 artinya jarum pendek di angka 5 dan jarum panjang di angka 12.", 100, 5, 0],
      [1, "Nando pulang sekolah pukul 1 siang. Arahkan jarum jam ke pukul 01.00!", "clock_drag", "", "", "", "", "01.00", "Arahkan jarum pendek merah ke angka 1, dan jarum panjang biru ke 12.", "Pukul 01.00 artinya jarum pendek di angka 1 dan jarum panjang di angka 12.", 100, 1, 0],
      [2, "Halim bangun tidur pukul 5 pagi. Pasangkan angka (jam) dan (menit) yang tepat pada jam digital!", "clock_drop", "05", "00", "07", "30", "05:00", "Pasangkan angka 05 pada kotak Jam dan angka 00 pada kotak Menit.", "Pukul 5 pagi pada jam digital: jam diisi 05 dan menit diisi 00 (05:00).", 100, 5, 0],
      [2, "Tika berangkat ke sekolah pukul 7 pagi. Pasangkan angka (jam) dan (menit) yang tepat pada jam digital!", "clock_drop", "07", "00", "05", "30", "07:00", "Pasangkan angka 07 pada kotak Jam dan angka 00 pada kotak Menit.", "Pukul 7 pagi pada jam digital: jam diisi 07 dan menit diisi 00 (07:00).", 100, 7, 0],
      [3, "Beri tanda centang (✓) pada kegiatan yang lebih lama!", "time_compare", "Menyisir rambut", "Mandi", "", "", "B", "Bandingkan waktu menyisir rambut dengan mandi.", "Mandi memerlukan waktu lebih lama (sekitar 15 menit) dibandingkan menyisir rambut (1 menit).", 100, 0, 0],
      [3, "Beri tanda centang (✓) pada kegiatan yang lebih sebentar (lebih cepat)!", "time_compare", "Memasak", "Meminum air", "", "", "B", "Meminum air hanya butuh beberapa tegukan sebentar saja.", "Meminum segelas air memerlukan waktu lebih sebentar / lebih cepat (beberapa detik hingga 1 menit).", 100, 0, 0],
      [4, "Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:", "clock_activity_drop", "Pukul 7 pagi", "Pukul 7 malam", "Pukul 8 pagi", "Pukul 12 siang", "A", "Jarum pendek menunjuk angka 7 pada pagi hari saat berangkat sekolah.", "Jarum jam menunjuk angka 7 tepat di pagi hari saat anak-anak berangkat sekolah, yaitu Pukul 7 pagi.", 100, 7, 0],
      [4, "Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:", "clock_activity_drop", "Pukul 8 pagi", "Pukul 8 malam", "Pukul 7 pagi", "Pukul 1 siang", "A", "Jarum pendek menunjuk angka 8 pada pagi hari saat belajar di kelas.", "Jarum jam menunjuk angka 8 tepat saat murid belajar di sekolah di pagi hari, yaitu Pukul 8 pagi.", 100, 8, 0]
    ];

    let rows = [allRows[0]];
    if (targetLevel !== "all") {
      rows.push(...allRows.slice(1).filter(r => String(r[0]) === String(targetLevel)));
    } else {
      rows = allRows;
    }

    const fileName = targetLevel === "all" ? "template_soal_kuis_semua_level.xlsx" : `template_soal_kuis_level_${targetLevel}.xlsx`;

    if (typeof XLSX !== "undefined") {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws["!cols"] = [{ wch: 8 }, { wch: 45 }, { wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 8 }, { wch: 28 }, { wch: 40 }, { wch: 8 }, { wch: 8 }, { wch: 8 }];
      XLSX.utils.book_append_sheet(wb, ws, "Template Soal");
      XLSX.writeFile(wb, fileName);
      showToast(`Template Excel kuis (${targetLevel === "all" ? "Semua Level" : "Level " + targetLevel}) berhasil diunduh!`, "success");
    } else if (typeof CSV !== "undefined" && typeof CSV.stringify === "function") {
      const headers = rows[0];
      const dataRows = rows.slice(1).map(r => r.map(String));
      const csvContent = CSV.stringify(headers, dataRows);
      CSV.download(fileName.replace(".xlsx", ".csv"), csvContent);
      showToast("Template CSV kuis berhasil diunduh!", "success");
    }
  }

  const btnTemplateQ = $("btnTemplateQuestionCsv");
  if (btnTemplateQ) {
    btnTemplateQ.addEventListener("click", () => downloadQuestionTemplate("all"));
  }

  document.querySelectorAll(".btn-template-q-level").forEach(btn => {
    btn.addEventListener("click", () => {
      downloadQuestionTemplate(btn.dataset.level);
    });
  });

  // 6. Reset Soal ke Data Awal
  const btnResetQ = $("btnResetQuestions");
  if (btnResetQ) {
    btnResetQ.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin mengembalikan seluruh soal kuis ke soal default? Soal yang baru Anda tambahkan akan terhapus.")) {
        if (typeof resetQuestions === "function") {
          resetQuestions();
        }
        showToast("Soal kuis berhasil dikembalikan ke default.", "success");
        renderTeacherQuestions();
      }
    });
  }

  // 7. Filter Level Soal Kuis
  const filterQLevel = $("filterQuestionLevel");
  if (filterQLevel) {
    filterQLevel.addEventListener("change", renderTeacherQuestions);
  }

  // 7b. Filter Pill Bar Level Kuis & Tombol Cepat Buat Soal Level Ini
  document.querySelectorAll("#qLevelPillsBar .level-pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const level = btn.dataset.level || "all";
      if ($("filterQuestionLevel")) {
        $("filterQuestionLevel").value = level;
      }
      renderTeacherQuestions();
    });
  });

  const btnQuickAddQ = $("btnQuickAddQForLevel");
  if (btnQuickAddQ) {
    btnQuickAddQ.addEventListener("click", () => {
      const currentLevel = $("filterQuestionLevel") ? $("filterQuestionLevel").value : "all";
      if (currentLevel !== "all" && $("qLevel")) {
        $("qLevel").value = currentLevel;
      }
      setQuestionSubtab("q-create");
      updateQuestionLivePreview();
      const inputPertanyaan = $("qText");
      if (inputPertanyaan) inputPertanyaan.focus();
    });
  }

  // 8. Filter Tipe Soal Kuis (Analog vs Teks)
  const filterQType = $("filterQuestionType");
  if (filterQType) {
    filterQType.addEventListener("change", renderTeacherQuestions);
  }

  // 9. Pencarian Real-Time Materi & Soal
  const searchMatInput = $("searchMaterialInput");
  if (searchMatInput) {
    searchMatInput.addEventListener("input", renderTeacherMaterials);
  }

  const searchQInput = $("searchQuestionInput");
  if (searchQInput) {
    searchQInput.addEventListener("input", renderTeacherQuestions);
  }

  // 10. Navigasi Sub-Tab Materi
  const matSubnavBtns = document.querySelectorAll("#teacherMaterialsTab .admin-subnav-btn");
  matSubnavBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      setMaterialSubtab(btn.dataset.subtab);
    });
  });

  // 11. Navigasi Sub-Tab Soal Kuis
  const qSubnavBtns = document.querySelectorAll("#teacherQuestionsTab .admin-subnav-btn");
  qSubnavBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      setQuestionSubtab(btn.dataset.subtab);
    });
  });

  // 12. Tombol Batal Form Studio
  const btnCancelMat = $("btnCancelMatCreate");
  if (btnCancelMat) {
    btnCancelMat.addEventListener("click", () => {
      setMaterialSubtab("mat-list");
    });
  }

  const btnCancelQ = $("btnCancelQCreate");
  if (btnCancelQ) {
    btnCancelQ.addEventListener("click", () => {
      setQuestionSubtab("q-list");
    });
  }

  // 13. Sinkronisasi Real-Time Live Preview Materi
  ["matLevel", "matJudul", "matIsi", "matTip", "matImg"].forEach(fieldId => {
    const el = $(fieldId);
    if (el) {
      el.addEventListener("input", updateMaterialLivePreview);
      el.addEventListener("change", updateMaterialLivePreview);
    }
  });

  // 14. Sinkronisasi Real-Time Live Preview Soal Kuis (L1, L2, L3, L4, MCQ)
  ["qLevel", "qType", "qClockHour", "qClockMinute", "qDigitalHour", "qDigitalMinute", "qChip1", "qChip2", "qChip3", "qChip4", "qChip5", "qChip6", "qCompareLabel1", "qCompareImg1", "qCompareLabel2", "qCompareImg2", "qActivityCorrectAnswer", "qActivityImg", "qActChip1", "qActChip2", "qActChip3", "qActChip4", "qText", "qCustomImg", "qOptA", "qOptB", "qOptC", "qOptD", "qPoints", "qHint"].forEach(fieldId => {
    const el = $(fieldId);
    if (el) {
      el.addEventListener("input", updateQuestionLivePreview);
      el.addEventListener("change", updateQuestionLivePreview);
    }
  });

  document.querySelectorAll('input[name="qTimeCompareCorrect"]').forEach(radio => {
    radio.addEventListener("change", updateQuestionLivePreview);
  });

  // 15. Pemilihan Kunci Jawaban dengan Tombol Bulat A, B, C, D
  const optRadioBtns = document.querySelectorAll(".option-radio-btn");
  optRadioBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      optRadioBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      document.querySelectorAll(".option-builder-item").forEach(item => {
        item.classList.remove("is-correct");
      });
      const parentItem = btn.closest(".option-builder-item");
      if (parentItem) parentItem.classList.add("is-correct");

      const correctKeySelect = $("qCorrectKey");
      if (correctKeySelect) {
        correctKeySelect.value = key;
      }
      updateQuestionLivePreview();
    });
  });

  // 16. Tombol Cepat Preset Menit Jam Analog (:00, :15, :30, :45)
  const presetChips = document.querySelectorAll(".preset-chip");
  presetChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const minVal = chip.dataset.min;
      const minInput = $("qClockMinute");
      if (minInput) {
        minInput.value = minVal;
        updateQuestionLivePreview();
      }
    });
  });

  // 16b. Tombol Cepat Preset Menit Jam Digital (:00, :15, :30, :45)
  const presetDigitalChips = document.querySelectorAll(".preset-digital-chip");
  presetDigitalChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const minVal = chip.dataset.min || "00";
      const minInput = $("qDigitalMinute");
      if (minInput) {
        minInput.value = minVal;
        if ($("qChip2")) $("qChip2").value = minVal;
        updateQuestionLivePreview();
      }
    });
  });

  // 16c. Tombol Otomatis Generate 6 Kartu Angka Digital dari Target Jam & Menit (Diacak)
  const btnAutoGenerateChips = $("btnAutoGenerateChips");
  if (btnAutoGenerateChips) {
    btnAutoGenerateChips.addEventListener("click", () => {
      const h = ($("qDigitalHour") ? $("qDigitalHour").value.trim() : "05").padStart(2, "0");
      const m = ($("qDigitalMinute") ? $("qDigitalMinute").value.trim() : "00").padStart(2, "0");
      const hNum = parseInt(h, 10) || 5;

      const dH1 = String(((hNum + 2) % 12) || 12).padStart(2, "0");
      const dH2 = String(((hNum + 6) % 12) || 12).padStart(2, "0");
      const dM1 = m === "00" ? "30" : "00";
      const dM2 = m === "15" ? "45" : (m === "30" ? "15" : "45");

      let generated = [h, m, dH1, dH2, dM1, dM2];

      // Acak (shuffle) agar jam dan menit tidak berada di posisi 1 & 2
      for (let i = generated.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [generated[i], generated[j]] = [generated[j], generated[i]];
      }
      if (generated[0] === h && generated[1] === m) {
        [generated[0], generated[3]] = [generated[3], generated[0]];
      }

      if ($("qChip1")) $("qChip1").value = generated[0];
      if ($("qChip2")) $("qChip2").value = generated[1];
      if ($("qChip3")) $("qChip3").value = generated[2];
      if ($("qChip4")) $("qChip4").value = generated[3];
      if ($("qChip5")) $("qChip5").value = generated[4];
      if ($("qChip6")) $("qChip6").value = generated[5];

      updateQuestionLivePreview();
      showToast("6 Pilihan kartu angka digital berhasil diisi & diacak!", "info");
    });
  }

  // 17. Handler Upload Gambar / SVG Kustom untuk Materi & Soal Kuis (L3, L4, MCQ)
  function setupImageUploader({ btnId, fileInputId, thumbId, targetHiddenId, selectPresetId, customOptId, labelId, clearBtnId, isActivitySelect, isMaterial }) {
    const btn = $(btnId);
    const fileInput = $(fileInputId);
    const thumb = $(thumbId);
    const targetHidden = targetHiddenId ? $(targetHiddenId) : null;
    const selectPreset = selectPresetId ? $(selectPresetId) : null;
    const customOpt = customOptId ? $(customOptId) : null;
    const label = labelId ? $(labelId) : null;
    const clearBtn = clearBtnId ? $(clearBtnId) : null;

    if (btn && fileInput) {
      btn.addEventListener("click", () => fileInput.click());
    }

    if (fileInput) {
      fileInput.addEventListener("change", () => {
        if (!fileInput.files || fileInput.files.length === 0) return;
        const file = fileInput.files[0];

        // Validasi ekstensi/tipe berkas (SVG, PNG, JPG, JPEG, WEBP)
        const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
        const isImg = file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name);

        if (!isSvg && !isImg) {
          showToast("Mohon pilih berkas gambar/SVG yang valid (.svg, .png, .jpg, .webp).", "error");
          fileInput.value = "";
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          showToast("Ukuran berkas maksimal 5 MB.", "error");
          fileInput.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;

          if (thumb) thumb.src = dataUrl;
          if (targetHidden) targetHidden.value = dataUrl;

          if (customOpt) {
            customOpt.hidden = false;
            customOpt.disabled = false;
            customOpt.value = dataUrl;
            customOpt.textContent = `📁 ${file.name.length > 18 ? file.name.slice(0, 15) + "..." : file.name}`;
          }

          if (selectPreset) {
            selectPreset.value = dataUrl;
            if (isActivitySelect) {
              selectPreset.dataset.customUrl = dataUrl;
            }
          }

          if (label) {
            label.textContent = `✓ Berhasil diunggah: ${file.name}`;
            label.style.display = "block";
          }

          if (clearBtn) {
            clearBtn.style.display = "inline-flex";
          }

          if (isMaterial) {
            updateMaterialLivePreview();
          } else {
            updateQuestionLivePreview();
          }
          showToast(`Gambar/SVG "${file.name}" berhasil diunggah!`, "success");
        };

        reader.onerror = () => {
          showToast("Gagal membaca berkas gambar/SVG.", "error");
        };

        reader.readAsDataURL(file);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (thumb) thumb.src = isMaterial ? "assets/icons/book-open.svg" : "assets/icons/clock.svg";
        if (targetHidden) targetHidden.value = "";
        if (fileInput) fileInput.value = "";
        if (label) {
          label.style.display = "none";
          label.textContent = "";
        }
        clearBtn.style.display = "none";
        if (isMaterial) {
          updateMaterialLivePreview();
        } else {
          updateQuestionLivePreview();
        }
      });
    }

    if (selectPreset) {
      selectPreset.addEventListener("change", () => {
        const val = selectPreset.value;
        if (thumb) thumb.src = val;
        if (targetHidden) targetHidden.value = val;
        if (!val.startsWith("data:") && label) {
          label.style.display = "none";
        }
        updateQuestionLivePreview();
      });
    }
  }

  // Pasang uploader Materi
  setupImageUploader({
    btnId: "btnUploadMatImg",
    fileInputId: "fileMatImg",
    thumbId: "thumbMatImg",
    targetHiddenId: "matImg",
    clearBtnId: "btnClearMatImg",
    labelId: "labelUploadedMat",
    isMaterial: true
  });

  // Pasang uploader Soal Umum / Pilihan Ganda
  setupImageUploader({
    btnId: "btnUploadQuestionImg",
    fileInputId: "fileQuestionImg",
    thumbId: "thumbQuestionImg",
    targetHiddenId: "qCustomImg",
    clearBtnId: "btnClearQuestionImg",
    labelId: "labelUploadedQuestionImg",
    isMaterial: false
  });

  // Pasang uploader Level 3 Kegiatan 1
  setupImageUploader({
    btnId: "btnUploadCompareImg1",
    fileInputId: "fileCompareImg1",
    thumbId: "thumbCompareImg1",
    targetHiddenId: "qCompareImg1",
    selectPresetId: "selectCompareImg1Preset",
    customOptId: "optCustomCompare1",
    labelId: "labelUploadedCompare1",
    isActivitySelect: false,
    isMaterial: false
  });

  // Pasang uploader Level 3 Kegiatan 2
  setupImageUploader({
    btnId: "btnUploadCompareImg2",
    fileInputId: "fileCompareImg2",
    thumbId: "thumbCompareImg2",
    targetHiddenId: "qCompareImg2",
    selectPresetId: "selectCompareImg2Preset",
    customOptId: "optCustomCompare2",
    labelId: "labelUploadedCompare2",
    isActivitySelect: false,
    isMaterial: false
  });

  // Pasang uploader Level 4 Ilustrasi Kegiatan
  setupImageUploader({
    btnId: "btnUploadActivityImg",
    fileInputId: "fileActivityImg",
    thumbId: "thumbActivityImg",
    targetHiddenId: null,
    selectPresetId: "qActivityImg",
    customOptId: "optCustomActivityImg",
    labelId: "labelUploadedActivity",
    isActivitySelect: true,
    isMaterial: false
  });

  // Inisialisasi awal preview kartu
  updateMaterialLivePreview();
  updateQuestionLivePreview();

  // Form Login Mandiri pada admin.html (Jika diakses tanpa sesi)
  const adminLoginForm = $("adminLoginForm");
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", event => {
      event.preventDefault();

      const usernameInput = $("adminUsername");
      const passwordInput = $("adminPassword");
      const errorEl = $("adminLoginError");

      const username = usernameInput ? usernameInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      const teachers = typeof DEMO_TEACHERS !== "undefined" ? DEMO_TEACHERS : [
        { username: "guru01", password: "123456", nama: "Budi Santoso, S.Pd." },
        { username: "guru02", password: "123456", nama: "Siti Aminah, M.Pd." },
        { username: "admin", password: "1234", nama: "Ratna Dewi, S.Pd." }
      ];

      const matchedTeacher = teachers.find(
        t => t.username.toLowerCase() === username.toLowerCase() && t.password === password
      );
      const pinFallback = (username === "1234" || password === "1234" || (username === "guru" && password === "1234"));

      if (matchedTeacher || pinFallback) {
        const teacherName = matchedTeacher ? matchedTeacher.nama : "Bapak/Ibu Guru";
        const teacherSession = {
          username: matchedTeacher ? matchedTeacher.username : (username || "guru"),
          nama: teacherName,
          loginAt: Date.now()
        };

        try {
          sessionStorage.setItem("timequest_teacher", JSON.stringify(teacherSession));
          localStorage.setItem("timequest_teacher", JSON.stringify(teacherSession));
        } catch (e) {
          console.error("Gagal menyimpan sesi:", e);
        }

        if (errorEl) {
          errorEl.textContent = "";
          errorEl.classList.add("hidden");
        }

        showToast(`Selamat datang, ${teacherName}!`, "success");
        checkAdminAuth();
      } else {
        if (errorEl) {
          errorEl.textContent = "Username atau password guru salah. Coba: guru01 / 123456";
          errorEl.classList.remove("hidden");
        }
        showToast("Kredensial guru tidak cocok.", "error");
      }
    });
  }
}

// Inisialisasi otomatis jika dijalankan di admin.html
document.addEventListener("DOMContentLoaded", async () => {
  // Pastikan data awal tersedia dan tersinkronisasi dari server jika mode HTTP
  if (typeof seedInitialDataIfEmpty === "function") {
    await seedInitialDataIfEmpty();
  }

  initTeacherEvents();
  checkAdminAuth();

  // Sinkronisasi otomatis latar belakang setiap 4 detik pada mode server
  const isServer = typeof IS_SERVER_MODE !== "undefined" && IS_SERVER_MODE;
  if (isServer && !window._teacherSyncPoll) {
    window._teacherSyncPoll = setInterval(async () => {
      // Hanya polling jika sesi aktif dan tab sedang dilihat
      if (getTeacherSession() && document.visibilityState === "visible") {
        if (typeof fetchStudentsFromServer === "function") {
          await fetchStudentsFromServer();
          renderTeacherDashboard();
        }
      }
    }, 4000);
  }
});
