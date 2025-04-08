const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Teacher = require('../models/teachers');
const Student = require('../models/student');
const bcrypt = require('bcryptjs');

class AuthService {
    // Generate JWT Token
    generateToken(user) {
        return jwt.sign(
            { 
                id: user._id, 
                username: user.username, 
                roleId: user.roleId 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    }

    // Verify JWT Token
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    // Login User
    async login(username, password) {
        try {
            // Find user with populated role
            console.log("username", username)
            const user = await User.findOne({ username })
            if (!user) {
                throw new Error('Invalid username or password');
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid username or password');
            }

            // Get role-specific data
            let roleData = {};
            if (user.roleId.name === "teacher") {
                const teacherData = await Teacher.findOne({ userId: user._id })
                roleData = {
                    subject: teacherData?.subject,
                    class: teacherData?.class
                };
            } else if (user.roleId.name === "student") {
                const studentData = await Student.findOne({ userId: user._id })
                roleData = {
                    class: studentData?.class
                };
            }

            // Generate token
            const token = this.generateToken(user);

            return {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    mobileNumber: user.mobileNumber,
                    email: user.email,
                    role: {
                        id: user.roleId._id,
                        name: user.roleId.name
                    },
                    ...roleData
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Get current user
    async getCurrentUser(token) {
        try {
            const decoded = this.verifyToken(token);
            const user = await User.findById(decoded.id).populate('roleId');
            
            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthService(); 