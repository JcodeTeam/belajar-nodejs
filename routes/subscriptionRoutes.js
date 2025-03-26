import express from 'express';
import { getSubscriptions, createSubscription, getUserSubscription, cancelSubscription } from '../controllers/Api/subscriptionController.js';
import authorize from '../middleware/authMiddleware.js';
const router = express.Router();

router.get("/", getSubscriptions);

// User Subscription

router.post("/", authorize, createSubscription);

router.put("/:id/cancel", authorize, cancelSubscription);

router.get("/user/:id", authorize, getUserSubscription);

router.get('/upcoming-renewals', (req, res) => res.send({ title: 'GET upcoming renewals' }));

export default router;
 