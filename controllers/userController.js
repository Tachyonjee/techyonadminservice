const userService = require("../services/userService");

// Register Controller
const register = async (req, res) => {
  try {
    const response = await userService.registerUser(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
