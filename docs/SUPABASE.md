# MindMate — Supabase Setup

Panduan lengkap database PostgreSQL + integrasi backend/frontend.

---

## Ringkasan

| Komponen | Lokasi | Fungsi |
|----------|--------|--------|
| SQL migrations | `supabase/migrations/` | Schema, RLS, RPC functions |
| Seed data | `supabase/seed.sql` | Data demo opsional |
| Backend client | `backend/app/services/supabase_client.py` | Service role (admin) |
| Repository | `backend/app/repositories/supabase.py` | CRUD + RPC |
| Frontend client | `frontend/lib/supabase.js` | Anon key + Auth |

**Mode penyimpanan backend** (`STORAGE_BACKEND`):

| Nilai | Perilaku |
|-------|----------|
| `auto` (default) | Supabase jika URL + service key ada, else in-memory |
| `supabase` | Wajib Supabase; error 503 jika belum dikonfigurasi |
| `memory` | Selalu RAM (dev tanpa cloud) |

---

## Langkah setup (15 menit)

### 1. Buat project di [supabase.com](https://supabase.com)

- New project → catat **Project URL** dan **API keys**

### 2. Jalankan migration SQL

**Opsi A — SQL Editor (paling mudah)**

1. Dashboard → **SQL Editor** → New query  
2. Jalankan berurutan isi file:
   - `supabase/migrations/20240515000000_initial_schema.sql`
   - `supabase/migrations/20240515000001_rls_policies.sql`
   - `supabase/migrations/20240515000002_rpc_functions.sql`
3. (Opsional) `supabase/seed.sql` untuk user demo

**Opsi B — Supabase CLI**

```bash
npm i -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

### 3. Isi environment backend

`backend/.env`:

```env
STORAGE_BACKEND=auto
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # service_role — RAHASIA
```

> Jangan pernah commit `.env` atau expose **service_role** ke frontend.

### 4. Isi environment frontend

`frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   # anon public — aman di browser
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Install dependency frontend:

```bash
cd frontend && npm install @supabase/supabase-js
```

### 5. Verifikasi

```bash
cd backend && source venv/bin/activate && uvicorn app.main:app --reload
curl http://localhost:8000/health
```

Harapan:

```json
{
  "status": "ok",
  "storage": "supabase",
  "supabase_configured": true,
  "supabase_connected": true
}
```

---

## Skema database

### Diagram relasi

```
profiles (id TEXT PK)
    │
    ├── chat_sessions (UUID)
    │       └── chat_messages
    │
    ├── mood_entries (unique: user_id + entry_date)
    │
    └── daily_summaries (unique: user_id + summary_date)
```

### Tabel `profiles`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | TEXT PK | ID user dari app (`user_id` di API) |
| `auth_user_id` | UUID | Link ke `auth.users` jika pakai Supabase Auth |
| `email` | TEXT | Opsional |
| `display_name` | TEXT | Opsional |
| `preferences` | JSONB | Setting user |

Trigger `on_auth_user_created` otomatis buat profile saat signup Supabase Auth.

### Tabel `chat_sessions`

Sesi percakapan (multi-session di masa depan). Backend otomatis pakai **satu sesi aktif** per user via RPC `get_or_create_active_session`.

### Tabel `chat_messages`

| Kolom | Keterangan |
|-------|------------|
| `role` | `user` \| `assistant` |
| `emotion` | Enum: happy, sad, anxiety, burnout, … |
| `stress_level` | 1–10 |
| `session_id` | FK ke `chat_sessions` |

Trigger `on_chat_message_insert` update `message_count` & `last_message_at` di session.

### Tabel `mood_entries`

| Kolom | Keterangan |
|-------|------------|
| `mood` | senang, tenang, biasa, stres, sedih, cemas, marah |
| `mood_score` | **Generated column** (1–5) otomatis dari `mood` |
| `entry_date` | Satu entri per user per hari (UNIQUE) |

### Tabel `daily_summaries`

Ringkasan harian (untuk fitur Daily AI Summary). Method `upsert_daily_summary` ada di `SupabaseRepository`.

---

## Row Level Security (RLS)

Semua tabel user data pakai RLS. Policy: user hanya akses baris miliknya via `is_profile_owner(user_id)`.

**Backend** memakai **service_role** → bypass RLS (normal untuk BFF).

**Frontend** memakai **anon key** + JWT user → RLS aktif (aman untuk akses langsung nanti).

---

## RPC functions (PostgreSQL)

| Function | Dipakai untuk |
|----------|----------------|
| `ensure_profile(user_id, email, display_name)` | Buat/update profile sebelum insert data |
| `get_or_create_active_session(user_id)` | Session chat aktif |
| `get_mood_stats(user_id)` | Statistik agregat (streak, dominan, rata-rata) |
| `get_mood_trend(user_id, days)` | Data grafik 7+ hari |

Dipanggil dari Python:

```python
client.rpc("get_mood_stats", {"p_user_id": user_id}).execute()
```

---

## Arsitektur backend

```
Router → get_repository() → factory
                                ├── MemoryRepository (RAM)
                                └── SupabaseRepository (PostgreSQL)
```

File penting:

- `app/repositories/factory.py` — pilih storage
- `app/repositories/supabase.py` — implementasi Supabase
- `app/repositories/memory.py` — fallback dev
- `app/models/domain.py` — `ChatRecord`, `MoodRecord`

---

## Frontend client

```javascript
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

if (isSupabaseConfigured()) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
}
```

Saat ini auth utama masih `AuthContext` + localStorage. Migrasi ke Supabase Auth = langkah berikutnya (profile `id` akan = `auth.uid()`).

---

## Troubleshooting

| Gejala | Solusi |
|--------|--------|
| `supabase_connected: false` | Cek URL/key, pastikan migration sudah dijalankan |
| `relation "profiles" does not exist` | Jalankan migration `000000` |
| `RPC get_mood_stats failed` | Jalankan migration `000002` |
| FK violation on insert | Panggil `ensure_profile` dulu (otomatis di repository) |
| Data hilang setelah restart | `storage: in_memory` — isi `SUPABASE_*` di `.env` |
| 503 repository_error | Lihat detail di response; biasanya constraint atau network |

---

## Keamanan

1. **Service role** hanya di `backend/.env`
2. **Anon key** boleh di frontend — dilindungi RLS
3. Jangan log API keys
4. Untuk production: rotate keys, enable Supabase network restrictions

---

## Referensi

- [BACKEND.md](./BACKEND.md) — arsitektur API
- [api-docs.md](./api-docs.md) — endpoint REST
