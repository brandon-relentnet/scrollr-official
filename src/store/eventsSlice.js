// src/store/eventsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const eventsSlice = createSlice({
    name: 'eventsData',
    initialState: [], // Initialize as an empty array
    reducers: {
        setEvents: (state, action) => action.payload, // Replace state with fetched events
    },
});

export const { setEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
