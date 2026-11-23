const cloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    timeout: 30000,
});

// Default storage used across the app.
// If field name is "coverImage", use wider transformation.
const storage = new cloudinaryStorage({
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



const deleteCloudinaryImage = async (imageUrl) => {
    try {
        if (!imageUrl) return null;
        if (!imageUrl.includes("/upload/")) return null;

        // Extract public_id from Cloudinary URL
        const urlParts = imageUrl.split("/upload/");

        if (urlParts.length < 2) {
            return null;
        }

        let publicId = urlParts[1];

        // Remove transformations if present
        publicId = publicId.replace(/^.*?(?=v\d+\/)/, "");

        // Remove version number
        publicId = publicId.replace(/^v\d+\//, "");

        // Remove file extension
        publicId = publicId.replace(/\.[^/.]+$/, "");

        // Delete image from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        return result;

    } catch (error) {
        console.error("Cloudinary deletion error:", error.message);
        throw error;
    }
};
const uploadSellerImage = (file) => new Promise((resolve, reject) => {
	if (!file?.buffer) {
		resolve(null);
		return;
	}

	const stream = cloudinary.uploader.upload_stream(
		{
			folder: "FasalBazar",
			allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
			transformation: [{ width: 500, height: 500, crop: "limit" }]
		},
		(error, result) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(result.secure_url);
		}
	);
	stream.end(file.buffer);
});

module.exports = {
    storage,
    uploadSellerImage,
    deleteCloudinaryImage,
};
