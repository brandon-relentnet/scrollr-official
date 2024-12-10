// src/components/TeamInfo.js
import React from 'react';

const TeamInfo = ({ team }) => {
    return (
        <div
            className="flex items-center min-w-0"
            style={{ minHeight: '25px' }} // Adjust as needed
        >
            <img
                src={team.team.logo}
                alt={`${team.team.displayName} logo`}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
            />
        </div>
    );
};

export default TeamInfo;
