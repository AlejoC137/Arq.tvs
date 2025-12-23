import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkConnection, fetchPendingCallsCount } from './store/actions/appActions';
import MainContainer from './components/CommandCenter/MainContainer';
import TopNavigation from './components/CommandCenter/TopNavigation';
import { Activity, Database, Layers } from 'lucide-react';


function App() {
    const dispatch = useDispatch();
    const { connectionStatus, loading, error } = useSelector((state) => state.app);

    useEffect(() => {
        dispatch(checkConnection());
        dispatch(fetchPendingCallsCount());

        // Refresh count every 30 seconds
        const interval = setInterval(() => {
            dispatch(fetchPendingCallsCount());
        }, 30000);

        return () => clearInterval(interval);
    }, [dispatch]);

    // Fallback for missing colors if CSS isn't fully loaded or configured:
    // Using explicit tailwind colors as backup in class string or relying on defaults
    // The structure assumes css variables are present.

    return (
        <div className="h-screen w-screen overflow-hidden bg-gray-50 flex flex-col">
            <TopNavigation />
            <div className="flex-1 overflow-hidden">
                <MainContainer />
            </div>
        </div>
    );
}

export default App;
