/* =========================================================
   TIME QUEST
   auth.js - Autentikasi Siswa dan Login Guru Tanpa Dialog prompt()
   Sesuai Panduan AGENT.md Bagian 15 & Anti-Slop
   ========================================================= */

"use strict";

let selectedAvatar = "budi";

// Gunakan kredensial guru dari storage.js atau fallback lokal
const teachersList = typeof DEMO_TEACHERS !== "undefined" ? DEMO_TEACHERS : [
  { username: "guru01", password: "123456", nama: "Budi Santoso, S.Pd." },
  { username: "guru02", password: "123456", nama: "Siti Aminah, M.Pd." },
  { username: "admin", password: "1234", nama: "Ratna Dewi, S.Pd." }
];

/**
 * Inisialisasi event listener autentikasi
 */
function initAuth() {
  // Pilihan Avatar Siswa
  const avatarButtons = document.querySelectorAll(".avatar-btn");
  avatarButtons.forEach(button => {
    button.addEventListener("click", () => {
      avatarButtons.forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      selectedAvatar = button.dataset.avatar;
    });
  });

  // Form Login Siswa
  const loginForm = $("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", event => {
      event.preventDefault();

      const nameInput = $("studentName");
      const classSelect = $("className");

      const name = nameInput ? nameInput.value.trim() : "";
      const className = classSelect ? classSelect.value : "";

      if (!name) {
        showToast("Masukkan nama kamu terlebih dahulu.", "error");
        if (nameInput) nameInput.focus();
        return;
      }

      if (!className) {
        showToast("Pilih kelas terlebih dahulu.", "error");
        if (classSelect) classSelect.focus();
        return;
      }

      currentStudent = createStudent(name, className, selectedAvatar);
      saveCurrentStudent();

      if ($("studentApp")) {
        openStudentApp();
        showToast("Selamat datang, " + name + "!", "success");
      } else {
        window.location.href = "siswa.html";
      }
    });
  }

  // Logout Siswa
  const studentLogoutBtn = $("studentLogoutBtn");
  if (studentLogoutBtn) {
    studentLogoutBtn.addEventListener("click", () => {
      if (typeof clearCurrentStudent === "function") {
        clearCurrentStudent();
      } else {
        currentStudent = null;
        Storage.remove(STORAGE_KEYS.SESSION);
      }
      lastResult = null;
      window.location.href = "index.html";
    });
  }

  // Buka Modal Login Guru (Bebas Dialog prompt() Slop)
  const teacherLoginBtn = $("teacherLoginBtn");
  if (teacherLoginBtn) {
    teacherLoginBtn.addEventListener("click", event => {
      if ($("teacherLoginModal")) {
        event.preventDefault();
        openTeacherModal();
      }
    });
  }

  // Form Login Modal Guru
  const teacherLoginForm = $("teacherLoginForm");
  if (teacherLoginForm) {
    teacherLoginForm.addEventListener("submit", event => {
      event.preventDefault();

      const usernameInput = $("teacherUsername");
      const passwordInput = $("teacherPassword");
      const errorEl = $("teacherLoginError");

      const username = usernameInput ? usernameInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      // Validasi terhadap daftar guru
      const matchedTeacher = teachersList.find(
        t => t.username.toLowerCase() === username.toLowerCase() && t.password === password
      );

      // Dukungan jika guru hanya memasukkan PIN 1234
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
          console.error("Gagal menyimpan sesi guru:", e);
        }

        closeTeacherModal();
        window.location.href = "admin.html";
      } else {
        if (errorEl) {
          errorEl.textContent = "Username atau password salah. Coba: guru01 / 123456";
          errorEl.classList.remove("hidden");
        }
        showToast("Kredensial guru tidak cocok.", "error");
      }
    });
  }

  // Tombol Tutup Modal Guru
  const cancelTeacherModalBtn = $("cancelTeacherModalBtn");
  if (cancelTeacherModalBtn) {
    cancelTeacherModalBtn.addEventListener("click", closeTeacherModal);
  }

  const teacherModalBackdrop = $("teacherLoginModal");
  if (teacherModalBackdrop) {
    teacherModalBackdrop.addEventListener("click", e => {
      if (e.target === teacherModalBackdrop) {
        closeTeacherModal();
      }
    });
  }
}

/**
 * Membuka Modal Login Guru
 */
function openTeacherModal() {
  const modal = $("teacherLoginModal");
  const form = $("teacherLoginForm");
  const errorEl = $("teacherLoginError");

  if (form) form.reset();
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }

  if (modal) {
    modal.classList.remove("hidden");
    const firstInput = $("teacherUsername");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }
}

/**
 * Menutup Modal Login Guru
 */
function closeTeacherModal() {
  const modal = $("teacherLoginModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

/**
 * Membuka aplikasi siswa dan menampilkan beranda
 */
function openStudentApp() {
  if (!currentStudent) return;

  const headerName = $("headerName");
  const headerAvatar = $("headerAvatar");
  const welcomeTitle = $("welcomeTitle");

  if (headerName) headerName.textContent = currentStudent.name;
  if (headerAvatar) headerAvatar.innerHTML = typeof getAvatarImg === "function" ? getAvatarImg(currentStudent.avatar, 36) : "";
  if (welcomeTitle) welcomeTitle.textContent = "Halo, " + currentStudent.name + "!";

  showScreen("studentApp");
  showStudentPage("homeScreen");
  renderHome();
}

/**
 * Reset form input login siswa
 */
function resetLoginForm() {
  const form = $("loginForm");
  if (form) form.reset();

  selectedAvatar = "budi";
  document.querySelectorAll(".avatar-btn").forEach(button => {
    button.classList.toggle("selected", button.dataset.avatar === "budi");
  });
}
