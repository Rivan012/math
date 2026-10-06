import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = """  const levelIds = [...new Set(currentQuizQuestions.map(q => q.level))];
  if (!currentStudent.completedLevels) {"""
  
replacement = """  const levelIds = [...new Set(currentQuizQuestions.map(q => q.level))];
  if (currentStudent) {
    if (!currentStudent.completedLevels) {"""

if target in code:
    code = code.replace(target, replacement)
    
    target2 = """  currentStudent.materialProgress = 100;
  if (typeof saveCurrentStudent === "function") saveCurrentStudent();"""
    
    replacement2 = """  currentStudent.materialProgress = 100;
    if (typeof saveCurrentStudent === "function") saveCurrentStudent();
  }"""
    code = code.replace(target2, replacement2)
    
    with open('js/quiz.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Fixed finishQuiz currentStudent check.")
else:
    print("Could not find target.")
