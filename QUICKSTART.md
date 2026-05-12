# 🚀 Quick Start Guide - MindMate

Panduan cepat untuk menjalankan MindMate dalam 5 menit!

## ⚡ Super Quick Start (3 Langkah)

### 1. Buka Terminal/Command Prompt

**Windows:**
- Tekan `Win + R`
- Ketik `cmd` dan Enter

**macOS:**
- Tekan `Cmd + Space`
- Ketik `terminal` dan Enter

### 2. Masuk ke Folder Frontend

```bash
cd C:\Users\acer\Downloads\project-technosprint\TechnoSprint2026_MindMate\frontend
```

### 3. Install & Run

```bash
npm install
npm run dev
```

### 4. Buka Browser

Buka browser dan akses:
```
http://localhost:3000
```

**🎉 Done! MindMate sudah berjalan!**

---

## 📱 Halaman yang Tersedia

Setelah aplikasi berjalan, Anda bisa mengakses:

| Halaman | URL | Deskripsi |
|---------|-----|-----------|
| **Home** | http://localhost:3000 | Landing page utama |
| **Chat** | http://localhost:3000/chat | Chat dengan AI |
| **Mood** | http://localhost:3000/mood | Mood tracker |
| **Dashboard** | http://localhost:3000/dashboard | Insights & analytics |

---

## 🎨 Fitur yang Bisa Dicoba

### Di Landing Page (/)
- ✅ Klik "Mulai Konsultasi Gratis" → Ke halaman Chat
- ✅ Scroll untuk melihat fitur-fitur
- ✅ Lihat phone mockup dengan animasi
- ✅ Baca testimonial pengguna
- ✅ Explore footer links

### Di Chat Page (/chat)
- ✅ Ketik pesan di input box
- ✅ Klik "Kirim" atau tekan Enter
- ✅ Lihat bot response (muncul setelah 1 detik)
- ✅ Scroll chat history

### Di Mood Page (/mood)
- ✅ Pilih salah satu dari 6 mood
- ✅ Tambahkan catatan (optional)
- ✅ Klik "Simpan Mood"
- ✅ Lihat riwayat mood di sebelah kanan
- ✅ Check statistik di bawah

### Di Dashboard (/dashboard)
- ✅ Lihat 4 kartu statistik mingguan
- ✅ Hover pada bar chart untuk interaksi
- ✅ Lihat distribusi mood
- ✅ Baca wawasan personal
- ✅ Check rekomendasi aktivitas

---

## 🛠️ Perintah Berguna

```bash
# Menjalankan development server
npm run dev

# Stop server
Ctrl + C (di terminal)

# Build untuk production
npm run build

# Run production server
npm start

# Check untuk errors
npm run lint
```

---

## 🔧 Troubleshooting Cepat

### ❌ Error: "npm not found"
**Solusi:** Install Node.js dari https://nodejs.org/

### ❌ Error: "Port 3000 already in use"
**Solusi:** 
```bash
# Gunakan port lain
npm run dev -- -p 3001
```

### ❌ Error saat npm install
**Solusi:**
```bash
# Hapus node_modules dan coba lagi
rmdir /s node_modules
npm install
```

### ❌ Halaman tidak muncul
**Solusi:**
1. Pastikan server masih running (lihat terminal)
2. Refresh browser (Ctrl + F5)
3. Clear browser cache
4. Coba browser lain

---

## 📂 Struktur Folder (Simplified)

```
frontend/
├── app/
│   ├── page.js              ← Landing page
│   ├── chat/page.js         ← Chat page
│   ├── mood/page.js         ← Mood tracker
│   ├── dashboard/page.js    ← Dashboard
│   └── components/          ← Reusable components
├── lib/                     ← Utilities & helpers
└── public/                  ← Images & static files
```

---

## 🎯 Tips untuk Development

### 1. Hot Reload
Setiap kali Anda save file, halaman akan otomatis reload. Tidak perlu refresh manual!

### 2. Developer Tools
Tekan `F12` di browser untuk membuka DevTools:
- **Console**: Lihat logs dan errors
- **Network**: Monitor API calls
- **Elements**: Inspect HTML/CSS

### 3. Edit Code
Buka folder project di code editor favorit Anda:
- VS Code (recommended)
- Sublime Text
- Atom
- WebStorm

### 4. Tailwind CSS
Gunakan Tailwind classes untuk styling:
```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Hello World
</div>
```

---

## 📖 Dokumentasi Lengkap

Untuk informasi lebih detail, baca:

- **README.md** - Overview proyek
- **INSTALLATION.md** - Panduan instalasi lengkap
- **SUMMARY.md** - Ringkasan semua yang telah dibuat
- **frontend/README_FRONTEND.md** - Dokumentasi frontend

---

## 🎨 Customization Quick Tips

### Ubah Warna
Edit file `frontend/app/globals.css`:
```css
:root {
  --primary-color: #4F46E5;  /* Ubah ini */
}
```

### Ubah Teks
Edit file halaman yang ingin diubah:
- Landing page: `frontend/app/page.js`
- Chat: `frontend/app/chat/page.js`
- Mood: `frontend/app/mood/page.js`
- Dashboard: `frontend/app/dashboard/page.js`

### Tambah Halaman Baru
1. Buat folder baru di `frontend/app/`
2. Buat file `page.js` di folder tersebut
3. Export default component
4. Akses di browser: `http://localhost:3000/nama-folder`

---

## 🚀 Deploy ke Production

### Vercel (Recommended - Gratis)
1. Push code ke GitHub
2. Buka https://vercel.com
3. Import repository
4. Deploy! (otomatis)

### Netlify
1. Push code ke GitHub
2. Buka https://netlify.com
3. New site from Git
4. Deploy!

---

## 💡 Next Steps

Setelah aplikasi berjalan:

1. ✅ **Explore semua halaman**
   - Coba semua fitur interaktif
   - Test responsive design (resize browser)

2. ✅ **Baca dokumentasi**
   - Pahami struktur code
   - Pelajari komponen yang ada

3. ✅ **Mulai customize**
   - Ubah warna sesuai brand
   - Edit teks dan konten
   - Tambah fitur baru

4. ✅ **Connect backend**
   - Setup API endpoints
   - Implement authentication
   - Database integration

---

## 📞 Butuh Bantuan?

- 📖 Baca INSTALLATION.md untuk troubleshooting
- 📋 Check SUMMARY.md untuk overview lengkap
- 💻 Lihat code comments untuk penjelasan
- 🔍 Search error di Google/Stack Overflow

---

## ✅ Checklist

Pastikan semua ini sudah dilakukan:

- [ ] Node.js terinstall
- [ ] npm terinstall
- [ ] Folder frontend sudah dibuka di terminal
- [ ] `npm install` sudah dijalankan
- [ ] `npm run dev` sudah dijalankan
- [ ] Browser sudah dibuka di localhost:3000
- [ ] Semua halaman bisa diakses
- [ ] Fitur interaktif berfungsi

**Jika semua checklist ✅, Anda siap untuk development!**

---

## 🎉 Selamat!

Anda berhasil menjalankan MindMate! 

Sekarang Anda bisa:
- Explore aplikasi
- Customize sesuai kebutuhan
- Develop fitur baru
- Deploy ke production

**Happy Coding! 💻✨**

---

**Dibuat dengan ❤️ untuk TechnoSprint 2026**
