import React, { useState, useEffect, useRef } from 'react';
import { handleNativePrint } from '../../utils/printUtils';
import { FileText, Search, User, Calendar, Tag, Edit, Plus, Save, X } from 'lucide-react';
import { getProtocols, getProtocolCategories, createProtocol, updateProtocol } from '../../services/protocolsService';
import ReactMarkdown from 'react-markdown';
import PrintButton from '../common/PrintButton';

const ProtocolsView = () => {
    const [protocols, setProtocols] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedProtocol, setSelectedProtocol] = useState(null);

    // Creation/Editing State
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newProtocol, setNewProtocol] = useState({
        Nombre: '',
        Categoria: '',
        Contenido: ''
    });

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
    const printRef = useRef(null);
    const handlePrint = () => {
        handleNativePrint('protocols-view-print-view', `Protocolo_${selectedProtocol?.Nombre || 'Detalle'}`);
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

    const handleStartCreate = () => {
        setIsCreating(true);
        setIsEditing(false);
        setSelectedProtocol(null);
        setNewProtocol({ Nombre: '', Categoria: '', Contenido: '' });
    };

    const handleStartEdit = () => {
        if (!selectedProtocol) return;
        setNewProtocol({
            Nombre: selectedProtocol.Nombre,
            Categoria: selectedProtocol.Categoria,
            Contenido: selectedProtocol.Contenido || ''
        });
        setIsEditing(true);
        setIsCreating(false);
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setIsEditing(false);
        setNewProtocol({ Nombre: '', Categoria: '', Contenido: '' });
    };

    const handleSaveProtocol = async () => {
        if (!newProtocol.Nombre.trim()) return alert('El nombre es obligatorio');

        setSaving(true);
        try {
            if (isEditing && selectedProtocol) {
                const updated = await updateProtocol(selectedProtocol.id, newProtocol);
                setProtocols(protocols.map(p => p.id === updated.id ? updated : p));
                setCategories([...new Set([...categories, updated.Categoria].filter(Boolean))].sort());
                setIsEditing(false);
                setSelectedProtocol(updated);
            } else {
                const created = await createProtocol(newProtocol);
                setProtocols([created, ...protocols]);
                setCategories([...new Set([...categories, created.Categoria].filter(Boolean))].sort());
                setIsCreating(false);
                setSelectedProtocol(created);
            }
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="h-full flex bg-white">
            {/* LEFT: Protocols List */}
            <div className="w-96 border-r border-gray-200 flex flex-col no-print">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                            <FileText size={20} className="text-blue-600" />
                            Protocolos
                        </span>
                        <button
                            onClick={handleStartCreate}
                            className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            title="Nuevo Protocolo"
                        >
                            <Plus size={16} />
                        </button>
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

            {/* RIGHT: Protocol Details or Create/Edit Form */}
            <div className="flex-1 flex flex-col">
                {isCreating || isEditing ? (
                    <div className="flex flex-col h-full bg-white">
                        {/* Create/Edit Header */}
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isEditing ? 'Editar Protocolo' : 'Nuevo Protocolo'}
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCancelCreate}
                                    className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <X size={16} /> Cancelar
                                </button>
                                <button
                                    onClick={handleSaveProtocol}
                                    disabled={saving}
                                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                                >
                                    {saving ? 'Guardando...' : <><Save size={16} /> Guardar</>}
                                </button>
                            </div>
                        </div>

                        {/* Create Form */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título del Protocolo</label>
                                <input
                                    type="text"
                                    value={newProtocol.Nombre}
                                    onChange={e => setNewProtocol({ ...newProtocol, Nombre: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ej: Protocolo de Seguridad..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                <input
                                    list="categories-list"
                                    type="text"
                                    value={newProtocol.Categoria}
                                    onChange={e => setNewProtocol({ ...newProtocol, Categoria: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Selecciona o escribe una nueva..."
                                />
                                <datalist id="categories-list">
                                    {categories.map(cat => <option key={cat} value={cat} />)}
                                </datalist>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido (Markdown soportado)</label>
                                <textarea
                                    value={newProtocol.Contenido}
                                    onChange={e => setNewProtocol({ ...newProtocol, Contenido: e.target.value })}
                                    className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                    placeholder="# Título Principal&#10;&#10;Contenido del protocolo..."
                                />
                            </div>
                        </div>
                    </div>
                ) : selectedProtocol ? (
                    <div id="protocols-view-print-view" ref={printRef} className="flex-1 flex flex-col h-full print-container">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white print:border-none">
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
                                <div className="flex items-center gap-2 no-print">
                                    <PrintButton
                                        onClick={handlePrint}
                                    />
                                    <button
                                        onClick={handleStartEdit}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                        <Edit size={16} />
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content - Rendered as Markdown */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:text-gray-800">
                                <ReactMarkdown>
                                    {selectedProtocol.Contenido || 'Sin contenido'}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
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

