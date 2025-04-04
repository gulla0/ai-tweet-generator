"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.ts
const express_1 = __importDefault(require("express"));
const authService_1 = require("../services/authService");
const router = express_1.default.Router();
/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
router.post('/login', (req, res) => {
    try {
        const authResult = (0, authService_1.authenticate)(req.body);
        if (authResult.success) {
            res.json(authResult);
        }
        else {
            res.status(401).json({
                success: false,
                message: authResult.message || 'Authentication failed'
            });
        }
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during authentication'
        });
    }
});
exports.default = router;
