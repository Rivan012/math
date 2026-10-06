import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Remove the misplaced logic from global scope
misplaced_str = """  // === Level 5: Tipe Match (clock_match, activity_match, time_of_day_match) ===
  if (["clock_match", "activity_match", "time_of_day_match"].includes(question.type || question.tipe)) {
    currentMatchAnswers = {};
    illustration.appendChild(createMatchGridWidget(question));
    return;
  }
"""

if misplaced_str in code:
    code = code.replace(misplaced_str, "")
    print("Found and removed misplaced logic.")
else:
    print("Could not find misplaced logic exactly as string.")

# 2. Insert it inside renderQuestionIllustration
# Find:
# function renderQuestionIllustration(question) {
#   const illustration = $("questionIllustration");
#   if (!illustration) return;
# 
#   illustration.innerHTML = "";
#   currentQuizClock = null;

correct_target = """function renderQuestionIllustration(question) {
  const illustration = $("questionIllustration");
  if (!illustration) return;

  illustration.innerHTML = "";
  currentQuizClock = null;
"""

if correct_target in code:
    code = code.replace(correct_target, correct_target + misplaced_str)
    print("Inserted logic in the correct place.")
else:
    print("Could not find correct target.")

with open('js/quiz.js', 'w', encoding='utf-8') as f:
    f.write(code)
