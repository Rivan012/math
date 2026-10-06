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
 * Deteksi lingkungan server HTTP lokal
 */
const IS_SERVER_MODE = typeof window !== "undefined" &&
  (window.location.protocol === "http:" || window.location.protocol === "https:");

/**
 * Mengambil data siswa dari server jika dalam mode server
 * @returns {Promise<Array>}
 */
async function fetchStudentsFromServer() {
  if (!IS_SERVER_MODE) return getStudents();
  try {
    const res = await fetch("/api/students");
    if (!res.ok) throw new Error("Gagal mengambil data siswa dari server");
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      // Simpan ke localStorage sebagai cache lokal
      Storage.set(STORAGE_KEYS.STUDENTS, json.data);
      // Jika siswa aktif saat ini ada dalam daftar, perbarui objek currentStudent
      if (currentStudent) {
        const matched = json.data.find(s => s.id === currentStudent.id);
        if (matched) {
          currentStudent = matched;
          Storage.set(STORAGE_KEYS.SESSION, currentStudent);
        }
      }
      return json.data;
    }
  } catch (err) {
    console.warn("Server lokal belum siap atau mode offline, menggunakan data lokal:", err);
  }
  return getStudents();
}

/**
 * Mengirim pembaruan data siswa ke server lokal secara background
 * @param {Object} student 
 */
async function pushStudentToServer(student) {
  if (!IS_SERVER_MODE || !student) return;
  try {
    await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student)
    });
  } catch (err) {
    console.warn("Gagal mengirim pembaruan siswa ke server:", err);
  }
}

/**
 * Mengirim data seluruh siswa secara massal ke server
 * @param {Array} students 
 */
async function pushAllStudentsToServer(students) {
  if (!IS_SERVER_MODE || !Array.isArray(students)) return;
  try {
    await fetch("/api/students/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(students)
    });
  } catch (err) {
    console.warn("Gagal sinkronisasi massal siswa ke server:", err);
  }
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
  if (IS_SERVER_MODE) {
    pushAllStudentsToServer(students);
  }
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
    studiedLevels: [],
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

  if (IS_SERVER_MODE) {
    pushStudentToServer(currentStudent);
  }
}

/**
 * Mengambil data sesi siswa yang sedang aktif dari storage
 * @returns {Object|null}
 */
function getCurrentStudent() {
  if (currentStudent) return currentStudent;
  const session = Storage.get(STORAGE_KEYS.SESSION, null);
  if (session && (session.id || session.name)) {
    currentStudent = session;
    return currentStudent;
  }
  return null;
}

/**
 * Menghapus data sesi siswa aktif (saat logout)
 */
function clearCurrentStudent() {
  currentStudent = null;
  Storage.remove(STORAGE_KEYS.SESSION);
}

/**
 * Mengisi data demonstrasi siswa awal jika storage kosong
 */
async function seedInitialDataIfEmpty() {
  if (Storage.get("timequest_curriculum_version") !== "4.0") {
    Storage.set(STORAGE_KEYS.MATERIALS, JSON.parse(JSON.stringify(DEFAULT_MATERIALS)));
    Storage.set(STORAGE_KEYS.QUESTIONS, JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)));
    Storage.set("timequest_curriculum_version", "4.0");
  }

  if (IS_SERVER_MODE) {
    // Pada mode server, selalu ambil data dari data/siswa.csv di server
    await fetchStudentsFromServer();
    return;
  }

  const isInitialized = Storage.get("timequest_initialized", false);
  if (isInitialized) return;

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
  if (Storage.get("timequest_curriculum_version") !== "3.9") {
    Storage.set(STORAGE_KEYS.MATERIALS, JSON.parse(JSON.stringify(DEFAULT_MATERIALS)));
    Storage.set(STORAGE_KEYS.QUESTIONS, JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)));
    Storage.set("timequest_curriculum_version", "3.9");
  }
  Storage.set("timequest_initialized", true);
}

/* =========================================================
   DATA BAWAAN & MANAJEMEN MATERI BELAJAR
   ========================================================= */

const DEFAULT_MATERIALS = [
  {
    id: "M001",
    level: 1,
    title: "Anatomi Jam Analog",
    content: "Jam analog memiliki jarum jam dan angka 1 sampai 12. Jarum pendek menunjukkan JAM dan jarum panjang menunjukkan MENIT. Jam membantu kita mengetahui waktu sehari-hari seperti saat Halim bangun tidur pukul 5 pagi.",
    tip: "Jarum pendek menunjukkan jam, jarum panjang menunjukkan menit."
  },
  {
    id: "M002",
    level: 1,
    title: "Membaca Jam Tepat dan Setengah",
    content: "Jika jarum panjang berada di angka 12, maka waktu menunjukkan tepat (contoh: jarum pendek di 5 dan jarum panjang di 12 dibaca pukul 5 tepat atau 05.00). Jika jarum panjang di angka 6, artinya berjalan 30 menit atau setengah jam (contoh: 04.30 dibaca setengah lima).",
    tip: "Jarum panjang di 12 = menit 00 (tepat). Jarum panjang di 6 = menit 30 (setengah jam)."
  },
  {
    id: "M003",
    level: 2,
    title: "Anatomi Jam Digital",
    content: "Jam digital menampilkan waktu dalam bentuk angka secara langsung tanpa jarum. Pada tampilan 05:00, dua angka di sebelah KIRI (05) menunjukkan JAM, dan dua angka di sebelah KANAN (00) menunjukkan MENIT.",
    tip: "Sebelah kiri adalah jam, sebelah kanan adalah menit."
  },
  {
    id: "M004",
    level: 2,
    title: "Membaca Jam Digital Sehari-hari",
    content: "Jam digital sangat mudah dibaca. Angka 07:00 dibaca pukul tujuh tepat. Jika menunjukkan 07:30, dibaca pukul tujuh lewat tiga puluh menit atau setengah delapan. Jam digital sering kita temukan pada jam meja, ponsel, dan jam tangan pintar.",
    tip: "07:00 sama dengan jarum pendek di 7 dan jarum panjang di 12 pada jam analog."
  },
  {
    id: "M005",
    level: 3,
    title: "Lama dan Sebentarnya Waktu",
    content: "Setiap kegiatan memerlukan waktu yang berbeda-beda. Ada kegiatan yang memerlukan waktu sebentar seperti meminum air dan menggosok gigi, dan ada kegiatan yang memerlukan waktu lama seperti memasak dan tidur malam.",
    tip: "Meminum air dan menggosok gigi = sebentar (detik/menit). Memasak dan tidur malam = lama (menit/jam)."
  },
  {
    id: "M007",
    level: 4,
    title: "Pagi, Siang, Sore, dan Malam",
    content: "Dalam satu hari ada empat pembagian waktu utama: PAGI hari (saat matahari terbit), SIANG hari (matahari terik di atas kepala), SORE hari (matahari mulai condong dan terbenam), serta MALAM hari (gelap dan tampak bulan serta bintang).",
    tip: "Pagi → Siang → Sore → Malam berlangsung secara teratur setiap hari."
  }
];

function getMaterials() {
  if (Storage.get("timequest_curriculum_version") !== "3.9") {
    Storage.set(STORAGE_KEYS.MATERIALS, JSON.parse(JSON.stringify(DEFAULT_MATERIALS)));
    Storage.set(STORAGE_KEYS.QUESTIONS, JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)));
    Storage.set("timequest_curriculum_version", "3.9");
    return JSON.parse(JSON.stringify(DEFAULT_MATERIALS));
  }
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
   DATA BAWAAN & MANAJEMEN SOAL KUIS (4 UNIT KURIKULUM RESMI)
   ========================================================= */

const DEFAULT_QUESTIONS = [
  /* UNIT 1: MENGENAL JAM ANALOG — Mengarahkan Jarum Jam */
  {
    id: "Q001",
    level: 1,
    type: "clock_drag",
    targetHour: 7,
    targetMinute: 35,
    targetTime: "07.35",
    question: "Arahkan jarum jam ke pukul 07.35!",
    points: 100,
    hint: "Arahkan jarum pendek (merah) melewati angka 7, dan jarum panjang (biru) ke angka 7 (menit 35).",
    explanation: "Pukul 07.35 artinya jarum pendek berada di antara angka 7 dan 8, sedangkan jarum panjang menunjuk angka 7 (35 menit)."
  },
  {
    id: "Q002",
    level: 1,
    type: "clock_drag",
    targetHour: 12,
    targetMinute: 0,
    targetTime: "12.00",
    question: "Arahkan jarum jam ke pukul 12.00!",
    points: 100,
    hint: "Arahkan kedua jarum jam (pendek merah dan panjang biru) lurus ke atas pada angka 12.",
    explanation: "Pukul 12.00 artinya kedua jarum jam sama-sama tegak lurus menunjuk angka 12."
  },
  {
    id: "Q003",
    level: 1,
    type: "clock_drag",
    targetHour: 1,
    targetMinute: 45,
    targetTime: "01.45",
    question: "Arahkan jarum jam ke pukul 01.45!",
    points: 100,
    hint: "Arahkan jarum pendek (merah) mendekati angka 2, dan jarum panjang (biru) ke angka 9 (menit 45).",
    explanation: "Pukul 01.45 artinya jarum pendek mendekati angka 2 dan jarum panjang menunjuk angka 9 (45 menit)."
  },
  {
    id: "Q004",
    level: 1,
    type: "clock_drag",
    targetHour: 8,
    targetMinute: 0,
    targetTime: "08.00",
    question: "Arahkan jarum jam ke pukul 08.00!",
    points: 100,
    hint: "Arahkan jarum pendek (merah) ke angka 8, dan jarum panjang (biru) ke angka 12 (menit 00).",
    explanation: "Pukul 08.00 artinya jarum pendek menunjuk angka 8 dan jarum panjang menunjuk angka 12."
  },
  {
    id: "Q004A",
    level: 1,
    type: "clock_drag",
    targetHour: 4,
    targetMinute: 30,
    targetTime: "04.30",
    question: "Arahkan jarum jam ke pukul 04.30!",
    points: 100,
    hint: "Arahkan jarum pendek (merah) di antara angka 4 dan 5, dan jarum panjang (biru) ke angka 6 (menit 30).",
    explanation: "Pukul 04.30 (setengah lima) artinya jarum pendek di tengah angka 4 dan 5, sedangkan jarum panjang menunjuk angka 6 (30 menit)."
  },
  {
    id: "Q004B",
    level: 1,
    type: "clock_drag",
    targetHour: 11,
    targetMinute: 20,
    targetTime: "11.20",
    question: "Arahkan jarum jam ke pukul 11.20!",
    points: 100,
    hint: "Arahkan jarum pendek (merah) sedikit melewati angka 11, dan jarum panjang (biru) ke angka 4 (menit 20).",
    explanation: "Pukul 11.20 artinya jarum pendek melewati angka 11 dan jarum panjang menunjuk angka 4 (20 menit)."
  },

  /* UNIT 2: MENGENAL JAM DIGITAL — Drag & Drop Angka (Jam) dan (Menit) ke Jam Digital */
  {
    id: "Q005",
    level: 2,
    type: "clock_drop",
    targetHour: "05",
    targetMinute: "00",
    question: "Halim bangun tidur pukul 5 pagi. Pasangkan angka (jam) dan (menit) yang tepat pada jam digital!",
    options: ["07", "30", "05", "12", "00", "06"],
    points: 100,
    hint: "Pasangkan angka 05 pada kotak Jam dan angka 00 pada kotak Menit.",
    explanation: "Pukul 5 pagi pada jam digital: angka jam diisi 05 dan angka menit diisi 00 (05:00)."
  },
  {
    id: "Q006",
    level: 2,
    type: "clock_drop",
    targetHour: "07",
    targetMinute: "00",
    question: "Tika berangkat ke sekolah pukul 7 pagi. Pasangkan angka (jam) dan (menit) yang tepat pada jam digital!",
    options: ["30", "07", "05", "00", "08", "15"],
    points: 100,
    hint: "Pasangkan angka 07 pada kotak Jam dan angka 00 pada kotak Menit.",
    explanation: "Pukul 7 pagi pada jam digital: angka jam diisi 07 dan angka menit diisi 00 (07:00)."
  },
  {
    id: "Q007",
    level: 2,
    type: "clock_drop",
    targetHour: "12",
    targetMinute: "00",
    question: "Jam istirahat dan makan siang di sekolah pukul 12 siang. Pasangkan angka (jam) dan (menit) yang tepat!",
    options: ["06", "30", "12", "01", "00", "10"],
    points: 100,
    hint: "Pasangkan angka 12 pada kotak Jam dan angka 00 pada kotak Menit.",
    explanation: "Pukul 12 siang pada jam digital: angka jam diisi 12 dan angka menit diisi 00 (12:00)."
  },
  {
    id: "Q008",
    level: 2,
    type: "clock_drop",
    targetHour: "09",
    targetMinute: "30",
    question: "Belajar malam pada pukul setengah sepuluh (09.30). Pasangkan angka (jam) dan (menit) yang tepat!",
    options: ["00", "09", "15", "08", "30", "12"],
    points: 100,
    hint: "Pasangkan angka 09 pada kotak Jam dan angka 30 pada kotak Menit.",
    explanation: "Pukul setengah sepuluh malam pada jam digital: angka jam diisi 09 dan angka menit diisi 30 (09:30)."
  },

  /* UNIT 3: LEBIH LAMA ATAU LEBIH CEPAT (Beri tanda centang pada kegiatan) */
  {
    id: "Q009",
    level: 3,
    type: "time_compare",
    question: "Beri tanda centang (✓) pada kegiatan yang lebih lama!",
    items: [
      { label: "Menyisir rambut", img: "assets/images/activity_combing.png" },
      { label: "Mandi", img: "assets/images/activity_bathing.png" }
    ],
    options: ["Menyisir rambut", "Mandi"],
    correct: 1,
    points: 100,
    hint: "Bandingkan waktu menyisir rambut (sekitar 1 menit) dengan mandi (sekitar 15 menit).",
    explanation: "Mandi memerlukan waktu lebih lama (sekitar 15 menit) dibandingkan menyisir rambut yang hanya butuh waktu sebentar (1 menit)."
  },
  {
    id: "Q010",
    level: 3,
    type: "time_compare",
    question: "Beri tanda centang (✓) pada kegiatan yang lebih sebentar (lebih cepat)!",
    items: [
      { label: "Memasak", img: "assets/images/activity_cooking.png" },
      { label: "Meminum air", img: "assets/images/activity_drinking.png" }
    ],
    options: ["Memasak", "Meminum air"],
    correct: 1,
    points: 100,
    hint: "Meminum air hanya butuh beberapa tegukan sebentar saja, sedangkan memasak butuh waktu lama.",
    explanation: "Meminum segelas air memerlukan waktu lebih sebentar / lebih cepat (beberapa detik hingga 1 menit), sedangkan memasak memerlukan waktu lebih lama."
  },
  {
    id: "Q011",
    level: 3,
    type: "time_compare",
    question: "Beri tanda centang (✓) pada kegiatan yang lebih lama!",
    items: [
      { label: "Tidur malam", img: "assets/images/activity_sleeping.png" },
      { label: "Menyikat gigi", img: "assets/images/activity_brushing.png" }
    ],
    options: ["Tidur malam", "Menyikat gigi"],
    correct: 0,
    points: 100,
    hint: "Tidur malam berlangsung sekitar 8 jam sampai pagi, sedangkan menyikat gigi hanya 2 menit.",
    explanation: "Tidur malam memerlukan waktu lebih lama (sekitar 8 jam) dibandingkan menyikat gigi yang hanya 2 menit."
  },
  {
    id: "Q012",
    level: 3,
    type: "time_compare",
    question: "Beri tanda centang (✓) pada kegiatan yang lebih lama!",
    items: [
      { label: "Belajar di sekolah", img: "assets/images/activity_studying.png" },
      { label: "Sarapan", img: "assets/images/activity_breakfast.png" }
    ],
    options: ["Belajar di sekolah", "Sarapan"],
    correct: 0,
    points: 100,
    hint: "Belajar di sekolah berlangsung berjam-jam dari pagi hingga siang hari, sedangkan sarapan sekitar 15 menit.",
    explanation: "Belajar di sekolah berlangsung berjam-jam (sekitar 5 jam), jauh lebih lama dari sarapan pagi."
  },

  /* UNIT 4: MENGENAL WAKTU KEGIATAN — Drag & Drop Pilihan Waktu ke Kotak Kegiatan */
  {
    id: "Q013",
    level: 4,
    type: "clock_activity_drop",
    img: "assets/images/time_activity_school.png",
    targetAnswer: "Pukul 7 pagi",
    question: "Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:",
    options: ["Pukul 7 pagi", "Pukul 7 malam", "Pukul 8 pagi", "Pukul 12 siang"],
    correct: 0,
    points: 100,
    hint: "Jarum pendek menunjuk angka 7 pada pagi hari saat anak-anak berangkat sekolah.",
    explanation: "Jarum jam menunjuk angka 7 tepat di pagi hari saat anak-anak berangkat sekolah, yaitu Pukul 7 pagi."
  },
  {
    id: "Q014",
    level: 4,
    type: "clock_activity_drop",
    img: "assets/images/time_activity_class.png",
    targetAnswer: "Pukul 8 pagi",
    question: "Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:",
    options: ["Pukul 8 pagi", "Pukul 8 malam", "Pukul 7 pagi", "Pukul 1 siang"],
    correct: 0,
    points: 100,
    hint: "Jarum pendek menunjuk angka 8 pada pagi hari saat belajar di kelas bersama guru.",
    explanation: "Jarum jam menunjuk angka 8 tepat saat murid belajar di sekolah di pagi hari, yaitu Pukul 8 pagi."
  },
  {
    id: "Q015",
    level: 4,
    type: "clock_activity_drop",
    img: "assets/images/time_activity_football.png",
    targetAnswer: "Pukul 5 sore",
    question: "Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:",
    options: ["Pukul 5 sore", "Pukul 5 pagi", "Pukul 4 sore", "Pukul 8 malam"],
    correct: 0,
    points: 100,
    hint: "Jarum pendek menunjuk angka 5 menjelang matahari terbenam di sore hari saat bermain sepak bola.",
    explanation: "Jarum jam menunjuk angka 5 saat bermain bola di sore hari menjelang matahari terbenam, yaitu Pukul 5 sore."
  },
  {
    id: "Q016",
    level: 4,
    type: "clock_activity_drop",
    img: "assets/images/time_activity_sleep.png",
    targetAnswer: "Pukul 8 malam",
    question: "Amati gambar dan jam analog berikut! Pasangkan keterangan waktu kegiatan yang tepat:",
    options: ["Pukul 8 malam", "Pukul 8 pagi", "Pukul 6 pagi", "Pukul 5 sore"],
    correct: 0,
    points: 100,
    hint: "Jarum pendek menunjuk angka 8 dan tampak bulan sabit di jendela saat tidur malam.",
    explanation: "Jarum jam menunjuk angka 8 tepat saat tidur malam dengan pemandangan bulan dan bintang, yaitu Pukul 8 malam."
  },

  /* UNIT 5: KUIS CAMPURAN WAKTU — Drag & Drop Matching (3 Soal / Halaman) */
  {
    id: "Q017",
    level: 5,
    type: "clock_match",
    title: "Mencocokkan Jam",
    question: "Pasangkan gambar jam dengan waktu yang tepat!",
    instruction: "Tarik waktu yang sesuai ke dalam kotak di bawah gambar jam.",
    step: 1,
    clocks: [
      { id: 1, hour: 7, minute: 0, answer: "07:00", altAnswers: ["05:00", "07:00"], bg: "#FCE7F3", borderColor: "#F472B6" },
      { id: 2, hour: 10, minute: 0, answer: "10:00", bg: "#E0F2FE", borderColor: "#38BDF8" },
      { id: 3, hour: 3, minute: 0, answer: "03:00", bg: "#FEF3C7", borderColor: "#FBBF24" },
      { id: 4, hour: 5, minute: 0, answer: "05:00", bg: "#F3E8FF", borderColor: "#C084FC" },
      { id: 5, hour: 8, minute: 0, answer: "08:00", bg: "#DCFCE7", borderColor: "#4ADE80" },
      { id: 6, hour: 11, minute: 0, answer: "11:00", bg: "#EDE9FE", borderColor: "#A78BFA" },
      { id: 7, hour: 2, minute: 0, answer: "02:00", bg: "#FFEDD5", borderColor: "#FB923C" },
      { id: 8, hour: 4, minute: 0, answer: "04:00", bg: "#CCFBF1", borderColor: "#2DD4BF" }
    ],
    options: ["08:00", "11:00", "02:00", "04:00", "07:00", "10:00", "03:00", "05:00"],
    points: 8,
    hint: "Perhatikan jarum pendek yang menunjukkan angka jam. Jarum panjang di angka 12 menunjukkan menit 00.",
    explanation: "Jarum pendek menunjuk angka jam dan jarum panjang di angka 12 berarti menit :00."
  },
  {
    id: "Q018",
    level: 5,
    type: "activity_match",
    title: "Kegiatan dan Waktu",
    question: "Amati gambar kegiatan berikut, lalu pilih waktu yang sesuai!",
    instruction: "Tarik waktu yang sesuai ke gambar kegiatan.",
    step: 2,
    activities: [
      { label: "Anak bangun tidur", code: "A", img: "assets/images/kegiatan_bangun_tidur.png", answer: "05:00 pagi", altAnswers: ["05.00 pagi", "05:00 pagi"] },
      { label: "Anak sarapan", code: "B", img: "assets/images/kegiatan_sarapan.png", answer: "07:00 pagi", altAnswers: ["07.00 pagi", "07:00 pagi"] },
      { label: "Anak bermain sepak bola", code: "C", img: "assets/images/kegiatan_sepak_bola.png", answer: "05:00 sore", altAnswers: ["05.00 sore", "05:00 sore"] },
      { label: "Anak membaca buku", code: "D", img: "assets/images/kegiatan_baca_buku.png", answer: "09:00 malam", altAnswers: ["09.00 malam", "09:00 malam"] }
    ],
    options: ["05:00 pagi", "07:00 pagi", "05:00 sore", "09:00 malam"],
    points: 4,
    hint: "Bangun tidur di pagi buta (05:00 pagi), sarapan sebelum sekolah (07:00 pagi), main bola sore hari (05:00 sore), membaca buku malam hari (09:00 malam).",
    explanation: "Bangun tidur pukul 05:00 pagi, sarapan pukul 07:00 pagi, bermain bola pukul 05:00 sore, dan membaca buku pukul 09:00 malam."
  },
  {
    id: "Q019",
    level: 5,
    type: "time_of_day_match",
    title: "Waktu dalam Sehari",
    question: "Tarik waktu yang sesuai ke dalam kotak!",
    instruction: "Perhatikan gambar, lalu tarik waktu yang sesuai.",
    step: 3,
    scenes: [
      { label: "Ayam berkokok + matahari terbit", id: 1, img: "assets/images/waktu_pagi.png", answer: "PAGI", altAnswers: ["PAGI", "🌅 PAGI", "Pagi", "🌅 Pagi"] },
      { label: "Matahari bersinar terang di langit", id: 2, img: "assets/images/waktu_siang.png", answer: "SIANG", altAnswers: ["SIANG", "☀️ SIANG", "Siang", "☀️ Siang"] },
      { label: "Matahari terbenam", id: 3, img: "assets/images/waktu_sore.png", answer: "SORE", altAnswers: ["SORE", "🌇 SORE", "Sore", "🌇 Sore"] },
      { label: "Bulan dan bintang", id: 4, img: "assets/images/waktu_malam.png", answer: "MALAM", altAnswers: ["MALAM", "🌙 MALAM", "Malam", "🌙 Malam"] }
    ],
    options: ["PAGI", "SIANG", "SORE", "MALAM"],
    points: 4,
    hint: "Ayam berkokok menandai pagi, matahari terik adalah siang, langit jingga saat sore, dan bulan bintang saat malam.",
    explanation: "Pagi ditandai ayam berkokok & matahari terbit, Siang saat matahari terik, Sore saat matahari terbenam, dan Malam saat tampak bulan & bintang."
  }
];

function getQuestions() {
  if (Storage.get("timequest_curriculum_version") !== "3.9") {
    Storage.set(STORAGE_KEYS.MATERIALS, JSON.parse(JSON.stringify(DEFAULT_MATERIALS)));
    Storage.set(STORAGE_KEYS.QUESTIONS, JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)));
    Storage.set("timequest_curriculum_version", "3.9");
    return JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
  }
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

// Auto sync curriculum version on load
(function autoSyncCurriculum() {
  try {
    if (typeof Storage !== "undefined" && Storage.get("timequest_curriculum_version") !== "3.9") {
      Storage.set(STORAGE_KEYS.MATERIALS, JSON.parse(JSON.stringify(DEFAULT_MATERIALS)));
      Storage.set(STORAGE_KEYS.QUESTIONS, JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)));
      Storage.set("timequest_curriculum_version", "3.9");
      console.log("[TIME QUEST] Kurikulum diperbarui otomatis ke versi 3.9 (Materi 4 modul tunggal sesuai poster buku).");
    }
  } catch (err) {
    console.warn("[TIME QUEST] Gagal auto sync:", err);
  }
})();
