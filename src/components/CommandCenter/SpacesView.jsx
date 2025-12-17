import React, { useState, useEffect } from 'react';
import { Building2, Box, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { getSpaces } from '../../services/spacesService';
import { getSpaceComponents } from '../../services/componentsService';

const SpacesView = () => {
    const [spaces, setSpaces] = useState([]);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all' | 'Espacio' | 'Elemento'

    useEffect(() => {
        loadSpaces();
    }, []);

    useEffect(() => {
        if (selectedSpace) {
            loadComponents(selectedSpace._id);
        }
    }, [selectedSpace]);

    const loadSpaces = async () => {
        setLoading(true);
        try {
            const data = await getSpaces();
            setSpaces(data || []);
        } catch (error) {
            console.error('Error loading spaces:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadComponents = async (spaceId) => {
        setLoading(true);
        try {
            const data = await getSpaceComponents(spaceId);
            setComponents(data || []);
        } catch (error) {
            console.error('Error loading components:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSpaces = spaces.filter(space => {
        const matchesSearch = space.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || space.tipo === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="h-full flex bg-white">
            {/* LEFT: Spaces List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Building2 size={20} className="text-blue-600" />
                        Espacios y Elementos
                    </h2>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Filter */}
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                        {['all', 'Espacio', 'Elemento'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`
                                    flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                                    ${filterType === type
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }
                                `}
                            >
                                {type === 'all' ? 'Todos' : type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Spaces List */}
                <div className="flex-1 overflow-y-auto">
                    {loading && !selectedSpace ? (
                        <div className="p-4 text-center text-sm text-gray-500">Cargando...</div>
                    ) : filteredSpaces.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No hay espacios</div>
                    ) : (
                        filteredSpaces.map((space) => (
                            <button
                                key={space._id}
                                onClick={() => setSelectedSpace(space)}
                                className={`
                                    w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors
                                    ${selectedSpace?._id === space._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}
                                `}
                            >
                                <div className="flex items-center gap-2">
                                    {space.tipo === 'Espacio' ? (
                                        <Building2 size={16} className="text-blue-600" />
                                    ) : (
                                        <Box size={16} className="text-gray-600" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-gray-900 truncate">
                                            {space.nombre}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {space.tipo}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT: Components/Details */}
            <div className="flex-1 flex flex-col">
                {selectedSpace ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {selectedSpace.nombre}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Tipo: {selectedSpace.tipo}
                            </p>
                        </div>

                        {/* Components */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Box size={16} />
                                    Componentes ({components.length})
                                </h4>
                            </div>

                            {loading ? (
                                <div className="text-center py-8 text-sm text-gray-500">Cargando componentes...</div>
                            ) : components.length === 0 ? (
                                <div className="text-center py-8 text-sm text-gray-500">
                                    No hay componentes en este espacio
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {components.map((comp) => (
                                        <div
                                            key={comp.id}
                                            className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm text-gray-900">
                                                        {comp.nombre || comp.componente?.nombre}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Estado: <span className="font-medium text-blue-600">{comp.estado || 'Pendiente'}</span>
                                                    </div>
                                                    {comp.cantidad && (
                                                        <div className="text-xs text-gray-500">
                                                            Cantidad: {comp.cantidad}
                                                        </div>
                                                    )}
                                                    {comp.nota && (
                                                        <div className="text-xs text-gray-600 mt-1 italic">
                                                            {comp.nota}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <Building2 size={48} className="mx-auto mb-3 opacity-50" />
                            <p className="text-sm">Selecciona un espacio para ver sus componentes</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpacesView;
