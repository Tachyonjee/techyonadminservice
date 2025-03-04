const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h", // Token valid for 1 hour
    }
  );
};

// Register User
const registerUser = async (userData) => {
  try {
    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    userData.password = await bcrypt.hash(userData.password, 10); // Hash password
    const user = new User(userData);
    await user.save();

    return { message: "User registered successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Login User
const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid username or password");
    }

    const token = generateToken(user);
    return { message: "Login successful", token };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { registerUser, loginUser };
