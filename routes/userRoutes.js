const express = require("express");
const router = express.Router();
const { register, login, getUserById, updateUser } = require("../controllers/userController");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (you might want to add authentication middleware)
router.get("/:id", getUserById);
router.put("/:id", updateUser);

module.exports = router;
