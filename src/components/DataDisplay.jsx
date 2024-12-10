// src/components/DataDisplay.js
import React from 'react';
import { useSelector } from 'react-redux';
import EventsDisplay from './events/EventsDisplay';

const DataDisplay = () => {
    const events = useSelector((state) => state.eventsData);

    // Handle loading and error states based on eventsData
    const isLoading = !events || events.length === 0;
    const isError = false; // Modify if you implement error handling in eventsSlice

    if (isLoading) return <p>Loading events...</p>;
    if (isError) return <p>Error loading events.</p>;

    return (
        <EventsDisplay events={events} />
    );
};

export default DataDisplay;
