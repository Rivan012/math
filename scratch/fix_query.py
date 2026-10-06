import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = """  container.innerHTML = stepperHtml + mainTitle + `<div class="match-grid" style="${gridStyle}"></div>`;
  const grid = container.querySelector(".match-grid");"""

replacement = """  container.innerHTML = stepperHtml + mainTitle;
  const grid = document.createElement("div");
  grid.className = "match-grid";
  grid.style.cssText = gridStyle;
  container.appendChild(grid);"""

if target in code:
    code = code.replace(target, replacement)
    with open('js/quiz.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Fixed querySelector.")
else:
    print("Could not find target.")
