import express from "express";
import { signup, signin, signout } from "../controllers/authController.js";
import authorize from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/sign-up", signup);

router.post("/sign-in", signin);

router.post("/sign-out", authorize, signout);

export default router;