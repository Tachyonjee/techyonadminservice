const roleService = require('../services/role.service');

// Create a new role
exports.createRole = async (req, res) => {
    try {
        const role = await roleService.createRole(req.body);
        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            data: role
        });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await roleService.getAllRoles();
        res.status(200).json({
            success: true,
            data: roles
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching roles'
        });
    }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
    try {
        const role = await roleService.getRoleById(req.params.id);
        res.status(200).json({
            success: true,
            data: role
        });
    } catch (error) {
        console.error('Error fetching role:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
}; 