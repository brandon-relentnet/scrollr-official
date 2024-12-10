import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../../css/index.css';
import ContentApp from './ContentApp.jsx';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../utils/fontAwesome';
import { Provider } from 'react-redux';
import { store } from '../../store';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <ContentApp />
        </Provider>
    </QueryClientProvider>
);