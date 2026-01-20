const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');
const { protect, optionalAuth } = require('../middleware/auth');

// @route   GET /api/users/:id
// @desc    Get user profile (public info)
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name city avatar createdAt');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's active car listings count
        const totalListings = await Car.countDocuments({
            seller: user._id,
            isActive: true
        });

        res.json({
            success: true,
            data: {
                user,
                totalListings
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user',
            error: error.message
        });
    }
});

// @route   GET /api/users/:id/listings
// @desc    Get user's car listings
// @access  Public
router.get('/:id/listings', optionalAuth, async (req, res) => {
    try {
        const { page = 1, limit = 12, sort = 'createdAt', order = 'desc' } = req.query;

        // Check if viewing own listings
        const isOwner = req.user && req.user._id.toString() === req.params.id;

        // Build query - show all listings to owner, only active to others
        const query = { seller: req.params.id };
        if (!isOwner) {
            query.isActive = true;
        }

        const sortOptions = {};
        sortOptions[sort] = order === 'asc' ? 1 : -1;

        const [listings, total] = await Promise.all([
            Car.find(query)
                .sort(sortOptions)
                .skip((parseInt(page) - 1) * parseInt(limit))
                .limit(parseInt(limit))
                .lean(),
            Car.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: listings,
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
            message: 'Failed to fetch listings',
            error: error.message
        });
    }
});

// @route   GET /api/users/me/listings
// @desc    Get current user's listings
// @access  Private
router.get('/me/listings', protect, async (req, res) => {
    try {
        const { page = 1, limit = 12, status } = req.query;

        const query = { seller: req.user._id };
        if (status === 'active') query.isActive = true;
        if (status === 'inactive') query.isActive = false;

        const [listings, total, activeCount, inactiveCount] = await Promise.all([
            Car.find(query)
                .sort({ createdAt: -1 })
                .skip((parseInt(page) - 1) * parseInt(limit))
                .limit(parseInt(limit))
                .lean(),
            Car.countDocuments(query),
            Car.countDocuments({ seller: req.user._id, isActive: true }),
            Car.countDocuments({ seller: req.user._id, isActive: false })
        ]);

        res.json({
            success: true,
            data: listings,
            stats: {
                total: activeCount + inactiveCount,
                active: activeCount,
                inactive: inactiveCount
            },
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
            message: 'Failed to fetch listings',
            error: error.message
        });
    }
});

// @route   GET /api/users/me/favorites
// @desc    Get current user's favorite cars
// @access  Private
router.get('/me/favorites', protect, async (req, res) => {
    try {
        const { page = 1, limit = 12 } = req.query;

        const user = await User.findById(req.user._id);
        const favoriteIds = user.favorites || [];

        const [favorites, total] = await Promise.all([
            Car.find({ _id: { $in: favoriteIds }, isActive: true })
                .populate('seller', 'name phone city')
                .skip((parseInt(page) - 1) * parseInt(limit))
                .limit(parseInt(limit))
                .lean(),
            Car.countDocuments({ _id: { $in: favoriteIds }, isActive: true })
        ]);

        res.json({
            success: true,
            data: favorites,
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
            message: 'Failed to fetch favorites',
            error: error.message
        });
    }
});

// @route   POST /api/users/favorites/:carId
// @desc    Add car to favorites
// @access  Private
router.post('/favorites/:carId', protect, async (req, res) => {
    try {
        const car = await Car.findById(req.params.carId);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        const user = await User.findById(req.user._id);

        // Check if already in favorites
        if (user.favorites.includes(req.params.carId)) {
            return res.status(400).json({
                success: false,
                message: 'Car already in favorites'
            });
        }

        user.favorites.push(req.params.carId);
        await user.save();

        res.json({
            success: true,
            message: 'Added to favorites',
            data: { favoriteCount: user.favorites.length }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add to favorites',
            error: error.message
        });
    }
});

// @route   DELETE /api/users/favorites/:carId
// @desc    Remove car from favorites
// @access  Private
router.delete('/favorites/:carId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        user.favorites = user.favorites.filter(
            fav => fav.toString() !== req.params.carId
        );
        await user.save();

        res.json({
            success: true,
            message: 'Removed from favorites',
            data: { favoriteCount: user.favorites.length }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to remove from favorites',
            error: error.message
        });
    }
});

// @route   GET /api/users/favorites/check/:carId
// @desc    Check if car is in favorites
// @access  Private
router.get('/favorites/check/:carId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const isFavorite = user.favorites.includes(req.params.carId);

        res.json({
            success: true,
            data: { isFavorite }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to check favorite status',
            error: error.message
        });
    }
});

// @route   GET /api/users/me/stats
// @desc    Get current user's dashboard stats
// @access  Private
router.get('/me/stats', protect, async (req, res) => {
    try {
        const [totalListings, activeListings, totalViews, favorites] = await Promise.all([
            Car.countDocuments({ seller: req.user._id }),
            Car.countDocuments({ seller: req.user._id, isActive: true }),
            Car.aggregate([
                { $match: { seller: req.user._id } },
                { $group: { _id: null, totalViews: { $sum: '$views' } } }
            ]),
            User.findById(req.user._id).select('favorites')
        ]);

        res.json({
            success: true,
            data: {
                totalListings,
                activeListings,
                inactiveListings: totalListings - activeListings,
                totalViews: totalViews[0]?.totalViews || 0,
                totalFavorites: favorites.favorites?.length || 0
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

module.exports = router;
