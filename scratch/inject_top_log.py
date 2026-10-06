import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = """function renderResult() {
  if (!lastResult || !currentStudent) return;"""

replacement = """function renderResult() {
  console.log("DEBUG TOP of renderResult: lastResult =", lastResult, "currentStudent =", currentStudent);
  if (!lastResult || !currentStudent) return;"""

if target in code:
    code = code.replace(target, replacement)
    with open('js/quiz.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Injected console.log.")
else:
    print("Could not find target.")
