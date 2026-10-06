import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace all occurrences of onMatchNextClick block without semicolon
target = """window.onMatchNextClick = function(question) {
  quizAnswered = true;
  stopQuestionTimer();
  const nextBtn = document.getElementById("nextQuestionBtn");
  if (nextBtn) nextBtn.click();
}"""

replacement = """window.onMatchNextClick = function(question) {
  quizAnswered = true;
  stopQuestionTimer();
  const nextBtn = document.getElementById("nextQuestionBtn");
  if (nextBtn) nextBtn.click();
};"""

code = code.replace(target, replacement)

# Replace updateMatchChipsState similarly
target2 = """    } else {
        submitBtn.style.display = "none";
    }
  }
}"""
replacement2 = """    } else {
        submitBtn.style.display = "none";
    }
  }
};"""
code = code.replace(target2, replacement2)

with open('js/quiz.js', 'w', encoding='utf-8') as f:
    f.write(code)
