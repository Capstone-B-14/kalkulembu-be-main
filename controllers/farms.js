const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all farms
// @route   GET /api/v1/farms
// @route   GET /api/v1/users/:userId/farms
// @access  Public
exports.getAllFarms = asyncHandler(async (req, res, next) => {
  if (req.params.userId) {
    const farms = await prisma.Farms.findMany({
      where: { userId: req.params.userId },
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
  req.body.userId = req.params.userId;

  const user = await prisma.Users.findUnique({
    where: { id: Number(req.params.userId) },
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
    );
  }

  const farm = await prisma.Farms.create({
    data: {
      name: req.body.name,
      userId: Number(req.body.userId),
    },
  });

  res.status(201).json({
    success: true,
    data: farm,
  });
});
