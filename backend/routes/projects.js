import { Router } from 'express';
import Project from '../models/Project.js';
import adminAuth from '../middleware/adminAuth.js';

const router = Router();

/**
 * GET /api/projects
 * Public — Fetch all featured projects sorted by order
 */
router.get('/', async (req, res, next) => {
  try {
    const { featured } = req.query;
    const filter = {};
    if (featured === 'true') filter.featured = true;

    const projects = await Project.find(filter).sort({ order: 1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/projects/:slug
 * Public — Fetch a single project by slug
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      const err = new Error('Project not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/projects
 * Admin — Create a new project
 */
router.post('/', adminAuth, async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    if (error.code === 11000) {
      error.message = 'A project with this slug already exists';
      error.statusCode = 400;
    }
    next(error);
  }
});

/**
 * PUT /api/projects/:slug
 * Admin — Update a project
 */
router.put('/:slug', adminAuth, async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) {
      const err = new Error('Project not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/projects/:slug
 * Admin — Delete a project
 */
router.delete('/:slug', adminAuth, async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ slug: req.params.slug });
    if (!project) {
      const err = new Error('Project not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
