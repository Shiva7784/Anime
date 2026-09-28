# 🎬 ANIME Frontend Application

The client-side single page web application (SPA) for **ANIME Streaming Platform**, built with **React 19**, **Vite**, and **Tailwind CSS v4**.

---

## 🛠️ Features & Architecture

- **Vite + React 19**: Fast HMR and optimized production build.
- **Tailwind CSS v4 & Glassmorphism**: Modern dark crimson streaming theme.
- **Swiper Carousels**: Touch-friendly multi-slide carousels for Movies & TV Series.
- **TV Series & Movie Players**: Dedicated video stream integration with season & episode selection.
- **Custom Toast Provider**: Global notification system (`useToast()`).
- **TMDB Multi-Search**: Live movie & series discovery.

---

## ⚙️ Environment Variables

Create a `.env` file in this directory:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_TMDB_API_KEY=3869be8e95600094552f92b847bfd6ca
```

---

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```

---

## 🌐 Vercel Deployment

This frontend contains `vercel.json` configured for Vercel SPA rewrites. Deploy directly by selecting `frontend` as the root directory on Vercel.
