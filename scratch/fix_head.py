import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = "document.head.appendChild(style);"
replacement = "if (document.head) document.head.appendChild(style);"

if target in code:
    code = code.replace(target, replacement)
    with open('js/quiz.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Fixed document.head access.")
else:
    print("Could not find target.")
