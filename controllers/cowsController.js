const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all cows
// @route   GET /api/v1/cows
// @route   GET /api/v1/farms/:farmId/cows
// @access  Public
exports.getAllCows = asyncHandler(async (req, res, next) => {
  if (Number(req.params.farmId)) {
    const cows = await prisma.Cows.findMany({
      where: { farm_id: Number(req.params.farmId) },
    });

    return res.status(200).json({
      success: true,
      count: cows.length,
      data: cows,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single cow (ID)
// @route   GET /api/v1/cows/:id
// @access  Public
exports.getCow = asyncHandler(async (req, res, next) => {
  const cow = await prisma.Cows.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!cow) {
    return next(
      new ErrorResponse(`Cow not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    count: cow.length,
    data: cow,
  });
});

// @desc    Create new cow
// @route   POST /api/v1/farms/:farmId/cows
// @access  Private
exports.createCow = asyncHandler(async (req, res, next) => {
  req.body.farmId = Number(req.params.farmId);

  const farm = await prisma.Farms.findUnique({
    where: { id: Number(req.params.farmId) },
  });

  if (!farm) {
    return next(
      new ErrorResponse(`Farm not found with id of ${req.params.farmId}`, 404)
    );
  }

  const cow = await prisma.Cows.create({
    data: req.body,
  });

  res.status(201).json({
    success: true,
    data: cow,
  });
});

// @desc    Update cow
// @route   PUT /api/v1/cows/:id
// @access  Private
exports.updateCow = asyncHandler(async (req, res, next) => {
  let cow = await prisma.Cows.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!cow) {
    return next(
      new ErrorResponse(`Cow not found with id of ${req.params.id}`, 404)
    );
  }

  cow = await prisma.Cows.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });

  res.status(200).json({
    success: true,
    data: cow,
  });
});

// @desc    Delete cow
// @route   DELETE /api/v1/cows/:id
// @access  Private
exports.deleteCow = asyncHandler(async (req, res, next) => {
  const cow = await prisma.Cows.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!cow) {
    return next(
      new ErrorResponse(`Cow not found with id of ${req.params.id}`, 404)
    );
  }

  await prisma.Cows.delete({
    where: { id: Number(req.params.id) },
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});
