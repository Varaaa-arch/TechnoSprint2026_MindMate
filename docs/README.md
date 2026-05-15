# Dokumentasi MindMate

Index semua dokumentasi proyek.

---

## Backend (baru)

| Dokumen | Isi |
|---------|-----|
| **[BACKEND.md](./BACKEND.md)** | Penjelasan lengkap backend FastAPI — struktur folder, config, setiap lapisan, alur data, store, emosi, insight, roadmap |
| **[SUPABASE.md](./SUPABASE.md)** | Schema PostgreSQL, RLS, RPC, setup env, repository Supabase |
| **[AUTH.md](./AUTH.md)** | Supabase Auth: login, JWT, protected API |
| **[api-docs.md](./api-docs.md)** | Referensi endpoint: request/response, contoh curl |
| **[architecture.md](./architecture.md)** | Diagram sistem, BFF pattern, komponen, data flow |

Mulai dari sini kalau mau paham **akar-akar** backend: [BACKEND.md](./BACKEND.md)

---

## Setup & menjalankan

| Dokumen | Isi |
|---------|-----|
| [START_HERE.md](./START_HERE.md) | Titik awal project |
| [CARA_MENJALANKAN.md](./CARA_MENJALANKAN.md) | Panduan Bahasa Indonesia |
| [INSTALLATION.md](./INSTALLATION.md) | Instalasi detail |
| [QUICKSTART.md](./QUICKSTART.md) | Quick start |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy Vercel/Render |

---

## Frontend & project

| Dokumen | Isi |
|---------|-----|
| [SUMMARY.md](./SUMMARY.md) | Ringkasan fitur UI yang sudah dibuat |
| [CHECKLIST.md](./CHECKLIST.md) | Checklist progress |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Struktur folder repo |

---

## Quick: jalankan backend

```bash
cd backend
cp .env.example .env
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Docs interaktif: http://localhost:8000/docs
