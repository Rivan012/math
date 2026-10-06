import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = """function onMatchNextClick(question) {
  quizAnswered = true;
  stopQuestionTimer();
  const nextBtn = document.getElementById("nextQuestionBtn");
  if (nextBtn) nextBtn.click();
};"""

replacement = """function onMatchNextClick(question) {
  quizAnswered = true;
  stopQuestionTimer();
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuizQuestions.length) {
      renderQuestion(currentQuestionIndex);
  } else {
      finishQuiz();
  }
};"""

if target in code:
    code = code.replace(target, replacement)
    with open('js/quiz.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Fixed onMatchNextClick logic.")
else:
    print("Could not find target.")
