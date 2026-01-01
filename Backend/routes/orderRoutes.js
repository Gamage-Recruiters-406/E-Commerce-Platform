import express from "express";
import { createOrder } from "../controllers/orderController.js";
import { requiredSignIn } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Customer routes - requires authentication
router.post("/orders", requiredSignIn, createOrder);

export default router;
