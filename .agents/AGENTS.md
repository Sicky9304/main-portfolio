# Project Guide & AI Rulebook: Sicky's 3D AI MERN Portfolio & Admin Portal

Welcome to the beginner-friendly guide and developer reference for Sicky Kumar's premium **3D AI MERN Portfolio & Admin Portal**. This document explains the project's folder structure, technologies, core features, and critical guidelines for both humans and AI agents.

---

## 🌟 Table of Contents
1. [Project Overview](#-project-overview)
2. [Folder Structure (Complete Directory Tree)](#-folder-structure-complete-directory-tree)
3. [Technology Stack](#-technology-stack)
4. [Core Features & Guides](#-core-features--guides)
   - [Interactive Landing Page](#interactive-landing-page)
   - [Global 3D & Canvas Effects](#global-3d--canvas-effects)
   - [Advanced Theme Customizer](#advanced-theme-customizer)
   - [AI Capabilities (Gemini 2.5 Flash)](#ai-capabilities-gemini-25-flash)
   - [GitHub Integration](#github-integration)
   - [Admin Console (/sicky-admin)](#admin-console-sicky-admin)
   - [Dynamic Sitemap](#dynamic-sitemap)
5. [Getting Started (Local Development)](#-getting-started-local-development)
6. [Data Synchronization Pattern](#-data-synchronization-pattern)
7. [Workspace Customization & AI Rules](#-workspace-customization--ai-rules)

---

## 🚀 Project Overview
This project is a high-end, responsive portfolio and administrative dashboard designed for Sicky Kumar. It blends premium visuals (custom cursor glows, particle plexuses, magnetic buttons, and 3D card tilting) with a robust backend and artificial intelligence integrations. The application allows visitors to chat with an AI clone of Sicky, translates blog posts dynamically, and lets the admin write full markdown blogs and configure the site's profile directly via a secured admin portal.

---

## 📁 Folder Structure (Complete Directory Tree)
Below is the full recursive file structure mapping all files and folders in both `backend` and `frontend` environments:

```text
portfolio/
├── .agents/
│   └── AGENTS.md                  # Project Guide & AI Rulebook (this file)
├── backend/
│   ├── blog/
│   │   ├── Blog.js                # Blog Schema and Model
│   │   └── blogs.js               # Blog Router & Endpoints (/api/blogs)
│   ├── config/
│   │   └── db.js                  # Database connection code (Mongoose)
│   ├── middleware/
│   │   ├── adminAuth.js           # Admin authentication middleware
│   │   └── errorHandler.js        # Global error handling middleware
│   ├── models/
│   │   ├── Contact.js             # Contact message schema
│   │   ├── Profile.js             # User Profile schema (CGPA, education, etc.)
│   │   ├── Project.js             # Project schema
│   │   ├── Service.js             # Service schema
│   │   └── Testimonial.js         # Testimonial schema
│   ├── routes/
│   │   ├── ai.js                  # Gemini AI Chatbot, Translate, and Ghostwriter endpoints
│   │   ├── contact.js             # Contact endpoint (express-rate-limit validation)
│   │   ├── profile.js             # Profile fetch & update endpoints
│   │   ├── projects.js            # Projects REST endpoints
│   │   ├── services.js            # Services REST endpoints
│   │   ├── testimonials.js        # Testimonials REST endpoints
│   │   └── upload.js              # Media upload helper (Cloudinary integration)
│   ├── seed/
│   │   └── seed.js                # Initial database seeder script
│   ├── utils/
│   │   └── email.js               # Nodemailer email configuration & templates
│   ├── .env                       # Environment variables config (ignored by git)
│   ├── .gitignore                 # Git ignore config
│   ├── app.js                     # Express application definition
│   ├── package-lock.json          # Node dependency lockfile
│   ├── package.json               # Backend packages & scripts
│   └── server.js                  # Main server listener
│
├── frontend/
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js           # API request wrappers (Axios-like fetch)
│   │   ├── assets/
│   │   │   ├── hero.png           # Hero section avatar
│   │   │   ├── react.svg          # React SVG asset
│   │   │   └── vite.svg           # Vite SVG asset
│   │   ├── components/
│   │   │   ├── ai/
│   │   │   │   ├── AudioReader.jsx        # Screen-reader voice speech synthesis helper
│   │   │   │   ├── GlobalAIAssistant.jsx  # Floating 3D/Canvas chatbot twin widget
│   │   │   │   └── MarkdownRenderer.jsx   # Renders Markdown text dynamically
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx          # Shared Page Layout wrapper using Outlet
│   │   │   │   ├── Footer.jsx             # Core Footer component (capped at max-w-6xl)
│   │   │   │   ├── LoadingScreen.jsx      # Site boot loading overlay
│   │   │   │   ├── Navbar.jsx             # Navigation bar (fixed, capped at max-w-6xl)
│   │   │   │   └── SmoothScroll.jsx       # Smooth Lenis scrolling provider
│   │   │   └── ui/
│   │   │       ├── Animations.jsx         # Custom Framer Motion / GSAP animations
│   │   │       ├── BrandIcons.jsx         # Dynamic tech logo SVG rendering
│   │   │       ├── CommandPalette.jsx     # Global search command menu (Ctrl+K)
│   │   │       ├── CursorGlow.jsx         # Interactive follow cursor halo glows
│   │   │       ├── MagneticButton.jsx     # GSAP magnet pull button script
│   │   │       ├── ScrollProgress.jsx     # Header reading tracker gauge
│   │   │       ├── ThemeCustomizer.jsx    # Panel for theme, styles, presets & layouts
│   │   │       └── TiltCard.jsx           # Immersive 3D hover layout tilt script
│   │   ├── context/
│   │   │   └── ThemeContext.jsx   # Manage states for fonts, theme presets, modes
│   │   ├── hooks/
│   │   │   └── useApi.js          # Generic API data fetcher hook
│   │   ├── pages/
│   │   │   ├── blog/
│   │   │   │   ├── blogUI/                 # Formatted content elements inside blog details view
│   │   │   │   │   ├── BlogAiChatCompanion.jsx# Explainer chatbot embedded in blogs
│   │   │   │   │   ├── BlogContentArea.jsx    # Blog detail markdown content area
│   │   │   │   │   └── BlogHeaderHub.jsx      # Top section details in blog reading view
│   │   │   │   ├── components/            # Admin dashboard components
│   │   │   │   │   ├── BlogListView.jsx        # Grid list of existing articles
│   │   │   │   │   ├── CategoriesManagerView.jsx# Category manager widget
│   │   │   │   │   ├── DashboardView.jsx       # Admin dashboard stats/home view
│   │   │   │   │   ├── EditorCanvas.jsx        # Admin code/markdown editor panel
│   │   │   │   │   ├── EditorPreview.jsx       # Visual parser preview block
│   │   │   │   │   ├── EditorSettingsSidebar.jsx# Blog options/SEO tags side controls
│   │   │   │   │   ├── GhostwriterView.jsx     # Gemini AI writing dashboard tab
│   │   │   │   │   ├── MediaLibraryView.jsx    # Image asset gallery view
│   │   │   │   │   ├── TagsManagerView.jsx     # Tag management list control
│   │   │   │   │   └── editorDefaults.js       # Default starting template templates
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useBlogWorkspace.js     # State machine for the admin blog studio
│   │   │   │   ├── AdminBlogTab.jsx        # Sub-container for editor panels
│   │   │   │   ├── AdminDashboard.jsx      # Admin console editor frame (with mouse split resizers)
│   │   │   │   ├── BlogDetailsPage.jsx     # Individual blog rendering page
│   │   │   │   └── BlogPage.jsx            # Public blogs catalog list interface
│   │   │   ├── home/
│   │   │   │   ├── About.jsx               # General profile stats & education
│   │   │   │   ├── ArchitecturePage.jsx    # Technical system architecture guide page
│   │   │   │   ├── Contact.jsx             # Mail submission panel
│   │   │   │   ├── GitHubSection.jsx       # Active calendar activity and public repos
│   │   │   │   ├── Hero.jsx                # Site top banner section
│   │   │   │   ├── Projects.jsx            # Custom catalog projects grid (with fallback items)
│   │   │   │   ├── Services.jsx            # Professional capabilities lists
│   │   │   │   ├── TechStack.jsx           # Categorized skill badges grid
│   │   │   │   └── Testimonials.jsx        # Scrolling quote cards carousel
│   │   ├── routes/
│   │   │   └── Routes.jsx         # Centralized routing definitions (React Router)
│   │   ├── App.jsx                # Main entry app provider mounting RouterProvider
│   │   ├── index.css              # Core styles and design system variables
│   │   └── main.jsx               # React DOM rendering and tracking triggers
│   ├── .env                       # Environment variables config (ignored by git)
│   ├── .gitignore                 # Git ignore config
│   ├── .oxlintrc.json             # Oxlint rules file
│   ├── package-lock.json          # Node dependency lockfile
│   ├── package.json               # Frontend package definition
│   ├── postcss.config.js          # PostCSS utility configs
│   ├── README.md                  # Frontend development manual
│   ├── tailwind.config.js         # Tailwind layout configurations
│   ├── vercel.json                # Vercel deployment routes mapping
│   └── vite.config.js             # Vite configurations (dev server, proxy rules)
│
├── vercel.json                    # Workspace deployment routing rule mapping
├── README.md                      # General project repository readme
└── .gitignore                     # Repository level git exclusion config
```

---

## 💻 Technology Stack
This MERN application utilizes state-of-the-art tools across the stack:

| Layer | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | **React 19** | Core component architecture |
| | **Vite** | Lightning-fast asset compiler & local server |
| | **Tailwind CSS** | Styling and layout utility system |
| | **Framer Motion** | Micro-interactions and fluid component transitions |
| | **GSAP** | Magnetic effects, complex scroll-triggers, and drag physics |
| | **Lenis** | Smooth page scrolling engine (bypassed in Admin) |
| **Backend** | **Node.js (v24)** | Server execution environment |
| | **Express 5** | RESTful HTTP routes & server orchestration |
| | **Mongoose (v8)** | MongoDB object data modeling (ODM) |
| **Database** | **MongoDB Atlas** | Managed cloud database housing site info |
| **AI Integration**| **Google Gemini API** | Powered by `gemini-2.5-flash` for chat, translation, and auto-blogging |
| **Analytics** | **Vercel Analytics** | Real-time traffic monitoring and performance reporting |

---

## 🛠️ Core Features & Guides

### Interactive Landing Page
The landing page contains several beautiful, responsive sections:
*   **Hero**: Renders Sicky's intro, an interactive subtitle typing animation, and key action call-to-outs.
*   **About**: Outlines his history, education details, and key statistics (CGPA, Projects, etc.).
*   **TechStack**: An animated dashboard displaying categorized developer skill tags.
*   **Projects**: Interactive project portfolio cards featuring quick tags and category filters.
*   **Services**: Services offered by Sicky, with customized action buttons.
*   **Testimonials**: Sliding user review grid layout.
*   **Contact**: Secure message portal validating inputs and forwarding details through rate-limited endpoints.

### Global 3D & Canvas Effects
*   **Cursor Glow**: A custom mouse glow circle overlay following client movement. Located in [`CursorGlow.jsx`](file:///d:/Google%20Antigravity/portfolio/frontend/src/components/ui/CursorGlow.jsx).
*   **Plexus Background**: Interactive background featuring animated particle nodes linking together on canvas hovering. Located in [`PlexusBackground.jsx`](file:///d:/Google%20Antigravity/portfolio/frontend/src/components/ui/PlexusBackground.jsx).
*   **Tilt Cards**: Simple JavaScript calculations tracking mouse coordinates inside cards to translate it into immersive 3D tilts. Located in [`TiltCard.jsx`](file:///d:/Google%20Antigravity/portfolio/frontend/src/components/ui/TiltCard.jsx).
*   **Magnetic Buttons**: Uses GSAP to magnetically pull buttons towards the user's cursor. Located in [`MagneticButton.jsx`](file:///d:/Google%20Antigravity/portfolio/frontend/src/components/ui/MagneticButton.jsx).

### Advanced Theme Customizer
Accessed via the floating customization wheel (located in [`ThemeCustomizer.jsx`](file:///d:/Google%20Antigravity/portfolio/frontend/src/components/ui/ThemeCustomizer.jsx)). Features include:
*   **Presets**: Switch between curated, HSL-based palettes (Emerald Aurora, Hyperdrive Purple, Cyberpunk Gold, Arctic Frost, Toxic Waste, Volcanic Ash, Deep Sea, Mystic Rose, Corporate Steel, Pure Black, and Pure White).
*   **Background Options**: Switch backdrop layout formats (Aura, Grid, Minimal, Celestial).
*   **Visual Controls**: Grain noise overlay switcher, cursor glow size controls, font-face select, and standard light/dark mode toggling.

### AI Capabilities (Gemini 2.5 Flash)
Connected to Google's API via [`backend/routes/ai.js`](file:///d:/Google%20Antigravity/portfolio/backend/routes/ai.js).
1.  **AI Chatbot (`GlobalAIAssistant`)**: A floating interactive widget. If `GEMINI_API_KEY` is present, it acts as a digital twin of Sicky, referencing his profile, projects, and services in real-time.
2.  **Audio Reader (`AudioReader`)**: Uses Web Speech Synthesis API to read text content out loud dynamically.
3.  **Blog Writer**: Allows the admin to feed a prompt and generate full SEO-optimized markdown articles via the Admin Dashboard.
4.  **Translator**: A helper route that translates English blog posts into clean Devanagari Hindi text.

### GitHub Integration
Located in [`GitHubSection.jsx`](file:///d:/Google%20Antigravity/portfolio/frontend/src/sections/GitHubSection.jsx), it connects directly to GitHub APIs to display real-time contribution grids, repository details, and commit milestones.

### Admin Console (`/sicky-admin`)
The secured control room for updating site configuration and posting articles. It features:
*   **Resizer Handles**: Mouse drag event listeners (`sidebarWidth`, `rightPanelWidth`, `editorSplitRatio`) that let the developer drag split-screen divisions directly.
*   **WebP Canvas Compressor**: HTML5 Canvas translates local user uploads to WebP (80% compression) before sending them to Cloudinary. This eliminates backend dependency on binaries like `sharp`.
*   **Smooth Scroll Bypass**: Automatically disables Lenis on admin paths to restore native wheel scrolling for sidebars and editor panels.

### Dynamic Sitemap
The sitemap located at `/sitemap.xml` is served dynamically via Express. It queries MongoDB in real-time to list all published blogs immediately for SEO indexing without requiring static generation.

### System Architecture Page & SPA Routing Engine
*   **Architecture Page**: An interactive, glassmorphic route (`/architecture`) served dynamically. It pulls the updated [`AGENTS.md`](file:///d:/Google%20Antigravity/portfolio/.agents/AGENTS.md) content via `GET /api/profile/architecture` and displays the system design, features, and file structure using the `<MarkdownRenderer />` component.
*   **Footer Links**: Organized into a clean, space-saving **2-column responsive grid** in [`Footer.jsx`](file:///d:/Google%20Antigravity/portfolio/frontend/src/components/layout/Footer.jsx). The "Architecture" link is conditionally rendered so that it only appears in the portfolio section (main landing page) and is hidden when in the blog section.
*   **SPA Route & Hash Synchronization**: The global `pushState` and `replaceState` methods are patched in [`main.jsx`](file:///d:/Google%20Antigravity/portfolio/frontend/src/main.jsx) to dispatch custom `locationchange` events. [`App.jsx`](file:///d:/Google%20Antigravity/portfolio/frontend/src/App.jsx), the navbar, and the footer listen to this event reactively, resolving URL lagging. Additionally, scroll listeners in [`Navbar.jsx`](file:///d:/Google%20Antigravity/portfolio/frontend/src/components/layout/Navbar.jsx) track and replace the URL hash dynamically as the user scrolls through homepage sections, ensuring the URL bar is always in sync with the viewport section without polluting the browser history.
*   **Global Command Palette (Spotlight Search)**: A premium, glassmorphic command center component [`CommandPalette.jsx`](file:///d:/Google%20Antigravity/portfolio/frontend/src/components/ui/CommandPalette.jsx) triggered globally by pressing `Ctrl + K` (or `Cmd + K`) or clicking the search icon in the navbar. It allows visitors to filter and navigate to all website sections, toggle dark/light theme, select dynamic HSL theme presets (e.g., Emerald, Purple, Cyberpunk), change backdrop modes, trigger the AI twin clone assistant, and search/redirect instantly. Supported by arrow key focus controls (`ArrowUp`/`ArrowDown`), `Enter` select, and `Escape` exit hooks.

---

## 🛠️ Getting Started (Local Development)

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** or **bun** installed on your system.

### 2. Backend Setup
1. Open a terminal in [`backend/`](file:///d:/Google%20Antigravity/portfolio/backend).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file referencing:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   GEMINI_API_KEY=AIzaSy...
   CORS_ORIGIN=http://127.0.0.1:5173,http://localhost:5173
   # Email, Cloudinary, and other parameters...
   ```
4. Seeding data (highly recommended for first-time setup):
   ```bash
   npm run seed
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a terminal in [`frontend/`](file:///d:/Google%20Antigravity/portfolio/frontend).
2. Install dependencies:
   ```bash
   npm install   # or bun install
   ```
3. Start the dev server:
   ```bash
   npm run dev   # or bun dev
   ```
4. Access the site locally at `http://127.0.0.1:5173/`.

---

## 🔄 Data Synchronization Pattern
When updating projects, blogs, or profile information, ensure synchronization across the following layers:
1.  **Frontend Static Fallbacks**: Update default states in React components (e.g., `FALLBACK_PROJECTS` inside [`Projects.jsx`](file:///d:/Google%20Antigravity/portfolio/frontend/src/sections/Projects.jsx)).
2.  **Database Seeds**: Ensure [`seed.js`](file:///d:/Google%20Antigravity/portfolio/backend/seed/seed.js) in the backend matches the upgraded information.
3.  **Active Database (MongoDB)**: Run a database query or script to sync modifications directly with the live database collections.

---

## ⚙️ Workspace Customization & AI Rules
Use these rules and guidelines when making future modifications or upgrades to the project:

### Project Layout & Styling Standards
*   **Grid Alignment**: The fixed Navigation Bar is locked to a maximum width of `max-w-6xl` (1152px). All landing page sections (Hero, About, TechStack, Services, Projects, Testimonials, Contact) and the Footer must align exactly with the Navbar margins by using `max-w-6xl` containers.
*   **300px Device Responsiveness**:
    *   Floating customization consoles, project lists, and blog list grids must remain fully responsive and readable on tiny screens (down to 300px width). Use flex-wrap or single-column grids (`grid-cols-1`) on mobile widths.
    *   Form modals in the Admin Console (/sicky-admin) use a bottom-sheet slide-up pattern on mobile devices and compact center/top layouts on desktop.
*   **Modal Scrolling & Scroll Locks**:
    *   Open modals must prevent parent window/background scrolling using body styling locks (`overflow: hidden` on body / `touch-action: none` on backdrop).
    *   Internal modal containers must handle mouse wheel and touch scroll propagation (`e.stopPropagation()` on touch and wheel events) and utilize `overscroll-contain`.

### Security Constraints
*   **Environment Secrets**: Never read, copy, index, or store `.env` files, database credentials, API keys, or private passcodes in custom rules, workspace summaries, or memory configurations. Ignore `.env` files during any background context persistence.

### Editor Workspace & Modular Component Rules
*   **Line Length Constraints**: Component files must be kept under 300-400 lines. Exceeding logic should be systematically extracted into modular sub-components (`components/` directory) and custom hooks (`hooks/` directory).
*   **Column Resizing & Full Width**: Admin workspace panels support dynamic resizer dragging handles via mouse event listeners (`sidebarWidth`, `rightPanelWidth`, `editorSplitRatio`). Toggle collapse controls allow complete hiding for a full-screen canvas. When active, page width scales to `w-full max-w-none` to maximize interface space.
*   **Client WebP Conversion**: Images are pre-processed, converted to WebP, and compressed to 80% quality via browser HTML5 Canvas before uploading to Cloudinary, ensuring zero dependency on server-side binary image compiler tools (like `sharp`).
*   **Dynamic Sitemap**: The public `/sitemap.xml` is served dynamically from the Express backend database query rather than a static file, reflecting changes to Published blogs instantly.
*   **Desktop Layout Filter**: Complex editors and SEO publishers are restricted to desktop viewports (>= 1024px) with descriptive instructions displayed on smaller devices.
*   **Bypass Smooth Scroll**: Smooth scroll managers (e.g. Lenis) must be bypassed on `/sicky-admin` routes to restore standard native mouse wheel scrolling in all sidebar, settings, and editor canvas sections.
