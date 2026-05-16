# MindMate API Reference

Base URL development: `http://localhost:8000`

Swagger UI interaktif: **http://localhost:8000/docs**

Semua endpoint `/api/*` memerlukan header `Authorization: Bearer <supabase_access_token>`.  
Untuk dev tanpa auth, set `REQUIRE_AUTH=false` di `backend/.env`.

---

## Health

### `GET /health`

```json
{
  "status": "ok",
  "app": "MindMate API",
  "version": "0.1.0",
  "supabase_configured": true,
  "ai_configured": true,
  "storage": "supabase"
}
```

---

## Chat

### `POST /api/chat`

Kirim pesan, dapat balasan empatik + analisis emosi dari GPT-4o-mini.

**Request**
```json
{ "message": "aku cemas banget soal ujian" }
```

**Response**
```json
{
  "reply": "Kecemasan menjelang ujian itu wajar banget...",
  "emotion": "anxiety",
  "stress_level": 7,
  "message_id": "uuid"
}
```

| Field | Keterangan |
|-------|------------|
| `emotion` | `happy` \| `sad` \| `anxiety` \| `burnout` \| `neutral` \| `anger` \| `calm` |
| `stress_level` | 1–10 (1=sangat tenang, 10=krisis) |

---

### `GET /api/chat/history`

Riwayat percakapan user (maks. 100 pesan terakhir).

**Response**
```json
{
  "user_id": "uuid",
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "aku cemas banget",
      "emotion": null,
      "stress_level": null,
      "created_at": "2026-05-16T10:00:00Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "Kecemasan itu wajar...",
      "emotion": "anxiety",
      "stress_level": 7,
      "created_at": "2026-05-16T10:00:01Z"
    }
  ]
}
```

---

## Mood

### `POST /api/mood`

Simpan atau update mood hari ini (upsert per user per tanggal).

**Request**
```json
{
  "mood": "cemas",
  "note": "deadline besok",
  "entry_date": "2026-05-16"
}
```

Nilai `mood` valid: `senang` | `tenang` | `biasa` | `stres` | `sedih` | `cemas` | `marah`

**Response**
```json
{ "status": "success", "entry_id": "uuid", "date": "2026-05-16" }
```

---

### `GET /api/mood/history?days=30`

Riwayat mood N hari terakhir (default 30, max 365).

---

### `GET /api/mood/stats`

Statistik agregat mood user.

**Response**
```json
{
  "user_id": "uuid",
  "total_entries": 12,
  "streak_days": 4,
  "positive_percent": 58.3,
  "average_score": 3.6,
  "dominant_mood": "tenang"
}
```

---

## Insights

### `GET /api/insights`

Ringkasan + highlight rule-based dari pola mood & chat.

**Response**
```json
{
  "user_id": "uuid",
  "summary": "Mood kamu stabil dengan rata-rata skor 3.6/5.",
  "highlights": [
    "Mood kamu cenderung lebih rendah di hari Senin (2x dalam 2 minggu terakhir).",
    "3 hari berturut-turut kamu terdeteksi merasa cemas dalam percakapan."
  ]
}
```

---

### `GET /api/insights/weekly`

Data tren 7 hari untuk line chart dashboard.

**Response**
```json
{
  "user_id": "uuid",
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

### `GET /api/insights/recommendations`

Rekomendasi aktivitas berdasarkan emotion chat + mood tracker terakhir.

**Response**
```json
{
  "user_id": "uuid",
  "recommendations": [
    {
      "id": "rec-cemas-0",
      "type": "breathing",
      "title": "Grounding 5-4-3-2-1",
      "description": "Sebut 5 hal yang kamu lihat...",
      "duration_minutes": 5,
      "reason": "Terdeteksi dari percakapan: anxiety"
    }
  ]
}
```

Tipe: `breathing` | `journaling` | `exercise` | `mindfulness`

---

### `GET /api/insights/daily-summary`

Ringkasan harian AI — di-generate sekali per hari, di-cache di DB.

**Response**
```json
{
  "user_id": "uuid",
  "summary_date": "2026-05-16",
  "summary_text": "Hari ini kamu banyak merasakan kecemasan...",
  "mood_score_avg": 3.2,
  "dominant_emotion": "anxiety",
  "highlights": ["Streak 4 hari mencatat mood!"],
  "generated_by": "openai",
  "from_cache": false
}
```

| Field | Keterangan |
|-------|------------|
| `generated_by` | `openai` atau `rule_engine` |
| `from_cache` | `true` jika sudah di-generate hari ini |

---

## Contoh curl

```bash
# Health
curl http://localhost:8000/health

# Chat (tanpa auth)
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"aku cemas banget"}'

# Mood
curl -X POST http://localhost:8000/api/mood \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"mood":"cemas","note":"ujian besok"}'

# Daily Summary
curl http://localhost:8000/api/insights/daily-summary \
  -H "Authorization: Bearer <token>"
```
