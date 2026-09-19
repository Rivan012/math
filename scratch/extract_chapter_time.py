import os
import sys
import pypdf

reader = pypdf.PdfReader('Matematika-BS-KLS-II.pdf')

# Find pages mentioning 'B. Waktu' or 'Waktu' in chapter 6
found_pages = []
for idx, page in enumerate(reader.pages):
    text = page.extract_text() or ''
    # Check if page is in chapter 6 and about waktu
    if 'waktu' in text.lower() and any(k in text.lower() for k in ['jam analog', 'jam digital', 'halim', 'lebih lama', 'sebentar', 'malam', 'pagi']):
        found_pages.append((idx, text))

print(f"Total matching pages: {len(found_pages)}")

with open('scratch/extracted_waktu_pages.txt', 'w', encoding='utf-8') as f:
    for idx, text in found_pages:
        f.write(f"\n{'='*50}\nPDF Page {idx + 1}\n{'='*50}\n")
        f.write(text)

print("Saved to scratch/extracted_waktu_pages.txt")
