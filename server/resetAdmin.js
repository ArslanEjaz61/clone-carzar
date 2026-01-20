const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const resetAdminPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Delete existing admin if exists
        await User.deleteOne({ email: 'yasir@carzar.com' });
        console.log('Deleted old admin if existed');

        // Create fresh admin - password will be hashed by pre-save hook
        const admin = new User({
            name: 'Yasir',
            email: 'yasir@carzar.com',
            password: 'yasir123',  // Will be auto-hashed
            phone: '0300-1234567',
            city: 'Lahore',
            role: 'admin',
            isVerified: true
        });

        await admin.save();
        console.log('Admin created successfully!');

        console.log('\n=== Admin Credentials ===');
        console.log('Email: yasir@carzar.com');
        console.log('Password: yasir123');
        console.log('Role:', admin.role);
        console.log('========================\n');

        // Verify it works
        const testUser = await User.findOne({ email: 'yasir@carzar.com' }).select('+password');
        const isMatch = await testUser.comparePassword('yasir123');
        console.log('Password verification test:', isMatch ? 'PASSED ✓' : 'FAILED ✗');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

resetAdminPassword();
