import express from 'express';
import { getSubscriptions, createSubscription, getUserSubscription, deleteSubscription} from '../controllers/Api/subscriptionController.js';
import authorize from '../middleware/authMiddleware.js';
const router = express.Router();

router.get("/", authorize, getSubscriptions);

router.get("/:id", );

router.post("/", authorize, createSubscription);

router.put("/:id",  );

router.delete("/:id", authorize, deleteSubscription);

// User Subscription

router.get("/user/:id", authorize, getUserSubscription);

router.put('/:id/cancel', (req, res) => res.send({ title: 'CANCEL subscription' }));

router.get('/upcoming-renewals', (req, res) => res.send({ title: 'GET upcoming renewals' }));

export default router;
 