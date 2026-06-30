import { Router } from 'express';
import Service from '../models/Service.js';

const router = Router();

/**
 * GET /api/services
 * Public — Fetch all services sorted by order
 */
router.get('/', async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/services
 * Admin — Create a service
 */
router.post('/', async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/services/:id
 * Admin — Update a service
 */
router.put('/:id', async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      const err = new Error('Service not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/services/:id
 * Admin — Delete a service
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      const err = new Error('Service not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
