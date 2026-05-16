"""Chat logic — OpenAI structured JSON: reply + emotion + stress_level dari model."""

from __future__ import annotations

import json
import random

from app.config import get_settings
from app.repositories import get_repository
from app.schemas.chat import ChatResponse, EmotionLabel

SYSTEM_PROMPT = """Kamu adalah MindMate, teman AI yang hangat dan empatik untuk kesehatan mental.

Panduan penting:
- Selalu gunakan Bahasa Indonesia yang natural dan hangat
- Dengarkan dengan penuh perhatian dan validasi perasaan pengguna
- JANGAN memberikan diagnosis, label medis, atau saran klinis
- Jika pengguna dalam krisis atau menyebut menyakiti diri sendiri, arahkan ke layanan darurat (119 ext 8 untuk hotline kesehatan jiwa Indonesia)
- Fokus pada dukungan emosional, bukan solusi instan
- Ajukan pertanyaan terbuka untuk membantu pengguna mengeksplorasi perasaannya
- Respons singkat dan natural (2-4 kalimat), bukan ceramah panjang
- Gunakan bahasa sehari-hari, bukan bahasa formal atau klinis

Kamu HARUS membalas dalam format JSON berikut (tanpa markdown, tanpa komentar):
{
  "reply": "<respons empatikmu>",
  "emotion": "<salah satu: happy|sad|anxiety|burnout|neutral|anger|calm>",
  "stress_level": <angka 1-10>
}

Panduan stress_level:
1-3 = tenang/positif, 4-5 = netral/sedikit terganggu, 6-7 = cukup tertekan, 8-10 = sangat tertekan/krisis"""

VALID_EMOTIONS: set[EmotionLabel] = {"happy", "sad", "anxiety", "burnout", "neutral", "anger", "calm"}

FALLBACK_REPLIES = [
    "Terima kasih sudah berbagi. Saya di sini untuk mendengarkan. Ceritakan lebih lanjut tentang apa yang kamu rasakan.",
    "Itu terdengar cukup berat. Wajar sekali merasa seperti itu. Apa yang biasanya membantu kamu merasa lebih tenang?",
    "Saya mengerti. Perasaan itu valid. Apa yang paling berat dari situasi ini buat kamu?",
]


def _call_openai(message: str, history: list[dict]) -> tuple[str, EmotionLabel, int]:
    from openai import OpenAI

    settings = get_settings()
    client = OpenAI(api_key=settings.openai_api_key)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for h in history[-10:]:
        role = "assistant" if h["role"] == "assistant" else "user"
        messages.append({"role": role, "content": h["content"]})
    messages.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=400,
        temperature=0.7,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content.strip()
    data = json.loads(raw)

    reply: str = data.get("reply", "")
    emotion: EmotionLabel = data.get("emotion", "neutral")
    stress_level: int = int(data.get("stress_level", 5))

    # Validasi nilai
    if emotion not in VALID_EMOTIONS:
        emotion = "neutral"
    stress_level = max(1, min(10, stress_level))

    return reply, emotion, stress_level


def process_chat(user_id: str, message: str) -> ChatResponse:
    store = get_repository()
    settings = get_settings()

    store.add_chat_message(user_id, "user", message)

    history_records = store.get_chat_history(user_id)
    history = [{"role": r.role, "content": r.content} for r in history_records]

    if settings.openai_configured:
        try:
            reply, emotion, stress_level = _call_openai(message, history)
        except Exception:
            reply, emotion, stress_level = random.choice(FALLBACK_REPLIES), "neutral", 5
    else:
        reply, emotion, stress_level = random.choice(FALLBACK_REPLIES), "neutral", 5

    assistant = store.add_chat_message(
        user_id, "assistant", reply,
        emotion=emotion, stress_level=stress_level,
    )

    return ChatResponse(
        reply=reply,
        emotion=emotion,
        stress_level=stress_level,
        message_id=assistant.id,
    )
