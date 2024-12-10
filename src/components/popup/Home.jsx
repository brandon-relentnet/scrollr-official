// src/pages/Home.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import SpeedDropdown from '../../features/mode/SpeedDropdown';
import LeagueDropdown from '../../features/league/LeagueDropdown';
import FavoriteTeamDropdown from '../../features/teams/FavoriteTeamDropdown';

function Home() {
    const selectedLeague = useSelector((state) => state.league);
    const events = useSelector((state) => state.eventsData);

    const isEventsLoading = selectedLeague && events.length === 0;

    return (
        <div>
            <div className="text-center text-text w-96">
                <h2 className='text-2xl text-subtext1 font-semibold m-4 text-left'>Preferences</h2>
                {/* Centered grid with larger width */}
                <div className='p-4 rounded shadow-lg bg-surface0 gap-8'>
                    <label className='ml-1 text-left block mb-2 font-bold'>Speed:</label>
                    <SpeedDropdown />
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
        </div>
    );
}

export default Home;
