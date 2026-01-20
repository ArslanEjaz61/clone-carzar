const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Engine Parts', 'Body Parts', 'Electrical', 'Suspension', 'Brakes', 'Interior', 'Exterior', 'Wheels & Tires', 'Accessories', 'Other']
    },
    condition: {
        type: String,
        required: true,
        enum: ['New', 'Used'],
        default: 'Used'
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    compatibleMakes: [{
        type: String
    }],
    compatibleModels: [{
        type: String
    }],
    description: {
        type: String,
        maxlength: [3000, 'Description cannot exceed 3000 characters']
    },
    images: [{
        url: String,
        publicId: String
    }],
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contactPhone: {
        type: String,
        required: [true, 'Contact phone is required']
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes
partSchema.index({ title: 'text', category: 'text' });
partSchema.index({ category: 1 });
partSchema.index({ price: 1 });
partSchema.index({ city: 1 });
partSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Part', partSchema);
