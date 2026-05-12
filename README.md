# MindMate - Teman AI untuk Kesehatan Mental

![MindMate](https://img.shields.io/badge/MindMate-v1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black)
![React](https://img.shields.io/badge/React-19.2.4-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8)

MindMate adalah aplikasi kesehatan mental berbasis AI yang menyediakan dukungan emosional 24/7, pelacakan mood, dan wawasan mendalam tentang kesehatan mental pengguna.

## 🌟 Fitur Utama

### 1. **AI Chat yang Berempati**
- Chatbot AI yang dirancang khusus untuk memahami dan merespons perasaan pengguna
- Dukungan 24/7 kapan pun dibutuhkan
- Respons yang personal dan empatik

### 2. **Pelacakan Suasana Hati**
- Catat mood harian dengan 6 pilihan emoji
- Tambahkan catatan untuk setiap mood
- Lihat riwayat mood dari waktu ke waktu
- Statistik mood mingguan dan bulanan

### 3. **Dashboard Insights**
- Visualisasi tren mood mingguan
- Distribusi mood dengan grafik
- Wawasan personal berdasarkan pola mood
- Rekomendasi aktivitas untuk meningkatkan kesehatan mental

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Python 3.9+ (untuk backend)

### Instalasi Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Instalasi Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API akan berjalan di `http://localhost:8000`

## 📁 Struktur Proyek

```
TechnoSprint2026_MindMate/
├── frontend/                   # Next.js frontend application
│   ├── app/
│   │   ├── components/        # Reusable components
│   │   ├── chat/             # Chat page
│   │   ├── mood/             # Mood tracker page
│   │   ├── dashboard/        # Insights dashboard
│   │   ├── page.js           # Landing page
│   │   └── layout.js         # Root layout
│   ├── lib/                  # Utility functions
│   └── public/               # Static assets
│
├── backend/                   # FastAPI backend
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── db/               # Database configuration
│   │   ├── services/         # Business logic
│   │   └── main.py           # Application entry point
│   └── requirements.txt
│
├── docs/                      # Documentation
│   ├── api-docs.md
│   └── architecture.md
│
└── README.md
```

## 🎨 Halaman yang Telah Dibuat

### 1. Landing Page (/)
- Hero section dengan tagline dan CTA
- Mockup aplikasi mobile
- 3 fitur utama dengan deskripsi
- CTA card dengan statistik (10k+ pengguna, rating 4.9/5)
- Testimonial pengguna
- Footer lengkap

### 2. Chat Page (/chat)
- Interface chat yang clean dan modern
- Real-time messaging UI
- Bot response simulation
- Input area dengan validasi

### 3. Mood Tracker (/mood)
- 6 pilihan mood: Senang, Tenang, Biasa, Sedih, Cemas, Marah
- Form catatan mood
- Riwayat mood dengan timeline
- Statistik mood (45% positif, 7 hari streak, tren baik)

### 4. Dashboard Insights (/dashboard)
- 4 kartu statistik mingguan
- Grafik tren mood 7 hari
- Distribusi mood dengan progress bar
- 4 wawasan personal
- Rekomendasi aktivitas

## 🎨 Design System

### Warna
- **Primary**: Indigo (#4F46E5)
- **Secondary**: Purple (#9333EA)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)

### Typography
- **Font Family**: Geist Sans
- **Headings**: Bold, 2xl-6xl
- **Body**: Regular, sm-lg

### Spacing
- Consistent padding: 4, 6, 8, 12
- Gap between elements: 4, 6, 8

## 🔧 Teknologi

### Frontend
- **Next.js 16.2.4** - React framework dengan App Router
- **React 19.2.4** - UI library
- **Tailwind CSS 4** - Utility-first CSS
- **ESLint** - Code quality

### Backend
- **FastAPI** - Modern Python web framework
- **Supabase** - Database dan authentication
- **AI Service** - Integrasi dengan AI model

## 📱 Responsive Design

Semua halaman telah dioptimasi untuk:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🎯 Fitur Interaktif

- ✅ Hover effects pada semua buttons dan cards
- ✅ Smooth transitions dan animations
- ✅ Form validation
- ✅ Dynamic content updates
- ✅ Gradient backgrounds
- ✅ Icon animations

## 🔜 Roadmap

### Phase 1 (Completed) ✅
- [x] Landing page design
- [x] Chat interface
- [x] Mood tracker
- [x] Dashboard insights
- [x] Responsive design

### Phase 2 (Next)
- [ ] Backend API integration
- [ ] User authentication
- [ ] Real AI chat implementation
- [ ] Database integration
- [ ] Real-time updates

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Social features
- [ ] Professional consultation booking

## 📖 Dokumentasi

Untuk dokumentasi lebih lengkap, lihat:
- [Frontend README](./frontend/README_FRONTEND.md)
- [API Documentation](./docs/api-docs.md)
- [Architecture](./docs/architecture.md)

## 🤝 Kontribusi

Proyek ini dibuat untuk TechnoSprint 2026. 

## 📄 Lisensi

Copyright © 2026 MindMate Team. All rights reserved.

## 📞 Kontak

Untuk pertanyaan atau dukungan, silakan hubungi tim pengembang.

---

**Dibuat dengan ❤️ untuk kesehatan mental yang lebih baik**

MindMate adalah aplikasi AI-powered mood tracker dan chat companion yang membantu pengguna:

* Berinteraksi dengan AI
* Mencatat suasana hati harian
* Mendapatkan insight personal

---

## Tech Stack

### Frontend

* Next.js (App Router)
* JavaScript

### Backend

* FastAPI (Python)
* Uvicorn

### Database & Auth

* Supabase

### DevOps

* Docker & Docker Compose (opsional)

---

## Project Structure

```bash
mindmate/
├── frontend/
├── backend/
├── docs/
├── docker-compose.yml
└── README.md
```

---

## Setup & Installation

### 1. Clone Repository

```bash
git clone <repo-url>
cd mindmate
```

---

## 2. Setup Backend (FastAPI)

Masuk ke folder backend:

```bash
cd backend
```

Buat virtual environment:

```bash
python -m venv venv
```

Aktifkan environment:

Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Buat file `.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
```

Jalankan backend:

```bash
uvicorn app.main:app --reload
```

Backend berjalan di:
http://localhost:8000

API docs:
http://localhost:8000/docs

---

## 3. Setup Frontend (Next.js)

Masuk ke folder frontend:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Jalankan frontend:

```bash
npm run dev
```

Frontend berjalan di:
http://localhost:3000

---

## Development Workflow

Jalankan dua terminal:

Terminal 1 (frontend):

```bash
cd frontend
npm run dev
```

Terminal 2 (backend):

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

---

## Docker (Opsional)

Build dan jalankan:

```bash
docker compose up --build
```

Jalankan tanpa build ulang:

```bash
docker compose up
```

Stop container:

```bash
docker compose down
```

---

## API Endpoints

| Endpoint | Method | Description    |
| -------- | ------ | -------------- |
| /chat    | POST   | Chat dengan AI |
| /mood    | POST   | Simpan mood    |
| /insight | GET    | Ambil insight  |

---

## Notes

* Gunakan Node.js versi 18 atau lebih baru
* Gunakan Python 3.10 atau lebih baru
* Jangan commit file `.env`

---

## Future Improvements

* Emotion detection
* Mood analytics dashboard
* Recommendation engine
* Responsive UI

---

## License

MIT License
