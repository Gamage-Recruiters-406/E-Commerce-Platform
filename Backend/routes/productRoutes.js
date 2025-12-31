import express from "express";
import {
  createProductController,
  updateProductController,
  deleteProductController,
  getProductsController,
} from "../controllers/productController.js";
import { isAdmin, requiredSignIn } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// routes

// CREATE PRODUCT || POST (Admin only)
router.post("/createProduct", requiredSignIn, isAdmin, createProductController);

// UPDATE PRODUCT || PUT (Admin only)
router.put(
  "/updateProduct/:id",
  requiredSignIn,
  isAdmin,
  updateProductController
);

// DELETE PRODUCT || DELETE (Admin only)
router.delete(
  "/deleteProduct/:id",
  requiredSignIn,
  isAdmin,
  deleteProductController
);

// GET ALL PRODUCTS || GET (Public)
router.get("/getProducts", getProductsController);

export default router;
