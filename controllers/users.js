const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// @desc    Get all users
// @route   GET /api/v1/users
// @access Public
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user (ID)
// @route   GET /api/v1/users/:id
// @access  Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await prisma.Users.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    count: user.length,
    data: user,
  });
});

// @desc    Create new user
// @route   POST /api/v1/users
// @access  Public
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await prisma.Users.create({
    data: req.body,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});
