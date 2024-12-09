// api/utils.js
const moment = require('moment-timezone');

/**
 * Gets the current time in EST as an ISO string.
 */
function getCurrentESTISO() {
    return moment().tz('America/New_York').toISOString();
}

/*
 * Calculates the difference in minutes between two ISO date strings.
 * @param {string} isoStartTime - The start time in ISO format.
 * @param {string} isoEndTime - The end time in ISO format.
 * @returns {number} - The difference in minutes.
 */
function compareDatesAndTimeDifference(isoStartTime, isoEndTime) {
    return timeDifferenceInMinutes(isoStartTime, isoEndTime);
}

/**
 * Calculates the difference in minutes between two ISO date strings.
 * @param {string} isoStartTime - The start time in ISO format.
 * @param {string} isoEndTime - The end time in ISO format.
 * @returns {number} - The difference in minutes.
 */
function timeDifferenceInMinutes(isoStartTime, isoEndTime) {
    const start = moment.tz(isoStartTime, 'America/New_York');
    const end = moment.tz(isoEndTime, 'America/New_York');
    return Math.round(end.diff(start, 'minutes', true));
}

/**
 * Converts a UTC ISO date string to EST ISO date string.
 * @param {string} isoDateString - The UTC date string.
 * @returns {string} - The EST date string.
 */
function convertUTCToEST(isoDateString) {
    return moment.utc(isoDateString).tz('America/New_York').format();
}

/**
 * Adds a value to an array if it's non-negative.
 * @param {number} value - The value to add.
 * @param {array} numbers - The array to add the value to.
 */
function addValueIfNotNegative(value, numbers) {
    if (value >= 0) numbers.push(value);
}

/**
 * Checks if two ISO date strings fall on the same day in EST.
 * @param {string} isoDate1 - The first ISO date string.
 * @param {string} isoDate2 - The second ISO date string.
 * @returns {boolean} - True if same day, else false.
 */
function isSameDate(isoDate1, isoDate2) {
    return moment(isoDate1).tz('America/New_York').isSame(moment(isoDate2).tz('America/New_York'), 'day');
}

module.exports = {
    compareDatesAndTimeDifference,
    isSameDate,
    getCurrentESTISO,
    convertUTCToEST,
    addValueIfNotNegative,
};
