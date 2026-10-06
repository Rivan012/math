import re

with open('scratch/test_level5_three_pages_dnd.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = """    dispatchEvent(evt) {"""
replacement = """    click() { this.dispatchEvent({type:'click'}); },
    dispatchEvent(evt) {"""

if target in code:
    code = code.replace(target, replacement)
    with open('scratch/test_level5_three_pages_dnd.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Fixed mock element click.")
else:
    print("Could not find target.")
