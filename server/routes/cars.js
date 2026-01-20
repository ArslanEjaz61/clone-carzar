const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadCarImages } = require('../middleware/upload');

// @route   GET /api/cars
// @desc    Get all cars with filters and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            make,
            model,
            city,
            yearFrom,
            yearTo,
            priceMin,
            priceMax,
            mileageMax,
            fuelType,
            transmission,
            bodyType,
            color,
            condition,
            assembly,
            featured,
            certified,
            sort = 'createdAt',
            order = 'desc',
            search,
            seller
        } = req.query;

        // Build query
        const query = { isActive: true };

        // Filter by make(s)
        if (make) {
            const makes = make.split(',').map(m => new RegExp(m.trim(), 'i'));
            query.make = { $in: makes };
        }

        // Filter by model(s)
        if (model) {
            const models = model.split(',').map(m => new RegExp(m.trim(), 'i'));
            query.model = { $in: models };
        }

        // Filter by city/cities
        if (city) {
            const cities = city.split(',').map(c => new RegExp(c.trim(), 'i'));
            query.city = { $in: cities };
        }

        // Filter by fuel type(s)
        if (fuelType) {
            query.fuelType = { $in: fuelType.split(',') };
        }

        // Filter by transmission(s)
        if (transmission) {
            query.transmission = { $in: transmission.split(',') };
        }

        // Filter by body type
        if (bodyType) {
            query.bodyType = { $in: bodyType.split(',') };
        }

        // Filter by color
        if (color) {
            query.color = { $in: color.split(',') };
        }

        // Filter by condition
        if (condition) {
            query.condition = condition;
        }

        // Filter by assembly
        if (assembly) {
            query.assembly = assembly;
        }

        // Filter by featured
        if (featured === 'true') {
            query.isFeatured = true;
        }

        // Filter by seller
        if (seller) {
            query.seller = seller;
        }

        // Year range filter
        if (yearFrom || yearTo) {
            query.year = {};
            if (yearFrom) query.year.$gte = parseInt(yearFrom);
            if (yearTo) query.year.$lte = parseInt(yearTo);
        }

        // Price range filter
        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin) query.price.$gte = parseInt(priceMin);
            if (priceMax) query.price.$lte = parseInt(priceMax);
        }

        // Mileage filter
        if (mileageMax) {
            query.mileage = { $lte: parseInt(mileageMax) };
        }

        // Text search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { make: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Sort options
        const sortOptions = {};
        if (sort === 'price_low') {
            sortOptions.price = 1;
        } else if (sort === 'price_high') {
            sortOptions.price = -1;
        } else if (sort === 'year_new') {
            sortOptions.year = -1;
        } else if (sort === 'year_old') {
            sortOptions.year = 1;
        } else if (sort === 'mileage') {
            sortOptions.mileage = 1;
        } else {
            sortOptions[sort] = order === 'asc' ? 1 : -1;
        }

        // Execute query with pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [cars, total] = await Promise.all([
            Car.find(query)
                .populate('seller', 'name phone city avatar')
                .sort(sortOptions)
                .skip(skip)
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
                pages: Math.ceil(total / parseInt(limit)),
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Get cars error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cars',
            error: error.message
        });
    }
});

// @route   GET /api/cars/featured
// @desc    Get featured cars
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const { limit = 10, condition = 'Used' } = req.query;

        const cars = await Car.find({
            isActive: true,
            isFeatured: true,
            condition
        })
            .populate('seller', 'name phone city')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean();

        res.json({
            success: true,
            count: cars.length,
            data: cars
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch featured cars',
            error: error.message
        });
    }
});

// @route   GET /api/cars/recent
// @desc    Get recently added cars
// @access  Public
router.get('/recent', async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const cars = await Car.find({ isActive: true })
            .populate('seller', 'name phone city')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean();

        res.json({
            success: true,
            count: cars.length,
            data: cars
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent cars',
            error: error.message
        });
    }
});

// @route   GET /api/cars/stats/makes
// @desc    Get car count by make
// @access  Public
router.get('/stats/makes', async (req, res) => {
    try {
        const stats = await Car.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$make',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats',
            error: error.message
        });
    }
});

// @route   GET /api/cars/stats/cities
// @desc    Get car count by city
// @access  Public
router.get('/stats/cities', async (req, res) => {
    try {
        const stats = await Car.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$city',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats',
            error: error.message
        });
    }
});

// @route   GET /api/cars/:id
// @desc    Get single car by ID or slug
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        let car;

        // Try to find by ID first
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            car = await Car.findById(req.params.id)
                .populate('seller', 'name phone city avatar createdAt');
        }

        // If not found, try by slug
        if (!car) {
            car = await Car.findOne({ slug: req.params.id })
                .populate('seller', 'name phone city avatar createdAt');
        }

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        // Increment views
        car.views = (car.views || 0) + 1;
        await car.save();

        // Check if current user is the owner
        const isOwner = req.user && car.seller._id.toString() === req.user._id.toString();

        res.json({
            success: true,
            data: car,
            isOwner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch car',
            error: error.message
        });
    }
});

// @route   POST /api/cars
// @desc    Create a new car listing
// @access  Private
router.post('/', protect, uploadCarImages, async (req, res) => {
    try {
        const carData = { ...req.body };

        // Set seller to logged in user
        carData.seller = req.user._id;

        // Handle uploaded images
        if (req.files && req.files.length > 0) {
            carData.images = req.files.map(file => ({
                url: `/uploads/cars/${file.filename}`,
                publicId: file.filename
            }));
        }

        // Handle images sent as URLs (from frontend)
        if (req.body.images && Array.isArray(req.body.images)) {
            carData.images = req.body.images;
        }

        // Set contact phone
        if (!carData.contactPhone) {
            carData.contactPhone = req.user.phone;
        }

        // Parse numeric fields
        if (carData.price) carData.price = parseInt(carData.price);
        if (carData.year) carData.year = parseInt(carData.year);
        if (carData.mileage) carData.mileage = parseInt(carData.mileage);
        if (carData.engineCapacity) carData.engineCapacity = parseInt(carData.engineCapacity);

        // Parse JSON fields
        if (carData.features && typeof carData.features === 'string') {
            try {
                carData.features = JSON.parse(carData.features);
            } catch (e) {
                carData.features = [];
            }
        }

        // Parse boolean fields
        if (carData.isFeatured === 'true') carData.isFeatured = true;
        if (carData.isFeatured === 'false') carData.isFeatured = false;

        // Create and save car (use new + save to trigger pre-save hook)
        const car = new Car(carData);
        await car.save();

        res.status(201).json({
            success: true,
            message: 'Car listing created successfully',
            data: car
        });
    } catch (error) {
        console.error('Create car error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create car listing',
            error: error.message
        });
    }
});

// @route   PUT /api/cars/:id
// @desc    Update a car listing
// @access  Private (owner only)
router.put('/:id', protect, uploadCarImages, async (req, res) => {
    try {
        let car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        // Check ownership
        if (car.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this listing'
            });
        }

        const updateData = { ...req.body };

        // Handle new uploaded images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: `/uploads/cars/${file.filename}`,
                publicId: file.filename
            }));
            updateData.images = [...(car.images || []), ...newImages];
        }

        // Parse numeric fields
        if (updateData.price) updateData.price = parseInt(updateData.price);
        if (updateData.year) updateData.year = parseInt(updateData.year);
        if (updateData.mileage) updateData.mileage = parseInt(updateData.mileage);
        if (updateData.engineCapacity) updateData.engineCapacity = parseInt(updateData.engineCapacity);

        car = await Car.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Car listing updated successfully',
            data: car
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update car listing',
            error: error.message
        });
    }
});

// @route   DELETE /api/cars/:id
// @desc    Delete a car listing
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        // Check ownership
        if (car.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this listing'
            });
        }

        await Car.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Car listing deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete car listing',
            error: error.message
        });
    }
});

// @route   PUT /api/cars/:id/toggle-active
// @desc    Toggle car listing active status
// @access  Private (owner only)
router.put('/:id/toggle-active', protect, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        // Check ownership
        if (car.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        car.isActive = !car.isActive;
        await car.save();

        res.json({
            success: true,
            message: `Listing ${car.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { isActive: car.isActive }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to toggle status',
            error: error.message
        });
    }
});

// @route   DELETE /api/cars/:id/images/:imageId
// @desc    Remove an image from car listing
// @access  Private (owner only)
router.delete('/:id/images/:imageId', protect, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        // Check ownership
        if (car.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Remove image
        car.images = car.images.filter(img => img.publicId !== req.params.imageId);
        await car.save();

        res.json({
            success: true,
            message: 'Image removed successfully',
            data: car.images
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to remove image',
            error: error.message
        });
    }
});

module.exports = router;
