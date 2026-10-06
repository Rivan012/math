import re
import sys

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

def patch_retries(func_name, answer_str_code, target_str_code):
    global code
    pattern = r'(function ' + func_name + r'\([^)]*\) \{.*?)if \(isCorrect\) \{(.*?)\n  \} else \{(.*?)\n  \}\n\n  const pointsEl ='
    match = re.search(pattern, code, re.DOTALL)
    if not match:
        print(f"Could not find {func_name}")
        return
    
    before_if = match.group(1)
    if_block = match.group(2)
    else_block = match.group(3)
    
    new_else = f"""
    currentWrongAttempts++;
    quizStreak = 0;
    updateStreakBanner();
    if (typeof playSound === "function") playSound("wrong");

    const card = document.getElementById("quizCard");
    if (card) {{
      card.classList.remove("anim-quiz-shake");
      void card.offsetWidth;
      card.classList.add("anim-quiz-shake");
    }}

    if (currentWrongAttempts < 3) {{
      if (feedback) {{
        feedback.className = "quiz-feedback-quizizz feedback-wrong";
        feedback.innerHTML = `
          <div class="feedback-quizizz-box">
            <img src="assets/icons/x-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
            <div>
              <h4>Jawaban Belum Tepat</h4>
              <p>Jawaban yang kamu pilih kurang tepat. Kesempatan menjawab: ${{3 - currentWrongAttempts}} kali lagi.</p>
            </div>
          </div>
        `;
        feedback.classList.remove("hidden");
      }}
    }} else {{
      quizAnswered = true;
      stopQuestionTimer();
      if (hintBtn) hintBtn.disabled = true;
      if (submitBtn) {{
        submitBtn.disabled = true;
        submitBtn.className = "btn btn-game-primary btn-clock-submit clock-wrong";
      }}

      const expl = question.explanation || question.penjelasan || "";

      if (feedback) {{
        feedback.className = "quiz-feedback-quizizz feedback-wrong";
        feedback.innerHTML = `
          <div class="feedback-quizizz-box">
            <img src="assets/icons/x-circle.svg" width="24" height="24" alt="" class="feedback-icon-svg" style="flex-shrink:0;">
            <div>
              <h4>Kesempatan Habis</h4>
              <p>Jawaban yang benar adalah <strong>${target_str_code}</strong></p>
              <div class="feedback-explanation">${{escapeHTML(expl)}}</div>
            </div>
          </div>
        `;
        feedback.classList.remove("hidden");
      }}

      if (nextBtn) {{
        nextBtn.classList.remove("hidden");
        nextBtn.focus();
      }}
    }}"""
    
    replacement = before_if + 'if (isCorrect) {' + if_block + '\n  } else {' + new_else + '\n  }\n\n  const pointsEl ='
    code = code[:match.start()] + replacement + code[match.end():]


patch_retries('selectAnswer', '', 'escapeHTML(question.options[question.correct])')
patch_retries('submitClockDragAnswer', '', 'escapeHTML(targetStr)')
patch_retries('submitActivityDropAnswer', '', 'escapeHTML(expAnswer)')
patch_retries('submitTimeCompareAnswer', '', 'escapeHTML(correctItem.label)')

with open('js/quiz.js', 'w', encoding='utf-8') as f:
    f.write(code)
print("Done")
