import express from 'express';
import { getSubscriptions, createSubscription, getUserSubscription} from '../controllers/Api/subscriptionController.js';
import authorize from '../middleware/authMiddleware.js';
const router = express.Router();

router.get("/", getSubscriptions);

router.post("/", authorize, createSubscription);

router.put("/:id",  );

router.get("/:id", );

router.delete("/:id", );

// User Subscription

router.get("/user/:id", authorize, getUserSubscription);

export default router;
 