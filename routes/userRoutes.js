import express from 'express';
import { getUsers, getUser} from '../controllers/userController.js';
import authorize from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", getUsers);

router.get("/:id", authorize, getUser);

export default router;
