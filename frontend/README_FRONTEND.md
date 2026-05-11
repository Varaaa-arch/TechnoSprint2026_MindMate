# MindMate Frontend

Landing page dan aplikasi web untuk MindMate - Teman AI untuk Kesehatan Mental.

## 🎨 Fitur yang Telah Dibuat

### 1. **Landing Page (Home)**
- Hero section dengan CTA yang menarik
- Mockup aplikasi mobile
- Section fitur utama dengan 3 kartu fitur
- CTA card dengan statistik
- Testimonial dari pengguna
- Footer lengkap dengan navigasi

### 2. **Halaman Chat**
- Interface chat yang interaktif
- Real-time messaging UI
- Bot response simulation
- Input area dengan form validation

### 3. **Halaman Mood Tracker**
- 6 pilihan mood dengan emoji
- Form untuk menambahkan catatan
- Riwayat mood dengan timeline
- Statistik mood mingguan

### 4. **Halaman Dashboard (Insights)**
- Grafik tren mood mingguan
- Distribusi mood dengan progress bar
- Statistik mingguan (4 kartu metrik)
- Wawasan personal (4 insight cards)
- Rekomendasi aktivitas

### 5. **Komponen Navbar**
- Navigasi responsif
- Active state untuk halaman aktif
- Icon notifikasi dan profil

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (versi 18 atau lebih baru)
- npm atau yarn

### Instalasi

1. Masuk ke folder frontend:
```bash
cd frontend
```

2. Install dependencies (jika belum):
```bash
npm install
```

3. Jalankan development server:
```bash
npm run dev
```

4. Buka browser dan akses:
```
http://localhost:3000
```

## 📁 Struktur File

```
frontend/
├── app/
│   ├── components/
│   │   └── Navbar.js          # Komponen navigasi
│   ├── chat/
│   │   └── page.js            # Halaman chat
│   ├── mood/
│   │   └── page.js            # Halaman mood tracker
│   ├── dashboard/
│   │   └── page.js            # Halaman insights
│   ├── page.js                # Landing page (home)
│   ├── layout.js              # Root layout
│   └── globals.css            # Global styles
├── public/                     # Static assets
├── package.json
└── next.config.mjs
```

## 🎨 Design System

### Warna Utama
- **Primary**: Indigo (#4F46E5)
- **Secondary**: Purple (#9333EA)
- **Accent**: Yellow, Green, Blue (untuk mood indicators)

### Typography
- Font: Geist Sans (default Next.js)
- Heading: Bold, 2xl-4xl
- Body: Regular, sm-lg

### Komponen UI
- Rounded corners: 2xl (rounded-2xl)
- Shadows: lg, xl untuk cards
- Gradients: from-to pattern untuk backgrounds

## 🔧 Teknologi yang Digunakan

- **Next.js 16.2.4** - React framework
- **React 19.2.4** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **ESLint** - Code linting

## 📱 Responsive Design

Semua halaman telah dibuat responsive dengan breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Fitur Interaktif

### Landing Page
- Hover effects pada buttons dan cards
- Smooth transitions
- Gradient backgrounds

### Chat Page
- Real-time message display
- Auto-scroll ke pesan terbaru
- Form validation

### Mood Page
- Mood selection dengan visual feedback
- Dynamic mood history
- Stats cards dengan animasi

### Dashboard
- Interactive charts
- Progress bars dengan animasi
- Hover effects pada insights cards

## 🔜 Pengembangan Selanjutnya

Untuk menghubungkan dengan backend:

1. Update file `lib/api.js` dengan endpoint backend
2. Implementasi API calls di setiap halaman
3. Tambahkan state management (Redux/Zustand)
4. Implementasi authentication
5. Real-time updates dengan WebSocket

## 📝 Catatan

- Semua data saat ini adalah dummy data untuk demonstrasi
- Untuk production, perlu integrasi dengan backend API
- Perlu menambahkan error handling dan loading states
- Perlu implementasi authentication dan authorization
