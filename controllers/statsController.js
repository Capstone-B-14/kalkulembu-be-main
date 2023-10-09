const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

const ErrorResponse = require("../utils/errorResponse");

// @desc    Get stats for a cow
// @route   GET /api/v1/cows/:cowId/stats
// @access  Public
exports.getCowStats = asyncHandler(async (req, res, next) => {
  const cow = await prisma.Cows.findUnique({
    where: { id: Number(req.params.cowId) },
  });

  if (!cow) {
    return next(
      new ErrorResponse(`Cow not found with id of ${req.params.cowId}`, 404)
    );
  }

  const stats = await prisma.Stats.findMany({
    where: { cow_id: Number(req.params.cowId) },
  });

  res.status(200).json({
    success: true,
    count: stats.length,
    data: stats,
  });
});

// @desc    Get stats for a cow at a specific date
// @route   GET /api/v1/cows/:cowId/stats/:date
// @access  Public
exports.getCowStatsByDate = asyncHandler(async (req, res, next) => {
  const cow = await prisma.Cows.findUnique({
    where: { id: Number(req.params.cowId) },
  });

  if (!cow) {
    return next(
      new ErrorResponse(`Cow not found with id of ${req.params.cowId}`, 404)
    );
  }

  const stats = await prisma.Stats.findFirst({
    where: {
      cow_id: Number(req.params.cowId),
      measuredAt: req.params.date,
    },
  });

  if (!stats) {
    return next(
      new ErrorResponse(`Cow stats not found for the specified date.`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: stats,
  });
});

// @desc    Create or update cow stats for a specific date
// @route   POST /api/v1/cows/:cowId/stats/:date
// @access  Private
exports.createOrUpdateCowStats = asyncHandler(async (req, res, next) => {
  const cow = await prisma.Cows.findUnique({
    where: { id: Number(req.params.cowId) },
  });

  if (!cow) {
    return next(
      new ErrorResponse(`Cow not found with id of ${req.params.cowId}`, 404)
    );
  }

  // Restrict creating or updating stats only for the current date (TODAY ONLY)
  const currentDate = new Date().toISOString().split("T")[0];

  // No future or past dates allowed
  if (req.params.date > currentDate) {
    return next(
      new ErrorResponse(`Cannot create or update stats for future dates.`, 400)
    );
  } else if (req.params.date < currentDate) {
    return next(
      new ErrorResponse(`Cannot create or update stats for past dates.`, 400)
    );
  } else {
    // Check if stats already exist for the current date
    const existingStats = await prisma.Stats.findFirst({
      where: {
        cow_id: Number(req.params.cowId),
        measuredAt: req.params.date,
      },
    });

    if (existingStats) {
      // Update stats
      const updatedStats = await prisma.Stats.update({
        where: { id: existingStats.id },
        data: {
          ...req.body,
          cow_id: Number(existingStats.cowId),
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
          cow_id: Number(req.params.cowId),
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

// @desc    Delete cow stats for a specific date (soft delete)
// @route   DELETE /api/v1/cows/:cowId/stats/:date
// @access  Private (Admin only)
exports.deleteCowStats = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (!req.user.isAdmin) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete stats.`, 401)
    );
  }
})