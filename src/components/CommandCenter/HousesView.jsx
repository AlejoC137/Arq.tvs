import React, { useState, useEffect } from 'react';
import { Home, MapPin, Save, Loader2, ExternalLink, Plus, Trash2, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getHouses, getParcels, updateProject, createProject, deleteProject } from '../../services/projectsService';
import { getTasksByProject } from '../../services/tasksService';
import { getSpaces } from '../../services/spacesService';
import { setSelectedTask } from '../../store/actions/appActions';

const HousesView = () => {
    const dispatch = useDispatch();
    const { navigation, refreshCounter } = useSelector(state => state.app);
    const propertyView = navigation?.propertyView || 'houses';
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [spaces, setSpaces] = useState([]);
    const [projectTasks, setProjectTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(false);

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
        loadSpaces();
    }, [propertyView]);

    const loadSpaces = async () => {
        try {
            const spacesData = await getSpaces();
            setSpaces(spacesData || []);
        } catch (error) {
            console.error('Error loading spaces:', error);
        }
    };

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
            loadProjectTasks(selectedProject.id);
        }
    }, [selectedProject, refreshCounter]);

    const loadProjectTasks = async (projectId) => {
        setLoadingTasks(true);
        try {
            const tasks = await getTasksByProject(projectId);
            setProjectTasks(tasks || []);
        } catch (error) {
            console.error('Error loading project tasks:', error);
        } finally {
            setLoadingTasks(false);
        }
    };

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

    const handleCreateNewProject = async () => {
        const name = prompt('Nombre de la nueva casa:');
        if (!name || !name.trim()) return;

        setLoading(true);
        try {
            const newProj = await createProject({
                name: name.trim(),
                status: 'Activo',
                Datos: { etapa: 'Planificación' }
            });
            setProjects(prev => [...prev, newProj].sort((a, b) => a.name.localeCompare(b.name)));
            setSelectedProject(newProj);
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Error al crear casa: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!selectedProject?.id) return;
        if (!confirm(`¿Estás seguro de que deseas eliminar "${selectedProject.name}"? Esta acción no se puede deshacer.`)) return;

        setSaving(true);
        try {
            await deleteProject(selectedProject.id);
            setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
            setSelectedProject(null);
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Error al eliminar casa: ' + error.message);
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

    const handleTaskClick = (task) => {
        dispatch(setSelectedTask(task));
    };

    return (
        <div className="h-full flex bg-white">
            {/* LEFT: SIDEBAR */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
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
                    {propertyView !== 'parcels' && (
                        <button
                            onClick={handleCreateNewProject}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            title="Nueva Casa"
                        >
                            <Plus size={16} strokeWidth={3} />
                        </button>
                    )}
                </div>

                {/* Projects List */}
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
                                            {propertyView === 'parcels' ? <MapPin size={20} className="text-blue-600" /> : <Home size={20} className="text-blue-600" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm text-gray-900 truncate">{project.name}</div>
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

            {/* RIGHT: EDITOR PANEL */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {selectedProject ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Home size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-gray-900">{formData.name || 'Sin nombre'}</h3>
                                        {propertyView !== 'parcels' && (
                                            <button
                                                onClick={handleDeleteProject}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Eliminar Casa"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full ${getEtapaColor(formData.etapa)}`}>
                                        {formData.etapa || 'Sin etapa'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={saving || !hasChanges}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${hasChanges ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                            >
                                {saving ? <><Loader2 size={16} className="animate-spin" /> Guardando...</> : <><Save size={16} /> Guardar</>}
                            </button>
                        </div>

                        {/* Editor Form */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="max-w-5xl grid grid-cols-12 gap-8">
                                {/* Form Section */}
                                <div className="col-span-12 lg:col-span-7 space-y-6">
                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nombre</label>
                                            <input type="text" value={formData.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Responsable</label>
                                            <input type="text" value={formData.responsable} onChange={(e) => handleFieldChange('responsable', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" placeholder="Nombre..." />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Etapa</label>
                                            <select value={formData.etapa} onChange={(e) => handleFieldChange('etapa', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20">
                                                <option value="">Seleccionar...</option>
                                                <option value="Planificación">Planificación</option>
                                                <option value="Obra Negra">Obra Negra</option>
                                                <option value="Acabados">Acabados</option>
                                                <option value="Entrega">Entrega</option>
                                            </select>
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Estado</label>
                                            <select value={formData.status} onChange={(e) => handleFieldChange('status', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20">
                                                <option value="">Seleccionar...</option>
                                                <option value="Activo">Activo</option>
                                                <option value="Pausado">Pausado</option>
                                                <option value="Completado">Completado</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Canva Links */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Presentaciones (Canva)</h4>
                                            <button onClick={handleAddLink} className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100">
                                                <Plus size={14} /> AGREGAR LINK
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {formData.presentacionesEspacio.map((pres, idx) => (
                                                <div key={idx} className="flex items-center gap-2 p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                                                    <select
                                                        value={pres.espacio}
                                                        onChange={(e) => handleUpdateLink(idx, 'espacio', e.target.value)}
                                                        className="w-40 px-2 py-1 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                                                    >
                                                        <option value="">- Seleccionar Espacio -</option>
                                                        {spaces.map(s => <option key={s._id} value={s.nombre}>{s.nombre}</option>)}
                                                    </select>
                                                    <input type="url" value={pres.link} onChange={(e) => handleUpdateLink(idx, 'link', e.target.value)} placeholder="Link URL..." className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-md outline-none" />
                                                    {pres.link && (
                                                        <a href={pres.link} target="_blank" rel="noopener noreferrer" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md"><ExternalLink size={14} /></a>
                                                    )}
                                                    <button onClick={() => handleRemoveLink(idx)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md"><Trash2 size={14} /></button>
                                                </div>
                                            ))}
                                            {formData.presentacionesEspacio.length === 0 && <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50/50 rounded-lg border border-dashed">No hay presentaciones definidas</p>}
                                        </div>
                                    </div>

                                    {/* Materiales */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Materiales Constantes</h4>
                                            <button onClick={handleAddMaterial} className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100">
                                                <Plus size={14} /> AGREGAR MATERIAL
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {formData.materialesConstantes.map((mat, idx) => (
                                                <div key={idx} className="flex items-center gap-2 p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                                                    <input type="text" value={mat.categoria} onChange={(e) => handleUpdateMaterial(idx, 'categoria', e.target.value)} placeholder="Categoría" className="w-24 px-2 py-1 text-xs border border-gray-200 rounded-md outline-none" />
                                                    <input type="text" value={mat.nombre} onChange={(e) => handleUpdateMaterial(idx, 'nombre', e.target.value)} placeholder="Nombre del material" className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-md outline-none" />
                                                    <input type="text" value={mat.observaciones} onChange={(e) => handleUpdateMaterial(idx, 'observaciones', e.target.value)} placeholder="Obs." className="w-24 px-2 py-1 text-xs border border-gray-200 rounded-md outline-none" />
                                                    <button onClick={() => handleRemoveMaterial(idx)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md"><Trash2 size={14} /></button>
                                                </div>
                                            ))}
                                            {formData.materialesConstantes.length === 0 && <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50/50 rounded-lg border border-dashed">No hay materiales definidos</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Tasks Section Sidebar */}
                                <div className="col-span-12 lg:col-span-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                            <Calendar size={14} className="text-blue-600" /> Tareas de la Casa
                                        </h4>
                                        <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{projectTasks.length}</span>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                                        <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100">
                                            {loadingTasks ? (
                                                <div className="p-8 text-center text-xs text-gray-500 flex flex-col items-center gap-2">
                                                    <Loader2 size={24} className="animate-spin text-blue-600" />
                                                    Cargando tareas...
                                                </div>
                                            ) : projectTasks.length === 0 ? (
                                                <div className="p-8 text-center text-xs text-gray-400 italic">No hay tareas para esta casa</div>
                                            ) : (
                                                projectTasks.map(task => (
                                                    <button
                                                        key={task.id}
                                                        onClick={() => handleTaskClick(task)}
                                                        className="w-full text-left p-4 hover:bg-white hover:shadow-md transition-all group relative overflow-hidden"
                                                    >
                                                        {/* Status Stripe */}
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.terminado ? 'bg-green-500' : 'bg-blue-400'}`} />

                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="font-bold text-xs text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                                {task.task_description}
                                                            </div>
                                                            <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                                                <span className="flex items-center gap-1"><Clock size={12} /> {task.fecha_inicio}</span>
                                                                <span className="flex items-center gap-1"><CheckCircle size={12} className={task.terminado ? 'text-green-500' : 'text-gray-300'} /> {task.terminado ? 'Completada' : 'En curso'}</span>
                                                            </div>
                                                            {task.staff?.name && (
                                                                <div className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">Responsable: {task.staff.name}</div>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center p-8 border-2 border-dashed border-gray-100 rounded-3xl">
                            <Home size={64} className="mx-auto mb-4 opacity-10" />
                            <h3 className="text-xl font-bold text-gray-300 mb-1 tracking-tight">Gestión de Casas</h3>
                            <p className="text-sm max-w-xs">{propertyView === 'parcels' ? 'Selecciona la parcelación en la barra lateral para editar los detalles generales del proyecto.' : 'Selecciona una casa o crea una nueva para comenzar a gestionar sus detalles y tareas.'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HousesView;
