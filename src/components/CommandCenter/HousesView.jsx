import React, { useState, useEffect } from 'react';
import { Home, MapPin, Save, Loader2, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getHouses, getParcels, updateProject } from '../../services/projectsService';

const HousesView = () => {
    const { navigation } = useSelector(state => state.app);
    const propertyView = navigation?.propertyView || 'houses';
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // Inline editing state
    const [formData, setFormData] = useState({
        name: '',
        responsable: '',
        status: '',
        etapa: '',
        materialesConstantes: [],
        presentacionesEspacio: []
    });
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadProjects();
    }, [propertyView]);

    // Load form data when project is selected
    useEffect(() => {
        if (selectedProject) {
            const datos = parseData(selectedProject.Datos);
            setFormData({
                name: selectedProject.name || '',
                responsable: selectedProject.responsable || '',
                status: selectedProject.status || '',
                etapa: datos?.etapa || '',
                materialesConstantes: datos?.materialesConstantes || [],
                presentacionesEspacio: datos?.presentacionesEspacio || []
            });
            setHasChanges(false);
        }
    }, [selectedProject]);

    const parseData = (datos) => {
        if (!datos) return {};
        try {
            return typeof datos === 'string' ? JSON.parse(datos) : datos;
        } catch {
            return {};
        }
    };

    const loadProjects = async () => {
        setLoading(true);
        try {
            if (propertyView === 'parcels') {
                const parcelData = await getParcels();
                setProjects(parcelData ? [parcelData] : []);
            } else {
                const housesData = await getHouses();
                setProjects(housesData || []);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!selectedProject?.id) return;

        setSaving(true);
        try {
            // Build update payload
            const existingDatos = parseData(selectedProject.Datos);
            const newDatos = {
                ...existingDatos,
                etapa: formData.etapa,
                materialesConstantes: formData.materialesConstantes,
                presentacionesEspacio: formData.presentacionesEspacio
            };

            const updates = {
                name: formData.name,
                responsable: formData.responsable,
                status: formData.status,
                Datos: newDatos
            };

            await updateProject(selectedProject.id, updates);

            // Update local state
            const updatedProject = { ...selectedProject, ...updates };
            setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
            setSelectedProject(updatedProject);
            setHasChanges(false);
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error al guardar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const getProjectEtapa = (project) => {
        const datos = parseData(project.Datos);
        return datos?.etapa || 'Sin etapa';
    };

    const getEtapaColor = (etapa) => {
        const colors = {
            'Planificación': 'bg-yellow-100 text-yellow-800',
            'Obra Negra': 'bg-gray-200 text-gray-800',
            'Acabados': 'bg-blue-100 text-blue-800',
            'Entrega': 'bg-green-100 text-green-800'
        };
        return colors[etapa] || 'bg-gray-100 text-gray-600';
    };

    // Materiales handlers
    const handleAddMaterial = () => {
        setFormData(prev => ({
            ...prev,
            materialesConstantes: [...prev.materialesConstantes, { categoria: '', nombre: '', observaciones: '' }]
        }));
        setHasChanges(true);
    };

    const handleUpdateMaterial = (index, field, value) => {
        setFormData(prev => {
            const updated = [...prev.materialesConstantes];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, materialesConstantes: updated };
        });
        setHasChanges(true);
    };

    const handleRemoveMaterial = (index) => {
        setFormData(prev => ({
            ...prev,
            materialesConstantes: prev.materialesConstantes.filter((_, i) => i !== index)
        }));
        setHasChanges(true);
    };

    // Canva Links handlers
    const handleAddLink = () => {
        setFormData(prev => ({
            ...prev,
            presentacionesEspacio: [...prev.presentacionesEspacio, { espacio: '', link: '', fechaActualizacion: '' }]
        }));
        setHasChanges(true);
    };

    const handleUpdateLink = (index, field, value) => {
        setFormData(prev => {
            const updated = [...prev.presentacionesEspacio];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, presentacionesEspacio: updated };
        });
        setHasChanges(true);
    };

    const handleRemoveLink = (index) => {
        setFormData(prev => ({
            ...prev,
            presentacionesEspacio: prev.presentacionesEspacio.filter((_, i) => i !== index)
        }));
        setHasChanges(true);
    };

    return (
        <div className="h-full flex bg-white">
            {/* LEFT: ENRICHED SIDEBAR */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        {propertyView === 'parcels' ? (
                            <><MapPin size={20} className="text-blue-600" /> Parcelación</>
                        ) : (
                            <><Home size={20} className="text-blue-600" /> Casas del Proyecto</>
                        )}
                    </h2>
                    <p className="text-xs text-gray-600">
                        {projects.length} {propertyView === 'parcels' ? 'proyecto' : 'casas'}
                    </p>
                </div>

                {/* Projects List - ENRICHED */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-gray-500">Cargando...</div>
                    ) : projects.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No hay proyectos</div>
                    ) : (
                        projects.map((project) => {
                            const etapa = getProjectEtapa(project);
                            return (
                                <button
                                    key={project.id}
                                    onClick={() => setSelectedProject(project)}
                                    className={`
                                        w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors
                                        ${selectedProject?.id === project.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}
                                    `}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            {propertyView === 'parcels' ? (
                                                <MapPin size={20} className="text-blue-600" />
                                            ) : (
                                                <Home size={20} className="text-blue-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {/* Name - Bold */}
                                            <div className="font-medium text-sm text-gray-900">
                                                {project.name}
                                            </div>
                                            {/* Etapa Badge */}
                                            <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${getEtapaColor(etapa)}`}>
                                                {etapa}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* RIGHT: INLINE EDITOR PANEL */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {selectedProject ? (
                    <>
                        {/* Header with Save Button */}
                        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Home size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {formData.name || 'Sin nombre'}
                                    </h3>
                                    <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full ${getEtapaColor(formData.etapa)}`}>
                                        {formData.etapa || 'Sin etapa'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={saving || !hasChanges}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${hasChanges
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {saving ? (
                                    <><Loader2 size={16} className="animate-spin" /> Guardando...</>
                                ) : (
                                    <><Save size={16} /> Guardar</>
                                )}
                            </button>
                        </div>

                        {/* Inline Edit Form */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="max-w-3xl space-y-6">
                                {/* Basic Info Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleFieldChange('name', e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                                            Responsable
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.responsable}
                                            onChange={(e) => handleFieldChange('responsable', e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nombre del responsable..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                                            Etapa
                                        </label>
                                        <select
                                            value={formData.etapa}
                                            onChange={(e) => handleFieldChange('etapa', e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Planificación">Planificación</option>
                                            <option value="Obra Negra">Obra Negra</option>
                                            <option value="Acabados">Acabados</option>
                                            <option value="Entrega">Entrega</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                                            Estado
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => handleFieldChange('status', e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Activo">Activo</option>
                                            <option value="Pausado">Pausado</option>
                                            <option value="Completado">Completado</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Materiales Constantes */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                                            Materiales Constantes
                                        </label>
                                        <button
                                            onClick={handleAddMaterial}
                                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            <Plus size={14} /> Agregar
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.materialesConstantes.map((mat, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                <input
                                                    type="text"
                                                    value={mat.categoria}
                                                    onChange={(e) => handleUpdateMaterial(idx, 'categoria', e.target.value)}
                                                    placeholder="Categoría"
                                                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                                                />
                                                <input
                                                    type="text"
                                                    value={mat.nombre}
                                                    onChange={(e) => handleUpdateMaterial(idx, 'nombre', e.target.value)}
                                                    placeholder="Nombre"
                                                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                                                />
                                                <input
                                                    type="text"
                                                    value={mat.observaciones}
                                                    onChange={(e) => handleUpdateMaterial(idx, 'observaciones', e.target.value)}
                                                    placeholder="Observaciones"
                                                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                                                />
                                                <button
                                                    onClick={() => handleRemoveMaterial(idx)}
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.materialesConstantes.length === 0 && (
                                            <p className="text-xs text-gray-400 italic p-2">No hay materiales definidos</p>
                                        )}
                                    </div>
                                </div>

                                {/* Presentaciones Canva */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                                            Links de Presentaciones (Canva)
                                        </label>
                                        <button
                                            onClick={handleAddLink}
                                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            <Plus size={14} /> Agregar
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.presentacionesEspacio.map((pres, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                <input
                                                    type="text"
                                                    value={pres.espacio}
                                                    onChange={(e) => handleUpdateLink(idx, 'espacio', e.target.value)}
                                                    placeholder="Espacio"
                                                    className="w-32 px-2 py-1 text-xs border border-gray-300 rounded"
                                                />
                                                <input
                                                    type="url"
                                                    value={pres.link}
                                                    onChange={(e) => handleUpdateLink(idx, 'link', e.target.value)}
                                                    placeholder="https://www.canva.com/..."
                                                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                                                />
                                                {pres.link && (
                                                    <a
                                                        href={pres.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleRemoveLink(idx)}
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.presentacionesEspacio.length === 0 && (
                                            <p className="text-xs text-gray-400 italic p-2">No hay links definidos</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            {propertyView === 'parcels' ? (
                                <>
                                    <MapPin size={48} className="mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">Selecciona la parcelación para editar</p>
                                </>
                            ) : (
                                <>
                                    <Home size={48} className="mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">Selecciona una casa para editar</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HousesView;
