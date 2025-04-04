"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config/config");
const auth_1 = __importDefault(require("./routes/auth"));
const transcripts_1 = __importDefault(require("./routes/transcripts"));
const tweets_1 = __importDefault(require("./routes/tweets")); // Add the new tweet routes
// Initialize Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)(config_1.config.cors));
app.use(express_1.default.json({ limit: '5mb' })); // For handling large transcripts
// Static files (for production)
if (config_1.config.nodeEnv === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../frontend/dist')));
}
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/transcripts', transcripts_1.default);
app.use('/api/tweets', tweets_1.default); // Add the new tweet routes
// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        version: process.env.npm_package_version || '1.0.0',
        environment: config_1.config.nodeEnv
    });
});
// Serve frontend in production
if (config_1.config.nodeEnv === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../frontend/dist/index.html'));
    });
}
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        message
    });
});
// Start server
const PORT = config_1.config.port;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${config_1.config.nodeEnv} mode`);
});
