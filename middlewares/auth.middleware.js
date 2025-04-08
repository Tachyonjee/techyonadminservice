const authService = require('../services/auth.service');

module.exports = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Verify token and get user
        const decoded = authService.verifyToken(token);
        const user = await authService.getCurrentUser(token);

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
}; 