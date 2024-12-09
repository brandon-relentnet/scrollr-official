// api/cronJob.js
const { agenda, logger } = require('../agenda');
const { initializeJobs, scheduleDailyUpdate } = require('./jobs');

/**
 * Starts Agenda and initializes all jobs.
 * @param {SocketIO.Server} io - The Socket.IO server instance.
 */
const startAgenda = async (io) => {
    // Initialize all jobs with access to 'io'
    await initializeJobs(io);

    // Schedule daily update with access to 'io'
    await scheduleDailyUpdate(io);

    // Start Agenda
    await agenda.start();

    logger.info('✅ Agenda scheduler started.');
};

module.exports = startAgenda;
