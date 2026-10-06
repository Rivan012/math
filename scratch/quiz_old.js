/* =========================================================
   TIME QUEST
   quiz.js - Sistem Kuis Interaktif Matematika Jam & Waktu
   ========================================================= */

"use strict";

const QUESTIONS = [
  /* UNIT 1: MENGENAL JAM ANALOG — Mengarahkan Jarum Jam */
  {
    id: "Q001",
    level: 1,
    type: "clock_drag",
    targetHour: 5,
    targetMinute: 0,
    question: "Halim bangun tidur pukul 5 pagi. Arahkan jarum jam ke pukul 05.00!",
    points: 100,
    hint: "Arahkan jarum pendek merah ke angka 5, dan jarum panjang biru ke angka 12.",
    explanation: "Pukul 05.00 artinya jarum pendek (merah) di angka 5 dan jarum panjang (biru) di angka 12."
  },
  {
    id: "Q002",
    level: 1,
    type: "clock_drag",
    targetHour: 7,
    targetMinute: 0,
    question: "Tika berangkat ke sekolah pukul 7 pagi. Arahkan jarum jam ke pukul 07.00!",
    points: 100,
    hint: "Arahkan jarum pendek merah ke angka 7, dan jarum panjang biru ke angka 12.",
    explanation: "Pukul 07.00 artinya jarum pendek (merah) di angka 7 dan jarum panjang (biru) di angka 12."
  },
  {
    id: "Q003",
    level: 1,
    type: "clock_drag",
    targetHour: 12,
    targetMinute: 0,
    question: "Jam istirahat dan makan siang di sekolah. Arahkan jarum jam ke pukul 12.00!",
    points: 100,
    hint: "Arahkan kedua jarum jam (pendek dan panjang) tegak lurus ke atas menunjuk angka 12.",
    explanation: "Pukul 12.00 artinya kedua jarum sama-sama tegak lurus menunjuk angka 12."
  },
  {
    id: "Q004",
    level: 1,
    type: "clock_drag",
    targetHour: 9,
    targetMinute: 0,
    question: "Kira bersiap tidur malam pukul 9 malam. Arahkan jarum jam ke pukul 09.00!",
    points: 100,
    hint: "Arahkan jarum pendek merah ke angka 9, dan jarum panjang biru ke angka 12.",
    explanation: "Pukul 09.00 artinya jarum pendek (merah) di angka 9 dan jarum panjang (biru) di angka 12."
  },

  /* UNIT 2: MENGENAL JAM DIGITAL — Drag & Drop Angka (Jam) dan (Menit) ke Jam Digital */
  {
    id: "Q005",
    level: 2,
    type: "clock_drop",
    targetHour: "05",
    targetMinute: "00",
    question: "Halim bangun tidur pukul 5 pagi. Pasangkan angka (jam) dan (menit) yang tepat pada jam digital!",
    options: ["05", "00", "07", "30"],
    points: 100,
    hint: "Pasangkan angka 05 pada kotak Jam dan angka 00 pada kotak Menit.",
    explanation: "Pukul 5 pagi pada jam digital: angka jam diisi 05 dan angka menit diisi 00 (05:00)."
  },
  {
    id: "Q006",
    level: 2,
    type: "clock_drop",
    targetHour: "07",
    targetMinute: "00",
    question: "Tika berangkat ke sekolah pukul 7 pagi. Pasangkan angka (jam) dan (menit) yang tepat pada jam digital!",
    options: ["07", "00", "05", "30"],
    points: 100,
    hint: "Pasangkan angka 07 pada kotak Jam dan angka 00 pada kotak Menit.",
    explanation: "Pukul 7 pagi pada jam digital: angka jam diisi 07 dan angka menit diisi 00 (07:00)."
  },
  {
    id: "Q007",
    level: 2,
    type: "clock_drop",
    targetHour: "12",
    targetMinute: "00",
    question: "Jam istirahat dan makan siang di sekolah pukul 12 siang. Pasangkan angka (jam) dan (menit) yang tepat!",
    options: ["12", "00", "06", "30"],
    points: 100,
    hint: "Pasangkan angka 12 pada kotak Jam dan angka 00 pada kotak Menit.",
    explanation: "Pukul 12 siang pada jam digital: angka jam diisi 12 dan angka menit diisi 00 (12:00)."
  },
  {
    id: "Q008",
    level: 2,
    type: "clock_drop",
    targetHour: "09",
    targetMinute: "30",
    question: "Belajar malam pada pukul setengah sepuluh (09.30). Pasangkan angka (jam) dan (menit) yang tepat!",
    options: ["09", "30", "00", "08"],
    points: 100,
    hint: "Pasangkan angka 09 pada kotak Jam dan angka 30 pada kotak Menit.",
    explanation: "Pukul setengah sepuluh malam pada jam digital: angka jam diisi 09 dan angka menit diisi 30 (09:30)."
  },

  /* UNIT 3: LEBIH LAMA ATAU LEBIH CEPAT (Beri tanda centang pada kegiatan) */
  {
    id: "Q009",
    level: 3,
    type: "time_compare",
    question: "Beri tanda centang (✓) pada kegiatan yang lebih lama!",
    items: [
      { label: "Menyisir rambut", img: "assets/images/activity_combing.png" },
      { label: "Mandi", img: "assets/images/activity_bathing.png" }
    ],
    options: ["Menyisir rambut", "Mandi"],
    correct: 1,
    hint: "Bandingkan waktu menyisir rambut (sekitar 1 menit) dengan mandi (sekitar 15 menit).",
    explanation: "Mandi memerlukan waktu lebih lama (sekitar 15 menit) dibandingkan menyisir rambut yang hanya butuh waktu sebentar (1 menit)."
  },
  {
    id: "Q010",
    level: 3,
    type: "time_compare",
    question: "Beri tanda centang (✓) pada kegiatan yang lebih sebentar (lebih cepat)!",
    items: [
      { label: "Memasak", img: "assets/images/activity_cooking.png" },
      { label: "Meminum air", img: "assets/images/activity_drinking.png" }
    ],
    options: ["Memasak", "Meminum air"],
    correct: 1,
    hint: "Meminum air hanya butuh beberapa tegukan sebentar saja, sedangkan memasak butuh waktu lama.",
    explanation: "Meminum segelas air memerlukan waktu lebih sebentar / lebih cepat (beberapa detik hingga 1 menit), sedangkan memasak memerlukan waktu lebih lama."
  },
  {
    id: "Q011",
    level: 3,
    type: "time_compare",
    question: "Beri tanda centang (✓) pada kegiatan yang lebih lama!",
    items: [
      { label: "Tidur malam", img: "assets/images/activity_sleeping.png" },
      { label: "Menyikat gigi", img: "assets/images/activity_brushing.png" }
    ],
    options: ["Tidur malam", "Menyikat gigi"],
    correct: 0,
    hint: "Tidur malam berlangsung sekitar 8 jam sampai pagi, sedangkan menyikat gigi hanya 2 menit.",
    explanation: "Tidur malam memerlukan waktu lebih lama (sekitar 8 jam) dibandingkan menyikat gigi yang hanya 2 menit."
  },
  {
    id: "Q012",
    level: 3,
    type: "time_compare",
    question: "Beri tanda centang (✓) pada kegiatan yang lebih lama!",
    items: [
      { label: "Belajar di sekolah", img: "assets/images/activity_studying.png" },
      { label: "Sarapan", img: "assets/images/activity_breakfast.png" }
    ],
    options: ["Belajar di sekolah", "Sarapan"],
    correct: 0,
    hint: "Belajar di sekolah berlangsung berjam-jam dari pagi hingga siang hari, sedangkan sarapan sekitar 15 menit.",
    explanation: "Belajar di sekolah berlangsung berjam-jam (sekitar 5 jam), jauh lebih lama dari sarapan pagi."
  },

  /* UNIT 4: MENGENAL WAKTU KEGIATAN — Drag & Drop Pilihan Waktu ke Kotak Kegiatan */
  {
    id: "Q013",
    level: 4,
    type: "clock_activity_drop",
    img: "assets/images/time_activity_school.png",
    targetAnswer: "Pukul 7 pagi",
    question: "Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:",
    options: ["Pukul 7 pagi", "Pukul 7 malam", "Pukul 8 pagi", "Pukul 12 siang"],
    correct: 0,
    hint: "Jarum pendek menunjuk angka 7 pada pagi hari saat anak-anak berangkat sekolah.",
    explanation: "Jarum jam menunjuk angka 7 tepat di pagi hari saat anak-anak berangkat sekolah, yaitu Pukul 7 pagi."
  },
  {
    id: "Q014",
    level: 4,
    type: "clock_activity_drop",
    img: "assets/images/time_activity_class.png",
    targetAnswer: "Pukul 8 pagi",
    question: "Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:",
    options: ["Pukul 8 pagi", "Pukul 8 malam", "Pukul 7 pagi", "Pukul 1 siang"],
    correct: 0,
    hint: "Jarum pendek menunjuk angka 8 pada pagi hari saat belajar di kelas bersama guru.",
    explanation: "Jarum jam menunjuk angka 8 tepat saat murid belajar di sekolah di pagi hari, yaitu Pukul 8 pagi."
  },
  {
    id: "Q015",
    level: 4,
    type: "clock_activity_drop",
    img: "assets/images/time_activity_football.png",
    targetAnswer: "Pukul 5 sore",
    question: "Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:",
    options: ["Pukul 5 sore", "Pukul 5 pagi", "Pukul 4 sore", "Pukul 8 malam"],
    correct: 0,
    hint: "Jarum pendek menunjuk angka 5 menjelang matahari terbenam di sore hari saat bermain sepak bola.",
    explanation: "Jarum jam menunjuk angka 5 saat bermain bola di sore hari menjelang matahari terbenam, yaitu Pukul 5 sore."
  },
  {
    id: "Q016",
    level: 4,
    type: "clock_activity_drop",
    img: "assets/images/time_activity_sleep.png",
    targetAnswer: "Pukul 8 malam",
    question: "Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:",
    options: ["Pukul 8 malam", "Pukul 8 pagi", "Pukul 6 pagi", "Pukul 5 sore"],
    correct: 0,
    hint: "Jarum pendek menunjuk angka 8 dan tampak bulan sabit di jendela saat tidur malam.",
    explanation: "Jarum jam menunjuk angka 8 tepat saat tidur malam dengan pemandangan bulan dan bintang, yaitu Pukul 8 malam."
  }
];

let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let quizPoints = 0;
let quizCorrect = 0;
let quizHints = 0;
let quizAnswered = false;
let hintUsedThisQuestion = false;
let lastResult = null;
let currentQuizClock = null;
let currentDroppedAnswer = null;
let currentDroppedHour = null;
let currentDroppedMinute = null;
let currentSelectedCompareIndex = null;
let currentTimeCompareCards = [];
let currentDroppedActivityTime = null;

/* =========================================================
   SISTEM GAMIFIKASI ALA QUIZIZZ (TIMER, STREAK & WARNA IKONIK)
   ========================================================= */

const QUESTION_TIME_LIMIT = 25; // 25 detik per soal ala Quizizz
let questionTimer = null;
let questionTimeRemaining = QUESTION_TIME_LIMIT;
let quizStreak = 0;
let maxStreak = 0;

/**
 * Menjalankan timer visual per soal ala Quizizz
 */
function startQuestionTimer() {
  stopQuestionTimer();
  questionTimeRemaining = QUESTION_TIME_LIMIT;

  const bar = $("quizTimerBar");
  const text = $("quizTimerText");
  const valEl = $("quizTimerVal");

  if (bar) {
    bar.style.width = "100%";
    bar.className = "quiz-timer-bar";
  }
  if (valEl) {
    valEl.textContent = `${QUESTION_TIME_LIMIT} detik`;
  } else if (text) {
    text.innerHTML = `<img src="assets/icons/clock.svg" width="14" height="14" alt=""> <span>${QUESTION_TIME_LIMIT} detik</span>`;
  }
  if (text) {
    text.className = "quiz-timer-pill";
  }

  const intervalStepMs = 100;
  questionTimer = setInterval(() => {
    if (quizAnswered) {
      stopQuestionTimer();
      return;
    }

    questionTimeRemaining -= intervalStepMs / 1000;

    const percent = Math.max(0, (questionTimeRemaining / QUESTION_TIME_LIMIT) * 100);
    const secsLeft = Math.max(0, Math.ceil(questionTimeRemaining));

    if (bar) {
      bar.style.width = `${percent}%`;
      if (secsLeft <= 5) {
        bar.className = "quiz-timer-bar is-critical";
        // Suara detak jam halus di 5 detik terakhir
        if (typeof playSound === "function" && Math.abs(questionTimeRemaining - Math.round(questionTimeRemaining)) < 0.06) {
          playSound("tick");
        }
      } else if (secsLeft <= 10) {
        bar.className = "quiz-timer-bar is-warning";
      } else {
        bar.className = "quiz-timer-bar";
      }
    }

    if (valEl) {
      valEl.textContent = `${secsLeft} detik`;
    } else if (text) {
      text.innerHTML = `<img src="assets/icons/clock.svg" width="14" height="14" alt=""> <span>${secsLeft} detik</span>`;
    }

    if (text) {
      if (secsLeft <= 5) {
        text.className = "quiz-timer-pill is-critical";
      } else {
        text.className = "quiz-timer-pill";
      }
    }

    if (questionTimeRemaining <= 0) {
      stopQuestionTimer();
      handleQuestionTimeout();
    }
  }, intervalStepMs);
}

/**
 * Menghentikan timer soal aktif
 */
function stopQuestionTimer() {
  if (questionTimer) {
    clearInterval(questionTimer);
    questionTimer = null;
  }
}

/**
 * Menangani jika waktu menjawab habis (Timeout)
 */
function handleQuestionTimeout() {
  if (quizAnswered) return;
  quizAnswered = true;

  quizStreak = 0;
  updateStreakBanner();

  if (typeof playSound === "function") {
    playSound("timeUp");
  }

  const question = currentQuizQuestions[currentQuestionIndex];
  const feedback = $("quizFeedback");
  const nextBtn = $("nextQuestionBtn");
  const hintBtn = $("hintBtn");
  const card = $("quizCard");

  if (hintBtn) hintBtn.disabled = true;

  if (card) {
    card.classList.remove("anim-quiz-shake");
    void card.offsetWidth;
    card.classList.add("anim-quiz-shake");
  }

  // Handle clock_activity_drop timeout
  if (question && (question.type === "clock_activity_drop" || question.tipe === "clock_activity_drop")) {
    const submitBtn = $("btnActivityDropSubmit");
    if (submitBtn) submitBtn.disabled = true;

    document.querySelectorAll(".activity-time-chip").forEach(c => {
      if (c.style) c.style.pointerEvents = "none";
      if (c.removeAttribute) c.removeAttribute("draggable");
    });

    const targetVal = question.targetAnswer || (question.options && question.options[question.correct]) || (question.pilihan && question.pilihan[question.correct]);
    const slot = $("timeActivityDropSlot");
    if (slot) {
      slot.className = "clock-activity-drop-slot slot-wrong has-value";
      slot.innerHTML = `<span class="clock-activity-slot-text">${escapeHTML(targetVal || "")}</span>`;
    }

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-timeout";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/clock.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Waktu Menjawab Habis</h4>
            <p>Jawaban yang benar: <strong>${escapeHTML(targetVal || "")}</strong></p>
            <div class="feedback-explanation">${escapeHTML(question.explanation || question.penjelasan || "")}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  } else if (question && (question.type === "time_compare" || question.tipe === "time_compare")) {
    const submitBtn = $("btnTimeCompareSubmit");
    if (submitBtn) submitBtn.disabled = true;

    if (currentTimeCompareCards && currentTimeCompareCards.length > 0) {
      currentTimeCompareCards.forEach((c, idx) => {
        c.style.pointerEvents = "none";
        const chk = c.checkboxEl || (c.querySelector && c.querySelector(".time-compare-checkbox"));
        if (idx === question.correct) {
          c.classList.add("card-correct");
          if (chk) chk.textContent = "✓";
        }
      });
    }

    const correctItem = (question.items && question.items[question.correct]) || { label: (question.options && question.options[question.correct]) || (question.pilihan && question.pilihan[question.correct]) || "" };

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-timeout";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/clock.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Waktu Menjawab Habis</h4>
            <p>Kegiatan yang benar: <strong>${escapeHTML(correctItem.label)}</strong></p>
            <div class="feedback-explanation">${escapeHTML(question.explanation || question.penjelasan || "")}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  } else if (question && (question.type === "clock_drop" || question.tipe === "clock_drop")) {
    const submitBtn = $("btnClockDropSubmit");
    if (submitBtn) submitBtn.disabled = true;

    // Nonaktifkan semua chip
    document.querySelectorAll(".clock-drag-chip").forEach(c => {
      c.style.pointerEvents = "none";
      c.removeAttribute("draggable");
    });

    const expHour = String(question.targetHour || (question.hour !== undefined ? String(question.hour).padStart(2, "0") : "05")).padStart(2, "0");
    const expMinute = String(question.targetMinute !== undefined ? String(question.targetMinute).padStart(2, "0") : (question.minute !== undefined ? String(question.minute).padStart(2, "0") : "00")).padStart(2, "0");

    const slotH = $("slotHour");
    const slotM = $("slotMinute");
    if (slotH) {
      slotH.className = "digital-drop-slot hour-slot slot-wrong has-value";
      const valEl = slotH.querySelector(".slot-display-val");
      if (valEl) {
        valEl.textContent = expHour;
        valEl.classList.remove("is-empty");
      }
    }
    if (slotM) {
      slotM.className = "digital-drop-slot minute-slot slot-wrong has-value";
      const valEl = slotM.querySelector(".slot-display-val");
      if (valEl) {
        valEl.textContent = expMinute;
        valEl.classList.remove("is-empty");
      }
    }

    const expl = question.explanation || question.penjelasan || `Pukul ${expHour}:${expMinute} pada jam digital: angka jam diisi ${expHour} dan angka menit diisi ${expMinute}.`;

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-timeout";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/clock.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Waktu Menjawab Habis</h4>
            <p>Jawaban yang benar: <strong>${expHour}:${expMinute}</strong> (Jam ${expHour} dan Menit ${expMinute})</p>
            <div class="feedback-explanation">${escapeHTML(expl)}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  } else if (question && (question.type === "clock_drag" || question.tipe === "clock_drag")) {
    const submitBtn = document.querySelector(".btn-clock-submit");
    if (submitBtn) submitBtn.disabled = true;

    const rawTargetH = question.targetHour ?? question.jam ?? question.hour ?? 12;
    const rawTargetM = question.targetMinute ?? question.menit ?? question.minute ?? 0;

    // Animasikan jarum ke posisi yang benar
    if (currentQuizClock && currentQuizClock.setClockTime) {
      setTimeout(() => {
        currentQuizClock.setClockTime(rawTargetH, rawTargetM, true);
      }, 400);
    }

    const targetStr = `${String(rawTargetH).padStart(2, "0")}.${String(rawTargetM).padStart(2, "0")}`;
    const expl = question.explanation || question.penjelasan || `Pukul ${targetStr} artinya jarum pendek menunjuk angka ${rawTargetH} dan jarum panjang di angka ${rawTargetM === 0 ? 12 : Math.round(rawTargetM / 5)}.`;

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-timeout";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/clock.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Waktu Menjawab Habis</h4>
            <p>Posisi jarum yang benar: <strong>Pukul ${targetStr}</strong></p>
            <div class="feedback-explanation">${escapeHTML(expl)}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  } else {
    // Nonaktifkan semua opsi dan sorot jawaban yang benar (MCQ)
    document.querySelectorAll(".answer-btn").forEach((btn, i) => {
      btn.disabled = true;
      if (question && i === question.correct) {
        btn.classList.add("correct");
      }
    });

    if (feedback && question) {
      feedback.className = "quiz-feedback-quizizz feedback-timeout";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/clock.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Waktu Menjawab Habis</h4>
            <p>Jawaban yang benar: <strong>${escapeHTML(question.options[question.correct])}</strong></p>
            <div class="feedback-explanation">${escapeHTML(question.explanation)}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  }

  if (nextBtn) {
    nextBtn.classList.remove("hidden");
    nextBtn.focus();
  }
}

/**
 * Memperbarui tampilan streak minimalis
 */
function updateStreakBanner() {
  const banner = $("quizStreakBanner");
  const countText = $("quizStreakCount");
  if (!banner || !countText) return;

  if (quizStreak >= 2) {
    countText.textContent = `🔥 ${quizStreak}x Benar!`;
    banner.classList.remove("hidden");
    banner.classList.remove("anim-streak-pop");
    void banner.offsetWidth;
    banner.classList.add("anim-streak-pop");
  } else {
    banner.classList.add("hidden");
  }
}

/**
 * Menampilkan efek floating score melayang (+100)
 * @param {string} text 
 * @param {string} bonusText 
 */
function showFloatingScore(text, bonusText = "") {
  const container = $("floatingScoreContainer");
  if (!container) return;

  const tag = document.createElement("div");
  tag.className = "floating-score-tag";
  tag.innerHTML = `<strong>${escapeHTML(text)}</strong>${bonusText ? `<br><span>${escapeHTML(bonusText)}</span>` : ""}`;
  container.appendChild(tag);

  setTimeout(() => {
    tag.remove();
  }, 1400);
}

/**
 * Memulai kuis untuk level tertentu
 * @param {number} levelId 
 */
function startQuiz(levelId = 1) {
  // Ambil soal yang relevan untuk level ini (dinamis dari storage/pengajar)
  const allQuestions = typeof getQuestions === "function" ? getQuestions() : QUESTIONS;
  
  let filtered = allQuestions.filter(q => Number(q.level) === Number(levelId));
  if (filtered.length === 0) {
    filtered = allQuestions.filter(q => Number(q.level) <= Number(levelId));
  }
  if (filtered.length === 0) {
    filtered = allQuestions;
  }

  currentQuizQuestions = filtered;

  currentQuestionIndex = 0;
  quizPoints = 0;
  quizCorrect = 0;
  quizHints = 0;
  quizAnswered = false;
  hintUsedThisQuestion = false;
  quizStreak = 0;
  maxStreak = 0;

  updateStreakBanner();
  showStudentPage("quizScreen");
  renderQuestion();
}

/**
 * Merender soal aktif pada antarmuka
 */
function renderQuestion() {
  const question = currentQuizQuestions[currentQuestionIndex];

  if (!question) {
    finishQuiz();
    return;
  }

  quizAnswered = false;
  hintUsedThisQuestion = false;
  currentDroppedAnswer = null;
  currentDroppedHour = null;
  currentDroppedMinute = null;
  currentSelectedCompareIndex = null;
  currentTimeCompareCards = [];
  currentDroppedActivityTime = null;

  const quizProgressLabel = $("quizProgressLabel");
  const quizProgressFill = $("quizProgressFill");
  const quizProgressPercent = $("quizProgressPercent");
  const quizPointsEl = $("quizPoints");
  const quizLevelBadge = $("quizLevelBadge");
  const quizQuestionEl = $("quizQuestion");
  const hintBox = $("hintBox");
  const quizFeedback = $("quizFeedback");
  const nextBtn = $("nextQuestionBtn");
  const hintBtn = $("hintBtn");

  if (quizProgressLabel) {
    quizProgressLabel.textContent = `Soal ${currentQuestionIndex + 1} dari ${currentQuizQuestions.length}`;
  }

  const progress = (currentQuestionIndex / currentQuizQuestions.length) * 100;
  if (quizProgressFill) quizProgressFill.style.width = progress + "%";
  if (quizProgressPercent) quizProgressPercent.textContent = Math.round(progress) + "%";
  if (quizPointsEl) quizPointsEl.textContent = quizPoints;
  if (quizLevelBadge) quizLevelBadge.textContent = `Level ${question.level}`;
  if (quizQuestionEl) quizQuestionEl.textContent = question.question || question.pertanyaan || "";

  if (hintBox) {
    hintBox.classList.add("hidden");
    hintBox.textContent = "";
  }

  if (quizFeedback) {
    quizFeedback.className = "quiz-feedback-quizizz hidden";
    quizFeedback.textContent = "";
  }

  if (nextBtn) nextBtn.classList.add("hidden");
  if (hintBtn) hintBtn.disabled = false;

  renderQuestionIllustration(question);
  renderAnswers(question);

  // Mulai hitung mundur waktu ala Quizizz
  startQuestionTimer();
}

/**
 * Membuat elemen visual jam digital alarm interaktif dengan bracket Jam dan Menit
 * Sesuai gambar modul poster (Chassis ungu, layar LED hijau, pointer Jam & Menit)
 * @param {Object} question
 * @returns {HTMLElement}
 */
function createDigitalAlarmClockWidget(question) {
  const wrap = document.createElement("div");
  wrap.className = "digital-alarm-widget-wrap";

  wrap.innerHTML = `
    <div class="digital-alarm-body-container">
      <!-- Label Panduan Jam & Menit Sesuai Buku Pelajaran -->
      <div class="digital-clock-labels-row" aria-hidden="true">
        <span class="digital-label-tag">👈 Jam</span>
        <span class="digital-label-tag">Menit 👉</span>
      </div>

      <div class="digital-alarm-chassis" id="alarmClockChassis">
        <div class="digital-screen-inner">
          <!-- Slot Angka Jam -->
          <div id="slotHour" class="digital-drop-slot hour-slot" data-slot-type="hour" role="region" aria-label="Kotak Angka Jam" tabindex="0">
            <span class="slot-display-val is-empty">--</span>
            <span class="slot-mini-label">Jam</span>
          </div>

          <!-- Titik Dua Pemisah -->
          <div class="digital-screen-colon">:</div>

          <!-- Slot Angka Menit -->
          <div id="slotMinute" class="digital-drop-slot minute-slot" data-slot-type="minute" role="region" aria-label="Kotak Angka Menit" tabindex="0">
            <span class="slot-display-val is-empty">--</span>
            <span class="slot-mini-label">Menit</span>
          </div>
        </div>
      </div>
    </div>
  `;

  return wrap;
}

/**
 * Membuat elemen visual perbandingan 2 kegiatan (Level 3: Lebih Lama atau Lebih Cepat)
 * Sesuai gambar modul buku halaman 185: 2 kartu berdampingan dengan gambar kegiatan,
 * teks label kegiatan, dan kotak centang [...] bergaris oranye, dipisahkan kata "atau".
 * @param {Object} question
 * @returns {HTMLElement}
 */
function createTimeCompareWidget(question) {
  const container = document.createElement("div");
  container.className = "time-compare-container";
  container.id = "timeCompareContainer";
  currentTimeCompareCards = [];

  const items = question.items || (question.options ? question.options.map(opt => ({ label: opt, img: "" })) : []);

  items.forEach((item, index) => {
    if (index === 1) {
      const divider = document.createElement("div");
      divider.className = "time-compare-divider";
      divider.textContent = "atau";
      container.appendChild(divider);
    }

    const card = document.createElement("div");
    card.className = "time-compare-card";
    card.dataset.index = String(index);
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Pilih kegiatan: ${item.label}`);

    const imgBox = document.createElement("div");
    imgBox.className = "time-compare-img-box";
    const img = document.createElement("img");
    img.className = "time-compare-img";
    img.src = item.img || "assets/icons/clock.svg";
    img.alt = item.label;
    imgBox.appendChild(img);

    const labelRow = document.createElement("div");
    labelRow.className = "time-compare-label-row";

    const label = document.createElement("span");
    label.className = "time-compare-label";
    label.textContent = item.label;

    const checkbox = document.createElement("div");
    checkbox.className = "time-compare-checkbox";
    checkbox.textContent = "...";

    labelRow.appendChild(label);
    labelRow.appendChild(checkbox);

    card.appendChild(imgBox);
    card.appendChild(labelRow);
    card.checkboxEl = checkbox;
    currentTimeCompareCards.push(card);

    function handleSelect() {
      if (quizAnswered) return;
      currentSelectedCompareIndex = index;

      currentTimeCompareCards.forEach((c, idx) => {
        const chk = c.checkboxEl || (c.querySelector && c.querySelector(".time-compare-checkbox"));
        if (idx === index) {
          c.classList.add("selected");
          if (chk) chk.textContent = "✓";
        } else {
          c.classList.remove("selected");
          if (chk) chk.textContent = "...";
        }
      });

      const submitBtn = $("btnTimeCompareSubmit");
      if (submitBtn) submitBtn.disabled = false;

      if (typeof playSound === "function") playSound("tick");
    }

    card.addEventListener("click", handleSelect);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect();
      }
    });

    container.appendChild(card);
  });

  return container;
}

/**
 * Membuat elemen visual jam analog + gambar kegiatan + kotak drop jawaban (Level 4: Mengenal Waktu Kegiatan)
 * Sesuai gambar modul buku halaman 183: Gambar jam analog dan kegiatan anak sehari-hari,
 * serta kotak drop bergaris oranye [...] untuk memasangkan keterangan waktu (Pukul X pagi/siang/sore/malam).
 * @param {Object} question
 * @returns {HTMLElement}
 */
function createClockActivityDropWidget(question) {
  const wrap = document.createElement("div");
  wrap.className = "clock-activity-widget-wrap";

  const card = document.createElement("div");
  card.className = "clock-activity-card";

  const img = document.createElement("img");
  img.className = "clock-activity-img";
  img.src = question.img || "assets/images/time_activity_school.png";
  img.alt = question.question || "Kegiatan waktu";
  card.appendChild(img);

  const slotCol = document.createElement("div");
  slotCol.className = "clock-activity-slot-col";

  const slot = document.createElement("div");
  slot.id = "timeActivityDropSlot";
  slot.className = "clock-activity-drop-slot";
  slot.setAttribute("role", "region");
  slot.setAttribute("aria-label", "Kotak Keterangan Waktu Kegiatan");
  slot.setAttribute("tabindex", "0");
  slot.innerHTML = `
    <span class="clock-activity-slot-placeholder">Tarik pilihan waktu ke sini</span>
  `;

  slotCol.appendChild(slot);
  wrap.appendChild(card);
  wrap.appendChild(slotCol);

  return wrap;
}

/**
 * Menyiapkan slot drop pada kuis waktu kegiatan Level 4
 * @param {Object} question
 */
function setupActivityDropSlot(question) {
  const slot = $("timeActivityDropSlot");
  if (!slot) return;

  slot.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    slot.classList.add("drag-hover");
  });

  slot.addEventListener("dragleave", () => {
    slot.classList.remove("drag-hover");
  });

  slot.addEventListener("drop", (e) => {
    e.preventDefault();
    slot.classList.remove("drag-hover");
    const val = e.dataTransfer.getData("text/plain");
    if (val) {
      placeActivityTimeInSlot(val, question);
      if (typeof playSound === "function") playSound("tick");
    }
  });

  slot.addEventListener("click", () => {
    if (quizAnswered) return;
    if (currentDroppedActivityTime !== null) {
      clearActivityDropSlot(question);
      if (typeof playSound === "function") playSound("tick");
    }
  });
}

function placeActivityTimeInSlot(val, question) {
  currentDroppedActivityTime = val;
  updateActivitySlotUI(val);
  updateActivityChipsState();

  const submitBtn = $("btnActivityDropSubmit");
  if (submitBtn) {
    submitBtn.disabled = (currentDroppedActivityTime === null);
  }
}

function clearActivityDropSlot(question) {
  currentDroppedActivityTime = null;
  updateActivitySlotUI(null);
  updateActivityChipsState();

  const submitBtn = $("btnActivityDropSubmit");
  if (submitBtn) {
    submitBtn.disabled = true;
  }
}

function updateActivitySlotUI(val) {
  const slot = $("timeActivityDropSlot");
  if (!slot) return;

  if (val !== null) {
    slot.className = "clock-activity-drop-slot has-value";
    slot.innerHTML = `<span class="clock-activity-slot-text">${escapeHTML(val)}</span>`;
  } else {
    slot.className = "clock-activity-drop-slot";
    slot.innerHTML = `<span class="clock-activity-slot-placeholder">Tarik pilihan waktu ke sini</span>`;
  }
}

function updateActivityChipsState() {
  document.querySelectorAll(".activity-time-chip").forEach((chip) => {
    const val = chip.dataset.value;
    if (val === currentDroppedActivityTime) {
      chip.classList.add("is-placed-slot");
    } else {
      chip.classList.remove("is-placed-slot");
    }
  });
}

function setupActivityChipDragEvents(chip, val, question) {
  chip.addEventListener("dragstart", (e) => {
    if (quizAnswered) {
      e.preventDefault();
      return;
    }
    chip.classList.add("is-dragging-chip");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", val);
  });

  chip.addEventListener("dragend", () => {
    chip.classList.remove("is-dragging-chip");
  });

  let touchGhost = null;

  chip.addEventListener("touchstart", (e) => {
    if (quizAnswered) return;
    const touch = e.touches[0];
    chip.classList.add("is-dragging-chip");

    touchGhost = chip.cloneNode(true);
    touchGhost.className = "clock-drag-chip activity-time-chip touch-drag-ghost";
    touchGhost.style.position = "fixed";
    touchGhost.style.pointerEvents = "none";
    touchGhost.style.zIndex = "9999";
    touchGhost.style.left = `${touch.clientX - 60}px`;
    touchGhost.style.top = `${touch.clientY - 25}px`;
    touchGhost.style.opacity = "0.9";
    document.body.appendChild(touchGhost);
  }, { passive: true });

  chip.addEventListener("touchmove", (e) => {
    if (touchGhost) {
      const touch = e.touches[0];
      touchGhost.style.left = `${touch.clientX - 60}px`;
      touchGhost.style.top = `${touch.clientY - 25}px`;

      const slot = $("timeActivityDropSlot");
      if (slot && slot.getBoundingClientRect) {
        const rect = slot.getBoundingClientRect();
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          slot.classList.add("drag-hover");
        } else {
          slot.classList.remove("drag-hover");
        }
      }
    }
  }, { passive: true });

  chip.addEventListener("touchend", (e) => {
    if (touchGhost) {
      touchGhost.remove();
      touchGhost = null;
      chip.classList.remove("is-dragging-chip");

      const touch = e.changedTouches[0];
      const slot = $("timeActivityDropSlot");
      if (slot && slot.getBoundingClientRect) {
        slot.classList.remove("drag-hover");
        const rect = slot.getBoundingClientRect();
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          placeActivityTimeInSlot(val, question);
          if (typeof playSound === "function") playSound("tick");
        }
      }
    }
  });

  chip.addEventListener("touchcancel", () => {
    if (touchGhost) {
      touchGhost.remove();
      touchGhost = null;
    }
    chip.classList.remove("is-dragging-chip");
    const slot = $("timeActivityDropSlot");
    if (slot) slot.classList.remove("drag-hover");
  });
}

/**
 * Merender ilustrasi jam analog interaktif (dapat diputar/ditarik) atau jam digital alarm atau perbandingan waktu
 * @param {Object} question 
 */
function renderQuestionIllustration(question) {
  const illustration = $("questionIllustration");
  if (!illustration) return;

  illustration.innerHTML = "";
  currentQuizClock = null;

  // 0a. Tipe clock_activity_drop: Menampilkan gambar jam analog + kegiatan + slot drop keterangan waktu (Level 4)
  if (question.type === "clock_activity_drop" || question.tipe === "clock_activity_drop") {
    currentDroppedActivityTime = null;
    illustration.appendChild(createClockActivityDropWidget(question));
    setupActivityDropSlot(question);
    return;
  }

  // 0b. Tipe time_compare: Menampilkan 2 kartu kegiatan berdampingan dengan gambar dan checkbox centang
  if (question.type === "time_compare" || question.tipe === "time_compare") {
    currentSelectedCompareIndex = null;
    illustration.appendChild(createTimeCompareWidget(question));
    return;
  }

  // 0b. Tipe clock_drop: Menampilkan jam digital alarm interaktif dengan drop slot Jam dan Menit
  if (question.type === "clock_drop" || question.tipe === "clock_drop") {
    currentDroppedHour = null;
    currentDroppedMinute = null;
    illustration.appendChild(createDigitalAlarmClockWidget(question));
    setupDigitalClockDropSlots(question);
    return;
  }

  // 0b. Tipe clock_drag: Siswa menggeser / mengarahkan jarum jam ke waktu target
  if (question.type === "clock_drag" || question.tipe === "clock_drag") {
    // Tampilan jam analog bersih tanpa petunjuk/tombol di bawahnya
    currentQuizClock = createClock(12, 0, 280, true, false);
    illustration.appendChild(currentQuizClock);
    return;
  }

  // 1. Tampilan Jam Digital
  if (question.digitalTime || (typeof question.type === "string" && question.type.startsWith("digital_"))) {
    let dTime = question.digitalTime;
    if (!dTime && question.type.startsWith("digital_")) {
      const parts = question.type.split("_");
      dTime = `${parts[1] || "05"}:${parts[2] || "00"}`;
    }
    const digiBox = document.createElement("div");
    digiBox.className = "quiz-digital-display-card";
    digiBox.innerHTML = `
      <div class="digital-badge large">${escapeHTML(dTime)}</div>
    `;
    illustration.appendChild(digiBox);
    return;
  }

  // 1b. Tampilan Gambar / SVG Kustom yang Diunggah Guru
  if (question.img || question.gambar) {
    const imgWrap = document.createElement("div");
    imgWrap.className = "quiz-custom-img-wrap";
    imgWrap.style.cssText = "text-align:center;margin:12px auto;max-width:340px;";
    const img = document.createElement("img");
    img.src = question.img || question.gambar;
    img.alt = question.question || question.pertanyaan || "Ilustrasi soal";
    img.style.cssText = "max-width:100%;max-height:220px;border-radius:12px;object-fit:contain;background:#fff;border:1.5px solid var(--border);box-shadow:0 4px 12px rgba(0,0,0,0.06);";
    imgWrap.appendChild(img);
    illustration.appendChild(imgWrap);
    return;
  }

  // 2. Tampilan Jam Analog (Bisa digerakkan/diputar langsung)
  const isClock = question.type === "clock" || 
                  (typeof question.type === "string" && question.type.startsWith("clock")) || 
                  question.hour !== undefined;

  if (!isClock) {
    return;
  }

  let hour = question.hour;
  let minute = question.minute;
  if (hour === undefined && typeof question.type === "string" && question.type.includes("_")) {
    const parts = question.type.split("_");
    hour = parseInt(parts[1], 10) || 12;
    minute = parseInt(parts[2], 10) || 0;
  }

  currentQuizClock = createClock(hour ?? 12, minute ?? 0, 230, false, false);
  illustration.appendChild(currentQuizClock);
}

/**
 * Membuat elemen visual jam analog dinamis yang BISA DIGERAKKAN (DRAGGABLE / ROTATABLE)
 * Dilengkapi grab-handle ujung jarum dan tombol step waktu ala Toy Theater
 * @param {number} hour Jam awal
 * @param {number} minute Menit awal
 * @param {number} size Diameter jam
 * @param {boolean} isInteractive Apakah murid dapat menggeser/memutar jarum jam
 * @returns {HTMLElement} Elemen kontainer jam interaktif
 */
function createClock(hour, minute, size = 230, isInteractive = true, showControls = false) {
  const wrapper = document.createElement("div");
  wrapper.className = "interactive-clock-container";

  const face = document.createElement("div");
  face.className = "clock-face interactive-clock-face";
  face.style.width = size + "px";
  face.style.height = size + "px";
  face.style.maxWidth = "100%";
  face.style.touchAction = "none"; // Mencegah scrolling browser saat menggeser jarum jam

  // 60 Tanda Menit Dial (Alat peraga matematika sekolah asli)
  for (let m = 0; m < 60; m++) {
    const tick = document.createElement("div");
    tick.className = (m % 5 === 0) ? "clock-tick major" : "clock-tick minor";
    tick.style.setProperty("--tick-angle", (m * 6) + "deg");
    face.appendChild(tick);
  }

  // 12 Angka Jam (Dapat disentuh / diklik langsung untuk mengarahkan jarum)
  for (let number = 1; number <= 12; number++) {
    const numWrapper = document.createElement("div");
    numWrapper.className = "clock-number";
    numWrapper.style.setProperty("--angle", (number * 30) + "deg");

    const span = document.createElement("span");
    span.textContent = number;
    if (isInteractive) {
      span.style.cursor = "pointer";
      span.style.pointerEvents = "auto";
      span.style.userSelect = "none";
      span.title = `Klik untuk mengarahkan jarum ke angka ${number}`;
      span.addEventListener("click", (e) => {
        e.stopPropagation();
        curH = number;
        updateHands(curH, curM, true);
        if (typeof playSound === "function") playSound("tick");
      });
    }
    numWrapper.appendChild(span);

    face.appendChild(numWrapper);
  }

  // Jarum Jam Pendek (Merah) dengan Grab Handle
  const hourHand = document.createElement("div");
  hourHand.className = "clock-hand hour-hand red-hand draggable-hand";
  const hourHandle = document.createElement("div");
  hourHandle.className = "hand-grab-handle hour-handle";
  hourHandle.title = "Tarik untuk memutar jarum jam (merah)";
  hourHand.appendChild(hourHandle);

  // Jarum Menit Panjang (Biru) dengan Grab Handle
  const minuteHand = document.createElement("div");
  minuteHand.className = "clock-hand minute-hand blue-hand draggable-hand";
  const minuteHandle = document.createElement("div");
  minuteHandle.className = "hand-grab-handle minute-handle";
  minuteHandle.title = "Tarik untuk memutar jarum menit (biru)";
  minuteHand.appendChild(minuteHandle);

  const center = document.createElement("div");
  center.className = "clock-center";

  let curH = (Number(hour) % 12) || 12;
  let curM = Number(minute) % 60;
  const initialH = curH;
  const initialM = curM;

  function updateHands(h, m, animate = false) {
    curH = (Number(h) % 12) || 12;
    curM = Number(m) % 60;

    const hourAngle = ((curH % 12) + curM / 60) * 30;
    const minuteAngle = curM * 6;

    if (animate) {
      hourHand.style.transition = "transform 0.25s cubic-bezier(0.2, 0.8, 0.3, 1)";
      minuteHand.style.transition = "transform 0.25s cubic-bezier(0.2, 0.8, 0.3, 1)";
      setTimeout(() => {
        hourHand.style.transition = "";
        minuteHand.style.transition = "";
      }, 280);
    }

    hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;

    const readout = wrapper.querySelector(".clock-live-time-val");
    if (readout) {
      readout.textContent = `${String(curH).padStart(2, "0")}.${String(curM).padStart(2, "0")}`;
    }
  }

  updateHands(curH, curM, false);

  face.appendChild(hourHand);
  face.appendChild(minuteHand);
  face.appendChild(center);
  wrapper.appendChild(face);

  if (isInteractive && showControls) {
    // Bilah Kontrol & Status Jam yang Digerakkan
    const ctrlBar = document.createElement("div");
    ctrlBar.className = "quiz-clock-ctrl-bar";
    ctrlBar.innerHTML = `
      <div class="clock-live-badge">
        <span class="badge-label">Jarum Menunjukkan:</span>
        <strong class="clock-live-time-val">${String(curH).padStart(2, "0")}.${String(curM).padStart(2, "0")}</strong>
      </div>
      <div class="clock-drag-hint-pill">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span>Sentuh & geser lingkaran merah (Jam) atau biru (Menit)</span>
      </div>
      <div class="clock-step-buttons">
        <button type="button" class="btn-step" data-act="-h" title="Kurangi 1 jam">-1 Jam</button>
        <button type="button" class="btn-step" data-act="+h" title="Tambah 1 jam">+1 Jam</button>
        <button type="button" class="btn-step" data-act="-m" title="Kurangi 15 menit">-15 Menit</button>
        <button type="button" class="btn-step" data-act="+m" title="Tambah 15 menit">+15 Menit</button>
        <button type="button" class="btn-step reset" data-act="reset" title="Kembalikan posisi jarum awal">Reset Soal</button>
      </div>
    `;

    ctrlBar.querySelectorAll(".btn-step").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const act = btn.getAttribute("data-act");
        if (act === "+h") {
          updateHands((curH % 12) + 1, curM, true);
        } else if (act === "-h") {
          updateHands(curH - 1 <= 0 ? 12 : curH - 1, curM, true);
        } else if (act === "+m") {
          let nm = curM + 15;
          let nh = curH;
          if (nm >= 60) {
            nm -= 60;
            nh = (curH % 12) + 1;
          }
          updateHands(nh, nm, true);
        } else if (act === "-m") {
          let nm = curM - 15;
          let nh = curH;
          if (nm < 0) {
            nm += 60;
            nh = curH - 1 <= 0 ? 12 : curH - 1;
          }
          updateHands(nh, nm, true);
        } else if (act === "reset") {
          updateHands(initialH, initialM, true);
        }
        if (typeof playSound === "function") playSound("tick");
      });
    });

    wrapper.appendChild(ctrlBar);
  }

  if (isInteractive) {
    // =========================================================
    // DRAG / PUTAR JARUM MENGGUNAKAN POINTER EVENTS
    // =========================================================
    let activeHand = null;

    function getPointerMetrics(clientX, clientY) {
      const rect = face.getBoundingClientRect();
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

    function rotateToDeg(deg) {
      if (!activeHand) return;
      if (activeHand === "minute") {
        const nearest5 = (Math.round(deg / 30) * 5) % 60;
        if (nearest5 !== curM) {
          curM = nearest5;
          updateHands(curH, curM, false);
          if (typeof playSound === "function") playSound("tick");
        }
      } else {
        let nearestH = Math.round(deg / 30) % 12;
        if (nearestH === 0) nearestH = 12;
        if (nearestH !== curH) {
          curH = nearestH;
          updateHands(curH, curM, false);
          if (typeof playSound === "function") playSound("tick");
        }
      }
    }

    function onPointerDown(e) {
      if (e.button !== undefined && e.button !== 0) return; // Hanya tombol mouse utama
      if (e.cancelable) e.preventDefault();

      const { deg } = getPointerMetrics(e.clientX, e.clientY);
      const target = e.target;

      // Pemilihan jarum yang intuitif untuk anak:
      if (target === minuteHandle || target.closest(".minute-hand")) {
        activeHand = "minute";
        minuteHand.style.zIndex = "30";
        hourHand.style.zIndex = "10";
      } else if (target === hourHandle || target.closest(".hour-hand")) {
        activeHand = "hour";
        hourHand.style.zIndex = "30";
        minuteHand.style.zIndex = "10";
      } else {
        // Sentuhan pada angka / piringan jam otomatis mengarahkan jarum jam (merah)
        activeHand = "hour";
        hourHand.style.zIndex = "30";
        minuteHand.style.zIndex = "10";
      }

      face.classList.add("is-dragging");
      rotateToDeg(deg);

      window.addEventListener("pointermove", onPointerMove, { passive: false });
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
      face.addEventListener("pointermove", onPointerMove, { passive: false });
      face.addEventListener("pointerup", onPointerUp);
      face.addEventListener("pointercancel", onPointerUp);
    }

    function onPointerMove(e) {
      if (!activeHand) return;
      if (e.cancelable) e.preventDefault();
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      const { deg } = getPointerMetrics(clientX, clientY);
      rotateToDeg(deg);
    }

    function onPointerUp() {
      if (activeHand) {
        activeHand = null;
        face.classList.remove("is-dragging");
      }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      face.removeEventListener("pointermove", onPointerMove);
      face.removeEventListener("pointerup", onPointerUp);
      face.removeEventListener("pointercancel", onPointerUp);
    }

    face.addEventListener("pointerdown", onPointerDown);

    // Dukungan touch mobile langsung
    face.addEventListener("touchstart", (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      const target = e.target;
      if (target === minuteHandle || target.closest(".minute-hand")) {
        activeHand = "minute";
        minuteHand.style.zIndex = "30";
        hourHand.style.zIndex = "10";
      } else {
        activeHand = "hour";
        hourHand.style.zIndex = "30";
        minuteHand.style.zIndex = "10";
      }
      face.classList.add("is-dragging");
      const { deg } = getPointerMetrics(t.clientX, t.clientY);
      rotateToDeg(deg);
    }, { passive: true });

    face.addEventListener("touchmove", (e) => {
      if (!activeHand || !e.touches || e.touches.length === 0) return;
      if (e.cancelable) e.preventDefault();
      const t = e.touches[0];
      const { deg } = getPointerMetrics(t.clientX, t.clientY);
      rotateToDeg(deg);
    }, { passive: false });

    face.addEventListener("touchend", () => {
      activeHand = null;
      face.classList.remove("is-dragging");
    }, { passive: true });
  }

  wrapper.setClockTime = updateHands;
  wrapper.getClockTime = () => ({ hour: curH, minute: curM });

  return wrapper;
}

/**
 * Merender pilihan jawaban 4 warna ikonik ala Quizizz (Merah, Biru, Kuning, Hijau)
 * Untuk tipe clock_drag, tampilkan tombol "Jawab" tunggal
 * @param {Object} question 
 */
function renderAnswers(question) {
  const grid = $("answerGrid");
  if (!grid) return;

  grid.innerHTML = "";

  // === Tipe clock_drop: Pilihan Kartu Angka Waktu Draggable & Clickable ===
  if (question.type === "clock_drop" || question.tipe === "clock_drop") {
    grid.className = "clock-drop-answers-area";

    const banner = document.createElement("div");
    banner.className = "clock-drop-instruction-banner";
    banner.innerHTML = `
      <span>Tarik angka (Jam) dan (Menit) ke jam digital di atas, atau klik angka:</span>
    `;
    grid.appendChild(banner);

    const chipsRow = document.createElement("div");
    chipsRow.id = "draggableChipsRow";
    chipsRow.className = "clock-draggable-chips-row";

    const colorClasses = ["chip-blue", "chip-green", "chip-amber", "chip-red"];

    question.options.forEach((opt, idx) => {
      const chip = document.createElement("div");
      chip.className = `clock-drag-chip digital-chip ${colorClasses[idx % 4]}`;
      chip.draggable = true;
      chip.dataset.value = String(opt).padStart(2, "0");
      chip.dataset.index = String(idx);
      chip.setAttribute("role", "button");
      chip.setAttribute("tabindex", "0");
      chip.innerHTML = `<span>${escapeHTML(opt)}</span>`;

      setupDigitalChipDragEvents(chip, String(opt).padStart(2, "0"), question);

      chip.addEventListener("click", () => {
        if (quizAnswered) return;
        const val = chip.dataset.value;
        if (currentDroppedHour === val) {
          clearDigitalSlot("hour", question);
          if (typeof playSound === "function") playSound("tick");
          return;
        }
        if (currentDroppedMinute === val) {
          clearDigitalSlot("minute", question);
          if (typeof playSound === "function") playSound("tick");
          return;
        }
        if (currentDroppedHour === null) {
          placeNumberInSlot("hour", val, question);
        } else if (currentDroppedMinute === null) {
          placeNumberInSlot("minute", val, question);
        } else {
          placeNumberInSlot("hour", val, question);
        }
        if (typeof playSound === "function") playSound("tick");
      });

      chipsRow.appendChild(chip);
    });

    grid.appendChild(chipsRow);

    const submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.id = "btnClockDropSubmit";
    submitBtn.className = "btn btn-game-primary btn-clock-submit";
    submitBtn.style.marginTop = "14px";
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <img src="assets/icons/check-circle.svg" width="22" height="22" alt="">
      <span>Jawab</span>
    `;

    submitBtn.addEventListener("click", () => {
      submitClockDropAnswer(question);
    });

    grid.appendChild(submitBtn);
    return;
  }

  // === Tipe clock_activity_drop: Drag & Drop Pilihan Waktu Kegiatan (Level 4) ===
  if (question.type === "clock_activity_drop" || question.tipe === "clock_activity_drop") {
    grid.className = "clock-drop-answers-area";

    const banner = document.createElement("div");
    banner.className = "clock-drop-instruction-banner";
    banner.innerHTML = `
      <span>Tarik pilihan waktu ke dalam kotak di samping, atau klik pilihan:</span>
    `;
    grid.appendChild(banner);

    const chipsRow = document.createElement("div");
    chipsRow.id = "activityChipsRow";
    chipsRow.className = "clock-draggable-chips-row";

    const colorClasses = ["chip-blue", "chip-green", "chip-amber", "chip-red"];

    const rawOptions = question.options || question.pilihan || [];
    rawOptions.forEach((opt, idx) => {
      const chip = document.createElement("div");
      chip.className = `clock-drag-chip activity-time-chip ${colorClasses[idx % 4]}`;
      chip.draggable = true;
      chip.dataset.value = opt;
      chip.dataset.index = String(idx);
      chip.setAttribute("role", "button");
      chip.setAttribute("tabindex", "0");
      chip.innerHTML = `<span>${escapeHTML(opt)}</span>`;

      setupActivityChipDragEvents(chip, opt, question);

      chip.addEventListener("click", () => {
        if (quizAnswered) return;
        if (currentDroppedActivityTime === opt) {
          clearActivityDropSlot(question);
          if (typeof playSound === "function") playSound("tick");
          return;
        }
        placeActivityTimeInSlot(opt, question);
        if (typeof playSound === "function") playSound("tick");
      });

      chipsRow.appendChild(chip);
    });

    grid.appendChild(chipsRow);

    const submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.id = "btnActivityDropSubmit";
    submitBtn.className = "btn btn-game-primary btn-clock-submit";
    submitBtn.style.marginTop = "14px";
    submitBtn.disabled = (currentDroppedActivityTime === null);
    submitBtn.innerHTML = `
      <img src="assets/icons/check-circle.svg" width="22" height="22" alt="">
      <span>Jawab</span>
    `;

    submitBtn.addEventListener("click", () => {
      submitActivityDropAnswer(question);
    });

    grid.appendChild(submitBtn);
    return;
  }

  // === Tipe time_compare: Tombol "Jawab" tunggal dengan pilihan centang kegiatan ===
  if (question.type === "time_compare" || question.tipe === "time_compare") {
    grid.className = "quizizz-answer-grid clock-drag-answer-grid";

    const submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.id = "btnTimeCompareSubmit";
    submitBtn.className = "btn btn-game-primary btn-clock-submit";
    submitBtn.disabled = (currentSelectedCompareIndex === null);
    submitBtn.innerHTML = `
      <img src="assets/icons/check-circle.svg" width="22" height="22" alt="">
      <span>Jawab</span>
    `;

    submitBtn.addEventListener("click", () => {
      submitTimeCompareAnswer(question);
    });

    grid.appendChild(submitBtn);
    return;
  }

  // === Tipe clock_drag: Tombol "Jawab" tunggal ===
  if (question.type === "clock_drag" || question.tipe === "clock_drag") {
    grid.className = "quizizz-answer-grid clock-drag-answer-grid";

    const submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.className = "btn btn-game-primary btn-clock-submit";
    submitBtn.innerHTML = `
      <img src="assets/icons/check-circle.svg" width="22" height="22" alt="">
      <span>Jawab</span>
    `;

    submitBtn.addEventListener("click", () => {
      submitClockDragAnswer(question);
    });

    grid.appendChild(submitBtn);
    return;
  }

  // === Tipe MCQ biasa ===
  grid.className = "quizizz-answer-grid";

  const letters = ["A", "B", "C", "D"];
  const shapes = ["▲", "◆", "●", "■"];
  const colorClasses = ["ans-red", "ans-blue", "ans-amber", "ans-green"];

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `answer-btn ${colorClasses[index % 4]}`;

    button.innerHTML = `
      <div class="ans-badge-wrap">
        <span class="ans-shape">${shapes[index % 4]}</span>
        <span class="ans-letter">${letters[index]}</span>
      </div>
      <span class="answer-text">${escapeHTML(option)}</span>
    `;

    button.addEventListener("click", () => {
      selectAnswer(index, button, question);
    });

    grid.appendChild(button);
  });
}

/**
 * Menyiapkan slot drop jam dan menit pada jam digital alarm
 * @param {Object} question
 */
function setupDigitalClockDropSlots(question) {
  const slotH = $("slotHour");
  const slotM = $("slotMinute");

  [slotH, slotM].forEach((slot) => {
    if (!slot) return;
    const slotType = (slot.getAttribute && slot.getAttribute("data-slot-type")) || 
                     (slot.dataset && slot.dataset.slotType) || 
                     (slot.id === "slotHour" ? "hour" : "minute");

    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      slot.classList.add("drag-hover");
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("drag-hover");
    });

    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.classList.remove("drag-hover");
      const val = e.dataTransfer.getData("text/plain");
      if (val) {
        placeNumberInSlot(slotType, val, question);
        if (typeof playSound === "function") playSound("tick");
      }
    });

    slot.addEventListener("click", () => {
      if (quizAnswered) return;
      if (slotType === "hour" && currentDroppedHour !== null) {
        clearDigitalSlot("hour", question);
        if (typeof playSound === "function") playSound("tick");
      } else if (slotType === "minute" && currentDroppedMinute !== null) {
        clearDigitalSlot("minute", question);
        if (typeof playSound === "function") playSound("tick");
      }
    });
  });
}

/**
 * Menaruh kartu angka ke dalam slot (Jam atau Menit)
 * @param {"hour"|"minute"} slotType
 * @param {string} val
 * @param {Object} question
 */
function placeNumberInSlot(slotType, val, question) {
  if (slotType === "hour") {
    if (currentDroppedMinute === val) {
      clearDigitalSlot("minute", question, false);
    }
    currentDroppedHour = val;
    updateDigitalSlotUI("hour", val);
  } else {
    if (currentDroppedHour === val) {
      clearDigitalSlot("hour", question, false);
    }
    currentDroppedMinute = val;
    updateDigitalSlotUI("minute", val);
  }

  updateDraggableChipsState();

  const submitBtn = $("btnClockDropSubmit");
  if (submitBtn) {
    submitBtn.disabled = !(currentDroppedHour !== null && currentDroppedMinute !== null);
  }
}

/**
 * Mengosongkan slot tertentu (Jam atau Menit)
 * @param {"hour"|"minute"} slotType
 * @param {Object} question
 * @param {boolean} updateChips
 */
function clearDigitalSlot(slotType, question, updateChips = true) {
  if (slotType === "hour") {
    currentDroppedHour = null;
    updateDigitalSlotUI("hour", null);
  } else {
    currentDroppedMinute = null;
    updateDigitalSlotUI("minute", null);
  }

  if (updateChips) {
    updateDraggableChipsState();
  }

  const submitBtn = $("btnClockDropSubmit");
  if (submitBtn) {
    submitBtn.disabled = !(currentDroppedHour !== null && currentDroppedMinute !== null);
  }
}

/**
 * Memperbarui UI tampilan angka pada slot jam digital
 * @param {"hour"|"minute"} slotType
 * @param {string|null} val
 */
function updateDigitalSlotUI(slotType, val) {
  const slot = slotType === "hour" ? $("slotHour") : $("slotMinute");
  if (!slot) return;

  const displayEl = slot.querySelector(".slot-display-val");
  if (val !== null) {
    slot.classList.add("has-value");
    if (displayEl) {
      displayEl.textContent = val;
      displayEl.classList.remove("is-empty");
    }
  } else {
    slot.classList.remove("has-value");
    if (displayEl) {
      displayEl.textContent = "--";
      displayEl.classList.add("is-empty");
    }
  }
}

/**
 * Menandai chip di tray bawah yang sedang terpasang di salah satu slot
 */
function updateDraggableChipsState() {
  document.querySelectorAll(".clock-drag-chip").forEach((chip) => {
    const val = chip.dataset.value;
    if (val === currentDroppedHour || val === currentDroppedMinute) {
      chip.classList.add("is-placed-slot");
    } else {
      chip.classList.remove("is-placed-slot");
    }
  });
}

/**
 * Menyiapkan interaksi drag HTML5 desktop dan touch-drag mobile untuk chip angka jam digital
 * @param {HTMLElement} chip
 * @param {string} val
 * @param {Object} question
 */
function setupDigitalChipDragEvents(chip, val, question) {
  // Desktop HTML5 drag
  chip.addEventListener("dragstart", (e) => {
    if (quizAnswered) return;
    e.dataTransfer.setData("text/plain", val);
    chip.classList.add("is-dragging-chip");
  });

  chip.addEventListener("dragend", () => {
    chip.classList.remove("is-dragging-chip");
    const slotH = $("slotHour");
    const slotM = $("slotMinute");
    if (slotH) slotH.classList.remove("drag-hover");
    if (slotM) slotM.classList.remove("drag-hover");
  });

  // Mobile Touch drag dengan ghost visual
  let touchGhost = null;
  let touchStartX = 0;
  let touchStartY = 0;

  chip.addEventListener("touchstart", (e) => {
    if (quizAnswered) return;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  chip.addEventListener("touchmove", (e) => {
    if (quizAnswered) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartX);
    const dy = Math.abs(touch.clientY - touchStartY);

    if (dx > 8 || dy > 8) {
      if (!touchGhost) {
        touchGhost = chip.cloneNode(true);
        touchGhost.className = `${chip.className} drag-chip-touch-ghost`;
        document.body.appendChild(touchGhost);
        chip.classList.add("is-dragging-chip");
      }
      touchGhost.style.left = `${touch.clientX - 40}px`;
      touchGhost.style.top = `${touch.clientY - 25}px`;

      const slotH = $("slotHour");
      const slotM = $("slotMinute");
      [slotH, slotM].forEach((s) => {
        if (!s) return;
        const rect = s.getBoundingClientRect();
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          s.classList.add("drag-hover");
        } else {
          s.classList.remove("drag-hover");
        }
      });
    }
  }, { passive: true });

  chip.addEventListener("touchend", (e) => {
    if (touchGhost) {
      touchGhost.remove();
      touchGhost = null;
      chip.classList.remove("is-dragging-chip");

      const touch = e.changedTouches[0];
      const slotH = $("slotHour");
      const slotM = $("slotMinute");

      [slotH, slotM].forEach((s) => {
        if (!s) return;
        s.classList.remove("drag-hover");
        const rect = s.getBoundingClientRect();
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          const slotType = (s.getAttribute && s.getAttribute("data-slot-type")) || 
                           (s.dataset && s.dataset.slotType) || 
                           (s.id === "slotHour" ? "hour" : "minute");
          placeNumberInSlot(slotType, val, question);
          if (typeof playSound === "function") playSound("tick");
        }
      });
    }
  });

  chip.addEventListener("touchcancel", () => {
    if (touchGhost) {
      touchGhost.remove();
      touchGhost = null;
    }
    chip.classList.remove("is-dragging-chip");
    const slotH = $("slotHour");
    const slotM = $("slotMinute");
    if (slotH) slotH.classList.remove("drag-hover");
    if (slotM) slotM.classList.remove("drag-hover");
  });
}

/**
 * Mengevaluasi jawaban clock_drop: Cek apakah angka Jam dan Menit yang dipasang sesuai target
 * @param {Object} question
 */
function submitClockDropAnswer(question) {
  if (quizAnswered || currentDroppedHour === null || currentDroppedMinute === null) return;
  quizAnswered = true;
  stopQuestionTimer();

  const expHour = String(question.targetHour || (question.hour !== undefined ? String(question.hour).padStart(2, "0") : "05")).padStart(2, "0");
  const expMinute = String(question.targetMinute !== undefined ? String(question.targetMinute).padStart(2, "0") : (question.minute !== undefined ? String(question.minute).padStart(2, "0") : "00")).padStart(2, "0");

  const isHourCorrect = String(currentDroppedHour).padStart(2, "0") === expHour;
  const isMinuteCorrect = String(currentDroppedMinute).padStart(2, "0") === expMinute;
  const isCorrect = isHourCorrect && isMinuteCorrect;

  const slotH = $("slotHour");
  const slotM = $("slotMinute");
  const submitBtn = $("btnClockDropSubmit");
  const feedback = $("quizFeedback");
  const nextBtn = $("nextQuestionBtn");
  const hintBtn = $("hintBtn");
  const card = $("quizCard");

  if (hintBtn) hintBtn.disabled = true;
  if (submitBtn) submitBtn.disabled = true;

  // Nonaktifkan semua chip
  document.querySelectorAll(".clock-drag-chip").forEach((c) => {
    c.style.pointerEvents = "none";
    c.removeAttribute("draggable");
  });

  const answerStr = `${currentDroppedHour}:${currentDroppedMinute}`;
  const targetStr = `${expHour}:${expMinute}`;

  if (isCorrect) {
    if (slotH) slotH.className = "digital-drop-slot hour-slot slot-correct has-value";
    if (slotM) slotM.className = "digital-drop-slot minute-slot slot-correct has-value";
    if (submitBtn) submitBtn.className = "btn btn-game-primary btn-clock-submit clock-correct";

    quizCorrect++;
    quizStreak++;
    if (quizStreak > maxStreak) maxStreak = quizStreak;

    const speedBonus = Math.min(40, Math.round(questionTimeRemaining * 1.6));
    const streakBonus = quizStreak >= 2 ? (quizStreak - 1) * 20 : 0;
    const earnedPoints = (question.points || question.poin || 100) + speedBonus + streakBonus;
    quizPoints += earnedPoints;

    if (quizStreak >= 2) {
      if (typeof playSound === "function") playSound("streak");
    } else {
      if (typeof playSound === "function") playSound("correct");
    }

    updateStreakBanner();

    let bonusMsg = "";
    if (speedBonus > 15 && streakBonus > 0) {
      bonusMsg = `Bonus Cepat (+${speedBonus}) & Streak (+${streakBonus})`;
    } else if (speedBonus > 15) {
      bonusMsg = `Bonus Kecepatan (+${speedBonus})`;
    } else if (streakBonus > 0) {
      bonusMsg = `Bonus Streak (+${streakBonus})`;
    }

    showFloatingScore(`+${earnedPoints}`, bonusMsg);

    const expl = question.explanation || question.penjelasan || `Pukul ${targetStr} pada jam digital: angka jam diisi ${expHour} dan angka menit diisi ${expMinute}.`;

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-correct";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/check-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Hebat! Pasangan Angka Jam dan Menit Tepat (+${earnedPoints} Poin)</h4>
            <p>Jam digital menunjukkan <strong>${answerStr}</strong> (Jam ${expHour} dan Menit ${expMinute}) — benar!</p>
            <div class="feedback-explanation">${escapeHTML(expl)}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  } else {
    if (slotH) {
      slotH.className = `digital-drop-slot hour-slot ${isHourCorrect ? "slot-correct" : "slot-wrong"} has-value`;
    }
    if (slotM) {
      slotM.className = `digital-drop-slot minute-slot ${isMinuteCorrect ? "slot-correct" : "slot-wrong"} has-value`;
    }
    if (submitBtn) submitBtn.className = "btn btn-game-primary btn-clock-submit clock-wrong";

    quizStreak = 0;
    updateStreakBanner();

    const chassis = $("alarmClockChassis");
    if (chassis) {
      chassis.classList.remove("anim-quiz-shake");
      void chassis.offsetWidth;
      chassis.classList.add("anim-quiz-shake");
    } else if (card) {
      card.classList.remove("anim-quiz-shake");
      void card.offsetWidth;
      card.classList.add("anim-quiz-shake");
    }

    if (typeof playSound === "function") playSound("wrong");

    const expl = question.explanation || question.penjelasan || `Pukul ${targetStr} pada jam digital: angka jam diisi ${expHour} dan angka menit diisi ${expMinute}.`;

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-wrong";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/x-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Angka Belum Tepat</h4>
            <p>Kamu memasang: <strong>${answerStr}</strong> — waktu yang benar: <strong>${targetStr}</strong> (Jam ${expHour} dan Menit ${expMinute})</p>
            <div class="feedback-explanation">${escapeHTML(expl)}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  }

  const pointsEl = $("quizPoints");
  if (pointsEl) pointsEl.textContent = quizPoints;

  if (nextBtn) {
    nextBtn.classList.remove("hidden");
    nextBtn.focus();
  }
}

/**
 * Mengevaluasi jawaban time_compare: Cek apakah kegiatan yang dicentang sesuai target
 * @param {Object} question
 */
function submitTimeCompareAnswer(question) {
  if (quizAnswered || currentSelectedCompareIndex === null) return;
  quizAnswered = true;
  stopQuestionTimer();

  const isCorrect = currentSelectedCompareIndex === question.correct;
  const feedback = $("quizFeedback");
  const nextBtn = $("nextQuestionBtn");
  const hintBtn = $("hintBtn");
  const card = $("quizCard");
  const submitBtn = $("btnTimeCompareSubmit");

  if (hintBtn) hintBtn.disabled = true;
  if (submitBtn) submitBtn.disabled = true;

  if (currentTimeCompareCards && currentTimeCompareCards.length > 0) {
    currentTimeCompareCards.forEach((c, idx) => {
      c.style.pointerEvents = "none";
      const chk = c.checkboxEl || (c.querySelector && c.querySelector(".time-compare-checkbox"));
      if (idx === question.correct) {
        c.classList.remove("selected");
        c.classList.add("card-correct");
        if (chk) chk.textContent = "✓";
      } else if (idx === currentSelectedCompareIndex && !isCorrect) {
        c.classList.remove("selected");
        c.classList.add("card-wrong");
        if (chk) chk.textContent = "✕";
      }
    });
  }

  const selectedItem = (question.items && question.items[currentSelectedCompareIndex]) || { label: (question.options && question.options[currentSelectedCompareIndex]) || "" };
  const correctItem = (question.items && question.items[question.correct]) || { label: (question.options && question.options[question.correct]) || "" };

  if (isCorrect) {
    if (submitBtn) submitBtn.className = "btn btn-game-primary btn-clock-submit clock-correct";
    quizCorrect++;
    quizStreak++;
    if (quizStreak > maxStreak) maxStreak = quizStreak;

    const speedBonus = Math.min(40, Math.round(questionTimeRemaining * 1.6));
    const streakBonus = quizStreak >= 2 ? (quizStreak - 1) * 20 : 0;
    const basePts = question.points || question.poin || 100;
    const earnedPoints = basePts + speedBonus + streakBonus;
    quizPoints += earnedPoints;

    if (quizStreak >= 2) {
      if (typeof playSound === "function") playSound("streak");
    } else {
      if (typeof playSound === "function") playSound("correct");
    }

    updateStreakBanner();

    let bonusMsg = "";
    if (speedBonus > 15 && streakBonus > 0) {
      bonusMsg = `Bonus Cepat (+${speedBonus}) & Streak (+${streakBonus})`;
    } else if (speedBonus > 15) {
      bonusMsg = `Bonus Kecepatan (+${speedBonus})`;
    } else if (streakBonus > 0) {
      bonusMsg = `Bonus Streak (+${streakBonus})`;
    }

    showFloatingScore(`+${earnedPoints}`, bonusMsg);

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-correct";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/check-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Pilihan Tepat! (+${earnedPoints} Poin)</h4>
            <p>Kegiatan <strong>${escapeHTML(correctItem.label)}</strong> adalah jawaban yang benar.</p>
            <div class="feedback-explanation">${escapeHTML(question.explanation || question.penjelasan || "")}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  } else {
    if (submitBtn) submitBtn.className = "btn btn-game-primary btn-clock-submit clock-wrong";
    quizStreak = 0;
    updateStreakBanner();

    if (card) {
      card.classList.remove("anim-quiz-shake");
      void card.offsetWidth;
      card.classList.add("anim-quiz-shake");
    }

    if (typeof playSound === "function") playSound("wrong");

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-wrong";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/x-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Jawaban Belum Tepat</h4>
            <p>Kamu memilih: <strong>${escapeHTML(selectedItem.label)}</strong> — Jawaban yang benar: <strong>${escapeHTML(correctItem.label)}</strong></p>
            <div class="feedback-explanation">${escapeHTML(question.explanation || question.penjelasan || "")}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  }

  const pointsEl = $("quizPoints");
  if (pointsEl) pointsEl.textContent = quizPoints;

  if (nextBtn) {
    nextBtn.classList.remove("hidden");
    nextBtn.focus();
  }
}

/**
 * Mengevaluasi jawaban clock_activity_drop: Cek apakah keterangan waktu kegiatan yang dipasang sesuai target
 * @param {Object} question
 */
function submitActivityDropAnswer(question) {
  if (quizAnswered || currentDroppedActivityTime === null) return;
  quizAnswered = true;
  stopQuestionTimer();

  const expAnswer = question.targetAnswer || (question.options && question.options[question.correct]) || (question.pilihan && question.pilihan[question.correct]);
  const isCorrect = currentDroppedActivityTime === expAnswer;

  const slot = $("timeActivityDropSlot");
  const submitBtn = $("btnActivityDropSubmit");
  const feedback = $("quizFeedback");
  const nextBtn = $("nextQuestionBtn");
  const hintBtn = $("hintBtn");
  const card = $("quizCard");

  if (hintBtn) hintBtn.disabled = true;
  if (submitBtn) submitBtn.disabled = true;

  document.querySelectorAll(".activity-time-chip").forEach((c) => {
    if (c.style) c.style.pointerEvents = "none";
    if (c.removeAttribute) c.removeAttribute("draggable");
  });

  if (isCorrect) {
    if (slot) slot.className = "clock-activity-drop-slot slot-correct has-value";
    if (submitBtn) submitBtn.className = "btn btn-game-primary btn-clock-submit clock-correct";

    quizCorrect++;
    quizStreak++;
    if (quizStreak > maxStreak) maxStreak = quizStreak;

    const speedBonus = Math.min(40, Math.round(questionTimeRemaining * 1.6));
    const streakBonus = quizStreak >= 2 ? (quizStreak - 1) * 20 : 0;
    const basePts = question.points || question.poin || 100;
    const earnedPoints = basePts + speedBonus + streakBonus;
    quizPoints += earnedPoints;

    if (quizStreak >= 2) {
      if (typeof playSound === "function") playSound("streak");
    } else {
      if (typeof playSound === "function") playSound("correct");
    }

    updateStreakBanner();

    let bonusMsg = "";
    if (speedBonus > 15 && streakBonus > 0) {
      bonusMsg = `Bonus Cepat (+${speedBonus}) & Streak (+${streakBonus})`;
    } else if (speedBonus > 15) {
      bonusMsg = `Bonus Kecepatan (+${speedBonus})`;
    } else if (streakBonus > 0) {
      bonusMsg = `Bonus Streak (+${streakBonus})`;
    }

    showFloatingScore(`+${earnedPoints}`, bonusMsg);

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-correct";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/check-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Tepat Sekali! (+${earnedPoints} Poin)</h4>
            <p>Waktu kegiatan adalah <strong>${escapeHTML(expAnswer)}</strong> — benar!</p>
            <div class="feedback-explanation">${escapeHTML(question.explanation || question.penjelasan || "")}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  } else {
    if (slot) slot.className = "clock-activity-drop-slot slot-wrong has-value";
    if (submitBtn) submitBtn.className = "btn btn-game-primary btn-clock-submit clock-wrong";
    quizStreak = 0;
    updateStreakBanner();

    if (card) {
      card.classList.remove("anim-quiz-shake");
      void card.offsetWidth;
      card.classList.add("anim-quiz-shake");
    }

    if (typeof playSound === "function") playSound("wrong");

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-wrong";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/x-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Pilihan Waktu Belum Tepat</h4>
            <p>Kamu memasang: <strong>${escapeHTML(currentDroppedActivityTime)}</strong> — waktu yang benar: <strong>${escapeHTML(expAnswer)}</strong></p>
            <div class="feedback-explanation">${escapeHTML(question.explanation || question.penjelasan || "")}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  }

  const pointsEl = $("quizPoints");
  if (pointsEl) pointsEl.textContent = quizPoints;

  if (nextBtn) {
    nextBtn.classList.remove("hidden");
    nextBtn.focus();
  }
}

/**
 * Mengevaluasi jawaban clock_drag: Cek apakah posisi jarum jam sesuai target
 * @param {Object} question
 */
function submitClockDragAnswer(question) {
  if (quizAnswered) return;
  if (!currentQuizClock || !currentQuizClock.getClockTime) return;

  quizAnswered = true;
  stopQuestionTimer();

  const { hour, minute } = currentQuizClock.getClockTime();
  const rawTargetH = question.targetHour ?? question.jam ?? question.hour ?? 12;
  const rawTargetM = question.targetMinute ?? question.menit ?? question.minute ?? 0;
  const targetH = (Number(rawTargetH) % 12) || 12;
  const targetM = Number(rawTargetM);
  const currentH = (hour % 12) || 12;

  const isCorrect = (currentH === targetH) && (minute === targetM);

  const feedback = $("quizFeedback");
  const nextBtn = $("nextQuestionBtn");
  const hintBtn = $("hintBtn");
  const card = $("quizCard");
  const submitBtn = document.querySelector(".btn-clock-submit");

  if (hintBtn) hintBtn.disabled = true;
  if (submitBtn) submitBtn.disabled = true;

  // Format waktu target & jawaban siswa
  const targetStr = `${String(rawTargetH).padStart(2, "0")}.${String(targetM).padStart(2, "0")}`;
  const answerStr = `${String(currentH).padStart(2, "0")}.${String(minute).padStart(2, "0")}`;
  const expl = question.explanation || question.penjelasan || `Pukul ${targetStr} artinya jarum pendek menunjuk angka ${rawTargetH} dan jarum panjang di angka ${targetM === 0 ? 12 : Math.round(targetM / 5)}.`;

  if (isCorrect) {
    if (submitBtn) submitBtn.className = "btn btn-game-primary btn-clock-submit clock-correct";
    quizCorrect++;
    quizStreak++;
    if (quizStreak > maxStreak) maxStreak = quizStreak;

    const speedBonus = Math.min(40, Math.round(questionTimeRemaining * 1.6));
    const streakBonus = quizStreak >= 2 ? (quizStreak - 1) * 20 : 0;
    const earnedPoints = (question.points || question.poin || 100) + speedBonus + streakBonus;
    quizPoints += earnedPoints;

    if (quizStreak >= 2) {
      if (typeof playSound === "function") playSound("streak");
    } else {
      if (typeof playSound === "function") playSound("correct");
    }

    updateStreakBanner();

    let bonusMsg = "";
    if (speedBonus > 15 && streakBonus > 0) {
      bonusMsg = `Bonus Cepat (+${speedBonus}) & Streak (+${streakBonus})`;
    } else if (speedBonus > 15) {
      bonusMsg = `Bonus Kecepatan (+${speedBonus})`;
    } else if (streakBonus > 0) {
      bonusMsg = `Bonus Streak (+${streakBonus})`;
    }

    showFloatingScore(`+${earnedPoints}`, bonusMsg);

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-correct";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/check-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Posisi Jarum Tepat! (+${earnedPoints} Poin)</h4>
            <p>Kamu mengatur jarum ke <strong>${answerStr}</strong> — benar!</p>
            <div class="feedback-explanation">${escapeHTML(expl)}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  } else {
    if (submitBtn) submitBtn.className = "btn btn-game-primary btn-clock-submit clock-wrong";
    quizStreak = 0;
    updateStreakBanner();

    if (card) {
      card.classList.remove("anim-quiz-shake");
      void card.offsetWidth;
      card.classList.add("anim-quiz-shake");
    }

    if (typeof playSound === "function") playSound("wrong");

    // Animasikan jarum ke posisi yang benar
    if (currentQuizClock && currentQuizClock.setClockTime) {
      setTimeout(() => {
        currentQuizClock.setClockTime(rawTargetH, targetM, true);
      }, 600);
    }

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-wrong";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/x-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Posisi Jarum Belum Tepat</h4>
            <p>Kamu mengatur: <strong>${answerStr}</strong> — jawaban yang benar: <strong>${targetStr}</strong></p>
            <div class="feedback-explanation">${escapeHTML(expl)}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  }

  const pointsEl = $("quizPoints");
  if (pointsEl) pointsEl.textContent = quizPoints;

  if (nextBtn) {
    nextBtn.classList.remove("hidden");
    nextBtn.focus();
  }
}

/**
 * Menangani pemilihan jawaban oleh siswa (Evaluasi, Poin, Combo & Umpan Balik)
 * @param {number} index 
 * @param {HTMLButtonElement} button 
 * @param {Object} question 
 */
function selectAnswer(index, button, question) {
  if (quizAnswered) return;
  quizAnswered = true;
  stopQuestionTimer();

  const isCorrect = index === question.correct;
  const feedback = $("quizFeedback");
  const nextBtn = $("nextQuestionBtn");
  const hintBtn = $("hintBtn");
  const card = $("quizCard");

  if (hintBtn) hintBtn.disabled = true;

  // Nonaktifkan semua opsi jawaban dan sorot jawaban yang benar
  document.querySelectorAll(".answer-btn").forEach((btn, i) => {
    btn.disabled = true;
    if (i === question.correct) {
      btn.classList.add("correct");
    }
  });

  if (isCorrect) {
    button.classList.add("selected-correct");
    quizCorrect++;
    quizStreak++;
    if (quizStreak > maxStreak) maxStreak = quizStreak;

    // Bonus kecepatan (hingga +40 poin jika dijawab cepat)
    const speedBonus = Math.min(40, Math.round(questionTimeRemaining * 1.6));
    // Bonus streak combo bertingkat
    const streakBonus = quizStreak >= 2 ? (quizStreak - 1) * 20 : 0;
    const earnedPoints = 100 + speedBonus + streakBonus;

    quizPoints += earnedPoints;

    if (quizStreak >= 2) {
      if (typeof playSound === "function") playSound("streak");
    } else {
      if (typeof playSound === "function") playSound("correct");
    }

    updateStreakBanner();

    let bonusMsg = "";
    if (speedBonus > 15 && streakBonus > 0) {
      bonusMsg = `Bonus Cepat (+${speedBonus}) & Streak (+${streakBonus})`;
    } else if (speedBonus > 15) {
      bonusMsg = `Bonus Kecepatan (+${speedBonus})`;
    } else if (streakBonus > 0) {
      bonusMsg = `Bonus Streak (+${streakBonus})`;
    }

    showFloatingScore(`+${earnedPoints}`, bonusMsg);

    if (feedback) {
      const compliments = ["Jawaban Tepat!", "Benar Sekali!", "Pilihan Benar!"];
      const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];

      feedback.className = "quiz-feedback-quizizz feedback-correct";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/check-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>${randomCompliment} (+${earnedPoints} Poin)</h4>
            <div class="feedback-explanation">${escapeHTML(question.explanation)}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  } else {
    button.classList.add("wrong");
    quizStreak = 0;
    updateStreakBanner();

    if (card) {
      card.classList.remove("anim-quiz-shake");
      void card.offsetWidth;
      card.classList.add("anim-quiz-shake");
    }

    if (typeof playSound === "function") playSound("wrong");

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-wrong";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/x-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Jawaban Belum Tepat</h4>
            <p>Jawaban yang benar: <strong>${escapeHTML(question.options[question.correct])}</strong></p>
            <div class="feedback-explanation">${escapeHTML(question.explanation)}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  }

  const pointsEl = $("quizPoints");
  if (pointsEl) pointsEl.textContent = quizPoints;

  if (nextBtn) {
    nextBtn.classList.remove("hidden");
    nextBtn.focus();
  }
}

/**
 * Menampilkan petunjuk soal (Hint) dengan konsekuensi pengurangan 30 poin
 */
function useHint() {
  if (quizAnswered || hintUsedThisQuestion) return;

  const question = currentQuizQuestions[currentQuestionIndex];
  if (!question) return;

  hintUsedThisQuestion = true;
  quizHints++;
  quizPoints = Math.max(0, quizPoints - 30);

  const pointsEl = $("quizPoints");
  if (pointsEl) pointsEl.textContent = quizPoints;

  const hintBox = $("hintBox");
  if (hintBox) {
    hintBox.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:8px;">
        <img src="assets/icons/lightbulb.svg" width="20" height="20" alt="" style="margin-top:2px;">
        <div>
          <strong>Petunjuk Misi:</strong> ${escapeHTML(question.hint)}
        </div>
      </div>
    `;
    hintBox.classList.remove("hidden");
  }

  const hintBtn = $("hintBtn");
  if (hintBtn) hintBtn.disabled = true;

  playSound("hint");
  showToast("Petunjuk dibuka! Poin berkurang 30.", "error");
}

/**
 * Menyelesaikan kuis dan menghitung hasil akhir
 */
function finishQuiz() {
  const total = currentQuizQuestions.length;
  const score = total > 0 ? Math.round((quizCorrect / total) * 100) : 0;

  const stars =
    score >= 90 ? 3 :
    score >= 70 ? 2 :
    score >= 50 ? 1 : 0;

  const bonus = 50;
  quizPoints += bonus;

  // Buka level berikutnya pada akun siswa
  const levelIds = [...new Set(currentQuizQuestions.map(q => q.level))];
  if (!currentStudent.completedLevels) {
    currentStudent.completedLevels = [];
  }

  levelIds.forEach(levelId => {
    if (!currentStudent.completedLevels.includes(levelId)) {
      currentStudent.completedLevels.push(levelId);
      currentStudent.stars = (currentStudent.stars || 0) + stars;
    }
  });

  currentStudent.points = (currentStudent.points || 0) + quizPoints;
  currentStudent.lastScore = score;
  currentStudent.lastCorrect = quizCorrect;
  currentStudent.lastTotal = total;
  currentStudent.lastHints = quizHints;
  currentStudent.lastPlayed = Date.now();
  currentStudent.materialProgress = 100;

  lastResult = {
    score: score,
    points: quizPoints,
    correct: quizCorrect,
    total: total,
    hints: quizHints,
    stars: stars
  };

  saveCurrentStudent();
  renderResult();
  showStudentPage("resultScreen");
  playSound("victory");
}

/**
 * Merender layar hasil akhir kuis
 */
function renderResult() {
  if (!lastResult || !currentStudent) return;

  const result = lastResult;

  const resTitle = $("resultTitle");
  const resScore = $("resultScore");
  const resCorrect = $("resultCorrect");
  const resPoints = $("resultPoints");
  const resHints = $("resultHints");
  const resStars = $("resultStars");
  const resMsg = $("resultMessage");

  if (resTitle) {
    if (result.score >= 80) {
      resTitle.textContent = "Hebat Sekali, " + currentStudent.name + "!";
    } else if (result.score >= 60) {
      resTitle.textContent = "Bagus, " + currentStudent.name + "!";
    } else {
      resTitle.textContent = "Tetap Semangat, " + currentStudent.name + "!";
    }
  }

  if (resScore) {
    resScore.textContent = result.score;
    resScore.className = "result-score-value " + (result.score >= 80 ? "score-high" : result.score >= 60 ? "score-med" : "score-low");
  }

  if (resCorrect) resCorrect.textContent = result.correct + " / " + result.total;
  if (resPoints) resPoints.textContent = result.points;
  if (resHints) resHints.textContent = result.hints;

  if (resStars) {
    let starsHtml = "";
    for (let i = 0; i < 3; i++) {
      if (i < result.stars) {
        starsHtml += `<img src="assets/icons/star-gold.svg" class="result-star" width="44" height="44" alt="Bintang Emas">`;
      } else {
        starsHtml += `<img src="assets/icons/star-empty.svg" class="result-star empty" width="44" height="44" alt="Bintang Kosong">`;
      }
    }
    resStars.innerHTML = starsHtml;
  }

  if (resMsg) {
    if (result.score >= 90) {
      resMsg.textContent = "Luar biasa! Kamu sangat mahir membaca waktu dan durasi jam!";
    } else if (result.score >= 70) {
      resMsg.textContent = "Bagus sekali! Terus berlatih agar semakin cepat membaca jam!";
    } else {
      resMsg.textContent = "Tetap semangat! Pelajari materi lagi dan coba kuis kembali.";
    }
  }
}

/**
 * Inisialisasi event listener kuis
 */
function initQuizEvents() {
  const hintBtn = $("hintBtn");
  if (hintBtn) {
    hintBtn.addEventListener("click", useHint);
  }

  const nextBtn = $("nextQuestionBtn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentQuestionIndex++;
      renderQuestion();
    });
  }

  const quizHomeBtn = $("quizHomeBtn");
  if (quizHomeBtn) {
    quizHomeBtn.addEventListener("click", () => {
      if (!quizAnswered && currentQuestionIndex < currentQuizQuestions.length) {
        const confirmLeave = confirm("Kuis sedang berjalan. Yakin ingin kembali ke beranda?");
        if (!confirmLeave) return;
      }
      showStudentPage("homeScreen");
      renderHome();
    });
  }

  const resHomeBtn = $("resultHomeBtn");
  if (resHomeBtn) {
    resHomeBtn.addEventListener("click", () => {
      showStudentPage("homeScreen");
      renderHome();
    });
  }

  const retryBtn = $("retryQuizBtn");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      startQuiz(currentMaterialLevel);
    });
  }

  const resLeaderboardBtn = $("resultLeaderboardBtn");
  if (resLeaderboardBtn) {
    resLeaderboardBtn.addEventListener("click", () => {
      if (typeof renderLeaderboard === "function") {
        renderLeaderboard();
      }
      showStudentPage("leaderboardScreen");
    });
  }
}
