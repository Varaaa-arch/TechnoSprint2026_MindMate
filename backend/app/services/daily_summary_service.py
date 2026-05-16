"""Daily AI Summary — generate sekali sehari, cache di DB."""

from __future__ import annotations

from collections import Counter
from datetime import date

from app.config import get_settings
from app.repositories import get_repository
from app.schemas.insights import DailySummaryResponse

NEG_EMOTIONS = frozenset({"anxiety", "burnout", "sad", "anger"})


def _rule_summary(user_id: str, store) -> tuple[str, str | None, float | None, list[str]]:
    """Fallback rule-based summary. Returns (text, dominant_emotion, avg_score, highlights)."""
    stats = store.get_mood_stats(user_id)
    chats = store.get_chat_history(user_id, limit=30)
    today_chats = [m for m in chats if m.created_at.date() == date.today()]

    # Dominant emotion hari ini dari chat
    emotions = [m.emotion for m in today_chats if m.role == "assistant" and m.emotion]
    dominant_emotion = Counter(emotions).most_common(1)[0][0] if emotions else None

    avg_stress = None
    if today_chats:
        stresses = [m.stress_level for m in today_chats if m.stress_level is not None]
        avg_stress = round(sum(stresses) / len(stresses), 1) if stresses else None

    avg_mood = stats.get("average_score")
    highlights: list[str] = []

    if dominant_emotion in NEG_EMOTIONS:
        label = {"anxiety": "cemas", "burnout": "kelelahan", "sad": "sedih", "anger": "marah"}.get(dominant_emotion, dominant_emotion)
        highlights.append(f"Hari ini kamu banyak merasakan {label}.")
    if avg_mood and avg_mood >= 4:
        highlights.append("Mood kamu hari ini cukup positif.")
    elif avg_mood and avg_mood <= 2:
        highlights.append("Mood kamu hari ini cenderung rendah — pertimbangkan istirahat.")
    if stats.get("streak_days", 0) >= 3:
        highlights.append(f"Streak {stats['streak_days']} hari mencatat mood. Konsisten!")

    parts = []
    if dominant_emotion:
        label = {"anxiety": "cemas", "burnout": "kelelahan", "sad": "sedih", "anger": "marah",
                 "happy": "senang", "calm": "tenang", "neutral": "netral"}.get(dominant_emotion, dominant_emotion)
        parts.append(f"Hari ini kamu terdeteksi banyak merasa {label}.")
    if avg_mood:
        parts.append(f"Rata-rata mood kamu {avg_mood}/5.")
    if not parts:
        parts.append("Belum ada cukup data hari ini untuk membuat ringkasan.")

    return " ".join(parts), dominant_emotion, avg_mood, highlights


def _openai_summary(user_id: str, store) -> str:
    from openai import OpenAI
    settings = get_settings()
    client = OpenAI(api_key=settings.openai_api_key)

    chats = store.get_chat_history(user_id, limit=30)
    today_msgs = [m for m in chats if m.created_at.date() == date.today() and m.role == "user"]
    mood_history = store.get_mood_history(user_id, days=1)

    context_parts = []
    if mood_history:
        context_parts.append(f"Mood hari ini: {mood_history[0].mood}")
        if mood_history[0].note:
            context_parts.append(f"Catatan: {mood_history[0].note}")
    if today_msgs:
        snippets = [m.content[:120] for m in today_msgs[-5:]]
        context_parts.append("Topik percakapan hari ini: " + " | ".join(snippets))

    if not context_parts:
        return ""

    prompt = (
        "Berdasarkan data berikut, buat ringkasan harian singkat (2-3 kalimat) "
        "yang empatik dan personal dalam Bahasa Indonesia. "
        "Jangan diagnosis, fokus pada validasi perasaan dan satu dorongan positif.\n\n"
        + "\n".join(context_parts)
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=150,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()


def get_daily_summary(user_id: str) -> DailySummaryResponse:
    store = get_repository()
    settings = get_settings()
    today = date.today()

    # Cache hit — sudah generate hari ini
    cached = store.get_daily_summary(user_id, today)
    if cached:
        return DailySummaryResponse(
            user_id=user_id,
            summary_date=today,
            summary_text=cached.get("summary_text", ""),
            mood_score_avg=cached.get("mood_score_avg"),
            dominant_emotion=cached.get("dominant_emotion"),
            highlights=cached.get("highlights") or [],
            generated_by=cached.get("generated_by", "rule_engine"),
            from_cache=True,
        )

    # Generate baru
    rule_text, dominant_emotion, avg_mood, highlights = _rule_summary(user_id, store)

    summary_text = rule_text
    generated_by = "rule_engine"

    if settings.openai_configured:
        try:
            ai_text = _openai_summary(user_id, store)
            if ai_text:
                summary_text = ai_text
                generated_by = "openai"
        except Exception:
            pass  # tetap pakai rule_text

    store.upsert_daily_summary(
        user_id, today, summary_text,
        mood_score_avg=avg_mood,
        dominant_emotion=dominant_emotion,
        highlights=highlights,
        generated_by=generated_by,
    )

    return DailySummaryResponse(
        user_id=user_id,
        summary_date=today,
        summary_text=summary_text,
        mood_score_avg=avg_mood,
        dominant_emotion=dominant_emotion,
        highlights=highlights,
        generated_by=generated_by,
        from_cache=False,
    )
