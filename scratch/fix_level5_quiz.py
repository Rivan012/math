import re

def insert_after(code, search_str, insert_str):
    idx = code.find(search_str)
    if idx == -1: return code
    idx += len(search_str)
    return code[:idx] + insert_str + code[idx:]

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add global state for Level 5 match
global_state = """
// State untuk soal tipe match (Level 5)
let currentMatchAnswers = {};
"""
if "let currentMatchAnswers" not in code:
    code = insert_after(code, "let currentDroppedActivityTime = null;", global_state)


# 2. Add renderQuestionIllustration logic
ill_logic = """
  // === Level 5: Tipe Match (clock_match, activity_match, time_of_day_match) ===
  if (["clock_match", "activity_match", "time_of_day_match"].includes(question.type || question.tipe)) {
    currentMatchAnswers = {};
    illustration.appendChild(createMatchGridWidget(question));
    return;
  }
"""
code = insert_after(code, "currentQuizClock = null;\n", ill_logic)

# 3. Add createMatchGridWidget function
widget_func = """
function createMatchGridWidget(question) {
  const container = document.createElement("div");
  container.className = "match-grid-container";
  
  let items = [];
  if (question.type === "clock_match") items = question.clocks || [];
  else if (question.type === "activity_match") items = question.activities || [];
  else if (question.type === "time_of_day_match") items = question.scenes || [];

  container.innerHTML = `<div class="match-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin: 0 auto; max-width: 800px; padding: 10px;"></div>`;
  const grid = container.querySelector(".match-grid");

  items.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "match-card";
    card.style.cssText = `background: ${item.bg || '#fff'}; border: 2px solid ${item.borderColor || '#ccc'}; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05);`;

    const mediaContainer = document.createElement("div");
    mediaContainer.style.marginBottom = "10px";

    if (question.type === "clock_match") {
      const clockWrap = document.createElement("div");
      clockWrap.style.transform = "scale(0.6)";
      clockWrap.style.transformOrigin = "top center";
      clockWrap.style.height = "140px";
      const clock = createClock(item.hour, item.minute, 200, false, false);
      clockWrap.appendChild(clock);
      mediaContainer.appendChild(clockWrap);
    } else {
      if (item.img) {
        const img = document.createElement("img");
        img.src = item.img;
        img.style.cssText = "width: 100px; height: 100px; object-fit: contain; border-radius: 8px;";
        mediaContainer.appendChild(img);
      }
      if (item.label) {
        const label = document.createElement("div");
        label.textContent = item.label;
        label.style.cssText = "font-size: 13px; text-align: center; font-weight: 600; margin-top: 8px; color: #444;";
        mediaContainer.appendChild(label);
      }
    }

    card.appendChild(mediaContainer);

    // Drop Slot
    const slotId = `match_slot_${idx}`;
    const slot = document.createElement("div");
    slot.id = slotId;
    slot.className = "match-drop-slot";
    slot.dataset.slotId = idx;
    slot.style.cssText = "width: 100%; min-height: 40px; border: 2px dashed #aaa; border-radius: 8px; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; font-weight: 600; color: #666; cursor: pointer; padding: 4px; text-align: center;";
    slot.innerHTML = `<span class="slot-placeholder">Tarik Kesini</span>`;

    // Drop Events
    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
      slot.style.borderColor = "#F59E0B";
      slot.style.background = "#FEF3C7";
    });
    slot.addEventListener("dragleave", (e) => {
      e.preventDefault();
      slot.style.borderColor = "#aaa";
      slot.style.background = "rgba(255,255,255,0.7)";
    });
    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.style.borderColor = "#aaa";
      slot.style.background = "rgba(255,255,255,0.7)";
      if (quizAnswered) return;
      const val = e.dataTransfer.getData("text/plain");
      if (val) {
        placeMatchInSlot(idx, val, question);
        if (typeof playSound === "function") playSound("drop");
      }
    });
    
    // Click to clear
    slot.addEventListener("click", () => {
       if (quizAnswered) return;
       if (currentMatchAnswers[idx]) {
         currentMatchAnswers[idx] = null;
         updateMatchSlotUI(idx);
         updateMatchChipsState(question);
         if (typeof playSound === "function") playSound("tick");
       }
    });

    card.appendChild(slot);
    grid.appendChild(card);
  });

  return container;
}

function placeMatchInSlot(slotIdx, val, question) {
  // If the value is already in another slot, remove it from there
  for (const [sId, sVal] of Object.entries(currentMatchAnswers)) {
    if (sVal === val) {
      currentMatchAnswers[sId] = null;
      updateMatchSlotUI(sId);
    }
  }
  
  currentMatchAnswers[slotIdx] = val;
  updateMatchSlotUI(slotIdx);
  updateMatchChipsState(question);
}

function updateMatchSlotUI(slotIdx) {
  const slot = document.getElementById(`match_slot_${slotIdx}`);
  if (!slot) return;
  const val = currentMatchAnswers[slotIdx];
  if (val) {
    slot.innerHTML = `<div class="match-slotted-chip" style="background:#3B82F6; color:#fff; border-radius:6px; padding:4px 8px; font-size:14px; width:100%; box-sizing:border-box;">${escapeHTML(val)}</div>`;
    slot.style.borderStyle = "solid";
    slot.style.borderColor = "#3B82F6";
  } else {
    slot.innerHTML = `<span class="slot-placeholder">Tarik Kesini</span>`;
    slot.style.borderStyle = "dashed";
    slot.style.borderColor = "#aaa";
  }
}

function updateMatchChipsState(question) {
  const row = document.getElementById("matchChipsRow");
  if (!row) return;
  const usedValues = Object.values(currentMatchAnswers).filter(v => v);
  const chips = row.querySelectorAll(".match-drag-chip");
  
  let allFilled = true;
  let totalItems = 0;
  if (question.type === "clock_match") totalItems = question.clocks?.length || 0;
  else if (question.type === "activity_match") totalItems = question.activities?.length || 0;
  else if (question.type === "time_of_day_match") totalItems = question.scenes?.length || 0;

  let filledCount = 0;
  for (let i = 0; i < totalItems; i++) {
    if (currentMatchAnswers[i]) filledCount++;
  }

  chips.forEach(chip => {
    const v = chip.dataset.value;
    if (usedValues.includes(v)) {
      chip.classList.add("used-chip");
      chip.style.opacity = "0.4";
      chip.draggable = false;
    } else {
      chip.classList.remove("used-chip");
      chip.style.opacity = "1";
      chip.draggable = true;
    }
  });

  const submitBtn = document.getElementById("btnMatchSubmit");
  if (submitBtn) {
    submitBtn.disabled = (filledCount < totalItems);
  }
}
"""
code = insert_after(code, "function createTimeCompareWidget(question) {\n", widget_func + "\n")

# 4. Add renderAnswers logic
ans_logic = """
  // === Level 5: Tipe Match ===
  if (["clock_match", "activity_match", "time_of_day_match"].includes(question.type || question.tipe)) {
    grid.className = "match-answers-area";
    grid.style.cssText = "display: flex; flex-direction: column; align-items: center; gap: 16px;";

    const banner = document.createElement("div");
    banner.className = "match-instruction-banner";
    banner.innerHTML = `<span>Tarik (drag) pilihan waktu ke dalam kotak pada gambar di atas:</span>`;
    banner.style.cssText = "background: #EFF6FF; color: #1E3A8A; padding: 10px 16px; border-radius: 8px; font-weight: 600; width: 100%; text-align: center;";
    grid.appendChild(banner);

    const chipsRow = document.createElement("div");
    chipsRow.id = "matchChipsRow";
    chipsRow.style.cssText = "display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; width: 100%;";

    const colorClasses = ["chip-blue", "chip-green", "chip-amber", "chip-red", "chip-purple", "chip-indigo"];
    const rawOptions = question.options || question.pilihan || [];
    
    rawOptions.forEach((opt, idx) => {
      const chip = document.createElement("div");
      chip.className = `match-drag-chip activity-time-chip ${colorClasses[idx % colorClasses.length]}`;
      chip.style.cssText = "padding: 8px 16px; border-radius: 20px; font-weight: bold; cursor: grab; font-size: 15px; background: #3B82F6; color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);";
      chip.draggable = true;
      chip.dataset.value = opt;
      chip.innerHTML = `<span>${escapeHTML(opt)}</span>`;

      chip.addEventListener("dragstart", (e) => {
        if (quizAnswered || chip.classList.contains("used-chip")) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", opt);
        e.dataTransfer.effectAllowed = "move";
        if (typeof playSound === "function") playSound("tick");
      });
      
      // Click to place in first empty slot
      chip.addEventListener("click", () => {
         if (quizAnswered || chip.classList.contains("used-chip")) return;
         let totalItems = 0;
         if (question.type === "clock_match") totalItems = question.clocks?.length || 0;
         else if (question.type === "activity_match") totalItems = question.activities?.length || 0;
         else if (question.type === "time_of_day_match") totalItems = question.scenes?.length || 0;
         
         for(let i = 0; i < totalItems; i++) {
           if (!currentMatchAnswers[i]) {
             placeMatchInSlot(i, opt, question);
             if (typeof playSound === "function") playSound("drop");
             break;
           }
         }
      });

      chipsRow.appendChild(chip);
    });

    grid.appendChild(chipsRow);

    const submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.id = "btnMatchSubmit";
    submitBtn.className = "btn btn-game-primary btn-clock-submit";
    submitBtn.disabled = true;
    submitBtn.style.cssText = "margin-top: 16px; width: 100%; max-width: 300px; padding: 12px; border-radius: 12px; font-size: 18px;";
    submitBtn.innerHTML = `<img src="assets/icons/check-circle.svg" width="22" height="22" alt=""> <span>Jawab</span>`;
    submitBtn.addEventListener("click", () => {
      submitMatchAnswer(question);
    });

    grid.appendChild(submitBtn);
    return;
  }
"""
code = insert_after(code, "grid.innerHTML = \"\";\n", ans_logic)

# 5. Add submitMatchAnswer function
submit_func = """
function submitMatchAnswer(question) {
  if (quizAnswered) return;
  
  let items = [];
  if (question.type === "clock_match") items = question.clocks || [];
  else if (question.type === "activity_match") items = question.activities || [];
  else if (question.type === "time_of_day_match") items = question.scenes || [];
  
  let isCorrect = true;
  for (let i = 0; i < items.length; i++) {
    const userAns = currentMatchAnswers[i];
    const item = items[i];
    
    // Some questions might have altAnswers or single answer
    const validAnswers = item.altAnswers || [item.answer];
    if (!userAns || !validAnswers.includes(userAns)) {
      isCorrect = false;
      break;
    }
  }

  const submitBtn = document.getElementById("btnMatchSubmit");
  const feedback = document.getElementById("quizFeedback");
  const nextBtn = document.getElementById("nextQuestionBtn");
  const hintBtn = document.getElementById("hintBtn");

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
    if (speedBonus > 15 && streakBonus > 0) bonusMsg = `Bonus Cepat (+${speedBonus}) & Streak (+${streakBonus})`;
    else if (speedBonus > 15) bonusMsg = `Bonus Kecepatan (+${speedBonus})`;
    else if (streakBonus > 0) bonusMsg = `Bonus Streak (+${streakBonus})`;

    showFloatingScore(`+${earnedPoints}`, bonusMsg);

    const expl = question.explanation || question.penjelasan || `Semua pasangan sudah benar!`;

    if (feedback) {
      feedback.className = "quiz-feedback-quizizz feedback-correct";
      feedback.innerHTML = `
        <div class="feedback-quizizz-box">
          <img src="assets/icons/check-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
          <div>
            <h4>Hebat! Semua Tepat (+${earnedPoints} Poin)</h4>
            <div class="feedback-explanation">${escapeHTML(expl)}</div>
          </div>
        </div>
      `;
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
        feedback.innerHTML = `
          <div class="feedback-quizizz-box">
            <img src="assets/icons/x-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
            <div>
              <h4>Jawaban Belum Tepat</h4>
              <p>Ada pasangan yang salah. Kesempatan menjawab: ${3 - currentWrongAttempts} kali lagi.</p>
            </div>
          </div>
        `;
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

      // Highlight correct answers
      for (let i = 0; i < items.length; i++) {
        const slot = document.getElementById(`match_slot_${i}`);
        if (slot) {
          const correctAns = items[i].answer;
          slot.innerHTML = `<div class="match-slotted-chip" style="background:#10B981; color:#fff; border-radius:6px; padding:4px 8px; font-size:14px; width:100%; box-sizing:border-box;">${escapeHTML(correctAns)}</div>`;
          slot.style.borderStyle = "solid";
          slot.style.borderColor = "#10B981";
        }
      }

      const expl = question.explanation || question.penjelasan || `Waktu yang benar sudah ditampilkan di kotak.`;

      if (feedback) {
        feedback.className = "quiz-feedback-quizizz feedback-wrong";
        feedback.innerHTML = `
          <div class="feedback-quizizz-box">
            <img src="assets/icons/x-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
            <div>
              <h4>Kesempatan Habis</h4>
              <p>Berikut adalah pasangan yang benar.</p>
              <div class="feedback-explanation">${escapeHTML(expl)}</div>
            </div>
          </div>
        `;
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
"""
code += "\n" + submit_func + "\n"

with open('js/quiz.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Level 5 quiz logic added successfully.")
