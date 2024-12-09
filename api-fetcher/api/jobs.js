// api/jobs.js

/**
 * Job scheduling and management using Agenda.
 * Handles polling frequencies, job definitions, and polling adjustments.
 */

const { agenda } = require('../agenda');
const fetchDataAndSave = require('../fetchDataAndSave');
const Bottleneck = require('bottleneck');
const logger = require('../logger');

// Define polling configurations per category using intervals
const pollingConfigs = {
    high: {
        interval: process.env.POLLING_HIGH_INTERVAL || '1 minute',
        description: 'High frequency polling',
    },
    medium: {
        interval: process.env.POLLING_MEDIUM_INTERVAL || '15 minutes',
        description: 'Medium frequency polling',
    },
    low: {
        interval: process.env.POLLING_LOW_INTERVAL || '30 minutes',
        description: 'Low frequency polling',
    },
};

// Configuration for scheduling and frequency of updates
const config = {
    dailyUpdateCron: process.env.CRON_DAILY_UPDATE || '0 0 * * *', // Every day at midnight
};

// Configure Bottleneck for API rate limiting
const limiter = new Bottleneck({
    reservoir: 100,
    reservoirRefreshAmount: 100,
    reservoirRefreshInterval: 60 * 1000, // Refresh limit every 1 minute
    maxConcurrent: 5,
    minTime: 100,
});

// Set up league identifiers and URLs from environment variables
const API_IDENTIFIERS = ['nfl', 'mlb', 'nhl', 'nba'];
const API_URLS = process.env.VITE_API_URLS
    ? process.env.VITE_API_URLS.split(',').map((url) => url.trim())
    : [];

// Validate environment configuration to ensure URLs match league identifiers
if (API_URLS.length !== API_IDENTIFIERS.length) {
    logger.error(
        `API URLs (${API_URLS.length}) do not match identifiers (${API_IDENTIFIERS.length}). Check environment configuration.`
    );
    process.exit(1);
}

// Map league identifiers to their respective API URLs for easy access
const LEAGUES = API_IDENTIFIERS.reduce((acc, identifier, index) => {
    acc[identifier] = API_URLS[index];
    return acc;
}, {});

// Track each league's current status ('in', 'post', etc.)
const leagueStatusMap = {};

// Current count of active leagues with 'in' status
let currentActiveLeaguesCount = 0;

// Module-level `io` instance
let ioInstance = null;

/**
 * Determines the polling status based on game status.
 * @param {boolean} isEventLive - Indicates if the event is live.
 * @param {boolean} isEventOver - Indicates if the event is over.
 * @returns {string} - Returns 'in', 'post', or 'pregame'.
 */
const determineStatus = (isEventLive, isEventOver) =>
    isEventLive ? 'in' : isEventOver ? 'post' : 'pregame';

/**
 * Schedules a one-time job to adjust the polling frequency at a specific time.
 * @param {string} leagueKey - The identifier for the league (e.g., 'nfl').
 * @param {string} targetPollingCategory - The target polling category ('high', 'medium', 'low').
 * @param {Date} adjustTime - The time at which to adjust the polling frequency.
 */
const schedulePollingAdjustment = async (leagueKey, targetPollingCategory, adjustTime) => {
    const jobName = 'adjust polling';

    // Create the job with the 'unique' option
    const job = agenda.create(jobName, { leagueKey, targetPollingCategory });
    job.unique({
        name: jobName,
        'data.leagueKey': leagueKey,
        'data.targetPollingCategory': targetPollingCategory,
    });
    job.schedule(adjustTime);
    await job.save();

    logger.info(
        `🕒 Scheduled polling adjustment for ${leagueKey.toUpperCase()} to '${targetPollingCategory}' at ${adjustTime.toLocaleString()}.`
    );
};

/**
 * Reschedules polling for a league based on its new status and polling category.
 * @param {string} leagueKey - The identifier for the league.
 * @param {string} status - The new status of the league.
 * @param {string} pollingCategory - The urgency category.
 * @param {number|null} nextEventStartTime - Time in minutes until the next event starts.
 */
const reschedulePolling = async (leagueKey, status, pollingCategory, nextEventStartTime) => {
    const jobName = 'poll league';

    // Find the current job
    const currentJobs = await agenda.jobs({ name: jobName, 'data.leagueKey': leagueKey });
    let currentPollingCategory = null;

    if (currentJobs.length > 0) {
        currentPollingCategory = currentJobs[0].attrs.data.pollingCategory || null;
    }

    logger.debug(`Current polling category for ${leagueKey.toUpperCase()}: ${currentPollingCategory}`);
    logger.debug(`New polling category for ${leagueKey.toUpperCase()}: ${pollingCategory}`);

    if (currentPollingCategory !== pollingCategory) {
        // Cancel existing job for this league
        await agenda.cancel({ name: jobName, 'data.leagueKey': leagueKey });

        const selectedPollingConfig = pollingConfigs[pollingCategory] || pollingConfigs.low;
        const interval = selectedPollingConfig.interval;

        logger.info(
            `🔄 Rescheduling polling for ${leagueKey.toUpperCase()} with interval '${interval}' (${selectedPollingConfig.description}).`
        );

        // Create the job with the 'unique' option and skip immediate execution
        const job = agenda.create(jobName, { leagueKey, status, pollingCategory });
        job.unique({ name: jobName, 'data.leagueKey': leagueKey });
        job.repeatEvery(interval, { skipImmediate: true }); // Prevent immediate execution
        await job.save();

        // Log the scheduled jobs
        const jobs = await agenda.jobs({ name: jobName, 'data.leagueKey': leagueKey });
        jobs.forEach((job) => {
            logger.debug(
                `Scheduled job for ${leagueKey.toUpperCase()}: Next run at ${job.attrs.nextRunAt}, Repeat interval: ${job.attrs.repeatInterval}`
            );
        });

        // Schedule polling adjustments if necessary
        if (nextEventStartTime !== null) {
            const now = new Date();
            // Schedule adjustment to 'medium' at 60 minutes before the game
            if (nextEventStartTime > 60 && pollingCategory === 'low') {
                const adjustTime = new Date(now.getTime() + (nextEventStartTime - 60) * 60 * 1000);
                await schedulePollingAdjustment(leagueKey, 'medium', adjustTime);
            }

            // Schedule adjustment to 'high' at 5 minutes before the game
            if (nextEventStartTime > 5 && pollingCategory !== 'high') {
                const adjustTime = new Date(now.getTime() + (nextEventStartTime - 5) * 60 * 1000);
                await schedulePollingAdjustment(leagueKey, 'high', adjustTime);
            }
        }
    } else {
        logger.debug(
            `📌 Polling category for ${leagueKey.toUpperCase()} remains '${pollingCategory}'. No rescheduling needed.`
        );
    }
};

/**
 * Job definition for 'adjust polling'.
 * Adjusts the polling frequency at the scheduled time.
 */
agenda.define('adjust polling', async (job, done) => {
    const { leagueKey, targetPollingCategory } = job.attrs.data;
    try {
        logger.info(
            `⏳ Executing polling adjustment for ${leagueKey.toUpperCase()} to '${targetPollingCategory}'.`
        );

        // Fetch the latest data to determine the current status
        const result = await limiter.schedule(() =>
            fetchDataAndSave(leagueKey, LEAGUES[leagueKey], ioInstance)
        );
        if (result) {
            const { isEventLive, isEventOver, nextEventStartTime } = result;
            const status = determineStatus(isEventLive, isEventOver);

            // Reschedule polling to the target category
            await reschedulePolling(leagueKey, status, targetPollingCategory, nextEventStartTime);
        }

        done();
    } catch (error) {
        logger.error(`❌ Error adjusting polling for ${leagueKey.toUpperCase()}: ${error.message}`);
        done(error);
    }
});

/**
 * Job definition for 'poll league'.
 * Fetches data and reschedules polling based on game status.
 */
agenda.define('poll league', async (job, done) => {
    const { leagueKey, status, pollingCategory } = job.attrs.data;

    try {
        logger.info(`⏰ Polling ${leagueKey.toUpperCase()} API for status '${status}'...`);
        const result = await limiter.schedule(() =>
            fetchDataAndSave(leagueKey, LEAGUES[leagueKey], ioInstance)
        );

        if (result) {
            const {
                isEventLive,
                isEventOver,
                nextEventStartTime,
                pollingCategory: newPollingCategory,
            } = result;
            const newStatus = determineStatus(isEventLive, isEventOver);
            const previousStatus = leagueStatusMap[leagueKey] || '';

            if (previousStatus !== newStatus) {
                // Handle status transition
                if (previousStatus === 'in' && newStatus !== 'in') {
                    currentActiveLeaguesCount--;
                    logger.info(
                        `🔻 League ${leagueKey.toUpperCase()} has become inactive. Active leagues count: ${currentActiveLeaguesCount}`
                    );
                } else if (previousStatus !== 'in' && newStatus === 'in') {
                    currentActiveLeaguesCount++;
                    logger.info(
                        `🔺 League ${leagueKey.toUpperCase()} has become active. Active leagues count: ${currentActiveLeaguesCount}`
                    );
                }

                // Update the leagueStatusMap
                leagueStatusMap[leagueKey] = newStatus;
            }

            // Reschedule polling based on the new status and polling category
            await reschedulePolling(leagueKey, newStatus, newPollingCategory, nextEventStartTime);
        }

        done();
    } catch (error) {
        logger.error(`❌ Error polling ${leagueKey.toUpperCase()}: ${error.message}`);
        done(error);
    }
});

/**
 * Daily update job definition.
 * Resets all polling tasks based on new game schedules.
 */
agenda.define('daily update', async (job, done) => {
    logger.info(`🗓️ Daily update triggered. Re-initializing polling based on new game schedules...`);

    // Reset statuses and active league count
    for (const leagueKey of API_IDENTIFIERS) {
        leagueStatusMap[leagueKey] = '';
    }
    currentActiveLeaguesCount = 0;

    // Cancel all existing 'poll league' and 'adjust polling' jobs
    await agenda.cancel({ name: 'poll league' });
    await agenda.cancel({ name: 'adjust polling' });

    // Reinitialize polling for all leagues
    for (const leagueKey of API_IDENTIFIERS) {
        try {
            const result = await fetchDataAndSave(leagueKey, LEAGUES[leagueKey], ioInstance);
            if (result) {
                const { isEventLive, isEventOver, nextEventStartTime, pollingCategory } = result;
                const status = determineStatus(isEventLive, isEventOver);
                leagueStatusMap[leagueKey] = status;

                if (status === 'in') {
                    currentActiveLeaguesCount++;
                }

                // Reschedule polling based on pollingCategory
                await reschedulePolling(leagueKey, status, pollingCategory, nextEventStartTime);
            }
        } catch (error) {
            logger.error(`❌ Error initializing polling for ${leagueKey.toUpperCase()}: ${error.message}`);
        }
    }

    done();
});

/**
 * Initializes all jobs at startup.
 * @param {object} io - The Socket.IO server instance.
 */
const initializeJobs = async (io) => {
    // Set the module-level ioInstance
    ioInstance = io;

    // Start Agenda processing
    await agenda.start();
    logger.info('Agenda started.');

    // Clear any existing jobs to prevent duplicates
    await agenda.cancel({ name: 'poll league' });
    await agenda.cancel({ name: 'adjust polling' });

    for (const leagueKey of API_IDENTIFIERS) {
        try {
            // Fetch initial data to determine polling category
            const result = await fetchDataAndSave(leagueKey, LEAGUES[leagueKey], ioInstance);
            if (result) {
                const { isEventLive, isEventOver, nextEventStartTime, pollingCategory } = result;
                const status = determineStatus(isEventLive, isEventOver);
                leagueStatusMap[leagueKey] = status;

                if (status === 'in') {
                    currentActiveLeaguesCount++;
                }

                // Reschedule polling based on pollingCategory
                await reschedulePolling(leagueKey, status, pollingCategory, nextEventStartTime);
            }
        } catch (error) {
            logger.error(`❌ Error initializing polling for ${leagueKey.toUpperCase()}: ${error.message}`);
        }
    }

    logger.info(`📊 Initialized polling with ${currentActiveLeaguesCount} active league(s).`);
};

/**
 * Schedules the daily update job.
 * @param {object} io - The Socket.IO server instance.
 */
const scheduleDailyUpdate = async (io) => {
    // Ensure ioInstance is set
    ioInstance = io;

    await agenda.every(config.dailyUpdateCron, 'daily update');
    logger.info(`📅 Daily update job scheduled to run at '${config.dailyUpdateCron}'.`);
};

module.exports = { initializeJobs, scheduleDailyUpdate };
