// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./api/db'); // Import the connectDB function
const routes = require('./api/routes');
const startAgenda = require('./api/cronJob'); // Import Agenda-based cron job function
const { agenda, logger } = require('./agenda'); // Import Agenda and logger

const app = express();
const PORT = process.env.VITE_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Ensure you can parse JSON bodies
app.use('/api', routes); // Prefix routes with /api

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
    cors: {
        origin: '*', // Adjust this in production to your client's origin
        methods: ['GET', 'POST']
    }
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log(`🟢 Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`🔴 Client disconnected: ${socket.id}`);
    });
});

// Connect to the database
connectDB(); // Call the function to connect to the database

// Start the server
server.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

    try {
        // Start Agenda and initialize jobs with access to 'io'
        await startAgenda(io);
    } catch (error) {
        logger.error(`❌ Failed to start Agenda scheduler: ${error.message}`);
        process.exit(1);
    }
});

// Graceful shutdown
const graceful = async () => {
    logger.info('🛑 Shutting down gracefully...');
    await agenda.stop();
    process.exit(0);
};

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
