const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

const ErrorResponse = require("../utils/errorResponse");
const { uploadToCloudinary } = require('../utils/cloudinary');

// @desc    Get all cattle
// @route   GET /api/v1/cattle
// @route   GET /api/v1/farms/:farmId/cattle
// @access  Public
exports.getAllCattle = asyncHandler(async (req, res, next) => {
  if (Number(req.params.farmId)) {
    const cattle = await prisma.Cattle.findMany({
      where: { farm_id: Number(req.params.farmId) },
    });

    return res.status(200).json({
      success: true,
      count: cattle.length,
      data: cattle,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single cattle (ID)
// @route   GET /api/v1/cattle/:id
// @access  Public
exports.getCattle = asyncHandler(async (req, res, next) => {
  const cattle = await prisma.Cattle.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!cattle) {
    return next(
      new ErrorResponse(`Cattle not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    count: cattle.length,
    data: cattle,
  });
});

// @desc    Create new cattle
// @route   POST /api/v1/farms/:farmId/cattle
// @access  Private
exports.createCattle = asyncHandler(async (req, res, next) => {
  req.body.farmId = Number(req.params.farmId);

  const farm = await prisma.Farms.findUnique({
    where: { id: Number(req.params.farmId) },
  });

  if (!farm) {
    return next(
      new ErrorResponse(`Farm not found with id of ${req.params.farmId}`, 404)
    );
  }

  // Create an object with the required fields
  const cattleData = {
    name: req.body.name,
    farm_id: req.body.farmId,
    sex: req.body.sex,
  };

  const cattle = await prisma.Cattle.create({
    data: cattleData,
  });

  res.status(201).json({
    success: true,
    data: cattle,
  });
});

// @desc    Update cattle
// @route   PUT /api/v1/cattle/:id
// @access  Private
exports.updateCattle = asyncHandler(async (req, res, next) => {
  let cattle = await prisma.Cattle.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!cattle) {
    return next(
      new ErrorResponse(`Cattle not found with id of ${req.params.id}`, 404)
    );
  }

  cattle = await prisma.Cattle.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });

  res.status(200).json({
    success: true,
    data: cattle,
  });
});

// @desc    Delete cattle
// @route   DELETE /api/v1/cattle/:id
// @access  Private
exports.deleteCattle = asyncHandler(async (req, res, next) => {
  const cattle = await prisma.Cattle.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!cattle) {
    return next(
      new ErrorResponse(`Cattle not found with id of ${req.params.id}`, 404)
    );
  }

  await prisma.Cattle.delete({
    where: { id: Number(req.params.id) },
  });

  res.status(204).json({
    success: true,
    data: {},
  });
});

exports.cattlePhotoUpload = asyncHandler(async (req, res, next) => {
  // ... previous logic to check for file and cattle
  try {
    const imageUrl = await uploadToCloudinary(file);

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