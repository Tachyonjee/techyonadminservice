const userService = require("../services/userService");

// Register Controller
const register = async (req, res) => {
  try {
    const { name, username, password, role, mobile, subject, class: userClass } = req.body;

    // Validate Role
    if (!["admin", "teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // Call service to handle registration
    const newUser = await userService.registerUser({ name, username, password, role, mobile, subject, userClass });

    return res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error in register API:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await userService.loginUser(username, password);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login };
