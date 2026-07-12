import express from 'express';
import { registerUser, authUser, updateUserRole, getUsers } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/').get(protect, adminOnly, getUsers);
router.route('/:id/role').put(protect, adminOnly, updateUserRole);

export default router;
