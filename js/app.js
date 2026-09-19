/* =========================================================
   TIME QUEST
   app.js - Inisialisasi Utama, Helper UI, dan Efek Suara
   Bebas AI-Slop & Berorientasi Ramah Anak SD
   ========================================================= */

"use strict";

/**
 * Shorthand helper untuk document.getElementById
 * @param {string} id 
 * @returns {HTMLElement|null}
 */
function $(id) {
  return document.getElementById(id);
}

/**
 * Mengganti layar utama aplikasi (Login, Siswa, Guru)
 * @param {string} id 
 */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = $(id);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/**
 * Menampilkan pesan toast floating
 * @param {string} message 
 * @param {string} type 'success' | 'error' | ''
 */
function showToast(message, type = "") {
  const toast = $("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = "toast";

  if (type) {
    toast.classList.add(type);
  }

  clearTimeout(showToast.timer);
  toast.classList.remove("hidden");

  showToast.timer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2800);
}

/**
 * Sanitasi string untuk mencegah XSS
 * @param {any} value 
 * @returns {string}
 */
function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * Memformat timestamp unix menjadi tanggal format Indonesia
 * @param {number|string} timestamp 
 * @returns {string}
 */
function formatDate(timestamp) {
  if (!timestamp) return "-";
  try {
    return new Date(Number(timestamp)).toLocaleString("id-ID", {
      dateStyle: "short",
      timeStyle: "short"
    });
  } catch (e) {
    return "-";
  }
}

/* =========================================================
   EFEK AUDIO SINTETIS (Web Audio API Ringan Tanpa File Berat)
   ========================================================= */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Memainkan efek suara nada sintetis ramah anak
 * @param {string} type 'correct' | 'wrong' | 'hint' | 'victory'
 */
function playSound(type) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === "correct") {
      // Dua nada ceria naik (E5 -> G#5)
      playTone(ctx, 659.25, now, 0.12, "sine");
      playTone(ctx, 830.61, now + 0.12, 0.22, "sine");
    } else if (type === "wrong") {
      // Nada rendah pendek (G3 -> F3)
      playTone(ctx, 196.00, now, 0.15, "triangle");
      playTone(ctx, 174.61, now + 0.12, 0.22, "sawtooth");
    } else if (type === "hint") {
      // Ping halus
      playTone(ctx, 523.25, now, 0.18, "sine");
    } else if (type === "victory") {
      // Melodi kemenangan (C5 -> E5 -> G5 -> C6)
      playTone(ctx, 523.25, now, 0.12, "triangle");
      playTone(ctx, 659.25, now + 0.12, 0.12, "triangle");
      playTone(ctx, 783.99, now + 0.24, 0.14, "triangle");
      playTone(ctx, 1046.50, now + 0.38, 0.40, "sine");
    }
  } catch (e) {
    // Abaikan jika browser membatasi autoplay
  }
}

function playTone(ctx, freq, startTime, duration, type = "sine") {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.12, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

/* =========================================================
   INISIALISASI APLIKASI
   ========================================================= */

function initialize() {
  const loadingScreen = $("appLoadingScreen");

  // Inisialisasi seed data awal
  seedInitialDataIfEmpty();

  // Inisialisasi event listener tiap modul
  if (typeof initAuth === "function") initAuth();
  if (typeof initStudentEvents === "function") initStudentEvents();
  if (typeof initQuizEvents === "function") initQuizEvents();
  if (typeof initLeaderboardEvents === "function") initLeaderboardEvents();
  if (typeof initTeacherEvents === "function") initTeacherEvents();

  // Tampilkan layar login awal
  showScreen("loginScreen");

  // Sembunyikan loading screen jika ada
  if (loadingScreen) {
    loadingScreen.classList.add("hidden");
  }

  console.log("⏰ TIME QUEST berhasil dijalankan.");
}

// Jalankan ketika dokumen HTML selesai dimuat
document.addEventListener("DOMContentLoaded", initialize);
