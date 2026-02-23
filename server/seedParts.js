const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Part = require('./models/Part');
const User = require('./models/User');

const sampleParts = [
    {
        title: 'Toyota Corolla LED Headlights Set',
        category: 'Exterior',
        condition: 'New',
        price: 18500,
        compatibleMakes: ['Toyota'],
        compatibleModels: ['Corolla'],
        description: 'High quality LED headlights for Toyota Corolla 2018-2024. Bright white light, waterproof design. Easy plug-and-play installation.',
        city: 'Lahore',
        contactPhone: '0300-1234567',
        isFeatured: true,
        isActive: true,
        images: [{
            url: 'https://images.unsplash.com/photo-1591543620767-582b2469cf5f?w=600&h=400&fit=crop',
            publicId: 'seed_headlights'
        }]
    },
    {
        title: 'Honda Civic Side Mirror with Indicator',
        category: 'Body Parts',
        condition: 'New',
        price: 4500,
        compatibleMakes: ['Honda'],
        compatibleModels: ['Civic'],
        description: 'OEM quality side mirror with integrated LED turn signal indicator. Available for both left and right sides.',
        city: 'Karachi',
        contactPhone: '0321-9876543',
        isFeatured: true,
        isActive: true,
        images: [{
            url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=400&fit=crop',
            publicId: 'seed_mirror'
        }]
    },
    {
        title: 'Universal Car Brake Pads Set - Ceramic',
        category: 'Brakes',
        condition: 'New',
        price: 3200,
        compatibleMakes: ['Toyota', 'Honda', 'Suzuki'],
        compatibleModels: ['Multiple'],
        description: 'Premium ceramic brake pads with anti-noise technology. Long lasting performance. Set of 4 pads for front or rear.',
        city: 'Islamabad',
        contactPhone: '0312-5551234',
        isFeatured: true,
        isActive: true,
        images: [{
            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
            publicId: 'seed_brakes'
        }]
    },
    {
        title: 'Suzuki Mehran Engine Assembly Complete',
        category: 'Engine Parts',
        condition: 'Used',
        price: 65000,
        compatibleMakes: ['Suzuki'],
        compatibleModels: ['Mehran'],
        description: 'Complete engine assembly for Suzuki Mehran. Well maintained, low mileage. Comes with 30 days warranty.',
        city: 'Multan',
        contactPhone: '0333-4445566',
        isFeatured: true,
        isActive: true,
        images: [{
            url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop',
            publicId: 'seed_engine'
        }]
    },
    {
        title: 'Car Dashboard Camera DVR Full HD',
        category: 'Accessories',
        condition: 'New',
        price: 5500,
        compatibleMakes: ['Universal'],
        compatibleModels: ['All Cars'],
        description: 'Full HD 1080p dash cam with night vision. Loop recording, G-sensor, parking monitor. 3 inch LCD screen.',
        city: 'Rawalpindi',
        contactPhone: '0345-6667788',
        isFeatured: true,
        isActive: true,
        images: [{
            url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600&h=400&fit=crop',
            publicId: 'seed_dashcam'
        }]
    },
    {
        title: 'Alloy Wheels 16 inch Set of 4',
        category: 'Wheels & Tires',
        condition: 'New',
        price: 42000,
        compatibleMakes: ['Toyota', 'Honda'],
        compatibleModels: ['Corolla', 'Civic', 'City'],
        description: 'Premium quality 16 inch alloy wheels. Lightweight design for better performance and fuel economy. Set of 4 wheels.',
        city: 'Lahore',
        contactPhone: '0300-9998877',
        isFeatured: true,
        isActive: true,
        images: [{
            url: 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=600&h=400&fit=crop',
            publicId: 'seed_wheels'
        }]
    },
    {
        title: 'Toyota Yaris Suspension Kit',
        category: 'Suspension',
        condition: 'New',
        price: 28000,
        compatibleMakes: ['Toyota'],
        compatibleModels: ['Yaris'],
        description: 'Complete front suspension kit including shock absorbers, struts, and mounting hardware. OEM quality parts.',
        city: 'Faisalabad',
        contactPhone: '0311-2223344',
        isFeatured: true,
        isActive: true,
        images: [{
            url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop',
            publicId: 'seed_suspension'
        }]
    },
    {
        title: 'LED Interior Ambient Light Kit RGB',
        category: 'Interior',
        condition: 'New',
        price: 2800,
        compatibleMakes: ['Universal'],
        compatibleModels: ['All Cars'],
        description: 'RGB LED interior ambient lighting kit with remote control. Multiple colors and modes. Easy installation with adhesive strips.',
        city: 'Karachi',
        contactPhone: '0322-7778899',
        isFeatured: true,
        isActive: true,
        images: [{
            url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop',
            publicId: 'seed_interior_led'
        }]
    }
];

async function seedParts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Find an admin user to use as seller
        let seller = await User.findOne({ role: 'admin' });
        if (!seller) {
            seller = await User.findOne();
        }

        if (!seller) {
            console.log('❌ No user found in database. Please create a user first.');
            process.exit(1);
        }

        console.log(`📦 Using seller: ${seller.name} (${seller.email})`);

        // Delete existing seeded parts (optional)
        await Part.deleteMany({ contactPhone: { $in: ['0300-1234567', '0321-9876543', '0312-5551234', '0333-4445566', '0345-6667788', '0300-9998877', '0311-2223344', '0322-7778899'] } });
        console.log('🗑️  Cleared old seed data');

        // Add seller ID to all parts
        const partsWithSeller = sampleParts.map(part => ({
            ...part,
            seller: seller._id
        }));

        // Insert parts
        const result = await Part.insertMany(partsWithSeller);
        console.log(`✅ Successfully added ${result.length} auto parts!`);

        result.forEach(part => {
            console.log(`   📌 ${part.title} - PKR ${part.price.toLocaleString()} (${part.city})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seedParts();
