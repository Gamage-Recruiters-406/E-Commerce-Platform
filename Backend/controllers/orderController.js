<<<<<<< HEAD
import Order from '../models/order.js';

// Get customer's own orders
// GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
    try {
        
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query - Only orders belonging to logged-in user
        const query = { user: req.user._id };

        // Filter by status if provided
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Date range filter
        if (req.query.fromDate || req.query.toDate) {
            query.createdAt = {};
            if (req.query.fromDate) {
                query.createdAt.$gte = new Date(req.query.fromDate);
            }
            if (req.query.toDate) {
                query.createdAt.$lte = new Date(req.query.toDate);
            }
        }

        // Sorting
        let sortBy = { createdAt: -1 };
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sortBy = { [parts[0]]: parts[1] === 'asc' ? 1 : -1 };
        }

        // Execute query with population
        const orders = await Order.find(query)
            .populate('orderItems.product', 'name price category image')
            .sort(sortBy)
            .limit(limit)
            .skip(skip)
            .lean();

        // Get total count for pagination
        const total = await Order.countDocuments(query);

        // Calculate user statistics
        const stats = await Order.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            statistics: stats[0] || { totalSpent: 0, totalOrders: 0 },
            data: orders
        });

    } catch (error) {
        
        console.error('Error in getMyOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your orders',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });

    }
};

// Get all orders (Admin only)
// GET /api/admin/orders
export const getAllOrders = async (req, res) => {
    try {
        
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query
        const query = {};

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Filter by specific user
        if (req.query.userId) {
            query.user = req.query.userId;
        }

        // Date range filter
        if (req.query.fromDate || req.query.toDate) {
            query.createdAt = {};
            if (req.query.fromDate) {
                query.createdAt.$gte = new Date(req.query.fromDate);
            }
            if (req.query.toDate) {
                query.createdAt.$lte = new Date(req.query.toDate);
            }
        }

        // Sorting
        let sortBy = { createdAt: -1 };
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sortBy = { [parts[0]]: parts[1] === 'asc' ? 1 : -1 };
        }

        // Execute query with population
        const orders = await Order.find(query)
            .populate('user', 'name email role')
            .populate('orderItems.product', 'name price category image')
            .sort(sortBy)
            .limit(limit)
            .skip(skip)
            .lean();
        
        // Get total count
        const total = await Order.countDocuments(query);

        // Calculate platform statistics
        const stats = await Order.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    averageOrderValue: { $avg: '$totalAmount' },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        // Get order status breakdown
        const statusBreakdown = await Order.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            statistics: stats[0] || {
                totalRevenue: 0,
                averageOrderValue: 0,
                totalOrders: 0
            },
            statusBreakdown,
            data: orders
        });

    } catch (error) {
        
        console.error('Error in getAllOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });

    }
};
=======
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
>>>>>>> f3b1daa99ce0f48efcad72faee81407bf8c7e992
