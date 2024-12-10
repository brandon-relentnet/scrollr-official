// src/components/events/EventsDisplay.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Slider from 'react-slick';
import EventCard from './EventCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const EventsDisplay = () => {
    const events = useSelector((state) => state.eventsData);
    const speed = useSelector((state) => state.carouselSpeed) || 'classic';
    const pinnedEventsFromState = useSelector((state) => state.pinnedEvents) || [];
    const favoriteTeams = useSelector((state) => state.favoriteTeams);
    const selectedLeague = useSelector((state) => state.league);
    const favoriteTeam = favoriteTeams[selectedLeague] || null;

    // Determine events to pin based on favorite team
    const favoriteTeamEvents = favoriteTeam
        ? events.filter(event => {
            // Check if any competitor's team.id matches favoriteTeam
            return event.competitions.some(competition =>
                competition.competitors.some(competitor => competitor.team.id === favoriteTeam)
            );
        }).map(event => event.id)
        : [];

    // Separate manually pinned events excluding favorite team events to avoid duplication
    const manuallyPinnedEvents = pinnedEventsFromState.filter(eventId => !favoriteTeamEvents.includes(eventId));

    // Combine all pinned events for carousel exclusion
    const combinedPinnedEvents = Array.from(new Set([...favoriteTeamEvents, ...manuallyPinnedEvents]));

    // Filter out events that are pinned
    const unpinnedEvents = events.filter(event => !combinedPinnedEvents.includes(event.id));

    // Determine the speed settings based on the speed
    let autoplaySpeed = 3000; // default for 'classic'
    let animationSpeed = 1000; // default animation speed

    if (speed === 'slower') {
        autoplaySpeed = 5000; // slower autoplay speed
        animationSpeed = 1500; // slower animation speed
    } else if (speed === 'faster') {
        autoplaySpeed = 1500; // faster autoplay speed
        animationSpeed = 500; // faster animation speed
    }

    const sliderRef = useRef(null);
    const carouselContainerRef = useRef(null);

    // State to manage slidesToShow
    const [slidesToShow, setSlidesToShow] = useState(3);

    // Minimum width per slide in pixels
    const minSlideWidth = 300; // Adjust as needed

    // Function to calculate slidesToShow based on container width
    const calculateSlidesToShow = () => {
        if (!carouselContainerRef.current) return;
        const containerWidth = carouselContainerRef.current.offsetWidth;
        const newSlidesToShow = Math.max(
            1,
            Math.floor(containerWidth / minSlideWidth)
        );
        setSlidesToShow(newSlidesToShow);
    };

    useEffect(() => {
        // Initial calculation
        calculateSlidesToShow();

        // Create a ResizeObserver to monitor container size changes
        const resizeObserver = new ResizeObserver(() => {
            calculateSlidesToShow();
        });

        if (carouselContainerRef.current) {
            resizeObserver.observe(carouselContainerRef.current);
        }

        // Cleanup on unmount
        return () => {
            resizeObserver.disconnect();
        };
    }, [combinedPinnedEvents]); // Recalculate when pinnedEvents or favoriteTeam change

    // Slider settings without 'responsive'
    const settings = {
        dots: false,
        arrows: false,
        infinite: unpinnedEvents.length > slidesToShow,
        speed: animationSpeed,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: autoplaySpeed,
        slidesToShow: slidesToShow,
        // Removed 'responsive' settings
    };

    // Separate pinned events for rendering
    const favoritePinnedEvents = events.filter(event => favoriteTeamEvents.includes(event.id));
    const manualPinnedEvents = events.filter(event => manuallyPinnedEvents.includes(event.id));

    return (
        <div className="fixed bottom-0 left-0 w-full bg-mantle z-50 flex items-center overflow-hidden shadow-t">
            <div className="flex w-full h-full">
                {/* Pinned Events Section */}
                {(favoritePinnedEvents.length > 0 || manualPinnedEvents.length > 0) && (
                    <div className="flex flex-shrink-0 h-full overflow-hidden rounded bg-mantle">
                        {/* Favorite Team Pinned Events */}
                        {favoritePinnedEvents.map(event => (
                            <div key={event.id}>
                                <EventCard event={event} />
                            </div>
                        ))}

                        {/* Manually Pinned Events */}
                        {manualPinnedEvents.map(event => (
                            <div key={event.id}>
                                <EventCard event={event} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Carousel for Unpinned Events */}
                {unpinnedEvents.length > 0 ? (
                    <div className="flex-grow h-full overflow-hidden" ref={carouselContainerRef}>
                        <Slider
                            key={`slider-${slidesToShow}`}
                            ref={sliderRef}
                            {...settings}
                            className="overflow-hidden"
                        >
                            {unpinnedEvents.map(event => (
                                <div key={event.id} className="p-0 m-0 box-border">
                                    <EventCard event={event} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                ) : (
                    <p className="text-center w-full">No more events to display.</p>
                )}
            </div>
        </div>
    );
};

export default EventsDisplay;
