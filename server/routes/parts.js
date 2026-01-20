const express = require('express');
const router = express.Router();
const Part = require('../models/Part');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadCarImages } = require('../middleware/upload');

// @route   GET /api/parts
// @desc    Get all parts with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            condition,
            city,
            priceMin,
            priceMax,
            make,
            sort = 'createdAt',
            order = 'desc',
            search
        } = req.query;

        const query = { isActive: true };

        if (category) {
            query.category = category;
        }

        if (condition) {
            query.condition = condition;
        }

        if (city) {
            query.city = { $regex: city, $options: 'i' };
        }

        if (make) {
            query.compatibleMakes = { $in: [new RegExp(make, 'i')] };
        }

        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin) query.price.$gte = parseInt(priceMin);
            if (priceMax) query.price.$lte = parseInt(priceMax);
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const sortOptions = {};
        sortOptions[sort] = order === 'asc' ? 1 : -1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [parts, total] = await Promise.all([
            Part.find(query)
                .populate('seller', 'name phone city')
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Part.countDocuments(query)
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

// @route   GET /api/parts/featured
// @desc    Get featured parts
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const { limit = 8 } = req.query;

        const parts = await Part.find({ isActive: true, isFeatured: true })
            .populate('seller', 'name phone city')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean();

        res.json({
            success: true,
            data: parts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch featured parts',
            error: error.message
        });
    }
});

// @route   GET /api/parts/:id
// @desc    Get single part
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const part = await Part.findById(req.params.id)
            .populate('seller', 'name phone city avatar');

        if (!part) {
            return res.status(404).json({
                success: false,
                message: 'Part not found'
            });
        }

        part.views += 1;
        await part.save();

        res.json({
            success: true,
            data: part
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch part',
            error: error.message
        });
    }
});

// @route   POST /api/parts
// @desc    Create new part listing
// @access  Private
router.post('/', protect, uploadCarImages, async (req, res) => {
    try {
        const partData = { ...req.body };
        partData.seller = req.user._id;

        // Handle image uploads
        if (req.files && req.files.length > 0) {
            partData.images = req.files.map(file => ({
                url: `/uploads/cars/${file.filename}`,
                publicId: file.filename
            }));
        }

        if (req.body.images && Array.isArray(req.body.images)) {
            partData.images = req.body.images;
        }

        if (!partData.contactPhone) {
            partData.contactPhone = req.user.phone;
        }

        // Parse JSON fields
        if (partData.compatibleMakes && typeof partData.compatibleMakes === 'string') {
            try {
                partData.compatibleMakes = JSON.parse(partData.compatibleMakes);
            } catch (e) {
                partData.compatibleMakes = [];
            }
        }

        if (partData.price) partData.price = parseInt(partData.price);
        if (partData.isFeatured === 'true') partData.isFeatured = true;
        if (partData.isFeatured === 'false') partData.isFeatured = false;

        // Create and save part
        const part = new Part(partData);
        await part.save();

        res.status(201).json({
            success: true,
            message: 'Part listing created successfully',
            data: part
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create part listing',
            error: error.message
        });
    }
});

// @route   PUT /api/parts/:id
// @desc    Update part listing
// @access  Private
router.put('/:id', protect, uploadCarImages, async (req, res) => {
    try {
        let part = await Part.findById(req.params.id);

        if (!part) {
            return res.status(404).json({
                success: false,
                message: 'Part not found'
            });
        }

        if (part.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const updateData = { ...req.body };

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: `/uploads/cars/${file.filename}`,
                publicId: file.filename
            }));
            updateData.images = [...(part.images || []), ...newImages];
        }

        if (updateData.price) updateData.price = parseInt(updateData.price);

        part = await Part.findByIdAndUpdate(req.params.id, updateData, { new: true });

        res.json({
            success: true,
            message: 'Part updated successfully',
            data: part
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update part',
            error: error.message
        });
    }
});

// @route   DELETE /api/parts/:id
// @desc    Delete part listing
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const part = await Part.findById(req.params.id);

        if (!part) {
            return res.status(404).json({
                success: false,
                message: 'Part not found'
            });
        }

        if (part.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

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
