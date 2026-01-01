import express from "express";
import { createOrder } from "../controllers/orderController.js";
import { requiredSignIn } from "../middlewares/AuthMiddleware.js";
import { validateOrder } from "../middlewares/validationMiddleware.js";

const router = express.Router();

// Customer routes - requires authentication
router.post("/orders", requiredSignIn, validateOrder, createOrder);

export default router;
