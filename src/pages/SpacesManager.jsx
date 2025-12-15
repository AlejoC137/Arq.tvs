
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Plus, Edit2, Trash2, Search, X, Check, Home, Layers
} from 'lucide-react';
import {
    getAllFromTable,
    createInTable,
    updateInTable,
    deleteFromTable
} from '../store/actions/actions';
import { supabase } from '../database/SupabaseSchema';

import ViewToggle from '../components/common/ViewToggle';

const SpacesManager = () => {
    const dispatch = useDispatch();
    const [spaces, setSpaces] = useState([]);
    const [projects, setProjects] = useState([]);
    const [allComponents, setAllComponents] = useState([]); // Store all available components
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    // Filter states
    const [projectFilter, setProjectFilter] = useState('');

    // ... (rest of initialFormState and useEffect/fetchData remains same)
    const initialFormState = {
        nombre: '',
        apellido: '',
        tipo: 'Espacio',
        piso: '',
        proyecto: '',
        etapa: '',
        codigo_plano: '',
        componentes: []
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchData();
    }, [dispatch]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const projectsRes = await dispatch(getAllFromTable('Proyectos'));
            if (projectsRes.payload) setProjects(projectsRes.payload);

            const spacesRes = await dispatch(getAllFromTable('Espacio_Elemento'));
            if (spacesRes.payload) setSpaces(spacesRes.payload);

            const compsRes = await dispatch(getAllFromTable('Componentes'));
            if (compsRes.payload) setAllComponents(compsRes.payload);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            let parsedComponents = [];
            try {
                parsedComponents = item.componentes ? JSON.parse(item.componentes) : [];
                if (!Array.isArray(parsedComponents)) parsedComponents = [];
            } catch (e) {
                console.error("Error parsing components JSON:", e);
                parsedComponents = [];
            }

            setFormData({
                nombre: item.nombre,
                apellido: item.apellido || '',
                tipo: item.tipo,
                piso: item.piso || '',
                proyecto: item.proyecto || '',
                etapa: item.etapa || '',
                codigo_plano: item.codigo_plano || '',
                componentes: parsedComponents
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
                piso: formData.piso === '' ? null : formData.piso, // Keep as string/null to be safe with Text column
                proyecto: sanitizeUUID(formData.proyecto),
                etapa: sanitizeUUID(formData.etapa),
                codigo_plano: formData.codigo_plano,
                componentes: JSON.stringify(formData.componentes)
            };

            console.log('Saving Space/Element (Sanitized):', { editingItem, dataToSave });

            if (editingItem) {
                if (!editingItem._id) {
                    alert('Error: El elemento no tiene un _id válido.');
                    return;
                }
                // IMPORTANT: Espacio_Elemento uses '_id' as primary key.
                await dispatch(updateInTable('Espacio_Elemento', editingItem._id, dataToSave, '_id'));
            } else {
                await dispatch(createInTable('Espacio_Elemento', dataToSave));
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            console.error(error);
            alert('Error al guardar: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este espacio/elemento?')) {
            // Pass '_id' as the 3rd argument for the column name
            await dispatch(deleteFromTable('Espacio_Elemento', id, '_id'));
            fetchData();
        }
    };

    const filteredSpaces = spaces.filter(item => {
        const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProject = projectFilter ? item.proyecto === projectFilter : true;
        return matchesSearch && matchesProject;
    });

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Gestión de Espacios y Elementos (Updated)</h1>
                        <p className="text-gray-500 text-sm">Administra los espacios asociados a cada proyecto</p>
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
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar espacios..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="w-full md:w-64">
                            <select
                                value={projectFilter}
                                onChange={(e) => setProjectFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Todos los Proyectos</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Cargando...</div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSpaces.map(space => (
                            <div key={space._id || space.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-lg ${space.tipo === 'Espacio' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                            {space.tipo === 'Espacio' ? <Home size={18} /> : <Layers size={18} />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {space.nombre}
                                                {space.apellido && (
                                                    <span className="ml-1 font-normal text-gray-600">
                                                        {space.apellido}
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                                                    {projects.find(p => p.id === space.proyecto)?.name || 'Sin Proyecto'}
                                                </span>
                                                {space.piso && <span>• Piso {space.piso}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => handleOpenModal(space)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(space._id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                {/* Description removed */}

                                {/* Display Components */}
                                {space.componentes && (
                                    <div className="mt-3 border-t pt-2">
                                        <p className="text-xs font-semibold text-gray-500 mb-1">Componentes:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {(() => {
                                                try {
                                                    const compIds = JSON.parse(space.componentes);
                                                    if (Array.isArray(compIds) && compIds.length > 0) {
                                                        return compIds.map(id => {
                                                            const comp = allComponents.find(c => c.id === id);
                                                            return comp ? (
                                                                <span key={id} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-100">
                                                                    {comp.nombre}
                                                                </span>
                                                            ) : null;
                                                        });
                                                    }
                                                    return <span className="text-xs text-gray-400 italic">Ninguno</span>;
                                                } catch (e) {
                                                    return <span className="text-xs text-gray-400 italic">Error al leer</span>;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {filteredSpaces.length === 0 && (
                            <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-lg border border-dashed border-gray-300">
                                No se encontraron espacios
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piso</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proyecto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etapa</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comp.</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredSpaces.map((space) => (
                                        <tr key={space._id || space.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className={`flex-shrink-0 h-8 w-8 rounded-lg ${space.tipo === 'Espacio' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'} flex items-center justify-center mr-3`}>
                                                        {space.tipo === 'Espacio' ? <Home size={16} /> : <Layers size={16} />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{space.nombre}</div>
                                                        {space.apellido && (
                                                            <div className="text-xs text-gray-500">{space.apellido}</div>
                                                        )}
                                                        <div className="text-xs text-gray-400">{space.tipo}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {space.piso || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {projects.find(p => p.id === space.proyecto)?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {space.etapa ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                        {space.etapa}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-gray-500">
                                                    {(() => {
                                                        try {
                                                            const count = JSON.parse(space.componentes || '[]').length;
                                                            return count > 0 ? `${count} items` : '-';
                                                        } catch { return '-' }
                                                    })()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleOpenModal(space)} className="text-blue-600 hover:text-blue-900">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(space.id)} className="text-red-600 hover:text-red-900">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredSpaces.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                No se encontraron espacios
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
                                    {editingItem ? 'Editar' : 'Nuevo'} Espacio/Elemento
                                </h2>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Ej. Mueble"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Apellido (Opcional)</label>
                                        <input
                                            type="text"
                                            value={formData.apellido}
                                            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Ej. De Baño"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                        <select
                                            value={formData.tipo}
                                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="Espacio">Espacio</option>
                                            <option value="Elemento">Elemento</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Piso</label>
                                        <input
                                            type="text"
                                            value={formData.piso}
                                            onChange={(e) => setFormData({ ...formData, piso: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Ej. 1, 2"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ID del Plano (Mapping)
                                            <span className="text-xs text-gray-500 ml-2 font-normal">(Ej. HabitacionPrincipal)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.codigo_plano}
                                            onChange={(e) => setFormData({ ...formData, codigo_plano: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                            placeholder="ID del elemento SVG"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                                    <select
                                        value={formData.proyecto}
                                        onChange={(e) => setFormData({ ...formData, proyecto: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">-- Seleccionar --</option>
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-4">
                                    {/* Removed Descripcion Field */}
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Componentes Asociados</label>
                                    <div className="border border-gray-300 rounded-lg p-2 max-h-40 overflow-y-auto">
                                        {allComponents.length > 0 ? (
                                            allComponents.map(comp => (
                                                <label key={comp.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.componentes.includes(comp.id)}
                                                        onChange={(e) => {
                                                            const isChecked = e.target.checked;
                                                            let newComponents;
                                                            if (isChecked) {
                                                                newComponents = [...formData.componentes, comp.id];
                                                            } else {
                                                                newComponents = formData.componentes.filter(id => id !== comp.id);
                                                            }
                                                            setFormData({ ...formData, componentes: newComponents });
                                                        }}
                                                        className="rounded text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{comp.nombre}</span>
                                                    <span className="text-xs text-gray-500 ml-auto">{comp.acabado || 'Sin acabado'}</span>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center py-2">No hay componentes disponibles</p>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formData.componentes.length} componentes seleccionados
                                    </p>
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
        </div >
    );
};

export default SpacesManager;
