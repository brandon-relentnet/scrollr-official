// logger.js
/**
 * Logger configuration using Winston.
 * Handles logging levels, formatting, and transports.
 */

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, splat } = format;

// Define custom log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

// Create Winston logger instance
const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info', // Default log level
    format: combine(
        colorize(), // Colorize output
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
        splat(), // String interpolation
        logFormat
    ),
    transports: [
        new transports.Console(),
        // Optional file transports
        // new transports.File({ filename: 'logs/error.log', level: 'error' }),
        // new transports.File({ filename: 'logs/combined.log' }),
    ],
});

module.exports = logger;
