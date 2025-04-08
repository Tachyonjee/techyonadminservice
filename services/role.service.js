const Role = require('../models/role.model');

class RoleService {
    // Create a new role
    async createRole(roleData) {
        try {
            const existingRole = await Role.findOne({ name: roleData.name });
            if (existingRole) {
                throw new Error('Role with this name already exists');
            }

            const role = new Role(roleData);
            return await role.save();
        } catch (error) {
            console.error('Error in createRole:', error);
            throw error;
        }
    }

    // Get role by ID
    async getRoleById(roleId) {
        try {
            console.log('Looking for role with ID:', roleId);
            
            if (!roleId) {
                throw new Error('Role ID is required');
            }

            const role = await Role.findById(roleId);
            console.log('Found role:', role);

            if (!role) {
                throw new Error('Role not found');
            }
            return role;
        } catch (error) {
            console.error('Error in getRoleById:', error);
            throw error;
        }
    }

    // Get role by name
    async getRoleByName(roleName) {
        try {
            console.log('Looking for role with name:', roleName);
            
            if (!roleName) {
                throw new Error('Role name is required');
            }

            const role = await Role.findOne({ name: roleName });
            console.log('Found role:', role);

            if (!role) {
                throw new Error('Role not found');
            }
            return role;
        } catch (error) {
            console.error('Error in getRoleByName:', error);
            throw error;
        }
    }

    // Get all roles
    async getAllRoles() {
        try {
            const roles = await Role.find({ isActive: true });
            console.log('Found roles:', roles);
            return roles;
        } catch (error) {
            console.error('Error in getAllRoles:', error);
            throw error;
        }
    }
}

module.exports = new RoleService(); 