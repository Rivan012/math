const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

console.log('--- TEST SUITE: LEVEL 5 THREE-STEP DRAG AND DROP WORKSHEET ---');

// 1. Read files
const quizJs = fs.readFileSync(path.join(__dirname, '../js/quiz.js'), 'utf8');
const storageJs = fs.readFileSync(path.join(__dirname, '../js/storage.js'), 'utf8');

// 2. Setup mock DOM and browser environment
const domStore = {};
function createMockElement(tag = 'div', id = '') {
  const el = {
    tagName: tag.toUpperCase(),
    id: id || '',
    className: '',
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); el.className = Array.from(this._classes).join(' '); },
      remove(c) { this._classes.delete(c); el.className = Array.from(this._classes).join(' '); },
      contains(c) { return this._classes.has(c); },
      toggle(c, force) {
        if (force === undefined) {
          if (this.contains(c)) this.remove(c); else this.add(c);
        } else if (force) {
          this.add(c);
        } else {
          this.remove(c);
        }
      }
    },
    dataset: {},
    style: {
      _styles: {},
      setProperty(k, v) { this._styles[k] = v; },
      getPropertyValue(k) { return this._styles[k] || ''; }
    },
    children: [],
    appendChild(child) {
      if (child) {
        child.parentElement = el;
        el.children.push(child);
      }
      return child;
    },
    remove() {
      if (el.parentElement) {
        const idx = el.parentElement.children.indexOf(el);
        if (idx !== -1) el.parentElement.children.splice(idx, 1);
      }
    },
    cloneNode(deep) {
      const cloned = createMockElement(el.tagName, el.id);
      cloned.className = el.className;
      cloned.innerHTML = el.innerHTML;
      return cloned;
    },
    addEventListener(evt, fn) {
      if (!el._listeners) el._listeners = {};
      if (!el._listeners[evt]) el._listeners[evt] = [];
      el._listeners[evt].push(fn);
    },
    dispatchEvent(evt) {
      if (el._listeners && el._listeners[evt.type]) {
        el._listeners[evt.type].forEach(fn => fn(evt));
      }
    },
    removeAttribute(attr) {},
    setAttribute(attr, val) { el[attr] = val; },
    querySelector(sel) {
      if (sel.startsWith('#')) {
        const targetId = sel.slice(1);
        function findId(node) {
          if (node.id === targetId) return node;
          for (const c of (node.children || [])) {
            const found = findId(c);
            if (found) return found;
          }
          return null;
        }
        return findId(el);
      }
      if (sel.startsWith('.')) {
        const cls = sel.slice(1);
        function findClass(node) {
          if (node.classList && node.classList.contains(cls)) return node;
          for (const c of (node.children || [])) {
            const found = findClass(c);
            if (found) return found;
          }
          return null;
        }
        return findClass(el);
      }
      return el.children ? el.children[0] : null;
    },
    querySelectorAll(sel) {
      const results = [];
      function traverse(node) {
        if (!node) return;
        if (sel.startsWith('.')) {
          const cls = sel.slice(1);
          if (node.classList && node.classList.contains(cls)) results.push(node);
        } else if (sel.includes('[data-slot-id="')) {
          const id = sel.split('[data-slot-id="')[1].replace('"]', '');
          if (node.dataset && node.dataset.slotId === id) results.push(node);
        }
        if (node.children) {
          node.children.forEach(traverse);
        }
      }
      traverse(el);
      return results;
    },
    focus() {},
    blur() {},
    offsetWidth: 100,
    getBoundingClientRect() { return { left: 10, top: 10, right: 100, bottom: 50 }; }
  };

  Object.defineProperty(el, 'innerHTML', {
    get() { return el._html || ''; },
    set(val) {
      el._html = val;
      el.children = [];
      // Basic parser for id and class
      const matches = val.matchAll(/id="([^"]+)"/g);
      for (const m of matches) {
        const child = createMockElement('div', m[1]);
        el.appendChild(child);
      }
    }
  });

  if (id) domStore[id] = el;
  return el;
}

// Pre-create standard student page elements
[
  'quizScreen', 'quizCard', 'quizQuestion', 'questionIllustration', 'answerGrid',
  'quizFeedback', 'quizProgressLabel', 'quizProgressFill', 'quizProgressPercent',
  'quizPoints', 'quizLevelBadge', 'hintBox', 'hintBtn', 'nextQuestionBtn',
  'quizTimerText', 'quizTimerBar', 'quizTimerVal', 'quizStreakBanner', 'quizStreakCount',
  'resultScreen', 'resultTitle', 'resultScore', 'resultCorrect', 'resultPoints',
  'resultHints', 'resultStars', 'resultMessage', 'retryQuizBtn', 'resultHomeBtn',
  'btnMatchNext'
].forEach(id => createMockElement('div', id));

const mockDocument = {
  createElement: (tag) => createMockElement(tag),
  getElementById: (id) => domStore[id] || null,
  querySelector: (sel) => {
    if (sel.startsWith('#')) return domStore[sel.slice(1)] || null;
    for (const key of Object.keys(domStore)) {
      const found = domStore[key].querySelector(sel);
      if (found) return found;
    }
    return null;
  },
  querySelectorAll: (sel) => {
    const list = [];
    for (const key of Object.keys(domStore)) {
      const res = domStore[key].querySelectorAll(sel);
      res.forEach(item => { if (!list.includes(item)) list.push(item); });
    }
    return list;
  },
  body: createMockElement('body')
};

const sandbox = {
  console,
  setInterval,
  clearInterval,
  setTimeout,
  clearTimeout,
  document: mockDocument,
  window: {
    location: { protocol: 'http:', href: 'http://localhost:3000/siswa.html' },
    scrollTo: () => {},
    addEventListener: () => {},
    localStorage: {
      _data: {},
      getItem(k) { return this._data[k] || null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; }
    }
  },
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
  },
  $: (id) => domStore[id] || null,
  escapeHTML: (str) => String(str || '').replace(/[&<>"']/g, ''),
  playSound: () => {},
  showToast: () => {},
  showFloatingScore: () => {},
  showStudentPage: () => {},
  updateStreakBanner: () => {},
  currentStudent: { name: 'Budi', points: 0, completedLevels: [] },
  saveCurrentStudent: () => {}
};

vm.createContext(sandbox);

// Execute storage.js and quiz.js
vm.runInContext(storageJs, sandbox);
vm.runInContext(quizJs, sandbox);

// 3. Test assertions
console.log('1. Testing startQuiz(5) initialization...');
vm.runInContext('startQuiz(5)', sandbox);
const currentQuizQuestions = vm.runInContext('currentQuizQuestions', sandbox);
assert.strictEqual(currentQuizQuestions.length, 3, 'Level 5 must contain exactly 3 questions');
assert.strictEqual(currentQuizQuestions[0].type, 'clock_match', 'Question 1 must be clock_match');
assert.strictEqual(currentQuizQuestions[1].type, 'activity_match', 'Question 2 must be activity_match');
assert.strictEqual(currentQuizQuestions[2].type, 'time_of_day_match', 'Question 3 must be time_of_day_match');
console.log('✓ Level 5 initialized with 3 sequential multi-slot questions.');

console.log('2. Testing Question 1 (Mencocokkan Jam - 8 Clocks)...');
const q1 = currentQuizQuestions[0];
assert.strictEqual(q1.clocks.length, 8, 'Question 1 must have 8 clocks');
assert.strictEqual(q1.options.length, 8, 'Question 1 must have 8 draggable options');

// Test clock targets
const expectedQ1 = {
  1: "07:00",
  2: "10:00",
  3: "03:00",
  4: "05:00",
  5: "08:00",
  6: "11:00",
  7: "02:00",
  8: "04:00"
};

// Simulate drop on each clock
Object.keys(expectedQ1).forEach(id => {
  const mockSlot = createMockElement('div');
  mockSlot.dataset.slotId = id;
  const targetVal = expectedQ1[id];

  // Test wrong drop first
  vm.runInContext(`handleMatchDrop`, sandbox)(mockSlot, '99:99', q1);
  assert.ok(mockSlot.classList.contains('slot-wrong-shake'), `Wrong drop on clock ${id} should trigger shake`);

  // Test correct drop
  vm.runInContext(`handleMatchDrop`, sandbox)(mockSlot, targetVal, q1);
  assert.ok(mockSlot.classList.contains('slot-correct'), `Slot ${id} must become slot-correct`);
});

const level5State = vm.runInContext('level5State', sandbox);
assert.strictEqual(Object.keys(level5State.answers.q1).length, 8, 'All 8 clocks in q1 must be solved');
console.log('✓ Question 1: 8 clocks matching validated with instant feedback.');

console.log('3. Testing transition to Question 2 (Kegiatan dan Waktu)...');
vm.runInContext(`onMatchNextClick`, sandbox)(q1);
const currentIndexAfterQ1 = vm.runInContext('currentQuestionIndex', sandbox);
assert.strictEqual(currentIndexAfterQ1, 1, 'Must advance to question index 1');
const q2 = currentQuizQuestions[1];
assert.strictEqual(q2.activities.length, 4, 'Question 2 must have 4 activity cards');
assert.strictEqual(q2.options.length, 4, 'Question 2 must have 4 activity options');

const expectedQ2 = {
  0: "05:00 pagi",
  1: "07:00 pagi",
  2: "05:00 sore",
  3: "09:00 malam"
};

Object.keys(expectedQ2).forEach(idx => {
  const mockSlot = createMockElement('div');
  mockSlot.dataset.slotId = idx;
  vm.runInContext(`handleMatchDrop`, sandbox)(mockSlot, expectedQ2[idx], q2);
  assert.ok(mockSlot.classList.contains('slot-correct'), `Activity slot ${idx} must be slot-correct`);
});

assert.strictEqual(Object.keys(level5State.answers.q2).length, 4, 'All 4 activities in q2 must be solved');
console.log('✓ Question 2: 4 activity cards matching validated.');

console.log('4. Testing transition to Question 3 (Waktu dalam Sehari)...');
vm.runInContext(`onMatchNextClick`, sandbox)(q2);
const currentIndexAfterQ2 = vm.runInContext('currentQuestionIndex', sandbox);
assert.strictEqual(currentIndexAfterQ2, 2, 'Must advance to question index 2');
const q3 = currentQuizQuestions[2];
assert.strictEqual(q3.scenes.length, 4, 'Question 3 must have 4 scenes');
assert.strictEqual(q3.options.length, 4, 'Question 3 must have 4 options');

const expectedQ3 = {
  0: "PAGI",
  1: "SIANG",
  2: "SORE",
  3: "MALAM"
};

Object.keys(expectedQ3).forEach(idx => {
  const mockSlot = createMockElement('div');
  mockSlot.dataset.slotId = idx;
  vm.runInContext(`handleMatchDrop`, sandbox)(mockSlot, expectedQ3[idx], q3);
  assert.ok(mockSlot.classList.contains('slot-correct'), `Scene slot ${idx} must be slot-correct`);
});

assert.strictEqual(Object.keys(level5State.answers.q3).length, 4, 'All 4 scenes in q3 must be solved');
console.log('✓ Question 3: 4 time-of-day scenes matching validated.');

console.log('5. Testing Finish Quiz and Results...');
assert.strictEqual(level5State.totalSolved, 16, 'Total solved items must be exactly 16');
vm.runInContext(`finishQuiz()`, sandbox);

const lastResult = vm.runInContext('lastResult', sandbox);
assert.strictEqual(lastResult.total, 16, 'Total points/items in result must be 16');
assert.strictEqual(lastResult.correct, 16, 'Correct items in result must be 16');
assert.strictEqual(lastResult.score, 100, 'Score must be 100%');
assert.strictEqual(lastResult.stars, 5, 'Level 5 must award 5 stars for 100%');

vm.runInContext(`renderResult()`, sandbox);
assert.strictEqual(domStore['resultTitle'].textContent, 'Hebat! Kamu sudah selesai!', 'Result title must match requirement');
assert.strictEqual(domStore['resultCorrect'].textContent, '16 dari 16', 'Result correct display must be 16 dari 16');
assert.ok(domStore['resultStars'].innerHTML.includes('star-gold.svg'), 'Result must show gold stars');

console.log('✓ Result screen verified: 16 dari 16, 5 gold stars, title "Hebat! Kamu sudah selesai!".');
console.log('ALL TESTS PASSED SUCCESSFULLY (100%)!');
