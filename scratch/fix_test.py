import re

with open('scratch/test_level5_three_pages_dnd.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = """const expectedQ1 = {
  1: "07:00",
  2: "10:00",
  3: "03:00",
  4: "05:00",
  5: "08:00",
  6: "11:00",
  7: "02:00",
  8: "04:00"
};"""

replacement = """const expectedQ1 = {
  0: "07:00",
  1: "10:00",
  2: "03:00",
  3: "05:00",
  4: "08:00",
  5: "11:00",
  6: "02:00",
  7: "04:00"
};"""

if target in code:
    code = code.replace(target, replacement)
    with open('scratch/test_level5_three_pages_dnd.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Fixed test script.")
else:
    print("Could not find target in test script.")
