import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

ill_hook = """  // === Level 5 Match Illustration Hook ===
  if (["clock_match", "activity_match", "time_of_day_match"].includes(question.type || question.tipe)) {
    illustration.appendChild(createMatchGridWidget(question));
    return;
  }
"""

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

# Fix the global scope error
code = code.replace("let currentQuizClock = null;\n" + ill_hook, "let currentQuizClock = null;\n")
code = code.replace("grid.innerHTML = \"\";\n" + ans_hook, "grid.innerHTML = \"\";\n")

# Now inject correctly
target1 = """  illustration.innerHTML = "";
  currentQuizClock = null;"""

target2 = """function renderAnswers(question) {
  const grid = $("answerGrid");
  if (!grid) return;

  grid.innerHTML = "";"""

code = code.replace(target1, target1 + "\n" + ill_hook)
code = code.replace(target2, target2 + "\n" + ans_hook)

with open('js/quiz.js', 'w', encoding='utf-8') as f:
    f.write(code)
