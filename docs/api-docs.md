# MindMate API Documentation

## Base URL

http://localhost:8000

---

## 1. Chat Endpoint

### POST /chat

Request:

```json
{
  "message": "Hello"
}
```

Response:

```json
{
  "reply": "Hi! How can I help you?"
}
```

---

## 2. Mood Endpoint

### POST /mood

Request:

```json
{
  "mood": "happy",
  "note": "Hari ini produktif"
}
```

Response:

```json
{
  "status": "success"
}
```

---

## 3. Insight Endpoint

### GET /insight

Response:

```json
{
  "summary": "Mood kamu minggu ini stabil 👍"
}
```
