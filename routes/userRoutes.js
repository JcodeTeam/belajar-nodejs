import express from 'express';
import { getUsers, getUserProfile } from '../controllers/userController.js';
import authorize from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", authorize, getUserProfile);

export default router;
