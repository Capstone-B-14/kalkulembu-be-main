const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const { signJwt } = require("../utils/authUtils");
const ErrorResponse = require("../utils/errorResponse");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let accessToken;
  let refreshToken;

  // Check if token is in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    accessToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.accessToken) {
    // Set token from cookie
    accessToken = req.cookies.accessToken;
  }

  // Check if refresh token is in cookie
  if (req.cookies.refreshToken) {
    refreshToken = req.cookies.refreshToken;
  }

  try {
    // Verify token
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.user = await prisma.Users.findUnique({
      where: { id: decodedAccessToken.id },
      select: { id: true, name: true, email: true, role: true },
    });

    // Check if the authenticated user's role allows access to Private routes
    if (
      req.user.role === "user" ||
      req.user.role === "farmer" ||
      req.user.role === "admin"
    ) {
      // If authenticated user is a farmer or admin, grant access
      return next();
    } else {
      // If user is not a farmer or admin, return error
      return next(new ErrorResponse("Anda tidak memiliki akses", 403));
    }
  } catch (err) {
    try {
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      // If the refresh token is valid, generate a new access token
      const newAccessToken = signJwt(
        { id: decodedRefreshToken.id },
        process.env.ACCESS_TOKEN_EXPIRE,
        process.env.ACCESS_TOKEN_SECRET
      );

      // Set new access token in cookie
      res.cookie("accessToken", newAccessToken, {
        expires: new Date(
          Date.now() + process.env.ACCESS_TOKEN_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      });

      return next();
    } catch (err) {
      return next(new ErrorResponse("Anda tidak memiliki akses", 401));
    }
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
