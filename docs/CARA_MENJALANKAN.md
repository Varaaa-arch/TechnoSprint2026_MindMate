# Cara Menjalankan MindMate

## Langkah Cepat (5 Menit)

### 1. Buka Command Prompt / Terminal
- **Windows**: Tekan `Win + R`, ketik `cmd`, tekan Enter
- **Mac/Linux**: Buka Terminal

### 2. Masuk ke Folder Frontend
```bash
cd C:\Users\acer\Downloads\project-technosprint\TechnoSprint2026_MindMate\frontend
```

### 3. Install Dependencies (Hanya Sekali)
```bash
npm install
```
Tunggu 2-3 menit sampai selesai.

### 4. Jalankan Aplikasi
```bash
npm run dev
```

### 5. Buka di Browser
http://localhost:3000

---

## Halaman yang Bisa Diakses

| Halaman | Link |
|---------|------|
| Landing Page | http://localhost:3000 |
| Chat AI | http://localhost:3000/chat |
| Mood Tracker | http://localhost:3000/mood |
| Dashboard | http://localhost:3000/dashboard |

---

## Cara Menghentikan Aplikasi

Di terminal/command prompt, tekan:
Ctrl + C

---

## Jika Ada Masalah

### Error: "npm not found"
Install Node.js dulu dari https://nodejs.org/

### Error: "Port 3000 sudah digunakan"
Gunakan port lain:
```bash
npm run dev -- -p 3001
```
Lalu buka: http://localhost:3001

### Error saat npm install
Hapus folder node_modules dan coba lagi:
```bash
rmdir /s /q node_modules
npm install
```

---

## Dokumentasi Lengkap

- **QUICKSTART.md** - Panduan cepat lengkap
- **INSTALLATION.md** - Panduan instalasi detail
- **SUMMARY.md** - Ringkasan semua fitur
- **README.md** - Dokumentasi utama

---

## Yang Sudah Dibuat

- Landing Page - Halaman utama dengan hero section, fitur, testimonial
- Chat Page - Chat dengan AI yang interaktif
- Mood Tracker - Catat mood harian dengan 6 pilihan emoji
- Dashboard - Lihat insights dan statistik mood
- Navbar - Navigasi di semua halaman
- Footer - Footer dengan links
- Loading & Error Pages - Halaman loading dan error handling

---

## Teknologi yang Digunakan

- **Next.js 16.2.4** - Framework React
- **React 19.2.4** - Library UI
- **Tailwind CSS 4** - Styling
- **Node.js** - Runtime JavaScript

---

## Fitur yang Bisa Dicoba

### Landing Page
- Klik tombol "Mulai Konsultasi Gratis"
- Scroll untuk lihat semua fitur
- Lihat phone mockup dengan animasi

### Chat Page
- Ketik pesan dan kirim
- Lihat response dari AI (simulasi)

### Mood Page
- Pilih mood (Senang, Tenang, Biasa, Sedih, Cemas, Marah)
- Tambah catatan
- Simpan dan lihat riwayat

### Dashboard
- Lihat grafik mood mingguan
- Check statistik
- Baca insights personal

---

## Next Steps

1. Jalankan aplikasi
2. Explore semua halaman
3. Coba fitur-fitur interaktif
4. Customize sesuai kebutuhan
5. Deploy ke production (Vercel/Netlify)

---

## Butuh Bantuan?

Baca dokumentasi lengkap di:
- QUICKSTART.md
- INSTALLATION.md
- SUMMARY.md