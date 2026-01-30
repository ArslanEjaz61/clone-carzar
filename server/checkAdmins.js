require('dotenv').config();
const mongoose = require('mongoose');

async function checkAdmins() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/carzar');
        console.log('Connected to MongoDB');

        const User = require('./models/User');
        const admins = await User.find({ role: 'admin' }).select('name email role phone');

        console.log('\n=== Admin Users ===');
        admins.forEach(user => {
            console.log(`- Name: ${user.name}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Role: ${user.role}`);
            console.log(`  Phone: ${user.phone || 'Not set'}`);
            console.log('---');
        });

        if (admins.length === 0) {
            console.log('No admin users found!');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkAdmins();
