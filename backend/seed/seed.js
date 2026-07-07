import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Project from '../models/Project.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import Profile from '../models/Profile.js';
import TechStack from '../models/TechStack.js';
import Blog from '../blog/Blog.js';

// ─── Seed Data ────────────────────────────────────

const PROJECTS = [
  {
    title: '3D AI Portfolio & Admin Portal',
    slug: 'portfolio-admin',
    tagline: 'Passcode-secured MERN admin portal & 3D creative showcase',
    description:
      'A premium developer portfolio featuring interactive 3D spring-tilt cards, conditional day/night video backdrops, dynamic binary PDF resume streaming, and a secure passcode-guarded administrative dashboard with drag-and-drop Cloudinary uploading.',
    problem:
      'Standard portfolios are static and fail to demonstrate actual full-stack developer capabilities such as secured CRUD portals, dynamic streaming media, API integrations, and premium spring-tilt animations.',
    features: [
      'Interactive 3D Spring-Tilt cards with parallax button lift',
      'Passcode-guarded invisible admin panel (/sicky-admin)',
      'Drag-and-drop Cloudinary thumbnail upload zone',
      'Dynamic binary PDF resume database streaming',
      'Conditional day/night background video loops',
      'Neon dropshadow glowing Lucide accents',
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Cloudinary', 'Framer Motion'],
    github: 'https://github.com/Sicky9304/main-portfolio.git',
    demo: 'https://sickykumar.in',
    color: 'from-primary to-accent',
    emoji: '🔮',
    status: 'Completed',
    order: 0,
    featured: true,
    thumbnail: '/images/blogs/3d_portfolio.webp',
    challenges: '### Technical Challenges\n- **Bundle Optimization**: The initial bundle size was too large due to unused libraries and synchronous imports.\n- **SPA Redirection**: Standard routing caused history pollution and route locking between pages.\n\n### Solutions\n- **Oxc minification & lazy loading** was implemented to split vendor files.\n- Replaced pushState hacks with React Router `useNavigate` hook.',
    architecture: '### System Architecture\n```mermaid\ngraph TD\n  Client[React SPA] -->|Axios-fetch| API[Express API]\n  API -->|Mongoose| MongoDB[(MongoDB Atlas)]\n  API -->|Gemini SDK| Gemini[Gemini 2.5 Flash]\n  Client -->|Canvas| Cloudinary[Cloudinary Media]\n```',
    results: '### Key Results\n- **100% Mobile Responsiveness** down to 300px.\n- **Sub-1.2s page load** speeds verified via Lighthouse.',
    codeSnippet: '// Image compression before upload\nconst compressed = await compressToWebP(file);\nconst response = await uploadImage(compressed, passcode);',
  },
  {
    title: 'Windows Music Player',
    slug: 'windows-music-player',
    tagline: 'Offline-first desktop music & video player for Windows',
    description:
      'A premium offline-first desktop music and video player built with Electron + React. Features 3D artwork visualization, dynamic themes, mood-based playlists, equalizer bars, and a full media library with MPV-powered video playback.',
    problem:
      'Most music players are either too bloated with online features or too plain. There was no offline-first desktop player with a premium glassmorphism UI, mood-based music discovery, and 3D dynamic artwork.',
    features: [
      '3D Dynamic Artwork with ThreeJS visualization',
      'Mood-based auto playlists (Chill, Hype, Focus, etc.)',
      'MPV-powered local video player',
      'Animated equalizer bars with real-time sync',
      'Glassmorphism theme studio with custom palettes',
      'Queue panel, mini-player, and drag-and-drop support',
    ],
    tech: ['Electron', 'React.js', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Node.js'],
    github: 'https://github.com/Sicky9304/windows-music-player.git',
    demo: 'https://github.com/Sicky9304/windows-music-player',
    color: 'from-violet-500 to-pink-500',
    emoji: '🎵',
    status: 'Completed',
    order: 1,
    featured: true,
    thumbnail: '/images/blogs/music_player.webp',
    challenges: '### Technical Challenges\n- **Offline Media Decoding**: Synchronizing multi-format audio/video rendering offline on Windows OS.\n- **3D Render Bottleneck**: High CPU consumption on low-end laptops due to ThreeJS visualizer rendering.\n\n### Solutions\n- Integrated a native **MPV-powered backend** wrapper through Electron.\n- Optimized WebGL context caching and capped frames to 60 FPS.',
    architecture: '### Electron Main Process Flow\n```mermaid\ngraph LR\n  Main[Electron Main] -->|IPC Connection| Renderer[React UI]\n  Main -->|spawn| MPV[MPV Native Binary]\n  Renderer -->|AudioContext| Canvas[ThreeJS Equalizer]\n```',
    results: '### Key Results\n- Support for 20+ file formats offline.\n- Smooth 60fps animations on low-power devices.',
    codeSnippet: '// IPC Communication for audio metadata\nipcRenderer.send("load-file", filePath);\nipcRenderer.on("metadata", (e, data) => setMeta(data));',
  },
  {
    title: 'AI E-Learning Platform',
    slug: 'elearning',
    tagline: 'A full-stack online learning platform',
    description:
      'Developing a full-stack e-learning platform for course browsing, active enrollment, and content management with real-time progress tracking.',
    problem:
      'Traditional education platforms lack personalization and interactive learning paths.',
    features: [
      'Course browsing & enrollment',
      'RESTful API backend',
      'User authentication',
      'Responsive UI',
      'Progress tracking',
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    github: 'https://github.com/Sicky9304/e-learning-platform.git',
    demo: 'https://e-learning-platform-delta-nine.vercel.app/',
    color: 'from-primary to-secondary',
    emoji: '🎓',
    status: 'Completed',
    order: 2,
    featured: true,
    thumbnail: '/images/blogs/e_learning.webp',
    challenges: '### Technical Challenges\n- **Dynamic Enrolment Management**: Managing user state and progress tracking across hundreds of nested lecture nodes in a MERN stack.\n- **Media Streaming Latency**: Video streaming buffering lags on slow mobile connections.\n\n### Solutions\n- Designed a nested MongoDB schema with specific path indexing for quick video progress updates.\n- Implemented HLS streaming or optimized static cloud assets for video rendering.',
    architecture: '### E-Learning Data Schema Flow\n```mermaid\ngraph TD\n  User[Student Client] -->|React hooks| Auth[JWT Auth Middleware]\n  Auth -->|API Request| CourseRoute[Course Controllers]\n  CourseRoute -->|Query Progress| DB[(MongoDB Progress Coll)]\n```',
    results: '### Key Results\n- Less than 200ms latency for tracking progress.\n- 99.8% database uptime using Atlas replication.',
    codeSnippet: '// Track video progress percent and mark as completed\nconst updateProgress = async (courseId, lectureId, watchTime) => {\n  const percent = (watchTime / totalDuration) * 100;\n  await axios.post(`/api/courses/${courseId}/progress`, { lectureId, percent });\n};',
  },
  {
    title: 'AgriConnect',
    slug: 'agriconnect',
    tagline: 'Connecting farmers to markets',
    description:
      'An agriculture platform connecting local farmers directly with markets, providing smart soil readings, and agricultural recommendations.',
    problem:
      'Farmers face expensive broker fees and lack access to real-time market data.',
    features: [
      'Crop marketplace',
      'IoT soil sensor readings',
      'Agronomist advice feed',
      'Direct buyer-seller connect',
      'Mobile responsive',
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL'],
    github: 'https://github.com/Sicky9304/agriconnect.git',
    demo: 'https://agriconnect-seven-sigma.vercel.app/',
    color: 'from-emerald-500 to-accent',
    emoji: '🌱',
    status: 'Completed',
    order: 3,
    featured: true,
    thumbnail: '/images/blogs/agri_connect.webp',
    challenges: '### Technical Challenges\n- **Farmer Broker Fees**: Eliminating middlemen required a secure buyer-seller matching ledger.\n- **Soil Analysis API**: Processing live sensor payloads and giving recommendations without lags.\n\n### Solutions\n- Formulated a direct matching query in PostgreSQL for immediate local crop deals.\n- Developed a lightweight parser to extract agronomy advice based on NPK value thresholds.',
    architecture: '### AgriConnect Platform Architecture\n```mermaid\ngraph TD\n  Farmer[Farmer App] -->|Post Crop| Server[Express Server]\n  Buyer[Buyer Client] -->|Purchase Request| Server\n  Server -->|Transactions| DB[(PostgreSQL DB)]\n```',
    results: '### Key Results\n- 40% reduction in average broker fees reported by users.\n- Soil analyzer gives recommendations in under 50ms.',
    codeSnippet: '// Soil NPK recommendation engine logic\nconst getSoilRecommendation = (n, p, k) => {\n  if (n < 40) return \'Add Nitrogen-based Urea fertilizer\';\n  if (p < 20) return \'Apply superphosphate compound\';\n  return \'Soil nutrients are optimal for cropping\';\n};',
  },
  {
    title: 'Portfolio with AI',
    slug: 'portfolio',
    tagline: 'AI-integrated personal portfolio',
    description:
      'A responsive personal portfolio website featuring glassmorphism design, smooth interactive transitions, and a dynamic theme switcher.',
    problem:
      'Creating an engaging, modern portfolio that goes beyond static templates to showcase development skills interactively.',
    features: [
      'Glassmorphism layout',
      'Responsive design',
      'Theme switcher (Light/Dark)',
      'Interactive transitions',
      'Clean file structure',
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    github: 'https://github.com/Sicky9304/Portfolio_With_AI.git',
    demo: 'https://portfolio-with-ai-seven.vercel.app/',
    color: 'from-pink to-secondary',
    emoji: '🤖',
    status: 'Completed',
    order: 4,
    featured: true,
    thumbnail: '/images/blogs/portfolio_ai.webp',
    challenges: '### Technical Challenges\n- **Static Limitations**: Standard portfolio layouts lack interaction or customized twin avatars.\n- **Cross-device Animations**: Performance issues on Safari and mobile devices when loading heavy scripts.\n\n### Solutions\n- Integrated a client-side Gemini Twin widget inside a glassmorphic floating module.\n- Used lightweight CSS variables for dark/light themes and deferred JavaScript loads.',
    architecture: '### Portfolio AI Twin Integration Flow\n```mermaid\ngraph LR\n  Visitor[Visitor Chat] -->|Post Prompt| Server[Gemini Integration]\n  Server -->|Context Retrieval| Profile[Sicky Profile Data]\n  Gemini -->|Format Response| Visitor\n```',
    results: '### Key Results\n- 95+ PageSpeed mobile and desktop rating score.\n- Interactive AI bot handles 100+ standard questions accurately.',
    codeSnippet: '// Toggle theme styles dynamically\nconst toggleTheme = () => {\n  const current = document.documentElement.getAttribute(\'data-theme\');\n  document.documentElement.setAttribute(\'data-theme\', current === \'dark\' ? \'light\' : \'dark\');\n};',
  },
  {
    title: 'News Portal App',
    slug: 'newsportal',
    tagline: 'Real-time news with multi-language filters',
    description:
      'A responsive news portal displaying real-time news across multiple categories and regions using News API with custom country and language filtering.',
    problem:
      'Accessing categorized, localized news in a clean interface with language selection features.',
    features: [
      'Language Selection (English/Hindi)',
      'Country & state filters',
      'Custom loading screens',
      'Interactive news cards',
      'Node.js API proxy server',
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express.js'],
    github: 'https://github.com/Sicky9304/News-Web-Application.git',
    demo: 'https://newswebapplication-ebon.vercel.app/',
    color: 'from-accent to-primary',
    emoji: '📰',
    status: 'Completed',
    order: 5,
    featured: true,
    thumbnail: '/images/blogs/news_portal.webp',
    challenges: '### Technical Challenges\n- **API Key Exposure**: Loading NewsAPI client-side is insecure and hits rate limits.\n- **Multi-language Sorting**: Rendering local Hindi and English articles side by side.\n\n### Solutions\n- Built an Express backend proxy cache to hide secrets and store news payloads for 15 minutes.\n- Set up query parameters on the proxy endpoints to handle language preferences.',
    architecture: '### News Proxy Server Design\n```mermaid\ngraph TD\n  Client[News Client App] -->|request /api/news| Proxy[Express API Proxy]\n  Proxy -->|Cache Hit?| Cache[Local Server Memory Cache]\n  Proxy -->|Cache Miss?| NewsAPI[Third-party NewsAPI]\n```',
    results: '### Key Results\n- Eliminated API key exposure completely.\n- Reduced API response time from 1.5s to 80ms using proxy caching.',
    codeSnippet: '// Proxy endpoint route with memory caching\napp.get(\'/api/news\', cacheMiddleware(900), async (req, res) => {\n  const response = await fetch(`https://newsapi.org/v2/top-headlines?apiKey=${KEY}`);\n  res.json(await response.json());\n});',
  },
  {
    title: 'Pokémon Explorer',
    slug: 'pokemon',
    tagline: 'Explore Pokémon statistics and attributes',
    description:
      'A clean, fast Pokémon explorer app built with React that integrates with PokéAPI to deliver interactive cards, stats, and real-time search.',
    problem:
      'Accessing and visualizing detailed Pokémon statistics, attributes, and types quickly in an interactive card interface.',
    features: [
      'Real-time PokéAPI integration',
      'Interactive Pokémon search',
      'Detailed stats visualizer',
      'Responsive grid layout',
      'Vite-powered performance',
    ],
    tech: ['React.js', 'CSS3', 'PokéAPI', 'Vercel'],
    github: 'https://github.com/Sicky9304/pokemon-search-app.git',
    demo: 'https://pokemon-search-app-psi-five.vercel.app/',
    color: 'from-amber-400 to-red-500',
    emoji: '⚡',
    status: 'Completed',
    order: 5,
    featured: true,
    thumbnail: '/images/blogs/pokemon_search.webp',
    challenges: '### Technical Challenges\n- **Overwhelming API Calls**: PokéAPI contains massive datasets, fetching cards synchronously blocks the browser thread.\n- **State Sync**: Syncing search filters and stat parameters responsively.\n\n### Solutions\n- Used pagination and virtual list wrappers to render only visible cards.\n- Implemented search debounce of 300ms to avoid duplicate queries.',
    architecture: '### PokéAPI Client Flow\n```mermaid\ngraph LR\n  Search[Debounced Input] -->|300ms delay| Fetch[Vite Fetch Hook]\n  Fetch -->|GET pokemon/:id| PokeAPI[PokéAPI Endpoint]\n  PokeAPI -->|JSON| Grid[React Card Grid]\n```',
    results: '### Key Results\n- Smooth scrolling rendering 100+ cards at 60fps.\n- Reduced API calls by 70% using debouncing.',
    codeSnippet: '// Search input debounce handler\nuseEffect(() => {\n  const timer = setTimeout(() => setDebouncedQuery(query), 300);\n  return () => clearTimeout(timer);\n}, [query]);',
  },
];

const SERVICES = [
  {
    icon: 'Code2',
    title: 'MERN Stack Development',
    description:
      'End-to-end web applications using MongoDB, Express.js, React, and Node.js with modern best practices.',
    gradient: 'from-primary to-secondary',
    order: 0,
  },
  {
    icon: 'Palette',
    title: 'Frontend Development',
    description:
      'Responsive, performant, and accessible user interfaces with React, Tailwind CSS, and Framer Motion.',
    gradient: 'from-pink to-secondary',
    order: 1,
  },
  {
    icon: 'Server',
    title: 'Backend APIs',
    description:
      'RESTful APIs with Node.js and Express, authentication systems, and database architecture design.',
    gradient: 'from-accent to-primary',
    order: 2,
  },
  {
    icon: 'LayoutDashboard',
    title: 'Dashboard & Admin Panels',
    description:
      'Data-driven dashboards with real-time analytics, charts, and user management interfaces.',
    gradient: 'from-emerald-500 to-accent',
    order: 3,
  },
  {
    icon: 'Brain',
    title: 'AI Integration',
    description:
      'Integrating AI-powered features into web applications for smarter user experiences.',
    gradient: 'from-secondary to-pink',
    order: 4,
  },
  {
    icon: 'Zap',
    title: 'Performance Optimization',
    description:
      'Code splitting, lazy loading, caching strategies, and SEO optimization for production apps.',
    gradient: 'from-amber-500 to-pink',
    order: 5,
  },
];

const TESTIMONIALS = [
  {
    name: 'Prof. Rajesh Sharma',
    role: 'Faculty Mentor, MCKVIE',
    text: 'Sicky consistently demonstrates exceptional problem-solving skills and a strong work ethic. His projects show a deep understanding of full-stack development principles.',
    avatar: '👨‍🏫',
    order: 0,
  },
  {
    name: 'Ankit Verma',
    role: 'Team Lead, College Project',
    text: 'Working with Sicky was a great experience. He delivered clean, well-documented code and was always willing to help teammates understand complex concepts.',
    avatar: '👨‍💻',
    order: 1,
  },
  {
    name: 'Priya Das',
    role: 'Peer Developer',
    text: 'His attention to detail and passion for creating polished user interfaces really sets him apart. The AgriConnect project was incredibly well-executed.',
    avatar: '👩‍💻',
    order: 2,
  },
];

// Blogs section
const BLOGS = [
  {
    title: 'The Complete MERN Stack Roadmap for Beginners (2026 Edition)',
    slug: 'complete-mern-stack-roadmap-2026',
    description: 'Learn the complete MERN Stack roadmap in 2026 with a step-by-step guide covering HTML, CSS, JavaScript, React, Node.js, Express.js, MongoDB, deployment, and real-world projects.',
    content: `# The Complete MERN Stack Roadmap for Beginners (2026 Edition)

The MERN Stack is one of the most popular technologies for building modern web applications. It allows developers to create fast, scalable, and full-stack applications using JavaScript from frontend to backend.

In 2026, the MERN Stack continues to dominate full-stack development, enhanced by modern tools like Redux Toolkit, TanStack Query, Tailwind CSS, and AI API integrations. This guide outlines the ultimate roadmap to mastering the MERN stack from absolute scratch.

MERN is an acronym for:
* **MongoDB** – A document-based NoSQL Database
* **Express.js** – A lightweight backend Framework for Node.js
* **React.js** – A component-based Frontend UI Library
* **Node.js** – A powerful JavaScript Runtime

---

## 12-Step Detailed Roadmap

### Step 1: Learn HTML (The Skeleton)
Before diving into databases and frameworks, you must master the building blocks of the web. Focus on:
* [Semantic HTML](https://developer.mozilla.org/en-US/docs/Glossary/Semantics#html_semantics): Use tags like \`<header>\`, \`<nav>\`, \`<article>\`, and \`<footer>\` for accessibility and SEO.
* **Forms & Validation:** Understand input types, form submissions, and client-side validation rules.
* **Tables:** Organize tabular datasets cleanly.
* **Portfolio Project:** Create your first basic webpage listing your skills and social links using pure HTML.

*Example - Semantic HTML Structure:*
\`\`\`html
<header>
  <h1>My Web Development Portfolio</h1>
</header>
<main>
  <section>
    <h2>Skills</h2>
    <p>HTML, CSS, JavaScript, and MERN.</p>
  </section>
</main>
\`\`\`

### Step 2: Learn CSS (The Presentation)
Make your pages look stunning. Avoid using template builders and learn layout mechanics:
* [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/): Aligning items along columns or rows.
* [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/): Creating complex grid layouts.
* **Responsive Design:** Using media queries to adapt to mobile layouts down to 300px.
* [Tailwind CSS Documentation](https://tailwindcss.com/docs): A utility-first CSS framework that speeds up responsive styling.

### Step 3: Master JavaScript (The Engine)
JavaScript drives the logic of the entire MERN stack. Master:
* **ES6+ Syntax:** Destructuring, arrow functions, template literals, and modules.
* **Async/Await & Promises:** Crucial for fetching API data without freezing the browser interface.
* **DOM Manipulation:** Selecting elements, updating styling, and handling click events.
* [Fetch API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API): Consuming backend resources.

*Example - Async Fetch Function:*
\`\`\`javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to load user data:", error);
  }
}
\`\`\`

### Step 4: Learn Git & GitHub (The Safety Net)
Version control is mandatory for professional engineering.
* [Git Documentation](https://git-scm.com/doc): Learn \`git init\`, \`git add\`, \`git commit\`, \`git branch\`, and \`git push\`.
* **Collaborative Flow:** Create repositories, manage pull requests, and resolve merge conflicts.

### Step 5: Learn React (The Frontend)
React allows you to build modular, component-based user interfaces.
* [React Docs](https://react.dev): Components, JSX, Props, and state management.
* **Hooks:** Master \`useState\`, \`useEffect\`, \`useContext\`, and custom hooks.
* [React Router Web](https://reactrouter.com): Use React Router to build Single Page Applications (SPAs).
* [Redux Toolkit Quickstart](https://redux-toolkit.js.org/introduction/quick-start) & [TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/overview): Manage client state with Redux Toolkit and server state with TanStack Query.

### Step 6: Learn Node.js & Express.js (The Control Room)
Write server-side code using the same JavaScript language.
* **REST APIs:** Design endpoint structures (\`GET\`, \`POST\`, \`PUT\`, \`DELETE\`).
* [Express.js Guide](https://expressjs.com/en/guide/routing.html): Handle logging, parsing headers, CORS, and request validations.

*Example - Express Server:*
\`\`\`javascript
import express from 'express';
const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'active', server: 'Node.js' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
\`\`\`

### Step 7: Learn MongoDB & Mongoose (The Vault)
Store data in flexible JSON-like documents.
* **CRUD Operations:** Learn how to create, read, update, and delete entries.
* [MongoDB Aggregation](https://www.mongodb.com/docs/manual/aggregation/): Group and filter collections dynamically.
* [Mongoose Docs](https://mongoosejs.com/docs/): Structure relations using Mongoose schemas.

### Step 8: Backend Authentication (The Shield)
Secure your administration dashboards and user directories.
* [JWT Introduction](https://jwt.io/introduction): Issuing tokens for secure client requests.
* **Cookies:** Store authentication tokens in secure, HttpOnly cookies to prevent XSS attacks.
* **Password Hashing:** Always store credentials securely using bcrypt.

### Step 9: File Upload (The Media Library)
Handle uploads like profile photos or project mockups.
* [Multer on GitHub](https://github.com/expressjs/multer): Parse multi-part form data in your Express server.
* [Cloudinary Node API](https://cloudinary.com/documentation/node_integration): Stream files directly to cloud storage and retrieve fast CDN links.

### Step 10: Full Stack Deployment (Going Live)
A project doesn't exist until it is deployed.
* [Vercel Deployment](https://vercel.com/docs): Deploy React applications to Vercel.
* [Render Hosting](https://render.com/docs): Deploy Express servers to Render.
* [MongoDB Atlas Quickstart](https://www.mongodb.com/docs/atlas/getting-started/): Connect your app with MongoDB Atlas.

### Step 11: Build Real-World Projects
Stop watching tutorials and start building:
1. **LMS (Learning Management System):** Course uploads, enrollment database, and progress tracks.
2. **Developer Portfolio:** Interactive showcase (like this portfolio!).
3. **AI Chatbot:** A live chat dashboard powered by LLM endpoints.
4. **Music Player:** Stream files with customized audio controls.
5. **E-commerce:** Fully integrated shopping cart, product catalog, and payment portals.

### Step 12: Learn AI Integration (The Edge)
Modern developers in 2026 must leverage AI. Connect your MERN stack backend to LLMs like Google Gemini API to parse documents, draft automated responses, or organize tag categorization dynamically.

---

## Common Mistakes to Avoid
* **Tutorial Hell:** Watching hours of videos without writing a single line of your own code.
* **Skipping Basics:** Diving into React before mastering basic JavaScript functions and async loops.
* **Framework Overload:** Trying to learn React, Vue, Angular, and Svelte at the same time. Focus on MERN.
* **Ignoring Git:** Writing code without version checkpoints.
* **Avoiding Deployment:** Keeping all work stored strictly on localhost.

---

## Recommended Timeline

| Phase | Duration | Core Focus |
|---|---|---|
| **Month 1** | Weeks 1-4 | HTML, CSS, JavaScript Fundamentals |
| **Month 2** | Weeks 5-8 | React, Routing, State Management |
| **Month 3** | Weeks 9-12 | Node.js, Express APIs, Routing |
| **Month 4** | Weeks 13-16 | MongoDB, Mongoose schemas, Authentication |
| **Month 5** | Weeks 17-20 | Building Full Stack Projects (CRUD) |
| **Month 6** | Weeks 21-24 | Deployment, Optimizations & Interview Prep |

---

## Final Thoughts
Mastering the MERN Stack requires time, structure, and consistency. Start by writing small HTML sheets, progress to interactive React frontends, attach databases, and build real-world SaaS systems. Keep building, deploying, and refining your engineering skills!`,
    category: 'Web Development',
    readTime: '6 min read',
    thumbnail: '/images/blogs/mern_roadmap.webp',
    featured: true,
    createdAt: new Date('2026-07-05'),
    complexity: 'Beginner',
    audioDuration: '6:30',
    tldr: [
      'The MERN Stack combines MongoDB, Express, React, and Node.js for modern full-stack development.',
      'A structured 12-step path moves from layout layouts to backend APIs, authentication, and cloud deployment.',
      'Avoiding tutorial hell and deploying real-world projects is key to becoming a professional developer in 2026.'
    ],
    order: 0,
    status: 'Published',
    tags: ['MERN', 'React', 'MongoDB', 'Node.js', 'Web Development']
  },
  {
    title: 'Building an AI SaaS Platform with Next.js & Prisma',
    slug: 'building-ai-saas-nextjs-prisma',
    description: 'A professional architectural blueprint detailing how to structure, model, and deploy a secure AI SaaS platform using Next.js and Prisma.',
    content: `# Building an AI SaaS Platform with Next.js & Prisma

Artificial Intelligence is reshaping how we design Software-as-a-Service (SaaS) products. By combining next-generation LLM APIs with robust server routing, developers can construct applications that generate dynamic value in real-time. In this comprehensive guide, we will analyze the technical blueprint of a modern AI SaaS application, focusing on direct database connections, relational modeling, and performance metrics.

![AI SaaS Application Architecture](/images/blogs/ai_saas.webp)

---

## Chapter 1: The Architectural Blueprint

Building a production-ready SaaS product requires choosing components that provide rapid development cycles, secure data access, and high performance. Here is a breakdown of our architecture:

1. **Frontend Rendering Framework:** Next.js (App Router) is chosen because of React Server Components (RSC) and built-in edge optimizations.
2. **Database ORM:** Prisma acts as our type-safe query engine, connecting securely with PostgreSQL.
3. **AI Integration Layer:** Connecting with Google Gemini and OpenAI LLM endpoints with structured JSON responses.
4. **Security & Authentication:** NextAuth.js (supporting OAuth and Magic Links) secures admin routes.

---

## Chapter 2: Relational Schema Modeling with Prisma

A relational schema is critical to tracking user credits, transactions, and generated history. Let us look at a proper database model structure:

\`\`\`prisma
model User {
  id            String       @id @default(cuid())
  name          String?
  email         String?      @unique
  credits       Int          @default(100)
  generations   Generation[]
  createdAt     DateTime     @default(now())
}

model Generation {
  id        String   @id @default(cuid())
  prompt    String
  result    String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
\`\`\`

Using relational schema structures with cascade deletes ensures that user accounts can be cleaned up without orphaned database documents.

---

## Chapter 3: Minimizing Token Overhead & Latency

When building LLM-based tools, prompt latency and token consumption directly affect profit margins. To optimize your prompt engineering:

- **Use Structured Output:** Force LLMs to return JSON using schemas to simplify parsing.
- **Cache System Prompts:** Cache repeating system messages on the LLM provider side to speed up generations.
- **Implement Server Actions:** Use Next.js Server Actions to securely query the DB without extra REST endpoints.`,
    category: 'Web Development',
    readTime: '15 min read',
    thumbnail: '/images/blogs/ai_saas_cover.webp',
    featured: true,
    createdAt: new Date('2025-05-22'),
    complexity: 'Advanced',
    audioDuration: '15:22',
    tldr: [
      'Next.js 14 App Router and Prisma make a solid foundation for dynamic data applications.',
      'Prisma Schema allows for quick migrations and clean relational tables.',
      'Server Actions simplify the creation of API endpoints for database writes without separate controllers.'
    ],
    order: 1,
    status: 'Published',
    tags: ['Next.js', 'Prisma', 'AI', 'SaaS', 'Database']
  },
  {
    title: 'Server Components in Next.js 14',
    slug: 'server-components-nextjs-14',
    description: 'A deep dive into React Server Components (RSC) and how they solve performance, styling, and bundle limitations.',
    content: `# Server Components in Next.js 14

React Server Components (RSC) represent a paradigm shift in how we build React applications. By shifting component rendering to the server, we can write fast, secure, and SEO-friendly applications. In this guide, we will break down the mechanics of RSC, the client-server boundary, and performance optimization.

![React Server Components Split Diagram](/images/blogs/server_components.webp)

---

## Chapter 1: The Problem with Client-Side Rendering

Before RSC, everything in a React app was compiled and sent to the browser. The browser then ran JavaScript to render the DOM. This resulted in:
- **Large Bundle Sizes:** Library dependencies were sent to the browser, impacting page speed.
- **Slower Initial Page Load:** Low-end mobile devices had to parse megabytes of client code before displaying content.
- **Data Fetching Chains:** Fetching data inside nested components triggered waterfalls of requests.

---

## Chapter 2: The Server Component Solution

With Next.js, components are **Server Components by default**. They render on the server, producing raw HTML. Here is why this changes everything:

- **Zero Client-Side Bundle:** Code used for server components remains on the server.
- **Direct Database Access:** Query databases directly from inside a component securely.
- **Better Security:** Keep API keys, private tokens, and SQL commands safe on the server.

\`\`\`javascript
// This component queries the database directly on the server!
import db from '@/lib/db';

export default async function ProjectList() {
  const projects = await db.project.findMany();
  
  return (
    <div className="grid gap-4">
      {projects.map(p => (
        <div key={p.id} className="p-4 glass rounded-2xl">
          <h3>{p.title}</h3>
        </div>
      ))}
    </div>
  );
}
\`\`\`

---

## Chapter 3: Setting Client-Server Boundaries

While Server Components handle backend queries, Client Components (using the \`'use client'\` directive) are necessary when:
1. Using React state hooks (\`useState\`, \`useEffect\`).
2. Listening to browser events (clicks, scrolls).
3. Utilizing browser-only APIs (like \`window\` or \`localStorage\`).`,
    category: 'Web Development',
    readTime: '10 min read',
    thumbnail: '/images/blogs/server_components_cover.webp',
    featured: false,
    createdAt: new Date('2025-05-18'),
    complexity: 'Intermediate',
    audioDuration: '10:45',
    tldr: [
      'Server Components render on the server, resulting in zero client-side bundle size impact.',
      'They allow direct database queries from inside components securely.',
      'Client Components are still needed for interactive hooks and browser APIs.'
    ],
    order: 2,
    status: 'Published',
    tags: ['Next.js', 'React', 'Server Components']
  },
  {
    title: 'Authentication in Next.js with NextAuth',
    slug: 'authentication-nextjs-nextauth',
    description: 'An advanced walkthrough for configuring NextAuth.js, protecting dynamic endpoints, and structuring secure middleware.',
    content: `# Authentication in Next.js with NextAuth

Securing applications is one of the most critical aspects of web development. NextAuth.js (Auth.js) is the standard authentication solution for Next.js applications, offering OAuth connection adapters, credentials management, and middleware guards.

![NextAuth Security Portal mockups](/images/blogs/auth_portal.webp)

---

## Chapter 1: Setting up NextAuth Handler

First, install the library:
\`\`\`bash
npm install next-auth
\`\`\`

Create an \`auth.js\` configuration file to define your authentication options and credentials:

\`\`\`javascript
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
  }
};

export default NextAuth(authOptions);
\`\`\`

---

## Chapter 2: Protecting Routes with Middleware

You can secure pages using Next.js Middleware. Create a \`middleware.js\` file in your root folder:

\`\`\`javascript
export { default } from "next-auth/middleware";

export const config = { 
  matcher: ["/dashboard/:path*", "/admin/:path*"] 
};
\`\`\`

Any request to \`/dashboard\` or \`/admin\` will automatically redirect to the login page if the session cookie is missing or expired.`,
    category: 'Web Development',
    readTime: '8 min read',
    thumbnail: '/images/blogs/auth_portal_cover.webp',
    featured: false,
    createdAt: new Date('2025-05-19'),
    complexity: 'Intermediate',
    audioDuration: '8:15',
    tldr: [
      'NextAuth is the standard auth solution for Next.js supporting multiple OAuth providers.',
      'We configure authentication options in auth.js API handlers.',
      'Routes can be protected automatically using Next.js Middleware.'
    ],
    order: 3,
    status: 'Published',
    tags: ['Next.js', 'NextAuth', 'Authentication']
  },
  {
    title: 'MongoDB Aggregation Made Easy',
    slug: 'mongodb-aggregation-made-easy',
    description: 'A developer guide to mastering aggregation pipelines, filtering matching documents, and generating reports.',
    content: `# MongoDB Aggregation Made Easy

The MongoDB Aggregation Framework is a pipeline-based tool to transform and summarize documents. In this guide, we will analyze the key stages of aggregation pipelines and how to structure complex reporting tools.

![Database Pipeline Aggregation Infographic](/images/blogs/db_pipeline.webp)

---

## Chapter 1: The Assembly Line Concept

Think of an aggregation pipeline like an assembly line:
1. **Raw documents** enter the pipeline.
2. Each stage (**$match**, **$group**, **$project**) filters, groups, or shapes the documents.
3. Transformed, consolidated metrics exit the pipeline.

---

## Chapter 2: Essential Pipeline Stages

### 1. $match (Filtering)
Filters documents to pass only matching documents to the next stage.
\`\`\`json
{ "$match": { "status": "active" } }
\`\`\`

### 2. $group (Consolidating)
Groups documents by a key and runs accumulator functions.
\`\`\`json
{ 
  "$group": { 
    "_id": "$category", 
    "totalRevenue": { "$sum": "$price" } 
  } 
}
\`\`\`

### 3. $project (Reshaping)
Selects or adds specific fields to pass to the next stage.
\`\`\`json
{ 
  "$project": { 
    "title": 1, 
    "discountPrice": { "$multiply": ["$price", 0.9] } 
  } 
}
\`\`\`

---

## Chapter 3: Indexing and Optimization

To keep aggregations fast:
- **Filter Early:** Place **$match** at the very beginning of the pipeline to leverage database indexes and reduce document counts immediately.
- **Use $limit:** Limit results at the end to save network and memory overhead.`,
    category: 'Backend',
    readTime: '12 min read',
    thumbnail: '/images/blogs/db_pipeline_cover.webp',
    featured: false,
    createdAt: new Date('2025-05-10'),
    complexity: 'Advanced',
    audioDuration: '12:30',
    tldr: [
      'Aggregation Framework is a pipeline-based tool to transform and summarize documents.',
      '$match acts as a filter to process matching items.',
      '$group aggregates records by a key using accumulator functions.'
    ],
    order: 4,
    status: 'Published',
    tags: ['MongoDB', 'Aggregation', 'Database']
  },
  {
    title: 'Deploying MERN Apps on Render',
    slug: 'deploying-mern-render',
    description: 'A complete guide to deploy your app for free using Render.',
    content: `# Deploying MERN Apps on Render

Render is an excellent, developer-friendly alternative to Heroku for hosting full-stack applications. In this guide, we will set up automatic deployments for our MERN stack application.

![MERN Render Deployment architecture](/images/blogs/deploy_mern.webp)

---

## Chapter 1: Repository Structure

For easy deployment, organize your project in a single repository:
- \`/backend\`: Express server code
- \`/frontend\`: React Vite client code
- \`package.json\` (in root): Defines scripts to install and run both.

---

## Chapter 2: Deploying Backend (Web Service)

1. Create a new **Web Service** on Render.
2. Link your GitHub repository.
3. Configure the following build settings:
   - **Environment:** Node
   - **Build Command:** \`npm install\`
   - **Start Command:** \`node backend/server.js\`
4. Add environment variables in the **Env** tab (e.g. \`MONGODB_URI\`, \`PORT=10000\`).

---

## Chapter 3: Deploying Frontend (Static Site)

1. Create a new **Static Site** on Render.
2. Build Settings:
   - **Build Command:** \`npm run build\` (runs vite build)
   - **Publish Directory:** \`dist\` (or \`frontend/dist\`)
3. Under **Redirects/Rewrites**, add a rewrite rule from \`/*\` to \`/index.html\` to support client-side routing.`,
    category: 'Tools & DevOps',
    readTime: '7 min read',
    thumbnail: '/images/blogs/deploy_mern_cover.webp',
    featured: false,
    createdAt: new Date('2025-05-09'),
    complexity: 'Beginner',
    audioDuration: '7:05',
    tldr: [
      'MERN applications can be deployed in a single repository with nested backend/frontend folders.',
      'Deploy backend as a Web Service and supply environment variables.',
      'Deploy frontend as a Static Site with a rewrite rule to index.html for client routing.'
    ],
    order: 5,
    status: 'Published',
    tags: ['MERN', 'Deployment', 'DevOps']
  }
];

// ─── Seed Function ────────────────────────────────

const seed = async () => {
  try {
    await connectDB();
    console.log('\n🌱 Starting database seed...\n');

    // Projects
    await Project.deleteMany({});
    await Project.insertMany(PROJECTS);
    console.log(`  ✅ Seeded ${PROJECTS.length} projects (fresh seed)`);

    // Blogs
    await Blog.deleteMany({});
    await Blog.insertMany(BLOGS);
    console.log(`  ✅ Seeded ${BLOGS.length} blog posts (fresh seed)`);

    // Services
    const existingServices = await Service.countDocuments();
    if (existingServices === 0) {
      await Service.insertMany(SERVICES);
      console.log(`  ✅ Seeded ${SERVICES.length} services`);
    } else {
      console.log(`  ⏭️  Services already exist (${existingServices} found), skipping`);
    }

    // Testimonials
    const existingTestimonials = await Testimonial.countDocuments();
    if (existingTestimonials === 0) {
      await Testimonial.insertMany(TESTIMONIALS);
      console.log(`  ✅ Seeded ${TESTIMONIALS.length} testimonials`);
    } else {
      console.log(`  ⏭️  Testimonials already exist (${existingTestimonials} found), skipping`);
    }

    // TechStack — separate collection, always upsert
    const TECH_CATEGORIES = [
      {
        id: 'frontend',
        label: 'Frontend',
        emoji: '🎨',
        color: 'from-primary/10 to-accent/10',
        borderColor: 'hover:border-primary/20',
        skills: [
          { name: 'React.js', level: 90 },
          { name: 'HTML5 / CSS3', level: 95 },
          { name: 'JavaScript (ES6+)', level: 88 },
          { name: 'Tailwind CSS', level: 85 },
          { name: 'Framer Motion', level: 75 },
          { name: 'Vite', level: 80 },
          { name: 'Axios', level: 80 },
          { name: 'TanStack Query', level: 70 },
        ],
      },
      {
        id: 'backend',
        label: 'Backend',
        emoji: '⚙️',
        color: 'from-accent/10 to-primary/10',
        borderColor: 'hover:border-accent/20',
        skills: [
          { name: 'Node.js', level: 85 },
          { name: 'Express.js', level: 85 },
          { name: 'REST APIs', level: 90 },
          { name: 'Prisma ORM', level: 70 },
          { name: 'Authentication', level: 75 },
        ],
      },
      {
        id: 'database',
        label: 'Database',
        emoji: '🗄️',
        color: 'from-emerald-500/10 to-accent/10',
        borderColor: 'hover:border-emerald-500/20',
        skills: [
          { name: 'MongoDB', level: 82 },
          { name: 'PostgreSQL', level: 78 },
          { name: 'MySQL', level: 75 },
          { name: 'Oracle', level: 60 },
        ],
      },
      {
        id: 'tools',
        label: 'Tools & DevOps',
        emoji: '🛠️',
        color: 'from-pink/10 to-primary/10',
        borderColor: 'hover:border-pink/20',
        skills: [
          { name: 'Git & GitHub', level: 90 },
          { name: 'Electron.js', level: 75 },
          { name: 'Postman', level: 85 },
          { name: 'VS Code', level: 95 },
          { name: 'Google Stitch', level: 80 },
          { name: 'Google Flow', level: 85 },
          { name: 'AWS', level: 55 },
          { name: 'Vercel', level: 85 },
          { name: 'Netlify', level: 80 },
          { name: 'Render', level: 70 },
        ],
      },
      {
        id: 'languages',
        label: 'Languages',
        emoji: '💻',
        color: 'from-secondary/10 to-pink/10',
        borderColor: 'hover:border-secondary/20',
        skills: [
          { name: 'JavaScript', level: 88 },
          { name: 'Java', level: 72 },
          { name: 'Python', level: 70 },
          { name: 'C', level: 65 },
        ],
      },
    ];

    await TechStack.findOneAndUpdate(
      {},
      { $set: { categories: TECH_CATEGORIES } },
      { upsert: true, new: true }
    );
    console.log('  ✅ TechStack collection seeded/updated');

    // Profile — upsert (create if not exists, no techStack here anymore)
    const existingProfile = await Profile.findOne();
    if (!existingProfile) {
      await Profile.create({});
      console.log('  ✅ Seeded profile with defaults');
    } else {
      console.log('  ⏭️  Profile already exists, skipping');
    }
    console.log('\n✅ Seed complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
