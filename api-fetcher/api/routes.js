// api/routes.js
const express = require('express');
const Data = require('../models/Data');

const router = express.Router();

// Fetch specific API data based on identifier
router.get('/events/:id', async (req, res) => {
    const { id } = req.params; // Extract 'id' from the URL
    console.log(`Received request for identifier: ${id}`);

    try {
        const validIds = ['nfl', 'mlb', 'nhl', 'nba'];
        if (!validIds.includes(id)) {
            console.log(`Invalid identifier received: ${id}`);
            return res.status(400).json({ message: 'Invalid identifier' });
        }

        const dataDocument = await Data.findById(id);

        if (!dataDocument) {
            return res.status(404).json({ message: 'Data not found for the given identifier' });
        }

        if (!dataDocument.data || !dataDocument.data.events) {
            return res.status(404).json({ message: 'Events data not available' });
        }

        res.json(dataDocument.data.events); // Return the 'events' array
    } catch (error) {
        console.error(`Error fetching data for identifier (${id}):`, error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
