// agenda.js
const Agenda = require('agenda');
const winston = require('winston');
require('dotenv').config();

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' }),
    ],
});

// Initialize Agenda
const agenda = new Agenda({
    db: { address: process.env.VITE_MONGO_URI, collection: 'agendaJobs' },
    processEvery: '30 seconds', // Frequency to check for new jobs
    maxConcurrency: 5,
});

// Handle Agenda events
agenda.on('ready', () => logger.info('🗓️ Agenda connected and ready.'));
agenda.on('error', (err) => logger.error(`Agenda connection error: ${err.message}`));

module.exports = { agenda, logger };
