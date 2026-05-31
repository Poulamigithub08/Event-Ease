# 🎪 EventEase — Event Management Platform

A full-stack MERN application for managing events with role-based access for Hosts and Guests.

---

## 🚀 Features

### Host
- Register as a Host
- Create, Edit, Delete events (CRUD)
- Set event status: Draft → Confirmed → Completed / Cancelled
- Track planning progress (%)
- View registered attendees per event
- Dashboard with stats (Upcoming, Past, Drafts, Total)

### Guest
- Register as a Guest
- Browse all confirmed events with search & category filters
- Register / Unregister for events
- View registered events in My Events dashboard

### General
- JWT-based authentication
- Role-based access control (middleware-protected routes)
- Toast notifications throughout
- Responsive design (mobile + desktop)

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, React Router v7, Axios, Tailwind CSS, React Toastify |
| Backend | Node.js, Express 5, MongoDB, Mongoose, JWT, bcryptjs |
| Auth | JWT Bearer tokens |

---

## ⚙️ Setup

### 1. Clone the repo

```bash
git clone https://github.com/Poulamigithub08/eventease-backend.git
cd eventease-backend
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env
npm install
npm run dev      # runs on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev      # runs on http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register (host or guest) |
| POST | `/api/auth/login` | ❌ | Login → returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/events` | ✅ | All events (guests see confirmed only) |
| POST | `/api/events` | ✅ Host | Create event |
| GET | `/api/events/my-events` | ✅ | My events (host: own; guest: registered) |
| GET | `/api/events/:id` | ✅ | Single event |
| PUT | `/api/events/:id` | ✅ Host | Update own event |
| DELETE | `/api/events/:id` | ✅ Host | Delete own event |
| POST | `/api/events/:id/register` | ✅ Guest | Register for event |
| POST | `/api/events/:id/unregister` | ✅ Guest | Unregister from event |

---

## 🌐 Deployment

- **Backend**: Deploy to Render / Railway / Fly.io — set `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL` env vars
- **Frontend**: Deploy to Vercel / Netlify — set `VITE_API_URL` and update `src/config.js`

---

## 📁 Project Structure

```
eventease-backend/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── event.controller.js
│   ├── middlewares/authmiddleware.js
│   ├── models/
│   │   ├── users.js
│   │   └── events.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── event.routes.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── components/Header.jsx Footer.jsx Hero.jsx
    │   ├── pages/
    │   │   ├── Events.jsx       ← Browse + Register/Unregister
    │   │   ├── Myevents.jsx     ← Dashboard (Create/Edit/Delete/Attendees)
    │   │   ├── Signin.jsx
    │   │   ├── Signuphost.jsx
    │   │   └── Signupguest.jsx
    │   ├── providers/UserContext.jsx
    │   ├── config.js
    │   └── App.jsx
    └── package.json
```

---

*Built with ❤️ — EventEase*
