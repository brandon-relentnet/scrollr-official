// content/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ContentApp from './ContentApp.jsx';
import { initializeProxyStore } from '../../store/proxyStore.js';

import '../../css/index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../utils/fontAwesome';

const queryClient = new QueryClient();

initializeProxyStore().then((store) => {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <ContentApp />
            </Provider>
        </QueryClientProvider>
    );
});
