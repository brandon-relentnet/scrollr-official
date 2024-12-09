// fetchDataAndSave.js
/**
 * Fetches data from the API, saves it to MongoDB, emits via WebSocket,
 * and determines game presence and polling category.
 */

const {
    compareDatesAndTimeDifference,
    convertUTCToEST,
    getCurrentESTISO,
    addValueIfNotNegative,
} = require('./api/utils');
require('dotenv').config();

const axios = require('axios');
const Data = require('./models/Data');
const mongoose = require('mongoose');
const logger = require('./logger'); // Import logger

let dataSetCounter = 0;

/**
 * Fetches data from a single API URL with retry mechanism.
 * @param {string} url - The API endpoint URL.
 * @param {number} retries - Number of retry attempts.
 * @param {number} delay - Delay between retries in milliseconds.
 * @returns {object|null} - The fetched data or null on failure.
 */
const fetchData = async (url, retries = 3, delay = 1000) => {
    try {
        const response = await axios.get(url);
        logger.debug(`📥 Data fetched from API (${url})`);
        return response.data;
    } catch (error) {
        if (retries > 0) {
            logger.warn(`⚠️ Retry fetching data from API (${url}). Retries left: ${retries}`);
            await new Promise((res) => setTimeout(res, delay));
            return fetchData(url, retries - 1, delay * 2); // Exponential backoff
        }
        logger.error(`❌ Failed to fetch data from API (${url}): ${error.message}`);
        return null;
    }
};

/**
 * Determines game status and calculates polling times.
 * @param {object} data - The data object containing event information.
 * @returns {object} - Object containing event status flags and polling category.
 */
const determineGameStatus = (data) => {
    if (!data?.events)
        return {
            isEventLive: false,
            isEventOver: false,
            nextEventStartTime: null,
            pollingCategory: 'low',
        };

    let isEventLive = false;
    let isEventOver = false;
    let nextEventStartTime = null;
    const currentISO = getCurrentESTISO();
    let timeDifferences = [];

    data.events.forEach((event) => {
        const { date: eventDateWithTime } = event;
        const eventISO = eventDateWithTime ? convertUTCToEST(eventDateWithTime) : null;
        const diffInMinutes = eventISO
            ? compareDatesAndTimeDifference(currentISO, eventISO)
            : null;

        if (diffInMinutes !== null) addValueIfNotNegative(diffInMinutes, timeDifferences);

        const eventStatus = event?.status?.type?.state || 'Unknown';

        // Determine live and over statuses based on eventStatus
        if (eventStatus === 'in') {
            isEventLive = true;
        } else if (eventStatus === 'post') {
            isEventOver = true;
        }
    });

    // Determine the next event start time
    timeDifferences = timeDifferences.filter((n) => n >= 0).sort((a, b) => a - b);
    nextEventStartTime = timeDifferences[0] || null;
    const range =
        timeDifferences.length > 1
            ? timeDifferences[timeDifferences.length - 1] - timeDifferences[0]
            : null;

    // Determine polling category based on next event timing
    let pollingCategory = 'low'; // Default
    if (isEventLive) {
        pollingCategory = 'high';
    } else if (nextEventStartTime !== null) {
        if (nextEventStartTime <= 5) {
            pollingCategory = 'high';
        } else if (nextEventStartTime <= 60) {
            pollingCategory = 'medium';
        } else {
            pollingCategory = 'low';
        }
    } else {
        pollingCategory = 'low';
    }

    return { isEventLive, isEventOver, nextEventStartTime, range, pollingCategory };
};

/**
 * Fetches data, saves to MongoDB, emits via WebSocket, and determines game presence.
 * @param {string} leagueKey - The identifier for the league (e.g., 'nfl').
 * @param {string} leagueUrl - The API URL for the league.
 * @param {object} io - The Socket.IO server instance.
 * @returns {object|null} - An object containing event status flags or null on failure.
 */
const fetchDataAndSave = async (leagueKey, leagueUrl, io) => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.VITE_MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            logger.info('🎉 Connected to MongoDB.');
        }

        const data = await fetchData(leagueUrl);
        if (!data) return null;

        await Data.findOneAndUpdate(
            { _id: leagueKey },
            { data, fetchedAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        logger.debug(`✅ Data saved to MongoDB for (${leagueKey})`);

        if (io) {
            io.emit('dataUpdate', { identifier: leagueKey, data, fetchedAt: new Date() });
            logger.debug(`📤 Emitted 'dataUpdate' event for (${leagueKey}).`);
        } else {
            logger.warn(`⚠️ 'io' is undefined. Skipping Socket.IO emission for (${leagueKey}).`);
        }
        
        const { isEventLive, isEventOver, nextEventStartTime, range, pollingCategory } =
            determineGameStatus(data);

        console.log();
        logger.info(
            `💾 Summary for ${leagueKey.toUpperCase()}: \nLive: ${isEventLive}, Finished: ${isEventOver}, Next event in: ${nextEventStartTime || 'N/A'
            } mins.`
        );

        return { isEventLive, isEventOver, nextEventStartTime, range, pollingCategory };
    } catch (error) {
        logger.error(`❌ Error processing data for (${leagueKey}): ${error.message}`);
        return null;
    }
};

module.exports = fetchDataAndSave;
