const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Default storage used across the app.
// If field name is "coverImage", use wider transformation.
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "FasalBazar",
        allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
        transformation:[{ width: 500, height: 500, crop: "limit" }]
    }),
});

// // Explicit storage export in case a route wants a dedicated cover-image uploader.
// const storageCoverImage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//         folder: "bloggytech",
//         allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
//         transformation: [{ width: 1000, height: 500, crop: "limit" }],
//     },
// });

module.exports = storage;
module.exports.storage = storage;
// module.exports.storageCoverImage = storageCoverImage;
