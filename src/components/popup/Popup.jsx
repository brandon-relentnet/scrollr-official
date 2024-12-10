import React, { useState } from 'react';
import Settings from "./Settings";
import Theme from '../../features/theme/Theme';
import Accent from '../../features/accent/Accent';
import FontFamily from '../../features/font-family/FontFamily';
import '../../css/index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

export default function Popup() {
  const [activeTab, setActiveTab] = useState(''); // Initially no tab is active

  return (
    <>
      <ToastContainer position="top-center" style={{ width: '100%', marginTop: '8px' }} />
      <Theme />
      <Accent />
      <FontFamily />

      <div>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="p-4">
          {activeTab === 'settings' && <Settings />}
          {activeTab === 'accounts' && <div>Accounts</div>}
          {/* Add more conditional renderings for other tabs here */}

          {!activeTab && (
            <div className="welcome-message text-center text-subtext0">
              Select an option from the navbar.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
