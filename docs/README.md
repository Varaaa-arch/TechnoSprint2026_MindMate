# MindMate — Dokumentasi

MindMate adalah aplikasi AI untuk pendampingan kesehatan mental — chat empatik, pelacakan mood harian, dan insight personal berbasis data nyata.

Dibuat untuk TechnoSprint 2026 oleh tim SMK Negeri 1 Jakarta.

---

## Tim Pengembang

| Nama | Sekolah | Peran |
|------|---------|-------|
| Muhammad Bimo Nurcahyo | SMK Negeri 1 Jakarta | Fullstack Developer |
| Bizar Octo Givardi | SMK Negeri 1 Jakarta | Backend & AI Integration |
| Muzayyin Arifin Nabhan | SMK Negeri 1 Jakarta | Frontend & UI/UX |

---

## Dokumentasi

| Dokumen | Isi |
|---------|-----|
| [architecture.md](./architecture.md) | Tech stack, pola arsitektur, data flow, env vars |
| [api-docs.md](./api-docs.md) | Referensi semua endpoint + contoh request/response |
| [CARA_MENJALANKAN.md](./CARA_MENJALANKAN.md) | Cara run frontend + backend lokal |
| [SUPABASE.md](./SUPABASE.md) | Setup database, schema, RLS, RPC |
| [AUTH.md](./AUTH.md) | Supabase Auth, JWT, protected routes |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy ke Vercel + Render |

---

## Quick Start

```bash
# Backend
cd backend
cp .env.example .env        # isi OPENAI_API_KEY minimal
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (terminal baru)
cd frontend
cp .env.example .env.local  # isi NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

- Frontend: http://localhost:3000
- Backend + Swagger: http://localhost:8000/docs

---

## Fitur

| Fitur | Keterangan |
|-------|------------|
| AI Chat | GPT-4o-mini, system prompt empatik Bahasa Indonesia, non-diagnostic |
| Emotion + Stress Score | Structured JSON dari model, disimpan ke database |
| Mood Tracker | Catat mood harian, chart 7 hari, statistik real-time |
| Dashboard | Semua data dari API — trend, distribusi, insights |
| Rule-based Insights | Deteksi hari mood rendah berulang, streak emosi negatif |
| Smart Recommendations | Berdasarkan emotion chat + mood terakhir, prioritas signal |
| Daily AI Summary | Di-generate sekali sehari, di-cache di DB, fallback rule-based |

---

## Tech Stack

- **Frontend** — Next.js 15, React 19, Tailwind CSS 4
- **Backend** — FastAPI, Python 3.10+
- **Database** — Supabase (PostgreSQL + Auth + RLS)
- **AI** — OpenAI GPT-4o-mini
