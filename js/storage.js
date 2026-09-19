/* =========================================================
   TIME QUEST
   storage.js - Manajemen LocalStorage Ber-namespace timequest_
   Sesuai Panduan AGENT.md Bagian 14 & Avatar Vektor Nyata
   ========================================================= */

"use strict";

const STORAGE_KEYS = {
  SESSION: "timequest_session",
  STUDENTS: "timequest_students",
  RESULTS: "timequest_results",
  SETTINGS: "timequest_settings",
  TEACHER: "timequest_teacher",
  MATERIALS: "timequest_materials",
  QUESTIONS: "timequest_questions"
};

// Kredensial demo bawaan sesuai data/guru.csv
const DEMO_TEACHERS = [
  { username: "guru01", password: "123456", nama: "Budi Santoso, S.Pd." },
  { username: "guru02", password: "123456", nama: "Siti Aminah, M.Pd." },
  { username: "admin", password: "1234", nama: "Ratna Dewi, S.Pd." }
];

let currentStudent = null;

const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.error(`Gagal membaca key ${key} dari storage:`, e);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Gagal menyimpan key ${key} ke storage:`, e);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Gagal menghapus key ${key} dari storage:`, e);
    }
  }
};

/**
 * Peta aset avatar vektor orisinal (Bebas emoji ponsel)
 */
const AVATAR_MAP = {
  "budi": "assets/images/avatar-budi.svg",
  "siti": "assets/images/avatar-siti.svg",
  "kancil": "assets/images/avatar-kancil.svg",
  "kelinci": "assets/images/avatar-kelinci.svg",
  "kucing": "assets/images/avatar-kucing.svg",
  "panda": "assets/images/avatar-panda.svg",
  // Kompatibilitas data lama
  "👦": "assets/images/avatar-budi.svg",
  "👧": "assets/images/avatar-siti.svg",
  "🧒": "assets/images/avatar-kancil.svg",
  "🐰": "assets/images/avatar-kelinci.svg",
  "🐱": "assets/images/avatar-kucing.svg",
  "🐼": "assets/images/avatar-panda.svg"
};

/**
 * Helper untuk merender tag <img> avatar vektor
 * @param {string} avatarKey 
 * @param {number} size 
 * @returns {string} Tag HTML img
 */
function getAvatarImg(avatarKey, size = 36) {
  const src = AVATAR_MAP[avatarKey] || "assets/images/avatar-budi.svg";
  return `<img src="${src}" alt="Avatar" width="${size}" height="${size}" class="avatar-vector-badge">`;
}

/**
 * Mengambil daftar seluruh siswa
 * @returns {Array}
 */
function getStudents() {
  const students = Storage.get(STORAGE_KEYS.STUDENTS, []);
  return Array.isArray(students) ? students : [];
}

/**
 * Menyimpan array siswa
 * @param {Array} students 
 */
function saveStudents(students) {
  Storage.set(STORAGE_KEYS.STUDENTS, students);
}

/**
 * Membuat atau memperbarui data siswa
 * @param {string} name 
 * @param {string} className 
 * @param {string} avatar 
 * @returns {Object} Objek siswa
 */
function createStudent(name, className, avatar = "budi") {
  const students = getStudents();
  const cleanName = name.trim();

  const existing = students.find(
    s => s.name.trim().toLowerCase() === cleanName.toLowerCase() && s.className === className
  );

  if (existing) {
    existing.avatar = avatar;
    return existing;
  }

  return {
    id: "S" + String(students.length + 1).padStart(3, "0"),
    name: cleanName,
    className: className,
    avatar: avatar,
    points: 0,
    stars: 0,
    completedLevels: [],
    materialProgress: 0,
    lastScore: null,
    lastCorrect: 0,
    lastTotal: 0,
    lastHints: 0,
    lastPlayed: null,
    createdAt: Date.now()
  };
}

/**
 * Menyimpan sesi dan data siswa aktif saat ini
 */
function saveCurrentStudent() {
  if (!currentStudent) return;

  const students = getStudents();
  const index = students.findIndex(
    s => (s.id && s.id === currentStudent.id) ||
         (s.name.trim().toLowerCase() === currentStudent.name.trim().toLowerCase() && s.className === currentStudent.className)
  );

  if (index >= 0) {
    students[index] = currentStudent;
  } else {
    students.push(currentStudent);
  }

  saveStudents(students);
  Storage.set(STORAGE_KEYS.SESSION, currentStudent);
}

/**
 * Mengisi data demonstrasi siswa awal jika storage kosong
 */
function seedInitialDataIfEmpty() {
  const existing = getStudents();
  if (existing.length === 0) {
    const seed = [
      {
        id: "S001",
        name: "Zahra Aulia",
        className: "Kelas 3 SD",
        avatar: "siti",
        points: 780,
        stars: 15,
        completedLevels: [1, 2, 3, 4, 5],
        materialProgress: 100,
        lastScore: 100,
        lastCorrect: 15,
        lastTotal: 15,
        lastHints: 0,
        lastPlayed: Date.now() - 3600000 * 2,
        createdAt: Date.now() - 86400000
      },
      {
        id: "S002",
        name: "Ahmad Fauzi",
        className: "Kelas 3 SD",
        avatar: "budi",
        points: 620,
        stars: 12,
        completedLevels: [1, 2, 3, 4],
        materialProgress: 100,
        lastScore: 87,
        lastCorrect: 13,
        lastTotal: 15,
        lastHints: 1,
        lastPlayed: Date.now() - 3600000 * 4,
        createdAt: Date.now() - 86400000
      },
      {
        id: "S003",
        name: "Doni Pratama",
        className: "Kelas 2 SD",
        avatar: "kancil",
        points: 450,
        stars: 9,
        completedLevels: [1, 2, 3],
        materialProgress: 80,
        lastScore: 80,
        lastCorrect: 12,
        lastTotal: 15,
        lastHints: 2,
        lastPlayed: Date.now() - 3600000 * 8,
        createdAt: Date.now() - 86400000 * 2
      },
      {
        id: "S004",
        name: "Bintang Kejora",
        className: "Kelas 4 SD",
        avatar: "kelinci",
        points: 390,
        stars: 7,
        completedLevels: [1, 2],
        materialProgress: 60,
        lastScore: 73,
        lastCorrect: 11,
        lastTotal: 15,
        lastHints: 1,
        lastPlayed: Date.now() - 3600000 * 12,
        createdAt: Date.now() - 86400000 * 3
      },
      {
        id: "S005",
        name: "Rian Ardiansyah",
        className: "Kelas 2 SD",
        avatar: "kucing",
        points: 280,
        stars: 5,
        completedLevels: [1],
        materialProgress: 40,
        lastScore: 67,
        lastCorrect: 10,
        lastTotal: 15,
        lastHints: 2,
        lastPlayed: Date.now() - 3600000 * 18,
        createdAt: Date.now() - 86400000 * 4
      }
    ];
    saveStudents(seed);
  }
}

/* =========================================================
   DATA BAWAAN & MANAJEMEN MATERI BELAJAR
   ========================================================= */

const DEFAULT_MATERIALS = [
  {
    id: "M001",
    level: 1,
    title: "Mengenal Jam Analog",
    content: "Jam analog memiliki angka 1 sampai 12. Jarum pendek menunjukkan jam dan jarum panjang menunjukkan menit.",
    tip: "Jarum panjang ke angka 12 berarti menit 00."
  },
  {
    id: "M002",
    level: 2,
    title: "Membaca Jam Tepat",
    content: "Jika jarum panjang berada di angka 12, waktu menunjukkan tepat satu jam. Contoh: jarum pendek di 3 dan jarum panjang di 12 dibaca pukul 03.00.",
    tip: "Perhatikan posisi jarum pendek untuk menentukan jamnya."
  },
  {
    id: "M003",
    level: 3,
    title: "Membaca Setengah Jam",
    content: "Jika jarum panjang berada di angka 6, artinya telah berjalan 30 menit atau setengah jam. Contoh: pukul 04.30 dibaca setengah lima.",
    tip: "Angka 6 pada jarum panjang selalu bernilai 30 menit."
  },
  {
    id: "M004",
    level: 4,
    title: "Jam Digital",
    content: "Jam digital menampilkan angka secara langsung. Angka sebelum titik adalah jam dan setelah titik adalah menit. Contoh: 07.00.",
    tip: "07.00 berarti pukul tujuh tepat."
  },
  {
    id: "M005",
    level: 5,
    title: "Urutan Kegiatan",
    content: "Kegiatan sehari-hari berlangsung secara teratur: Pagi hari (sarapan & sekolah) → Siang hari (istirahat/makan siang) → Sore hari (bermain/mengaji) → Malam hari (tidur).",
    tip: "Matahari terbit di pagi hari dan terbenam di sore hari."
  },
  {
    id: "M006",
    level: 5,
    title: "Lama Kegiatan",
    content: "Durasi adalah selisih waktu selesai dikurangi waktu mulai. Contoh: Ani mulai belajar pukul 08.00 dan selesai pukul 09.00, maka lama belajar = 1 jam (60 menit).",
    tip: "Durasi = Waktu Selesai − Waktu Mulai."
  }
];

function getMaterials() {
  const materials = Storage.get(STORAGE_KEYS.MATERIALS, null);
  if (!materials || !Array.isArray(materials) || materials.length === 0) {
    return JSON.parse(JSON.stringify(DEFAULT_MATERIALS));
  }
  return materials;
}

function saveMaterials(materials) {
  Storage.set(STORAGE_KEYS.MATERIALS, materials);
}

function resetMaterials() {
  Storage.remove(STORAGE_KEYS.MATERIALS);
}

/* =========================================================
   DATA BAWAAN & MANAJEMEN SOAL KUIS
   ========================================================= */

const DEFAULT_QUESTIONS = [
  {
    id: "Q001",
    level: 1,
    type: "mcq",
    question: "Jarum panjang pada jam menunjukkan angka 12. Apa artinya?",
    options: ["Menit 15", "Menit 30", "Menit 00", "Menit 45"],
    correct: 2,
    points: 100,
    hint: "Jarum panjang di angka 12 berarti tepat satu jam.",
    explanation: "Angka 12 pada jarum panjang menunjukkan menit 00."
  },
  {
    id: "Q002",
    level: 1,
    type: "clock",
    hour: 3,
    minute: 0,
    question: "Pukul berapakah waktu yang ditunjukkan jam berikut?",
    options: ["02.00", "03.00", "03.30", "12.03"],
    correct: 1,
    points: 100,
    hint: "Jarum panjang di 12 berarti menit 00.",
    explanation: "Jarum pendek di 3 dan jarum panjang di 12 menunjukkan pukul 03.00."
  },
  {
    id: "Q003",
    level: 1,
    type: "clock",
    hour: 6,
    minute: 0,
    question: "Jam menunjukkan jarum pendek di angka 6 dan jarum panjang di angka 12. Waktunya adalah...",
    options: ["06.00", "12.06", "06.30", "05.00"],
    correct: 0,
    points: 100,
    hint: "Jarum pendek menunjukkan jam.",
    explanation: "Jarum pendek di 6 dan jarum panjang di 12 berarti pukul 06.00."
  },
  {
    id: "Q004",
    level: 2,
    type: "clock",
    hour: 9,
    minute: 0,
    question: "Jam analog menunjukkan pukul berapa?",
    options: ["08.00", "09.00", "09.30", "12.09"],
    correct: 1,
    points: 100,
    hint: "Jarum panjang berada di 12.",
    explanation: "Jarum pendek di 9 menunjukkan pukul 09.00."
  },
  {
    id: "Q005",
    level: 2,
    type: "mcq",
    question: "Pukul 07.00 dibaca sebagai...",
    options: ["Setengah tujuh", "Pukul tujuh tepat", "Pukul delapan tepat", "Pukul tujuh lewat tiga puluh menit"],
    correct: 1,
    points: 100,
    hint: "Angka setelah titik menunjukkan menit.",
    explanation: "07.00 berarti pukul tujuh tepat."
  },
  {
    id: "Q006",
    level: 2,
    type: "clock",
    hour: 2,
    minute: 30,
    question: "Jarum panjang berada di angka 6 dan jarum pendek di antara 2 dan 3. Waktunya adalah...",
    options: ["02.00", "03.30", "02.30", "06.02"],
    correct: 2,
    points: 100,
    hint: "Angka 6 pada jarum panjang berarti 30 menit.",
    explanation: "Jarum pendek di antara 2 dan 3 menunjukkan pukul 02.30."
  },
  {
    id: "Q007",
    level: 3,
    type: "mcq",
    question: "Satu jam sama dengan berapa menit?",
    options: ["30 menit", "45 menit", "60 menit", "100 menit"],
    correct: 2,
    points: 100,
    hint: "Satu jam terdiri dari enam puluh menit.",
    explanation: "1 jam = 60 menit."
  },
  {
    id: "Q008",
    level: 3,
    type: "mcq",
    question: "Setengah jam sama dengan...",
    options: ["15 menit", "20 menit", "30 menit", "60 menit"],
    correct: 2,
    points: 100,
    hint: "Setengah dari 60 menit.",
    explanation: "60 ÷ 2 = 30 menit."
  },
  {
    id: "Q009",
    level: 3,
    type: "mcq",
    question: "Pukul 08.00 sampai 09.00 adalah berapa lama?",
    options: ["30 menit", "1 jam", "2 jam", "15 menit"],
    correct: 1,
    points: 100,
    hint: "Hitung selisih jam 8 dan jam 9.",
    explanation: "Dari pukul 08.00 sampai 09.00 adalah 1 jam."
  },
  {
    id: "Q010",
    level: 4,
    type: "mcq",
    question: "Kegiatan manakah yang biasanya dilakukan pada pagi hari?",
    options: ["Tidur malam", "Sarapan", "Makan malam", "Tidur tengah malam"],
    correct: 1,
    points: 100,
    hint: "Pagi hari biasanya sebelum berangkat sekolah.",
    explanation: "Sarapan biasanya dilakukan pada pagi hari sebelum sekolah."
  },
  {
    id: "Q011",
    level: 4,
    type: "mcq",
    question: "Urutan waktu yang benar adalah...",
    options: [
      "Malam → Pagi → Siang → Sore",
      "Pagi → Siang → Sore → Malam",
      "Siang → Malam → Pagi → Sore",
      "Sore → Pagi → Malam → Siang"
    ],
    correct: 1,
    points: 100,
    hint: "Mulai dari saat matahari terbit.",
    explanation: "Urutan umum waktu adalah pagi, siang, sore, lalu malam."
  },
  {
    id: "Q012",
    level: 4,
    type: "mcq",
    question: "Ani mulai belajar pukul 07.00 dan selesai pukul 08.00. Berapa lama Ani belajar?",
    options: ["30 menit", "1 jam", "2 jam", "3 jam"],
    correct: 1,
    points: 100,
    hint: "08 dikurangi 07.",
    explanation: "08.00 − 07.00 = 1 jam."
  },
  {
    id: "Q013",
    level: 5,
    type: "mcq",
    question: "Budi bermain dari pukul 15.00 sampai 15.30. Lama bermain Budi adalah...",
    options: ["15 menit", "20 menit", "30 menit", "1 jam"],
    correct: 2,
    points: 100,
    hint: "Angka 30 menunjukkan setengah jam.",
    explanation: "Dari 15.00 sampai 15.30 adalah 30 menit."
  },
  {
    id: "Q014",
    level: 5,
    type: "mcq",
    question: "Siti mulai membaca pukul 09.00 selama 2 jam. Pukul berapa Siti selesai membaca?",
    options: ["09.30", "10.00", "11.00", "12.00"],
    correct: 2,
    points: 100,
    hint: "Tambahkan 2 jam dari pukul 09.00.",
    explanation: "09.00 + 2 jam = 11.00."
  },
  {
    id: "Q015",
    level: 5,
    type: "mcq",
    question: "Ayah berangkat pukul 06.30 dan tiba pukul 07.00. Berapa lama perjalanan Ayah?",
    options: ["15 menit", "30 menit", "1 jam", "2 jam"],
    correct: 1,
    points: 100,
    hint: "Hitung dari menit 30 ke menit 60.",
    explanation: "Dari 06.30 sampai 07.00 adalah 30 menit."
  }
];

function getQuestions() {
  const questions = Storage.get(STORAGE_KEYS.QUESTIONS, null);
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
  }
  return questions;
}

function saveQuestions(questions) {
  Storage.set(STORAGE_KEYS.QUESTIONS, questions);
}

function resetQuestions() {
  Storage.remove(STORAGE_KEYS.QUESTIONS);
}
