const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teachers");
const Student = require("../models/student");
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


// Register User with Role Handling
exports.registerUser = async ({ name, username, password, role, mobile, subject, userClass }) => {
  // Check if user exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username already exists");
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create Base User
  const newUser = await User.create({
    name,
    username,
    password: hashedPassword,
    mobile,
    role,
  });

  // Role-specific inserts
  if (role === "teacher") {
    if (!subject || !userClass) throw new Error("Subject and Class are required for teachers");
    await Teacher.create({ userId: newUser._id, subject, class: userClass });
  } else if (role === "student") {
    if (!userClass) throw new Error("Class is required for students");
    await Student.create({ userId: newUser._id, class: userClass });
  }

  return newUser;
};


// Login User
exports.loginUser = async (username, password) => {
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

