import express from 'express';
import { createMaintenanceRequest, updateMaintenanceStatus, getMaintenanceRequests } from '../controllers/maintenanceController.js';
import { protect, assetManagerOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMaintenanceRequests)
  .post(protect, createMaintenanceRequest);

router.route('/:id/status')
  .put(protect, assetManagerOrAdmin, updateMaintenanceStatus);

export default router;
