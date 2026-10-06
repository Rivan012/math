import re

with open('scratch/test_level5_three_pages_dnd.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = """  Object.defineProperty(el, 'innerHTML', {"""
replacement = """  Object.defineProperty(el, 'textContent', {
    get() { return el._text || ''; },
    set(val) { el._text = val; }
  });
  Object.defineProperty(el, 'innerHTML', {"""

if target in code:
    code = code.replace(target, replacement)
    with open('scratch/test_level5_three_pages_dnd.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Fixed test script textContent.")
else:
    print("Could not find target.")
