const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const { uploadToCloudinary } = require("../utils/cloudinary")
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

  const file = req.files.file;

  try {
    const imageUrl = await uploadToCloudinary(file, cattle.id);
    console.log(imageUrl)
    await prisma.Images.create({
      data: {
        cattle_id: Number(req.params.cattleId),
        url: imageUrl,
      },
    });

    res.status(200).json({
      success: true,
      data: imageUrl,
    });

  } catch (error) {
    next(error);
  }
});


// @desc    Upload user profile image
// @route   PUT /api/v1/users/:userId/photo
// @access  Private
exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
  const user = await prisma.Users.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.user.id}`, 404));
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  if (!file) {
    return next(new ErrorResponse('File object is undefined', 400));
  }

  try {
    const imageUrl = await uploadToCloudinary(file, user.id);
    await prisma.Users.update({
      where: { id: user.id },
      data: {
        photo: imageUrl,
      },
    });

    res.status(200).json({
      success: true,
      data: imageUrl,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});




