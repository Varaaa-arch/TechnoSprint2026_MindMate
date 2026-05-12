# 📁 Struktur Proyek MindMate

## 🌳 File Tree

```
TechnoSprint2026_MindMate/
│
├── 📄 README.md                          # Dokumentasi utama proyek
├── 📄 SUMMARY.md                         # Ringkasan lengkap semua yang dibuat
├── 📄 INSTALLATION.md                    # Panduan instalasi detail
├── 📄 QUICKSTART.md                      # Panduan cepat 5 menit
├── 📄 CARA_MENJALANKAN.md               # Panduan dalam Bahasa Indonesia
├── 📄 PROJECT_STRUCTURE.md              # File ini - struktur proyek
├── 📄 docker-compose.yml                # Docker configuration
├── 📄 .gitignore                        # Git ignore rules
│
├── 📂 frontend/                         # Frontend Next.js Application
│   │
│   ├── 📂 app/                          # Next.js App Router
│   │   │
│   │   ├── 📂 components/               # Reusable Components
│   │   │   ├── 📄 Navbar.js            # ✅ Navigation bar component
│   │   │   └── 📄 Footer.js            # ✅ Footer component
│   │   │
│   │   ├── 📂 chat/                     # Chat Page
│   │   │   └── 📄 page.js              # ✅ Chat interface dengan AI
│   │   │
│   │   ├── 📂 mood/                     # Mood Tracker Page
│   │   │   └── 📄 page.js              # ✅ Mood tracking interface
│   │   │
│   │   ├── 📂 dashboard/                # Dashboard Page
│   │   │   └── 📄 page.js              # ✅ Insights & analytics
│   │   │
│   │   ├── 📄 page.js                   # ✅ Landing page (Home)
│   │   ├── 📄 layout.js                 # ✅ Root layout
│   │   ├── 📄 loading.js                # ✅ Loading state
│   │   ├── 📄 error.js                  # ✅ Error handling
│   │   ├── 📄 not-found.js              # ✅ 404 page
│   │   ├── 📄 globals.css               # Global styles
│   │   └── 📄 favicon.ico               # App icon
│   │
│   ├── 📂 lib/                          # Utility Functions & Helpers
│   │   ├── 📄 api.js                    # ✅ API client & endpoints
│   │   ├── 📄 utils.js                  # ✅ Utility functions
│   │   ├── 📄 constants.js              # ✅ App constants
│   │   └── 📄 supabase.js               # Supabase client
│   │
│   ├── 📂 public/                       # Static Assets
│   │   ├── 📄 file.svg
│   │   ├── 📄 globe.svg
│   │   ├── 📄 next.svg
│   │   ├── 📄 vercel.svg
│   │   └── 📄 window.svg
│   │
│   ├── 📄 package.json                  # Dependencies & scripts
│   ├── 📄 package-lock.json             # Lock file
│   ├── 📄 next.config.mjs               # Next.js configuration
│   ├── 📄 postcss.config.mjs            # PostCSS configuration
│   ├── 📄 eslint.config.mjs             # ESLint configuration
│   ├── 📄 jsconfig.json                 # JavaScript configuration
│   ├── 📄 dockerfile                    # Docker configuration
│   ├── 📄 .gitignore                    # Git ignore
│   └── 📄 README_FRONTEND.md            # ✅ Frontend documentation
│
├── 📂 backend/                          # Backend FastAPI Application
│   │
│   ├── 📂 app/
│   │   ├── 📂 api/                      # API Routes
│   │   │   ├── 📂 routes/
│   │   │   │   ├── 📄 chat.py          # Chat endpoints
│   │   │   │   ├── 📄 mood.py          # Mood endpoints
│   │   │   │   ├── 📄 insight.py       # Insights endpoints
│   │   │   │   └── 📄 __init__.py
│   │   │   └── 📄 __init__.py
│   │   │
│   │   ├── 📂 db/                       # Database
│   │   │   ├── 📄 supabase_client.py   # Supabase client
│   │   │   └── 📄 __init__.py
│   │   │
│   │   ├── 📂 services/                 # Business Logic
│   │   │   ├── 📄 ai_service.py        # AI service
│   │   │   ├── 📄 emotion.py           # Emotion analysis
│   │   │   ├── 📄 recommendation.py    # Recommendations
│   │   │   └── 📄 __init__.py
│   │   │
│   │   ├── 📂 schemas/                  # Data schemas
│   │   │   └── 📄 __init__.py
│   │   │
│   │   ├── 📄 main.py                   # FastAPI app entry
│   │   └── 📄 __init__.py
│   │
│   ├── 📄 requirements.txt              # Python dependencies
│   └── 📄 dockerfile                    # Docker configuration
│
└── 📂 docs/                             # Documentation
    ├── 📄 api-docs.md                   # API documentation
    └── 📄 architecture.md               # Architecture docs
```

---

## 📊 Statistik Proyek

### ✅ Files Created (New)
- **Pages**: 7 files
  - Landing page (page.js)
  - Chat page (chat/page.js)
  - Mood tracker (mood/page.js)
  - Dashboard (dashboard/page.js)
  - Loading page (loading.js)
  - Error page (error.js)
  - 404 page (not-found.js)

- **Components**: 2 files
  - Navbar (components/Navbar.js)
  - Footer (components/Footer.js)

- **Utilities**: 3 files
  - API client (lib/api.js)
  - Utils functions (lib/utils.js)
  - Constants (lib/constants.js)

- **Documentation**: 5 files
  - README.md (updated)
  - SUMMARY.md
  - INSTALLATION.md
  - QUICKSTART.md
  - CARA_MENJALANKAN.md
  - PROJECT_STRUCTURE.md
  - README_FRONTEND.md

**Total New Files**: 17+ files

---

## 🎨 Komponen Utama

### 1. Landing Page (/)
```
app/page.js
├── Header/Navbar
├── Hero Section
│   ├── Tagline
│   ├── Description
│   └── CTA Buttons
├── Phone Mockup Section
├── Features Section
│   ├── AI Chat Card
│   ├── Mood Tracker Card
│   └── Insights Card
├── CTA Card (with stats)
├── Testimonial Section
└── Footer
```

### 2. Chat Page (/chat)
```
app/chat/page.js
├── Navbar
├── Chat Container
│   ├── Chat Header
│   ├── Messages Area
│   │   ├── Bot Messages
│   │   └── User Messages
│   └── Input Area
│       ├── Text Input
│       └── Send Button
```

### 3. Mood Page (/mood)
```
app/mood/page.js
├── Navbar
├── Page Header
├── Mood Selection Card
│   ├── 6 Mood Buttons
│   ├── Note Textarea
│   └── Save Button
├── Mood History Card
│   └── Timeline List
└── Stats Cards (3)
```

### 4. Dashboard Page (/dashboard)
```
app/dashboard/page.js
├── Navbar
├── Page Header
├── Weekly Stats Grid (4 cards)
├── Charts Section
│   ├── Mood Trend Chart
│   └── Mood Distribution
├── Insights Grid (4 cards)
└── Recommendations Card
```

---

## 🔧 Utility Files

### lib/api.js
```javascript
ApiClient
├── request()
├── sendMessage()
├── getChatHistory()
├── saveMood()
├── getMoodHistory()
├── getMoodStats()
├── getInsights()
├── getWeeklyReport()
└── getRecommendations()
```

### lib/utils.js
```javascript
Utilities
├── Date Functions
│   ├── formatDate()
│   ├── formatTime()
│   └── getRelativeTime()
├── Mood Functions
│   ├── getMoodByLabel()
│   ├── calculateMoodScore()
│   └── getMoodColor()
├── Validation
│   ├── isValidEmail()
│   └── isValidPassword()
└── Storage
    ├── saveToLocalStorage()
    ├── getFromLocalStorage()
    └── removeFromLocalStorage()
```

### lib/constants.js
```javascript
Constants
├── APP_INFO
├── ROUTES
├── MOOD_TYPES
├── COLORS
├── API_ENDPOINTS
├── STORAGE_KEYS
├── ERROR_MESSAGES
└── SUCCESS_MESSAGES
```

---

## 📱 Responsive Breakpoints

```
Mobile:  < 768px   (sm)
Tablet:  768px+    (md)
Desktop: 1024px+   (lg)
Wide:    1280px+   (xl)
```

---

## 🎨 Design Tokens

### Colors
```
Primary:   #4F46E5 (Indigo)
Secondary: #9333EA (Purple)
Success:   #10B981 (Green)
Warning:   #F59E0B (Yellow)
Danger:    #EF4444 (Red)
```

### Spacing
```
xs: 0.25rem (4px)
sm: 0.5rem  (8px)
md: 1rem    (16px)
lg: 1.5rem  (24px)
xl: 2rem    (32px)
```

### Border Radius
```
sm: 0.25rem
md: 0.5rem
lg: 0.75rem
xl: 1rem
2xl: 1.5rem
3xl: 2rem
```

---

## 🚀 Scripts Available

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

---

## 📦 Dependencies

### Main Dependencies
- next: 16.2.4
- react: 19.2.4
- react-dom: 19.2.4

### Dev Dependencies
- @tailwindcss/postcss: ^4
- tailwindcss: ^4
- eslint: ^9
- eslint-config-next: 16.2.4

---

## 🔗 Navigation Flow

```
Landing Page (/)
    ├─→ Chat (/chat)
    ├─→ Mood (/mood)
    └─→ Dashboard (/dashboard)

All pages have:
    ├─→ Navbar (navigation)
    └─→ Footer (optional)
```

---

## 📊 Data Flow

```
User Input
    ↓
Component State
    ↓
API Call (lib/api.js)
    ↓
Backend API
    ↓
Database (Supabase)
    ↓
Response
    ↓
Update UI
```

---

## 🎯 Key Features

✅ **Responsive Design** - Mobile, Tablet, Desktop
✅ **Interactive UI** - Hover effects, transitions
✅ **Form Validation** - Input validation
✅ **Error Handling** - Error & loading states
✅ **Reusable Components** - Navbar, Footer
✅ **Utility Functions** - API, utils, constants
✅ **Documentation** - Complete docs

---

## 📝 Notes

- Semua file dengan ✅ adalah file yang baru dibuat
- File tanpa ✅ adalah file yang sudah ada sebelumnya
- Struktur mengikuti Next.js 16 App Router convention
- Menggunakan Tailwind CSS untuk styling
- Responsive design untuk semua devices

---

**Struktur proyek lengkap dan siap untuk development!** 🎉
