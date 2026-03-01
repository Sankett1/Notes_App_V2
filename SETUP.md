# Notes App — Setup Guide

## 🔧 What Was Fixed & Added

### Critical Bug Fixes
1. **Missing `/login` route** — `server/routes/auth.js` had the login logic pasted INSIDE the signup handler after the `res.status(201)` response (unreachable dead code). The entire login route was missing. ✅ Fixed.
2. **server.js syntax error** — Missing closing brace `}` in the ValidationError handler block. ✅ Fixed.
3. **Login works with username OR email** — Backend now accepts both via `$or` query.

### New Features Added
- 🎨 **Dark UI redesign** — Glassmorphism, ambient orbs, dark slate palette
- ✨ **GSAP animations** — Hero entrance, scroll-triggered features, card shake on error, delete animation
- 🔤 **Custom fonts** — Plus Jakarta Sans (body), Space Grotesk (headings), JetBrains Mono (code/labels)
- 📱 **Improved responsive** — Better mobile layout throughout
- 🟢 **Loading state** — App shows loader while auth restores from localStorage
- 🔔 **Better notifications** — Typed (success/error) floating toasts

---

## 🚀 Quick Start

### 1. Frontend
```bash
cd /  # (project root)
npm install          # installs gsap, react, etc.
npm run dev          # starts on http://localhost:5173
```

### 2. Backend
```bash
cd server
cp .env.example .env   # then edit with your MongoDB URI
npm install
npm start              # starts on http://localhost:5000
```

### 3. MongoDB Setup

**Option A — Local (development)**
```bash
# Install MongoDB and start:
brew install mongodb-community   # macOS
brew services start mongodb-community
# URI: mongodb://localhost:27017/notes-app
```

**Option B — MongoDB Atlas (production, recommended)**
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Database Access → Add user with password
4. Network Access → Allow `0.0.0.0/0` (or your IP)
5. Connect → Drivers → Copy connection string
6. Paste into `server/.env` as `MONGODB_URI`

```env
# server/.env
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/notes-app?retryWrites=true&w=majority
JWT_SECRET=your_random_64_char_secret_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📁 Project Structure

```
├── src/                    # React frontend
│   ├── Hero.jsx            # Landing page (GSAP animated)
│   ├── Navbar.jsx          # Top navigation
│   ├── UserLogin.jsx       # User login (GSAP card shake on error)
│   ├── UserSignup.jsx      # User registration
│   ├── AdminLogin.jsx      # Admin login
│   ├── AdminSignup.jsx     # Admin registration
│   ├── UserDashboard.jsx   # Notes CRUD for users
│   ├── AdminDashboard.jsx  # Admin notes + audit logs tabs
│   ├── AdminLogs.jsx       # Log viewer with filtering
│   ├── AuthContext.jsx     # Auth state & API calls
│   ├── api.js              # Axios instance with interceptors
│   ├── logger.js           # Local audit logger
│   └── index.css           # Custom fonts + Tailwind + glass utils
│
└── server/                 # Express backend
    ├── server.js           # Main server (FIXED syntax)
    ├── routes/
    │   ├── auth.js         # FIXED: now has working /login route
    │   ├── notes.js        # CRUD for notes
    │   └── logs.js         # Log endpoints
    ├── models/
    │   ├── User.js         # User schema with bcrypt
    │   ├── Note.js         # Note schema
    │   └── Log.js          # Activity log schema
    ├── middleware/
    │   ├── auth.js         # JWT protect middleware
    │   └── logger.js       # Activity logging
    └── config/
        └── database.js     # Mongoose connection
```

---

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Create user/admin |
| POST | `/api/auth/login` | No | Login → JWT token |
| GET | `/api/auth/me` | JWT | Get current user |
| POST | `/api/auth/logout` | JWT | Logout |
| GET | `/api/notes` | JWT | Get user's notes |
| POST | `/api/notes` | JWT | Create note |
| PUT | `/api/notes/:id` | JWT | Update note |
| DELETE | `/api/notes/:id` | JWT | Delete note |
| GET | `/api/auth/users` | Admin JWT | List all users |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v3 |
| Animations | GSAP 3 (ScrollTrigger) |
| Fonts | Plus Jakarta Sans · Space Grotesk · JetBrains Mono |
| HTTP | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
