// Custom error handler
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ErrorResponse = require("../utils/errorResponse");

function errorHandler(err, req, res, next) {
  let error = { ...err };

  error.message = err.message;

  // Log error to console
  console.log(err);

  // Prisma record not found
  if (error.code === "P2025") {
    const message = `Resource tidak ditemukan dengan id ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
}

module.exports = errorHandler;
