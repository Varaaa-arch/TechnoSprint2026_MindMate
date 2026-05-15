# 📦 Panduan Instalasi MindMate

Panduan lengkap untuk menginstal dan menjalankan aplikasi MindMate di komputer lokal Anda.

## 📋 Prerequisites

Sebelum memulai, pastikan Anda telah menginstal:

### Required
- **Node.js** (versi 18.0 atau lebih baru)
  - Download: https://nodejs.org/
  - Cek versi: `node --version`
  
- **npm** (biasanya sudah termasuk dengan Node.js)
  - Cek versi: `npm --version`

### Optional (untuk backend)
- **Python** (versi 3.9 atau lebih baru)
  - Download: https://www.python.org/
  - Cek versi: `python --version`

- **pip** (Python package manager)
  - Cek versi: `pip --version`

## 🚀 Instalasi Frontend

### 1. Clone atau Download Repository

```bash
# Jika menggunakan Git
git clone <repository-url>

# Atau download ZIP dan extract
```

### 2. Masuk ke Folder Frontend

```bash
cd TechnoSprint2026_MindMate/frontend
```

### 3. Install Dependencies

```bash
npm install
```

Proses ini akan menginstal semua package yang diperlukan:
- Next.js 16.2.4
- React 19.2.4
- Tailwind CSS 4
- ESLint

**Catatan:** Proses instalasi mungkin memakan waktu beberapa menit tergantung kecepatan internet Anda.

### 4. Jalankan Development Server

```bash
npm run dev
```

### 5. Buka di Browser

Buka browser dan akses:
```
http://localhost:3000
```

Anda akan melihat landing page MindMate! 🎉

## 🛠️ Perintah NPM yang Tersedia

```bash
# Menjalankan development server
npm run dev

# Build untuk production
npm run build

# Menjalankan production server
npm start

# Menjalankan linter
npm run lint
```

## 🐍 Instalasi Backend (Opsional)

### 1. Masuk ke Folder Backend

```bash
cd TechnoSprint2026_MindMate/backend
```

### 2. Buat Virtual Environment (Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Setup Environment Variables

Buat file `.env` di folder backend:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
AI_API_KEY=your_ai_api_key
```

### 5. Jalankan Backend Server

```bash
uvicorn app.main:app --reload
```

Backend akan berjalan di:
```
http://localhost:8000
```

API Documentation tersedia di:
```
http://localhost:8000/docs
```

## 🐳 Instalasi dengan Docker (Alternative)

Jika Anda memiliki Docker terinstal:

### 1. Build dan Jalankan dengan Docker Compose

```bash
cd TechnoSprint2026_MindMate
docker-compose up --build
```

Ini akan menjalankan:
- Frontend di `http://localhost:3000`
- Backend di `http://localhost:8000`

### 2. Stop Docker Containers

```bash
docker-compose down
```

## 🔧 Troubleshooting

### Error: "Module not found"

**Solusi:**
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

### Error: "Port 3000 already in use"

**Solusi:**
```bash
# Gunakan port lain
npm run dev -- -p 3001
```

Atau matikan aplikasi yang menggunakan port 3000.

### Error: "Python not found"

**Solusi:**
- Pastikan Python sudah terinstal
- Tambahkan Python ke PATH environment variable
- Restart terminal/command prompt

### Error: "npm command not found"

**Solusi:**
- Install Node.js dari https://nodejs.org/
- Restart terminal/command prompt
- Cek instalasi: `node --version` dan `npm --version`

### Build Error dengan Tailwind CSS

**Solusi:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📱 Testing di Mobile

### 1. Cari IP Address Komputer Anda

**Windows:**
```bash
ipconfig
```

**macOS/Linux:**
```bash
ifconfig
```

Cari IP address (contoh: 192.168.1.100)

### 2. Akses dari Mobile

Di browser mobile, akses:
```
http://192.168.1.100:3000
```

**Catatan:** Pastikan mobile dan komputer terhubung ke jaringan WiFi yang sama.

## 🔐 Environment Variables (Production)

Untuk production, buat file `.env.local` di folder frontend:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Monitoring Development

### Hot Reload
Next.js secara otomatis akan reload halaman saat Anda menyimpan perubahan file.

### Console Logs
Buka Developer Tools (F12) di browser untuk melihat console logs dan error.

### Network Tab
Gunakan Network tab di Developer Tools untuk memonitor API calls.

## 🎯 Next Steps

Setelah instalasi berhasil:

1. ✅ Explore semua halaman (Home, Chat, Mood, Dashboard)
2. ✅ Coba fitur-fitur interaktif
3. ✅ Baca dokumentasi API di `/docs`
4. ✅ Mulai development atau customization

## 📞 Butuh Bantuan?

Jika mengalami masalah:

1. Cek dokumentasi di folder `/docs`
2. Baca error message dengan teliti
3. Search error di Google atau Stack Overflow
4. Hubungi tim development

## 🎉 Selamat!

Anda berhasil menginstal MindMate! Sekarang Anda siap untuk:
- Menggunakan aplikasi
- Melakukan development
- Customize sesuai kebutuhan

---

**Happy Coding! 💻✨**
