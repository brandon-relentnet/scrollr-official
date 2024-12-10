// popup/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Popup from './Popup';
import { initializeProxyStore } from '../../store/proxyStore.js';

const queryClient = new QueryClient();

initializeProxyStore().then((store) => {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <Popup />
            </Provider>
        </QueryClientProvider>
    );
});
