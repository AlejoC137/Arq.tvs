import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

/**
 * Componente compartido para alternar entre vista de Cuadrícula y Lista
 * @param {string} viewMode - Modo actual: 'grid' | 'list'
 * @param {function} onViewChange - Función callback: (mode) => void
 */
const ViewToggle = ({ viewMode, onViewChange }) => {
    return (
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
                onClick={() => onViewChange('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                title="Vista Cuadrícula"
            >
                <LayoutGrid size={18} />
            </button>
            <button
                onClick={() => onViewChange('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                title="Vista Lista"
            >
                <List size={18} />
            </button>
        </div>
    );
};

export default ViewToggle;
