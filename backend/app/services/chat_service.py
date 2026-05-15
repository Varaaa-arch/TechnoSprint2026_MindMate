"""Chat logic — fallback responses until OpenAI is wired in the next phase."""

from __future__ import annotations

import random

from app.schemas.chat import ChatResponse, EmotionLabel
from app.repositories import get_repository

FALLBACK_REPLIES = [
    "Terima kasih sudah berbagi. Saya di sini untuk mendengarkan. Ceritakan lebih lanjut tentang apa yang kamu rasakan.",
    "Itu terdengar cukup berat. Wajar sekali merasa seperti itu. Apa yang biasanya membantu kamu merasa lebih tenang?",
    "Saya mengerti. Perasaan itu valid. Mari kita eksplorasi bersama apa yang bisa membantu situasimu.",
    "Kamu sudah melakukan hal yang baik dengan mau berbicara tentang ini. Langkah kecil itu penting.",
]

EMOTION_KEYWORDS: list[tuple[EmotionLabel, list[str]]] = [
    ("burnout", ["capek", "burnout", "lelah banget", "bosan hidup", "nggak kuat"]),
    ("anxiety", ["cemas", "panik", "takut", "khawatir", "overthinking", "gelisah"]),
    ("sad", ["sedih", "murung", "menangis", "kecewa", "putus asa"]),
    ("anger", ["marah", "kesal", "jengkel", "sebel"]),
    ("happy", ["senang", "bahagia", "grateful", "syukur", "lega"]),
    ("calm", ["tenang", "damai", "rileks"]),
]


def detect_emotion(message: str) -> tuple[EmotionLabel, int]:
    text = message.lower()
    for emotion, keywords in EMOTION_KEYWORDS:
        if any(kw in text for kw in keywords):
            stress_map: dict[EmotionLabel, int] = {
                "burnout": 8,
                "anxiety": 7,
                "sad": 6,
                "anger": 6,
                "happy": 3,
                "calm": 2,
                "neutral": 5,
            }
            return emotion, stress_map[emotion]
    return "neutral", 5


def generate_reply(message: str, emotion: EmotionLabel) -> str:
    # Placeholder until OpenAI integration
    base = random.choice(FALLBACK_REPLIES)
    labels = {
        "burnout": "Sepertinya kamu mengalami kelelahan yang cukup dalam.",
        "anxiety": "Kecemasan bisa terasa sangat melelahkan.",
        "sad": "Perasaan sedih yang kamu alami itu valid.",
        "anger": "Marah adalah respons yang wajar pada situasi sulit.",
        "happy": "Senang mendengar ada hal positif yang kamu rasakan.",
        "calm": "Bagus kalau kamu bisa merasakan ketenangan.",
        "neutral": "",
    }
    prefix = labels.get(emotion, "")
    if prefix:
        return f"{prefix} {base}"
    return base


def process_chat(user_id: str, message: str) -> ChatResponse:
    store = get_repository()
    emotion, stress_level = detect_emotion(message)

    store.add_chat_message(user_id, "user", message)
    reply = generate_reply(message, emotion)
    assistant = store.add_chat_message(
        user_id,
        "assistant",
        reply,
        emotion=emotion,
        stress_level=stress_level,
    )

    return ChatResponse(
        reply=reply,
        emotion=emotion,
        stress_level=stress_level,
        message_id=assistant.id,
    )
