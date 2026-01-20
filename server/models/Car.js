const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    make: {
        type: String,
        required: [true, 'Make is required'],
        trim: true
    },
    model: {
        type: String,
        required: [true, 'Model is required'],
        trim: true
    },
    variant: {
        type: String,
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: [1970, 'Year must be at least 1970'],
        max: [new Date().getFullYear() + 1, 'Invalid year']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    mileage: {
        type: Number,
        required: [true, 'Mileage is required'],
        min: [0, 'Mileage cannot be negative']
    },
    fuelType: {
        type: String,
        required: [true, 'Fuel type is required'],
        enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG', 'LPG']
    },
    transmission: {
        type: String,
        required: [true, 'Transmission is required'],
        enum: ['Automatic', 'Manual']
    },
    engineCapacity: {
        type: Number,
        required: [true, 'Engine capacity is required']
    },
    color: {
        type: String,
        required: [true, 'Color is required'],
        trim: true
    },
    bodyType: {
        type: String,
        enum: ['Sedan', 'Hatchback', 'SUV', 'Crossover', 'Coupe', 'Convertible', 'Van', 'Pickup', 'Wagon', 'Other'],
        default: 'Sedan'
    },
    doors: {
        type: Number,
        default: 4
    },
    seatingCapacity: {
        type: Number,
        default: 5
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    registrationCity: {
        type: String,
        trim: true
    },
    assembly: {
        type: String,
        enum: ['Local', 'Imported'],
        default: 'Local'
    },
    condition: {
        type: String,
        enum: ['New', 'Used'],
        default: 'Used'
    },
    description: {
        type: String,
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    features: [{
        type: String
    }],
    images: [{
        url: String,
        public_id: String
    }],
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
    },
    slug: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

// Create slug before saving
carSchema.pre('save', function () {
    if (this.isModified('title') || !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now();
    }
});

// Create indexes for search
carSchema.index({ title: 'text', make: 'text', model: 'text', city: 'text' });
carSchema.index({ make: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ year: 1 });
carSchema.index({ city: 1 });
carSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Car', carSchema);
