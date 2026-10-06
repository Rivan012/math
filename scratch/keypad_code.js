
function createTimeInputKeypadWidget(question) {
  const container = document.createElement("div");
  container.className = "time-keypad-container";
  container.innerHTML = `
    <div class="time-keypad-layout">
      <!-- Kiri: Input Jam & Menit -->
      <div class="time-inputs-area">
        <div class="time-inputs-row">
          <div class="time-input-group">
            <label>Jam</label>
            <input type="text" id="keypadInputHour" class="time-keypad-input" placeholder="--" readonly tabindex="-1">
          </div>
          <div class="time-input-sep">:</div>
          <div class="time-input-group">
            <label>Menit</label>
            <input type="text" id="keypadInputMinute" class="time-keypad-input" placeholder="--" readonly tabindex="-1">
          </div>
        </div>
        <button type="button" id="btnKeypadSubmit" class="btn btn-game-primary btn-clock-submit" style="margin-top:20px; width:100%;">
          <img src="assets/icons/check-circle.svg" width="22" height="22" alt="">
          <span>Jawab</span>
        </button>
      </div>

      <!-- Kanan: Numpad Virtual -->
      <div class="time-numpad-area">
        <div class="numpad-grid">
          <button type="button" class="numpad-btn" data-key="1">1</button>
          <button type="button" class="numpad-btn" data-key="2">2</button>
          <button type="button" class="numpad-btn" data-key="3">3</button>
          <button type="button" class="numpad-btn" data-key="4">4</button>
          <button type="button" class="numpad-btn" data-key="5">5</button>
          <button type="button" class="numpad-btn" data-key="6">6</button>
          <button type="button" class="numpad-btn" data-key="7">7</button>
          <button type="button" class="numpad-btn" data-key="8">8</button>
          <button type="button" class="numpad-btn" data-key="9">9</button>
          <button type="button" class="numpad-btn numpad-btn-focus" data-key="next">➔</button>
          <button type="button" class="numpad-btn" data-key="0">0</button>
          <button type="button" class="numpad-btn numpad-btn-del" data-key="del">⌫</button>
        </div>
      </div>
    </div>
  `;

  let activeInput = "hour"; // 'hour' atau 'minute'
  let hourVal = "";
  let minuteVal = "";

  setTimeout(() => {
    const elH = document.getElementById("keypadInputHour");
    const elM = document.getElementById("keypadInputMinute");
    if(elH) elH.classList.add("active");
    
    container.querySelectorAll(".numpad-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if(quizAnswered) return;
        const key = btn.dataset.key;
        if(typeof playSound === "function") playSound("tick");

        if (key === "next") {
          activeInput = activeInput === "hour" ? "minute" : "hour";
          if(elH) elH.classList.toggle("active", activeInput === "hour");
          if(elM) elM.classList.toggle("active", activeInput === "minute");
          return;
        }
        if (key === "del") {
          if (activeInput === "hour") {
            hourVal = hourVal.slice(0, -1);
          } else {
            minuteVal = minuteVal.slice(0, -1);
          }
        } else {
          if (activeInput === "hour") {
            if (hourVal.length < 2) hourVal += key;
          } else {
            if (minuteVal.length < 2) minuteVal += key;
          }
        }
        if(elH) elH.value = hourVal;
        if(elM) elM.value = minuteVal;
        
        // Auto switch to minute when hour has 2 digits
        if(activeInput === "hour" && hourVal.length === 2) {
          activeInput = "minute";
          if(elH) elH.classList.remove("active");
          if(elM) elM.classList.add("active");
        }
      });
    });

    const submitBtn = document.getElementById("btnKeypadSubmit");
    if(submitBtn) {
      submitBtn.addEventListener("click", () => {
        submitKeyboardTimeAnswer(question, hourVal, minuteVal);
      });
    }

    // click to focus
    if(elH) elH.addEventListener("click", () => {
      if(quizAnswered) return;
      activeInput = "hour";
      elH.classList.add("active");
      if(elM) elM.classList.remove("active");
    });
    if(elM) elM.addEventListener("click", () => {
      if(quizAnswered) return;
      activeInput = "minute";
      elM.classList.add("active");
      if(elH) elH.classList.remove("active");
    });
  }, 0);

  return container;
}

function submitKeyboardTimeAnswer(question, hourVal, minuteVal) {
  if (quizAnswered) return;
  if (!hourVal || !minuteVal) {
    if (typeof showToast === "function") showToast("Silakan isi jam dan menit terlebih dahulu!");
    return;
  }

  const expHour = String(question.targetHour || (question.hour !== undefined ? String(question.hour).padStart(2, "0") : "12")).padStart(2, "0");
  const expMinute = String(question.targetMinute !== undefined ? String(question.targetMinute).padStart(2, "0") : (question.minute !== undefined ? String(question.minute).padStart(2, "0") : "00")).padStart(2, "0");

  const isHourCorrect = hourVal.padStart(2, "0") === expHour;
  const isMinuteCorrect = minuteVal.padStart(2, "0") === expMinute;
  const isCorrect = isHourCorrect && isMinuteCorrect;

  const submitBtn = document.getElementById("btnKeypadSubmit");
  const feedback = document.getElementById("quizFeedback");
  const nextBtn = document.getElementById("nextQuestionBtn");
  const hintBtn = document.getElementById("hintBtn");

  const answerStr = \`\${hourVal.padStart(2, "0")}:\${minuteVal.padStart(2, "0")}\`;
  const targetStr = \`\${expHour}:\${expMinute}\`;

  if (isCorrect) {
    quizAnswered = true;
    stopQuestionTimer();
    if (hintBtn) hintBtn.disabled = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.className = "btn btn-game-primary btn-clock-submit clock-correct";
    }

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
      bonusMsg = \`Bonus Cepat (+\${speedBonus}) & Streak (+\${streakBonus})\`;
    } else if (speedBonus > 15) {
      bonusMsg = \`Bonus Kecepatan (+\${speedBonus})\`;
    } else if (streakBonus > 0) {
      bonusMsg = \`Bonus Streak (+\${streakBonus})\`;
    }

    showFloatingScore(\`+\${earnedPoints}\`, bonusMsg);

    const expl = question.explanation || question.penjelasan || \`Waktu yang benar adalah \${targetStr}.\`;

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-correct";
      feedback.innerHTML = \`
        <div class="feedback-quizizz-box">
          <img src="assets/icons/check-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Hebat! Jawaban Tepat (+\${earnedPoints} Poin)</h4>
            <p>Waktu yang ditunjukkan adalah <strong>\${answerStr}</strong> (Jam \${expHour} dan Menit \${expMinute}) — benar!</p>
            <div class="feedback-explanation">\${escapeHTML(expl)}</div>
          </div>
        </div>
      \`;
      feedback.classList.remove("hidden");
    }
    
    if (nextBtn) {
      nextBtn.classList.remove("hidden");
      nextBtn.focus();
    }
  } else {
    currentWrongAttempts++;
    quizStreak = 0;
    updateStreakBanner();
    if (typeof playSound === "function") playSound("wrong");

    const card = document.getElementById("quizCard");
    if (card) {
      card.classList.remove("anim-quiz-shake");
      void card.offsetWidth;
      card.classList.add("anim-quiz-shake");
    }

    if (currentWrongAttempts < 3) {
      if (feedback) {
        feedback.className = "quiz-feedback-quizizz feedback-wrong";
        feedback.innerHTML = \`
          <div class="feedback-quizizz-box">
            <img src="assets/icons/x-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
            <div>
              <h4>Jawaban Belum Tepat</h4>
              <p>Jawaban <strong>\${answerStr}</strong> salah. Kesempatan menjawab: \${3 - currentWrongAttempts} kali lagi.</p>
            </div>
          </div>
        \`;
        feedback.classList.remove("hidden");
      }
    } else {
      quizAnswered = true;
      stopQuestionTimer();
      if (hintBtn) hintBtn.disabled = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.className = "btn btn-game-primary btn-clock-submit clock-wrong";
      }

      const expl = question.explanation || question.penjelasan || \`Waktu yang benar adalah \${targetStr}.\`;

      if (feedback) {
        feedback.className = "quiz-feedback-quizizz feedback-wrong";
        feedback.innerHTML = \`
          <div class="feedback-quizizz-box">
            <img src="assets/icons/x-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
            <div>
              <h4>Kesempatan Habis</h4>
              <p>Jawaban yang benar adalah <strong>\${targetStr}</strong> (Jam \${expHour} dan Menit \${expMinute})</p>
              <div class="feedback-explanation">\${escapeHTML(expl)}</div>
            </div>
          </div>
        \`;
        feedback.classList.remove("hidden");
      }

      if (nextBtn) {
        nextBtn.classList.remove("hidden");
        nextBtn.focus();
      }
    }
  }

  const pointsEl = document.getElementById("quizPoints");
  if (pointsEl) pointsEl.textContent = quizPoints;
}

