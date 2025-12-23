import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Calendar,
    Building2,
    Box,
    Home,
    MapPin,
    Users,
    FileText,
    Package,
    BookOpen,
    Upload,
    Bell
} from 'lucide-react';
import JsonImporterModal from './JsonImporterModal';
import {
    setCalendarView,
    setPropertyView,
    setActiveView,
    setSelectedTask
} from '../../store/actions/appActions';

const TopNavigation = () => {
    const dispatch = useDispatch();
    const { navigation, pendingCallsCount } = useSelector(state => state.app);
    const activeView = navigation?.activeView || 'calendar';
    const calendarView = navigation?.calendarView || 'week';
    const propertyView = navigation?.propertyView || 'houses';
    const [showImporter, setShowImporter] = useState(false);

    const handleButtonClick = (view, additionalAction = null) => {
        dispatch(setActiveView(view));
        if (additionalAction) {
            additionalAction();
        }
    };

    const isActive = (viewName) => activeView === viewName;
    const isCalendarActive = (view) => activeView === 'calendar' && calendarView === view;
    const isPropertyActive = (view) => (activeView === 'houses' || activeView === 'parcels') && propertyView === view;

    const buttonClass = (active) => `
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
        ${active
            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
        }
    `;

    return (
        <div className="bg-white border-b border-gray-200 px-4 py-2">
            <div className="flex items-center gap-2 flex-wrap">
                {/* Calendar Views */}
                <button
                    onClick={() => {
                        dispatch(setCalendarView('month'));
                        dispatch(setActiveView('calendar'));
                    }}
                    className={buttonClass(isCalendarActive('month'))}
                >
                    <Calendar size={14} />
                    <span>mes</span>
                </button>

                <button
                    onClick={() => {
                        dispatch(setCalendarView('week'));
                        dispatch(setActiveView('calendar'));
                    }}
                    className={buttonClass(isCalendarActive('week'))}
                >
                    <Calendar size={14} />
                    <span>semanal</span>
                </button>

                {/* Spaces */}
                <button
                    onClick={() => handleButtonClick('spaces')}
                    className={buttonClass(isActive('spaces'))}
                >
                    <Building2 size={14} />
                    <span>espacios</span>
                </button>

                {/* Components */}
                <button
                    onClick={() => handleButtonClick('components')}
                    className={buttonClass(isActive('components'))}
                >
                    <Box size={14} />
                    <span>componentes</span>
                </button>

                {/* Houses */}
                <button
                    onClick={() => {
                        dispatch(setPropertyView('houses'));
                        dispatch(setActiveView('houses'));
                    }}
                    className={buttonClass(isPropertyActive('houses'))}
                >
                    <Home size={14} />
                    <span>casas</span>
                </button>

                {/* Parcels */}
                <button
                    onClick={() => {
                        dispatch(setPropertyView('parcels'));
                        dispatch(setActiveView('parcels'));
                    }}
                    className={buttonClass(isPropertyActive('parcels'))}
                >
                    <MapPin size={14} />
                    <span>parcelacion</span>
                </button>

                {/* Team */}
                <button
                    onClick={() => handleButtonClick('team')}
                    className={buttonClass(isActive('team'))}
                >
                    <Users size={14} />
                    <span>Equipo</span>
                </button>

                {/* Llamados */}
                <button
                    onClick={() => handleButtonClick('llamados')}
                    className={`${buttonClass(isActive('llamados'))} relative`}
                >
                    <Bell size={14} />
                    <span>Llamados</span>
                    {pendingCallsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                            {pendingCallsCount > 99 ? '99+' : pendingCallsCount}
                        </span>
                    )}
                </button>

                {/* Protocols */}
                <button
                    onClick={() => handleButtonClick('protocols')}
                    className={buttonClass(isActive('protocols'))}
                >
                    <FileText size={14} />
                    <span>protocolos</span>
                </button>

                {/* Materials */}
                <button
                    onClick={() => handleButtonClick('materials')}
                    className={buttonClass(isActive('materials'))}
                >
                    <Package size={14} />
                    <span>materiales</span>
                </button>

                {/* Directory */}
                <button
                    onClick={() => handleButtonClick('directory')}
                    className={buttonClass(isActive('directory'))}
                >
                    <BookOpen size={14} />
                    <span>directorio</span>
                </button>

                {/* Importer */}
                <button
                    onClick={() => {
                        setShowImporter(true);
                        dispatch(setSelectedTask(null));
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border bg-gray-900 text-white border-gray-900 hover:bg-gray-800 shadow-sm ml-2"
                >
                    <Upload size={14} />
                    <span>Importador</span>
                </button>
            </div>

            <JsonImporterModal
                isOpen={showImporter}
                onClose={() => setShowImporter(false)}
            />
        </div>
    );
};

export default TopNavigation;
