const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Car = require('./models/Car');
const User = require('./models/User');

const sampleCars = [
    // ===== USED CARS =====
    {
        title: 'Toyota Corolla GLi 1.3 VVTi 2019',
        make: 'Toyota',
        model: 'Corolla',
        variant: 'GLi 1.3 VVTi',
        year: 2019,
        price: 3850000,
        mileage: 45000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        engineCapacity: 1300,
        color: 'White',
        bodyType: 'Sedan',
        city: 'Lahore',
        registrationCity: 'Lahore',
        assembly: 'Local',
        condition: 'Used',
        description: 'Well maintained Toyota Corolla GLi 2019. First owner, genuine condition. All documents clear. No accident history.',
        features: ['Power Steering', 'Power Windows', 'Air Conditioning', 'CD Player', 'Alloy Rims'],
        contactPhone: '0300-1111111',
        isFeatured: true,
        isActive: true,
        images: [{ url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=500&fit=crop', public_id: 'seed_corolla' }]
    },
    {
        title: 'Honda Civic Oriel 1.8 2020',
        make: 'Honda',
        model: 'Civic',
        variant: 'Oriel 1.8',
        year: 2020,
        price: 5200000,
        mileage: 32000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1800,
        color: 'Black',
        bodyType: 'Sedan',
        city: 'Karachi',
        registrationCity: 'Karachi',
        assembly: 'Local',
        condition: 'Used',
        description: 'Honda Civic Oriel 1.8 in excellent condition. Sunroof, leather seats, navigation system. Single owner.',
        features: ['Sunroof', 'Navigation', 'Leather Seats', 'Cruise Control', 'Push Start', 'Rear Camera'],
        contactPhone: '0321-2222222',
        isFeatured: true,
        isActive: true,
        images: [{ url: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&h=500&fit=crop', public_id: 'seed_civic' }]
    },
    {
        title: 'Suzuki Alto VXR 2021',
        make: 'Suzuki',
        model: 'Alto',
        variant: 'VXR',
        year: 2021,
        price: 2150000,
        mileage: 28000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        engineCapacity: 660,
        color: 'Silver',
        bodyType: 'Hatchback',
        city: 'Islamabad',
        registrationCity: 'Islamabad',
        assembly: 'Local',
        condition: 'Used',
        description: 'Suzuki Alto VXR 2021 model. Perfect city car. Fuel efficient, low maintenance. Complete documents available.',
        features: ['Air Conditioning', 'Power Steering', 'CD Player', 'Central Locking'],
        contactPhone: '0333-3333333',
        isFeatured: true,
        isActive: true,
        images: [{ url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=500&fit=crop', public_id: 'seed_alto' }]
    },
    {
        title: 'Toyota Yaris ATIV X CVT 1.5 2022',
        make: 'Toyota',
        model: 'Yaris',
        variant: 'ATIV X CVT 1.5',
        year: 2022,
        price: 4500000,
        mileage: 18000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1500,
        color: 'Red',
        bodyType: 'Sedan',
        city: 'Rawalpindi',
        registrationCity: 'Rawalpindi',
        assembly: 'Local',
        condition: 'Used',
        description: 'Toyota Yaris top of the line ATIV X variant. CVT transmission, 7 airbags, multi-info display. Excellent condition.',
        features: ['7 Airbags', 'Push Start', 'Alloy Rims', 'Rear Camera', 'Fog Lights', 'Keyless Entry'],
        contactPhone: '0345-4444444',
        isFeatured: true,
        isActive: true,
        images: [{ url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=500&fit=crop', public_id: 'seed_yaris' }]
    },
    {
        title: 'KIA Sportage AWD 2020',
        make: 'KIA',
        model: 'Sportage',
        variant: 'AWD',
        year: 2020,
        price: 6800000,
        mileage: 40000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 2000,
        color: 'Grey',
        bodyType: 'SUV',
        city: 'Lahore',
        registrationCity: 'Lahore',
        assembly: 'Local',
        condition: 'Used',
        description: 'KIA Sportage AWD with panoramic sunroof. All wheel drive. Very well maintained with complete service history.',
        features: ['Panoramic Sunroof', 'AWD', 'Leather Seats', 'Heated Seats', 'Rear Camera', 'Parking Sensors'],
        contactPhone: '0312-5555555',
        isFeatured: true,
        isActive: true,
        images: [{ url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=500&fit=crop', public_id: 'seed_sportage' }]
    },

    // ===== NEW CARS =====
    {
        title: 'Toyota Corolla Altis Grande 2025',
        make: 'Toyota',
        model: 'Corolla',
        variant: 'Altis Grande',
        year: 2025,
        price: 7250000,
        mileage: 0,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1800,
        color: 'Pearl White',
        bodyType: 'Sedan',
        city: 'Lahore',
        registrationCity: 'Lahore',
        assembly: 'Local',
        condition: 'New',
        description: 'Brand new Toyota Corolla Altis Grande 2025. Top of the line with all premium features. Zero meter.',
        features: ['TSS', 'Lane Departure', 'Adaptive Cruise', 'Leather Seats', 'Sunroof', 'Push Start'],
        contactPhone: '0300-6666666',
        isFeatured: true,
        isActive: true,
        images: [{ url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=500&fit=crop', public_id: 'seed_grande_new' }]
    },
    {
        title: 'Honda Civic RS Turbo 2025',
        make: 'Honda',
        model: 'Civic',
        variant: 'RS Turbo',
        year: 2025,
        price: 8900000,
        mileage: 0,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1500,
        color: 'Platinum White',
        bodyType: 'Sedan',
        city: 'Karachi',
        registrationCity: 'Karachi',
        assembly: 'Local',
        condition: 'New',
        description: 'All new Honda Civic RS Turbo with 1.5L VTEC Turbo engine. Sporty design with premium interior. Zero km.',
        features: ['Turbo Engine', 'Honda Sensing', 'Wireless Carplay', 'Bose Sound', 'Heads Up Display'],
        contactPhone: '0321-7777777',
        isFeatured: true,
        isActive: true,
        images: [{ url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=500&fit=crop', public_id: 'seed_civic_new' }]
    },
    {
        title: 'Hyundai Tucson GLS Sport 2025',
        make: 'Hyundai',
        model: 'Tucson',
        variant: 'GLS Sport',
        year: 2025,
        price: 9500000,
        mileage: 0,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 2000,
        color: 'Amazon Grey',
        bodyType: 'SUV',
        city: 'Islamabad',
        registrationCity: 'Islamabad',
        assembly: 'Local',
        condition: 'New',
        description: 'Brand new Hyundai Tucson GLS Sport. Premium SUV with advanced safety features and bold design.',
        features: ['Panoramic Sunroof', 'Ventilated Seats', 'ADAS', '360 Camera', 'Wireless Charging', 'LED Headlamps'],
        contactPhone: '0333-8888888',
        isFeatured: true,
        isActive: true,
        images: [{ url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=500&fit=crop', public_id: 'seed_tucson_new' }]
    },
    {
        title: 'Changan Alsvin Lumiere 2025',
        make: 'Changan',
        model: 'Alsvin',
        variant: 'Lumiere',
        year: 2025,
        price: 4200000,
        mileage: 0,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1500,
        color: 'Crystal Blue',
        bodyType: 'Sedan',
        city: 'Multan',
        registrationCity: 'Multan',
        assembly: 'Local',
        condition: 'New',
        description: 'New Changan Alsvin Lumiere with premium features at affordable price. Spacious interior, modern design.',
        features: ['Cruise Control', 'Touchscreen', 'Rear Camera', 'Alloy Rims', 'Fog Lights', 'Keyless Entry'],
        contactPhone: '0345-9999999',
        isFeatured: true,
        isActive: true,
        images: [{ url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=500&fit=crop', public_id: 'seed_alsvin_new' }]
    },
    {
        title: 'MG HS Essence 2025',
        make: 'MG',
        model: 'HS',
        variant: 'Essence',
        year: 2025,
        price: 7800000,
        mileage: 0,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1500,
        color: 'Dover White',
        bodyType: 'SUV',
        city: 'Faisalabad',
        registrationCity: 'Faisalabad',
        assembly: 'Local',
        condition: 'New',
        description: 'MG HS Essence - turbocharged 1.5L engine, panoramic sunroof, digital instrument cluster. Zero meter.',
        features: ['Panoramic Sunroof', 'Turbo Engine', 'Digital Cluster', 'i-SMART', '360 Camera', 'ADAS'],
        contactPhone: '0311-1010101',
        isFeatured: true,
        isActive: true,
        images: [{ url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop', public_id: 'seed_mg_hs_new' }]
    }
];

async function seedCars() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        let seller = await User.findOne({ role: 'admin' });
        if (!seller) seller = await User.findOne();

        if (!seller) {
            console.log('❌ No user found. Create a user first.');
            process.exit(1);
        }

        console.log('👤 Seller: ' + seller.name + ' (' + seller.email + ')');

        // Clear old seed cars
        const seedPhones = ['0300-1111111', '0321-2222222', '0333-3333333', '0345-4444444', '0312-5555555', '0300-6666666', '0321-7777777', '0333-8888888', '0345-9999999', '0311-1010101'];
        await Car.deleteMany({ contactPhone: { $in: seedPhones } });
        console.log('🗑️  Cleared old seed cars');

        const carsWithSeller = sampleCars.map(car => ({
            ...car,
            seller: seller._id
        }));

        // Use new + save (not insertMany) to trigger pre-save slug hook
        const result = [];
        for (const carData of carsWithSeller) {
            const car = new Car(carData);
            await car.save();
            result.push(car);
            console.log('  📌 ' + car.title + ' - PKR ' + car.price.toLocaleString() + ' (' + car.condition + ')');
        }

        console.log('✅ Added ' + result.length + ' cars!');

        const usedCount = result.filter(c => c.condition === 'Used').length;
        const newCount = result.filter(c => c.condition === 'New').length;
        console.log('🚗 Used Cars: ' + usedCount);
        console.log('🆕 New Cars: ' + newCount);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seedCars();
