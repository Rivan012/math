import sys
import re

with open('js/student.js', 'r', encoding='utf-8') as f:
    code = f.read()

keypad_html = """          <div class="materi-keypad-container" style="background:#fff; border-radius:12px; padding:16px; margin: 16px 0; border: 2px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div class="time-inputs-row" style="display:flex; justify-content:center; align-items:center; gap: 10px; margin-bottom: 12px;">
              <div class="time-input-group" style="text-align:center;">
                <label style="display:block; font-size:12px; color:var(--text-secondary); margin-bottom:4px; font-weight:600;">Jam</label>
                <input type="text" id="materiInputHour" class="time-keypad-input active" placeholder="--" readonly tabindex="-1" style="width:50px; height:50px; text-align:center; font-size:24px; font-weight:bold; font-family:'Outfit', sans-serif; border:2px solid var(--primary); border-radius:8px; color:var(--text-primary); cursor:pointer; background:#f0f5ff;">
              </div>
              <div class="time-input-sep" style="font-size:28px; font-weight:bold; color:var(--text-secondary);">:</div>
              <div class="time-input-group" style="text-align:center;">
                <label style="display:block; font-size:12px; color:var(--text-secondary); margin-bottom:4px; font-weight:600;">Menit</label>
                <input type="text" id="materiInputMinute" class="time-keypad-input" placeholder="--" readonly tabindex="-1" style="width:50px; height:50px; text-align:center; font-size:24px; font-weight:bold; font-family:'Outfit', sans-serif; border:2px solid var(--border); border-radius:8px; color:var(--text-primary); cursor:pointer; background:#fff;">
              </div>
              <button type="button" id="btnMateriApply" class="btn btn-primary" style="margin-left:10px; padding: 12px 20px; font-size:16px; align-self:flex-end;">
                Terapkan
              </button>
            </div>
            <div class="time-numpad-area" style="max-width: 260px; margin: 0 auto; display:block;">
              <div class="numpad-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
                <button type="button" class="materi-numpad-btn" data-key="1" style="background:#f8f9fa; border:2px solid var(--border); border-radius:8px; font-size:20px; font-weight:600; padding:12px 0; cursor:pointer;">1</button>
                <button type="button" class="materi-numpad-btn" data-key="2" style="background:#f8f9fa; border:2px solid var(--border); border-radius:8px; font-size:20px; font-weight:600; padding:12px 0; cursor:pointer;">2</button>
                <button type="button" class="materi-numpad-btn" data-key="3" style="background:#f8f9fa; border:2px solid var(--border); border-radius:8px; font-size:20px; font-weight:600; padding:12px 0; cursor:pointer;">3</button>
                <button type="button" class="materi-numpad-btn" data-key="4" style="background:#f8f9fa; border:2px solid var(--border); border-radius:8px; font-size:20px; font-weight:600; padding:12px 0; cursor:pointer;">4</button>
                <button type="button" class="materi-numpad-btn" data-key="5" style="background:#f8f9fa; border:2px solid var(--border); border-radius:8px; font-size:20px; font-weight:600; padding:12px 0; cursor:pointer;">5</button>
                <button type="button" class="materi-numpad-btn" data-key="6" style="background:#f8f9fa; border:2px solid var(--border); border-radius:8px; font-size:20px; font-weight:600; padding:12px 0; cursor:pointer;">6</button>
                <button type="button" class="materi-numpad-btn" data-key="7" style="background:#f8f9fa; border:2px solid var(--border); border-radius:8px; font-size:20px; font-weight:600; padding:12px 0; cursor:pointer;">7</button>
                <button type="button" class="materi-numpad-btn" data-key="8" style="background:#f8f9fa; border:2px solid var(--border); border-radius:8px; font-size:20px; font-weight:600; padding:12px 0; cursor:pointer;">8</button>
                <button type="button" class="materi-numpad-btn" data-key="9" style="background:#f8f9fa; border:2px solid var(--border); border-radius:8px; font-size:20px; font-weight:600; padding:12px 0; cursor:pointer;">9</button>
                <button type="button" class="materi-numpad-btn" data-key="next" style="background:var(--primary-light); color:var(--primary-dark); border:2px solid var(--primary-light); border-radius:8px; font-size:20px; font-weight:600; padding:12px 0; cursor:pointer;">➔</button>
                <button type="button" class="materi-numpad-btn" data-key="0" style="background:#f8f9fa; border:2px solid var(--border); border-radius:8px; font-size:20px; font-weight:600; padding:12px 0; cursor:pointer;">0</button>
                <button type="button" class="materi-numpad-btn" data-key="del" style="background:#fee2e2; color:#ef4444; border:2px solid #fee2e2; border-radius:8px; font-size:20px; font-weight:600; padding:12px 0; cursor:pointer;">⌫</button>
              </div>
            </div>
          </div>"""

# Replace M003 buttons
m003_buttons = """          <div class="clock-preset-buttons" role="group" aria-label="Jadwal Digital Tika & Halim">
            <button type="button" class="preset-digi-btn active" data-h="5" data-m="0" data-read="Pukul 05.00 tepat (Halim bangun tidur - Hal. 178)">05:00 Bangun Tidur</button>
            <button type="button" class="preset-digi-btn" data-h="6" data-m="0" data-read="Pukul 06.00 pagi (Tika sarapan - Hal. 179)">06:00 Sarapan</button>
            <button type="button" class="preset-digi-btn" data-h="7" data-m="0" data-read="Pukul 07.00 pagi (Masuk sekolah - Hal. 179)">07:00 Masuk Sekolah</button>
            <button type="button" class="preset-digi-btn" data-h="12" data-m="0" data-read="Pukul 12.00 siang (Makan di Kantin Sehat - Hal. 180)">12:00 Kantin Sehat</button>
            <button type="button" class="preset-digi-btn" data-h="4" data-m="0" data-read="Pukul 04.00 sore (Tika bermain bersama adik - Hal. 180)">16:00 Bermain Sore</button>
            <button type="button" class="preset-digi-btn" data-h="9" data-m="0" data-read="Pukul 09.00 malam (Tika tidur malam - Hal. 181)">21:00 Tidur Malam</button>
          </div>"""
code = code.replace(m003_buttons, keypad_html)

# Replace M004 buttons
m004_buttons = """        <div class="clock-preset-buttons" role="group" aria-label="Pilihan perbandingan jam">
          <button type="button" class="dual-preset-btn active" data-time="07:00" data-deg-h="210" data-deg-m="0" data-desc="Pukul 07.00 tepat (Masuk sekolah)">
            07:00
          </button>
          <button type="button" class="dual-preset-btn" data-time="05:00" data-deg-h="150" data-deg-m="0" data-desc="Pukul 05.00 tepat (Bangun tidur)">
            05:00
          </button>
          <button type="button" class="dual-preset-btn" data-time="09:30" data-deg-h="285" data-deg-m="180" data-desc="Pukul 09.30 (Setengah sepuluh / istirahat)">
            09:30
          </button>
          <button type="button" class="dual-preset-btn" data-time="12:00" data-deg-h="360" data-deg-m="0" data-desc="Pukul 12.00 tepat (Makan siang)">
            12:00
          </button>
        </div>"""
code = code.replace(m004_buttons, keypad_html)


# Now we inject the Javascript handlers for the keypad in M003 and M004.
# We already have a generic handler for `.materi-keypad-container` which handles the keypad clicks
# and updates `hourVal` and `minuteVal`. BUT the `btnApply` click logic is hardcoded for M002 right now:
#
#         if (hourHand) hourHand.style.transform = ...
#         if (minuteHand) minuteHand.style.transform = ...
#
# We should change the `btnApply` logic so it works for ANY of the 3 templates!
# By checking what elements exist in the container.
# Wait, let's just REPLACE the whole keypad logic block.

keypad_logic_old = """    if (btnApply) {
      btnApply.addEventListener("click", () => {
        if (!hourVal || !minuteVal) {
          if (typeof showToast === "function") showToast("Silakan isi jam dan menit!");
          return;
        }
        
        let h = parseInt(hourVal, 10);
        let m = parseInt(minuteVal, 10);
        
        if (h > 12) h = 12;
        if (h === 0) h = 12;
        if (m > 59) m = 59;
        
        const hourHand = container.querySelector("#flipbookHourHand");
        const minuteHand = container.querySelector("#flipbookMinuteHand");
        const badge = container.querySelector("#flipbookDigitalBadge");
        const caption = container.querySelector("#flipbookClockCaption");

        const hourAngle = ((h % 12) + m / 60) * 30;
        const minuteAngle = m * 6;

        if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
        if (minuteHand) minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
        if (badge) badge.textContent = `${String(h).padStart(2, "0")}.${String(m).padStart(2, "0")}`;
        
        if (caption) {
          if (m === 0) {
            caption.innerHTML = `Pukul <strong>${String(h).padStart(2, "0")}.00</strong> tepat`;
          } else if (m === 30) {
            const nextH = (h % 12) + 1;
            caption.innerHTML = `Pukul <strong>${String(h).padStart(2, "0")}.30</strong> (Setengah ${nextH})`;
          } else {
            caption.innerHTML = `Pukul <strong>${String(h).padStart(2, "0")}.${String(m).padStart(2, "0")}</strong>`;
          }
        }
        if (typeof playSound === "function") playSound("correct");
      });
    }"""

keypad_logic_new = """    if (btnApply) {
      btnApply.addEventListener("click", () => {
        if (!hourVal || !minuteVal) {
          if (typeof showToast === "function") showToast("Silakan isi jam dan menit!");
          return;
        }
        
        let h = parseInt(hourVal, 10);
        let m = parseInt(minuteVal, 10);
        
        if (h > 12) h = 12;
        if (h === 0) h = 12;
        if (m > 59) m = 59;
        
        const hStr = String(h).padStart(2, "0");
        const mStr = String(m).padStart(2, "0");
        const timeStr = `${hStr}:${mStr}`;

        // M002 Logic (Analog)
        const hourHand = container.querySelector("#flipbookHourHand");
        const minuteHand = container.querySelector("#flipbookMinuteHand");
        const badge = container.querySelector("#flipbookDigitalBadge");
        const caption = container.querySelector("#flipbookClockCaption");

        // M004 Logic (Dual)
        const dualHourHand = container.querySelector("#dualHourHand");
        const dualMinuteHand = container.querySelector("#dualMinuteHand");
        const dualDigitalDisplay = container.querySelector("#dualDigitalDisplay");
        const dualCaption = container.querySelector("#dualCaption");

        // Apply angles if analog exists
        const hourAngle = ((h % 12) + m / 60) * 30;
        const minuteAngle = m * 6;

        if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
        if (minuteHand) minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
        if (badge) badge.textContent = `${hStr}.${mStr}`;
        if (caption) {
          if (m === 0) {
            caption.innerHTML = `Pukul <strong>${hStr}.00</strong> tepat`;
          } else if (m === 30) {
            const nextH = (h % 12) + 1;
            caption.innerHTML = `Pukul <strong>${hStr}.30</strong> (Setengah ${nextH})`;
          } else {
            caption.innerHTML = `Pukul <strong>${hStr}.${mStr}</strong>`;
          }
        }

        if (dualHourHand) dualHourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
        if (dualMinuteHand) dualMinuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
        if (dualDigitalDisplay) dualDigitalDisplay.textContent = timeStr;
        if (dualCaption) {
          if (m === 0) {
            dualCaption.innerHTML = `Pukul <strong>${timeStr}</strong> tepat`;
          } else {
            dualCaption.innerHTML = `Pukul <strong>${timeStr}</strong>`;
          }
        }

        // M003 Logic (Interactive Digital)
        const digiConsole = container.querySelector(".digital-interactive-console");
        if (digiConsole && typeof renderDigi === "function") {
           // We can't call renderDigi easily because it's scoped, but wait...
           // renderDigi is scoped inside `if (digiConsole)`.
           // Let's just update the DOM directly!
           const digiHourText = digiConsole.querySelector("#digiHourText");
           const digiMinText = digiConsole.querySelector("#digiMinText");
           const lblH = digiConsole.querySelector("#lblHour");
           const lblM = digiConsole.querySelector("#lblMin");
           const readAloud = container.querySelector("#digiReadAloud");
           
           if (digiHourText) digiHourText.textContent = hStr;
           if (digiMinText) digiMinText.textContent = mStr;
           if (lblH) lblH.textContent = hStr;
           if (lblM) lblM.textContent = mStr;
           if (readAloud) {
             if (m === 0) {
               readAloud.innerHTML = `Jam ini dibaca: <strong>Pukul ${hStr}.00 tepat</strong>`;
             } else if (m === 30) {
               const nextH = (h % 12) + 1;
               readAloud.innerHTML = `Jam ini dibaca: <strong>Pukul ${hStr}.30 (Setengah ${nextH})</strong>`;
             } else {
               readAloud.innerHTML = `Jam ini dibaca: <strong>Pukul ${hStr} lewat ${mStr} menit</strong>`;
             }
           }
        }

        if (typeof playSound === "function") playSound("correct");
      });
    }"""

code = code.replace(keypad_logic_old, keypad_logic_new)

# Remove the old M003 / M004 button event handlers to clean up memory/bugs.
preset_digi_logic = """    presetDigiBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        presetDigiBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderDigi(btn.getAttribute("data-h"), btn.getAttribute("data-m"), btn.getAttribute("data-read"));
        if (typeof playSound === "function") playSound("tick");
      });
    });"""
code = code.replace(preset_digi_logic, "")

dual_btns_logic = """  // Preset Jam Dual Analog-Digital (Level 2)
  const dualBtns = container.querySelectorAll(".dual-preset-btn");
  dualBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      dualBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const degH = btn.getAttribute("data-deg-h");
      const degM = btn.getAttribute("data-deg-m");
      const time = btn.getAttribute("data-time");
      const desc = btn.getAttribute("data-desc");

      const hourHand = container.querySelector("#dualHourHand");
      const minuteHand = container.querySelector("#dualMinuteHand");
      const digitalDisplay = container.querySelector("#dualDigitalDisplay");
      const caption = container.querySelector("#dualCaption");

      if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${degH}deg)`;
      if (minuteHand) minuteHand.style.transform = `translateX(-50%) rotate(${degM}deg)`;
      if (digitalDisplay) digitalDisplay.textContent = time;
      if (caption) caption.textContent = desc;

      if (typeof playSound === "function") playSound("tick");
    });
  });"""
code = code.replace(dual_btns_logic, "")


with open('js/student.js', 'w', encoding='utf-8') as f:
    f.write(code)
