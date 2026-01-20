// Test script to create an order directly
const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('./models/Order');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/carzar';

async function testOrder() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const orderData = {
            orderNumber: 'CZ' + Date.now().toString().slice(-8),
            customer: {
                fullName: 'Test Customer',
                phone: '0300-1234567',
                address: 'Test Address 123',
                city: 'Lahore'
            },
            items: [{
                title: 'Test Part',
                price: 1000,
                quantity: 1
            }],
            subtotal: 1000,
            shipping: 200,
            total: 1200,
            paymentMethod: 'cod',
            paymentStatus: 'pending',
            orderStatus: 'pending'
        };

        console.log('Creating order:', orderData.orderNumber);
        const order = new Order(orderData);
        await order.save();

        console.log('✅ Order created successfully!');
        console.log('Order ID:', order._id);
        console.log('Order Number:', order.orderNumber);

        // Verify by fetching
        const allOrders = await Order.find();
        console.log('\n📦 Total orders in database:', allOrders.length);

        await mongoose.connection.close();
        console.log('Done!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        await mongoose.connection.close();
    }
}

testOrder();
