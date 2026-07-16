import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import axios from 'axios';

import errorHandler from './middleware/errorHandler.js';

import projectRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js';
import profileRoutes from './routes/profile.js';
import serviceRoutes from './routes/services.js';
import testimonialRoutes from './routes/testimonials.js';
import uploadRoutes from './routes/upload.js';
import blogRoutes from './blog/blogs.js';
import aiRoutes from './routes/ai.js';
import techStackRoutes from './routes/techstack.js';
import instagramRoutes from './routes/instagram.js';
import authInstagramRoutes from './routes/authInstagram.js';
import Blog from './blog/Blog.js';
import Project from './models/Project.js';

const app=express();

app.set('trust proxy',1);

app.use(helmet());
app.use(compression());

const allowed=(process.env.CORS_ORIGIN||'')
.split(',')
.map(v=>v.trim())
.filter(Boolean);

app.use(cors({
 origin(origin,cb){
   if(!origin) return cb(null,true);
   if(allowed.includes(origin)) return cb(null,true);
   // Allow any localhost port in development mode
   if(process.env.NODE_ENV==='development' && /^http:\/\/localhost:\d+$/.test(origin)){
     return cb(null,true);
   }
   cb(new Error('Not allowed by CORS'));
 },
 credentials:true,
 methods:['GET','POST','PUT','PATCH','DELETE']
}));

app.use(express.json({limit:'10mb'}));

const apiLimiter=rateLimit({
 windowMs:15*60*1000,
 max:process.env.NODE_ENV==='development' ? 10000 : 100,
 standardHeaders:true,
 legacyHeaders:false
});

const contactLimiter=rateLimit({
 windowMs:60*60*1000,
 max:5
});

app.use('/api',apiLimiter);

app.get('/',(_,res)=>res.json({success:true,message:'Server running'}));
app.get('/api/health',(_,res)=>res.json({success:true}));

app.get('/sitemap.xml', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'Published' }).select('slug updatedAt');
    const projects = await Project.find().select('slug updatedAt');
    const currentDate = new Date().toISOString().split('T')[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Homepage
    xml += `  <url>\n    <loc>https://sickykumar.in/</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    
    // Static Pages
    xml += `  <url>\n    <loc>https://sickykumar.in/about</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    
    xml += `  <url>\n    <loc>https://sickykumar.in/education</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    
    xml += `  <url>\n    <loc>https://sickykumar.in/projects</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    
    xml += `  <url>\n    <loc>https://sickykumar.in/blog</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    
    xml += `  <url>\n    <loc>https://sickykumar.in/architecture</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
    
    // Dynamic Blogs
    blogs.forEach(b => {
      const bDate = b.updatedAt ? b.updatedAt.toISOString().split('T')[0] : currentDate;
      xml += `  <url>\n    <loc>https://sickykumar.in/blog/${b.slug}</loc>\n    <lastmod>${bDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    });
    
    // Dynamic Projects
    projects.forEach(p => {
      const pDate = p.updatedAt ? p.updatedAt.toISOString().split('T')[0] : currentDate;
      xml += `  <url>\n    <loc>https://sickykumar.in/projects/${p.slug}</loc>\n    <lastmod>${pDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });
    
    xml += `</urlset>`;
    
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

app.use('/auth', authInstagramRoutes);

app.use('/api/projects',projectRoutes);
app.use('/api/contact',contactLimiter,contactRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/services',serviceRoutes);
app.use('/api/testimonials',testimonialRoutes);
app.use('/api/upload',uploadRoutes);
app.use('/api/blogs',blogRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/techstack', techStackRoutes);
app.use('/api/instagram', instagramRoutes);

app.use((req,res)=>{
 res.status(404).json({success:false,message:`Route ${req.originalUrl} not found`});
});

app.use(errorHandler);

export default app;
