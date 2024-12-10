// src/store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import accentReducer from './accentSlice';
import fontFamilyReducer from './fontFamilySlice';
import speedReducer from './speedSlice';
import pinnedEventsReducer from './pinnedEventsSlice';
import leagueReducer from './leagueSlice';
import favoriteTeamsReducer from './favoriteTeamsSlice';
import eventsReducer from './eventsSlice';

const rootReducer = combineReducers({
    theme: themeReducer,
    accent: accentReducer,
    fontFamily: fontFamilyReducer,
    carouselSpeed: speedReducer,
    pinnedEvents: pinnedEventsReducer,
    league: leagueReducer,
    favoriteTeams: favoriteTeamsReducer,
    eventsData: eventsReducer,
});

export default rootReducer;
