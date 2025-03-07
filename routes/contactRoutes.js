import express from 'express';
import contactController from '../controllers/contactController.js';
import Middleware from '../middleware/middleware.js';

const router = express.Router();

router.get("/", contactController.index);

router.get("/tambah", contactController.create);
router.post("/", Middleware.validateContact, contactController.store);

router.get("/edit/:id", contactController.edit);
router.put("/:id", Middleware.validateUpdate, contactController.update);

router.get("/:id", contactController.show);

router.delete("/:id", contactController.destroy);

export default router;
