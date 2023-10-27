const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

const ErrorResponse = require("../utils/errorResponse");
const {
  createUserWithHashedPassword,
  updateUserPasswordWithHashedPassword,
  comparePassword,
  getResetPasswordToken,
  getUserByEmailWithPass,
  sendTokenResponse,
} = require("../utils/authUtils");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Create user with hashed password
  const user = await createUserWithHashedPassword({ name, email, password });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password)
    return next(new ErrorResponse("Masukkan email dan password Anda", 400));

  // Check for user with the password field
  const user = await getUserByEmailWithPass(email);

  if (!user) {
    return next(new ErrorResponse("Email atau kata sandi salah", 401));
  }

  // Check if the user has a role. If not, assign the "user" role.
  if (!user.role) {
    user.role = "user";
    await prisma.Users.update({
      where: { id: user.id },
      data: { role: "user" },
    });
  }

  // Check if password matches
  const isMatch = await comparePassword(email, password);

  if (!isMatch) {
    return next(new ErrorResponse("Email atau kata sandi salah", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Logout user / clear cookies
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
    message: "Anda telah keluar dari aplikasi",
  });
});

// @desc    Get currently logged in user
// @route   POST /api/v1/auth/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await prisma.Users.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photo: true,
      role: true,
    },
  });

  res.status(200).json({
    success: true,
    data: {
      user: user,
    },
  });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    photo: req.body.photo,
  };

  const user = await prisma.Users.update({
    where: { id: req.user.id },
    data: fieldsToUpdate,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update password
// @route   PUT /api/v1/auth/profile/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Check current password
  const isPasswordMatch = await comparePassword(
    req.user.email,
    currentPassword.toString()
  );

  if (!isPasswordMatch) {
    return next(new ErrorResponse("Password saat ini salah", 401));
  }

  // Check if new password is the same as the current password
  if (currentPassword == newPassword) {
    return next(
      new ErrorResponse(
        "Password baru tidak boleh sama dengan password saat ini",
        401
      )
    );
  }

  // Validate the new password
  if (newPassword.toString().length < 6) {
    return next(
      new ErrorResponse("Password baru harus memiliki minimal 6 karakter", 401)
    );
  }

  // Update the password with the new hashed password
  await updateUserPasswordWithHashedPassword(req.user.id, newPassword);

  sendTokenResponse(req.user, 200, res);
});
