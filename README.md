# Lentera KTI — MAN 1 Nganjuk

> **Media Inovasi Pembelajaran Bahasa Indonesia pada Materi Karya Tulis Ilmiah (KTI) Kelas XI**  
> Disusun mengacu pada **Pedoman Penulisan KTI (Paper) MAN 1 Nganjuk TA 2026/2027**  
> Menggunakan gaya sitasi **APA Edisi Ke-7**  
> **Pemilik:** Mustagfiroh, MAN 1 Nganjuk

---

## 📌 Deskripsi Aplikasi

**Lentera KTI** adalah aplikasi berbasis web yang dirancang sebagai alat bantu telaah awal (*early review tool*) bagi guru dan murid kelas XI dalam penyusunan proposal riset dan karya tulis ilmiah (paper).

Pemeriksaan dalam aplikasi berjalan secara otomatis berbasis aturan (*rule-based*), ekspresi reguler (*RegEx*), dan tokenisasi kebahasaan (*heuristics*). Seluruh proses analisis dijalankan secara lokal di peramban pengguna (*client-side*), sehingga **tidak memerlukan biaya server/database**, menjaga privasi riset murid, dan dapat diakses dengan cepat.

---

## 🚀 Fitur Utama

1. **Dashboard Indikator**:
   - Ringkasan metrik pedoman (4 fitur, 7 bagian sistematika, 13 langkah proposal, 3 tema riset resmi, 6 bab berbatas kata, 5 nilai pokok KBC).
   - Indikator tahun ajaran aktif **2026/2027** dan pemilik aplikasi.
2. **Analisis Teks (Pemeriksa Draf Paper BAB I–V)**:
   - Pemeriksaan kelengkapan 7 bagian sistematika (Abstrak, BAB I–V, Daftar Pustaka).
   - Pengontrol batas kata per bab dengan penanda batas resmi.
   - Pendeteksi sitasi APA Edisi Ke-7 (parentetikal dan naratif).
   - Penelaah kaidah kebahasaan (bahasa lugas/objektif, kalimat efektif tanpa pleonasme, ejaan baku EYD Edisi V).
   - Uji keselarasan rumusan masalah BAB I terhadap pembahasan BAB IV/V.
   - Evaluasi insersi nilai Kurikulum Berbasis Cinta (KBC) pada BAB I & BAB IV.
   - Ekspor laporan telaah lengkap dalam format `.txt`.
3. **Simulator Riset (Pemandu Proposal 13 Langkah)**:
   - 13 langkah terstruktur sesuai Bab II Pedoman KTI.
   - Validasi dan umpan balik langsung pada setiap langkah.
   - Penyimpanan draf otomatis di peramban (*localStorage*).
   - Pratinjau draf lengkap dan unduh rencana riset `.txt`.
4. **Cek Similaritas (Uji Kemiripan Naskah)**:
   - Perbandingan Naskah A (draf murid) vs Naskah B (rujukan pembanding) menggunakan metode *word shingle* 5-kata.
   - Batas toleransi maksimal 30% sesuai pedoman.
   - Ekstraksi kalimat kunci unik untuk pencarian instan di Google.
   - Pintasan ke layanan SciSpace AI Detector dan DupliChecker.
   - Unduh laporan hasil similaritas `.txt`.
5. **Review KBC (Kurikulum Berbasis Cinta)**:
   - Mode evaluasi Proposal Riset dan Paper.
   - Evaluasi 5 kriteria insersi nilai KBC (Lampiran 5 & 7).
   - Kamus konsep materi 5 nilai luhur (Cinta Allah & Rasul, Cinta Ilmu, Cinta Lingkungan, Cinta Diri & Sesama, Cinta Tanah Air).
   - Tombol salin contoh kalimat insersi sekali klik.
   - Unduh hasil review KBC `.txt`.

---

## 🛠️ Teknologi yang Digunakan (*Tech Stack*)

- **Framework**: React 18 + Vite
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS (Desain rapi, responsif, berstandar aksesibilitas tinggi)
- **Ikon**: Lucide React
- **Hosting Target**: [Vercel](https://vercel.com) (Zero Config / Vite preset)

---

## 💻 Menjalankan di Komputer Lokal

1. **Pasang Dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan Mode Pengembangan (*Dev Server*)**:
   ```bash
   npm run dev
   ```
   Buka peramban di `http://localhost:5173`.

3. **Build untuk Produksi**:
   ```bash
   npm run build
   ```
   File hasil build akan dibuat di folder `dist/`.

---

## 🌐 Panduan Deploy ke Vercel

### Jalur 1: Menggunakan GitHub (Paling Direkomendasikan)
1. Inisialisasi dan push kode ke repositori GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: inisialisasi aplikasi Lentera KTI MAN 1 Nganjuk"
   git branch -M main
   git remote add origin https://github.com/Hikam666/lentera-kti-man1nganjuk.git
   git push -u origin main
   ```
2. Buka dashboard [Vercel](https://vercel.com/) dan login menggunakan akun GitHub Anda.
3. Klik tombol **"Add New..."** → **"Project"**.
4. Pilih repositori `Hikam666/lentera-kti-man1nganjuk` dan klik **"Import"**.
5. Vercel otomatis mendeteksi framework **Vite**:
   - *Build Command*: `vite build`
   - *Output Directory*: `dist`
6. Klik **"Deploy"**. Dalam beberapa detik website sudah aktif dengan domain gratis seperti `lentera-kti-man1nganjuk.vercel.app`!

---

### Jalur 2: Menggunakan Vercel CLI (Langsung dari Terminal)
1. Pasang Vercel CLI secara global (jika belum ada):
   ```bash
   npm install -g vercel
   ```
2. Jalankan perintah deploy:
   ```bash
   vercel
   ```
3. Ikuti instruksi login di layar dan pilih opsi *default* (tekan Enter).
4. Untuk deploy ke produksi:
   ```bash
   vercel --prod
   ```

---

*Hak Cipta © 2026/2027 — Mustagfiroh, MAN 1 Nganjuk. Seluruh hak cipta dilindungi.*
