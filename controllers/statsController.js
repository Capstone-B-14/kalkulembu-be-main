const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

const ErrorResponse = require("../utils/errorResponse");

// @desc    Get stats for a cattle
// @route   GET /api/v1/cattle/:cattleId/stats
// @access  Public
exports.getCattleStats = asyncHandler(async (req, res, next) => {
  const cattle = await prisma.Cattle.findUnique({
    where: { id: Number(req.params.cattleId) },
  });

  if (!cattle) {
    return next(
      new ErrorResponse(`Cattle not found with id of ${req.params.cattleId}`, 404)
    );
  }

  const stats = await prisma.Stats.findMany({
    where: {
      cattle_id: Number(req.params.cattleId),
      deletedAt: {
        equals: null,
      },
    },
  });

  res.status(200).json({
    success: true,
    count: stats.length,
    data: stats,
  });
});

// @desc    Get stats for a cattle at a specific date
// @route   GET /api/v1/cattle/:cattleId/stats/:date
// @access  Public
exports.getCattleStatsByDate = asyncHandler(async (req, res, next) => {
  const cattle = await prisma.Cattle.findUnique({
    where: { id: Number(req.params.cattleId) },
  });

  if (!cattle) {
    return next(
      new ErrorResponse(`Cattle not found with id of ${req.params.cattleId}`, 404)
    );
  }

  const requestDate = req.params.date.split("T")[0];

  const stats = await prisma.Stats.findFirst({
    where: {
      cattle_id: Number(req.params.cattleId),
      measuredAt: {
        gte: new Date(requestDate),
        lt: new Date(new Date(requestDate).getTime() + 24 * 60 * 60 * 1000),
      },
      deletedAt: {
        equals: null,
      },
    },
  });

  if (!stats) {
    return next(
      new ErrorResponse(`Cattle stats not found for the specified date.`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: stats,
  });
});

// @desc    Create or update cattle stats for a specific date
// @route   POST /api/v1/cattle/:cattleId/stats/:date
// @access  Private
exports.createOrUpdateCattleStats = asyncHandler(async (req, res, next) => {
  const cattle = await prisma.Cattle.findUnique({
    where: { id: Number(req.params.cattleId) },
  });

  if (!cattle) {
    return next(
      new ErrorResponse(`Cattle not found with id of ${req.params.cattleId}`, 404)
    );
  }

  // Restrict creating or updating stats only for the current date (TODAY ONLY)
  const currentDate = new Date().toISOString().split("T")[0];
  console.log(currentDate);

  const requestDate = req.params.date.split("T")[0];

  // No future or past dates allowed
  if (requestDate > currentDate) {
    return next(
      new ErrorResponse(`Cannot create or update stats for future dates.`, 400)
    );
  } else if (requestDate < currentDate) {
    return next(
      new ErrorResponse(`Cannot create or update stats for past dates.`, 400)
    );
  } else {
    // Check if stats already exist for the current date
    const existingStats = await prisma.Stats.findFirst({
      where: {
        cattle_id: Number(req.params.cattleId),
        measuredAt: req.params.date,
      },
    });

    if (existingStats) {
      // Update stats
      const updatedStats = await prisma.Stats.update({
        where: { id: existingStats.id },
        data: {
          ...req.body,
          cattle_id: Number(existingStats.cattleId),
        },
      });

      res.status(200).json({
        success: true,
        data: updatedStats,
      });
    } else {
      // Create stats
      const stats = await prisma.Stats.create({
        data: {
          ...req.body,
          cattle_id: Number(req.params.cattleId),
          measuredAt: req.params.date,
        },
      });

      res.status(201).json({
        success: true,
        data: stats,
      });
    }
  }
});

// @desc    Delete cattle stats for a specific date (soft delete)
// @route   PUT /api/v1/cattle/:cattleId/stats/:date
// @access  Private (Admin only)
exports.deleteCattleStats = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete stats.`,
        403
      )
    );
  }

  const statsToDelete = await prisma.Stats.findFirst({
    where: {
      cattle_id: Number(req.params.cattleId),
      measuredAt: req.params.date,
    },
  });

  if (statsToDelete) {
    // Update stats
    await prisma.Stats.update({
      where: { id: statsToDelete.id },
      data: {
        deletedAt: new Date().toISOString(),
      },
    });
  }

  if (!statsToDelete) {
    return next(
      new ErrorResponse(
        `Cattle stats not found for cattle with id ${req.params.cattleId} on date ${req.params.date}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    message: "Stats deleted successfully.",
  });
});
