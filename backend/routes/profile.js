import { Router } from 'express';
import Profile from '../models/Profile.js';
import adminAuth from '../middleware/adminAuth.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = Router();

/**
 * GET /api/profile/resume
 * Public — Stream the resume PDF directly from MongoDB
 */
router.get('/resume', async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    if (!profile || !profile.resumeBase64) {
      // Fallback redirect to static file
      return res.redirect('/resume.pdf');
    }

    const pdfBuffer = Buffer.from(profile.resumeBase64, 'base64');
    res.setHeader('Content-Type', profile.resumeMimeType || 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/profile/architecture
 * Public — Fetch the system architecture markdown content
 */
router.get('/architecture', async (req, res, next) => {
  try {
    const agentsPath = path.resolve(__dirname, '../../.agents/AGENTS.md');
    const content = await fs.readFile(agentsPath, 'utf8');
    res.json({ success: true, markdown: content });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/profile
 * Public — Fetch the profile data (single document)
 */
router.get('/', async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/profile
 * Admin — Update the profile (upsert)
 */
router.put('/', adminAuth, async (req, res, next) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
});

export default router;
