const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Car = require('./models/Car');

// Sample Users
const users = [
    {
        name: 'Ahmed Motors',
        email: 'ahmed@carzar.pk',
        password: 'password123',
        phone: '0300-1234567',
        city: 'Lahore',
        role: 'dealer',
        isVerified: true
    },
    {
        name: 'Ali Khan',
        email: 'ali@carzar.pk',
        password: 'password123',
        phone: '0312-9876543',
        city: 'Karachi',
        role: 'user',
        isVerified: true
    },
    {
        name: 'Demo User',
        email: 'demo@carzar.pk',
        password: 'demo123',
        phone: '0300-0000000',
        city: 'Islamabad',
        role: 'user',
        isVerified: true
    }
];

// Sample Cars
const createCars = (sellerIds) => [
    {
        title: 'Toyota Corolla GLi 1.3 VVTi',
        make: 'Toyota',
        model: 'Corolla',
        year: 2022,
        price: 4500000,
        mileage: 25000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1300,
        color: 'White',
        city: 'Lahore',
        registrationCity: 'Lahore',
        assembly: 'Local',
        bodyType: 'Sedan',
        condition: 'Used',
        description: 'Excellent condition Toyota Corolla GLi. Single owner, well maintained. All original documents available.',
        features: ['Power Steering', 'Power Windows', 'Air Conditioning', 'Alloy Rims', 'Central Locking', 'ABS'],
        images: [{ url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800', publicId: 'img1' }],
        seller: sellerIds[0],
        contactPhone: '0300-1234567',
        isFeatured: true,
        isActive: true
    },
    {
        title: 'Honda Civic Oriel 1.8 i-VTEC CVT',
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        price: 6200000,
        mileage: 35000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1800,
        color: 'Black',
        city: 'Karachi',
        registrationCity: 'Karachi',
        assembly: 'Local',
        bodyType: 'Sedan',
        condition: 'Used',
        description: 'Honda Civic Oriel top of the line. Sunroof, leather seats, navigation system.',
        features: ['Sunroof', 'Leather Seats', 'Navigation', 'Rear Camera', 'Cruise Control', 'Push Start'],
        images: [{ url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', publicId: 'img2' }],
        seller: sellerIds[1],
        contactPhone: '0312-9876543',
        isFeatured: true,
        isActive: true
    },
    {
        title: 'Suzuki Alto VXR 660cc',
        make: 'Suzuki',
        model: 'Alto',
        year: 2023,
        price: 2100000,
        mileage: 15000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        engineCapacity: 660,
        color: 'Silver',
        city: 'Islamabad',
        registrationCity: 'Islamabad',
        assembly: 'Local',
        bodyType: 'Hatchback',
        condition: 'Used',
        description: 'Brand new condition Suzuki Alto. Low mileage, like new.',
        features: ['Power Steering', 'AC', 'USB', 'Audio System'],
        images: [{ url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', publicId: 'img3' }],
        seller: sellerIds[0],
        contactPhone: '0300-1234567',
        isFeatured: false,
        isActive: true
    },
    {
        title: 'KIA Sportage Alpha AWD',
        make: 'KIA',
        model: 'Sportage',
        year: 2022,
        price: 8500000,
        mileage: 20000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 2000,
        color: 'Grey',
        city: 'Rawalpindi',
        registrationCity: 'Rawalpindi',
        assembly: 'Local',
        bodyType: 'SUV',
        condition: 'Used',
        description: 'KIA Sportage Alpha AWD. Premium SUV with all features.',
        features: ['Panoramic Sunroof', 'AWD', 'Premium Sound', '360 Camera', 'Wireless Charging'],
        images: [{ url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800', publicId: 'img4' }],
        seller: sellerIds[1],
        contactPhone: '0312-9876543',
        isFeatured: true,
        isActive: true
    },
    {
        title: 'Hyundai Tucson GLS Sport',
        make: 'Hyundai',
        model: 'Tucson',
        year: 2023,
        price: 9200000,
        mileage: 10000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 2000,
        color: 'Blue',
        city: 'Lahore',
        registrationCity: 'Lahore',
        assembly: 'Imported',
        bodyType: 'SUV',
        condition: 'Used',
        description: 'Hyundai Tucson GLS Sport fully loaded. Imported variant.',
        features: ['Panoramic Sunroof', 'Electric Seats', 'Apple CarPlay', 'Android Auto', 'Blind Spot Monitor'],
        images: [{ url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800', publicId: 'img5' }],
        seller: sellerIds[0],
        contactPhone: '0300-1234567',
        isFeatured: true,
        isActive: true
    },
    {
        title: 'Toyota Yaris ATIV X CVT 1.5',
        make: 'Toyota',
        model: 'Yaris',
        year: 2022,
        price: 4800000,
        mileage: 18000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1500,
        color: 'Red',
        city: 'Multan',
        registrationCity: 'Multan',
        assembly: 'Local',
        bodyType: 'Sedan',
        condition: 'Used',
        description: 'Toyota Yaris ATIV X top variant. CVT transmission, well maintained.',
        features: ['7 Airbags', 'Cruise Control', 'Push Start', 'Smart Entry', 'Rear Camera'],
        images: [{ url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800', publicId: 'img6' }],
        seller: sellerIds[1],
        contactPhone: '0312-9876543',
        isFeatured: false,
        isActive: true
    },
    {
        title: 'Honda City 1.5L Aspire Prosmatec',
        make: 'Honda',
        model: 'City',
        year: 2022,
        price: 5500000,
        mileage: 22000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1500,
        color: 'White',
        city: 'Karachi',
        registrationCity: 'Karachi',
        assembly: 'Local',
        bodyType: 'Sedan',
        condition: 'Used',
        description: 'Honda City Aspire with Prosmatec transmission. Top of the line.',
        features: ['Sunroof', 'Cruise Control', 'Auto Climate', 'Fog Lights', 'Alloy Rims'],
        images: [{ url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', publicId: 'img7' }],
        seller: sellerIds[0],
        contactPhone: '0300-1234567',
        isFeatured: false,
        isActive: true
    },
    {
        title: 'Suzuki Cultus VXL AGS',
        make: 'Suzuki',
        model: 'Cultus',
        year: 2023,
        price: 2800000,
        mileage: 12000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1000,
        color: 'Grey',
        city: 'Faisalabad',
        registrationCity: 'Faisalabad',
        assembly: 'Local',
        bodyType: 'Hatchback',
        condition: 'Used',
        description: 'Suzuki Cultus VXL with AGS transmission. Almost new condition.',
        features: ['Power Windows', 'Power Mirrors', 'Rear Wiper', 'Fog Lights'],
        images: [{ url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', publicId: 'img8' }],
        seller: sellerIds[1],
        contactPhone: '0312-9876543',
        isFeatured: false,
        isActive: true
    },
    {
        title: 'Toyota Fortuner Sigma 4 2.8D',
        make: 'Toyota',
        model: 'Fortuner',
        year: 2021,
        price: 15500000,
        mileage: 45000,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        engineCapacity: 2800,
        color: 'Black',
        city: 'Islamabad',
        registrationCity: 'Islamabad',
        assembly: 'Imported',
        bodyType: 'SUV',
        condition: 'Used',
        description: 'Toyota Fortuner Sigma 4. Diesel, 4x4, fully loaded.',
        features: ['4x4', 'Diesel Engine', 'Leather Interior', 'Sunroof', 'Premium Sound System', 'Adaptive Cruise Control'],
        images: [{ url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', publicId: 'img9' }],
        seller: sellerIds[0],
        contactPhone: '0300-1234567',
        isFeatured: true,
        isActive: true
    },
    {
        title: 'Changan Alsvin Lumiere 1.5L',
        make: 'Changan',
        model: 'Alsvin',
        year: 2023,
        price: 4200000,
        mileage: 8000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1500,
        color: 'Brown',
        city: 'Lahore',
        registrationCity: 'Lahore',
        assembly: 'Local',
        bodyType: 'Sedan',
        condition: 'Used',
        description: 'Changan Alsvin Lumiere. Feature packed sedan at affordable price.',
        features: ['Sunroof', 'Cruise Control', '360 Camera', 'LED Headlights', 'Alloy Rims'],
        images: [{ url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800', publicId: 'img10' }],
        seller: sellerIds[1],
        contactPhone: '0312-9876543',
        isFeatured: true,
        isActive: true
    },
    {
        title: 'MG HS Exclusive 1.5T',
        make: 'MG',
        model: 'HS',
        year: 2023,
        price: 7800000,
        mileage: 5000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1500,
        color: 'White',
        city: 'Rawalpindi',
        registrationCity: 'Rawalpindi',
        assembly: 'Local',
        bodyType: 'SUV',
        condition: 'Used',
        description: 'MG HS Exclusive turbo. Premium SUV with great features.',
        features: ['Panoramic Sunroof', 'Digital Cluster', 'ADAS', 'Heated Seats', '360 Camera'],
        images: [{ url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800', publicId: 'img11' }],
        seller: sellerIds[0],
        contactPhone: '0300-1234567',
        isFeatured: false,
        isActive: true
    },
    {
        title: 'Hyundai Elantra GLS 1.6',
        make: 'Hyundai',
        model: 'Elantra',
        year: 2022,
        price: 5900000,
        mileage: 28000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1600,
        color: 'Silver',
        city: 'Karachi',
        registrationCity: 'Karachi',
        assembly: 'Imported',
        bodyType: 'Sedan',
        condition: 'Used',
        description: 'Hyundai Elantra GLS imported. Apple CarPlay, Android Auto.',
        features: ['Apple CarPlay', 'Android Auto', 'Smart Trunk', 'LED Taillights', 'Lane Assist'],
        images: [{ url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', publicId: 'img12' }],
        seller: sellerIds[1],
        contactPhone: '0312-9876543',
        isFeatured: false,
        isActive: true
    }
];

// Seed function
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/carzar';
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Drop existing collections to avoid index issues
        try {
            await mongoose.connection.db.dropCollection('users');
            await mongoose.connection.db.dropCollection('cars');
            console.log('🗑️ Dropped existing collections');
        } catch (e) {
            console.log('📝 Collections may not exist, continuing...');
        }

        // Create users
        const createdUsers = await User.create(users);
        console.log(`👤 Created ${createdUsers.length} users`);

        // Get seller IDs
        const sellerIds = createdUsers.map(user => user._id);

        // Create cars
        const carsData = createCars(sellerIds);
        const createdCars = await Car.create(carsData);
        console.log(`🚗 Created ${createdCars.length} cars`);

        console.log('\n✅ Database seeded successfully!\n');
        console.log('📧 Demo Login Credentials:');
        console.log('   Email: demo@carzar.pk');
        console.log('   Password: demo123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

// Run seeder
seedDatabase();
