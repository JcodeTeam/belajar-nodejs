import express from 'express';
import { getSubscriptions, createSubscription, getUserSubscription, deleteSubscription} from '../controllers/Api/subscriptionController.js';
import authorize from '../middleware/authMiddleware.js';
const router = express.Router();

router.get("/", authorize, getSubscriptions);

router.post("/", authorize, createSubscription);

router.put("/:id",  );

router.get("/:id", );

router.delete("/:id", deleteSubscription);

// User Subscription

router.get("/user/:id", authorize, getUserSubscription);

export default router;
 