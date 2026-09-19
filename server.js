/* =========================================================
   TIME QUEST
   server.js - Server Lokal Node.js Ringan untuk Sinkronisasi Data Lintas Browser
   Bebas dependensi eksternal (menggunakan modul bawaan node:http, node:fs, node:path)
   ========================================================= */

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");
const SISWA_CSV_PATH = path.join(DATA_DIR, "siswa.csv");
const MATERI_CSV_PATH = path.join(DATA_DIR, "materi.csv");
const SOAL_CSV_PATH = path.join(DATA_DIR, "soal.csv");

// Daftar MIME type yang didukung
const MIME_TYPES = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".csv": "text/csv; charset=UTF-8",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf"
};

// Pastikan direktori data ada
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Pastikan data/siswa.csv memiliki header jika belum ada
const SISWA_HEADER = "id,nama,kelas,avatar,poin,stars,completed_levels,material_progress,last_score,last_correct,last_total,last_hints,last_played,created_at";
if (!fs.existsSync(SISWA_CSV_PATH)) {
  fs.writeFileSync(SISWA_CSV_PATH, SISWA_HEADER + "\n", "utf8");
}

/* =========================================================
   HELPER CSV: PARSER & SERIALIZER SISWA
   ========================================================= */

/**
 * Mem-parse satu baris CSV sederhana dengan dukungan tanda kutip
 */
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map(s => s.trim());
}

/**
 * Mengubah string menjadi nilai aman CSV
 */
function escapeCSV(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes(";")) {
    return `"${str.replaceAll('"', '""')}"`;
  }
  return str;
}

/**
 * Membaca daftar seluruh siswa dari berkas data/siswa.csv
 */
function readStudentsFromCSV() {
  try {
    if (!fs.existsSync(SISWA_CSV_PATH)) return [];
    const content = fs.readFileSync(SISWA_CSV_PATH, "utf8").trim();
    if (!content) return [];

    const lines = content.split(/\r?\n/);
    if (lines.length <= 1) return []; // Hanya header

    const students = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = parseCSVLine(line);
      const completedLevels = cols[6]
        ? cols[6].split(",").map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n))
        : [];

      students.push({
        id: cols[0] || ("S" + String(i).padStart(3, "0")),
        name: cols[1] || "",
        className: cols[2] || "",
        avatar: cols[3] || "budi",
        points: parseInt(cols[4], 10) || 0,
        stars: parseInt(cols[5], 10) || 0,
        completedLevels: completedLevels,
        materialProgress: parseInt(cols[7], 10) || 0,
        lastScore: cols[8] !== "" && !isNaN(parseInt(cols[8], 10)) ? parseInt(cols[8], 10) : null,
        lastCorrect: parseInt(cols[9], 10) || 0,
        lastTotal: parseInt(cols[10], 10) || 0,
        lastHints: parseInt(cols[11], 10) || 0,
        lastPlayed: cols[12] && !isNaN(Number(cols[12])) ? Number(cols[12]) : null,
        createdAt: cols[13] && !isNaN(Number(cols[13])) ? Number(cols[13]) : Date.now()
      });
    }
    return students;
  } catch (err) {
    console.error("Gagal membaca data/siswa.csv:", err);
    return [];
  }
}

/**
 * Menyimpan seluruh array siswa ke berkas data/siswa.csv
 */
function writeStudentsToCSV(students) {
  try {
    const lines = [SISWA_HEADER];
    for (const s of students) {
      const completedStr = Array.isArray(s.completedLevels) ? s.completedLevels.join(",") : "";
      const row = [
        escapeCSV(s.id),
        escapeCSV(s.name),
        escapeCSV(s.className),
        escapeCSV(s.avatar || "budi"),
        escapeCSV(s.points || 0),
        escapeCSV(s.stars || 0),
        escapeCSV(completedStr),
        escapeCSV(s.materialProgress || 0),
        escapeCSV(s.lastScore !== null && s.lastScore !== undefined ? s.lastScore : ""),
        escapeCSV(s.lastCorrect || 0),
        escapeCSV(s.lastTotal || 0),
        escapeCSV(s.lastHints || 0),
        escapeCSV(s.lastPlayed || ""),
        escapeCSV(s.createdAt || Date.now())
      ].join(",");
      lines.push(row);
    }
    fs.writeFileSync(SISWA_CSV_PATH, lines.join("\n") + "\n", "utf8");
    return true;
  } catch (err) {
    console.error("Gagal menulis ke data/siswa.csv:", err);
    return false;
  }
}

/**
 * Memperbarui satu siswa atau menambah siswa baru
 */
function upsertStudent(studentData) {
  if (!studentData || !studentData.name) return null;

  const students = readStudentsFromCSV();
  const cleanName = studentData.name.trim().toLowerCase();
  const cleanClass = (studentData.className || "").trim().toLowerCase();

  const index = students.findIndex(s => {
    if (studentData.id && s.id === studentData.id) return true;
    return s.name.trim().toLowerCase() === cleanName && s.className.trim().toLowerCase() === cleanClass;
  });

  let savedStudent;
  if (index >= 0) {
    // Perbarui data yang ada
    savedStudent = {
      ...students[index],
      ...studentData,
      id: students[index].id, // Pertahankan ID asli jika ada
      updatedAt: Date.now()
    };
    students[index] = savedStudent;
  } else {
    // Buat siswa baru
    const nextNum = students.length + 1;
    const newId = studentData.id || ("S" + String(nextNum).padStart(3, "0"));
    savedStudent = {
      id: newId,
      name: studentData.name.trim(),
      className: studentData.className || "",
      avatar: studentData.avatar || "budi",
      points: Number(studentData.points) || 0,
      stars: Number(studentData.stars) || 0,
      completedLevels: Array.isArray(studentData.completedLevels) ? studentData.completedLevels : [],
      materialProgress: Number(studentData.materialProgress) || 0,
      lastScore: studentData.lastScore !== undefined ? studentData.lastScore : null,
      lastCorrect: Number(studentData.lastCorrect) || 0,
      lastTotal: Number(studentData.lastTotal) || 0,
      lastHints: Number(studentData.lastHints) || 0,
      lastPlayed: studentData.lastPlayed || null,
      createdAt: studentData.createdAt || Date.now()
    };
    students.push(savedStudent);
  }

  writeStudentsToCSV(students);
  return savedStudent;
}

/* =========================================================
   PARSER REQUEST BODY JSON
   ========================================================= */

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
      if (body.length > 10 * 1024 * 1024) { // Batas 10MB
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      try {
        const data = body ? JSON.parse(body) : {};
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(data));
}

/* =========================================================
   SERVER UTAMA & ROUTER
   ========================================================= */

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // =========================================================
  // API ENDPOINTS (/api/...)
  // =========================================================

  if (pathname.startsWith("/api/")) {
    // 1. Status Server
    if (pathname === "/api/status") {
      sendJSON(res, 200, {
        ok: true,
        app: "TIME QUEST",
        version: "2.0.0",
        mode: "server",
        timestamp: Date.now()
      });
      return;
    }

    // 2. GET /api/students: Ambil semua data siswa dari data/siswa.csv
    if (pathname === "/api/students" && req.method === "GET") {
      const students = readStudentsFromCSV();
      sendJSON(res, 200, {
        success: true,
        count: students.length,
        data: students
      });
      return;
    }

    // 3. POST /api/students: Simpan atau perbarui 1 siswa ke data/siswa.csv
    if (pathname === "/api/students" && req.method === "POST") {
      try {
        const body = await parseJSONBody(req);
        const saved = upsertStudent(body);
        if (!saved) {
          sendJSON(res, 400, { success: false, message: "Nama siswa harus diisi." });
          return;
        }
        sendJSON(res, 200, {
          success: true,
          message: "Data siswa berhasil disimpan ke data/siswa.csv",
          student: saved
        });
      } catch (err) {
        sendJSON(res, 500, { success: false, message: err.message });
      }
      return;
    }

    // 4. POST /api/students/bulk: Simpan banyak siswa sekaligus (impor / sinkronisasi total)
    if (pathname === "/api/students/bulk" && req.method === "POST") {
      try {
        const body = await parseJSONBody(req);
        const studentsList = Array.isArray(body) ? body : body.students;
        if (!Array.isArray(studentsList)) {
          sendJSON(res, 400, { success: false, message: "Format payload harus berupa array siswa." });
          return;
        }

        for (const s of studentsList) {
          upsertStudent(s);
        }

        const current = readStudentsFromCSV();
        sendJSON(res, 200, {
          success: true,
          message: "Seluruh data siswa berhasil disinkronkan ke server.",
          count: current.length,
          data: current
        });
      } catch (err) {
        sendJSON(res, 500, { success: false, message: err.message });
      }
      return;
    }

    // 5. POST /api/students/reset: Reset daftar siswa jika guru ingin membersihkan
    if (pathname === "/api/students/reset" && req.method === "POST") {
      try {
        fs.writeFileSync(SISWA_CSV_PATH, SISWA_HEADER + "\n", "utf8");
        sendJSON(res, 200, {
          success: true,
          message: "Data siswa di data/siswa.csv telah dikosongkan.",
          data: []
        });
      } catch (err) {
        sendJSON(res, 500, { success: false, message: err.message });
      }
      return;
    }

    // 6. GET & POST /api/materials: Sinkronisasi data materi
    if (pathname === "/api/materials") {
      if (req.method === "GET") {
        try {
          if (fs.existsSync(MATERI_CSV_PATH)) {
            const raw = fs.readFileSync(MATERI_CSV_PATH, "utf8");
            sendJSON(res, 200, { success: true, csv: raw });
          } else {
            sendJSON(res, 200, { success: true, csv: "" });
          }
        } catch (e) {
          sendJSON(res, 500, { success: false, message: e.message });
        }
        return;
      }
      if (req.method === "POST") {
        try {
          const body = await parseJSONBody(req);
          if (body.csv) {
            fs.writeFileSync(MATERI_CSV_PATH, body.csv, "utf8");
            sendJSON(res, 200, { success: true, message: "Materi berhasil disimpan ke data/materi.csv" });
            return;
          }
          sendJSON(res, 400, { success: false, message: "Data csv materi kosong." });
        } catch (e) {
          sendJSON(res, 500, { success: false, message: e.message });
        }
        return;
      }
    }

    // 7. GET & POST /api/questions: Sinkronisasi data soal kuis
    if (pathname === "/api/questions") {
      if (req.method === "GET") {
        try {
          if (fs.existsSync(SOAL_CSV_PATH)) {
            const raw = fs.readFileSync(SOAL_CSV_PATH, "utf8");
            sendJSON(res, 200, { success: true, csv: raw });
          } else {
            sendJSON(res, 200, { success: true, csv: "" });
          }
        } catch (e) {
          sendJSON(res, 500, { success: false, message: e.message });
        }
        return;
      }
      if (req.method === "POST") {
        try {
          const body = await parseJSONBody(req);
          if (body.csv) {
            fs.writeFileSync(SOAL_CSV_PATH, body.csv, "utf8");
            sendJSON(res, 200, { success: true, message: "Soal berhasil disimpan ke data/soal.csv" });
            return;
          }
          sendJSON(res, 400, { success: false, message: "Data csv soal kosong." });
        } catch (e) {
          sendJSON(res, 500, { success: false, message: e.message });
        }
        return;
      }
    }

    sendJSON(res, 404, { success: false, message: "Endpoint API tidak ditemukan." });
    return;
  }

  // =========================================================
  // PENYAJIAN FILE STATIS (HTML, CSS, JS, Gambar, dsb.)
  // =========================================================

  let safePath = pathname === "/" ? "/index.html" : pathname;
  // Mencegah traversal direktori (keamanan ../)
  const targetPath = path.normalize(path.join(ROOT_DIR, safePath));

  if (!targetPath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=UTF-8" });
    res.end("Akses dilarang.");
    return;
  }

  fs.stat(targetPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
      res.end(`
        <!DOCTYPE html>
        <html lang="id">
        <head><meta charset="UTF-8"><title>Halaman Tidak Ditemukan — TIME QUEST</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 60px 20px;">
          <h2>404 — Berkas Tidak Ditemukan</h2>
          <p>Berkas <code>${escapeCSV(safePath)}</code> tidak ada di server.</p>
          <a href="/index.html" style="color: #2563eb; text-decoration: none; font-weight: bold;">← Kembali ke Beranda</a>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache"
    });

    const stream = fs.createReadStream(targetPath);
    stream.pipe(res);
    stream.on("error", () => {
      res.writeHead(500);
      res.end("Gagal membaca berkas.");
    });
  });
});

/* =========================================================
   MENEMUKAN ALAMAT IP LOKAL & MENJALANKAN SERVER
   ========================================================= */

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

server.listen(PORT, () => {
  const localIps = getLocalIpAddresses();

  console.log("\n=======================================================");
  console.log("⏰ TIME QUEST — SERVER SINKRONISASI AKTIF!");
  console.log("=======================================================");
  console.log(`\n👉 Buka di browser laptop ini : http://localhost:${PORT}`);
  console.log(`👉 Buka Ruang Guru            : http://localhost:${PORT}/admin.html`);
  console.log(`👉 Buka Area Siswa            : http://localhost:${PORT}/siswa.html`);

  if (localIps.length > 0) {
    console.log("\n📱 Buka di HP Siswa / Laptop Lain (Wi-Fi yang sama):");
    localIps.forEach(ip => {
      console.log(`   👉 http://${ip}:${PORT}`);
    });
  }

  console.log("\n💾 Data siswa otomatis tersinkronisasi ke: data/siswa.csv");
  console.log("Tekan Ctrl + C di terminal ini untuk mematikan server.\n");
  console.log("=======================================================\n");
});
