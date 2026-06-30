import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Sicky Kumar' },
    title: { type: String, default: 'Full-Stack Developer' },
    description: {
      type: String,
      default:
        'Building scalable SaaS products and modern web experiences with React, Node.js, and cutting-edge technologies.',
    },
    location: { type: String, default: 'West Bengal, India' },
    email: { type: String, default: 'sickykumar01@gmail.com' },
    available: { type: Boolean, default: true },

    // Hero typing animation roles
    roles: {
      type: [String],
      default: [
        'Full-Stack MERN Developer',
        'React.js Specialist',
        'Backend Engineer',
        'Problem Solver',
      ],
    },

    // About section
    aboutText: {
      type: String,
      default:
        'I enjoy solving complex problems, writing clean code, and building applications that provide a seamless user experience. I focus on React frontends, Node.js/Express backends, and databases like MongoDB, PostgreSQL, and MySQL.',
    },
    aboutSubText: {
      type: String,
      default:
        'Currently pursuing B.Tech in Computer Science with a strong foundation in software engineering, RESTful API design, and database architecture. Actively seeking opportunities to contribute technical expertise while growing as a professional engineer.',
    },

    stats: {
      type: [
        {
          icon: { type: String },
          value: { type: String },
          label: { type: String },
        },
      ],
      default: [
        { icon: 'FolderGit2', value: '30+', label: 'Projects Built' },
        { icon: 'Code2', value: '500+', label: 'GitHub Contributions' },
        { icon: 'Target', value: '10+', label: 'Technologies' },
        { icon: 'Award', value: '8.69', label: 'CGPA' },
      ],
    },

    education: {
      type: [
        {
          period: String,
          degree: String,
          school: String,
          grade: String,
          current: { type: Boolean, default: false },
        },
      ],
      default: [
        {
          period: '2024 – 2027',
          degree: 'B.Tech in Computer Science & Engineering',
          school: 'MCKV Institute of Engineering, West Bengal',
          grade: 'CGPA: 8.69 / 10 (till 5th Sem)',
          current: true,
        },
        {
          period: '2020 – 2023',
          degree: 'Diploma in Computer Science & Technology',
          school: 'Technique Polytechnic Institute, West Bengal',
          grade: 'CGPA: 9.0 / 10',
          current: false,
        },
        {
          period: '2018 – 2019',
          degree: 'Secondary Education (Class 10)',
          school: 'Bandel Mahatma Gandhi Hindi Vidyalaya, West Bengal',
          grade: 'Percentage: 51.57%',
          current: false,
        },
      ],
    },

    funFacts: {
      type: [String],
      default: [
        '🎯 Regular DSA practice on LeetCode',
        '☕ Fueled by coffee & curiosity',
        '🌍 Experience deploying on AWS, Vercel, Netlify',
        '📚 Lifelong learner & open-source contributor',
        '🔥 20+ GitHub repositories',
      ],
    },

    // GitHub section data
    githubStats: {
      type: {
        repos: { type: String, default: '20' },
        reposSuffix: { type: String, default: '+' },
        contributions: { type: String, default: '500' },
        contributionsSuffix: { type: String, default: '+' },
        stars: { type: String, default: '15' },
        starsSuffix: { type: String, default: '+' },
        forks: { type: String, default: '10' },
        forksSuffix: { type: String, default: '+' },
      },
      default: {},
    },

    languages: {
      type: [
        {
          name: String,
          percentage: Number,
          color: String,
        },
      ],
      default: [
        { name: 'JavaScript', percentage: 45, color: '#F7DF1E' },
        { name: 'Java', percentage: 20, color: '#ED8B00' },
        { name: 'Python', percentage: 15, color: '#3776AB' },
        { name: 'HTML/CSS', percentage: 12, color: '#E34F26' },
        { name: 'C', percentage: 8, color: '#555555' },
      ],
    },

    featuredRepos: {
      type: [
        {
          name: String,
          desc: String,
          lang: String,
          stars: Number,
          forks: Number,
        },
      ],
      default: [
        { name: 'e-learning-platform', desc: 'Full-stack e-learning platform', lang: 'JavaScript', stars: 3, forks: 1 },
        { name: 'agriconnect', desc: 'Farmer-to-market platform', lang: 'JavaScript', stars: 2, forks: 1 },
        { name: 'world-art-gallery', desc: 'Art collection browser', lang: 'JavaScript', stars: 4, forks: 2 },
        { name: 'news-portal', desc: 'Real-time news aggregator', lang: 'JavaScript', stars: 1, forks: 0 },
      ],
    },

    socialLinks: {
      type: [
        {
          platform: String,
          url: String,
          handle: String,
        },
      ],
      default: [
        { platform: 'GitHub', url: 'https://github.com/Sicky9304', handle: '@Sicky9304' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/sickykumar', handle: '/in/sickykumar' },
        { platform: 'LeetCode', url: 'https://leetcode.com/u/Sicky9304', handle: '@Sicky9304' },
        { platform: 'Email', url: 'mailto:sickykumar01@gmail.com', handle: 'sickykumar01@gmail.com' },
      ],
    },
    resumeBase64: {
      type: String,
      default: '',
    },
    resumeMimeType: {
      type: String,
      default: 'application/pdf',
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
