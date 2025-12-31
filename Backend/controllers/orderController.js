import Order from '../models/Order.js'

// Get customer's orders (Customer view)
export const getMyOrders = async (req, res) => {
    try {
        
        // Get customer ID from JWT token
        const customerId = req.user.customerId;

        // Extract query parametrs 
        const options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            status: req.query.status,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc'
        };

        // Call service layer
        const result = await orderService.getCustomerOrder(customerId, options);

        res.status(200).json({
            success: true,
            message: 'Order retrieved successfully',
            count: result.orders.length,
            data: result
        });

    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve orders',
            error: error.message
        });
    }
};

// Get all orders (Admin view)
export const getAllOrders = async (req, res) => {
    try {
        
        // Extract query parameters
        const options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            status: req.query.status,
            customerId: req.query.customerId,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc',
            minAmount: req.query.minAmount,
            maxAmount: req.query.maxAmount
        };

        // call server layer
        const result = await orderService.getAllOrders(options);

        res.status(200).json({
            success: true,
            message: 'All orders retrieved successfully',
            count: result.orders.length,
            data: result
        });
        
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
};