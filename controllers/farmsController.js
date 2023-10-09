const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all farms
// @route   GET /api/v1/farms
// @route   GET /api/v1/users/:userId/farms
// @access  Public
exports.getAllFarms = asyncHandler(async (req, res, next) => {
  if (Number(req.params.userId)) {
    const farms = await prisma.Farms.findMany({
      where: { user_id: Number(req.params.userId) },
    });

    return res.status(200).json({
      success: true,
      count: farms.length,
      data: farms,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single farm (ID)
// @route   GET /api/v1/farms/:id
// @access  Public
exports.getFarm = asyncHandler(async (req, res, next) => {
  const farm = await prisma.Farms.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!farm) {
    return next(
      new ErrorResponse(`Farm not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    count: farm.length,
    data: farm,
  });
});

// @desc    Create new farm
// @route   POST /api/v1/users/:userId/farms
// @access  Private
exports.createFarm = asyncHandler(async (req, res, next) => {
  req.body.userId = Number(req.params.userId);

  const user = await prisma.Users.findUnique({
    where: { id: Number(req.params.userId) },
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
    );
  }

  // Create an object with the required fields
  const farmData = {
    name: req.body.name,
    user_id: req.body.userId,
    address: req.body.address,
  };

  // Conditionally add the 'photo' field if it's provided in the request body
  if (req.body.photo) {
    farmData.photo = req.body.photo;
  }

  const farm = await prisma.Farms.create({
    data: farmData,
  });

  res.status(201).json({
    success: true,
    data: farm,
  });
});

// @desc    Update farm
// @route   PUT /api/v1/farms/:id
// @access  Private
exports.updateFarm = asyncHandler(async (req, res, next) => {
  let farm = await prisma.Farms.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!farm) {
    return next(
      new ErrorResponse(`Farm not found with id of ${req.params.id}`, 404)
    );
  }

  farm = await prisma.Farms.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });

  res.status(200).json({
    success: true,
    data: farm,
  });
});

// @desc    Delete farm
// @route   DELETE /api/v1/farms/:id
// @access  Private
exports.deleteFarm = asyncHandler(async (req, res, next) => {
  const farm = await prisma.Farms.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!farm) {
    return next(
      new ErrorResponse(`Farm not found with id of ${req.params.id}`, 404)
    );
  }

  await prisma.Farms.delete({
    where: { id: Number(req.params.id) },
  });

  res.status(204).json({
    success: true,
    data: {},
  });
});
