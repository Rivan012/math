import re

with open('scratch/test_level5_three_pages_dnd.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = """// Execute storage.js and quiz.js"""
replacement = """// Setup dummy student in storage
sandbox.localStorage.setItem("timequest_current_student", JSON.stringify({ name: 'Budi', points: 0, completedLevels: [] }));

// Execute storage.js and quiz.js"""

if target in code:
    code = code.replace(target, replacement)
    with open('scratch/test_level5_three_pages_dnd.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Fixed test script localStorage.")
else:
    print("Could not find target.")
