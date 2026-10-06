import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

global_logic = """
// === LEVEL 5 CUSTOM DND UI ===
function getMatchItems(question) {
  let type = question.type || question.tipe;
  let items = [];
  if (type === "clock_match") items = question.clocks;
  else if (type === "activity_match") items = question.activities;
  else if (type === "time_of_day_match") items = question.scenes;

  if (!items || items.length === 0) {
    if (typeof DEFAULT_QUESTIONS !== "undefined") {
      const dq = DEFAULT_QUESTIONS.find(q => q.id === question.id);
      if (dq) {
        if (type === "clock_match") items = dq.clocks;
        else if (type === "activity_match") items = dq.activities;
        else if (type === "time_of_day_match") items = dq.scenes;
        if (!question.options && dq.options) question.options = dq.options;
      }
    }
  }
  return items || [];
}

window.level5State = {
  answers: { q1: {}, q2: {}, q3: {} },
  totalSolved: 0
};

function getQKey(question) {
  if ((question.type || question.tipe) === "clock_match") return "q1";
  if ((question.type || question.tipe) === "activity_match") return "q2";
  if ((question.type || question.tipe) === "time_of_day_match") return "q3";
  return "q1";
}

function createMatchGridWidget(question) {
  const container = document.createElement("div");
  container.className = "match-grid-container";
  
  const type = question.type || question.tipe;
  const items = getMatchItems(question);
  const qKey = getQKey(question);

  const stepperHtml = `
    <div class="level5-custom-stepper" style="display:flex; justify-content:center; align-items:center; gap:16px; margin-bottom:24px; font-size:12px; font-weight:700; color:#9CA3AF;">
      <div style="display:flex; align-items:center; gap:8px; color: ${type === 'clock_match' ? '#1F2937' : (Object.keys(window.level5State.answers.q1).length === 8 ? '#10B981' : '#9CA3AF')}">
        <div style="width:28px; height:28px; border-radius:14px; background:${type === 'clock_match' ? '#3B82F6' : (Object.keys(window.level5State.answers.q1).length === 8 ? '#10B981' : '#E5E7EB')}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:14px;">${Object.keys(window.level5State.answers.q1).length === 8 ? '✓' : '1'}</div>
        <span style="text-align:left;">Soal 1<br><span style="font-size:10px;font-weight:500;color:#6B7280;">Mencocokkan Jam</span></span>
      </div>
      <div style="width:40px; height:2px; background:#E5E7EB;"></div>
      <div style="display:flex; align-items:center; gap:8px; color: ${type === 'activity_match' ? '#1F2937' : (Object.keys(window.level5State.answers.q2).length === 4 ? '#10B981' : '#9CA3AF')}">
        <div style="width:28px; height:28px; border-radius:14px; background:${type === 'activity_match' ? '#3B82F6' : (Object.keys(window.level5State.answers.q2).length === 4 ? '#10B981' : '#E5E7EB')}; color:${type === 'activity_match' ? '#fff' : '#9CA3AF'}; display:flex; align-items:center; justify-content:center; font-size:14px;">${Object.keys(window.level5State.answers.q2).length === 4 ? '✓' : '2'}</div>
        <span style="text-align:left;">Soal 2<br><span style="font-size:10px;font-weight:500;color:#6B7280;">Kegiatan & Waktu</span></span>
      </div>
      <div style="width:40px; height:2px; background:#E5E7EB;"></div>
      <div style="display:flex; align-items:center; gap:8px; color: ${type === 'time_of_day_match' ? '#1F2937' : '#9CA3AF'}">
        <div style="width:28px; height:28px; border-radius:14px; background:${type === 'time_of_day_match' ? '#3B82F6' : '#E5E7EB'}; color:${type === 'time_of_day_match' ? '#fff' : '#9CA3AF'}; display:flex; align-items:center; justify-content:center; font-size:14px;">3</div>
        <span style="text-align:left;">Soal 3<br><span style="font-size:10px;font-weight:500;color:#6B7280;">Waktu dlm Sehari</span></span>
      </div>
    </div>
  `;

  let gridStyle = "display:grid; gap: 16px; margin: 0 auto; max-width: 800px; padding: 10px;";
  if (type === "clock_match") gridStyle += " grid-template-columns: repeat(4, 1fr);";
  else gridStyle += " grid-template-columns: repeat(4, 1fr);";

  const mainTitle = `<h2 style="text-align:center; font-size:20px; font-weight:800; color:#1F2937; margin-bottom:8px;">${escapeHTML(question.question)}</h2>
                     <p style="text-align:center; font-size:14px; color:#6B7280; margin-bottom:24px;">Tarik waktu yang sesuai ke dalam kotak${type==='clock_match'?' di bawah gambar jam.':(type==='activity_match'?' ke gambar kegiatan.':'!')}</p>`;

  container.innerHTML = stepperHtml + mainTitle + `<div class="match-grid" style="${gridStyle}"></div>`;
  const grid = container.querySelector(".match-grid");

  items.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "match-card";
    card.style.cssText = `background: #fff; border: 1.5px solid #E5E7EB; border-radius: 16px; display: flex; flex-direction: column; align-items: center; position: relative; overflow: hidden;`;

    const badgeLabel = type === 'activity_match' ? String.fromCharCode(65 + idx) : (idx + 1);
    const badge = document.createElement("div");
    badge.style.cssText = `position: absolute; top: 12px; left: 12px; width: 24px; height: 24px; border-radius: 12px; border: 1.5px solid #93C5FD; color: #2563EB; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: center; background: #EFF6FF; z-index: 2;`;
    badge.textContent = badgeLabel;
    card.appendChild(badge);

    const mediaContainer = document.createElement("div");
    mediaContainer.style.cssText = "width:100%; display:flex; flex-direction:column; align-items:center; padding: 32px 12px 16px 12px;";

    if (type === "clock_match") {
      const clockWrap = document.createElement("div");
      clockWrap.style.transform = "scale(0.9)";
      clockWrap.style.transformOrigin = "center center";
      clockWrap.style.height = "120px";
      const clock = createClock(item.hour, item.minute, 200, false, false);
      const colors = ["#F472B6", "#60A5FA", "#FBBF24", "#A78BFA", "#34D399", "#C084FC", "#FB923C", "#2DD4BF"];
      const clockCircle = clock.querySelector("circle");
      if(clockCircle) {
          clockCircle.setAttribute("stroke", colors[idx % colors.length]);
          clockCircle.setAttribute("stroke-width", "8");
      }
      clockWrap.appendChild(clock);
      mediaContainer.appendChild(clockWrap);
    } else {
      if (item.img) {
        const img = document.createElement("img");
        img.src = item.img;
        img.style.cssText = "width: 100%; height: 120px; object-fit: cover; border-radius: 8px;";
        mediaContainer.appendChild(img);
      }
      if (item.label) {
        const label = document.createElement("div");
        label.textContent = item.label;
        label.style.cssText = "font-size: 14px; text-align: center; font-weight: 700; margin-top: 16px; color: #1F2937;";
        mediaContainer.appendChild(label);
      }
    }

    card.appendChild(mediaContainer);

    const slotWrap = document.createElement("div");
    slotWrap.style.cssText = "width: 100%; padding: 0 16px 20px 16px; box-sizing: border-box;";
    
    const slot = document.createElement("div");
    slot.id = `match_slot_${idx}`;
    slot.className = "match-drop-slot";
    slot.dataset.slotId = idx;
    slot.style.cssText = "width: 100%; height: 44px; border: 2px dashed #9CA3AF; border-radius: 22px; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #9CA3AF; font-size: 14px; transition: all 0.2s;";
    slot.innerHTML = `<span class="slot-placeholder">Tarik ke sini</span>`;

    if (window.level5State.answers[qKey] && window.level5State.answers[qKey][idx]) {
        slot.classList.add("slot-correct");
        slot.style.borderStyle = "solid";
        slot.style.borderColor = "#10B981";
        slot.style.background = "#ECFDF5";
        const v = window.level5State.answers[qKey][idx];
        const disp = (type === 'time_of_day_match') ? `✓ ${v}` : v;
        slot.innerHTML = `<div style="color:#10B981;">${escapeHTML(disp)}</div>`;
    } else {
        slot.addEventListener("dragover", (e) => {
          if (slot.classList.contains("slot-correct")) return;
          e.preventDefault();
          slot.style.borderColor = "#3B82F6";
          slot.style.background = "#EFF6FF";
        });
        slot.addEventListener("dragleave", (e) => {
          if (slot.classList.contains("slot-correct")) return;
          e.preventDefault();
          slot.style.borderColor = "#9CA3AF";
          slot.style.background = "transparent";
        });
        slot.addEventListener("drop", (e) => {
          if (slot.classList.contains("slot-correct")) return;
          e.preventDefault();
          slot.style.borderColor = "#9CA3AF";
          slot.style.background = "transparent";
          const val = e.dataTransfer.getData("text/plain");
          if (val) window.handleMatchDrop(slot, val, question);
        });
    }

    slotWrap.appendChild(slot);
    card.appendChild(slotWrap);
    grid.appendChild(card);
  });

  return container;
}

window.handleMatchDrop = function(slot, val, question) {
  const type = question.type || question.tipe;
  const items = getMatchItems(question);
  const idx = parseInt(slot.dataset.slotId, 10);
  const item = items[idx];
  
  const validAnswers = item.altAnswers || [item.answer];
  const isCorrect = validAnswers.includes(val);
  
  if (isCorrect) {
      if (typeof playSound === "function") playSound("correct");
      slot.classList.add("slot-correct");
      slot.style.borderStyle = "solid";
      slot.style.borderColor = "#10B981";
      slot.style.background = "#ECFDF5";
      const disp = (type === 'time_of_day_match') ? `✓ ${val}` : val;
      slot.innerHTML = `<div style="color:#10B981; display:flex; align-items:center; gap:4px; font-weight:700;">${disp}</div>`;
      
      const qKey = getQKey(question);
      window.level5State.answers[qKey][idx] = val;
      window.level5State.totalSolved++;
      
      quizPoints += (question.points || 4);
      const pointsEl = document.getElementById("quizPoints");
      if (pointsEl) pointsEl.textContent = quizPoints;

      updateMatchChipsState(question);
  } else {
      if (typeof playSound === "function") playSound("wrong");
      slot.classList.remove("slot-wrong-shake");
      void slot.offsetWidth;
      slot.classList.add("slot-wrong-shake");
      slot.style.borderColor = "#EF4444";
      slot.style.background = "#FEF2F2";
      setTimeout(() => {
          if (!slot.classList.contains("slot-correct")) {
             slot.style.borderColor = "#9CA3AF";
             slot.style.background = "transparent";
          }
      }, 500);
  }
}

window.updateMatchChipsState = function(question) {
  const row = document.getElementById("matchChipsRow");
  if (!row) return;
  const qKey = getQKey(question);
  const usedValues = Object.values(window.level5State.answers[qKey]);
  const chips = row.querySelectorAll(".match-drag-chip");
  
  const items = getMatchItems(question);
  const totalItems = items.length;
  const filledCount = Object.keys(window.level5State.answers[qKey]).length;

  chips.forEach(chip => {
    const v = chip.dataset.value;
    if (usedValues.includes(v)) {
      chip.classList.add("used-chip");
      chip.style.opacity = "0.3";
      chip.style.pointerEvents = "none";
      chip.draggable = false;
    } else {
      chip.classList.remove("used-chip");
      chip.style.opacity = "1";
      chip.style.pointerEvents = "auto";
      chip.draggable = true;
    }
  });

  const submitBtn = document.getElementById("btnMatchSubmit");
  if (submitBtn) {
    if (filledCount >= totalItems) {
        submitBtn.style.display = "flex";
        submitBtn.disabled = false;
    } else {
        submitBtn.style.display = "none";
    }
  }
}

window.onMatchNextClick = function(question) {
  quizAnswered = true;
  stopQuestionTimer();
  const nextBtn = document.getElementById("nextQuestionBtn");
  if (nextBtn) nextBtn.click();
}

(function injectLevel5Styles() {
  if (document.getElementById("level5-styles")) return;
  const style = document.createElement("style");
  style.id = "level5-styles";
  style.innerHTML = `
    .slot-wrong-shake { animation: shake 0.4s ease-in-out; }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      50% { transform: translateX(5px); }
      75% { transform: translateX(-5px); }
    }
  `;
  document.head.appendChild(style);
})();
// === END LEVEL 5 CUSTOM DND UI ===
"""

# Insert global_logic after the initial declarations
if "let hintUsedThisQuestion" in code:
    code = code.replace("let hintUsedThisQuestion = false;", "let hintUsedThisQuestion = false;\n" + global_logic)

# Hook into renderQuestionIllustration
ill_hook = """  // === Level 5 Match Illustration Hook ===
  if (["clock_match", "activity_match", "time_of_day_match"].includes(question.type || question.tipe)) {
    illustration.appendChild(createMatchGridWidget(question));
    return;
  }
"""
code = code.replace("currentQuizClock = null;", "currentQuizClock = null;\n" + ill_hook)

# Hook into renderAnswers
ans_hook = """  // === Level 5 Match Answers Hook ===
  if (["clock_match", "activity_match", "time_of_day_match"].includes(question.type || question.tipe)) {
    grid.className = "match-answers-area";
    grid.style.cssText = "display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: 16px;";

    const optionsBox = document.createElement("div");
    optionsBox.style.cssText = "width: 100%; max-width: 800px; padding: 24px; border: 2px dashed #D1D5DB; border-radius: 16px; background: #F9FAFB; display: flex; flex-direction: column; align-items: center; gap: 16px;";

    const banner = document.createElement("div");
    banner.className = "match-instruction-banner";
    banner.innerHTML = `<span style="font-size:12px; font-weight:700; color:#6B7280; letter-spacing:1px;">PILIHAN WAKTU:</span>`;
    optionsBox.appendChild(banner);

    const chipsRow = document.createElement("div");
    chipsRow.id = "matchChipsRow";
    chipsRow.style.cssText = "display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; width: 100%;";

    const colorClasses = [
      { text: "#3B82F6", border: "#93C5FD", bg: "#EFF6FF" },
      { text: "#10B981", border: "#6EE7B7", bg: "#ECFDF5" },
      { text: "#F59E0B", border: "#FCD34D", bg: "#FFFBEB" },
      { text: "#EF4444", border: "#FCA5A5", bg: "#FEF2F2" },
      { text: "#8B5CF6", border: "#C4B5FD", bg: "#F5F3FF" },
      { text: "#06B6D4", border: "#67E8F9", bg: "#ECFEFF" },
      { text: "#111827", border: "#374151", bg: "#F3F4F6" },
      { text: "#111827", border: "#374151", bg: "#F3F4F6" },
    ];
    
    const solidColorClasses = [
      { text: "#D1D5DB", border: "#E5E7EB", bg: "#F3F4F6" }
    ];

    const rawOptions = question.options || question.pilihan || [];
    const type = question.type || question.tipe;
    const qKey = getQKey(question);
    const usedValues = Object.values(window.level5State.answers[qKey]);
    
    rawOptions.forEach((opt, idx) => {
      const chip = document.createElement("div");
      chip.className = "match-drag-chip activity-time-chip";
      
      const theme = (type === 'time_of_day_match') ? solidColorClasses[0] : colorClasses[idx % colorClasses.length];
      
      chip.style.cssText = `padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: grab; font-size: 14px; background: ${theme.bg}; color: ${theme.text}; border: 2px dashed ${theme.border}; box-shadow: none; font-family: monospace; display: flex; align-items: center; justify-content: center;`;
      
      if (usedValues.includes(opt)) {
        chip.classList.add("used-chip");
        chip.style.opacity = "0.3";
        chip.style.pointerEvents = "none";
        chip.draggable = false;
      } else {
        chip.draggable = true;
      }
      
      chip.dataset.value = opt;
      chip.innerHTML = `<span>${escapeHTML(opt)}</span>`;

      chip.addEventListener("dragstart", (e) => {
        if (quizAnswered || chip.classList.contains("used-chip")) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", opt);
        e.dataTransfer.effectAllowed = "move";
      });

      chipsRow.appendChild(chip);
    });

    optionsBox.appendChild(chipsRow);
    grid.appendChild(optionsBox);

    const submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.id = "btnMatchSubmit";
    
    let btnText = "Lanjut ke Soal 2 →";
    let isFinal = false;
    if (type === "activity_match") btnText = "Lanjut ke Soal 3 →";
    if (type === "time_of_day_match") { btnText = "Selesai & Lihat Hasil 🌟"; isFinal = true; }

    submitBtn.className = "btn";
    submitBtn.style.cssText = `margin-top: 24px; padding: 12px 32px; border-radius: 12px; font-size: 16px; font-weight: 700; color: #fff; border: none; cursor: pointer; display: none; background: ${isFinal ? '#F59E0B' : '#A78BFA'}; box-shadow: 0 4px 6px rgba(0,0,0,0.1);`;
    
    submitBtn.onmouseover = () => submitBtn.style.filter = "brightness(1.1)";
    submitBtn.onmouseout = () => submitBtn.style.filter = "brightness(1)";

    submitBtn.innerHTML = `<span>${btnText}</span>`;
    submitBtn.addEventListener("click", () => {
      if (isFinal) finishQuiz();
      else window.onMatchNextClick(question);
    });

    grid.appendChild(submitBtn);
    setTimeout(() => { updateMatchChipsState(question); }, 50);
    return;
  }
"""
code = code.replace("grid.innerHTML = \"\";", "grid.innerHTML = \"\";\n" + ans_hook)

with open('js/quiz.js', 'w', encoding='utf-8') as f:
    f.write(code)
