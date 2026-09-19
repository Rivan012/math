/* =========================================================
   TIME QUEST
   csv.js - Parser, Generator, dan Ekspor/Impor CSV
   ========================================================= */

"use strict";

const CSV = {
  /**
   * Mengurai (parse) teks CSV menjadi array objek atau array of arrays
   * Mendukung nilai bertanda kutip, koma dalam nilai, dan escaped quote ("")
   * @param {string} text 
   * @param {boolean} hasHeader 
   * @returns {Array} 
   */
  parse(text, hasHeader = true) {
    if (!text || typeof text !== "string") return [];

    const lines = [];
    let currentRow = [];
    let currentField = "";
    let insideQuotes = false;

    // Bersihkan carriage return \r
    const cleaned = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      const nextChar = cleaned[i + 1];

      if (insideQuotes) {
        if (char === '"' && nextChar === '"') {
          currentField += '"';
          i++; // Lewati quote berikutnya
        } else if (char === '"') {
          insideQuotes = false;
        } else {
          currentField += char;
        }
      } else {
        if (char === '"') {
          insideQuotes = true;
        } else if (char === ',') {
          currentRow.push(currentField.trim());
          currentField = "";
        } else if (char === '\n') {
          currentRow.push(currentField.trim());
          if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== "")) {
            lines.push(currentRow);
          }
          currentRow = [];
          currentField = "";
        } else {
          currentField += char;
        }
      }
    }

    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField.trim());
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== "")) {
        lines.push(currentRow);
      }
    }

    if (!hasHeader || lines.length <= 1) {
      return lines;
    }

    const headers = lines[0].map(h => h.trim());
    return lines.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] !== undefined ? row[index] : "";
      });
      return obj;
    });
  },

  /**
   * Mengonversi header dan array baris menjadi string CSV standar RFC 4180
   * @param {Array<string>} headers 
   * @param {Array<Array<any>>} rows 
   * @returns {string} 
   */
  stringify(headers, rows) {
    const formatValue = (val) => {
      const text = String(val ?? "");
      if (text.includes(",") || text.includes('"') || text.includes("\n")) {
        return '"' + text.replaceAll('"', '""') + '"';
      }
      return text;
    };

    const headerLine = headers.map(formatValue).join(",");
    const rowLines = rows.map(row => row.map(formatValue).join(","));

    return [headerLine, ...rowLines].join("\n");
  },

  /**
   * Memicu download browser untuk teks CSV
   * @param {string} filename 
   * @param {string} csvText 
   */
  download(filename, csvText) {
    // Tambahkan UTF-8 BOM (\uFEFF) agar Microsoft Excel membuka teks aksen/simbol dengan benar
    const blob = new Blob(["\uFEFF" + csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename.endsWith(".csv") ? filename : filename + ".csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },

  /**
   * Mengambil file CSV dari direktori lokal melalui fetch
   * @param {string} path 
   * @returns {Promise<Array>} 
   */
  async fetchAndParse(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} saat memuat ${path}`);
      }
      const text = await response.text();
      return CSV.parse(text);
    } catch (err) {
      console.warn(`Gagal memuat ${path} (kemungkinan file:// protocol):`, err.message);
      return null;
    }
  }
};

/**
 * Fungsi khusus untuk mengekspor hasil nilai siswa menjadi file CSV untuk guru
 */
function exportResultsToCSV() {
  const students = getStudents();

  if (students.length === 0) {
    showToast("Belum ada data siswa untuk diekspor.", "error");
    return;
  }

  const headers = [
    "Nama",
    "Kelas",
    "Poin",
    "Nilai Terakhir",
    "Jawaban Benar",
    "Total Soal",
    "Hint Digunakan",
    "Waktu Terakhir Main"
  ];

  const rows = students.map(student => [
    student.name,
    student.className,
    student.points,
    student.lastScore ?? "-",
    student.lastCorrect ?? 0,
    student.lastTotal ?? 0,
    student.lastHints ?? 0,
    formatDate(student.lastPlayed)
  ]);

  const csvContent = CSV.stringify(headers, rows);
  CSV.download("hasil-time-quest.csv", csvContent);

  showToast("File hasil-time-quest.csv berhasil diunduh!", "success");
}

/**
 * Fungsi khusus untuk mengekspor hasil nilai siswa ke format Microsoft Excel (.xlsx)
 */
function exportResultsToExcel() {
  const students = typeof getStudents === "function" ? getStudents() : [];

  if (students.length === 0) {
    showToast("Belum ada data siswa untuk diekspor.", "error");
    return;
  }

  if (typeof XLSX !== "undefined") {
    const headers = [
      "Nama Murid",
      "Kelas",
      "Poin Bintang",
      "Nilai Terakhir",
      "Jawaban Benar",
      "Total Soal",
      "Hint Digunakan",
      "Waktu Terakhir Pengerjaan"
    ];

    const rows = students.map(student => [
      student.name,
      student.className,
      student.points,
      student.lastScore !== null && student.lastScore !== undefined ? student.lastScore : "-",
      student.lastCorrect ?? 0,
      student.lastTotal ?? 0,
      student.lastHints ?? 0,
      typeof formatDate === "function" ? formatDate(student.lastPlayed) : "-"
    ]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws["!cols"] = [
      { wch: 24 },
      { wch: 16 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 12 },
      { wch: 16 },
      { wch: 22 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Nilai Siswa");
    XLSX.writeFile(wb, "rekap-nilai-timequest.xlsx");
    showToast("Rekap nilai berhasil diunduh dalam format Excel (.xlsx)!", "success");
    return;
  }

  // Fallback ke CSV jika modul XLSX tidak termuat
  exportResultsToCSV();
}
