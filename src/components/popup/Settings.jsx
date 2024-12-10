// src/pages/Home.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import ThemeDropdown from '../../features/theme/ThemeDropdown';
import AccentDropdown from '../../features/accent/AccentDropdown';
import FontFamilyDropdown from '../../features/font-family/FontFamilyDropdown';
import SpeedDropdown from '../../features/mode/SpeedDropdown';
import LeagueDropdown from '../../features/league/LeagueDropdown';
import FavoriteTeamDropdown from '../../features/teams/FavoriteTeamDropdown';

function Settings() {
    const selectedLeague = useSelector((state) => state.league);
    const events = useSelector((state) => state.eventsData);

    const isEventsLoading = selectedLeague && events.length === 0;
    
    return (
        <div>
            <div className="text-center text-text w-96">
                <h2 className='text-2xl text-subtext1 font-semibold m-4 text-left'>Appearance</h2>
                {/* Centered grid with larger width */}
                <div className='p-10 rounded shadow-lg bg-surface0 grid mb-4 grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className="text-left">
                        <label className='ml-1 text-left block mb-2 font-bold'>Theme:</label>
                        <ThemeDropdown />
                        <label className='ml-1 text-left block mb-2 font-bold'>Accent:</label>
                        <AccentDropdown />
                    </div>
                    <div className="text-left">
                        <label className='ml-1 text-left block mb-2 font-bold'>Font Family:</label>
                        <FontFamilyDropdown />
                        <label className='ml-1 text-left block mb-2 font-bold'>Speed:</label>
                        <SpeedDropdown />
                    </div>
                    <div className="text-left">
                        <label className='ml-1 text-left block mb-2 font-bold'>League:</label>
                        <LeagueDropdown />
                        <label className='ml-1 text-left block mb-2 font-bold'>Favorite Team:</label>
                        {/* Favorite Team Dropdown */}
                        {selectedLeague && (
                            <div>
                                {isEventsLoading ? (
                                    <p>Loading teams...</p>
                                ) : (
                                    <FavoriteTeamDropdown events={events} />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <h2 className='text-2xl text-subtext1 font-semibold m-4 text-left'>Accounts</h2>
                {/* Centered grid with larger width */}
                <div className='p-10 rounded shadow-lg bg-surface0 grid mb-4 grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className="p-4 text-left">
                        <label className='ml-1 text-left block mb-2 font-bold'>Yahoo Sports:</label>
                    </div>
                    <div className="p-4 text-left">
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
