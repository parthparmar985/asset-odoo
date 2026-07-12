import express from 'express';
import { createAuditCycle, getAuditCycles } from '../controllers/auditController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getAuditCycles)
  .post(protect, adminOnly, createAuditCycle);

export default router;
