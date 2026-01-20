const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');
const Part = require('../models/Part');
const { protect, admin } = require('../middleware/auth');

// Middleware to check admin access
const checkAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
};

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private (Admin)
router.get('/stats', protect, checkAdmin, async (req, res) => {
    try {
        const [
            totalUsers,
            totalCars,
            totalParts,
            activeCars,
            newCars,
            usedCars,
            featuredCars
        ] = await Promise.all([
            User.countDocuments(),
            Car.countDocuments(),
            Part.countDocuments(),
            Car.countDocuments({ isActive: true }),
            Car.countDocuments({ condition: 'New', isActive: true }),
            Car.countDocuments({ condition: 'Used', isActive: true }),
            Car.countDocuments({ isFeatured: true, isActive: true })
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalCars,
                totalParts,
                activeCars,
                newCars,
                usedCars,
                featuredCars
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats',
            error: error.message
        });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', protect, checkAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const [users, total] = await Promise.all([
            User.find()
                .select('-password')
                .sort({ createdAt: -1 })
                .skip((parseInt(page) - 1) * parseInt(limit))
                .limit(parseInt(limit))
                .lean(),
            User.countDocuments()
        ]);

        res.json({
            success: true,
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private (Admin)
router.put('/users/:id/role', protect, checkAdmin, async (req, res) => {
    try {
        const { role } = req.body;

        if (!['user', 'dealer', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'User role updated',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update user role',
            error: error.message
        });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete('/users/:id', protect, checkAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        // Also delete user's listings
        await Car.deleteMany({ seller: req.params.id });
        await Part.deleteMany({ seller: req.params.id });

        res.json({
            success: true,
            message: 'User and their listings deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        });
    }
});

// @route   GET /api/admin/cars
// @desc    Get all cars for admin
// @access  Private (Admin)
router.get('/cars', protect, checkAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20, condition, featured } = req.query;

        const query = {};
        if (condition) query.condition = condition;
        if (featured === 'true') query.isFeatured = true;

        const [cars, total] = await Promise.all([
            Car.find(query)
                .populate('seller', 'name email phone')
                .sort({ createdAt: -1 })
                .skip((parseInt(page) - 1) * parseInt(limit))
                .limit(parseInt(limit))
                .lean(),
            Car.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: cars,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cars',
            error: error.message
        });
    }
});

// @route   PUT /api/admin/cars/:id/featured
// @desc    Toggle car featured status
// @access  Private (Admin)
router.put('/cars/:id/featured', protect, checkAdmin, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        car.isFeatured = !car.isFeatured;
        await car.save();

        res.json({
            success: true,
            message: `Car ${car.isFeatured ? 'featured' : 'unfeatured'}`,
            data: { isFeatured: car.isFeatured }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update car',
            error: error.message
        });
    }
});

// @route   PUT /api/admin/cars/:id/active
// @desc    Toggle car active status
// @access  Private (Admin)
router.put('/cars/:id/active', protect, checkAdmin, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        car.isActive = !car.isActive;
        await car.save();

        res.json({
            success: true,
            message: `Car ${car.isActive ? 'activated' : 'deactivated'}`,
            data: { isActive: car.isActive }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update car',
            error: error.message
        });
    }
});

// @route   DELETE /api/admin/cars/:id
// @desc    Delete any car
// @access  Private (Admin)
router.delete('/cars/:id', protect, checkAdmin, async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: 'Car deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete car',
            error: error.message
        });
    }
});

// @route   GET /api/admin/parts
// @desc    Get all parts for admin
// @access  Private (Admin)
router.get('/parts', protect, checkAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const [parts, total] = await Promise.all([
            Part.find()
                .populate('seller', 'name email phone')
                .sort({ createdAt: -1 })
                .skip((parseInt(page) - 1) * parseInt(limit))
                .limit(parseInt(limit))
                .lean(),
            Part.countDocuments()
        ]);

        res.json({
            success: true,
            data: parts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch parts',
            error: error.message
        });
    }
});

// @route   DELETE /api/admin/parts/:id
// @desc    Delete any part
// @access  Private (Admin)
router.delete('/parts/:id', protect, checkAdmin, async (req, res) => {
    try {
        await Part.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: 'Part deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete part',
            error: error.message
        });
    }
});

module.exports = router;
