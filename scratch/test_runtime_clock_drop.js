const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

console.log("=== SIMULASI RUNTIME QUIZ CLOCK_DROP ===");

// Dummy minimal DOM environment
const elements = {};

function createElement(tag) {
  const el = {
    tagName: tag.toUpperCase(),
    className: "",
    style: {
      setProperty: (k, v) => { el.style[k] = v; },
      width: "",
      height: "",
      maxWidth: "",
      touchAction: ""
    },
    dataset: {},
    children: [],
    attributes: {},
    appendChild: (child) => {
      el.children.push(child);
      return child;
    },
    addEventListener: (ev, fn) => {
      el._listeners = el._listeners || {};
      el._listeners[ev] = el._listeners[ev] || [];
      el._listeners[ev].push(fn);
    },
    removeEventListener: () => {},
    setAttribute: (k, v) => { el.attributes[k] = v; },
    removeAttribute: (k) => { delete el.attributes[k]; },
    classList: {
      _classes: new Set(),
      add: (...cls) => cls.forEach(c => el.classList._classes.add(c)),
      remove: (...cls) => cls.forEach(c => el.classList._classes.delete(c)),
      contains: (c) => el.classList._classes.has(c)
    },
    querySelector: (sel) => {
      if (sel === ".badge-remove-hint") return createElement("span");
      return null;
    },
    querySelectorAll: () => [],
    cloneNode: () => createElement(tag),
    remove: () => {},
    focus: () => {}
  };
  Object.defineProperty(el, "innerHTML", {
    get: () => el._html || "",
    set: (v) => { el._html = v; }
  });
  Object.defineProperty(el, "textContent", {
    get: () => el._text || "",
    set: (v) => { el._text = v; }
  });
  return el;
}

const mockDoc = {
  getElementById: (id) => elements[id] || (elements[id] = createElement("div")),
  createElement: createElement,
  querySelectorAll: (sel) => {
    return [createElement("div"), createElement("div")];
  },
  querySelector: (sel) => createElement("button"),
  body: createElement("body")
};

const context = {
  document: mockDoc,
  window: {
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  $: (id) => mockDoc.getElementById(id),
  escapeHTML: (str) => String(str || ""),
  showToast: () => {},
  playSound: () => {},
  showStudentPage: () => {},
  console: console,
  setInterval: () => 123,
  clearInterval: () => {},
  setTimeout: (fn) => fn()
};

vm.createContext(context);

// Load quiz.js
const quizCode = fs.readFileSync(path.join(__dirname, "..", "js", "quiz.js"), "utf8");
vm.runInContext(quizCode, context);

const result = vm.runInContext(`
  startQuiz(1);
  const curQ = currentQuizQuestions[currentQuestionIndex];
  placeAnswerInSlot("05.00", curQ, 0);
  const dropped = currentDroppedAnswer;
  submitClockDropAnswer(curQ);
  const correctCount = quizCorrect;
  const streakCount = quizStreak;
  removeAnswerFromSlot(curQ);
  const droppedAfterRemove = currentDroppedAnswer;

  ({
    curQ,
    dropped,
    correctCount,
    streakCount,
    droppedAfterRemove
  });
`, context);

console.log("Soal 1:", result.curQ.id, result.curQ.type, result.curQ.question);
assert.strictEqual(result.curQ.type, "clock_drop", "Soal 1 harus bertipe clock_drop");
assert.strictEqual(result.dropped, "05.00", "Slot harus berisi 05.00");
console.log("✓ placeAnswerInSlot sukses menempatkan 05.00.");

assert.strictEqual(result.correctCount, 1, "Jawaban benar harus menambah quizCorrect");
assert.strictEqual(result.streakCount, 1, "Streak harus bertambah");
console.log("✓ submitClockDropAnswer sukses mengevaluasi jawaban benar.");

assert.strictEqual(result.droppedAfterRemove, null, "currentDroppedAnswer harus null setelah di-reset");
console.log("✓ removeAnswerFromSlot sukses mengosongkan slot.");

console.log("\n SEMUA TEST RUNTIME SUKSES!");
