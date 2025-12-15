
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Plus, Edit2, Trash2, Search, X, Box
} from 'lucide-react';
import {
    getAllFromTable,
    createInTable,
    updateInTable,
    deleteFromTable
} from '../store/actions/actions';

import ViewToggle from '../components/common/ViewToggle';

const ComponentsManager = () => {
    const dispatch = useDispatch();
    const [components, setComponents] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    const initialFormState = {
        nombre: '',
        acabado: '',
        construcción: '',
        descripcion: '',
        espacio_elemento: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchData();
    }, [dispatch]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const spacesRes = await dispatch(getAllFromTable('Espacio_Elemento'));
            if (spacesRes.payload) setSpaces(spacesRes.payload);

            const compsRes = await dispatch(getAllFromTable('Componentes'));
            if (compsRes.payload) setComponents(compsRes.payload);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                nombre: item.nombre,
                acabado: item.acabado || '',
                construcción: item.construcción || '',
                descripcion: item.descripcion || '',
                espacio_elemento: item.espacio_elemento || ''
            });
        } else {
            setEditingItem(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const sanitizeUUID = (value) => {
                if (!value || value.trim() === '') return null;
                return value;
            };

            const dataToSave = {
                ...formData,
                espacio_elemento: sanitizeUUID(formData.espacio_elemento),
                // Ensure other potential UUID fields are sanitized if added later
            };

            console.log('Saving Component (Sanitized):', { editingItem, dataToSave });

            if (editingItem) {
                await dispatch(updateInTable('Componentes', editingItem.id, dataToSave));
            } else {
                await dispatch(createInTable('Componentes', dataToSave));
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            console.error(error);
            alert('Error al guardar: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este componente?')) {
            await dispatch(deleteFromTable('Componentes', id));
            fetchData();
        }
    };

    const filteredComponents = components.filter(item =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Gestión de Componentes</h1>
                        <p className="text-gray-500 text-sm">Administra componentes reutilizables</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Nuevo
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar componentes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Cargando...</div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredComponents.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                                            <Box size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{item.nombre}</h3>
                                            <div className="text-xs text-gray-500">
                                                {item.espacio_elemento
                                                    ? spaces.find(s => s.id === item.espacio_elemento)?.nombre
                                                    : 'Sin ubicación asignada'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => handleOpenModal(item)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1 mt-3">
                                    {item.acabado && (
                                        <div className="text-xs">
                                            <span className="font-medium text-gray-600">Acabado:</span> <span className="text-gray-500">{item.acabado}</span>
                                        </div>
                                    )}
                                    {item.construcción && (
                                        <div className="text-xs">
                                            <span className="font-medium text-gray-600">Construcción:</span> <span className="text-gray-500">{item.construcción}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {filteredComponents.length === 0 && (
                            <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-lg border border-dashed border-gray-300">
                                No se encontraron componentes
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acabado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Construcción</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredComponents.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mr-3">
                                                        <Box size={16} />
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">{item.nombre}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.espacio_elemento
                                                    ? spaces.find(s => s.id === item.espacio_elemento)?.nombre
                                                    : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.acabado || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.construcción || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-900">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredComponents.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                No se encontraron componentes
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal Form */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                                <h2 className="text-lg font-bold text-gray-800">
                                    {editingItem ? 'Editar' : 'Nuevo'} Componente
                                </h2>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Espacio/Elemento Padre</label>
                                    <select
                                        value={formData.espacio_elemento}
                                        onChange={(e) => setFormData({ ...formData, espacio_elemento: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">-- Sin Asignar --</option>
                                        {spaces.map(s => (
                                            <option key={s.id} value={s.id}>{s.nombre} ({s.tipo})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Acabado</label>
                                        <input
                                            type="text"
                                            value={formData.acabado}
                                            onChange={(e) => setFormData({ ...formData, acabado: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Construcción</label>
                                        <input
                                            type="text"
                                            value={formData.construcción}
                                            onChange={(e) => setFormData({ ...formData, construcción: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                    <textarea
                                        rows="3"
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="pt-4 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        {editingItem ? 'Actualizar' : 'Crear'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComponentsManager;
