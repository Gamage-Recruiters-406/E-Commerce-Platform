import Order from "../models/order.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

// POST /orders - Customer places an order
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderItems } = req.body;

    // Validation
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Order items are required and must be a non-empty array",
      });
    }

    // Validate each order item
    for (const item of orderItems) {
      if (!item.product || !item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Each order item must have a product ID and quantity",
        });
      }

      if (item.quantity <= 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Quantity must be greater than 0",
        });
      }
    }

    let totalAmount = 0;
    const processedOrderItems = [];

    // Process each order item
    for (const item of orderItems) {
      // Find product with lock to handle concurrency (using session)
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found`,
        });
      }

      // Check stock availability
      if (product.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product "${product.name}". Available: ${product.quantity}, Requested: ${item.quantity}`,
        });
      }

      // Decrease stock quantity
      product.quantity -= item.quantity;
      await product.save({ session });

      // Calculate item total
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      // Add to processed order items
      processedOrderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create the order
    const order = new Order({
      user: req.user._id,
      orderItems: processedOrderItems,
      totalAmount,
    });

    await order.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};
