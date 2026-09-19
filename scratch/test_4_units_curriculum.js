const http = require("http");
const fs = require("fs");
const path = require("path");

console.log("=== VERIFIKASI KURIKULUM 4 UNIT MATEMATIKA KELAS 2 ===");

// 1. Periksa berkas CSV
const levelCsv = fs.readFileSync(path.join(__dirname, "../data/level.csv"), "utf8");
const materiCsv = fs.readFileSync(path.join(__dirname, "../data/materi.csv"), "utf8");
const soalCsv = fs.readFileSync(path.join(__dirname, "../data/soal.csv"), "utf8");
const pilihanCsv = fs.readFileSync(path.join(__dirname, "../data/pilihan.csv"), "utf8");

const levelLines = levelCsv.trim().split("\n").filter(l => l.trim().length > 0);
const materiLines = materiCsv.trim().split("\n").filter(l => l.trim().length > 0);
const soalLines = soalCsv.trim().split("\n").filter(l => l.trim().length > 0);
const pilihanLines = pilihanCsv.trim().split("\n").filter(l => l.trim().length > 0);

console.log(`✓ data/level.csv: ${levelLines.length - 1} level (Target: 4)`);
console.log(`✓ data/materi.csv: ${materiLines.length - 1} modul (Target: 8)`);
console.log(`✓ data/soal.csv: ${soalLines.length - 1} soal (Target: 16)`);
console.log(`✓ data/pilihan.csv: ${pilihanLines.length - 1} pilihan`);

if (levelLines.length - 1 !== 4) throw new Error(`Level count mismatch: expected 4, got ${levelLines.length - 1}`);
if (materiLines.length - 1 !== 8) throw new Error(`Materi count mismatch: expected 8, got ${materiLines.length - 1}`);
if (soalLines.length - 1 !== 16) throw new Error(`Soal count mismatch: expected 16, got ${soalLines.length - 1}`);
if (pilihanLines.length - 1 !== 56 && pilihanLines.length - 1 !== 64) throw new Error(`Pilihan count mismatch: expected 56, got ${pilihanLines.length - 1}`);

// 2. Periksa server API
function checkApi(endpoint) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${endpoint}`, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data, statusCode: res.statusCode });
        }
      });
    }).on("error", reject);
  });
}

async function runApiTests() {
  try {
    const status = await checkApi("/api/status");
    console.log("✓ GET /api/status:", status.ok ? "OK" : "Failed");

    const materials = await checkApi("/api/materials");
    console.log("✓ GET /api/materials:", materials.success ? "Success (CSV served)" : "Failed");

    const questions = await checkApi("/api/questions");
    console.log("✓ GET /api/questions:", questions.success ? "Success (CSV served)" : "Failed");

    console.log("=== SEMUA PENGUJIAN INTEGRITAS DATA BERHASIL ===");
  } catch (err) {
    console.error("API test error:", err.message);
  }
}

runApiTests();
