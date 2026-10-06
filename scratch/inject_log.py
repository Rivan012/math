import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = """  const isLevel5 = currentQuizQuestions.length > 0 && ["clock_match", "activity_match", "time_of_day_match"].includes(currentQuizQuestions[0].type || currentQuizQuestions[0].tipe);
  if (resTitle) {"""

replacement = """  const isLevel5 = currentQuizQuestions.length > 0 && ["clock_match", "activity_match", "time_of_day_match"].includes(currentQuizQuestions[0].type || currentQuizQuestions[0].tipe);
  console.log("DEBUG: isLevel5 =", isLevel5, "resTitle =", resTitle ? "EXISTS" : "NULL", "student =", currentStudent ? currentStudent.name : "NULL");
  if (resTitle) {"""

if target in code:
    code = code.replace(target, replacement)
    with open('js/quiz.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Injected console.log.")
else:
    print("Could not find target.")
