<<<<<<< HEAD
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
=======
import express from "express";
import { createOrder } from "../controllers/orderController.js";
import { requiredSignIn } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Customer routes - requires authentication
router.post("/orders", requiredSignIn, createOrder);

export default router;
>>>>>>> f3b1daa99ce0f48efcad72faee81407bf8c7e992
