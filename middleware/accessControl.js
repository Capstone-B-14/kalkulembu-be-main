const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const ErrorResponse = require("../utils/errorResponse");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token is in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // Check if token is in cookie
  if (!token) {
    return next(new ErrorResponse("Anda tidak memiliki akses", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await prisma.Users.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true },
    });

    next();
  } catch (err) {
    return next(new ErrorResponse("Anda tidak memiliki akses", 401));
  }
});
