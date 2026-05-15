# MindMate API Reference

Dokumentasi endpoint backend FastAPI. Base URL development:

```
http://localhost:8000
```

Dokumentasi interaktif (Swagger): **http://localhost:8000/docs**

Penjelasan arsitektur & alur internal: [BACKEND.md](./BACKEND.md)

---

## Health

### `GET /`

Cek cepat API hidup.

**Response 200**

```json
{
  "message": "MindMate API is running"
}
```

---

### `GET /health`

Status detail untuk monitoring.

**Response 200**

```json
{
  "status": "ok",
  "app": "MindMate API",
  "version": "0.1.0",
  "supabase_configured": false,
  "ai_configured": false,
  "storage": "in_memory"
}
```

| Field | Arti |
|-------|------|
| `supabase_configured` | `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` terisi |
| `ai_configured` | API key AI sesuai `AI_PROVIDER` terisi |
| `storage` | `in_memory` atau `supabase` |

---

## Chat

Prefix: `/api/chat`

### `POST /api/chat`

Kirim pesan, dapat balasan + analisis emosi.

**Request body**

```json
{
  "message": "gue capek banget hidup",
  "user_id": "user-123"
}
```

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| `message` | string | ya | 1–4000 karakter |
| `user_id` | string | ya | ID unik user (email/UUID) |

**Response 200**

```json
{
  "reply": "Sepertinya kamu mengalami kelelahan yang cukup dalam. ...",
  "emotion": "burnout",
  "stress_level": 8,
  "message_id": "590edf23-9591-496d-be4b-a3ab20207f98"
}
```

**Nilai `emotion` yang valid**

`happy` | `sad` | `anxiety` | `burnout` | `neutral` | `anger` | `calm`

**Error 422** — validasi gagal (pesan kosong, dll.)

---

### `GET /api/chat/history/{user_id}`

Riwayat percakapan user (maks. 100 pesan terakhir).

**Response 200**

```json
{
  "user_id": "user-123",
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "gue capek banget",
      "emotion": null,
      "stress_level": null,
      "created_at": "2026-05-15T10:00:00Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "Sepertinya kamu mengalami...",
      "emotion": "burnout",
      "stress_level": 8,
      "created_at": "2026-05-15T10:00:01Z"
    }
  ]
}
```

---

## Mood

Prefix: `/api/mood`

### `POST /api/mood`

Simpan atau update mood harian (satu entri per user per tanggal).

**Request body**

```json
{
  "user_id": "user-123",
  "mood": "stres",
  "note": "Deadline besok",
  "entry_date": "2026-05-15"
}
```

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| `user_id` | string | ya | |
| `mood` | string | ya | Lihat daftar mood di bawah |
| `note` | string | tidak | Maks. 2000 karakter |
| `entry_date` | date (YYYY-MM-DD) | tidak | Default: hari ini |

**Nilai `mood` yang valid**

`senang` | `tenang` | `biasa` | `stres` | `sedih` | `cemas` | `marah`

**Response 200**

```json
{
  "status": "success",
  "entry_id": "50f74273-739d-4671-a789-d31d21aab52a",
  "date": "2026-05-15"
}
```

---

### `GET /api/mood/history/{user_id}`

**Query parameters**

| Param | Default | Range |
|-------|---------|-------|
| `days` | 30 | 1–365 |

**Response 200**

```json
{
  "user_id": "user-123",
  "days": 30,
  "entries": [
    {
      "id": "uuid",
      "user_id": "user-123",
      "mood": "stres",
      "note": "Deadline besok",
      "entry_date": "2026-05-15",
      "created_at": "2026-05-15T08:30:00Z"
    }
  ]
}
```

---

### `GET /api/mood/stats/{user_id}`

Statistik agregat dari semua entri mood user.

**Response 200**

```json
{
  "user_id": "user-123",
  "total_entries": 5,
  "streak_days": 3,
  "positive_percent": 40.0,
  "average_score": 3.2,
  "dominant_mood": "biasa"
}
```

| Field | Arti |
|-------|------|
| `streak_days` | Hari berturut-turut ada entri, dihitung mundur dari hari ini |
| `positive_percent` | % mood `senang` + `tenang` |
| `average_score` | Rata-rata skor 1–5 (lihat BACKEND.md) |
| `dominant_mood` | Mood paling sering, atau `null` jika belum ada data |

---

## Insights

Prefix: `/api/insights`

> Route `/weekly/...` dan `/recommendations/...` harus dipanggil dengan path lengkap (bukan sebagai `user_id`).

### `GET /api/insights/{user_id}`

Ringkasan + highlight personal.

**Response 200**

```json
{
  "user_id": "user-123",
  "summary": "Mood kamu stabil dengan rata-rata skor 3.2/5.",
  "highlights": [
    "Kamu sudah mencatat mood 3 hari berturut-turut.",
    "Mood kamu cenderung lebih rendah di hari Jumat."
  ]
}
```

---

### `GET /api/insights/weekly/{user_id}`

Laporan 7 hari terakhir untuk grafik dashboard.

**Response 200**

```json
{
  "user_id": "user-123",
  "week_label": "7 hari terakhir",
  "average_mood_score": 3.5,
  "mood_trend": [
    { "day": "Sen", "score": 4 },
    { "day": "Sel", "score": null },
    { "day": "Rab", "score": 3 }
  ],
  "summary": "Rata-rata mood minggu ini 3.5/5."
}
```

---

### `GET /api/insights/recommendations/{user_id}`

Rekomendasi aktivitas berdasarkan mood & chat terakhir.

**Response 200**

```json
{
  "user_id": "user-123",
  "recommendations": [
    {
      "id": "rec-stres",
      "type": "breathing",
      "title": "Latihan Pernapasan",
      "description": "Coba teknik 4-7-8 selama 2 menit untuk menurunkan stres.",
      "reason": "Berdasarkan mood terakhir: stres"
    }
  ]
}
```

**Tipe rekomendasi (`type`)**

`breathing` | `journaling` | `exercise` | `mindfulness` | dll.

---

## CORS & frontend

Frontend Next.js memanggil API dari origin berbeda. Pastikan `backend/.env`:

```env
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Contoh curl

```bash
# Health
curl http://localhost:8000/health

# Chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"aku cemas banget","user_id":"demo"}'

# Mood
curl -X POST http://localhost:8000/api/mood \
  -H "Content-Type: application/json" \
  -d '{"user_id":"demo","mood":"cemas","note":"ujian"}'

# Insights
curl http://localhost:8000/api/insights/demo
```
