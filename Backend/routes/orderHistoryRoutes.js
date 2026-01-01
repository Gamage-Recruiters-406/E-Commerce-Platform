import express from 'express';
import { 
    getMyOrderHistory, 
    getAllOrderHistory 
} from '../controllers/orderHistoryController.js';
import { requiredSignIn, isAdmin } from '../middlewares/AuthMiddleware.js'

const router = express.Router();

// Customer route - Get my order history
router.get('/my-orders', requiredSignIn, getMyOrderHistory);

// Admin route - Get all order history
router.get('/admin/orders', requiredSignIn, isAdmin, getAllOrderHistory);

export default router;