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
from app.services.store import MOOD_SCORES, get_store

DAY_NAMES = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
WEEK_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

RECOMMENDATIONS_BY_MOOD = {
    "stres": ("breathing", "Latihan Pernapasan", "Coba teknik 4-7-8 selama 2 menit untuk menurunkan stres."),
    "sedih": ("journaling", "Journaling Singkat", "Tulis 3 hal yang kamu syukuri hari ini."),
    "cemas": ("breathing", "Grounding 5-4-3-2-1", "Sebut 5 hal yang kamu lihat, 4 yang kamu sentuh, dan seterusnya."),
    "senang": ("exercise", "Pertahankan Momentum", "Manfaatkan energi positif dengan aktivitas ringan 15 menit."),
    "tenang": ("mindfulness", "Mindful Walk", "Jalan santai 10 menit sambil fokus pada napas."),
}


def build_insights(user_id: str) -> InsightResponse:
    store = get_store()
    stats = store.get_mood_stats(user_id)
    history = store.get_mood_history(user_id, days=14)
    highlights: list[str] = []

    if stats["streak_days"] >= 3:
        highlights.append(f"Kamu sudah mencatat mood {stats['streak_days']} hari berturut-turut.")
    if stats["positive_percent"] >= 50:
        highlights.append(f"{stats['positive_percent']}% entri minggu ini bersifat positif.")
    elif history:
        highlights.append("Beberapa hari terakhir mood cenderung rendah — jangan ragu untuk istirahat.")

    if history:
        by_weekday: Counter[int] = Counter()
        for entry in history:
            by_weekday[entry.entry_date.weekday()] += 1
        low_days = [
            DAY_NAMES[wd]
            for wd, _ in by_weekday.most_common()
            if any(e.entry_date.weekday() == wd and MOOD_SCORES.get(e.mood, 3) <= 2 for e in history)
        ]
        if low_days:
            highlights.append(f"Mood kamu cenderung lebih rendah di hari {low_days[0]}.")

    if not highlights:
        highlights.append("Mulai catat mood harian untuk mendapatkan insight yang lebih personal.")

    summary = (
        f"Mood kamu stabil dengan rata-rata skor {stats['average_score']}/5."
        if stats["total_entries"]
        else "Belum ada data mood. Mulai catat perasaanmu hari ini."
    )

    return InsightResponse(user_id=user_id, summary=summary, highlights=highlights)


def build_weekly_report(user_id: str) -> WeeklyReportResponse:
    store = get_store()
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


def build_recommendations(user_id: str) -> RecommendationsResponse:
    store = get_store()
    history = store.get_mood_history(user_id, days=7)
    items: list[RecommendationItem] = []

    if history:
        latest = history[0]
        rec = RECOMMENDATIONS_BY_MOOD.get(latest.mood)
        if rec:
            rec_type, title, desc = rec
            items.append(
                RecommendationItem(
                    id=f"rec-{latest.mood}",
                    type=rec_type,
                    title=title,
                    description=desc,
                    reason=f"Berdasarkan mood terakhir: {latest.mood}",
                )
            )

    chats = store.get_chat_history(user_id, limit=5)
    for msg in reversed(chats):
        if msg.role == "assistant" and msg.emotion in ("anxiety", "burnout"):
            items.append(
                RecommendationItem(
                    id="rec-chat-stress",
                    type="breathing",
                    title="Istirahat Sejenak",
                    description="Ambil 5 napas dalam perlahan sebelum melanjutkan aktivitas.",
                    reason=f"Terdeteksi dari percakapan: {msg.emotion}",
                )
            )
            break

    if not items:
        items.append(
            RecommendationItem(
                id="rec-default",
                type="mindfulness",
                title="Check-in Harian",
                description="Luangkan 2 menit untuk menilai perasaanmu dan catat di mood tracker.",
                reason="Rekomendasi umum",
            )
        )

    return RecommendationsResponse(user_id=user_id, recommendations=items)
