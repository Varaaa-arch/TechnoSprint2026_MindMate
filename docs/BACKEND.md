# MindMate Backend — Dokumentasi Lengkap

Dokumen ini menjelaskan **semua yang dibangun di backend FastAPI**, dari konsep besar sampai detail implementasi per file. Ditulis supaya tim (atau juri) bisa memahami *mengapa* struktur ini dipakai, bukan hanya *apa* filenya.

---

## Daftar isi

1. [Gambaran besar](#1-gambaran-besar)
2. [Kenapa arsitektur berlapis](#2-kenapa-arsitektur-berlapis)
3. [Struktur folder](#3-struktur-folder)
4. [Konfigurasi & environment](#4-konfigurasi--environment)
5. [Entry point: `main.py`](#5-entry-point-mainpy)
6. [Layer Router (HTTP)](#6-layer-router-http)
7. [Layer Schema (validasi data)](#7-layer-schema-validasi-data)
8. [Layer Service (logika bisnis)](#8-layer-service-logika-bisnis)
9. [Alur data per fitur](#9-alur-data-per-fitur)
10. [Penyimpanan data: in-memory vs Supabase](#10-penyimpanan-data-in-memory-vs-supabase)
11. [Integrasi dengan frontend](#11-integrasi-dengan-frontend)
12. [Menjalankan backend](#12-menjalankan-backend)
13. [Yang sudah vs belum](#13-yang-sudah-vs-belum)
14. [Roadmap teknis](#14-roadmap-teknis)

---

## 1. Gambaran besar

MindMate backend adalah **REST API** berbasis **FastAPI** yang menjadi “otak” aplikasi:

- Menerima request dari frontend Next.js (browser).
- Menjalankan **logika bisnis** (chat, mood, insight).
- Menyimpan data (sementara di **memori RAM**, nanti di **Supabase**).
- Mengembalikan response JSON yang **tervalidasi** (bentuk datanya konsisten).

```
┌─────────────┐     HTTP/JSON      ┌──────────────────┐     (nanti)     ┌──────────┐
│  Next.js    │ ◄────────────────► │  FastAPI Backend │ ◄──────────────► │ Supabase │
│  Frontend   │   localhost:3000   │  localhost:8000  │                 │ Postgres │
└─────────────┘                    └────────┬─────────┘                 └──────────┘
                                            │
                                            ▼ (nanti)
                                   ┌──────────────────┐
                                   │  OpenAI API      │
                                   └──────────────────┘
```

**Prinsip desain:** pisahkan tanggung jawab.

| Lapisan | Tugas | Contoh file |
|---------|--------|-------------|
| **Router** | Terima HTTP, baca path/body, panggil service | `routers/chat.py` |
| **Schema** | Validasi & bentuk JSON masuk/keluar | `schemas/chat.py` |
| **Service** | Logika bisnis, hitung insight, deteksi emosi | `services/chat_service.py` |
| **Store** | Simpan/baca data | `services/store.py` |
| **Config** | Baca `.env`, secret, CORS | `config.py` |

Router **tidak** boleh penuh logika rumit — supaya mudah di-test dan diganti storage-nya nanti tanpa ubah URL API.

---

## 2. Kenapa arsitektur berlapis

Tanpa pemisahan, satu file `main.py` bisa berisi ratusan baris: routing + AI + database + validasi. Itu sulit dirawat.

Dengan lapisan:

1. **Frontend hanya tahu URL** — misalnya `POST /api/chat`. Isi dalamnya bisa ganti dari mock → OpenAI tanpa ubah kontrak API.
2. **Schema Pydantic** menolak request rusak (pesan kosong, mood invalid) sebelum masuk logika.
3. **Store terpisah** — hari ini `InMemoryStore`, besok `SupabaseStore`, service tetap memanggil `get_store()`.

Ini pola umum di produksi: mirip **Repository Pattern** + **Service Layer**.

---

## 3. Struktur folder

```
backend/
├── .env.example          # Template variabel lingkungan (di-commit ke git)
├── .env                  # Nilai asli (TIDAK di-commit — ada di .gitignore)
├── requirements.txt      # Dependensi Python
├── dockerfile            # Image Docker untuk deploy
├── venv/                 # Virtual environment lokal (tidak di-commit)
└── app/
    ├── __init__.py
    ├── main.py           # Membuat aplikasi FastAPI
    ├── config.py         # Settings dari .env
    ├── routers/          # Endpoint HTTP
    │   ├── health.py
    │   ├── chat.py
    │   ├── mood.py
    │   └── insights.py
    ├── schemas/          # Model Pydantic (request/response)
    │   ├── common.py
    │   ├── chat.py
    │   ├── mood.py
    │   └── insights.py
    └── services/         # Logika bisnis + akses data
        ├── store.py
        ├── chat_service.py
        ├── insights_service.py
        └── supabase_client.py
```

### Peran setiap file

| File | Peran |
|------|--------|
| `.env.example` | Dokumentasi env apa saja yang dibutuhkan; developer copy jadi `.env` |
| `requirements.txt` | Daftar paket: `fastapi`, `uvicorn`, `pydantic-settings`, `supabase`, `openai`, dll. |
| `dockerfile` | Build container Python 3.11, jalankan `uvicorn` di port **8000** |
| `app/main.py` | Satu-satunya tempat rakit app: CORS, daftarkan router |
| `app/config.py` | Baca env sekali, cache dengan `@lru_cache` |
| `routers/*.py` | Mapping URL → fungsi handler |
| `schemas/*.py` | Kontrak JSON + validasi otomatis |
| `services/store.py` | Database sementara di RAM |
| `services/chat_service.py` | Proses chat + deteksi emosi |
| `services/insights_service.py` | Generate insight & rekomendasi dari data |
| `services/supabase_client.py` | Klien Supabase (siap, belum dipakai router) |

---

## 4. Konfigurasi & environment

### Apa itu `.env`?

File teks berisi **konfigurasi rahasia / per-lingkungan** (API key, URL database). Tidak masuk git karena bisa bocor.

Alur:

1. Developer: `cp .env.example .env`
2. Isi nilai asli (Supabase URL, OpenAI key, dll.)
3. Saat server start, `python-dotenv` + `pydantic-settings` membaca file itu ke objek `Settings`

### File `app/config.py`

```python
class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",      # baca dari backend/.env
        extra="ignore",       # abaikan env yang tidak dikenal
    )
```

**Pydantic Settings** otomatis memetakan:

| Variabel di `.env` | Field Python | Default |
|--------------------|--------------|---------|
| `APP_NAME` | `app_name` | `"MindMate API"` |
| `DEBUG` | `debug` | `False` |
| `CORS_ORIGINS` | `cors_origins` | `http://localhost:3000,...` |
| `SUPABASE_URL` | `supabase_url` | `None` |
| `SUPABASE_SERVICE_ROLE_KEY` | `supabase_service_role_key` | `None` |
| `OPENAI_API_KEY` | `openai_api_key` | `None` |
| `ANTHROPIC_API_KEY` | `anthropic_api_key` | `None` |
| `AI_PROVIDER` | `ai_provider` | `"openai"` |

**Property helper:**

- `cors_origin_list` — string `"http://a,http://b"` dipecah jadi list untuk middleware CORS.
- `supabase_configured` — `True` hanya jika URL **dan** service role key terisi.
- `ai_configured` — cek OpenAI atau Anthropic sesuai `AI_PROVIDER`.

**`@lru_cache` pada `get_settings()`:**

Settings dibaca sekali per proses server. Hemat I/O dan konsisten selama runtime.

### CORS — kenapa perlu?

Browser memblokir request dari `localhost:3000` (frontend) ke `localhost:8000` (backend) kecuali backend mengizinkan via header **CORS**.

Di `main.py`:

```python
CORSMiddleware(
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Tanpa ini, `fetch()` dari Next.js akan gagal di browser meskipun Postman/curl berhasil.

---

## 5. Entry point: `main.py`

### Factory pattern: `create_app()`

Fungsi `create_app()` membangun instance `FastAPI` — berguna untuk testing dan Docker (bisa import `app` tanpa side effect aneh).

### Lifespan

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    app.title = settings.app_name
    yield
```

Hook saat startup/shutdown. Saat ini hanya set judul app; nanti bisa dipakai untuk koneksi DB pool, warm-up model, dll.

### Registrasi router

```python
app.include_router(health.router)
app.include_router(chat.router)
app.include_router(mood.router)
app.include_router(insights.router)
```

Setiap router punya `prefix` sendiri, misalnya `APIRouter(prefix="/api/chat")`.

**Ekspor:** `app = create_app()` — ini yang dipanggil Uvicorn: `uvicorn app.main:app`.

---

## 6. Layer Router (HTTP)

Router = **penerjemah HTTP → Python**. Tipis: validasi via Pydantic, panggil service, return response model.

### `routers/health.py`

| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/` | Pesan sederhana: API hidup |
| GET | `/health` | Status detail: versi, Supabase/AI terkonfigurasi, mode storage |

Response `/health` membantu monitoring & debug tanpa buka Swagger.

### `routers/chat.py`

Prefix: `/api/chat`

| Method | Path | Handler |
|--------|------|---------|
| POST | `` (jadi `/api/chat`) | `send_message` → `process_chat()` |
| GET | `/history/{user_id}` | Ambil riwayat dari store |

**Catatan path:** `POST ""` dengan prefix `/api/chat` = URL penuh `POST /api/chat` (sesuai `frontend/lib/api.js`).

### `routers/mood.py`

Prefix: `/api/mood`

| Method | Path | Fungsi |
|--------|------|--------|
| POST | `` | Simpan/update mood harian |
| GET | `/history/{user_id}?days=30` | Riwayat mood |
| GET | `/stats/{user_id}` | Statistik agregat |

Query `days` dibatasi 1–365 via `Query(ge=1, le=365)`.

### `routers/insights.py`

Prefix: `/api/insights`

**Urutan route penting di FastAPI:**

Route spesifik harus **didaftarkan sebelum** route generik `{user_id}`:

```python
GET /weekly/{user_id}           # dulu
GET /recommendations/{user_id}  # dulu
GET /{user_id}                  # terakhir
```

Kalau `/{user_id}` di atas, kata `"weekly"` bisa tertangkap sebagai `user_id` dan endpoint salah.

---

## 7. Layer Schema (validasi data)

**Pydantic** memastikan body JSON sesuai tipe sebelum handler jalan. Kalau salah → HTTP **422 Unprocessable Entity** otomatis + detail error.

### `schemas/chat.py`

- **`ChatRequest`**: `message` (1–4000 karakter), `user_id` wajib.
- **`ChatResponse`**: `reply`, `emotion`, `stress_level` (1–10), `message_id`.
- **`EmotionLabel`**: literal type — hanya nilai yang diizinkan: `happy`, `sad`, `anxiety`, `burnout`, `neutral`, `anger`, `calm`.
- **`ChatMessageOut` / `ChatHistoryResponse`**: format riwayat chat.

### `schemas/mood.py`

- **`MoodId`**: `senang`, `tenang`, `biasa`, `stres`, `sedih`, `cemas`, `marah` — selaras dengan frontend `mood/page.js`.
- **`MoodRequest`**: `user_id`, `mood`, `note` opsional, `entry_date` opsional (default hari ini).
- **`MoodStatsResponse`**: streak, persen positif, skor rata-rata, mood dominan.

### `schemas/insights.py`

- Insight umum, laporan mingguan (termasuk `mood_trend` array), daftar rekomendasi.

### `schemas/common.py`

- **`HealthResponse`**: untuk endpoint monitoring.
- **`MessageResponse`**: pesan string sederhana di root `/`.

**Kenapa `response_model=` di decorator?**

FastAPI memfilter field tambahan, generate dokumentasi OpenAPI di `/docs`, dan serialize datetime ke ISO string.

---

## 8. Layer Service (logika bisnis)

### 8.1 `services/store.py` — In-Memory Store

**Masalah:** Belum ada tabel Supabase; tetap perlu backend jalan untuk develop & demo.

**Solusi:** `InMemoryStore` — dictionary Python di RAM:

```
_chats[user_id]  → list[ChatRecord]
_moods[user_id]  → list[MoodRecord]
```

#### Model data internal

**`ChatRecord`**: id (UUID), user_id, role (`user` | `assistant`), content, emotion, stress_level, created_at (UTC).

**`MoodRecord`**: id, user_id, mood, note, entry_date, created_at.

#### Skor mood

| Mood ID | Skor (1–5) |
|---------|-------------|
| senang | 5 |
| tenang | 4 |
| biasa | 3 |
| stres | 2 |
| sedih | 1 |
| cemas | 2 |
| marah | 2 |

Dipakai statistik & grafik mingguan.

#### Operasi penting

**`add_chat_message`** — append ke list user.

**`upsert_mood`** — satu entri per `user_id` + `entry_date`. Kalau hari yang sama sudah ada → **update**, bukan duplikat.

**`get_mood_history(user_id, days)`** — filter entri dalam N hari terakhir, urut terbaru dulu.

**`get_mood_stats(user_id)`**:

- `streak_days`: hitung mundur dari **hari ini** berapa hari berturut-turut ada entri.
- `positive_percent`: % mood `senang` atau `tenang`.
- `dominant_mood`: mood paling sering muncul.

#### Singleton `get_store()`

```python
_store: InMemoryStore | None = None

def get_store() -> InMemoryStore:
    global _store
    if _store is None:
        _store = InMemoryStore()
    return _store
```

Satu instance store per proses server. **Keterbatasan:** restart server = data hilang; tidak shared antar worker Uvicorn. Itu sengaja untuk fase dev — nanti diganti Supabase.

---

### 8.2 `services/chat_service.py` — Chat & emosi

Alur `process_chat(user_id, message)`:

```
1. detect_emotion(message)     → emotion + stress_level
2. store.add_chat_message(user)
3. generate_reply(...)         → teks balasan
4. store.add_chat_message(assistant, emotion, stress_level)
5. return ChatResponse
```

#### Deteksi emosi (rule-based, sementara)

Bukan ML — **keyword matching** bahasa Indonesia/Inggris:

| Emotion | Contoh kata kunci |
|---------|-------------------|
| burnout | capek, lelah banget, bosan hidup |
| anxiety | cemas, panik, overthinking |
| sad | sedih, murung, kecewa |
| anger | marah, kesal, sebel |
| happy | senang, bahagia, syukur |
| calm | tenang, damai |

Urutan list penting: emotion yang dicek lebih dulu menang jika banyak kata cocok.

**Stress level** dipetakan tetap per emotion (mis. burnout = 8, calm = 2).

#### Generate reply (fallback)

Belum panggil OpenAI. Menggabungkan:

- Prefix sesuai emotion (empati singkat)
- Salah satu dari 4 template `FALLBACK_REPLIES` (random)

Ini placeholder sampai `OPENAI_API_KEY` diintegrasikan di fase berikutnya.

---

### 8.3 `services/insights_service.py` — Insight & rekomendasi

Semua **rule-based** dari data di store — tidak pakai LLM.

#### `build_insights(user_id)`

Membaca statistik 14 hari + mood history:

- Streak ≥ 3 hari → highlight pujian konsistensi.
- ≥ 50% mood positif → highlight persentase.
- Else jika ada data rendah → saran istirahat.
- Analisis **hari dalam seminggu** (`weekday()`): jika ada hari dengan skor ≤ 2 → “Mood cenderung rendah di hari Senin”, dll.

#### `build_weekly_report(user_id)`

Loop 7 hari terakhir (hari ini mundur 6 hari):

- Untuk tiap hari, cari entri mood → skor atau `null`.
- Rata-rata skor mingguan.
- Output `mood_trend`: `[{ day: "Sen", score: 4 }, ...]` untuk chart frontend.

#### `build_recommendations(user_id)`

1. Mood terbaru → map ke aktivitas (`stres` → breathing, `sedih` → journaling, …).
2. Scan 5 pesan chat terakhir — jika assistant mendeteksi `anxiety`/`burnout` → tambah rekomendasi napas.
3. Jika kosong → rekomendasi default “Check-in Harian”.

---

### 8.4 `services/supabase_client.py`

```python
def get_supabase_client() -> Client | None:
    if not settings.supabase_configured:
        return None
    return create_client(url, key)
```

- **`@lru_cache`**: satu klien per proses.
- **`TYPE_CHECKING`**: import `Client` hanya untuk type hint, hindari import berat saat tidak dipakai.
- **Service role key** (bukan anon key): backend butuh akses tulis penuh; key ini **hanya di server**, tidak pernah di frontend.

Router **belum** memanggil fungsi ini — disiapkan untuk fase Supabase berikutnya.

---

## 9. Alur data per fitur

### 9.1 User mengirim chat

```
Browser                FastAPI                    Store (RAM)
   │                      │                           │
   │ POST /api/chat       │                           │
   │ {message, user_id}──►│ ChatRequest validasi      │
   │                      │ process_chat()            │
   │                      │ ├── detect_emotion       │
   │                      │ ├── add user message ────►│
   │                      │ ├── generate_reply       │
   │                      │ ├── add assistant msg ───►│
   │◄── JSON ChatResponse │                           │
```

### 9.2 User menyimpan mood

```
POST /api/mood { user_id, mood, note }
  → upsert_mood (ganti jika tanggal sama)
  → { status: "success", entry_id, date }
```

### 9.3 Dashboard minta insight

```
GET /api/insights/{user_id}
  → build_insights() baca store
  → { summary, highlights[] }

GET /api/insights/weekly/{user_id}
  → mood_trend 7 hari

GET /api/insights/recommendations/{user_id}
  → list rekomendasi personal
```

---

## 10. Penyimpanan data: in-memory vs Supabase

| Aspek | In-Memory (sekarang) | Supabase (rencana) |
|-------|----------------------|---------------------|
| Persistensi | Hilang saat restart | Permanen di PostgreSQL |
| Multi-device | Tidak | Ya, per `user_id` |
| Skala | Satu proses | Managed DB |
| Setup | Tanpa akun cloud | Butuh schema + migration |

Endpoint `/health` field `storage`:

- `"in_memory"` jika Supabase env kosong
- `"supabase"` jika URL + key terisi (meski router belum pakai)

**Migrasi nanti:** buat interface repository, implementasi `SupabaseStore` dengan query yang sama seperti method di `InMemoryStore`, ganti isi `get_store()` berdasarkan config.

---

## 11. Integrasi dengan frontend

File `frontend/lib/api.js` sudah mendefinisikan client:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

Mapping endpoint:

| Frontend method | Backend URL |
|-----------------|-------------|
| `sendMessage(message, userId)` | `POST /api/chat` |
| `getChatHistory(userId)` | `GET /api/chat/history/{userId}` |
| `saveMood(moodData)` | `POST /api/mood` |
| `getMoodHistory(userId, days)` | `GET /api/mood/history/{userId}?days=` |
| `getMoodStats(userId)` | `GET /api/mood/stats/{userId}` |
| `getInsights(userId)` | `GET /api/insights/{userId}` |
| `getWeeklyReport(userId)` | `GET /api/insights/weekly/{userId}` |
| `getRecommendations(userId)` | `GET /api/insights/recommendations/{userId}` |

**Catatan:** Halaman chat & mood frontend **belum** memanggil API ini (masih mock/localStorage). Wiring frontend = langkah berikutnya.

**`user_id`:** Saat auth masih localStorage, frontend bisa kirim email atau UUID stabil dari profil user.

---

## 12. Menjalankan backend

### Lokal (tanpa Docker)

```bash
cd backend
cp .env.example .env
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://localhost:8000  
- Swagger UI: http://localhost:8000/docs  
- ReDoc: http://localhost:8000/redoc  

### Docker Compose (dari root repo)

`docker-compose.yml` mount `backend/.env`, port `8000:8000`, command reload untuk develop.

### `dockerfile` — perbaikan

Port CMD sebelumnya salah (`80000`). Sekarang:

```dockerfile
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 13. Yang sudah vs belum

### Sudah ada

- Struktur FastAPI production-ready (router / schema / service)
- Config dari `.env` + CORS
- Semua endpoint yang dibutuhkan frontend
- Validasi request/response Pydantic
- Chat dengan deteksi emosi + stress level (rule-based)
- Mood CRUD in-memory + statistik
- Insight, laporan mingguan, rekomendasi (rule-based)
- Health check + OpenAPI docs otomatis
- Klien Supabase siap (belum dipakai)

### Belum ada

- Panggilan OpenAI / Anthropic di `chat_service`
- Penyimpanan ke Supabase (tabel belum dibuat)
- Autentikasi JWT / Supabase Auth di header request
- Rate limiting, logging terstruktur, unit test
- Daily AI summary terpisah (bisa ditambah di `insights` nanti)

---

## 14. Roadmap teknis

Urutan disarankan:

1. **Wire frontend** → panggil `lib/api.js` dari chat & mood.
2. **Schema Supabase** → `profiles`, `mood_entries`, `chat_messages`.
3. **Ganti `get_store()`** → baca/tulis Supabase.
4. **OpenAI** di `generate_reply()` dengan system prompt empatik + safety.
5. **Auth** → verifikasi token di dependency FastAPI, `user_id` dari token bukan body.
6. **Deploy** → Render/Railway (API) + Vercel (front).

---

## Referensi terkait

- [API Reference](./api-docs.md) — contoh request/response tiap endpoint
- [Architecture](./architecture.md) — diagram sistem keseluruhan
- [Cara Menjalankan](./CARA_MENJALANKAN.md) — panduan praktis
