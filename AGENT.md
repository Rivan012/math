# AGENTS.md

## Project: TIME QUEST

TIME QUEST adalah game edukasi matematika untuk siswa SD dengan tema **"Petualangan Penjaga Waktu"**.

Game berfokus pada pembelajaran konsep waktu melalui materi interaktif, quiz, poin, bintang, level, leaderboard, dan dashboard guru.

Referensi fitur dan alur utama berasal dari implementasi TIME QUEST sebelumnya.

---

# 1. Tujuan Project

Bangun ulang TIME QUEST sebagai aplikasi web edukasi dengan:

* HTML5
* CSS3
* Vanilla JavaScript
* CSV sebagai sumber data
* LocalStorage sebagai penyimpanan progres pada browser

Project **tidak menggunakan framework frontend maupun backend**.

Jangan menggunakan:

* React
* Vue
* Angular
* Svelte
* Next.js
* Nuxt
* Laravel
* Express
* Bootstrap
* Tailwind CSS
* jQuery
* library UI eksternal

Jika membutuhkan utility sederhana, prioritaskan implementasi native JavaScript.

---

# 2. Prinsip Utama

## 2.1 Vanilla First

Semua fitur harus dibuat menggunakan:

```text
HTML
CSS
JavaScript
CSV
Web APIs
```

Gunakan API browser seperti:

```javascript
fetch()
localStorage
sessionStorage
DOM API
URL API
Intl API
```

Jangan menambahkan dependency hanya untuk kebutuhan yang dapat diselesaikan dengan JavaScript native.

---

# 3. Struktur Project

Gunakan struktur berikut:

```text
time-quest/
│
├── index.html
│
├── AGENTS.md
├── README.md
│
├── css/
│   ├── style.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── csv.js
│   ├── auth.js
│   ├── student.js
│   ├── teacher.js
│   ├── quiz.js
│   ├── leaderboard.js
│   └── storage.js
│
├── data/
│   ├── guru.csv
│   ├── siswa.csv
│   ├── level.csv
│   ├── materi.csv
│   ├── soal.csv
│   ├── pilihan.csv
│   └── hasil.csv
│
└── assets/
    ├── images/
    ├── icons/
    └── sounds/
```

Jika sebuah file belum dibutuhkan, jangan membuat file kosong hanya untuk memenuhi struktur.

---

# 4. Arsitektur Data

CSV adalah sumber data statis utama.

Gunakan CSV untuk:

* akun guru demo
* data siswa awal
* level
* materi
* soal
* pilihan jawaban
* data hasil awal/demo

LocalStorage digunakan untuk data yang berubah selama permainan.

```text
CSV
 │
 ▼
csv.js
 │
 ▼
JavaScript Application State
 │
 ▼
localStorage
```

Jangan mencoba menulis kembali ke file CSV dari browser.

Browser tidak memiliki akses write langsung yang aman ke file CSV project.

---

# 5. CSV Schema

## 5.1 guru.csv

Format:

```csv
id,nama,username,password
G001,Budi Santoso,guru01,123456
G002,Siti Aminah,guru02,123456
```

Field:

| Field    | Keterangan     |
| -------- | -------------- |
| id       | ID unik guru   |
| nama     | Nama guru      |
| username | Username login |
| password | Password demo  |

### Security

Credential di CSV hanya diperuntukkan untuk:

* prototype
* demo
* pembelajaran
* aplikasi offline sederhana

Jangan menganggap password CSV sebagai sistem autentikasi production.

Jangan menyimpan:

* API key
* secret key
* token
* credential production

di dalam CSV atau JavaScript frontend.

---

# 6. siswa.csv

Format:

```csv
id,nama,kelas,avatar,total_poin,total_bintang,level
S001,Rivan,Kelas 4 SD,🧒,250,8,3
S002,Budi,Kelas 4 SD,🐼,180,6,2
```

CSV hanya berfungsi sebagai initial/demo data.

Progress aktual siswa disimpan melalui LocalStorage.

---

# 7. level.csv

Level harus dapat dikembangkan tanpa mengubah logic utama.

Contoh:

```csv
id,nomor,nama,deskripsi,icon,materi_id,unlock_score
L001,1,Mengenal Jam,Belajar membaca jam analog,clock,M001,0
L002,2,Jam Tepat,Mengenal waktu tepat,clock,M002,70
L003,3,Setengah Jam,Belajar membaca setengah jam,clock,M003,70
L004,4,Jam Digital,Menghubungkan analog dan digital,phone,M004,75
L005,5,Lama Kegiatan,Menghitung durasi kegiatan,timer,M005,80
```

Target awal:

```text
5 level / misi
```

Namun architecture harus memungkinkan level ditambah melalui CSV.

---

# 8. materi.csv

Materi harus berasal dari CSV dan dirender secara dinamis.

Materi awal:

1. Mengenal Jam Analog
2. Membaca Jam Tepat
3. Membaca Setengah Jam
4. Jam Digital
5. Urutan Kegiatan
6. Lama Kegiatan

Contoh:

```csv
id,level_id,judul,isi,tip
M001,L001,Mengenal Jam Analog,"Jam analog memiliki angka 1 sampai 12.","Jarum panjang ke angka 12 berarti menit 00."
```

Jangan hardcode seluruh materi ke dalam HTML.

HTML hanya menyediakan container/template.

---

# 9. soal.csv

Soal harus dapat ditambah tanpa mengubah JavaScript.

Contoh:

```csv
id,level_id,pertanyaan,tipe,jawaban_benar,penjelasan,hint,poin
Q001,L001,"Jam menunjukkan pukul berapa?","clock","03:00","Jarum pendek menunjuk 3.","Perhatikan jarum panjang.",100
```

Field minimal:

```text
id
level_id
pertanyaan
tipe
jawaban_benar
penjelasan
hint
poin
```

Jenis soal dapat dikembangkan, misalnya:

```text
text
clock
multiple-choice
ordering
duration
```

Jangan membuat logic quiz yang hanya bekerja untuk satu format soal.

---

# 10. pilihan.csv

Pilihan jawaban dipisahkan dari soal.

Format:

```csv
id,soal_id,label,teks
P001,Q001,A,03:00
P002,Q001,B,06:00
P003,Q001,C,09:00
P004,Q001,D,12:00
```

Relasi:

```text
soal.id
    ↓
pilihan.soal_id
```

Semua pilihan untuk sebuah soal harus dicari berdasarkan `soal_id`.

---

# 11. hasil.csv

Format:

```csv
id,siswa_id,level_id,score,benar,total,hint,waktu
H001,S001,L001,90,14,15,1,2026-09-19T14:30:00
```

Untuk browser-only application, hasil permainan baru disimpan ke LocalStorage.

CSV dapat digunakan sebagai:

* seed data
* data demo
* referensi struktur

---

# 12. CSV Parser

`js/csv.js` bertanggung jawab untuk membaca CSV.

Jangan menggunakan parser:

```javascript
text.split(",")
```

untuk data production-like karena field CSV dapat mengandung koma dan quotation mark.

Parser harus menangani minimal:

* comma
* quoted field
* escaped quote
* newline
* empty field
* header

API yang disarankan:

```javascript
async function loadCSV(path)
```

Contoh:

```javascript
const questions = await loadCSV("data/soal.csv");
```

---

# 13. Application State

Gunakan satu state utama.

Contoh:

```javascript
const appState = {
    currentUser: null,
    userType: null,

    levels: [],
    materials: [],
    questions: [],
    choices: [],
    teachers: [],
    students: [],

    currentLevel: null,
    currentQuestionIndex: 0,

    score: 0,
    correctAnswers: 0,
    hintsUsed: 0
};
```

Jangan membuat state global yang tersebar tanpa struktur.

---

# 14. LocalStorage

Gunakan prefix khusus:

```text
timequest_
```

Contoh:

```text
timequest_session
timequest_progress
timequest_results
timequest_settings
```

Buat helper pada:

```text
js/storage.js
```

Contoh API:

```javascript
Storage.get("progress");
Storage.set("progress", data);
Storage.remove("session");
```

Jangan mengakses `localStorage` secara acak dari setiap file jika helper dapat digunakan.

---

# 15. Authentication

## Siswa

Flow:

```text
Landing/Login
    ↓
Nama
    ↓
Kelas
    ↓
Avatar
    ↓
Mulai Petualangan
    ↓
Student Home
```

Siswa tidak membutuhkan password pada prototype.

## Guru

Flow:

```text
Login Guru
    ↓
Username
    ↓
Password
    ↓
guru.csv
    ↓
Valid
    ↓
Teacher Dashboard
```

Session disimpan di LocalStorage/sessionStorage sesuai kebutuhan.

---

# 16. Student Flow

Flow utama:

```text
LOGIN
  ↓
HOME
  ↓
PETA PETUALANGAN
  ↓
MATERI
  ↓
QUIZ
  ↓
FEEDBACK
  ↓
RESULT
  ↓
LEADERBOARD
```

Home harus menampilkan minimal:

* nama siswa
* avatar
* total poin
* bintang
* progres materi
* level
* peta petualangan
* leaderboard preview

---

# 17. Materi Pembelajaran

Materi harus bersifat edukatif sebelum quiz.

Topik utama:

```text
Jam Analog
Jam Tepat
Setengah Jam
Jam Digital
Urutan Kegiatan
Lama Kegiatan
```

Konsep harus disajikan secara sederhana untuk siswa SD.

Gunakan:

* contoh
* ilustrasi jam
* tip
* penjelasan singkat
* visual feedback

Jangan membuat halaman materi terlalu padat.

---

# 18. Quiz

Default:

```text
15 soal per quiz
```

Quiz harus menampilkan:

```text
Progress soal
Progress percentage
Level
Poin
Pertanyaan
Ilustrasi jika diperlukan
Pilihan jawaban
Hint
Feedback
Tombol soal berikutnya
```

Contoh:

```text
Soal 3 dari 15
██████░░░░░░░░ 20%

⭐ 120

Jam menunjukkan pukul berapa?

[ A. 03:00 ]
[ B. 06:00 ]
[ C. 09:00 ]
[ D. 12:00 ]

💡 Hint -30
```

---

# 19. Sistem Poin

Poin diberikan berdasarkan soal.

Contoh default:

```text
Jawaban benar = +100
Jawaban salah = +0
Hint = -30
```

Nilai tersebut harus berasal dari konfigurasi/data jika memungkinkan.

Jangan hardcode angka di banyak tempat.

---

# 20. Hint

Hint:

```text
Klik Hint
   ↓
Tampilkan hint
   ↓
Kurangi poin
   ↓
Tambah hintsUsed
```

Hint tidak boleh mengungkap jawaban secara langsung jika tidak diperlukan.

---

# 21. Feedback

Setelah menjawab:

### Benar

Tampilkan:

```text
✓ Jawaban benar!
```

Disertai penjelasan.

### Salah

Tampilkan:

```text
✗ Belum tepat.
```

Disertai penjelasan pembelajaran.

Feedback harus membantu siswa memahami kesalahan.

---

# 22. Tidak Ada Sistem Nyawa

TIME QUEST tidak menggunakan sistem:

```text
❤️❤️❤️
```

Siswa dapat terus mencoba.

Jangan menambahkan sistem life/health kecuali requirement baru secara eksplisit memintanya.

---

# 23. Result

Setelah quiz selesai tampilkan:

```text
🏆 Misi Berhasil

Nilai Akhir
⭐⭐⭐

Jawaban benar
13 / 15

Total poin
130

Hint digunakan
1
```

Berikan:

* nilai
* jumlah benar
* total soal
* total poin
* hint digunakan
* pesan motivasi
* retry
* leaderboard

---

# 24. Level Unlock

Level dapat dikunci berdasarkan progress.

Contoh:

```text
Level 1 ✓
Level 2 ✓
Level 3 🔒
Level 4 🔒
Level 5 🔒
```

Jangan menggunakan hardcoded condition seperti:

```javascript
if (level === 3) ...
```

Gunakan data dari `level.csv`:

```text
unlock_score
```

---

# 25. Leaderboard

Leaderboard menampilkan:

```text
Peringkat
Nama
Nilai
Poin
```

Urutan berdasarkan total poin.

Tampilkan podium:

```text
🥇
🥈
🥉
```

Kemudian tabel seluruh peserta.

Siswa yang sedang login harus diberi visual distinction.

---

# 26. Teacher Dashboard

Dashboard guru minimal memiliki:

```text
Dashboard Guru
│
├── Ringkasan
├── Daftar Siswa
├── Hasil Quiz
├── Progress Level
└── Statistik
```

Guru dapat melihat data yang tersedia pada aplikasi.

Karena aplikasi tidak memiliki backend, jangan mengklaim data tersebut aman atau tersimpan secara server-side.

---

# 27. UI / Visual Design

Gunakan gaya visual yang:

* ceria
* ramah anak
* sederhana
* mudah dibaca
* tidak terlalu ramai
* memiliki feedback visual yang jelas

Palet awal:

```text
Pink       #FF5C9D
Pink Dark  #E83D80
Purple     #7C5CFF
Blue       #48A9FF
Yellow     #FFD45A
Green      #43C88B
Red        #F06464
Ink        #29264B
Muted      #76748D
Background #F6F5FF
White      #FFFFFF
```

Gunakan warna konsisten untuk:

```text
Primary    → Purple/Pink
Success    → Green
Warning    → Yellow
Error      → Red
Info       → Blue
```

---

# 28. Responsive Design

Aplikasi harus dapat digunakan pada:

```text
Desktop
Tablet
Mobile
```

Breakpoint minimal:

```text
Desktop > 850px
Tablet  600px - 850px
Mobile  < 600px
```

Prioritaskan mobile usability karena game ditujukan untuk siswa.

---

# 29. Accessibility

Minimal:

* tombol memiliki label jelas
* form memiliki `<label>`
* keyboard navigation dapat digunakan
* `:focus-visible` tersedia
* warna bukan satu-satunya indikator benar/salah
* teks cukup kontras
* jangan mengandalkan emoji sebagai satu-satunya informasi

---

# 30. Navigation

Jangan menggunakan reload halaman untuk perpindahan screen jika tidak diperlukan.

Gunakan single-page structure:

```html
<section id="loginScreen">
<section id="studentApp">
<section id="teacherApp">
```

JavaScript mengatur screen aktif.

Pattern:

```javascript
showScreen("studentApp");
showStudentPage("homeScreen");
```

---

# 31. DOM Architecture

HTML berfungsi sebagai:

* layout
* container
* semantic structure
* template sederhana

JavaScript berfungsi sebagai:

* state
* data loading
* rendering
* event handling
* quiz logic
* authentication
* navigation

CSV berfungsi sebagai:

* content/data source

CSS berfungsi sebagai:

* layout
* theme
* animation
* responsive behavior

---

# 32. Event Handling

Gunakan `addEventListener`.

Hindari inline handler seperti:

```html
<button onclick="startQuiz()">
```

Gunakan:

```javascript
button.addEventListener("click", startQuiz);
```

Ini menjaga HTML tetap bersih dan logic tetap di JavaScript.

---

# 33. Error Handling

Setiap operasi CSV harus menangani error.

Contoh:

```javascript
try {
    const questions = await loadCSV("data/soal.csv");
} catch (error) {
    console.error(error);
    showToast("Data soal gagal dimuat.");
}
```

Jika CSV gagal dimuat, jangan membuat aplikasi gagal secara diam-diam.

---

# 34. Loading State

Saat data sedang dimuat:

```text
Memuat TIME QUEST...
```

Jangan menampilkan UI kosong seolah-olah tidak ada data.

---

# 35. Security Limitations

Project ini adalah:

```text
Frontend-only
```

Oleh karena itu:

* CSV dapat dibaca user
* JavaScript dapat dilihat user
* LocalStorage dapat dimodifikasi user
* password CSV dapat dilihat user
* leaderboard dapat dimanipulasi

Jangan menyebut sistem ini sebagai secure authentication.

Untuk production diperlukan:

```text
Backend
Database
API
Server-side authentication
Password hashing
Authorization
```

---

# 36. Development Rules

Sebelum menambahkan kode:

1. Periksa struktur project.
2. Gunakan fungsi yang sudah tersedia.
3. Hindari duplikasi logic.
4. Jangan membuat dependency baru tanpa alasan.
5. Jangan mengubah schema CSV tanpa memperbarui seluruh consumer.
6. Jangan memasukkan data soal/materi langsung ke JavaScript jika seharusnya berasal dari CSV.
7. Jangan memasukkan data credential langsung ke JavaScript.
8. Jangan menghapus fitur yang sudah ada tanpa alasan.

---

# 37. Naming Convention

Gunakan:

### JavaScript

```javascript
camelCase
```

Contoh:

```javascript
loadQuestions()
startQuiz()
currentQuestion
totalPoints
```

### CSS

Gunakan:

```text
kebab-case
```

Contoh:

```css
.quiz-card
.answer-button
.progress-bar
.level-card
```

### CSV

Gunakan:

```text
snake_case
```

untuk field baru.

Contoh:

```text
question_id
level_id
correct_answer
total_points
```

Untuk schema lama, pertahankan nama field yang sudah digunakan agar kompatibel.

---

# 38. JavaScript Module Responsibility

## app.js

Orchestrator utama.

Tanggung jawab:

* initialization
* load data
* global state
* routing screen

---

## csv.js

Tanggung jawab:

* membaca CSV
* parsing CSV
* normalisasi data

Tidak boleh menangani UI.

---

## auth.js

Tanggung jawab:

* student login
* teacher login
* session
* logout

---

## student.js

Tanggung jawab:

* student home
* profile
* progress
* level rendering

---

## quiz.js

Tanggung jawab:

* memilih soal
* render question
* answer checking
* scoring
* hint
* feedback
* result

---

## teacher.js

Tanggung jawab:

* teacher dashboard
* student statistics
* quiz results

---

## leaderboard.js

Tanggung jawab:

* calculate ranking
* render podium
* render ranking table

---

## storage.js

Tanggung jawab:

* LocalStorage abstraction
* progress persistence
* result persistence
* session persistence

---

# 39. Data Loading

Saat aplikasi dimulai:

```text
app.js
  ↓
load guru.csv
load siswa.csv
load level.csv
load materi.csv
load soal.csv
load pilihan.csv
  ↓
validate data
  ↓
initialize application
```

Jika salah satu data penting gagal:

```text
Show error state
```

Jangan melanjutkan seolah-olah data berhasil dimuat.

---

# 40. Data Validation

Validasi minimal:

### Level

```text
id wajib
nomor wajib
nama wajib
```

### Materi

```text
id wajib
level_id wajib
judul wajib
isi wajib
```

### Soal

```text
id wajib
level_id wajib
pertanyaan wajib
jawaban_benar wajib
```

### Pilihan

```text
id wajib
soal_id wajib
label wajib
teks wajib
```

Jika referensi tidak ditemukan:

```text
M001 → level_id L999
```

tampilkan warning di console.

---

# 41. Performance

Karena data relatif kecil:

* load CSV satu kali
* simpan hasil parsing di memory
* jangan fetch CSV setiap kali pindah halaman
* jangan render ulang seluruh aplikasi jika hanya satu komponen berubah

Gunakan:

```javascript
appState.questions
```

daripada membaca `soal.csv` setiap soal.

---

# 42. Browser Compatibility

Target:

```text
Chrome
Edge
Firefox
Safari
```

Gunakan JavaScript modern yang tersedia di browser modern.

Hindari API eksperimental jika tidak diperlukan.

---

# 43. Local Development

Karena `fetch()` terhadap CSV biasanya membutuhkan HTTP server, jangan mengandalkan:

```text
file:///
```

Gunakan local server.

Contoh:

```bash
python -m http.server 5500
```

Kemudian buka:

```text
http://localhost:5500
```

---

# 44. Testing Checklist

Sebelum menyatakan fitur selesai, cek:

## Data

* [ ] Semua CSV dapat dimuat
* [ ] CSV parser menangani quoted fields
* [ ] Tidak ada broken reference
* [ ] Semua soal memiliki pilihan

## Authentication

* [ ] Student login bekerja
* [ ] Teacher login bekerja
* [ ] Invalid credential ditolak
* [ ] Logout bekerja

## Student

* [ ] Home tampil
* [ ] Progress tampil
* [ ] Level tampil
* [ ] Level lock bekerja
* [ ] Materi tampil

## Quiz

* [ ] Soal tampil
* [ ] Pilihan tampil
* [ ] Jawaban benar terdeteksi
* [ ] Jawaban salah terdeteksi
* [ ] Feedback tampil
* [ ] Hint bekerja
* [ ] Poin berubah
* [ ] 15 soal selesai dengan benar

## Result

* [ ] Nilai benar
* [ ] Total poin benar
* [ ] Jumlah benar benar
* [ ] Hint count benar
* [ ] Retry bekerja

## Leaderboard

* [ ] Ranking dihitung
* [ ] Podium tampil
* [ ] User aktif ditandai

## Teacher

* [ ] Dashboard tampil
* [ ] Data siswa tampil
* [ ] Hasil quiz tampil

## Responsive

* [ ] Desktop
* [ ] Tablet
* [ ] Mobile

---

# 45. Definition of Done

Fitur dianggap selesai apabila:

1. Tidak membutuhkan framework.
2. Tidak membutuhkan backend.
3. Data utama berasal dari CSV.
4. Progress tersimpan di LocalStorage.
5. UI responsive.
6. Tidak terdapat JavaScript error di console.
7. Quiz dapat dimainkan sampai selesai.
8. Poin dan hasil dihitung dengan benar.
9. Level dapat dikontrol melalui data CSV.
10. Guru dapat login menggunakan data CSV.
11. Struktur kode tetap modular.
12. Tidak terdapat credential production di frontend.

---

# 46. Prioritas Implementasi

Implementasi harus dilakukan secara bertahap.

### Phase 1 — Foundation

```text
index.html
style.css
app.js
csv.js
storage.js
```

### Phase 2 — Data

```text
guru.csv
level.csv
materi.csv
soal.csv
pilihan.csv
siswa.csv
```

### Phase 3 — Authentication

```text
Student Login
Teacher Login
Logout
Session
```

### Phase 4 — Student

```text
Home
Level
Material
Quiz
Result
```

### Phase 5 — Gamification

```text
Points
Stars
Level Unlock
Leaderboard
```

### Phase 6 — Teacher

```text
Dashboard
Students
Results
Statistics
```

### Phase 7 — Polish

```text
Responsive
Animation
Accessibility
Error Handling
Loading State
UX refinement
```

Jangan mengerjakan semua fitur sekaligus jika fondasi data dan state belum stabil.

---

# 47. Prinsip UX

TIME QUEST ditujukan untuk siswa SD.

Karena itu:

* satu layar satu fokus utama
* instruksi pendek
* gunakan bahasa sederhana
* tombol cukup besar
* feedback langsung
* visual lebih dominan daripada teks panjang
* jangan membuat siswa takut ketika salah
* tidak menggunakan punishment berupa kehilangan nyawa
* gunakan reward untuk mempertahankan motivasi

Tujuan utama adalah:

```text
Belajar → Mencoba → Mendapat Feedback → Memahami → Mencoba Lagi
```

bukan sekadar mendapatkan nilai.

---

# 48. Prinsip Pengembangan

Prioritas utama:

```text
Correctness
    ↓
Maintainability
    ↓
Usability
    ↓
Visual Polish
```

Jangan mengorbankan struktur data dan correctness hanya demi tampilan.

Setiap perubahan harus mempertimbangkan:

```text
Apakah data tetap kompatibel?
Apakah quiz tetap bekerja?
Apakah progress tetap tersimpan?
Apakah mobile tetap usable?
Apakah guru dan siswa tetap memiliki flow yang benar?
```

---

# 49. Final Architecture

Target akhir:

```text
                 TIME QUEST
                     │
          ┌──────────┴──────────┐
          │                     │
        SISWA                  GURU
          │                     │
          ▼                     ▼
       Home                Dashboard
          │                     │
     ┌────┼────┐                │
     ▼    ▼    ▼                ▼
  Materi Level Ranking       Data Siswa
          │                   Hasil Quiz
          ▼
         Quiz
          │
     ┌────┴────┐
     ▼         ▼
  Correct     Wrong
     │         │
     └────┬────┘
          ▼
        Result
          │
          ▼
     Leaderboard


DATA LAYER
────────────────────────────
guru.csv
siswa.csv
level.csv
materi.csv
soal.csv
pilihan.csv
hasil.csv

PERSISTENCE
────────────────────────────
LocalStorage

TECHNOLOGY
────────────────────────────
HTML5
CSS3
Vanilla JavaScript
CSV
Browser Web APIs
```

**Jangan memperkenalkan framework atau backend ke project ini kecuali requirement secara eksplisit berubah.**
