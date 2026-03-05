# 🚚 Fed Logistics — Production-Ready Shipping Website

## ✅ Upgrades Made
- Real JWT authentication (bcrypt password hashing)
- SQLite database (persistent data, 6 seeded shipments)
- Real shipment creation with tracking numbers
- User dashboard with shipment history
- Contact form saves to DB + optional email
- Protected routes (Ship & Dashboard require login)

## 🔑 Test Tracking Numbers
FL1001234567 | FL1009876543 | FL1005556677 | FL1001112233 | FL1004449988 | FL1007778899

## 🖥️ Run Locally
1. npm install
2. copy .env.example .env  (then edit JWT_SECRET)
3. npm run dev
4. Open http://localhost:3000

## 🚀 Deploy on Railway (Recommended - Free)
1. Push to GitHub: git init → git add . → git commit -m "init" → git push
2. Go to railway.app → New Project → Deploy from GitHub
3. Add env vars: NODE_ENV=production, JWT_SECRET=yourSecret, PORT=3000
4. Done — Railway gives you a live URL automatically

## 🚀 Deploy on Render (Alternative - Free)
1. Go to render.com → New Web Service → Connect GitHub
2. Build Command: npm install && npm run build
3. Start Command: NODE_ENV=production npm start
4. Add env vars in dashboard

## 📁 New Files Added
- database/db.ts — SQLite database setup + seed data
- src/context/AuthContext.tsx — Global auth state
- src/pages/Dashboard.tsx — User shipment history
- server.ts — Fully upgraded with real auth, DB, email
