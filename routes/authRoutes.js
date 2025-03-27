import express from "express";
import { signup, signin, signout, forgotPassword, resetPassword, verifyOTP } from "../controllers/authController.js";
import authorize from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/sign-up", signup);

router.post("/sign-in", signin);

router.post("/sign-out", authorize, signout);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/verify-otp", verifyOTP);

// router.get("/sign-in", getSignin);

// router.get("/sign-up", getSignup);

// router.get("/reset-password/:token", getResetPassword);

// router.get("/forgot-password", getForgotPassword);

export default router;