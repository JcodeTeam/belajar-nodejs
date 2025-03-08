import express from 'express';
import { index, store, update, show, destroy } from '../../controllers/Api/contactController.js';
import Middleware from '../../middleware/middleware.js';
import authorize from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", authorize, index);

router.post("/", authorize, Middleware.validateContact, store);

router.put("/:id", authorize, Middleware.validateUpdate, update);

router.get("/:id", authorize, show);

router.delete("/:id", authorize, destroy);

export default router;
