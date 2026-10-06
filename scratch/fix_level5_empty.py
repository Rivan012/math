import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Add a helper function to merge missing data from DEFAULT_QUESTIONS
helper = """
function getMatchItems(question) {
  let type = question.type || question.tipe;
  let items = [];
  if (type === "clock_match") items = question.clocks;
  else if (type === "activity_match") items = question.activities;
  else if (type === "time_of_day_match") items = question.scenes;

  if (!items || items.length === 0) {
    if (typeof DEFAULT_QUESTIONS !== "undefined") {
      const dq = DEFAULT_QUESTIONS.find(q => q.id === question.id);
      if (dq) {
        if (type === "clock_match") items = dq.clocks;
        else if (type === "activity_match") items = dq.activities;
        else if (type === "time_of_day_match") items = dq.scenes;
        
        // Juga tambahkan options ke question jika hilang
        if (!question.options && dq.options) {
          question.options = dq.options;
        }
      }
    }
  }
  return items || [];
}
"""

if "function getMatchItems" not in code:
    idx = code.find("function createMatchGridWidget(question) {")
    code = code[:idx] + helper + "\n" + code[idx:]

# Replace items array assignment in createMatchGridWidget
old_items_1 = """  let items = [];
  if (question.type === "clock_match") items = question.clocks || [];
  else if (question.type === "activity_match") items = question.activities || [];
  else if (question.type === "time_of_day_match") items = question.scenes || [];"""

new_items_1 = """  const type = question.type || question.tipe;
  let items = getMatchItems(question);"""

code = code.replace(old_items_1, new_items_1)

# Fix question.type check in createMatchGridWidget
code = code.replace("""if (question.type === "clock_match") {""", """if (type === "clock_match") {""")


# Replace totalItems assignment in updateMatchChipsState
old_items_2 = """  let totalItems = 0;
  if (question.type === "clock_match") totalItems = question.clocks?.length || 0;
  else if (question.type === "activity_match") totalItems = question.activities?.length || 0;
  else if (question.type === "time_of_day_match") totalItems = question.scenes?.length || 0;"""

new_items_2 = """  const items = getMatchItems(question);
  let totalItems = items.length;"""

code = code.replace(old_items_2, new_items_2)


# Replace totalItems assignment in renderAnswers click handler
old_items_3 = """         let totalItems = 0;
         if (question.type === "clock_match") totalItems = question.clocks?.length || 0;
         else if (question.type === "activity_match") totalItems = question.activities?.length || 0;
         else if (question.type === "time_of_day_match") totalItems = question.scenes?.length || 0;"""

new_items_3 = """         const items = getMatchItems(question);
         let totalItems = items.length;"""

code = code.replace(old_items_3, new_items_3)

# Replace items array assignment in submitMatchAnswer
old_items_4 = """  let items = [];
  if (question.type === "clock_match") items = question.clocks || [];
  else if (question.type === "activity_match") items = question.activities || [];
  else if (question.type === "time_of_day_match") items = question.scenes || [];"""

new_items_4 = """  let items = getMatchItems(question);"""

code = code.replace(old_items_4, new_items_4)

with open('js/quiz.js', 'w', encoding='utf-8') as f:
    f.write(code)
