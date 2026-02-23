const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Car = require('./models/Car');
const Part = require('./models/Part');

async function checkDB() {
    await mongoose.connect(process.env.MONGO_URI);

    const totalCars = await Car.countDocuments();
    const totalParts = await Part.countDocuments();
    const featuredCars = await Car.countDocuments({ isFeatured: true });
    const featuredParts = await Part.countDocuments({ isFeatured: true });
    const usedCars = await Car.countDocuments({ condition: 'Used' });
    const newCars = await Car.countDocuments({ condition: 'New' });

    console.log('=== DATABASE STATUS ===');
    console.log('Total Cars: ' + totalCars);
    console.log('Total Parts: ' + totalParts);
    console.log('Featured Cars: ' + featuredCars);
    console.log('Featured Parts: ' + featuredParts);
    console.log('Used Cars: ' + usedCars);
    console.log('New Cars: ' + newCars);

    if (totalCars > 0) {
        const cars = await Car.find().limit(3).select('title condition isFeatured images');
        cars.forEach(c => {
            const imgUrl = c.images && c.images[0] ? c.images[0].url.substring(0, 50) : 'NO IMAGE';
            console.log('  Car: ' + c.title + ' | ' + c.condition + ' | Featured:' + c.isFeatured + ' | Img:' + imgUrl);
        });
    }

    if (totalParts > 0) {
        const parts = await Part.find().limit(3).select('title isFeatured images');
        parts.forEach(p => {
            const imgUrl = p.images && p.images[0] ? p.images[0].url.substring(0, 50) : 'NO IMAGE';
            console.log('  Part: ' + p.title + ' | Featured:' + p.isFeatured + ' | Img:' + imgUrl);
        });
    }

    process.exit(0);
}

checkDB();
