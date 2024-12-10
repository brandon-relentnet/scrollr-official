import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faHouse } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify'; // Import toast if you choose to add notifications

const Navbar = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="flex items-center justify-between p-4 bg-mantle text-text sticky top-0 z-10 shadow">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex items-center justify-center p-2 rounded ${activeTab === 'home' ? 'bg-surface0' : 'hover:bg-base'
                        }`}
                    aria-label="Home"
                >
                    <FontAwesomeIcon icon={faHouse} className="h-5 w-5" />
                </button>
            </div>
            <div className="text-lg font-semibold p-2">
                Scrollr v1.0
            </div>
            <div className="flex space-x-2">
                {/* Accounts Button with Tooltip */}
                <div className="relative group">
                    <button
                        onClick={() => {
                            // Optional: Show a toast notification indicating the feature is coming soon
                            toast.info('Accounts feature is coming soon!', {
                                position: "top-center",
                                style: {
                                    borderRadius: '10px',
                                    background: 'var(--overlay0)',
                                    color: 'var(--text)',
                                    width: '250px',
                                    margin: '0 auto',
                                },
                                progressStyle: {
                                    background: 'var(--accent)',
                                },
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: 'colored',
                            });
                        }}
                        className={`flex items-center justify-center p-2 rounded hover:bg-surface1`}
                        aria-label="Accounts"
                    // Optionally disable the button to prevent clicks
                    // disabled
                    >
                        <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                    </button>
                    {/* Tooltip Positioned Below the Icon */}
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-overlay0 text-text text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        Coming Soon
                    </div>
                </div>

                {/* Settings Button */}
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center justify-center p-2 rounded ${activeTab === 'settings' ? 'bg-surface0' : 'hover:bg-base'
                        }`}
                    aria-label="Settings"
                >
                    <FontAwesomeIcon icon={faCog} className="h-5 w-5" />
                </button>
                {/* Future navbar items can be added here */}
            </div>
        </nav>
    );
};

export default Navbar;
