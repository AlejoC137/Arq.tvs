import React, { useState, useEffect } from 'react';
import { FileText, Search, User, Calendar, Tag, Edit } from 'lucide-react';
import { getProtocols, getProtocolCategories } from '../../services/protocolsService';

const ProtocolsView = () => {
    const [protocols, setProtocols] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedProtocol, setSelectedProtocol] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [protocolsData, categoriesData] = await Promise.all([
                getProtocols(),
                getProtocolCategories()
            ]);
            setProtocols(protocolsData || []);
            setCategories(categoriesData || []);
        } catch (error) {
            console.error('Error loading protocols:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProtocols = protocols.filter(protocol => {
        const matchesSearch = protocol.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            protocol.Contenido?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || protocol.Categoria === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="h-full flex bg-white">
            {/* LEFT: Protocols List */}
            <div className="w-96 border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText size={20} className="text-blue-600" />
                        Protocolos
                    </h2>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar protocolos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="mb-2">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Todas las categorías</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <p className="text-xs text-gray-600">
                        {filteredProtocols.length} protocolos
                    </p>
                </div>

                {/* Protocols List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-gray-500">Cargando...</div>
                    ) : filteredProtocols.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No se encontraron protocolos
                        </div>
                    ) : (
                        filteredProtocols.map((protocol) => (
                            <button
                                key={protocol.id}
                                onClick={() => setSelectedProtocol(protocol)}
                                className={`
                                    w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors
                                    ${selectedProtocol?.id === protocol.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}
                                `}
                            >
                                <div className="font-medium text-sm text-gray-900 truncate mb-1">
                                    {protocol.Nombre}
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{protocol.Categoria || 'Sin categoría'}</span>
                                    <span>{formatDate(protocol.FechaUpdate)}</span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT: Protocol Details */}
            <div className="flex-1 flex flex-col">
                {selectedProtocol ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <FileText size={32} className="text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {selectedProtocol.Nombre}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            {selectedProtocol.Categoria && (
                                                <span className="flex items-center gap-1">
                                                    <Tag size={14} />
                                                    {selectedProtocol.Categoria}
                                                </span>
                                            )}
                                            {selectedProtocol.Editor && (
                                                <span className="flex items-center gap-1">
                                                    <User size={14} />
                                                    {selectedProtocol.Editor}
                                                </span>
                                            )}
                                            {selectedProtocol.FechaUpdate && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {formatDate(selectedProtocol.FechaUpdate)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                    <Edit size={16} />
                                    Editar
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="prose prose-sm max-w-none">
                                <div className="whitespace-pre-wrap text-gray-700">
                                    {selectedProtocol.Contenido || 'Sin contenido'}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <FileText size={48} className="mx-auto mb-3 opacity-50" />
                            <p className="text-sm">Selecciona un protocolo para ver detalles</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProtocolsView;
