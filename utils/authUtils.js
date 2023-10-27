const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const asyncExample = async () => {};

// Function to hash password
const createUserWithHashedPassword = async ({ name, email, password }) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return prisma.Users.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
};

// Function to update user's password with a hashed password
const updateUserPasswordWithHashedPassword = async (userId, newPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword.toString(), salt);

  return prisma.Users.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });
};

// Function to sign JWT token
const signJwt = (payload, expiresIn, secret) => {
  return jwt.sign(payload, secret, { expiresIn });
};

// Function to match password
const comparePassword = async (email, enteredPassword) => {
  const user = await prisma.Users.findFirst({
    where: {
      email: email,
    },
    select: { password: true }, // Select the password field
  });

  if (!user) {
    return false; // User not found
  }

  return bcrypt.compare(enteredPassword, user.password);
};

// Function to generate and hash password token
const getResetPasswordToken = () => {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return { resetToken, resetPasswordToken };
};

// Function to retrieve a user by email with the password field
const getUserByEmailWithPass = async (email) => {
  const user = await prisma.Users.findFirst({
    where: { email: email },
    select: { password: true }, // Select the password field
  });

  return user;
};

// Utility function to send JWT token in response
const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = signJwt(
    { id: user.id },
    process.env.ACCESS_TOKEN_EXPIRE,
    process.env.ACCESS_TOKEN_SECRET
  );
  const refreshToken = signJwt(
    { id: user.id }, 
    process.env.REFRESH_TOKEN_EXPIRE,
    process.env.REFRESH_TOKEN_SECRET
  );

  const accessTokenOptions = {
    expires: new Date(
      Date.now() + process.env.ACCESS_TOKEN_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  const refreshTokenOptions = {
    expires: new Date(
      Date.now() + process.env.REFRESH_TOKEN_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
    refreshTokenOptions.secure = true;
  }

  res
    .status(statusCode)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json({
      success: true,
      accessToken,
      user: {
        id: user.id,
      },
    });
};

module.exports = {
  createUserWithHashedPassword,
  updateUserPasswordWithHashedPassword,
  signJwt,
  comparePassword,
  getResetPasswordToken,
  getUserByEmailWithPass,
  sendTokenResponse,
};
