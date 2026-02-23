const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

dotenv.config({ path: path.join(__dirname, '.env') });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const Part = require('./models/Part');
const Car = require('./models/Car');

async function migrateImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
        console.log('☁️  Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);
        console.log('');

        let totalMigrated = 0;
        let totalFailed = 0;

        // ========== MIGRATE PARTS ==========
        console.log('📦 ===== MIGRATING PARTS IMAGES =====');
        const parts = await Part.find({});
        console.log(`Found ${parts.length} parts total`);

        for (const part of parts) {
            if (!part.images || part.images.length === 0) continue;

            let updated = false;
            const newImages = [];

            for (const img of part.images) {
                // Skip if already a Cloudinary URL or external URL
                if (img.url && (img.url.includes('cloudinary') || img.url.includes('http'))) {
                    newImages.push(img);
                    continue;
                }

                // Local path like /uploads/cars/car-xxxxx.webp
                if (img.url && img.url.startsWith('/uploads/')) {
                    const localPath = path.join(__dirname, img.url);

                    if (fs.existsSync(localPath)) {
                        try {
                            console.log(`  ⬆️  Uploading: ${img.url}`);
                            const result = await cloudinary.uploader.upload(localPath, {
                                folder: 'carzar/parts',
                                resource_type: 'image',
                                quality: 'auto',
                                fetch_format: 'auto'
                            });

                            newImages.push({
                                url: result.secure_url,
                                publicId: result.public_id
                            });
                            updated = true;
                            totalMigrated++;
                            console.log(`  ✅ Migrated: ${result.secure_url}`);
                        } catch (uploadErr) {
                            console.log(`  ❌ Upload failed for ${img.url}: ${uploadErr.message}`);
                            newImages.push(img); // Keep old URL
                            totalFailed++;
                        }
                    } else {
                        console.log(`  ⚠️  File not found: ${localPath} - removing broken image`);
                        totalFailed++;
                        // Don't add broken image
                    }
                } else {
                    newImages.push(img);
                }
            }

            if (updated || newImages.length !== part.images.length) {
                await Part.findByIdAndUpdate(part._id, { images: newImages });
                console.log(`  📌 Updated part: ${part.title}`);
            }
        }

        // ========== MIGRATE CARS ==========
        console.log('');
        console.log('🚗 ===== MIGRATING CARS IMAGES =====');
        const cars = await Car.find({});
        console.log(`Found ${cars.length} cars total`);

        for (const car of cars) {
            if (!car.images || car.images.length === 0) continue;

            let updated = false;
            const newImages = [];

            for (const img of car.images) {
                // Skip if already a Cloudinary URL or external URL
                if (img.url && (img.url.includes('cloudinary') || img.url.includes('http'))) {
                    newImages.push(img);
                    continue;
                }

                // Local path
                if (img.url && img.url.startsWith('/uploads/')) {
                    const localPath = path.join(__dirname, img.url);

                    if (fs.existsSync(localPath)) {
                        try {
                            console.log(`  ⬆️  Uploading: ${img.url}`);
                            const result = await cloudinary.uploader.upload(localPath, {
                                folder: 'carzar/cars',
                                resource_type: 'image',
                                quality: 'auto',
                                fetch_format: 'auto'
                            });

                            newImages.push({
                                url: result.secure_url,
                                publicId: result.public_id
                            });
                            updated = true;
                            totalMigrated++;
                            console.log(`  ✅ Migrated: ${result.secure_url}`);
                        } catch (uploadErr) {
                            console.log(`  ❌ Upload failed for ${img.url}: ${uploadErr.message}`);
                            newImages.push(img);
                            totalFailed++;
                        }
                    } else {
                        console.log(`  ⚠️  File not found: ${localPath} - removing broken image`);
                        totalFailed++;
                    }
                } else {
                    newImages.push(img);
                }
            }

            if (updated || newImages.length !== car.images.length) {
                await Car.findByIdAndUpdate(car._id, { images: newImages });
                console.log(`  📌 Updated car: ${car.title}`);
            }
        }

        // ========== SUMMARY ==========
        console.log('');
        console.log('==============================');
        console.log(`✅ Total images migrated: ${totalMigrated}`);
        console.log(`❌ Total failed/missing: ${totalFailed}`);
        console.log('==============================');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Error:', error.message);
        process.exit(1);
    }
}

migrateImages();
