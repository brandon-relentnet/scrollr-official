import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../../css/index.css';
import Popup from './Popup';
import '../../utils/fontAwesome';
import { Provider } from 'react-redux';
import { store } from '../../store';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <Popup />
        </Provider>
    </QueryClientProvider>
);