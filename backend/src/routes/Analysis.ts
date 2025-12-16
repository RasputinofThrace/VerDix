import express, { Request, Response } from 'express';
import { analyzeProductImage } from '../services/ProductAnalysis';

const router = express.Router();

// POST /api/analyze - Analyze product image
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'No image provided',
      });
    }

    // Validate base64 image
    if (!image.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image format. Expected base64 data URL',
      });
    }

    console.log('📸 Received image for analysis');

    const result = await analyzeProductImage(image);

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.json(result);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;