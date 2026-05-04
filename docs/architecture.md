# MindMate Architecture

## Overview

MindMate adalah aplikasi pelacak suasana hati berbasis AI yang memungkinkan pengguna untuk:

* Chat dengan AI
* Melacak mood harian
* Mendapatkan insight personal

---

## Tech Stack

* Frontend: Next.js (App Router)
* Backend: FastAPI
* Database & Auth: Supabase

---

## Architecture Pattern

Menggunakan **Backend-for-Frontend (BFF)** pattern.

Flow:
User → Frontend → FastAPI → Supabase / AI Service → Response → Frontend

---

## System Components

### 1. Frontend (Next.js)

* UI & UX
* Handle user interaction
* Call API backend

### 2. Backend (FastAPI)

* Business logic
* AI processing
* API endpoints

### 3. Database (Supabase)

* User data
* Mood tracking
* Chat history

---

## Data Flow Example (Chat)

1. User kirim pesan
2. Frontend kirim ke `/chat`
3. Backend proses AI
4. Response dikirim ke frontend
5. Ditampilkan ke user
