import express from "express";
import { sendReminders } from "../controllers/Api/workflowController.js";

const router = express.Router();


router.post("/reminder", sendReminders);

export default router;