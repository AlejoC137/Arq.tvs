import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkConnection, fetchPendingCallsCount } from './store/actions/appActions';
// import MainContainer from './components/CommandCenter/MainContainer'; // Removed
import TopNavigation from './components/CommandCenter/TopNavigation';
import { Routes, Route, Navigate } from 'react-router-dom';

// Views
import CalendarContainer from './components/CommandCenter/CalendarContainer';
import SpacesView from './components/CommandCenter/SpacesView';
import ComponentsView from './components/CommandCenter/ComponentsView';
import HousesView from './components/CommandCenter/HousesView';
import TeamView from './components/CommandCenter/TeamView';
import ProtocolsView from './components/CommandCenter/ProtocolsView';
import MaterialsView from './components/CommandCenter/MaterialsView';
import DirectoryView from './components/CommandCenter/DirectoryView';
import CallsView from './components/CommandCenter/CallsView';
import ActionInspectorPanel from './components/CommandCenter/ActionInspectorPanel';
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
            <div className="flex-1 overflow-hidden relative">
                <Routes>
                    <Route path="/" element={<Navigate to="/calendar/week" replace />} />
                    <Route path="/calendar" element={<Navigate to="/calendar/week" replace />} />
                    <Route path="/calendar/:view" element={<CalendarContainer />} />
                    <Route path="/spaces" element={<SpacesView />} />
                    <Route path="/components" element={<ComponentsView />} />
                    <Route path="/houses" element={<HousesView />} />
                    <Route path="/houses/:id" element={<HousesView />} />
                    <Route path="/houses/:id/cronograma" element={<HousesView />} />
                    <Route path="/parcels" element={<HousesView mode="parcels" />} />
                    <Route path="/team" element={<TeamView />} />
                    <Route path="/protocols" element={<ProtocolsView />} />
                    <Route path="/materials" element={<MaterialsView />} />
                    <Route path="/directory" element={<DirectoryView />} />
                    <Route path="/calls" element={<CallsView />} />
                    <Route path="*" element={<Navigate to="/calendar/week" replace />} />
                </Routes>

                <ActionInspectorPanel />
            </div>
        </div>
    );
}

export default App;
