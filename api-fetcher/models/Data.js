// models/Data.js
const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    _id: {
        type: String,
        enum: ['nfl', 'mlb', 'nhl', 'nba'],
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    fetchedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Data', DataSchema);
