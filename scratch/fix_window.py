import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("window.handleMatchDrop = function(slot, val, question) {", "function handleMatchDrop(slot, val, question) {")
code = code.replace("window.updateMatchChipsState = function(question) {", "function updateMatchChipsState(question) {")
code = code.replace("window.onMatchNextClick = function(question) {", "function onMatchNextClick(question) {")
code = code.replace("window.handleMatchDrop(", "handleMatchDrop(")
code = code.replace("window.onMatchNextClick(", "onMatchNextClick(")

with open('js/quiz.js', 'w', encoding='utf-8') as f:
    f.write(code)
