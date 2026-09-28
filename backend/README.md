# ⚙️ ANIME Backend API

The Node.js & Express server application providing authentication, database operations, and watchlist endpoints for **ANIME Streaming Platform**.

---

## 🛠️ Tech Stack & Endpoints

- **Node.js & Express.js**: REST API server & Vercel Serverless Functions.
- **MongoDB & Mongoose**: Database modeling and connection pooling.
- **Authentication**: JWT token cookies (`auth/register`, `auth/login`, `auth/logout`).
- **User & Watchlist**: User profile (`user/getuser`), Watchlist management (`list/add`, `list/delete`, `list/all`).

---

## ⚙️ Environment Variables

Create a `.env` file in this directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
jwt_SECRET=your_jwt_secret_key
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:5173
```

---

## 🌐 Vercel Deployment

This backend contains `vercel.json` configured for Vercel `@vercel/node` serverless functions.
Select `backend` as the root directory on Vercel and add your environment variables.
