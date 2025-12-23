import React from 'react';
import { useSelector } from 'react-redux';
import CalendarContainer from './CalendarContainer';
import SpacesView from './SpacesView';
import ComponentsView from './ComponentsView';
import HousesView from './HousesView';
import TeamView from './TeamView';
import ProtocolsView from './ProtocolsView';
import MaterialsView from './MaterialsView';
import DirectoryView from './DirectoryView';
import CallsView from './CallsView';
import ActionInspectorPanel from './ActionInspectorPanel';


const MainContainer = () => {
    const { navigation, panelMode, isInspectorCollapsed } = useSelector(state => state.app);
    const activeView = navigation?.activeView || 'calendar';

    const showPanel = ['action', 'task', 'create', 'createTask', 'day'].includes(panelMode);
    const paddingBottom = !showPanel ? '0' : (isInspectorCollapsed ? '40px' : '300px');

    const renderView = () => {
        switch (activeView) {
            case 'calendar':
                return <CalendarContainer />;
            case 'spaces':
                return <SpacesView />;
            case 'components':
                return <ComponentsView />;
            case 'houses':
            case 'parcels':
                return <HousesView />;
            case 'team':
                return <TeamView />;
            case 'protocols':
                return <ProtocolsView />;
            case 'materials':
                return <MaterialsView />;
            case 'directory':
                return <DirectoryView />;
            case 'llamados':
                return <CallsView />;
            default:
                return <CalendarContainer />;
        }
    };

    return (
        <div className="h-full w-full flex flex-col relative overflow-hidden">
            <div
                className="flex-1 overflow-hidden transition-all duration-300"
                style={{ paddingBottom: paddingBottom }}
            >
                {renderView()}
            </div>

            <ActionInspectorPanel />
        </div>
    );
};

export default MainContainer;
