const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

const ErrorResponse = require("../utils/errorResponse");
const { uploadToCloudinary } = require("../utils/cloudinary");

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

// @desc    Get latest cattle stats in a farm
// @route   GET /api/v1/farms/:farmId/cattle/latest
// @access  Public
exports.getLatestCattleStatsPerFarm = asyncHandler(async (req, res, next) => {
  if (Number(req.params.farmId)) {
    const cattleInFarm = await prisma.Cattle.findMany({
      where: { farm_id: Number(req.params.farmId) },
    });

    if (!cattleInFarm) {
      return next(
        new ErrorResponse(
          `Cattle not found for farm with id ${req.params.farmId}`,
          404
        )
      );
    }

    const cattleWithLatestStats = [];

    for (const cattle of cattleInFarm) {
      const latestStats = await prisma.Stats.findFirst({
        where: {
          cattle_id: cattle.id,
          deletedAt: {
            equals: null,
          },
        },
        orderBy: {
          measuredAt: "desc",
        },
      });

      cattle.latestStats = latestStats;
      cattleWithLatestStats.push(cattle);

      // If there are no latest stats, create a dummy stats object
      if (!latestStats) {
        cattle.latestStats = {
          id: null,
          cattle_id: cattle.id,
          age: 0, // Default age
          weight: 0, // Default weight
          healthy: false, // Default health status
          measuredAt: new Date().toISOString(), // Current timestamp
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        };
      } else {
        cattle.latestStats = latestStats;
      }
    }

    res.status(200).json({
      success: true,
      count: cattleWithLatestStats.length,
      data: cattleWithLatestStats,
    });
  }
});

// @desc    Get latest cattle stats in a farm (ID)
// @route   GET /api/v1/farms/:farmId/cattle/:cattleId/latest
// @access  Public
exports.getOneCattleStatsPerFarm = asyncHandler(async (req, res, next) => {
  if (Number(req.params.farmId) && Number(req.params.cattleId)) {
    const cattleInFarm = await prisma.Cattle.findUnique({
      where: {
        id: Number(req.params.cattleId),
        farm_id: Number(req.params.farmId),
      },
    });

    if (!cattleInFarm) {
      return next(
        new ErrorResponse(
          `Cattle not found for farm with id ${req.params.farmId}`,
          404
        )
      );
    }

    cattleArray = [];
    const cattleWithLatestStats = [];
    cattleArray.push(cattleInFarm);

    for (const cattle of cattleArray) {
      const latestStats = await prisma.Stats.findFirst({
        where: {
          cattle_id: cattle.id,
          deletedAt: {
            equals: null,
          },
        },
        orderBy: {
          measuredAt: "desc",
        },
      });

      cattle.latestStats = latestStats || null;
      cattleWithLatestStats.push(cattle);

      if (!latestStats) {
        return next(
          new ErrorResponse(
            `No latest stats found for cattle with id ${req.params.cattleId}.`,
            404
          )
        );
      }
    }

    res.status(200).json({
      success: true,
      count: cattleWithLatestStats.length,
      data: cattleWithLatestStats,
    });
  }
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
