# Workspace Customization & Project Summary

This workspace contains Sicky Kumar's premium 3D AI MERN Portfolio & Admin Portal. 
Use these rules and guidelines when making future modifications or upgrades to the project:

## Project Layout & Styling Standards
- **Grid Alignment**: The fixed Navigation Bar is locked to a maximum width of `max-w-6xl` (1152px). All landing page sections (Hero, About, TechStack, Services, Projects, Testimonials, Contact) and the Footer must align exactly with the Navbar margins by using `max-w-6xl` containers.
- **300px Device Responsiveness**: 
  - Floating customization consoles, project lists, and blog list grids must remain fully responsive and readable on tiny screens (down to 300px width). Use flex-wrap or single-column grids (`grid-cols-1`) on mobile widths.
  - Form modals in the Admin Console (/sicky-admin) use a bottom-sheet slide-up pattern on mobile devices and compact center/top layouts on desktop.
- **Modal Scrolling & Scroll Locks**:
  - Open modals must prevent parent window/background scrolling using body styling locks (`overflow: hidden` on body / `touch-action: none` on backdrop).
  - Internal modal containers must handle mouse wheel and touch scroll propagation (`e.stopPropagation()` on touch and wheel events) and utilize `overscroll-contain`.

## Data Synchronization Pattern
When updating projects, blogs, or profile information, ensure synchronization across the following layers:
1. **Frontend Static Fallbacks**: Update default states in React components (e.g., `FALLBACK_PROJECTS` inside [Projects.jsx](file:///d:/Google%20Antigravity/portfolio/frontend/src/sections/Projects.jsx)).
2. **Database Seeds**: Ensure [seed.js](file:///d:/Google%20Antigravity/portfolio/backend/seed/seed.js) in the backend matches the upgraded information.
3. **Active Database (MongoDB)**: Run a database query or script to sync modifications directly with the live database collections.

## Security Constraints
- **Environment Secrets**: Never read, copy, index, or store `.env` files, database credentials, API keys, or private passcodes in custom rules, workspace summaries, or memory configurations. Ignore `.env` files during any background context persistence.

## Editor Workspace & Modular Component Rules
- **Line Length Constraints**: Component files must be kept under 300-400 lines. Exceeding logic should be systematically extracted into modular sub-components (`components/` directory) and custom hooks (`hooks/` directory).
- **Column Resizing & Full Width**: Admin workspace panels support dynamic resizer dragging handles via mouse event listeners (`sidebarWidth`, `rightPanelWidth`, `editorSplitRatio`). Toggle collapse controls allow complete hiding for a full-screen canvas. When active, page width scales to `w-full max-w-none` to maximize interface space.
- **Client WebP Conversion**: Images are pre-processed, converted to WebP, and compressed to 80% quality via browser HTML5 Canvas before uploading to Cloudinary, ensuring zero dependency on server-side binary image compiler tools (like `sharp`).
- **Dynamic Sitemap**: The public `/sitemap.xml` is served dynamically from the Express backend database query rather than a static file, reflecting changes to Published blogs instantly.
- **Desktop Layout Filter**: Complex editors and SEO publishers are restricted to desktop viewports (>= 1024px) with descriptive instructions displayed on smaller devices.
- **Bypass Smooth Scroll**: Smooth scroll managers (e.g. Lenis) must be bypassed on `/sicky-admin` routes to restore standard native mouse wheel scrolling in all sidebar, settings, and editor canvas sections.
