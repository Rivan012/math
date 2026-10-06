import re

with open('scratch/test_level5_three_pages_dnd.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = """// Execute storage.js and quiz.js
vm.runInContext(storageJs, sandbox);
vm.runInContext(quizJs, sandbox);"""

replacement = """// Execute storage.js and quiz.js
vm.runInContext(storageJs, sandbox);
vm.runInContext('currentStudent = JSON.parse(localStorage.getItem("timequest_current_student"))', sandbox);
vm.runInContext(quizJs, sandbox);"""

if target in code:
    code = code.replace(target, replacement)
    with open('scratch/test_level5_three_pages_dnd.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Fixed test script currentStudent assignment.")
else:
    print("Could not find target.")
