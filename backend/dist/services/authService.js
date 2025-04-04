"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.authenticate = void 0;
const config_1 = require("../config/config");
/**
 * Authenticate a user by email and password
 * For this prototype, we're using simple hardcoded authentication
 * In a production environment, you'd want to use a database and proper encryption
 */
const authenticate = (req) => {
    const { email, password } = req;
    if (email === config_1.config.auth.adminEmail && password === config_1.config.auth.adminPassword) {
        return {
            success: true,
            token: 'admin' // Simple token for prototype, would use JWT in production
        };
    }
    return {
        success: false,
        message: 'Invalid credentials'
    };
};
exports.authenticate = authenticate;
/**
 * Middleware to check if user is authenticated
 */
const authMiddleware = (req, res, next) => {
    // Get auth token from header
    const authToken = req.headers['x-auth'];
    // For this prototype, we just check for a specific token
    // In production, you'd validate a JWT or other secure token
    if (!authToken || authToken !== 'admin') {
        res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
        return;
    }
    // Add user info to request
    req.user = { email: config_1.config.auth.adminEmail };
    // Proceed to route handler
    next();
};
exports.authMiddleware = authMiddleware;
