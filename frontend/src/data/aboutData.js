// Static data for the /about page
export const aboutData = {
  hero: {
    greeting: "Hi, I'm",
    name: "Sicky Kumar",
    subtitle: "Full Stack MERN Developer passionate about building modern web applications with React, Node.js, Express.js, MongoDB and AI.",
    ctaProjects: "View Projects",
    ctaProjectsHref: "/#projects",
    ctaContact: "Contact Me",
    ctaContactHref: "/contact",
    image: "/src/assets/hero.png"
  },
  aboutMe: {
    title: "About Me",
    subtitle: "Passionate developer building user-centric, high-performance web applications.",
    paragraphs: [
      "I am a Full Stack MERN Developer specializing in building high-performance web applications using MongoDB, Express.js, React, and Node.js. With a strong command over JavaScript (ES6+), I focus on writing clean, modular, and reusable code while designing scalable database structures and optimized APIs. I take pride in engineering systems that integrate robust backend logic with premium, interactive user experiences.",
      "In addition to full-stack engineering, I have a deep interest in modern AI-assisted web development. I actively explore ways to integrate Gemini AI models to build intelligent features like translation layers, automated content generators, and conversational agents. My focus is on utilizing state-of-the-art tools to streamline processes, solve complex problems, and add advanced user features to applications.",
      "Driven by an attitude of continuous learning, I constantly upgrade my technical abilities to match industry standards. Whether it is refining search algorithms, analyzing system architectures, or practicing problem-solving on coding platforms, I enjoy diving deep into technical challenges. I thrive in collaborative environments where creating robust software and delivering high-value user products are the top priorities."
    ]
  },
  educationSummary: {
    title: "Education Summary",
    subtitle: "A quick overview of my academic milestones.",
    cards: [
      {
        id: "edu-3",
        level: "B.Tech CSE (Lateral Entry)",
        period: "2024 – Present",
        institution: "MCKV Institute of Engineering, West Bengal",
        performance: "Current CGPA: 8.69 / 10",
        status: "Pursuing",
        color: "from-accent/10 to-pink/10"
      },
      {
        id: "edu-2",
        level: "Diploma in CST",
        period: "2020 – 2023",
        institution: "Technique Polytechnic Institute, West Bengal",
        performance: "CGPA: 9.00 / 10",
        status: "Completed",
        color: "from-secondary/10 to-accent/10"
      },
      {
        id: "edu-1",
        level: "Class 10",
        period: "2018 – 2019",
        institution: "Bandel Mahatma Gandhi Hindi Vidyalaya, West Bengal",
        performance: "Percentage: 51.57%",
        status: "Completed",
        color: "from-primary/10 to-secondary/10"
      }
    ]
  },
  achievements: {
    title: "Key Milestones",
    subtitle: "A metrics-driven look at my journey.",
    cards: [
      { id: "ach-1", label: "Projects Completed", value: 30, suffix: "+", color: "from-emerald-500/10 to-primary/10" },
      { id: "ach-2", label: "GitHub Contributions", value: 500, suffix: "+", color: "from-cyan-500/10 to-secondary/10" },
      { id: "ach-3", label: "Technologies Mastered", value: 10, suffix: "+", color: "from-violet-500/10 to-accent/10" },
      { id: "ach-4", label: "Technical Blogs Published", value: 5, suffix: "+", color: "from-rose-500/10 to-pink/10" },
      { id: "ach-5", label: "Open Source Contribs", value: 12, suffix: "+", color: "from-amber-500/10 to-orange-500/10" },
      { id: "ach-6", label: "AI & Innovation Focus", value: 100, suffix: "%", color: "from-blue-500/10 to-indigo-500/10" }
    ]
  },
  techStack: {
    title: "Core Tech Stack",
    subtitle: "The tools, languages, and technologies I use to bring ideas to life.",
    categories: [
      {
        id: "frontend",
        label: "Frontend",
        skills: [
          { name: "React.js", icon: "Code2" },
          { name: "HTML5 & CSS3", icon: "Layout" },
          { name: "JavaScript (ES6+)", icon: "FileJson" },
          { name: "Tailwind CSS", icon: "Layers" },
          { name: "Framer Motion", icon: "Zap" },
          { name: "Vite", icon: "Flame" }
        ]
      },
      {
        id: "backend",
        label: "Backend",
        skills: [
          { name: "Node.js", icon: "Server" },
          { name: "Express.js", icon: "Cpu" },
          { name: "REST APIs", icon: "Network" },
          { name: "Authentication (JWT)", icon: "Lock" },
          { name: "Prisma ORM", icon: "Database" }
        ]
      },
      {
        id: "database",
        label: "Database",
        skills: [
          { name: "MongoDB", icon: "Database" },
          { name: "PostgreSQL", icon: "Database" },
          { name: "MySQL", icon: "Database" },
          { name: "Oracle", icon: "Database" }
        ]
      },
      {
        id: "tools",
        label: "Tools & DevOps",
        skills: [
          { name: "Git & GitHub", icon: "Github" },
          { name: "VS Code", icon: "Terminal" },
          { name: "Postman", icon: "FileText" },
          { name: "Vite config", icon: "Flame" }
        ]
      },
      {
        id: "cloud",
        label: "Cloud & Deployments",
        skills: [
          { name: "AWS", icon: "Cloud" },
          { name: "Vercel", icon: "Globe" },
          { name: "Netlify", icon: "Globe" },
          { name: "Render / Railway", icon: "Server" }
        ]
      },
      {
        id: "ai",
        label: "AI Technologies",
        skills: [
          { name: "Gemini 2.5 Flash", icon: "Sparkles" },
          { name: "AI Chat Integrations", icon: "MessageSquare" },
          { name: "Devanagari Translation", icon: "Languages" },
          { name: "AI Ghostwriting", icon: "FileText" }
        ]
      }
    ]
  },
  cta: {
    title: "Let's Build Something Amazing Together",
    subtitle: "I am always open to discussing new web development projects, creative ideas, or opportunities to be part of your visions.",
    btnContact: "Contact Me",
    btnContactHref: "/contact",
    btnResume: "Download Resume",
    btnResumeHref: "/api/profile/resume"
  }
};
