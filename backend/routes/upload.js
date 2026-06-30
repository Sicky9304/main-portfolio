import { Router } from 'express';
import crypto from 'crypto';
import adminAuth from '../middleware/adminAuth.js';

const router = Router();

/**
 * POST /api/upload
 * Admin Only — Uploads a base64 image file to Cloudinary and returns its secure URL
 */
router.post('/', adminAuth, async (req, res, next) => {
  try {
    const { file } = req.body;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file data provided' });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary credentials are not configured in the server environment.',
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Sort parameters alphabetically to sign: timestamp
    const signatureStr = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

    // POST request to Cloudinary API
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file,
        api_key: apiKey,
        timestamp,
        signature,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: result.error?.message || 'Failed to upload to Cloudinary',
      });
    }

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
