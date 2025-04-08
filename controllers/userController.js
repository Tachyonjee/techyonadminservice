const userService = require("../services/userService");

// Register Controller
const register = async (req, res) => {
  try {
    const { name, username, password, roleId, mobile, subjectId, classId } = req.body;

    // Call service to handle registration
    const newUser = await userService.registerUser({ 
      name, 
      username, 
      password, 
      roleId, 
      mobile, 
      subjectId, 
      classId 
    });

    return res.status(201).json({ 
      success: true,
      message: "User registered successfully", 
      data: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        mobile: newUser.mobile,
        role: {
          id: newUser.roleId._id,
          name: newUser.roleId.name
        }
      }
    });
  } catch (error) {
    console.error("Error in register API:", error.message);
    return res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await userService.loginUser(username, password);
    res.status(200).json({
      success: true,
      ...response
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        mobile: user.mobile,
        role: {
          id: user.roleId._id,
          name: user.roleId.name
        }
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        mobile: updatedUser.mobile,
        role: {
          id: updatedUser.roleId._id,
          name: updatedUser.roleId.name
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { 
  register, 
  login,
  getUserById,
  updateUser
};
