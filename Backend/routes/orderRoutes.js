import express from 'express';
import {
    getMyOrders,
    getAllOrders
} from "../controllers/orderController.js";

// create route object
const router = express.Router();