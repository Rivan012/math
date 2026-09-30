const fs = require("fs");
const path = require("path");
const assert = require("assert");

console.log("=== PENGUJIAN LOGIKA & INTERAKSI DRAG & DROP DIGITAL CLOCK ===");

// Load quiz.js in simulated DOM context
const quizJs = fs.readFileSync(path.join(__dirname, "../js/quiz.js"), "utf8");

class MockElement {
  constructor(id, tag = "div") {
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.className = "";
    this.children = [];
    this.dataset = {};
    this.attributes = {};
    this.style = {};
    this.listeners = {};
    this.classList = {
      _set: new Set(),
      add: (...cls) => cls.forEach(c => this.classList._set.add(c)),
      remove: (...cls) => cls.forEach(c => this.classList._set.delete(c)),
      contains: (c) => this.classList._set.has(c),
      toggle: (c, force) => {
        if (force === undefined) {
          if (this.classList._set.has(c)) this.classList._set.delete(c);
          else this.classList._set.add(c);
        } else if (force) {
          this.classList._set.add(c);
        } else {
          this.classList._set.delete(c);
        }
      }
    };
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  addEventListener(ev, fn) {
    this.listeners[ev] = this.listeners[ev] || [];
    this.listeners[ev].push(fn);
  }

  dispatchEvent(ev, data = {}) {
    const list = this.listeners[ev] || [];
    for (const fn of list) {
      fn({
        preventDefault: () => {},
        stopPropagation: () => {},
        target: this,
        dataTransfer: {
          getData: () => data.val || "",
          setData: () => {}
        },
        ...data
      });
    }
  }

  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k] || this.dataset[k] || null; }
  removeAttribute(k) { delete this.attributes[k]; }

  querySelector(sel) {
    const match = (el) => {
      if (sel.startsWith(".") && el.className.includes(sel.slice(1))) return el;
      if (sel.startsWith("#") && el.id === sel.slice(1)) return el;
      for (const c of el.children) {
        const found = match(c);
        if (found) return found;
      }
      return null;
    };
    return match(this);
  }

  querySelectorAll(sel) {
    const list = [];
    const walk = (el) => {
      if (sel.startsWith(".") && el.className.includes(sel.slice(1))) list.push(el);
      for (const c of el.children) walk(c);
    };
    walk(this);
    return list;
  }

  getBoundingClientRect() {
    return { left: 50, top: 50, right: 150, bottom: 150, width: 100, height: 100 };
  }
}

const elements = {};
function getEl(id) {
  if (!elements[id]) {
    elements[id] = new MockElement(id);
  }
  return elements[id];
}

const mockDocument = {
  getElementById: (id) => getEl(id),
  createElement: (tag) => new MockElement("", tag),
  querySelectorAll: () => [],
  body: new MockElement("body")
};

const vm = require("vm");
const ctx = {
  document: mockDocument,
  window: { addEventListener: () => {} },
  $: (id) => getEl(id),
  escapeHTML: (s) => s,
  playSound: () => {},
  console: console,
  setInterval: () => 123,
  clearInterval: () => {}
};

vm.createContext(ctx);
vm.runInContext(quizJs, ctx);

// Setup Question Q005
const q = {
  id: "Q005",
  type: "clock_drop",
  targetHour: "05",
  targetMinute: "00",
  options: ["05", "00", "07", "30"]
};

// 1. Test createDigitalAlarmClockWidget
const widget = vm.runInContext(`createDigitalAlarmClockWidget(${JSON.stringify(q)})`, ctx);
assert(widget, "Widget jam digital harus berhasil dibuat");
console.log("✓ Widget jam digital berhasil dibuat");

// 2. Test setupDigitalClockDropSlots & drag/drop
vm.runInContext(`
  setupDigitalClockDropSlots(${JSON.stringify(q)});
  placeNumberInSlot("hour", "05", ${JSON.stringify(q)});
`, ctx);

assert.strictEqual(vm.runInContext("currentDroppedHour", ctx), "05", "Hour harus '05'");
console.log("✓ Berhasil menempatkan jam '05' ke slotHour");

vm.runInContext(`
  placeNumberInSlot("minute", "00", ${JSON.stringify(q)});
`, ctx);

assert.strictEqual(vm.runInContext("currentDroppedMinute", ctx), "00", "Minute harus '00'");
console.log("✓ Berhasil menempatkan menit '00' ke slotMinute");

// 3. Test clear slot
vm.runInContext(`
  clearDigitalSlot("hour", ${JSON.stringify(q)});
`, ctx);

assert.strictEqual(vm.runInContext("currentDroppedHour", ctx), null, "Hour harus null setelah di-clear");
console.log("✓ Berhasil mengosongkan slotHour via klik/clear");

console.log("\n SEMUA TEST INTERAKSI LOGIKA DRAG N DROP DIGITAL CLOCK SUKSES!");
