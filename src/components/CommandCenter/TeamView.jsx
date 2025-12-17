import React, { useState, useEffect } from 'react';
import { Users, User, Briefcase, Plus, X, Save, Loader2 } from 'lucide-react';
import { getStaffers } from '../../services/spacesService';
import { createTask } from '../../services/tasksService';
import { getProjects } from '../../services/tasksService';
import { getSpaces } from '../../services/spacesService';
import { format } from 'date-fns';

const TeamView = () => {
    const [staffers, setStaffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStaffer, setSelectedStaffer] = useState(null);

    // Task creation modal state
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [taskForm, setTaskForm] = useState({
        task_description: '',
        proyecto_id: '',
        espacio_uuid: '',
        fecha_inicio: format(new Date(), 'yyyy-MM-dd'),
        fecha_fin_estimada: format(new Date(), 'yyyy-MM-dd'),
    });
    const [savingTask, setSavingTask] = useState(false);
    const [taskError, setTaskError] = useState(null);

    useEffect(() => {
        loadStaffers();
    }, []);

    const loadStaffers = async () => {
        setLoading(true);
        try {
            const data = await getStaffers();
            setStaffers(data || []);
        } catch (error) {
            console.error('Error loading staffers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenTaskModal = async () => {
        setTaskForm({
            task_description: '',
            proyecto_id: '',
            espacio_uuid: '',
            fecha_inicio: format(new Date(), 'yyyy-MM-dd'),
            fecha_fin_estimada: format(new Date(), 'yyyy-MM-dd'),
        });
        setTaskError(null);

        // Load projects and spaces for dropdowns
        try {
            const [projectsData, spacesData] = await Promise.all([
                getProjects(),
                getSpaces()
            ]);
            setProjects(projectsData || []);
            setSpaces(spacesData || []);
        } catch (error) {
            console.error('Error loading data for task modal:', error);
        }

        setIsTaskModalOpen(true);
    };

    const handleTaskFormChange = (field, value) => {
        setTaskForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveTask = async () => {
        if (!taskForm.task_description.trim()) {
            setTaskError('La descripción es requerida');
            return;
        }

        setSavingTask(true);
        setTaskError(null);

        try {
            await createTask({
                task_description: taskForm.task_description,
                proyecto: taskForm.proyecto_id || null,
                espacio_uuid: taskForm.espacio_uuid || null,
                fecha_inicio: taskForm.fecha_inicio,
                fecha_fin_estimada: taskForm.fecha_fin_estimada,
                asignado_a: selectedStaffer?.name || null,
            });
            setIsTaskModalOpen(false);
            // Could trigger a reload or show success message
        } catch (error) {
            setTaskError(error.message || 'Error al crear la tarea');
        } finally {
            setSavingTask(false);
        }
    };

    return (
        <div className="h-full flex bg-white">
            {/* LEFT: Team List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Users size={20} className="text-blue-600" />
                        Equipo de Trabajo
                    </h2>
                    <p className="text-xs text-gray-600">
                        {staffers.length} miembros del equipo
                    </p>
                </div>

                {/* Team Members List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-gray-500">Cargando...</div>
                    ) : staffers.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No hay miembros del equipo
                        </div>
                    ) : (
                        staffers.map((staffer, idx) => (
                            <button
                                key={staffer.id || idx}
                                onClick={() => setSelectedStaffer(staffer)}
                                className={`
                                    w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors
                                    ${selectedStaffer?.id === staffer.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User size={20} className="text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-gray-900 truncate">
                                            {staffer.name}
                                        </div>
                                        {staffer.role_description && (
                                            <div className="text-xs text-gray-500 truncate">
                                                {staffer.role_description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT: Member Details */}
            <div className="flex-1 flex flex-col">
                {selectedStaffer ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User size={32} className="text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {selectedStaffer.name}
                                        </h3>
                                        {selectedStaffer.role_description && (
                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                <Briefcase size={14} />
                                                {selectedStaffer.role_description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleOpenTaskModal}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    <Plus size={16} />
                                    Agregar Tarea
                                </button>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                {/* Role Info */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">Información del Miembro</h4>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Rol:</span> {selectedStaffer.role_description || 'Sin rol asignado'}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats/Tasks */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">Estadísticas</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">-</div>
                                            <div className="text-xs text-gray-600">Tareas Activas</div>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">-</div>
                                            <div className="text-xs text-gray-600">Completadas</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-gray-600">-</div>
                                            <div className="text-xs text-gray-600">Total</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <Users size={48} className="mx-auto mb-3 opacity-50" />
                            <p className="text-sm">Selecciona un miembro del equipo para ver detalles</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Task Creation Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                Nueva Tarea para {selectedStaffer?.name}
                            </h2>
                            <button
                                onClick={() => setIsTaskModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-4">
                            {taskError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {taskError}
                                </div>
                            )}

                            {/* Descripción */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Descripción de la Tarea *
                                </label>
                                <input
                                    type="text"
                                    value={taskForm.task_description}
                                    onChange={(e) => handleTaskFormChange('task_description', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ej: Pintura de sala principal..."
                                />
                            </div>

                            {/* Proyecto y Espacio */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Proyecto
                                    </label>
                                    <select
                                        value={taskForm.proyecto_id}
                                        onChange={(e) => handleTaskFormChange('proyecto_id', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Espacio
                                    </label>
                                    <select
                                        value={taskForm.espacio_uuid}
                                        onChange={(e) => handleTaskFormChange('espacio_uuid', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {spaces.map(s => (
                                            <option key={s._id} value={s._id}>{s.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Fechas */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Fecha Inicio
                                    </label>
                                    <input
                                        type="date"
                                        value={taskForm.fecha_inicio}
                                        onChange={(e) => handleTaskFormChange('fecha_inicio', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Fecha Fin Estimada
                                    </label>
                                    <input
                                        type="date"
                                        value={taskForm.fecha_fin_estimada}
                                        onChange={(e) => handleTaskFormChange('fecha_fin_estimada', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => setIsTaskModalOpen(false)}
                                disabled={savingTask}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveTask}
                                disabled={savingTask}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {savingTask ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Crear Tarea
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamView;

