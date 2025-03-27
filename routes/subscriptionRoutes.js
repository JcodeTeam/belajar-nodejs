import express from 'express';
import { createSubscription, getUserSubscription, cancelSubscription, upcomingRenewals } from '../controllers/Api/subscriptionController.js';
import authorize from '../middleware/authMiddleware.js';
const router = express.Router();

// User Subscription

router.post("/", authorize, createSubscription);

router.put("/:id/cancel", authorize, cancelSubscription);

router.get("/user", authorize, getUserSubscription);

router.get('/upcoming-renewals', authorize, upcomingRenewals);

export default router;
 