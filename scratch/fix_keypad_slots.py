import re

with open('js/quiz.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's find the start of the function
start_str = "function createTimeInputKeypadWidget(question) {"
start_idx = code.find(start_str)

if start_idx != -1:
    # Find the end of the function by counting braces
    brace_count = 0
    end_idx = -1
    in_function = False
    
    for i in range(start_idx, len(code)):
        if code[i] == '{':
            brace_count += 1
            in_function = True
        elif code[i] == '}':
            brace_count -= 1
        
        if in_function and brace_count == 0:
            end_idx = i + 1
            break

    if end_idx != -1:
        old_func = code[start_idx:end_idx]
        
        new_func = """function createTimeInputKeypadWidget(question) {
  const container = document.createElement("div");
  container.className = "time-keypad-container";
  container.innerHTML = `
    <div class="time-keypad-layout" style="justify-content:center; align-items:center;">
      <!-- Numpad Virtual -->
      <div class="time-numpad-area" style="max-width:300px; margin:0 auto;">
        <div class="numpad-grid">
          <button type="button" class="numpad-btn" data-key="1">1</button>
          <button type="button" class="numpad-btn" data-key="2">2</button>
          <button type="button" class="numpad-btn" data-key="3">3</button>
          <button type="button" class="numpad-btn" data-key="4">4</button>
          <button type="button" class="numpad-btn" data-key="5">5</button>
          <button type="button" class="numpad-btn" data-key="6">6</button>
          <button type="button" class="numpad-btn" data-key="7">7</button>
          <button type="button" class="numpad-btn" data-key="8">8</button>
          <button type="button" class="numpad-btn" data-key="9">9</button>
          <button type="button" class="numpad-btn numpad-btn-focus" data-key="next">➔</button>
          <button type="button" class="numpad-btn" data-key="0">0</button>
          <button type="button" class="numpad-btn numpad-btn-del" data-key="del">⌫</button>
        </div>
        <button type="button" id="btnKeypadSubmit" class="btn btn-game-primary btn-clock-submit" style="margin-top:20px; width:100%; border-radius:12px; font-size:18px;">
          <img src="assets/icons/check-circle.svg" width="22" height="22" alt="">
          <span>Jawab</span>
        </button>
      </div>
    </div>
  `;

  let activeInput = "hour"; // 'hour' atau 'minute'
  let hourVal = "";
  let minuteVal = "";

  setTimeout(() => {
    const slotHour = document.getElementById("slotHour");
    const slotMinute = document.getElementById("slotMinute");
    
    // Initial UI state
    if (slotHour) slotHour.classList.add("drag-hover");
    
    // Helper to update display
    const updateDisplay = () => {
        if (slotHour) {
            const hSpan = slotHour.querySelector(".slot-display-val");
            if (hSpan) {
                hSpan.textContent = hourVal || "--";
                hSpan.classList.toggle("is-empty", !hourVal);
            }
        }
        if (slotMinute) {
            const mSpan = slotMinute.querySelector(".slot-display-val");
            if (mSpan) {
                mSpan.textContent = minuteVal || "--";
                mSpan.classList.toggle("is-empty", !minuteVal);
            }
        }
    };

    container.querySelectorAll(".numpad-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if(quizAnswered) return;
        const key = btn.dataset.key;
        if(typeof playSound === "function") playSound("tick");

        if (key === "next") {
          activeInput = activeInput === "hour" ? "minute" : "hour";
          if (slotHour) slotHour.classList.toggle("drag-hover", activeInput === "hour");
          if (slotMinute) slotMinute.classList.toggle("drag-hover", activeInput === "minute");
          return;
        }
        if (key === "del") {
          if (activeInput === "hour") {
            hourVal = hourVal.slice(0, -1);
          } else {
            minuteVal = minuteVal.slice(0, -1);
          }
        } else {
          if (activeInput === "hour") {
            if (hourVal.length < 2) hourVal += key;
          } else {
            if (minuteVal.length < 2) minuteVal += key;
          }
        }
        
        updateDisplay();
        
        // Auto switch to minute when hour has 2 digits
        if(activeInput === "hour" && hourVal.length === 2) {
          activeInput = "minute";
          if(slotHour) slotHour.classList.remove("drag-hover");
          if(slotMinute) slotMinute.classList.add("drag-hover");
        }
      });
    });

    const submitBtn = document.getElementById("btnKeypadSubmit");
    if(submitBtn) {
      submitBtn.addEventListener("click", () => {
        submitKeyboardTimeAnswer(question, hourVal, minuteVal);
      });
    }

    // click to focus
    if (slotHour) slotHour.addEventListener("click", () => {
      if(quizAnswered) return;
      activeInput = "hour";
      slotHour.classList.add("drag-hover");
      if(slotMinute) slotMinute.classList.remove("drag-hover");
    });
    if (slotMinute) slotMinute.addEventListener("click", () => {
      if(quizAnswered) return;
      activeInput = "minute";
      slotMinute.classList.add("drag-hover");
      if(slotHour) slotHour.classList.remove("drag-hover");
    });
  }, 0);

  return container;
}"""
        
        code = code.replace(old_func, new_func)
        with open('js/quiz.js', 'w', encoding='utf-8') as fw:
            fw.write(code)
        print("Success! Replaced createTimeInputKeypadWidget.")
    else:
        print("Could not find end of function.")
else:
    print("Could not find start of function.")
