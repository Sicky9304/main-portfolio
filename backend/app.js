import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import errorHandler from './middleware/errorHandler.js';

import projectRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js';
import profileRoutes from './routes/profile.js';
import serviceRoutes from './routes/services.js';
import testimonialRoutes from './routes/testimonials.js';
import uploadRoutes from './routes/upload.js';

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
   cb(new Error('Not allowed by CORS'));
 },
 credentials:true,
 methods:['GET','POST','PUT','PATCH','DELETE']
}));

app.use(express.json({limit:'10mb'}));

const apiLimiter=rateLimit({
 windowMs:15*60*1000,
 max:100,
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

app.use('/api/projects',projectRoutes);
app.use('/api/contact',contactLimiter,contactRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/services',serviceRoutes);
app.use('/api/testimonials',testimonialRoutes);
app.use('/api/upload',uploadRoutes);

app.use((req,res)=>{
 res.status(404).json({success:false,message:`Route ${req.originalUrl} not found`});
});

app.use(errorHandler);

export default app;
