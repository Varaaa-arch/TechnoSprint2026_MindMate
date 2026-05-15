# 🚀 Deployment Guide - MindMate

Panduan lengkap untuk deploy aplikasi MindMate ke production.

---

## 🌐 Platform Deployment (Gratis)

### 1. Vercel (Recommended) ⭐

**Kelebihan:**
- ✅ Gratis untuk personal projects
- ✅ Otomatis deploy dari Git
- ✅ Custom domain gratis
- ✅ SSL certificate otomatis
- ✅ CDN global
- ✅ Preview deployments

**Langkah-langkah:**

#### A. Persiapan
```bash
# 1. Push code ke GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### B. Deploy ke Vercel
1. Buka https://vercel.com
2. Sign up dengan GitHub account
3. Klik "New Project"
4. Import repository MindMate
5. Configure project:
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   ```
6. Klik "Deploy"
7. Tunggu 2-3 menit
8. ✅ Done! Aplikasi live di: `https://your-app.vercel.app`

#### C. Custom Domain (Optional)
1. Buka project settings di Vercel
2. Klik "Domains"
3. Add custom domain
4. Update DNS records di domain provider
5. Tunggu propagasi (5-10 menit)

---

### 2. Netlify

**Kelebihan:**
- ✅ Gratis untuk personal projects
- ✅ Drag & drop deployment
- ✅ Form handling
- ✅ Serverless functions

**Langkah-langkah:**

1. Buka https://netlify.com
2. Sign up dengan GitHub
3. Klik "New site from Git"
4. Pilih repository
5. Configure:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: .next
   ```
6. Deploy!

---

### 3. GitHub Pages (Static Export)

**Catatan:** Perlu export Next.js ke static HTML

**Langkah-langkah:**

#### A. Update next.config.mjs
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

#### B. Build & Deploy
```bash
# Build static files
npm run build

# Deploy ke GitHub Pages
# (gunakan gh-pages package)
npm install -D gh-pages
```

#### C. Add script ke package.json
```json
{
  "scripts": {
    "deploy": "gh-pages -d out"
  }
}
```

#### D. Deploy
```bash
npm run deploy
```

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
# Masuk ke folder frontend
cd frontend

# Build image
docker build -t mindmate-frontend .

# Run container
docker run -p 3000:3000 mindmate-frontend
```

### Docker Compose (Full Stack)

```bash
# Di root folder
docker-compose up --build
```

---

## ☁️ Cloud Platforms

### AWS (Amazon Web Services)

**Services yang bisa digunakan:**
- **Amplify** - Untuk frontend
- **EC2** - Virtual server
- **S3 + CloudFront** - Static hosting

### Google Cloud Platform

**Services:**
- **Cloud Run** - Container deployment
- **App Engine** - Platform as a Service
- **Firebase Hosting** - Static hosting

### Microsoft Azure

**Services:**
- **Static Web Apps** - Frontend hosting
- **App Service** - Full stack hosting

---

## 🔧 Environment Variables

### Production Environment Variables

Buat file `.env.production` di folder frontend:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-url.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Vercel Environment Variables

1. Buka project settings
2. Klik "Environment Variables"
3. Add variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📊 Performance Optimization

### Before Deployment

#### 1. Optimize Images
```bash
# Install sharp untuk image optimization
npm install sharp
```

#### 2. Enable Compression
```javascript
// next.config.mjs
const nextConfig = {
  compress: true,
};
```

#### 3. Analyze Bundle Size
```bash
npm install @next/bundle-analyzer

# Add to next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

---

## 🔒 Security Checklist

### Before Going Live

- [ ] Remove console.logs
- [ ] Hide API keys (use environment variables)
- [ ] Enable HTTPS
- [ ] Add security headers
- [ ] Implement rate limiting
- [ ] Add CORS configuration
- [ ] Enable CSP (Content Security Policy)

### Security Headers (next.config.mjs)

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};
```

---

## 📈 Monitoring & Analytics

### Google Analytics

1. Buat account di https://analytics.google.com
2. Dapatkan Tracking ID
3. Add ke environment variables
4. Implement tracking code

### Vercel Analytics

```bash
npm install @vercel/analytics

# Add to layout.js
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🧪 Pre-Deployment Testing

### Checklist

- [ ] Test all pages
- [ ] Test all forms
- [ ] Test responsive design
- [ ] Test on different browsers
- [ ] Test loading states
- [ ] Test error handling
- [ ] Check console for errors
- [ ] Validate HTML
- [ ] Check accessibility
- [ ] Test performance (Lighthouse)

### Run Lighthouse

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

---

## 🚀 Deployment Workflow

### Recommended Workflow

```
Development (local)
    ↓
    git push to feature branch
    ↓
Preview Deployment (Vercel)
    ↓
    Code review & testing
    ↓
    Merge to main branch
    ↓
Production Deployment (Vercel)
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
# After review, merge to main

# Pull latest main
git checkout main
git pull origin main
```

---

## 📱 Custom Domain Setup

### Vercel Custom Domain

1. **Add Domain**
   - Buka project settings
   - Klik "Domains"
   - Add your domain

2. **Configure DNS**
   - Add A record: `76.76.21.21`
   - Add CNAME: `cname.vercel-dns.com`

3. **Wait for Propagation**
   - Biasanya 5-10 menit
   - Check status di Vercel dashboard

### SSL Certificate

- ✅ Otomatis di-provide oleh Vercel
- ✅ Gratis Let's Encrypt certificate
- ✅ Auto-renewal

---

## 🔄 Continuous Deployment

### Auto Deploy on Git Push

Vercel otomatis deploy setiap kali:
- Push ke main branch → Production
- Push ke branch lain → Preview

### Disable Auto Deploy (Optional)

```bash
# vercel.json
{
  "github": {
    "enabled": false
  }
}
```

---

## 📊 Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test all functionality
- [ ] Check mobile responsiveness
- [ ] Verify custom domain (if any)
- [ ] Check SSL certificate
- [ ] Test form submissions
- [ ] Verify API connections
- [ ] Check analytics tracking
- [ ] Test error pages (404, 500)
- [ ] Monitor performance
- [ ] Check SEO meta tags

---

## 🆘 Troubleshooting

### Build Errors

**Error: "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error: "Out of memory"**
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Deployment Errors

**Error: "Deployment failed"**
- Check build logs di Vercel dashboard
- Verify environment variables
- Check next.config.mjs

**Error: "404 on refresh"**
- Vercel handles this automatically
- For other platforms, configure rewrites

---

## 📞 Support & Resources

### Vercel
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

### Next.js
- Docs: https://nextjs.org/docs
- Deployment: https://nextjs.org/docs/deployment

### Community
- Next.js Discord
- Vercel Discord
- Stack Overflow

---

## 🎉 Deployment Complete!

Setelah deploy berhasil:

1. ✅ Share URL dengan tim
2. ✅ Setup monitoring
3. ✅ Configure analytics
4. ✅ Monitor performance
5. ✅ Collect user feedback

---

**Selamat! Aplikasi MindMate sudah live! 🚀**

**URL Production**: `https://your-app.vercel.app`

---

**Dibuat dengan ❤️ untuk TechnoSprint 2026**
