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

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await prisma.Users.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    // Check if the authenticated user's role allows access to Private routes
    if (req.user.role === "user" || req.user.role === "farmer" || req.user.role === "admin") {
      // If authenticated user is a farmer or admin, grant access
      return next();
    }

    // If user is not a farmer or admin, return error
    return next(new ErrorResponse("Anda tidak memiliki akses", 403));
  } catch (err) {
    return next(new ErrorResponse("Anda tidak memiliki akses", 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // If user is not an admin, return error
      return next(new ErrorResponse(`${req.user.role} is not authorized`, 403));
    }
    next();
  };
};
