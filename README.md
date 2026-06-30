# 🔮 3D AI Portfolio & Secure Admin Portal (MERN Stack)

A premium, interactive personal developer portfolio featuring a glassmorphism design system, theme-aware holographic particle video backdrops, dynamic binary PDF resume database streaming, and a secure passcode-guarded administrative CRUD dashboard with drag-and-drop Cloudinary uploading.

### 🌐 Live Deployments
* **🔗 Frontend (Vercel)**: [https://main-portfolio-sand-iota.vercel.app/](https://main-portfolio-sand-iota.vercel.app/)
* **🔗 Backend API (Render)**: [https://main-portfolio-24pg.onrender.com/](https://main-portfolio-24pg.onrender.com/)

---

## 🎨 Key Features & Visual Mechanics

### 1. Interactive 3D Spring-Tilt Cards
- **Organic Inertia**: Project preview cards tilt dynamically following mouse coordinates using Framer Motion's `useMotionValue` and `useSpring` physics.
- **Parallax Z-Depth**: Buttons and labels hover on a separate 3D plane, physically lifting off the thumbnail canvas when hovered.
- **Dynamic Fallbacks**: Cards render Cloudinary-hosted image thumbnails if present, and dynamically fall back to an interactive Mock Browser Dashboard if empty.

### 2. Passcode-Guarded Admin Portal (`/sicky-admin`)
- **Session Verification**: Access is locked behind a custom single-passcode credential check (`ADMIN_PASSCODE`) validated by backend middleware and persisted via local browser storage.
- **Secure File Stream**: Allows uploading PDF resume documents. The files are converted to Base64 strings and stored directly in MongoDB.
- **REST Cloudinary Image Upload**: Drag-and-drop zones sign payloads dynamically using Node's native `crypto` module, uploading them straight to Cloudinary without exposing secrets.

### 3. Theme-Aware Video Backdrops
- **Dark Mode**: Loop-plays a screening of glowing neon holographic plexus particles (`hologram_bg.mp4`).
- **Light Mode**: Color-tunes the day loop (`hologram_day.mp4`) with color inversion, saturation boosts, and soft blurs to ensure text readability without compromising aesthetics.
- **Cutoff Masks**: Uses an overlay transition gradient mask at the bottom boundary to blend the loops into the next page section.

---

## 📂 Project Structure

```bash
portfolio/
├── frontend/             # React SPA (Vite, Tailwind, Framer Motion)
│   ├── public/           # Static asset directory (videos, icons)
│   ├── src/
│   │   ├── api/          # Centralized API service requests
│   │   ├── components/   # Reusable UI layout and visual assets
│   │   ├── sections/     # Modular portfolio pages (Hero, Projects, Admin)
│   │   └── App.jsx       # Client router and context wrapper
│   └── package.json
└── backend/              # Node.js, Express & MongoDB API Server
    ├── config/           # Database configuration
    ├── middleware/       # Passcode token validation handlers
    ├── models/           # Mongoose MongoDB collections (Project, Profile)
    ├── routes/           # CRUD API endpoint routes
    ├── seed/             # Seeding configurations
    └── server.js         # API Server entry point
```

---

## 🛠️ Tech Stack & Integrations

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose ORM).
- **APIs & Clouds**: Cloudinary REST Uploader, Dynamic PDF stream buffer.

---

## 💻 Installation & Quickstart

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ADMIN_PASSCODE=your_custom_passcode
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
4. Seed the database:
   ```bash
   npm run seed
   ```
5. Start development watch server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the portal at `http://localhost:5173`.
