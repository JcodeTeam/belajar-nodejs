import express from 'express';
import { index, create, store, show, edit, update, destroy} from '../controllers/contactController.js';
import Middleware from '../middleware/middleware.js';

const router = express.Router();

router.get("/", index);

router.get("/tambah", create);
router.post("/", Middleware.validateContact, store);

router.get("/edit/:id", edit);
router.put("/:id", Middleware.validateUpdate, update);

router.get("/:id", show);

router.delete("/:id", destroy);

export default router;
