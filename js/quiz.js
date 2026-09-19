/* =========================================================
   TIME QUEST
   quiz.js - Sistem Kuis Interaktif Matematika Jam & Waktu
   ========================================================= */

"use strict";

const QUESTIONS = [
  /* LEVEL 1 */
  {
    level: 1,
    type: "mcq",
    question: "Jarum panjang pada jam menunjukkan angka 12. Apa artinya?",
    options: [
      "Menit 15",
      "Menit 30",
      "Menit 00",
      "Menit 45"
    ],
    correct: 2,
    hint: "Jarum panjang di angka 12 berarti tepat satu jam.",
    explanation: "Angka 12 pada jarum panjang menunjukkan menit 00."
  },
  {
    level: 1,
    type: "clock",
    hour: 3,
    minute: 0,
    question: "Pukul berapakah waktu yang ditunjukkan jam berikut?",
    options: [
      "02.00",
      "03.00",
      "03.30",
      "12.03"
    ],
    correct: 1,
    hint: "Jarum panjang di 12 berarti menit 00.",
    explanation: "Jarum pendek di 3 dan jarum panjang di 12 menunjukkan pukul 03.00."
  },
  {
    level: 1,
    type: "clock",
    hour: 6,
    minute: 0,
    question: "Jam menunjukkan jarum pendek di angka 6 dan jarum panjang di angka 12. Waktunya adalah...",
    options: [
      "06.00",
      "12.06",
      "06.30",
      "05.00"
    ],
    correct: 0,
    hint: "Jarum pendek menunjukkan jam.",
    explanation: "Jarum pendek di 6 dan jarum panjang di 12 berarti pukul 06.00."
  },

  /* LEVEL 2 */
  {
    level: 2,
    type: "clock",
    hour: 9,
    minute: 0,
    question: "Jam analog menunjukkan pukul berapa?",
    options: [
      "08.00",
      "09.00",
      "09.30",
      "12.09"
    ],
    correct: 1,
    hint: "Jarum panjang berada di 12.",
    explanation: "Jarum pendek di 9 menunjukkan pukul 09.00."
  },
  {
    level: 2,
    type: "mcq",
    question: "Pukul 07.00 dibaca sebagai...",
    options: [
      "Setengah tujuh",
      "Pukul tujuh tepat",
      "Pukul delapan tepat",
      "Pukul tujuh lewat tiga puluh menit"
    ],
    correct: 1,
    hint: "Angka setelah titik menunjukkan menit.",
    explanation: "07.00 berarti pukul tujuh tepat."
  },
  {
    level: 2,
    type: "clock",
    hour: 2,
    minute: 30,
    question: "Jarum panjang berada di angka 6 dan jarum pendek di antara 2 dan 3. Waktunya adalah...",
    options: [
      "02.00",
      "03.30",
      "02.30",
      "06.02"
    ],
    correct: 2,
    hint: "Angka 6 pada jarum panjang berarti 30 menit.",
    explanation: "Jarum pendek di antara 2 dan 3 menunjukkan pukul 02.30."
  },

  /* LEVEL 3 */
  {
    level: 3,
    type: "mcq",
    question: "Satu jam sama dengan berapa menit?",
    options: [
      "30 menit",
      "45 menit",
      "60 menit",
      "100 menit"
    ],
    correct: 2,
    hint: "Satu jam terdiri dari enam puluh menit.",
    explanation: "1 jam = 60 menit."
  },
  {
    level: 3,
    type: "mcq",
    question: "Setengah jam sama dengan...",
    options: [
      "15 menit",
      "20 menit",
      "30 menit",
      "60 menit"
    ],
    correct: 2,
    hint: "Setengah dari 60 menit.",
    explanation: "60 ÷ 2 = 30 menit."
  },
  {
    level: 3,
    type: "mcq",
    question: "Pukul 08.00 sampai 09.00 adalah berapa lama?",
    options: [
      "30 menit",
      "1 jam",
      "2 jam",
      "15 menit"
    ],
    correct: 1,
    hint: "Hitung selisih jam 8 dan jam 9.",
    explanation: "Dari pukul 08.00 sampai 09.00 adalah 1 jam."
  },

  /* LEVEL 4 */
  {
    level: 4,
    type: "mcq",
    question: "Kegiatan manakah yang biasanya dilakukan pada pagi hari?",
    options: [
      "Tidur malam",
      "Sarapan",
      "Makan malam",
      "Tidur tengah malam"
    ],
    correct: 1,
    hint: "Pagi hari biasanya sebelum berangkat sekolah.",
    explanation: "Sarapan biasanya dilakukan pada pagi hari."
  },
  {
    level: 4,
    type: "mcq",
    question: "Urutan waktu yang benar adalah...",
    options: [
      "Malam → Pagi → Siang → Sore",
      "Pagi → Siang → Sore → Malam",
      "Siang → Malam → Pagi → Sore",
      "Sore → Pagi → Malam → Siang"
    ],
    correct: 1,
    hint: "Mulai dari saat matahari terbit.",
    explanation: "Urutan umum waktu adalah pagi, siang, sore, lalu malam."
  },
  {
    level: 4,
    type: "mcq",
    question: "Ani mulai belajar pukul 07.00 dan selesai pukul 08.00. Berapa lama Ani belajar?",
    options: [
      "30 menit",
      "1 jam",
      "2 jam",
      "3 jam"
    ],
    correct: 1,
    hint: "08 dikurangi 07.",
    explanation: "08.00 − 07.00 = 1 jam."
  },

  /* LEVEL 5 */
  {
    level: 5,
    type: "mcq",
    question: "Budi bermain dari pukul 15.00 sampai 15.30. Lama bermain Budi adalah...",
    options: [
      "15 menit",
      "20 menit",
      "30 menit",
      "1 jam"
    ],
    correct: 2,
    hint: "Angka 30 menunjukkan setengah jam.",
    explanation: "Dari 15.00 sampai 15.30 adalah 30 menit."
  },
  {
    level: 5,
    type: "mcq",
    question: "Siti mulai membaca pukul 09.00 selama 2 jam. Pukul berapa Siti selesai membaca?",
    options: [
      "09.30",
      "10.00",
      "11.00",
      "12.00"
    ],
    correct: 2,
    hint: "Tambahkan 2 jam dari pukul 09.00.",
    explanation: "09.00 + 2 jam = 11.00."
  },
  {
    level: 5,
    type: "mcq",
    question: "Ayah berangkat pukul 06.30 dan tiba pukul 07.00. Berapa lama perjalanan Ayah?",
    options: [
      "15 menit",
      "30 menit",
      "1 jam",
      "2 jam"
    ],
    correct: 1,
    hint: "Hitung dari menit 30 ke menit 60.",
    explanation: "Dari 06.30 sampai 07.00 adalah 30 menit."
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
  if (quizQuestionEl) quizQuestionEl.textContent = question.question;

  if (hintBox) {
    hintBox.classList.add("hidden");
    hintBox.textContent = "";
  }

  if (quizFeedback) {
    quizFeedback.className = "quiz-feedback hidden";
    quizFeedback.textContent = "";
  }

  if (nextBtn) nextBtn.classList.add("hidden");
  if (hintBtn) hintBtn.disabled = false;

  renderQuestionIllustration(question);
  renderAnswers(question);
}

/**
 * Merender ilustrasi jam analog jika tipe soal adalah "clock"
 * @param {Object} question 
 */
function renderQuestionIllustration(question) {
  const illustration = $("questionIllustration");
  if (!illustration) return;

  illustration.innerHTML = "";

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

  const clock = createClock(hour ?? 12, minute ?? 0, 230);
  illustration.appendChild(clock);
}

/**
 * Membuat elemen visual jam analog dinamis
 * @param {number} hour 
 * @param {number} minute 
 * @param {number} size 
 * @returns {HTMLElement} Elemen jam analog
 */
function createClock(hour, minute, size = 250) {
  const face = document.createElement("div");
  face.className = "clock-face";
  face.style.width = size + "px";
  face.style.height = size + "px";
  face.style.maxWidth = "100%";

  // 60 Tanda Menit Dial (Alat peraga matematika sekolah asli)
  for (let m = 0; m < 60; m++) {
    const tick = document.createElement("div");
    tick.className = (m % 5 === 0) ? "clock-tick major" : "clock-tick minor";
    tick.style.setProperty("--tick-angle", (m * 6) + "deg");
    face.appendChild(tick);
  }

  for (let number = 1; number <= 12; number++) {
    const wrapper = document.createElement("div");
    wrapper.className = "clock-number";
    wrapper.style.setProperty("--angle", (number * 30) + "deg");

    const span = document.createElement("span");
    span.textContent = number;
    wrapper.appendChild(span);

    face.appendChild(wrapper);
  }

  const hourHand = document.createElement("div");
  hourHand.className = "clock-hand hour-hand";

  const minuteHand = document.createElement("div");
  minuteHand.className = "clock-hand minute-hand";

  const center = document.createElement("div");
  center.className = "clock-center";

  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;

  hourHand.style.transform = "translateX(-50%) rotate(" + hourAngle + "deg)";
  minuteHand.style.transform = "translateX(-50%) rotate(" + minuteAngle + "deg)";

  face.appendChild(hourHand);
  face.appendChild(minuteHand);
  face.appendChild(center);

  return face;
}

/**
 * Merender pilihan jawaban (A, B, C, D)
 * @param {Object} question 
 */
function renderAnswers(question) {
  const grid = $("answerGrid");
  if (!grid) return;

  grid.innerHTML = "";
  const letters = ["A", "B", "C", "D"];

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";

    button.innerHTML = `
      <span class="answer-letter">${letters[index]}</span>
      <span class="answer-text">${escapeHTML(option)}</span>
    `;

    button.addEventListener("click", () => {
      selectAnswer(index, button, question);
    });

    grid.appendChild(button);
  });
}

/**
 * Menangani pemilihan jawaban oleh siswa
 * @param {number} index 
 * @param {HTMLButtonElement} button 
 * @param {Object} question 
 */
function selectAnswer(index, button, question) {
  if (quizAnswered) return;
  quizAnswered = true;

  const isCorrect = index === question.correct;
  const feedback = $("quizFeedback");
  const nextBtn = $("nextQuestionBtn");
  const hintBtn = $("hintBtn");

  if (hintBtn) hintBtn.disabled = true;

  // Nonaktifkan semua opsi jawaban
  document.querySelectorAll(".answer-btn").forEach((btn, i) => {
    btn.disabled = true;
    if (i === question.correct) {
      btn.classList.add("correct");
    }
  });

  if (isCorrect) {
    button.classList.add("correct");
    quizCorrect++;
    quizPoints += 100;
    playSound("correct");

    if (feedback) {
      feedback.className = "quiz-feedback feedback-correct";
      feedback.innerHTML = `
        <div style="display:flex;align-items:flex-start;gap:10px;">
          <img src="assets/icons/check-circle.svg" width="22" height="22" alt="" style="margin-top:2px;">
          <div>
            <strong>Jawabanmu Tepat Sekali!</strong> (+100 Poin)
            <div style="margin-top:4px;font-weight:600;">${escapeHTML(question.explanation)}</div>
          </div>
        </div>
      `;
      feedback.classList.remove("hidden");
    }
  } else {
    button.classList.add("wrong");
    playSound("wrong");

    if (feedback) {
      feedback.className = "quiz-feedback feedback-wrong";
      feedback.innerHTML = `
        <div style="display:flex;align-items:flex-start;gap:10px;">
          <img src="assets/icons/x-circle.svg" width="22" height="22" alt="" style="margin-top:2px;">
          <div>
            <strong>Belum Tepat, Mari Pelajari:</strong>
            <div style="margin-top:4px;font-weight:600;">${escapeHTML(question.explanation)}</div>
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

  if (resTitle) resTitle.textContent = "Hebat, " + currentStudent.name + "!";
  if (resScore) resScore.textContent = result.score;
  if (resCorrect) resCorrect.textContent = result.correct + " / " + result.total;
  if (resPoints) resPoints.textContent = result.points;
  if (resHints) resHints.textContent = result.hints;

  if (resStars) {
    let starsHtml = "";
    for (let i = 0; i < 3; i++) {
      if (i < result.stars) {
        starsHtml += `<img src="assets/icons/star-gold.svg" class="result-star" width="40" height="40" alt="Bintang Emas">`;
      } else {
        starsHtml += `<img src="assets/icons/star-empty.svg" class="result-star empty" width="40" height="40" alt="Bintang Kosong">`;
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
