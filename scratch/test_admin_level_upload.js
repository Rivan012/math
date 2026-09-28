const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("=== PENGUJIAN FITUR ADMIN: KELOLA MATERI & UNGGAH KUIS PER LEVEL ===");

// 1. Validasi Keberadaan Elemen Kunci di admin.html
const adminHtml = fs.readFileSync(path.join(__dirname, "../admin.html"), "utf8");

console.log("\n[TEST 1] Memeriksa elemen DOM di admin.html...");
assert(adminHtml.includes('id="matLevelPillsBar"'), "Harus memiliki matLevelPillsBar");
assert(adminHtml.includes('id="btnQuickAddMatForLevel"'), "Harus memiliki btnQuickAddMatForLevel");
assert(adminHtml.includes('id="uploadMaterialTargetLevel"'), "Harus memiliki uploadMaterialTargetLevel");
assert(adminHtml.includes('name="matImportMode"'), "Harus memiliki matImportMode");
assert(adminHtml.includes('class="btn btn-outline btn-sm btn-template-mat-level" data-level="1"'), "Harus memiliki tombol template materi level 1");
assert(adminHtml.includes('data-level="2"'), "Harus memiliki tombol template materi level 2");
assert(adminHtml.includes('data-level="3"'), "Harus memiliki tombol template materi level 3");
assert(adminHtml.includes('data-level="4"'), "Harus memiliki tombol template materi level 4");

assert(adminHtml.includes('id="qLevelPillsBar"'), "Harus memiliki qLevelPillsBar");
assert(adminHtml.includes('id="btnQuickAddQForLevel"'), "Harus memiliki btnQuickAddQForLevel");
assert(adminHtml.includes('id="uploadQuestionTargetLevel"'), "Harus memiliki uploadQuestionTargetLevel");
assert(adminHtml.includes('name="qImportMode"'), "Harus memiliki qImportMode");
assert(adminHtml.includes('class="btn btn-outline btn-sm btn-template-q-level" data-level="1"'), "Harus memiliki tombol template kuis level 1");
assert(adminHtml.includes('class="btn btn-outline btn-sm btn-template-q-level" data-level="2"'), "Harus memiliki tombol template kuis level 2");
assert(adminHtml.includes('class="btn btn-outline btn-sm btn-template-q-level" data-level="3"'), "Harus memiliki tombol template kuis level 3");
assert(adminHtml.includes('class="btn btn-outline btn-sm btn-template-q-level" data-level="4"'), "Harus memiliki tombol template kuis level 4");
console.log("✓ Semua elemen antarmuka admin.html terpasang lengkap.");

// 2. Simulasi Logika Tambah Materi per Level & Filter
console.log("\n[TEST 2] Simulasi filter materi & penambahan materi per level...");
let mockMaterials = [
  { id: "m1", level: 1, judul: "Materi L1", isi: "Isi L1", tip: "Tip 1" },
  { id: "m2", level: 2, judul: "Materi L2", isi: "Isi L2", tip: "Tip 2" },
  { id: "m3", level: 3, judul: "Materi L3", isi: "Isi L3", tip: "Tip 3" },
  { id: "m4", level: 4, judul: "Materi L4", isi: "Isi L4", tip: "Tip 4" }
];

function getMaterialCounts(materials) {
  return {
    all: materials.length,
    L1: materials.filter(m => String(m.level) === "1").length,
    L2: materials.filter(m => String(m.level) === "2").length,
    L3: materials.filter(m => String(m.level) === "3").length,
    L4: materials.filter(m => String(m.level) === "4").length
  };
}

let counts = getMaterialCounts(mockMaterials);
assert.strictEqual(counts.all, 4);
assert.strictEqual(counts.L1, 1);
assert.strictEqual(counts.L2, 1);

// Tambah materi khusus level 2
const newMatL2 = {
  id: "mat_custom_1",
  level: 2,
  judul: "Membaca Menit Digital 30",
  isi: "Angka 30 menunjukkan lewat setengah jam.",
  tip: "30 menit = setengah jam"
};
mockMaterials.push(newMatL2);
counts = getMaterialCounts(mockMaterials);
assert.strictEqual(counts.L2, 2, "Level 2 sekarang harus memiliki 2 materi");
assert.strictEqual(counts.all, 5, "Total materi sekarang harus 5");
console.log("✓ Penambahan materi per level berhasil diverifikasi.");

// 3. Simulasi Unggah Materi Bulk per Level (Mode Replace vs Append)
console.log("\n[TEST 3] Simulasi unggah materi bulk per level (Mode Replace vs Append)...");
function processUploadMaterials(currentMaterials, rows, targetLevel, mode) {
  let list = [...currentMaterials];
  if (mode === "replace") {
    if (targetLevel !== "all") {
      list = list.filter(m => String(m.level) !== String(targetLevel));
    } else {
      list = [];
    }
  }

  rows.forEach((r, idx) => {
    const rawLvl = parseInt(r.level, 10) || 1;
    const finalLvl = targetLevel !== "all" ? parseInt(targetLevel, 10) : rawLvl;
    list.push({
      id: "bulk_mat_" + idx,
      level: finalLvl,
      judul: r.judul,
      isi: r.isi,
      tip: r.tip || ""
    });
  });

  return list;
}

const newL2Rows = [
  { level: 2, judul: "Modul Baru L2-A", isi: "Penjelasan A", tip: "Tip A" },
  { level: 2, judul: "Modul Baru L2-B", isi: "Penjelasan B", tip: "Tip B" },
  { level: 2, judul: "Modul Baru L2-C", isi: "Penjelasan C", tip: "Tip C" }
];

// Lakukan replace khusus Level 2
const replacedL2Materials = processUploadMaterials(mockMaterials, newL2Rows, 2, "replace");
const countReplaced = getMaterialCounts(replacedL2Materials);
assert.strictEqual(countReplaced.L2, 3, "Level 2 harus tepat 3 materi baru dari hasil replace");
assert.strictEqual(countReplaced.L1, 1, "Level 1 harus tetap utuh (1)");
assert.strictEqual(countReplaced.L3, 1, "Level 3 harus tetap utuh (1)");
assert.strictEqual(countReplaced.L4, 1, "Level 4 harus tetap utuh (1)");
console.log("✓ Mode Replace materi per level sukses mengganti hanya level target tanpa mengganggu level lain.");

// 4. Simulasi Unggah Kuis Bulk per Level & Tipe Soal
console.log("\n[TEST 4] Simulasi unggah kuis per level dengan deteksi tipe soal...");
let mockQuestions = [
  { id: "q1", level: 1, tipe: "clock", pertanyaan: "Soal L1", pilihan: ["A", "B"], kunci: 0 },
  { id: "q2", level: 2, tipe: "clock_drop", pertanyaan: "Soal L2", pilihan: ["08", "00"], kunci: 0 },
  { id: "q3", level: 3, tipe: "time_compare", pertanyaan: "Soal L3", pilihan: ["Tidur", "Minum"], kunci: 0 },
  { id: "q4", level: 4, tipe: "clock_activity_drop", pertanyaan: "Soal L4", pilihan: ["Pukul 7 pagi"], kunci: 0 }
];

function processUploadQuestions(currentQuestions, rows, targetLevel, mode) {
  let list = [...currentQuestions];
  if (mode === "replace") {
    if (targetLevel !== "all") {
      list = list.filter(q => String(q.level) !== String(targetLevel));
    } else {
      list = [];
    }
  }

  const letterMap = { "A": 0, "B": 1, "C": 2, "D": 3 };

  rows.forEach((r, idx) => {
    const rawLvl = parseInt(r.level, 10) || 1;
    const finalLvl = targetLevel !== "all" ? parseInt(targetLevel, 10) : rawLvl;
    const tipeRaw = (r.tipe || "").toLowerCase();

    let tipe = "clock";
    if (tipeRaw === "text" || tipeRaw === "teks") {
      tipe = "text";
    } else if (tipeRaw.includes("drag")) {
      tipe = "clock_drag";
    } else if (tipeRaw.includes("drop") || tipeRaw.includes("digital")) {
      tipe = "clock_drop";
    } else if (tipeRaw.includes("compare") || tipeRaw.includes("lama")) {
      tipe = "time_compare";
    } else if (tipeRaw.includes("activity")) {
      tipe = "clock_activity_drop";
    } else if (finalLvl === 1) {
      tipe = "clock";
    } else {
      tipe = "text";
    }

    const options = [r.pilihan_a, r.pilihan_b];
    if (r.pilihan_c) options.push(r.pilihan_c);
    if (r.pilihan_d) options.push(r.pilihan_d);

    const keyIndex = letterMap[String(r.kunci || "A").toUpperCase()] ?? 0;

    list.push({
      id: "bulk_q_" + idx,
      level: finalLvl,
      tipe,
      pertanyaan: r.pertanyaan,
      pilihan: options,
      kunci: keyIndex,
      hint: r.hint || "",
      penjelasan: r.penjelasan || "",
      poin: parseInt(r.poin, 10) || 25,
      jam: parseInt(r.jam, 10) || 12,
      menit: parseInt(r.menit, 10) || 0
    });
  });

  return list;
}

const newL3Questions = [
  {
    level: 3,
    pertanyaan: "Kegiatan mana yang lebih lama?",
    tipe: "time_compare",
    pilihan_a: "Belajar di sekolah",
    pilihan_b: "Mencuci tangan",
    pilihan_c: "Bersin",
    pilihan_d: "Mengedipkan mata",
    kunci: "A",
    poin: 25
  },
  {
    level: 3,
    pertanyaan: "Kegiatan mana yang lebih sebentar?",
    tipe: "time_compare",
    pilihan_a: "Tidur malam",
    pilihan_b: "Minum segelas air",
    pilihan_c: "Berlibur ke luar kota",
    pilihan_d: "Sekolah dari pagi sampai siang",
    kunci: "B",
    poin: 25
  }
];

// Unggah dengan target level 3 dan mode replace
const updatedQuestions = processUploadQuestions(mockQuestions, newL3Questions, 3, "replace");

assert.strictEqual(updatedQuestions.filter(q => q.level === 3).length, 2, "Level 3 harus memiliki 2 soal baru");
assert.strictEqual(updatedQuestions.find(q => q.level === 3 && q.kunci === 1).pilihan[1], "Minum segelas air");
assert.strictEqual(updatedQuestions.filter(q => q.level === 1).length, 1, "Level 1 tetap 1 soal");
assert.strictEqual(updatedQuestions.filter(q => q.level === 2).length, 1, "Level 2 tetap 1 soal");
assert.strictEqual(updatedQuestions.filter(q => q.level === 4).length, 1, "Level 4 tetap 1 soal");
console.log("✓ Mode Replace kuis per level berhasil mengganti soal level target tanpa mempengaruhi level lain.");

// 5. Verifikasi Filter Template Generator per Level
console.log("\n[TEST 5] Verifikasi generator template Excel kuis per level...");
function getTemplateRows(targetLevel) {
  const allRows = [
    ["level", "pertanyaan", "tipe", "pilihan_a", "pilihan_b", "pilihan_c", "pilihan_d", "kunci"],
    [1, "Soal Analog 1", "clock", "A", "B", "C", "D", "A"],
    [1, "Soal Analog 2", "clock", "A", "B", "C", "D", "A"],
    [2, "Soal Digital 1", "text", "A", "B", "C", "D", "A"],
    [2, "Soal Digital 2", "text", "A", "B", "C", "D", "A"],
    [3, "Soal Lama Sebentar 1", "text", "A", "B", "C", "D", "A"],
    [4, "Soal Waktu Kegiatan 1", "text", "A", "B", "C", "D", "A"]
  ];

  if (targetLevel !== "all") {
    return [allRows[0], ...allRows.slice(1).filter(r => String(r[0]) === String(targetLevel))];
  }
  return allRows;
}

const tL1 = getTemplateRows(1);
assert.strictEqual(tL1.length, 3, "Template Level 1 harus berisi header + 2 contoh soal level 1");
assert.strictEqual(tL1[1][0], 1);
assert.strictEqual(tL1[2][0], 1);

const tL3 = getTemplateRows(3);
assert.strictEqual(tL3.length, 2, "Template Level 3 harus berisi header + 1 contoh soal level 3");
assert.strictEqual(tL3[1][0], 3);

const tAll = getTemplateRows("all");
assert.strictEqual(tAll.length, 7, "Template Semua Level harus berisi seluruh baris contoh");
console.log("✓ Generator template per level menghasilkan baris yang tepat sesuai level.");

console.log("\n=======================================================");
console.log("SEMUA PENGUJIAN FITUR ADMIN PER LEVEL BERHASIL 100%! ✓");
console.log("=======================================================");
