require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Car = require('./models/Car');
const User = require('./models/User');

const addTestCar = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find admin user
        const admin = await User.findOne({ email: 'yasir@carzar.com' });
        if (!admin) {
            console.log('Admin user not found! Run createAdmin.js first.');
            process.exit(1);
        }
        console.log('Found admin:', admin.name);

        // Create test car
        const carData = {
            title: 'Honda Civic Oriel 1.8 i-VTEC CVT',
            make: 'Honda',
            model: 'Civic',
            variant: 'Oriel',
            year: 2022,
            price: 6500000,
            mileage: 25000,
            fuelType: 'Petrol',
            transmission: 'Automatic',
            engineCapacity: 1800,
            color: 'White',
            bodyType: 'Sedan',
            city: 'Lahore',
            registrationCity: 'Lahore',
            assembly: 'Local',
            condition: 'Used',
            description: 'Excellent condition Honda Civic with all original parts. First owner, well maintained.',
            features: ['Air Conditioning', 'Power Steering', 'Power Windows', 'ABS', 'Airbags', 'Navigation', 'Rear Camera'],
            contactPhone: '0300-1234567',
            seller: admin._id,
            isFeatured: true,
            isActive: true,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
                    publicId: 'civic-1'
                }
            ]
        };

        const car = await Car.create(carData);
        console.log('\n✓ Car Added Successfully!');
        console.log('Title:', car.title);
        console.log('Price:', car.price);
        console.log('City:', car.city);
        console.log('ID:', car._id);

        // Also add a Toyota Corolla
        const car2Data = {
            title: 'Toyota Corolla GLi 1.3 VVTi',
            make: 'Toyota',
            model: 'Corolla',
            variant: 'GLi',
            year: 2021,
            price: 4200000,
            mileage: 35000,
            fuelType: 'Petrol',
            transmission: 'Manual',
            engineCapacity: 1300,
            color: 'Silver',
            bodyType: 'Sedan',
            city: 'Karachi',
            registrationCity: 'Karachi',
            assembly: 'Local',
            condition: 'Used',
            description: 'Well maintained Toyota Corolla. Company fitted CNG available.',
            features: ['Air Conditioning', 'Power Steering', 'Power Windows', 'ABS'],
            contactPhone: '0321-9876543',
            seller: admin._id,
            isFeatured: true,
            isActive: true,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
                    publicId: 'corolla-1'
                }
            ]
        };

        const car2 = await Car.create(car2Data);
        console.log('\n✓ Car 2 Added Successfully!');
        console.log('Title:', car2.title);

        // Add a new car as well
        const car3Data = {
            title: 'KIA Sportage Alpha AWD 2024',
            make: 'KIA',
            model: 'Sportage',
            variant: 'Alpha AWD',
            year: 2024,
            price: 10500000,
            mileage: 0,
            fuelType: 'Petrol',
            transmission: 'Automatic',
            engineCapacity: 2000,
            color: 'Black',
            bodyType: 'SUV',
            city: 'Islamabad',
            registrationCity: 'Islamabad',
            assembly: 'Local',
            condition: 'New',
            description: 'Brand new KIA Sportage with full warranty.',
            features: ['Air Conditioning', 'Power Steering', 'Power Windows', 'ABS', 'Airbags', 'Sunroof', 'Navigation', 'Rear Camera', 'Cruise Control', 'Push Start'],
            contactPhone: '0333-5555555',
            seller: admin._id,
            isFeatured: true,
            isActive: true,
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
                    publicId: 'sportage-1'
                }
            ]
        };

        const car3 = await Car.create(car3Data);
        console.log('\n✓ Car 3 Added Successfully!');
        console.log('Title:', car3.title);

        console.log('\n========================================');
        console.log('All test cars added! Check website now.');
        console.log('========================================');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

addTestCar();
