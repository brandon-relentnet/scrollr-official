// src/features/league/LeagueDropdown.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLeague } from '../../../store/leagueSlice';
import Dropdown from '../../components/Dropdown';

const leagueOptions = [
    { value: 'nfl', label: 'NFL' },
    { value: 'mlb', label: 'MLB' },
    { value: 'nhl', label: 'NHL' },
    { value: 'nba', label: 'NBA' },
];

function LeagueDropdown() {
    const dispatch = useDispatch();
    const selectedLeague = useSelector((state) => state.league);

    const handleLeagueSelect = (league) => {
        dispatch(setLeague(league));
    };

    return (
        <div className="mb-4">
            <Dropdown
                options={leagueOptions}
                onSelect={handleLeagueSelect}
                label="Select League"
                selectedValue={selectedLeague}
            />
        </div>
    );
}

export default LeagueDropdown;
