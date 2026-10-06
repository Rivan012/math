import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add selectedMatchValue
target_hook = """  // === Level 5 Match Illustration Hook ===
  if (["clock_match", "activity_match", "time_of_day_match"].includes(question.type || question.tipe)) {"""
replacement_hook = """  // === Level 5 Match Illustration Hook ===
  window.selectedMatchValue = null;
  if (["clock_match", "activity_match", "time_of_day_match"].includes(question.type || question.tipe)) {"""

if target_hook in code:
    code = code.replace(target_hook, replacement_hook)

# 2. Add slot click listener
target_slot = """    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.style.border = "2px dashed #9CA3AF";
      slot.style.background = "#F9FAFB";
      if (quizAnswered) return;
      const val = e.dataTransfer.getData("text/plain");
      handleMatchDrop(slot, val, question);
    });"""
replacement_slot = """    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.style.border = "2px dashed #9CA3AF";
      slot.style.background = "#F9FAFB";
      if (quizAnswered) return;
      const val = e.dataTransfer.getData("text/plain");
      handleMatchDrop(slot, val, question);
    });
    
    // Tap-to-place logic for mobile
    slot.addEventListener("click", () => {
      if (quizAnswered) return;
      if (window.selectedMatchValue) {
        handleMatchDrop(slot, window.selectedMatchValue, question);
        window.selectedMatchValue = null;
        document.querySelectorAll(".match-drag-chip").forEach(c => c.style.boxShadow = "none");
      }
    });"""

if target_slot in code:
    code = code.replace(target_slot, replacement_slot)

# 3. Add chip click listener
target_chip = """      chip.addEventListener("dragstart", (e) => {
        if (quizAnswered || chip.classList.contains("used-chip")) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", opt);
        e.dataTransfer.effectAllowed = "move";
      });"""
replacement_chip = """      chip.addEventListener("dragstart", (e) => {
        if (quizAnswered || chip.classList.contains("used-chip")) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", opt);
        e.dataTransfer.effectAllowed = "move";
      });
      
      // Tap-to-select logic for mobile
      chip.addEventListener("click", () => {
        if (quizAnswered || chip.classList.contains("used-chip")) return;
        document.querySelectorAll(".match-drag-chip").forEach(c => c.style.boxShadow = "none");
        window.selectedMatchValue = opt;
        chip.style.boxShadow = "0 0 0 4px #60A5FA";
      });"""

if target_chip in code:
    code = code.replace(target_chip, replacement_chip)

with open('js/quiz.js', 'w', encoding='utf-8') as f:
    f.write(code)
print("Added tap-to-place mobile fallback.")
