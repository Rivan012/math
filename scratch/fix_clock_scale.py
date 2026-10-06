import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = """      const clockWrap = document.createElement("div");
      clockWrap.style.display = "flex";
      clockWrap.style.justifyContent = "center";
      clockWrap.style.alignItems = "center";
      clockWrap.style.height = "120px";
      const clock = createClock(item.hour, item.minute, 110, false, false);"""
      
replacement = """      const clockWrap = document.createElement("div");
      clockWrap.style.width = "110px";
      clockWrap.style.height = "110px";
      clockWrap.style.display = "flex";
      clockWrap.style.justifyContent = "center";
      clockWrap.style.alignItems = "center";
      clockWrap.style.margin = "0 auto";
      const clock = createClock(item.hour, item.minute, 200, false, false);
      clock.style.transform = "scale(0.55)";
      clock.style.transformOrigin = "center center";"""

if target in code:
    code = code.replace(target, replacement)
    with open('js/quiz.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Fixed clock scale bug.")
else:
    print("Could not find target.")
