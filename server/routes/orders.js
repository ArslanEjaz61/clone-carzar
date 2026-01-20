const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create new order
router.post('/', async (req, res) => {
    try {
        const {
            orderNumber,
            customer,
            items,
            subtotal,
            shipping,
            total,
            paymentMethod,
            transactionId,
            notes
        } = req.body;

        console.log('Creating order:', orderNumber);

        // Create order
        const order = new Order({
            orderNumber,
            customer,
            items,
            subtotal,
            shipping,
            total,
            paymentMethod,
            transactionId: transactionId || null,
            notes: notes || '',
            paymentStatus: 'pending',
            orderStatus: 'pending'
        });

        await order.save();
        console.log('Order saved successfully:', orderNumber);

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// Get all orders (Admin)
router.get('/', async (req, res) => {
    try {
        const { status, payment, limit = 50, page = 1 } = req.query;

        let query = {};

        if (status && status !== 'all') {
            query.orderStatus = status;
        }

        if (payment) {
            query.paymentMethod = payment;
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const totalCount = await Order.countDocuments(query);

        res.json({
            success: true,
            data: orders,
            pagination: {
                total: totalCount,
                page: parseInt(page),
                pages: Math.ceil(totalCount / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

// Get order stats (Admin Dashboard) - MUST be before /:id route
router.get('/stats/summary', async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
        const confirmedOrders = await Order.countDocuments({ orderStatus: 'confirmed' });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });

        const totalRevenue = await Order.aggregate([
            { $match: { paymentStatus: 'verified' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                totalOrders,
                pendingOrders,
                confirmedOrders,
                deliveredOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                recentOrders
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats',
            error: error.message
        });
    }
});

// Get order by order number - MUST be before /:id route
router.get('/number/:orderNumber', async (req, res) => {
    try {
        const order = await Order.findOne({ orderNumber: req.params.orderNumber });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error.message
        });
    }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error.message
        });
    }
});

// Update order status (Admin) - Also returns notification info
router.patch('/:id/status', async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const { generateCustomerWhatsAppUrl } = require('../utils/notifications');

        const updateData = {};
        if (orderStatus) updateData.orderStatus = orderStatus;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Generate notification info for confirmed/shipped/delivered
        let notification = null;
        if (['confirmed', 'shipped', 'delivered'].includes(orderStatus)) {
            const whatsappInfo = generateCustomerWhatsAppUrl(order, orderStatus);
            notification = {
                whatsappUrl: whatsappInfo.url,
                customerPhone: whatsappInfo.phone,
                customerEmail: order.customer.email || null,
                status: orderStatus
            };
        }

        res.json({
            success: true,
            message: 'Order updated successfully',
            data: order,
            notification
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order',
            error: error.message
        });
    }
});

// Delete order (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete order',
            error: error.message
        });
    }
});

module.exports = router;
