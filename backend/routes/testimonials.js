import { Router } from 'express';
import Testimonial from '../models/Testimonial.js';

const router = Router();

/**
 * GET /api/testimonials
 * Public — Fetch all testimonials sorted by order
 */
router.get('/', async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/testimonials
 * Admin — Create a testimonial
 */
router.post('/', async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/testimonials/:id
 * Admin — Update a testimonial
 */
router.put('/:id', async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!testimonial) {
      const err = new Error('Testimonial not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/testimonials/:id
 * Admin — Delete a testimonial
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      const err = new Error('Testimonial not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
