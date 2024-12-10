import Settings from "./Settings";
import React from 'react';
import Theme from '../../features/theme/Theme';
import Accent from '../../features/accent/Accent';
import FontFamily from '../../features/font-family/FontFamily';
import EventsProvider from '../events/EventsProvider';
import '../../css/index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Popup() {
  return (
    <>
      <EventsProvider />
      <ToastContainer />
      <Theme />
      <Accent />
      <FontFamily />

      <Settings />
    </>

  );
}