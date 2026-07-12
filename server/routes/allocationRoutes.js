import express from 'express';
import { createAllocation, returnAsset, getAllocations } from '../controllers/allocationController.js';
import { protect, assetManagerOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getAllocations)
  .post(protect, assetManagerOrAdmin, createAllocation);

router.route('/:id/return')
  .put(protect, assetManagerOrAdmin, returnAsset);

export default router;
