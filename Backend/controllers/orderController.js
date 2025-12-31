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