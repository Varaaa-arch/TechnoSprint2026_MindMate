# MindMate — Architecture

## Tech Stack

| Lapisan | Teknologi | Status |
|---------|-----------|--------|
| Frontend | Next.js 15 (App Router) | ✅ Production-ready |
| Backend | FastAPI (Python 3.10+) | ✅ Production-ready |
| Database | Supabase (PostgreSQL) | ✅ Schema + RLS sudah ada |
| AI | OpenAI GPT-4o-mini | ✅ Aktif (fallback rule-based) |
| Deploy | Vercel + Render | 🔜 Siap deploy |

---

## Pattern: Backend-for-Frontend (BFF)

Frontend tidak langsung ke Supabase atau OpenAI. Semua lewat FastAPI.

```
Browser (Next.js)
       │
       │ REST JSON + Bearer token
       ▼
   FastAPI BFF
   ├── Validasi & auth (Supabase JWT)
   ├── Business logic (insights, recommendations)
   ├── OpenAI GPT-4o-mini (chat + daily summary)
   └── Supabase PostgreSQL (storage)
```

Keuntungan: API key tidak pernah ke browser, satu titik validasi, frontend tetap tipis.

---

## Lapisan Backend

```
Request → Router → Service → Repository → DB/AI
                ↕
            Schema (Pydantic)
```

| Router | Service | Keterangan |
|--------|---------|------------|
| `chat.py` | `chat_service.py` | OpenAI structured JSON output |
| `mood.py` | — | Langsung ke repository |
| `insights.py` | `insights_service.py` + `daily_summary_service.py` | Rule-based + OpenAI |
| `auth.py` | — | Supabase JWT verify |
| `health.py` | — | Status check |

### Repository pattern

Dua implementasi dengan interface yang sama (`DataRepository` Protocol):

- `SupabaseRepository` — production, data persisten
- `MemoryRepository` — dev fallback, data hilang saat restart

Switch otomatis via `STORAGE_BACKEND=auto` di `.env`.

---

## Database (Supabase PostgreSQL)

Tabel utama:

| Tabel | Isi |
|-------|-----|
| `profiles` | User profile, terhubung ke Supabase Auth |
| `chat_sessions` | Sesi percakapan per user |
| `chat_messages` | Pesan + `emotion` + `stress_level` dari model |
| `mood_entries` | Mood harian, upsert per user per tanggal |
| `daily_summaries` | Cache ringkasan AI harian |

RLS aktif — user hanya bisa akses data miliknya sendiri.

---

## AI Features

### Chat (GPT-4o-mini)
- System prompt empatik Bahasa Indonesia, non-diagnostic
- `response_format: json_object` → satu call return `reply` + `emotion` + `stress_level`
- Fallback ke reply statis jika key tidak ada

### Daily Summary (GPT-4o-mini)
- Di-generate sekali per hari, di-cache di `daily_summaries`
- Input: mood hari ini + topik percakapan hari ini
- Fallback ke rule-based summary

### Insights & Recommendations (Rule-based)
- Deteksi hari dengan mood rendah berulang (≥2x/14 hari)
- Deteksi streak emosi negatif dari chat (≥2 hari berturut)
- Rekomendasi aktivitas berdasarkan emotion chat + mood tracker, dedup by type

---

## Data Flow

### Chat
```
User kirim pesan
→ POST /api/chat
→ chat_service: kirim ke OpenAI dengan history 10 pesan terakhir
→ parse JSON: reply + emotion + stress_level
→ simpan ke chat_messages
→ return ke frontend
```

### Dashboard load
```
Frontend: 5 request paralel (Promise.allSettled)
  ├── GET /api/insights/weekly      → line chart
  ├── GET /api/insights             → highlights
  ├── GET /api/insights/recommendations → aktivitas
  ├── GET /api/mood/stats           → stat cards
  └── GET /api/insights/daily-summary  → AI summary card
```

---

## Environment Variables

**`backend/.env`**
```env
OPENAI_API_KEY=sk-...          # Wajib untuk AI features
SUPABASE_URL=https://...       # Wajib untuk production
SUPABASE_SERVICE_ROLE_KEY=...  # Wajib untuk production
SUPABASE_JWT_SECRET=...        # Wajib untuk auth
REQUIRE_AUTH=true              # false untuk dev tanpa login
STORAGE_BACKEND=auto           # auto | memory | supabase
AI_PROVIDER=openai             # openai | anthropic
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Deployment

```
Vercel          → Next.js frontend (auto-deploy dari main)
Render/Railway  → FastAPI (Dockerfile di backend/)
Supabase Cloud  → PostgreSQL + Auth
```

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk langkah detail.
