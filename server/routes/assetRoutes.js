import express from 'express';
import { getAssets, getAssetById, createAsset, updateAssetStatus } from '../controllers/assetController.js';
import { protect, assetManagerOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getAssets)
  .post(protect, assetManagerOrAdmin, createAsset);

router.route('/:id')
  .get(protect, getAssetById);

router.route('/:id/status')
  .put(protect, assetManagerOrAdmin, updateAssetStatus);

export default router;
