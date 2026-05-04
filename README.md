# MindMate

MindMate adalah aplikasi AI-powered mood tracker dan chat companion yang membantu pengguna:

* Berinteraksi dengan AI
* Mencatat suasana hati harian
* Mendapatkan insight personal

---

## Tech Stack

### Frontend

* Next.js (App Router)
* JavaScript

### Backend

* FastAPI (Python)
* Uvicorn

### Database & Auth

* Supabase

### DevOps

* Docker & Docker Compose (opsional)

---

## Project Structure

```bash
mindmate/
├── frontend/
├── backend/
├── docs/
├── docker-compose.yml
└── README.md
```

---

## Setup & Installation

### 1. Clone Repository

```bash
git clone <repo-url>
cd mindmate
```

---

## 2. Setup Backend (FastAPI)

Masuk ke folder backend:

```bash
cd backend
```

Buat virtual environment:

```bash
python -m venv venv
```

Aktifkan environment:

Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Buat file `.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
```

Jalankan backend:

```bash
uvicorn app.main:app --reload
```

Backend berjalan di:
http://localhost:8000

API docs:
http://localhost:8000/docs

---

## 3. Setup Frontend (Next.js)

Masuk ke folder frontend:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Jalankan frontend:

```bash
npm run dev
```

Frontend berjalan di:
http://localhost:3000

---

## Development Workflow

Jalankan dua terminal:

Terminal 1 (frontend):

```bash
cd frontend
npm run dev
```

Terminal 2 (backend):

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

---

## Docker (Opsional)

Build dan jalankan:

```bash
docker compose up --build
```

Jalankan tanpa build ulang:

```bash
docker compose up
```

Stop container:

```bash
docker compose down
```

---

## API Endpoints

| Endpoint | Method | Description    |
| -------- | ------ | -------------- |
| /chat    | POST   | Chat dengan AI |
| /mood    | POST   | Simpan mood    |
| /insight | GET    | Ambil insight  |

---

## Notes

* Gunakan Node.js versi 18 atau lebih baru
* Gunakan Python 3.10 atau lebih baru
* Jangan commit file `.env`

---

## Future Improvements

* Emotion detection
* Mood analytics dashboard
* Recommendation engine
* Responsive UI

---

## License

MIT License
