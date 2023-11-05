const cloudinary = require('cloudinary').v2;
const asyncHandler = require('express-async-handler');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: process.env.NODE_ENV === 'development' ? false : true,
});

exports.uploadToCloudinary = asyncHandler(async (file, identifier) => {
    if (!file.mimetype.startsWith('image')) {
        throw new ErrorResponse('Please upload an image file', 400);
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
        throw new ErrorResponse(`File size exceeds the limit of ${process.env.MAX_FILE_UPLOAD}`, 400);
    }

    // Create custom filename with the provided identifier
    const fileExtension = path.parse(file.name).ext;
    const customFileName = `photo_${identifier}${fileExtension}`;

    try {
        // Use the Cloudinary uploader to upload the image
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            public_id: customFileName,
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        });

        console.log(result.secure_url)
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new ErrorResponse('Problem with file upload', 500);
    }
});