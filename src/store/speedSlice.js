// src/store/speedSlice.js
import { createSlice } from '@reduxjs/toolkit';

const speedSlice = createSlice({
    name: 'carouselSpeed',
    initialState: 'classic', // Default speed
    reducers: {
        setCarouselSpeed: (state, action) => action.payload, // Set speed based on payload
    },
});

export const { setCarouselSpeed } = speedSlice.actions;
export default speedSlice.reducer;
