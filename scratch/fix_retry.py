import sys

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

def replace_top(func_name, to_remove):
    global code
    # Find start of function
    start_idx = code.find(f"function {func_name}")
    if start_idx == -1: return
    # Find end of function (rudimentary)
    next_func = code.find("function ", start_idx + 10)
    if next_func == -1: next_func = len(code)
    
    # We replace in that slice
    func_code = code[start_idx:next_func]
    for rm in to_remove:
        func_code = func_code.replace(rm, "")
    code = code[:start_idx] + func_code + code[next_func:]

def inject_correct(func_name, correct_logic):
    global code
    start_idx = code.find(f"function {func_name}")
    if start_idx == -1: return
    # Find 'if (isCorrect) {'
    correct_idx = code.find("if (isCorrect) {", start_idx)
    if correct_idx == -1: return
    
    code = code[:correct_idx+16] + "\n" + correct_logic + "\n" + code[correct_idx+16:]

def inject_reset(func_name, reset_logic):
    global code
    start_idx = code.find(f"function {func_name}")
    if start_idx == -1: return
    feedback_idx = code.find("feedback.classList.remove(\"hidden\");", start_idx)
    if feedback_idx == -1: return
    end_bracket_idx = code.find("}", feedback_idx)
    
    code = code[:end_bracket_idx+1] + "\n" + reset_logic + "\n" + code[end_bracket_idx+1:]

# -----------------
# Clock Drop
# -----------------
remove_list_drop = [
    "  quizAnswered = true;\n  stopQuestionTimer();\n\n",
    "  if (hintBtn) hintBtn.disabled = true;\n  if (submitBtn) submitBtn.disabled = true;\n"
]
replace_top("submitClockDropAnswer", remove_list_drop)
inject_correct("submitClockDropAnswer", """
    quizAnswered = true;
    stopQuestionTimer();
    if (hintBtn) hintBtn.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
""")
inject_reset("submitClockDropAnswer", """
      quizAnswered = false;
      startQuestionTimer();
      if (hintBtn) hintBtn.disabled = false;
      if (submitBtn) submitBtn.disabled = false;
""")

# -----------------
# Clock Drag
# -----------------
replace_top("submitClockDragAnswer", remove_list_drop)
inject_correct("submitClockDragAnswer", """
    quizAnswered = true;
    stopQuestionTimer();
    if (hintBtn) hintBtn.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
""")
inject_reset("submitClockDragAnswer", """
      quizAnswered = false;
      startQuestionTimer();
      if (hintBtn) hintBtn.disabled = false;
      if (submitBtn) submitBtn.disabled = false;
""")

# -----------------
# Activity Drop
# -----------------
remove_list_activity = [
    "  quizAnswered = true;\n  stopQuestionTimer();\n\n",
    "  if (hintBtn) hintBtn.disabled = true;\n  if (submitBtn) submitBtn.disabled = true;\n\n",
    """  document.querySelectorAll(".activity-time-chip").forEach((c) => {
    if (c.style) c.style.pointerEvents = "none";
    if (c.removeAttribute) c.removeAttribute("draggable");
  });"""
]
replace_top("submitActivityDropAnswer", remove_list_activity)
inject_correct("submitActivityDropAnswer", """
    quizAnswered = true;
    stopQuestionTimer();
    if (hintBtn) hintBtn.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    document.querySelectorAll(".activity-time-chip").forEach((c) => {
      if (c.style) c.style.pointerEvents = "none";
      if (c.removeAttribute) c.removeAttribute("draggable");
    });
""")
inject_reset("submitActivityDropAnswer", """
      quizAnswered = false;
      startQuestionTimer();
      if (hintBtn) hintBtn.disabled = false;
      if (submitBtn) submitBtn.disabled = false;
      document.querySelectorAll(".activity-time-chip").forEach((c) => {
        if (c.style) c.style.pointerEvents = "auto";
        if (c.setAttribute) c.setAttribute("draggable", "true");
      });
""")

# -----------------
# Time Compare
# -----------------
remove_list_compare = [
    "  quizAnswered = true;\n  stopQuestionTimer();\n\n",
    "  if (hintBtn) hintBtn.disabled = true;\n  if (submitBtn) submitBtn.disabled = true;\n\n",
    """  if (currentTimeCompareCards && currentTimeCompareCards.length > 0) {
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
  }"""
]
replace_top("submitTimeCompareAnswer", remove_list_compare)
inject_correct("submitTimeCompareAnswer", """
    quizAnswered = true;
    stopQuestionTimer();
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
        }
      });
    }
""")
inject_reset("submitTimeCompareAnswer", """
      quizAnswered = false;
      startQuestionTimer();
      if (hintBtn) hintBtn.disabled = false;
      if (submitBtn) submitBtn.disabled = false;
      if (currentTimeCompareCards && currentTimeCompareCards.length > 0) {
        currentTimeCompareCards.forEach((c, idx) => {
          c.style.pointerEvents = "auto";
          const chk = c.checkboxEl || (c.querySelector && c.querySelector(".time-compare-checkbox"));
          c.classList.remove("card-wrong", "card-correct");
          if (idx === currentSelectedCompareIndex) {
            c.classList.add("selected");
            if (chk) chk.textContent = "";
          } else {
            if (chk) chk.textContent = "";
          }
        });
      }
""")

# -----------------
# Select Answer
# -----------------
remove_list_select = [
    "  if (quizAnswered) return;\n  quizAnswered = true;\n  stopQuestionTimer();\n\n",
    "  if (hintBtn) hintBtn.disabled = true;\n\n",
    """  // Nonaktifkan semua opsi jawaban dan sorot jawaban yang benar
  document.querySelectorAll(".answer-btn").forEach((btn, i) => {
    btn.disabled = true;
    if (i === question.correct) {
      btn.classList.add("correct");
    }
  });"""
]
replace_top("selectAnswer", remove_list_select)

# Because we removed the 'quizAnswered = true' from the very top (it was in the same statement as `if (quizAnswered) return;`),
# we need to be careful. The original was:
# if (quizAnswered) return;
# quizAnswered = true;
# stopQuestionTimer();

# Let's re-add the `if (quizAnswered) return;` since we removed it.
# Actually we can just add it back where it was.
code = code.replace("function selectAnswer(index, button, question) {", "function selectAnswer(index, button, question) {\n  if (quizAnswered) return;\n")

inject_correct("selectAnswer", """
    quizAnswered = true;
    stopQuestionTimer();
    if (hintBtn) hintBtn.disabled = true;
    document.querySelectorAll(".answer-btn").forEach((btn, i) => {
      btn.disabled = true;
      if (i === question.correct) {
        btn.classList.add("correct");
      }
    });
""")
inject_reset("selectAnswer", """
      quizAnswered = false;
      startQuestionTimer();
      if (hintBtn) hintBtn.disabled = false;
      document.querySelectorAll(".answer-btn").forEach((btn) => {
        btn.disabled = false;
        btn.classList.remove("correct", "selected-correct");
      });
""")

with open('js/quiz.js', 'w', encoding='utf-8') as f:
    f.write(code)
