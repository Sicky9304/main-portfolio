# Sicky Kumar — Portfolio

A premium full-stack portfolio website built with **React**, **Tailwind CSS**, **Framer Motion**, and a **Node.js/Express** backend connected to **MongoDB Atlas**.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)

## ✨ Features

- **Dynamic Content** — Projects, services, testimonials, and profile data fetched from MongoDB Atlas
- **Working Contact Form** — Submissions saved to database with email notifications via Nodemailer
- **Glassmorphism Design** — Modern glass-effect cards with aurora backgrounds and floating blobs
- **Dark/Light Mode** — System-aware theme toggle with smooth transitions
- **Smooth Scrolling** — Lenis + GSAP ScrollTrigger integration
- **Premium Animations** — Framer Motion scroll reveals, magnetic buttons, typing effect
- **SEO Optimized** — Open Graph, Twitter Cards, JSON-LD structured data, robots.txt, sitemap
- **Responsive** — Mobile-first design with adaptive navigation
- **Graceful Degradation** — Frontend works with hardcoded fallback data if backend is unavailable

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite 8
- Tailwind CSS 3.4
- Framer Motion
- GSAP + Lenis (smooth scroll)
- Lucide React (icons)

### Backend
- Node.js + Express 5
- MongoDB Atlas + Mongoose
- Nodemailer (email notifications)
- Helmet + express-rate-limit (security)
- express-validator (input validation)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/Sicky9304/portfolio.git
cd portfolio
```

### 2. Install dependencies
```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### 3. Configure environment variables
```bash
# Edit server/.env with your values
cp server/.env.example server/.env
```

Required variables in `server/.env`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolio
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CONTACT_EMAIL=your-email@gmail.com
```

### 4. Seed the database
```bash
cd server
npm run seed
```

### 5. Run the development servers
```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
npm run dev
```

The frontend dev server automatically proxies `/api` requests to the backend.

### 6. Build for production
```bash
npm run build
```

## 📁 Project Structure

```
├── index.html                  # Entry HTML with SEO meta tags
├── public/                     # Static assets (images, favicon, robots.txt)
├── src/
│   ├── api/                    # API service layer
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, LoadingScreen, SmoothScroll
│   │   └── ui/                 # MagneticButton, Animations
│   ├── context/                # ThemeContext
│   ├── hooks/                  # useApi custom hook
│   └── sections/               # Hero, About, TechStack, Projects, etc.
├── server/
│   ├── config/                 # Database connection
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route handlers
│   ├── middleware/              # Error handling
│   ├── seed/                   # Database seed script
│   └── server.js               # Express entry point
├── tailwind.config.js          # Design system (colors, animations, components)
└── vite.config.js              # Vite config with API proxy
```

## 📬 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Fetch all projects |
| GET | `/api/profile` | Fetch profile data |
| GET | `/api/services` | Fetch all services |
| GET | `/api/testimonials` | Fetch all testimonials |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/health` | Health check |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by **Sicky Kumar**
