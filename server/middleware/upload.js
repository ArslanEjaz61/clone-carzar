const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
const carsDir = path.join(uploadsDir, 'cars');
const avatarsDir = path.join(uploadsDir, 'avatars');

[uploadsDir, carsDir, avatarsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Storage configuration for car images
const carStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, carsDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = `car-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Storage configuration for avatars
const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, avatarsDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = `avatar-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File filter - allow all common image types
const imageFilter = (req, file, cb) => {
    // Expanded list of allowed image types
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
        // Still allow if it looks like an image
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
        fileSize: 10 * 1024 * 1024, // 10MB per file
        files: 15 // Max 15 files
    },
    fileFilter: imageFilter
}).array('images', 15);

// Avatar upload - single image
const uploadAvatar = multer({
    storage: avatarStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
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
    uploadAvatar: handleUpload(uploadAvatar)
};
