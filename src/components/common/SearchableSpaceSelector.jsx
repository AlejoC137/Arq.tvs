import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronDown, CheckCircle, Plus } from 'lucide-react';
import SpaceModal from './SpaceModal';

/**
 * Selector de Espacios con Búsqueda Integrada y Creador de Espacios
 * 
 * @param {string} value - UUID del espacio seleccionado
 * @param {function} onChange - Callback al cambiar la selección (retorna UUID)
 * @param {string} projectId - ID del proyecto para filtrar espacios
 * @param {Array} spaces - Lista de todos los espacios disponibles
 * @param {function} onSpaceCreated - Callback opcional cuando se crea un nuevo espacio
 * @param {string} placeholder - Texto a mostrar cuando no hay selección
 * @param {string} className - Clases CSS adicionales para el contenedor
 */
const SearchableSpaceSelector = ({
    value,
    onChange,
    projectId,
    spaces = [],
    onSpaceCreated,
    placeholder = "- Seleccionar Espacio -",
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Filtrar espacios por proyecto y término de búsqueda
    const filteredSpaces = useMemo(() => {
        return spaces.filter(s => {
            // Filtrar por ID de proyecto (si se proporciona)
            // Manejamos comparación flexible por si los IDs vienen como string/number
            if (projectId && s.proyecto && String(s.proyecto) !== String(projectId)) return false;

            // Búsqueda por término
            const term = searchTerm.toLowerCase();
            return (
                s.nombre?.toLowerCase().includes(term) ||
                s.apellido?.toLowerCase().includes(term) ||
                s.piso?.toString().toLowerCase().includes(term)
            );
        });
    }, [spaces, projectId, searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Encontrar el nombre a mostrar para el estado colapsado
    const selectedSpace = useMemo(() => {
        if (!value) return null;
        // Buscar por ID primero, luego por nombre (soporte legado)
        return spaces.find(s => s._id === value || s._id === String(value) || s.nombre === value);
    }, [value, spaces]);

    const displayValue = selectedSpace
        ? `${selectedSpace.nombre}${selectedSpace.apellido ? ` ${selectedSpace.apellido}` : ''}${selectedSpace.piso ? ` P${selectedSpace.piso}` : ''}`
        : value || placeholder;

    const handleSpaceCreated = async (newSpace) => {
        if (onSpaceCreated) await onSpaceCreated();
        onChange(newSpace._id || newSpace.id);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-2.5 py-1.5 text-[10px] sm:text-xs font-medium border border-gray-200 rounded-lg flex items-center justify-between cursor-pointer bg-white hover:bg-gray-50 hover:border-blue-300 transition-colors shadow-sm"
            >
                <span className={`truncate ${!value ? 'text-gray-400' : 'text-gray-900'}`}>
                    {displayValue}
                </span>
                <ChevronDown size={12} className="text-gray-400 shrink-0 ml-1" />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] max-h-64 flex flex-col overflow-hidden">
                    {/* Buscador */}
                    <div className="p-2 border-b border-gray-100 bg-gray-50 flex flex-col gap-2">
                        <div className="relative">
                            <Search size={12} className="absolute left-2 top-2 text-gray-400" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Buscar espacio..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Lista de Opciones */}
                    <div className="flex-1 overflow-y-auto min-h-[100px] custom-scrollbar">
                        {filteredSpaces.length > 0 ? (
                            filteredSpaces.map(s => (
                                <div
                                    key={s._id || s.id}
                                    onClick={() => {
                                        onChange(s._id || s.id);
                                        setIsOpen(false);
                                    }}
                                    className="px-3 py-2 text-xs hover:bg-blue-50 cursor-pointer flex items-center justify-between group transition-colors"
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className="font-medium text-gray-800 truncate">{s.nombre}</span>
                                        {s.apellido && <span className="text-gray-500 truncate">{s.apellido}</span>}
                                        {s.piso && (
                                            <span className="text-blue-600 text-[9px] font-bold bg-blue-100 px-1.5 py-0.5 rounded shrink-0">
                                                PISO {s.piso}
                                            </span>
                                        )}
                                    </div>
                                    {(value === s._id || value === s.id) && <CheckCircle size={12} className="text-blue-600 shrink-0 ml-1" />}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs text-gray-400 italic">
                                No se encontraron espacios.
                            </div>
                        )}
                    </div>

                    {/* Footer - Crear Espacio */}
                    <div
                        onClick={() => { setIsSpaceModalOpen(true); setIsOpen(false); }}
                        className="p-2.5 border-t border-gray-100 bg-gray-50 cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-2 text-blue-600"
                    >
                        <Plus size={14} />
                        <span className="text-xs font-bold">Abrir Creador de Espacios</span>
                    </div>
                </div>
            )}

            <SpaceModal
                isOpen={isSpaceModalOpen}
                onClose={() => setIsSpaceModalOpen(false)}
                onSuccess={handleSpaceCreated}
                defaultProjectId={projectId}
            />
        </div>
    );
};

export default SearchableSpaceSelector;
