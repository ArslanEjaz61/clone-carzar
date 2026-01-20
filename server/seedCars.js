const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Car = require('./models/Car');
const User = require('./models/User');

const seedCars = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/carzar';
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Find any user
        let seller = await User.findOne({});

        if (!seller) {
            console.log('No users found. Creating test user...');
            seller = new User({
                name: 'Test Seller',
                email: 'test@carzar.pk',
                password: 'test123',
                phone: '0300-1234567',
                city: 'Lahore'
            });
            await seller.save();
        }

        console.log('Using seller:', seller.name);

        // Delete existing cars
        await Car.deleteMany({});
        console.log('Cleared existing cars');

        // Generate slug
        const makeSlug = (title) => {
            return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
        };

        // Sample cars
        const cars = [
            {
                title: 'Honda Civic Oriel 1.8 i-VTEC CVT',
                slug: makeSlug('Honda Civic Oriel 1.8 i-VTEC CVT'),
                make: 'Honda',
                model: 'Civic',
                year: 2022,
                price: 6500000,
                mileage: 25000,
                fuelType: 'Petrol',
                transmission: 'Automatic',
                engineCapacity: 1800,
                color: 'White',
                city: 'Lahore',
                bodyType: 'Sedan',
                condition: 'Used',
                seller: seller._id,
                contactPhone: '0300-1234567',
                isFeatured: true,
                isActive: true,
                images: [{ url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800' }]
            },
            {
                title: 'Toyota Corolla GLi 1.3 VVTi',
                slug: makeSlug('Toyota Corolla GLi 1.3 VVTi') + '1',
                make: 'Toyota',
                model: 'Corolla',
                year: 2021,
                price: 4200000,
                mileage: 35000,
                fuelType: 'Petrol',
                transmission: 'Manual',
                engineCapacity: 1300,
                color: 'Silver',
                city: 'Karachi',
                bodyType: 'Sedan',
                condition: 'Used',
                seller: seller._id,
                contactPhone: '0300-1234567',
                isFeatured: true,
                isActive: true,
                images: [{ url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800' }]
            },
            {
                title: 'KIA Sportage Alpha AWD',
                slug: makeSlug('KIA Sportage Alpha AWD') + '2',
                make: 'KIA',
                model: 'Sportage',
                year: 2024,
                price: 10500000,
                mileage: 0,
                fuelType: 'Petrol',
                transmission: 'Automatic',
                engineCapacity: 2000,
                color: 'Black',
                city: 'Islamabad',
                bodyType: 'SUV',
                condition: 'New',
                seller: seller._id,
                contactPhone: '0300-1234567',
                isFeatured: true,
                isActive: true,
                images: [{ url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800' }]
            },
            {
                title: 'Suzuki Alto VXR 660cc',
                slug: makeSlug('Suzuki Alto VXR') + '3',
                make: 'Suzuki',
                model: 'Alto',
                year: 2023,
                price: 2100000,
                mileage: 15000,
                fuelType: 'Petrol',
                transmission: 'Manual',
                engineCapacity: 660,
                color: 'Grey',
                city: 'Lahore',
                bodyType: 'Hatchback',
                condition: 'Used',
                seller: seller._id,
                contactPhone: '0300-1234567',
                isFeatured: false,
                isActive: true,
                images: [{ url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800' }]
            },
            {
                title: 'Hyundai Tucson GLS',
                slug: makeSlug('Hyundai Tucson GLS') + '4',
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
                bodyType: 'SUV',
                condition: 'Used',
                seller: seller._id,
                contactPhone: '0300-1234567',
                isFeatured: true,
                isActive: true,
                images: [{ url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800' }]
            }
        ];

        await Car.insertMany(cars);

        const count = await Car.countDocuments();
        console.log('\n✓ Created ' + count + ' cars!');
        console.log('\n✅ Success! Check http://localhost:5173/used-cars');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

seedCars();
