import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("level5State = {", "var level5State = {", 1)

with open('js/quiz.js', 'w', encoding='utf-8') as f:
    f.write(code)
