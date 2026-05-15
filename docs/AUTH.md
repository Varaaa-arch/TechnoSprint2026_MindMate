# MindMate — Supabase Authentication

## Alur

```
User → Login/Signup (Supabase Auth) → JWT access_token
     → Frontend simpan session (localStorage via supabase-js)
     → Setiap API call: Authorization: Bearer <token>
     → FastAPI verifikasi JWT → user_id = sub (UUID)
     → Repository simpan data ke PostgreSQL
```

## Setup Supabase Dashboard

1. **Authentication → Providers → Email** — aktifkan Email/password
2. **Authentication → URL Configuration**
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`
3. **(Opsional) Google** — aktifkan Google OAuth, isi Client ID/Secret
4. **Project Settings → API → JWT Secret** — copy ke `backend/.env` sebagai `SUPABASE_JWT_SECRET`

## Environment

**Frontend** `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend** `backend/.env`:

```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_JWT_SECRET=your-jwt-secret
REQUIRE_AUTH=true
STORAGE_BACKEND=auto
```

## Endpoint yang dilindungi

Semua `/api/chat`, `/api/mood`, `/api/insights` membutuhkan header:

```
Authorization: Bearer <access_token>
```

Cek token: `GET /api/auth/me`

## Profile otomatis

Trigger `handle_new_auth_user` membuat baris di `profiles` saat signup.  
`profiles.id` = UUID user (`auth.users.id` sebagai text).

## Dev tanpa login

Set `REQUIRE_AUTH=false` di backend dan kirim header:

```
X-Dev-User-Id: demo-user
```

Hanya untuk development lokal.

## File penting

| File | Peran |
|------|--------|
| `frontend/app/context/AuthContext.js` | Session, signUp, signIn, OAuth |
| `frontend/lib/api.js` | Attach Bearer token |
| `frontend/app/auth/callback/page.js` | OAuth redirect handler |
| `frontend/app/components/AuthGuard.js` | Proteksi halaman |
| `backend/app/core/auth.py` | Verifikasi JWT |

Lihat juga: [SUPABASE.md](./SUPABASE.md)
