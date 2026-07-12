import express from 'express';
import { registerUser, authUser, updateUser, getUsers } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/').get(protect, getUsers);
router.route('/users').get(protect, getUsers);
router.route('/:id').put(protect, adminOnly, updateUser);

export default router;
