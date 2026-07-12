import express from 'express';
import { getDepartments, createDepartment, updateDepartment } from '../controllers/departmentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getDepartments)
  .post(protect, adminOnly, createDepartment);
  
router.route('/:id')
  .put(protect, adminOnly, updateDepartment);

export default router;
