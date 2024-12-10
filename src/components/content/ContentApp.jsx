import React from 'react';
import DataDisplay from '../DataDisplay';
import Theme from '../features/theme/Theme';
import Accent from '../features/accent/Accent';
import FontFamily from '../features/font-family/FontFamily';
import EventsProvider from '../events/EventsProvider';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContentApp() {
    const selectedLeague = useSelector((state) => state.league);

    return (
        <div>
                <EventsProvider />
                <ToastContainer />
                <Theme />
                <Accent />
                <FontFamily />

                <DataDisplay identifier={selectedLeague} />

        </div>
    );
}

export default ContentApp;
