import { Router } from 'express';
import TechStack from '../models/TechStack.js';
import adminAuth from '../middleware/adminAuth.js';

const router = Router();

/**
 * GET /api/techstack
 * Public — Fetch the full tech stack (singleton document)
 */
router.get('/', async (req, res, next) => {
  try {
    let doc = await TechStack.findOne();
    if (!doc) {
      doc = await TechStack.create({ categories: [] });
    }
    res.json({ success: true, data: doc.categories });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/techstack
 * Admin — Replace full techStack categories
 */
router.put('/', adminAuth, async (req, res, next) => {
  try {
    const { categories } = req.body;
    if (!Array.isArray(categories)) {
      const err = new Error('categories must be an array');
      err.statusCode = 400;
      throw err;
    }

    const doc = await TechStack.findOneAndUpdate(
      {},
      { $set: { categories } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: doc.categories });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/techstack/:categoryId/skills
 * Admin — Add a single skill to a specific category
 */
router.post('/:categoryId/skills', adminAuth, async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name, level } = req.body;

    if (!name || level === undefined) {
      const err = new Error('name and level are required');
      err.statusCode = 400;
      throw err;
    }

    let doc = await TechStack.findOne();
    if (!doc) doc = await TechStack.create({ categories: [] });

    const cat = doc.categories.find(c => c.id === categoryId);
    if (!cat) {
      const err = new Error(`Category "${categoryId}" not found`);
      err.statusCode = 404;
      throw err;
    }

    cat.skills.push({ name: name.trim(), level: Number(level) });
    await doc.save();

    res.status(201).json({ success: true, data: doc.categories });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/techstack/:categoryId/skills/:skillIndex
 * Admin — Remove a skill from a category by index
 */
router.delete('/:categoryId/skills/:skillIndex', adminAuth, async (req, res, next) => {
  try {
    const { categoryId, skillIndex } = req.params;
    const idx = Number(skillIndex);

    let doc = await TechStack.findOne();
    if (!doc) {
      const err = new Error('TechStack not found');
      err.statusCode = 404;
      throw err;
    }

    const cat = doc.categories.find(c => c.id === categoryId);
    if (!cat || idx < 0 || idx >= cat.skills.length) {
      const err = new Error('Skill not found');
      err.statusCode = 404;
      throw err;
    }

    cat.skills.splice(idx, 1);
    await doc.save();

    res.json({ success: true, data: doc.categories });
  } catch (error) {
    next(error);
  }
});

export default router;
