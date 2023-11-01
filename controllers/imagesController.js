const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const path = require("path");

const cloudinary = require("cloudinary").v2;

const ErrorResponse = require("../utils/errorResponse");

// @desc    Upload cattle image
// @route   POST /api/v1/cattle/:cattleId/images
// @access  Private
exports.cattlePhotoUpload = asyncHandler(async (req, res, next) => {
  const cattle = await prisma.Cattle.findUnique({
    where: { id: Number(req.params.cattleId) },
  });

  if (!cattle) {
    return next(
      new ErrorResponse(`Cattle not found with id of ${req.params.cattleId}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  console.log(req.files);
  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Ukuran foto maksimal ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${cattle.id}${path.parse(file.name).ext}`;

  cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await prisma.Images.create({
      data: {
        cattle_id: Number(req.params.cattleId),
        url: result.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      data: result.secure_url,
    });
  });
});

// Cloudinary Upload
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: process.env.NODE_ENV === "development" ? false : true,
});

exports.uploadCloudinary = asyncHandler(async (imagePath, req, res, next) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
});
