const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');

// Create a new role
router.post('/create', roleController.createRole);

// Get all roles
router.get('/', roleController.getAllRoles);

// Get role by ID
router.get('/:id', roleController.getRoleById);

module.exports = router; 