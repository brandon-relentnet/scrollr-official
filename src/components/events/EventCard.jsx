// src/components/events/EventCard.jsx
import React from 'react';
import TeamInfo from './TeamInfo';
import ScoreDisplay from './ScoreDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { pinEvent, unpinEvent } from '../../store/pinnedEventsSlice';
import { removeFavoriteTeam } from '../../store/favoriteTeamsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faTimes, faDotCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const EventCard = ({ event }) => {
    const gameLink = event.links?.find(link => link.rel.includes('gamecast'))?.href || event.links?.[0]?.href;

    const homeTeam = event.competitions[0].competitors.find(c => c.homeAway === 'home');
    const awayTeam = event.competitions[0].competitors.find(c => c.homeAway === 'away');

    const isGameOver = event.status?.type?.completed;
    const eventStatus = event.status?.type?.shortDetail;
    const isLive = event.status?.type?.state?.toLowerCase() === 'in';

    const dispatch = useDispatch();
    const pinnedEvents = useSelector((state) => state.pinnedEvents);
    const isPinned = pinnedEvents.includes(event.id); // For manual pins

    const favoriteTeams = useSelector((state) => state.favoriteTeams);
    const selectedLeague = useSelector((state) => state.league);
    const favoriteTeam = favoriteTeams[selectedLeague] || null;

    const isFavoriteTeamPinned = favoriteTeam
        ? event.competitions.some(competition =>
            competition.competitors.some(competitor => competitor.team.id === favoriteTeam)
        )
        : false;

    const handlePinClick = (e) => {
        e.stopPropagation(); // Prevent click event from propagating to parent

        if (isFavoriteTeamPinned) {
            const confirmReset = window.confirm('Are you sure you want to remove your favorite team? All related events will be unpinned.');
            if (confirmReset) {
                dispatch(removeFavoriteTeam({ league: selectedLeague }));
                dispatch(unpinEvent(event.id));
                toast.info('Favorite team removed and this event unpinned.');
            }
        } else {
            if (isPinned) {
                dispatch(unpinEvent(event.id));
                toast.info('Event unpinned.');
            } else {
                dispatch(pinEvent(event.id));
                toast.success('Event pinned.');
            }
        }
    };

    // Determine the icon and styling based on pinning state
    const pinIcon = isFavoriteTeamPinned ? faStar : isPinned ? faTimes : faMapPin;
    const pinClass = `text-lg transition duration-300 hover:scale-110 ${isFavoriteTeamPinned ? 'text-accent' :
            isPinned ? 'text-overlay1 hover:text-red' :
                'text-overlay1 hover:text-accent'
        }`;

    return (
        <div className="p-1">
            <div
                onClick={() => gameLink && window.open(gameLink, '_blank')}
                className="relative bg-surface0 rounded shadow p-4 h-32 flex flex-col items-center justify-center cursor-pointer border-2 border-transparent hover:border-accent transition duration-300 hover:shadow-lg"
            >
                {/* LIVE Indicator */}
                {isLive && (
                    <div className="absolute top-1 left-1 flex text-xs items-center p-0.5">
                        <FontAwesomeIcon icon={faDotCircle} className="text-red mr-1" />
                        <span className="text-red font-bold">LIVE</span>
                    </div>
                )}

                <div className="flex flex-col md:flex-row items-center w-full">
                    {/* Away Team */}
                    <div className="flex-1 flex justify-center min-w-0">
                        <TeamInfo team={awayTeam} />
                    </div>

                    {/* Score Display */}
                    <div className="flex flex-col items-center mx-2 min-w-0 w-1/4">
                        <ScoreDisplay
                            homeTeam={homeTeam}
                            awayTeam={awayTeam}
                            isGameOver={isGameOver}
                            eventStatus={eventStatus}
                        />
                    </div>

                    {/* Home Team */}
                    <div className="flex-1 flex justify-center min-w-0">
                        <TeamInfo team={homeTeam} />
                    </div>
                </div>

                {/* Pin/Unpin Button */}
                <button
                    onClick={handlePinClick}
                    className="absolute top-1 right-1 flex text-xs items-center p-0.5"
                    title={isFavoriteTeamPinned ? 'Reset Favorite Team' : (isPinned ? 'Unpin Event' : 'Pin Event')}
                >
                    <FontAwesomeIcon icon={pinIcon} className={pinClass} />
                </button>
            </div>
        </div>
    );
};

export default EventCard;
