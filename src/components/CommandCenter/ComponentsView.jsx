import React, { useState, useEffect } from 'react';
import { Box, Search, Edit, Plus } from 'lucide-react';
import { getComponents } from '../../services/componentsService';

const ComponentsView = () => {
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedComponent, setSelectedComponent] = useState(null);

    useEffect(() => {
        loadComponents();
    }, []);

    const loadComponents = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getComponents();
            setComponents(data || []);
            if (data.length === 0) {
                console.warn('⚠️  No se encontraron componentes en la base de datos');
            }
        } catch (error) {
            console.error('Error loading components:', error);
            setError(error.message || 'Error al cargar componentes');
        } finally {
            setLoading(false);
        }
    };

    const filteredComponents = components.filter(component => {
        return component.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="h-full flex bg-white">
            {/* LEFT: Components List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Box size={20} className="text-blue-600" />
                        Catálogo de Componentes
                    </h2>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar componentes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <p className="text-xs text-gray-600">
                        {filteredComponents.length} componentes
                    </p>
                </div>

                {/* Components List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-gray-500">Cargando...</div>
                    ) : error ? (
                        <div className="p-4 text-center">
                            <div className="text-sm text-red-600 mb-2">❌ Error al cargar componentes</div>
                            <div className="text-xs text-gray-500">{error}</div>
                            <button
                                onClick={loadComponents}
                                className="mt-3 text-xs text-blue-600 hover:underline"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : filteredComponents.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                            {components.length === 0 ? '⚠️  No hay componentes en la base de datos' : 'No se encontraron componentes'}
                        </div>
                    ) : (
                        filteredComponents.map((component) => (
                            <button
                                key={component.id}
                                onClick={() => setSelectedComponent(component)}
                                className={`
                                    w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors
                                    ${selectedComponent?.id === component.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Box size={20} className="text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-gray-900 truncate">
                                            {component.nombre}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT: Component Details */}
            <div className="flex-1 flex flex-col">
                {selectedComponent ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Box size={32} className="text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {selectedComponent.nombre}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Componente del catálogo
                                        </p>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                    <Edit size={16} />
                                    Editar
                                </button>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">Información Básica</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-sm">
                                            <span className="text-gray-500">Nombre:</span>
                                            <span className="ml-2 text-gray-900">{selectedComponent.nombre}</span>
                                        </div>
                                        {selectedComponent.acabado && (
                                            <div className="text-sm">
                                                <span className="text-gray-500">Acabado:</span>
                                                <span className="ml-2 text-gray-900">{selectedComponent.acabado}</span>
                                            </div>
                                        )}
                                        {selectedComponent.construcción && (
                                            <div className="text-sm">
                                                <span className="text-gray-500">Construcción:</span>
                                                <span className="ml-2 text-gray-900">{selectedComponent.construcción}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                {selectedComponent.descripcion && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-3">Descripción</h4>
                                        <p className="text-sm text-gray-600">
                                            {selectedComponent.descripcion}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <Box size={48} className="mx-auto mb-3 opacity-50" />
                            <p className="text-sm">Selecciona un componente para ver detalles</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComponentsView;
