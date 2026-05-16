"""Rule-based insights from mood + chat data."""

from __future__ import annotations

from collections import Counter
from datetime import date, timedelta

from app.schemas.insights import (
    InsightResponse,
    RecommendationItem,
    RecommendationsResponse,
    WeeklyReportResponse,
)
from app.models.domain import MOOD_SCORES
from app.repositories import get_repository

DAY_NAMES = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
WEEK_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

# (type, title, description, duration_minutes)
MOOD_RECS: dict[str, list[tuple]] = {
    "sedih": [
        ("journaling", "Journaling Perasaan", "Tulis apa yang kamu rasakan tanpa filter — tidak perlu rapi, cukup jujur.", 10),
        ("exercise",   "Jalan Kaki Singkat",  "Gerakan ringan 10 menit terbukti membantu mengangkat mood.", 10),
    ],
    "stres": [
        ("breathing",  "Teknik 4-7-8",        "Tarik napas 4 detik, tahan 7 detik, hembuskan 8 detik. Ulangi 4x.", 5),
        ("exercise",   "Peregangan Ringan",   "Regangkan leher, bahu, dan punggung selama 5 menit untuk lepaskan ketegangan.", 5),
    ],
    "cemas": [
        ("breathing",  "Grounding 5-4-3-2-1", "Sebut 5 hal yang kamu lihat, 4 yang kamu sentuh, 3 yang kamu dengar, 2 yang kamu cium, 1 yang kamu rasakan.", 5),
        ("mindfulness","Body Scan Singkat",   "Pejamkan mata, rasakan setiap bagian tubuh dari kepala ke kaki selama 5 menit.", 5),
    ],
    "marah": [
        ("exercise",   "Olahraga Pelepas",    "Lari kecil atau lompat-lompat 5 menit untuk melepas energi marah secara fisik.", 5),
        ("breathing",  "Napas Kotak",         "Tarik 4 detik, tahan 4 detik, hembuskan 4 detik, tahan 4 detik. Ulangi 5x.", 5),
    ],
    "senang": [
        ("exercise",   "Pertahankan Momentum","Manfaatkan energi positif dengan aktivitas ringan 15 menit.", 15),
        ("journaling", "Catat Momen Baik",    "Tulis 3 hal spesifik yang membuatmu senang hari ini agar mudah diingat kembali.", 5),
    ],
    "tenang": [
        ("mindfulness","Mindful Walk",        "Jalan santai 10 menit sambil fokus penuh pada napas dan lingkungan sekitar.", 10),
        ("journaling", "Refleksi Harian",     "Luangkan 5 menit untuk menulis satu hal yang kamu pelajari hari ini.", 5),
    ],
    "biasa": [
        ("mindfulness","Check-in Diri",       "Tanyakan pada diri sendiri: apa yang benar-benar kamu butuhkan sekarang?", 5),
    ],
}

# Mapping emotion dari chat ke mood key
EMOTION_TO_MOOD: dict[str, str] = {
    "sad": "sedih", "anxiety": "cemas", "burnout": "stres",
    "anger": "marah", "happy": "senang", "calm": "tenang", "neutral": "biasa",
}


LOW_MOOD = frozenset({"sedih", "stres", "cemas", "marah"})
NEG_EMOTIONS = frozenset({"anxiety", "burnout", "sad", "anger"})


def _rule_low_weekday(history: list) -> str | None:
    """Hari dalam seminggu yang paling sering mood rendah (min 2 kejadian)."""
    low_counts: Counter[int] = Counter(
        e.entry_date.weekday() for e in history if e.mood in LOW_MOOD
    )
    if not low_counts:
        return None
    wd, count = low_counts.most_common(1)[0]
    if count >= 2:
        return f"Mood kamu cenderung lebih rendah di hari {DAY_NAMES[wd]} ({count}x dalam 2 minggu terakhir)."
    return None


def _rule_consecutive_negative_chat(user_id: str, store) -> str | None:
    """N hari berturut-turut dengan emotion negatif dari chat."""
    messages = store.get_chat_history(user_id, limit=50)
    # Ambil emotion per hari (hari paling baru dulu)
    by_date: dict[date, list[str]] = {}
    for m in messages:
        if m.role == "assistant" and m.emotion:
            d = m.created_at.date()
            by_date.setdefault(d, []).append(m.emotion)

    # Hitung streak hari berturut dengan mayoritas emosi negatif
    today = date.today()
    streak = 0
    for i in range(len(by_date)):
        d = today - timedelta(days=i)
        emotions = by_date.get(d, [])
        if not emotions:
            break
        neg_count = sum(1 for e in emotions if e in NEG_EMOTIONS)
        if neg_count / len(emotions) >= 0.5:
            streak += 1
        else:
            break

    if streak >= 2:
        dominant = Counter(
            e for d in list(by_date.keys())[:streak]
            for e in by_date[d] if e in NEG_EMOTIONS
        ).most_common(1)
        emotion_label = dominant[0][0] if dominant else "negatif"
        label_id = {"anxiety": "cemas", "burnout": "kelelahan", "sad": "sedih", "anger": "marah"}.get(emotion_label, emotion_label)
        return f"{streak} hari berturut-turut kamu terdeteksi merasa {label_id} dalam percakapan. Pertimbangkan istirahat atau bicara dengan seseorang."
    return None


def build_insights(user_id: str) -> InsightResponse:
    store = get_repository()
    stats = store.get_mood_stats(user_id)
    history = store.get_mood_history(user_id, days=14)
    highlights: list[str] = []

    # Rule 1: streak pencatatan
    if stats["streak_days"] >= 3:
        highlights.append(f"Kamu sudah mencatat mood {stats['streak_days']} hari berturut-turut. Konsistensi yang bagus!")

    # Rule 2: hari dengan mood rendah berulang
    low_day = _rule_low_weekday(history)
    if low_day:
        highlights.append(low_day)

    # Rule 3: N hari berturut emosi negatif dari chat
    consec = _rule_consecutive_negative_chat(user_id, store)
    if consec:
        highlights.append(consec)

    # Rule 4: overall positif/negatif
    if not low_day and not consec:
        if stats["positive_percent"] >= 60:
            highlights.append(f"{stats['positive_percent']}% mood kamu minggu ini bersifat positif. Pertahankan!")
        elif stats["total_entries"] >= 3:
            highlights.append("Beberapa hari terakhir mood cenderung rendah — jangan ragu untuk istirahat sejenak.")

    if not highlights:
        highlights.append("Mulai catat mood harian untuk mendapatkan insight yang lebih personal.")

    summary = (
        f"Mood kamu stabil dengan rata-rata skor {stats['average_score']}/5."
        if stats["total_entries"]
        else "Belum ada data mood. Mulai catat perasaanmu hari ini."
    )

    return InsightResponse(user_id=user_id, summary=summary, highlights=highlights)


def build_weekly_report(user_id: str) -> WeeklyReportResponse:
    store = get_repository()
    today = date.today()
    week_data = []
    scores = []

    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        entries = [e for e in store.get_mood_history(user_id, days=7) if e.entry_date == d]
        score = MOOD_SCORES.get(entries[0].mood, 0) if entries else 0
        if score:
            scores.append(score)
        week_data.append({"day": WEEK_LABELS[6 - i], "score": score or None})

    avg = round(sum(scores) / len(scores), 2) if scores else 0.0
    summary = (
        f"Rata-rata mood minggu ini {avg}/5."
        if scores
        else "Belum ada entri mood minggu ini."
    )

    return WeeklyReportResponse(
        user_id=user_id,
        week_label="7 hari terakhir",
        average_mood_score=avg,
        mood_trend=week_data,
        summary=summary,
    )


def _recs_for(mood_key: str, source: str, limit: int = 2) -> list[RecommendationItem]:
    entries = MOOD_RECS.get(mood_key, MOOD_RECS["biasa"])
    return [
        RecommendationItem(
            id=f"rec-{mood_key}-{i}",
            type=rec_type,
            title=title,
            description=desc,
            duration_minutes=dur,
            reason=source,
        )
        for i, (rec_type, title, desc, dur) in enumerate(entries[:limit])
    ]


def build_recommendations(user_id: str) -> RecommendationsResponse:
    store = get_repository()
    items: list[RecommendationItem] = []
    seen_types: set[str] = set()

    # Signal 1 (prioritas tinggi): emotion terbaru dari chat
    chats = store.get_chat_history(user_id, limit=20)
    latest_emotion = next(
        (m.emotion for m in reversed(chats) if m.role == "assistant" and m.emotion and m.emotion != "neutral"),
        None,
    )
    if latest_emotion:
        mood_key = EMOTION_TO_MOOD.get(latest_emotion, "biasa")
        for item in _recs_for(mood_key, f"Terdeteksi dari percakapan: {latest_emotion}"):
            if item.type not in seen_types:
                items.append(item)
                seen_types.add(item.type)

    # Signal 2: mood tracker terbaru (tambah jika tipe belum ada)
    history = store.get_mood_history(user_id, days=7)
    if history:
        latest_mood = history[0].mood
        for item in _recs_for(latest_mood, f"Berdasarkan mood terakhir: {latest_mood}"):
            if item.type not in seen_types and len(items) < 3:
                items.append(item)
                seen_types.add(item.type)

    # Fallback
    if not items:
        items = _recs_for("biasa", "Rekomendasi umum")

    return RecommendationsResponse(user_id=user_id, recommendations=items[:3])
