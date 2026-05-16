# MindMate — Dokumentasi

## Mulai dari sini

| Dokumen | Isi |
|---------|-----|
| [architecture.md](./architecture.md) | Tech stack, pola arsitektur, data flow, env vars |
| [api-docs.md](./api-docs.md) | Referensi semua endpoint + contoh request/response |
| [CARA_MENJALANKAN.md](./CARA_MENJALANKAN.md) | Cara run frontend + backend lokal |
| [SUPABASE.md](./SUPABASE.md) | Setup database, schema, RLS, RPC |
| [AUTH.md](./AUTH.md) | Supabase Auth, JWT, protected routes |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy ke Vercel + Render |

---

## Quick start

```bash
# Backend
cd backend
cp .env.example .env   # isi OPENAI_API_KEY minimal
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (terminal baru)
cd frontend
cp .env.example .env.local   # isi NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

- Frontend: http://localhost:3000
- Backend + Swagger: http://localhost:8000/docs

---

## Fitur yang sudah jalan

| Fitur | Keterangan |
|-------|------------|
| AI Chat | GPT-4o-mini, system prompt empatik Bahasa Indonesia |
| Emotion + Stress Score | Structured JSON dari model, disimpan ke DB |
| Mood Tracker | Catat mood harian, chart 7 hari, statistik real |
| Dashboard | Data nyata dari API — trend, distribusi, insights |
| Rule-based Insights | Deteksi hari mood rendah, streak emosi negatif |
| Smart Recommendations | Berdasarkan emotion chat + mood terakhir, prioritas signal |
| Daily AI Summary | Generate sekali sehari, cache di DB, fallback rule-based |
