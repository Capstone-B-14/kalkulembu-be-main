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
const signJwt = (payload) => {
  return jwt.sign({ id: payload.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
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
    // select: { password: true }, // Select the password field
  });

  return user;
};

// Utility function to send JWT token in response
const sendTokenResponse = (user, statusCode, res) => {
  const token = signJwt({ id: user.id });
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
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
