import sys

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('\\`', '`').replace('\\$', '$')

with open('js/quiz.js', 'w', encoding='utf-8') as f:
    f.write(code)
