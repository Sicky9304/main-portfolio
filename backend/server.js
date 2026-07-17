import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT=process.env.PORT||5000;

async function start(){
 try{
   await connectDB();
    const server=app.listen(PORT,()=>{
      console.log(`Server running on ${PORT}`);
    });

    // Start background post scheduler
    const { startScheduler } = await import('./utils/scheduler.js');
    startScheduler();

    const shutdown=()=>{
      console.log('Gracefully shutting down...');
      server.close(()=>process.exit(0));
    };

    if (process.platform !== 'win32') {
      process.on('SIGINT',shutdown);
      process.on('SIGTERM',shutdown);
    }

 }catch(err){
   console.error(err);
   process.exit(1);
 }
}
// Trigger server watch reload to load new env variables
start();
