import express from 'express';
import { getCategories, createCategory, updateCategory } from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCategories)
  .post(protect, adminOnly, createCategory);

router.route('/:id')
  .put(protect, adminOnly, updateCategory);

export default router;
