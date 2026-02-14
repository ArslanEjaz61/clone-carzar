const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary storage for car images
const carStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'carzar/cars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'bmp', 'tiff'],
        transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }]
    }
});

// Cloudinary storage for avatars
const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'carzar/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }]
    }
});

// File filter - allow all common image types
const imageFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|gif|webp|heic|heif|avif|svg|bmp|tiff|tif|ico/;
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/heic',
        'image/heif',
        'image/avif',
        'image/svg+xml',
        'image/bmp',
        'image/tiff',
        'image/x-icon',
        'image/vnd.microsoft.icon'
    ];

    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('image/');

    if (extname || mimetype) {
        return cb(null, true);
    } else {
        if (file.mimetype.startsWith('image/')) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
};

// Car image upload - multiple images
const uploadCarImages = multer({
    storage: carStorage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB per file
        files: 15 // Max 15 files
    },
    fileFilter: imageFilter
}).array('images', 15);

// Avatar upload - single image
const uploadAvatar = multer({
    storage: avatarStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: imageFilter
}).single('avatar');

// Error handling wrapper
const handleUpload = (uploadFn) => {
    return (req, res, next) => {
        uploadFn(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'File too large'
                    });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({
                        success: false,
                        message: 'Too many files'
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            } else if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            next();
        });
    };
};

module.exports = {
    uploadCarImages: handleUpload(uploadCarImages),
    uploadAvatar: handleUpload(uploadAvatar),
    cloudinary
};
