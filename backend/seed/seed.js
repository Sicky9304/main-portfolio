import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Project from '../models/Project.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import Profile from '../models/Profile.js';

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
    github: 'https://github.com/Sicky9304/Portfolio_With_AI.git',
    demo: 'https://portfolio-with-ai-seven.vercel.app/',
    color: 'from-primary to-accent',
    emoji: '🔮',
    status: 'Completed',
    order: 0,
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
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
    order: 1,
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
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
    order: 2,
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=600&auto=format&fit=crop',
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
    order: 3,
    featured: true,
    thumbnail: '',
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
    order: 4,
    featured: true,
    thumbnail: '',
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
    thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
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

// ─── Seed Function ────────────────────────────────

const seed = async () => {
  try {
    await connectDB();
    console.log('\n🌱 Starting database seed...\n');

    // Projects
    await Project.deleteMany({});
    await Project.insertMany(PROJECTS);
    console.log(`  ✅ Seeded ${PROJECTS.length} projects (fresh seed)`);

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

    // Profile — upsert (create if not exists)
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
