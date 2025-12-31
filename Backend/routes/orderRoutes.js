import express from 'express';
import {
    getMyOrders,
    getAllOrders
} from "../controllers/orderController.js";

// create route object
const router = express.Router();

import { protect, adminOnly } from '../middleware/authMiddleware';

// Customer route
router.get('/my-orders', protect, getMyOrders);

// Admin route
router.get('/admin/orders', protect, adminOnly, getAllOrders);

export default router;