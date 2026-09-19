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
    const raw = sessionStorage.getItem("timequest_teacher");
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
 * Merender daftar materi pembelajaran yang tersimpan
 */
function renderTeacherMaterials() {
  const body = $("teacherMaterialsBody");
  if (!body) return;

  body.innerHTML = "";
  const allMaterials = typeof getMaterials === "function" ? getMaterials() : [];
  const filterVal = $("filterMaterialLevel") ? $("filterMaterialLevel").value : "all";

  const filtered = filterVal === "all"
    ? allMaterials
    : allMaterials.filter(m => String(m.level) === filterVal);

  if (filtered.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            Belum ada modul materi pembelajaran untuk level yang dipilih.
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

  body.innerHTML = "";
  const allQuestions = typeof getQuestions === "function" ? getQuestions() : [];
  const filterVal = $("filterQuestionLevel") ? $("filterQuestionLevel").value : "all";

  const filtered = filterVal === "all"
    ? allQuestions
    : allQuestions.filter(q => String(q.level) === filterVal);

  if (filtered.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            Belum ada soal kuis untuk level yang dipilih.
          </div>
        </td>
      </tr>
    `;
    return;
  }

  const letters = ["A", "B", "C", "D"];

  filtered.forEach((q, index) => {
    const row = document.createElement("tr");
    const isClock = q.tipe === "clock";
    const clockLabel = isClock
      ? `<div class="muted small" style="margin-top:2px;">🕒 Pukul ${String(q.jam ?? 12).padStart(2, "0")}.${String(q.menit ?? 0).padStart(2, "0")}</div>`
      : "";

    const typeBadge = isClock
      ? `<span class="badge badge-accent">Analog</span>`
      : `<span class="badge badge-outline">Teks</span>`;

    let correctKeyLetter = "A";
    let correctText = "";
    if (typeof q.kunci === "number") {
      correctKeyLetter = letters[q.kunci] || "A";
      correctText = Array.isArray(q.pilihan) && q.pilihan[q.kunci] ? q.pilihan[q.kunci] : "";
    } else if (typeof q.kunci === "string") {
      correctKeyLetter = q.kunci.toUpperCase();
      const idx = letters.indexOf(correctKeyLetter);
      if (idx !== -1 && Array.isArray(q.pilihan)) {
        correctText = q.pilihan[idx] || "";
      }
    }

    row.innerHTML = `
      <td>${index + 1}</td>
      <td><span class="badge badge-primary">Lvl ${q.level}</span></td>
      <td>${typeBadge}</td>
      <td style="line-height:1.4;">
        <strong>${escapeHTML(q.pertanyaan)}</strong>
        ${clockLabel}
        ${q.hint ? `<div class="muted small" style="margin-top:2px;">💡 <em>Hint:</em> ${escapeHTML(q.hint)}</div>` : ""}
      </td>
      <td>
        <span class="badge badge-green" style="font-weight:900;">${correctKeyLetter}</span>
        <span class="small" style="margin-left:4px;font-weight:600;">${escapeHTML(correctText)}</span>
      </td>
      <td><span class="badge badge-yellow" style="font-weight:900;">${q.poin ?? 20}</span></td>
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
        tip
      };

      materials.push(newMaterial);
      if (typeof saveMaterials === "function") {
        saveMaterials(materials);
      }

      singleMaterialForm.reset();
      $("matLevel").value = String(level);
      showToast("Materi baru berhasil disimpan!", "success");
      renderTeacherMaterials();
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
  const btnUploadMatCsv = $("btnUploadMaterialCsv");
  if (btnUploadMatCsv && matFileInput) {
    btnUploadMatCsv.addEventListener("click", async () => {
      if (!matFileInput.files || matFileInput.files.length === 0) {
        showToast("Pilih berkas Excel (.xlsx) atau CSV materi terlebih dahulu.", "error");
        return;
      }

      const file = matFileInput.files[0];

      try {
        const parsedRows = await readSpreadsheetFile(file);
        if (!Array.isArray(parsedRows) || parsedRows.length === 0) {
          showToast("Berkas spreadsheet kosong atau format baris tidak terbaca.", "error");
          return;
        }

        const currentMaterials = typeof getMaterials === "function" ? getMaterials() : [];
        let addedCount = 0;

        parsedRows.forEach((row, idx) => {
          // Normalisasi key (case-insensitive)
          const keys = Object.keys(row);
          const getVal = keyName => {
            const found = keys.find(k => k.trim().toLowerCase() === keyName.toLowerCase());
            return found ? String(row[found]).trim() : "";
          };

          const level = parseInt(getVal("level"), 10) || 1;
          const judul = getVal("judul") || getVal("title");
          const isi = getVal("isi") || getVal("penjelasan") || getVal("content");
          const tip = getVal("tip") || getVal("tips") || "";

          if (judul && isi) {
            currentMaterials.push({
              id: "mat_bulk_" + Date.now() + "_" + idx,
              level: Math.min(Math.max(level, 1), 5),
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
          showToast(`Berhasil menambahkan ${addedCount} materi baru dari berkas spreadsheet!`, "success");
          matFileInput.value = "";
          if (matFileLabel) {
            matFileLabel.textContent = "";
            matFileLabel.classList.add("hidden");
          }
          renderTeacherMaterials();
        } else {
          showToast("Tidak ada baris materi yang valid. Pastikan kolom header bernama 'judul' dan 'isi'.", "error");
        }
      } catch (err) {
        console.error("Gagal membaca berkas materi:", err);
        showToast("Terjadi kesalahan saat memproses berkas spreadsheet.", "error");
      }
    });
  }

  // 4. Unduh Template Excel Materi (.xlsx)
  const btnTemplateMat = $("btnTemplateMaterialCsv");
  if (btnTemplateMat) {
    btnTemplateMat.addEventListener("click", () => {
      if (typeof XLSX !== "undefined") {
        const wb = XLSX.utils.book_new();
        const rows = [
          ["level", "judul", "isi", "tip"],
          [1, "Mengenal Jarum Jam Pendek & Panjang", "Jarum pendek menunjukkan jam dan jarum panjang menunjukkan menit. Pada jam bulat, jarum panjang selalu tepat di angka 12.", "Jarum pendek = Jam, jarum panjang = Menit."],
          [2, "Membaca Jam Setengah (Menit 30)", "Jika jarum panjang berada di angka 6, artinya waktu telah lewat 30 menit atau setengah jam.", "Angka 6 pada jarum panjang selalu bernilai 30 menit."],
          [3, "Membaca Jam Seperempat (Menit 15 & 45)", "Jarum panjang di angka 3 artinya lewat 15 menit (seperempat jam). Jarum panjang di angka 9 artinya lewat 45 menit atau kurang 15 menit.", "15 menit = seperempat jam."],
          [4, "Menit Kelipatan 5", "Setiap angka pada jam analog mewakili kelipatan 5 menit. Angka 1 = 5 menit, angka 2 = 10 menit, dst.", "Kalikan angka yang ditunjuk jarum panjang dengan 5."],
          [5, "Waktu 24 Jam & Durasi Kegiatan", "Pukul 1 siang ditulis 13.00, pukul 8 malam ditulis 20.00. Durasi kegiatan dihitung dari waktu selesai dikurangi waktu mulai.", "Format 24 jam: Jam siang/malam ditambah 12."]
        ];
        const ws = XLSX.utils.aoa_to_sheet(rows);
        ws["!cols"] = [{ wch: 8 }, { wch: 35 }, { wch: 60 }, { wch: 40 }];
        XLSX.utils.book_append_sheet(wb, ws, "Template Materi");
        XLSX.writeFile(wb, "template_materi_timequest.xlsx");
        showToast("Template Excel materi (.xlsx) berhasil diunduh!", "success");
      } else if (typeof CSV !== "undefined" && typeof CSV.stringify === "function") {
        const headers = ["level", "judul", "isi", "tip"];
        const rows = [
          ["1", "Mengenal Jarum Jam Pendek dan Panjang", "Jarum pendek menunjukkan jam dan jarum panjang menunjukkan menit. Pada jam bulat, jarum panjang tepat di angka 12.", "Jarum pendek bergerak lambat, jarum panjang bergerak lebih cepat."],
          ["2", "Membaca Waktu Setengah Jam", "Jika jarum panjang menunjuk tepat ke angka 6, artinya waktu telah lewat 30 menit atau setengah jam.", "Pukul 02.30 sama dengan setengah tiga."]
        ];
        const csvContent = CSV.stringify(headers, rows);
        CSV.download("template_materi_timequest.csv", csvContent);
        showToast("Template CSV materi berhasil diunduh!", "success");
      }
    });
  }

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

  // =========================================================
  // KELOLA SOAL KUIS (FORM SATU PER SATU & BULK CSV)
  // =========================================================

  // 1. Toggle Jam Analog saat Tipe Soal Berubah
  const qTypeSelect = $("qType");
  const clockSettingsRow = $("clockSettingsRow");
  if (qTypeSelect && clockSettingsRow) {
    qTypeSelect.addEventListener("change", () => {
      clockSettingsRow.classList.toggle("hidden", qTypeSelect.value !== "clock");
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
      const optA = $("qOptA").value.trim();
      const optB = $("qOptB").value.trim();
      const optC = $("qOptC").value.trim();
      const optD = $("qOptD").value.trim();
      const correctKeyLetter = $("qCorrectKey").value;
      const poin = parseInt($("qPoints").value, 10) || 20;
      const hint = $("qHint") ? $("qHint").value.trim() : "";
      const penjelasan = $("qExplanation") ? $("qExplanation").value.trim() : "";

      if (!pertanyaan || !optA || !optB || !optC || !optD) {
        showToast("Pertanyaan dan semua pilihan (A, B, C, D) wajib diisi.", "error");
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

      const newQuestion = {
        id: "q_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        level,
        tipe,
        pertanyaan,
        pilihan: [optA, optB, optC, optD],
        kunci: keyIndex,
        hint,
        penjelasan,
        poin,
        jam: tipe === "clock" ? jam : undefined,
        menit: tipe === "clock" ? menit : undefined
      };

      const questions = typeof getQuestions === "function" ? getQuestions() : [];
      questions.push(newQuestion);
      if (typeof saveQuestions === "function") {
        saveQuestions(questions);
      }

      singleQuestionForm.reset();
      $("qLevel").value = String(level);
      $("qType").value = "clock";
      if (clockSettingsRow) clockSettingsRow.classList.remove("hidden");
      $("qPoints").value = "20";
      showToast("Soal kuis baru berhasil disimpan!", "success");
      renderTeacherQuestions();
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

  // 4. Tombol Eksekusi Upload Bulk Excel / CSV Soal
  const btnUploadQCsv = $("btnUploadQuestionCsv");
  if (btnUploadQCsv && qFileInput) {
    btnUploadQCsv.addEventListener("click", async () => {
      if (!qFileInput.files || qFileInput.files.length === 0) {
        showToast("Pilih berkas Excel (.xlsx) atau CSV soal kuis terlebih dahulu.", "error");
        return;
      }

      const file = qFileInput.files[0];

      try {
        const parsedRows = await readSpreadsheetFile(file);
        if (!Array.isArray(parsedRows) || parsedRows.length === 0) {
          showToast("Berkas spreadsheet kosong atau format baris tidak terbaca.", "error");
          return;
        }

        const currentQuestions = typeof getQuestions === "function" ? getQuestions() : [];
        let addedCount = 0;
        const letterMap = { "A": 0, "B": 1, "C": 2, "D": 3 };

        parsedRows.forEach((row, idx) => {
          const keys = Object.keys(row);
          const getVal = keyName => {
            const found = keys.find(k => k.trim().toLowerCase() === keyName.toLowerCase());
            return found ? String(row[found]).trim() : "";
          };

          const level = parseInt(getVal("level"), 10) || 1;
          const pertanyaan = getVal("pertanyaan") || getVal("soal") || getVal("question");
          const tipeRaw = getVal("tipe") || getVal("type");
          const tipe = tipeRaw.toLowerCase() === "text" || tipeRaw.toLowerCase() === "teks" ? "text" : "clock";

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
          const poin = parseInt(getVal("poin") || getVal("points"), 10) || 20;

          const jam = parseInt(getVal("jam") || getVal("hour"), 10) || 12;
          const menit = parseInt(getVal("menit") || getVal("minute"), 10) || 0;

          if (pertanyaan && optA && optB && optC && optD) {
            currentQuestions.push({
              id: "q_bulk_" + Date.now() + "_" + idx,
              level: Math.min(Math.max(level, 1), 5),
              tipe,
              pertanyaan,
              pilihan: [optA, optB, optC, optD],
              kunci: keyIndex,
              hint,
              penjelasan,
              poin,
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
          showToast(`Berhasil menambahkan ${addedCount} soal kuis baru dari berkas spreadsheet!`, "success");
          qFileInput.value = "";
          if (qFileLabel) {
            qFileLabel.textContent = "";
            qFileLabel.classList.add("hidden");
          }
          renderTeacherQuestions();
        } else {
          showToast("Tidak ada baris soal yang valid. Pastikan kolom pertanyaan dan opsi A, B, C, D terisi.", "error");
        }
      } catch (err) {
        console.error("Gagal membaca berkas soal:", err);
        showToast("Terjadi kesalahan saat memproses berkas spreadsheet soal.", "error");
      }
    });
  }

  // 5. Unduh Template Excel Soal Kuis (.xlsx)
  const btnTemplateQ = $("btnTemplateQuestionCsv");
  if (btnTemplateQ) {
    btnTemplateQ.addEventListener("click", () => {
      if (typeof XLSX !== "undefined") {
        const wb = XLSX.utils.book_new();
        const rows = [
          ["level", "pertanyaan", "tipe", "pilihan_a", "pilihan_b", "pilihan_c", "pilihan_d", "kunci", "hint", "penjelasan", "poin", "jam", "menit"],
          [1, "Pukul berapakah yang ditunjukkan oleh jam analog ini?", "clock", "Pukul 02.00", "Pukul 03.00", "Pukul 04.00", "Pukul 12.00", "B", "Lihat angka yang ditunjuk oleh jarum pendek.", "Jarum pendek di angka 3 dan jarum panjang di angka 12 menunjukkan pukul 03.00 tepat.", 20, 3, 0],
          [1, "Jika jarum pendek di angka 7 dan jarum panjang tepat di 12, maka waktu menunjukkan...", "text", "Pukul 07.00", "Pukul 12.00", "Pukul 06.00", "Pukul 08.00", "A", "Jarum panjang di angka 12 berarti menit 00.", "Jarum pendek di angka 7 berarti pukul 07.00 tepat.", 20, "", ""],
          [2, "Pukul berapakah yang ditunjukkan pada jam analog ini?", "clock", "Pukul 01.30", "Pukul 02.30", "Pukul 03.30", "Pukul 06.00", "B", "Jarum panjang di angka 6 berarti lewat 30 menit.", "Jarum pendek di antara 2 dan 3, jarum panjang di 6 berarti pukul 02.30.", 20, 2, 30],
          [2, "Pukul setengah lima sore jika ditulis dengan angka adalah...", "text", "04.15", "04.30", "05.30", "04.50", "B", "Setengah jam sama dengan 30 menit.", "Pukul setengah lima ditulis 04.30.", 20, "", ""],
          [3, "Pukul berapakah yang ditunjukkan jam analog ini?", "clock", "Pukul 08.15", "Pukul 08.45", "Pukul 03.40", "Pukul 09.15", "A", "Jarum panjang di angka 3 berarti menit ke-15.", "Jarum pendek di angka 8 lewat sedikit dan jarum panjang di 3 adalah pukul 08.15.", 20, 8, 15]
        ];
        const ws = XLSX.utils.aoa_to_sheet(rows);
        ws["!cols"] = [{ wch: 8 }, { wch: 45 }, { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 8 }, { wch: 35 }, { wch: 45 }, { wch: 8 }, { wch: 6 }, { wch: 6 }];
        XLSX.utils.book_append_sheet(wb, ws, "Template Soal");
        XLSX.writeFile(wb, "template_soal_timequest.xlsx");
        showToast("Template Excel soal kuis (.xlsx) berhasil diunduh!", "success");
      } else if (typeof CSV !== "undefined" && typeof CSV.stringify === "function") {
        const headers = [
          "level",
          "pertanyaan",
          "tipe",
          "pilihan_a",
          "pilihan_b",
          "pilihan_c",
          "pilihan_d",
          "kunci",
          "hint",
          "penjelasan",
          "poin",
          "jam",
          "menit"
        ];
        const rows = [
          ["1", "Pukul berapakah yang ditunjukkan jam analog ini?", "clock", "02.00", "03.00", "04.00", "12.00", "B", "Lihat arah jarum pendek", "Jarum pendek di 3 dan panjang di 12 adalah pukul 03.00", "20", "3", "0"],
          ["1", "Jika jarum pendek di angka 8 dan jarum panjang di angka 12, maka waktu adalah...", "text", "08.00", "12.00", "07.00", "09.00", "A", "Jarum panjang di 12 menunjukkan jam tepat", "Jarum pendek di angka 8 berarti pukul 08.00 tepat", "20", "", ""]
        ];
        const csvContent = CSV.stringify(headers, rows);
        CSV.download("template_soal_timequest.csv", csvContent);
        showToast("Template CSV soal kuis berhasil diunduh!", "success");
      }
    });
  }

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
document.addEventListener("DOMContentLoaded", () => {
  // Pastikan data awal tersedia
  if (typeof seedInitialDataIfEmpty === "function") {
    seedInitialDataIfEmpty();
  }

  initTeacherEvents();
  checkAdminAuth();
});
