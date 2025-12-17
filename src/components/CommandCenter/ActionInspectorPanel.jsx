import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearSelection, setSelectedAction, setSelectedTask } from '../../store/actions/appActions';
import { updateAction, createAction, getTaskActions, updateActionsOrder, deleteAction } from '../../services/actionsService';
import { getSpaceComponents, updateComponent } from '../../services/componentsService';
import { getSpaces, getSpaceDetails, updateSpace, getStaffers } from '../../services/spacesService';
import { createTask, updateTask, getProjects, deleteTask } from '../../services/tasksService';
import { X, Save, CheckCircle, User, MapPin, Layers, Box, Edit3, Briefcase, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { format } from 'date-fns';

const ActionInspectorPanel = ({ onActionUpdated }) => {
    const dispatch = useDispatch();
    const { selectedAction, selectedTask, panelMode } = useSelector(state => state.app);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Local state for Action form
    const [actionForm, setActionForm] = useState({});

    // Local state for Task form
    const [taskForm, setTaskForm] = useState({});

    // Local state for Task Components (Actions)
    const [components, setComponents] = useState([]);

    // Dropdown options
    const [spaces, setSpaces] = useState([]);
    const [projects, setProjects] = useState([]);
    const [staffers, setStaffers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // DnD State
    const [draggedIndex, setDraggedIndex] = useState(null);

    // Load dropdown data on mount
    useEffect(() => {
        getSpaces().then(setSpaces).catch(console.error);
        getProjects().then(setProjects).catch(console.error);
        getStaffers().then(setStaffers).catch(console.error);
    }, []);

    // Load Action Data
    useEffect(() => {
        if (panelMode === 'action' && selectedAction) {
            setActionForm({
                ...selectedAction,
                fecha_fin: selectedAction.fecha_fin || selectedAction.fecha_ejecucion,
                ejecutor_nombre: selectedAction.ejecutor_nombre || ''
            });
        } else if (panelMode === 'create') {
            const today = format(new Date(), 'yyyy-MM-dd');
            setActionForm({
                descripcion: '',
                fecha_ejecucion: today,
                fecha_fin: today,
                ejecutor_nombre: '',
                completado: false,
                requiere_aprobacion_ronald: false,
                estado_aprobacion_ronald: false,
                requiere_aprobacion_wiet: false,
                estado_aprobacion_wiet: false,
                requiere_aprobacion_alejo: false,
                estado_aprobacion_alejo: false,
            });
        }
    }, [selectedAction, panelMode]);

    // Load Task Form Data
    useEffect(() => {
        if (panelMode === 'createTask' && selectedTask) {
            setTaskForm({
                ...selectedTask,
                task_description: selectedTask.task_description || '',
                fecha_inicio: selectedTask.fecha_inicio || format(new Date(), 'yyyy-MM-dd'),
                fecha_fin_estimada: selectedTask.fecha_fin_estimada || format(new Date(), 'yyyy-MM-dd'),
                espacio_uuid: selectedTask.espacio_uuid || null,
                proyecto_id: selectedTask.proyecto_id || null,
            });
        } else if (panelMode === 'task' && selectedTask) {
            // Load existing task data into taskForm for editing
            setTaskForm({
                ...selectedTask,
                task_description: selectedTask.task_description || '',
                fecha_inicio: selectedTask.fecha_inicio || (selectedTask.created_at ? selectedTask.created_at.split('T')[0] : format(new Date(), 'yyyy-MM-dd')),
                fecha_fin_estimada: selectedTask.fecha_fin_estimada || format(new Date(), 'yyyy-MM-dd'),
                espacio_uuid: selectedTask.espacio ? (selectedTask.espacio._id || selectedTask.espacio.id) : (selectedTask.espacio_uuid || null),
                proyecto_id: selectedTask.proyecto ? selectedTask.proyecto.id : (selectedTask.proyecto_id || null),
                fullActions: [] // We don't load actions into form state for edit mode, we use components state
            });
        }
    }, [selectedTask, panelMode]);

    // Load Task Data (Actions)
    useEffect(() => {
        if (panelMode === 'task' && selectedTask?.id) {
            setLoading(true);
            getTaskActions(selectedTask.id)
                .then(data => setComponents(data || []))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setComponents([]);
        }
    }, [selectedTask, panelMode]);

    const handleActionChange = (field, value) => {
        setActionForm(prev => {
            const updates = { ...prev, [field]: value };
            if (field === 'fecha_ejecucion' && updates.fecha_fin < value) {
                updates.fecha_fin = value;
            }
            if (field === 'fecha_fin' && updates.fecha_ejecucion > value) {
                updates.fecha_ejecucion = value;
            }
            return updates;
        });
    };

    const handleTaskChange = (field, value) => {
        setTaskForm(prev => {
            const updates = { ...prev, [field]: value };
            if (field === 'fecha_inicio' && updates.fecha_fin_estimada < value) {
                updates.fecha_fin_estimada = value;
            }
            if (field === 'fecha_fin_estimada' && updates.fecha_inicio > value) {
                updates.fecha_inicio = value;
            }
            return updates;
        });
    };

    // Drag and Drop Handlers
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, index) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e, targetIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === targetIndex) return;

        const newComponents = [...components];
        const draggedItem = newComponents[draggedIndex];

        // Remove from old pos
        newComponents.splice(draggedIndex, 1);
        // Insert at new pos
        newComponents.splice(targetIndex, 0, draggedItem);

        setComponents(newComponents);
        setDraggedIndex(null);

        // Optimistically update order visually. 
        try {
            const updates = newComponents.map((action, idx) => ({
                id: action.id,
                orden: idx
            })).filter(a => a.id); // Only update existing actions

            if (updates.length > 0) {
                await updateActionsOrder(updates);
            }
        } catch (error) {
            console.error('Error reordering:', error);
        }
    };

    const handleSaveAction = async (e) => {
        if (e) e.preventDefault();

        console.log("handleSaveAction CALLED - VERSION: REFACTORED_CLEAN_V1");
        setSaving(true);

        try {
            if (panelMode === 'action' && selectedAction?.id) {
                console.log("Mode: ACTION UPDATE");
                const { tarea, ...updates } = actionForm;
                await updateAction(selectedAction.id, updates);
                dispatch(setSelectedAction({ ...selectedAction, ...updates }));
                if (onActionUpdated) onActionUpdated({ ...selectedAction, ...updates });

            } else if (panelMode === 'task' && selectedTask?.id) {
                console.log("Mode: TASK & ACTIONS UPDATE");

                // 1. UPDATE TASK
                const updates = {};
                if (taskForm.task_description !== selectedTask.task_description) updates.task_description = taskForm.task_description;
                if (taskForm.fecha_inicio !== selectedTask.fecha_inicio) updates.fecha_inicio = taskForm.fecha_inicio;
                if (taskForm.fecha_fin_estimada !== selectedTask.fecha_fin_estimada) updates.fecha_fin_estimada = taskForm.fecha_fin_estimada;

                // Loose equality for IDs (string vs number)
                if (taskForm.proyecto_id && taskForm.proyecto_id != (selectedTask.proyecto?.id || selectedTask.project_id)) updates.project_id = taskForm.proyecto_id;
                if (taskForm.espacio_uuid && taskForm.espacio_uuid != (selectedTask.espacio?._id || selectedTask.espacio_uuid)) updates.espacio_uuid = taskForm.espacio_uuid;

                console.log("Task Updates:", updates);

                let updatedTaskData = selectedTask;
                if (Object.keys(updates).length > 0) {
                    updatedTaskData = await updateTask(selectedTask.id, updates);
                }

                // 2. UPDATE/CREATE ACTIONS
                // We iterate over 'components' state which holds the actions
                const actionPromises = components.map(async (action, index) => {
                    const actionPayload = {
                        descripcion: action.descripcion,
                        ejecutor_nombre: action.ejecutor_nombre,
                        ejecutor_texto: action.ejecutor_texto,
                        fecha_ejecucion: action.fecha_ejecucion,
                        fecha_fin: action.fecha_fin,
                        requiere_aprobacion_ronald: action.requiere_aprobacion_ronald,
                        requiere_aprobacion_wiet: action.requiere_aprobacion_wiet,
                        requiere_aprobacion_alejo: action.requiere_aprobacion_alejo,
                        // Ensure orden is correct based on current list index
                        orden: index
                    };

                    if (action._isNew) {
                        // INSERT
                        return createAction({
                            ...actionPayload,
                            tarea_id: selectedTask.id,
                            completado: false
                        });
                    } else {
                        // UPDATE
                        // We update all potential fields to ensure they are in sync
                        return updateAction(action.id, actionPayload);
                    }
                });

                await Promise.all(actionPromises);

                // Reload data implies fetching fresh state or just updating Redux
                dispatch(setSelectedTask(updatedTaskData));
                if (onActionUpdated) onActionUpdated();
                alert("Guardado correctamente");

            } else if (panelMode === 'create') {
                const { id, ...createData } = actionForm;
                const res = await createAction(createData);
                const newAction = res && res[0] ? res[0] : res;
                if (onActionUpdated) onActionUpdated(newAction);
                dispatch(setSelectedAction(newAction));

            } else if (panelMode === 'createTask') {
                const { id, proyecto, espacio, quickActions, fullActions, proyecto_id, ...createData } = taskForm;
                const taskPayload = { ...createData, project_id: proyecto_id || null, espacio_uuid: taskForm.espacio_uuid || null };
                const newTask = await createTask(taskPayload);

                // Create full actions if any
                if (fullActions && fullActions.length > 0) {
                    const actionPromises = fullActions.map((fa, index) =>
                        createAction({
                            tarea_id: newTask.id,
                            descripcion: fa.descripcion,
                            fecha_ejecucion: fa.fecha_ejecucion,
                            fecha_fin: fa.fecha_fin,
                            ejecutor_nombre: fa.ejecutor_nombre || '',
                            completado: false,
                            requiere_aprobacion_ronald: fa.requiere_aprobacion_ronald || false,
                            requiere_aprobacion_wiet: false,
                            requiere_aprobacion_alejo: false,
                            orden: index
                        })
                    );
                    await Promise.all(actionPromises);
                }

                dispatch(setSelectedTask(newTask));
                if (onActionUpdated) onActionUpdated(); // Trigger calendar refresh
                dispatch(clearSelection()); // Close panel after creation
            }
        } catch (error) {
            console.error(error);
            alert("Error al guardar: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTask = async () => {
        if (!selectedTask?.id) return;
        if (!confirm('¿Eliminar esta tarea y todas sus acciones asociadas?')) return;

        setSaving(true);
        try {
            await deleteTask(selectedTask.id);
            dispatch(clearSelection());
            if (onActionUpdated) onActionUpdated(); // Refresh calendar
        } catch (error) {
            alert('Error al eliminar tarea: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        dispatch(clearSelection());
        setIsCollapsed(false);
    };

    const showPanel = ['action', 'task', 'create', 'createTask'].includes(panelMode);

    // Determine visibility and height classes
    // If not showing panel (no selection): translate-y-full (hidden)
    // If showing but collapsed: h-10 (header only)
    // If showing and open: h-[300px] 
    const isHidden = !showPanel;

    const containerClasses = `
        fixed bottom-0 left-0 right-0 
        bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] 
        z-50 flex flex-col transition-all duration-300 ease-in-out
        ${isHidden ? 'translate-y-full' : 'translate-y-0'}
        ${isCollapsed ? 'h-9' : 'h-[300px]'}
    `;

    return (
        <div className={containerClasses}>
            {/* Header - COMPACTO */}
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        {panelMode === 'createTask' ? 'Nueva Tarea' :
                            panelMode === 'task' ? `Editar Tarea: ${taskForm?.task_description || '...'}` : 'Detalles'}
                    </span>
                    {(loading || saving) && <span className="text-[9px] text-blue-500 animate-pulse">{saving ? 'Guardando...' : 'Cargando...'}</span>}
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 rounded transition-colors mr-1"
                        title={isCollapsed ? "Expandir" : "Contraer"}
                    >
                        {isCollapsed ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    </button>
                    {panelMode === 'task' && (
                        <button
                            onClick={handleDeleteTask}
                            disabled={saving}
                            className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                            title="Eliminar Tarea"
                        >
                            <Trash2 size={12} />
                            Eliminar
                        </button>
                    )}

                    {showPanel && (
                        <button onClick={handleSaveAction} disabled={saving} className="p-1 hover:bg-green-50 text-green-600 rounded transition-colors disabled:opacity-50" title="Guardar">
                            <Save size={14} />
                        </button>
                    )}
                    <button onClick={handleClose} className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded transition-colors">
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Content - COMPACTO */}
            <div className="flex-1 overflow-hidden">
                {!showPanel ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                        Selecciona una acción o tarea
                    </div>
                ) : (
                    <>
                        {/* MODE: CREATE TASK */}
                        {panelMode === 'createTask' && (
                            <div className="grid grid-cols-12 h-full text-xs">
                                {/* LEFT: Task Form - MUY COMPACTO */}
                                <div className="col-span-4 p-2 border-r border-gray-100 overflow-y-auto space-y-1.5">
                                    <h3 className="text-[9px] font-bold text-gray-900 mb-1 flex items-center gap-1">
                                        <Layers size={10} className="text-blue-600" /> Datos de la Tarea
                                    </h3>

                                    {/* Task Description */}
                                    <div>
                                        <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Descripción</label>
                                        <input
                                            type="text"
                                            value={taskForm.task_description || ''}
                                            onChange={(e) => handleTaskChange('task_description', e.target.value)}
                                            className="w-full text-[10px] bg-gray-50 border border-gray-200 rounded px-1.5 py-1 focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500"
                                            placeholder="Ej: Pintura de sala..."
                                        />
                                    </div>

                                    {/* Project & Space in same row */}
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <div>
                                            <label className="block text-[8px] font-bold text-gray-400 uppercase mb-0.5">Proyecto</label>
                                            <select
                                                value={taskForm.proyecto_id || ''}
                                                onChange={(e) => handleTaskChange('proyecto_id', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-1 py-0.5 text-[10px] focus:ring-1 focus:ring-blue-500 appearance-none"
                                            >
                                                <option value="">-</option>
                                                {projects.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[8px] font-bold text-gray-400 uppercase mb-0.5">Espacio</label>
                                            <select
                                                value={taskForm.espacio_uuid || ''}
                                                onChange={(e) => handleTaskChange('espacio_uuid', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-1 py-0.5 text-[10px] focus:ring-1 focus:ring-blue-500 appearance-none"
                                            >
                                                <option value="">-</option>
                                                {spaces.map(s => (
                                                    <option key={s._id} value={s._id}>
                                                        {s.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <div>
                                            <label className="block text-[8px] font-bold text-gray-400 uppercase mb-0.5">Inicio</label>
                                            <input
                                                type="date"
                                                value={taskForm.fecha_inicio || ''}
                                                onChange={(e) => handleTaskChange('fecha_inicio', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-1 py-0.5 text-[10px] focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[8px] font-bold text-gray-400 uppercase mb-0.5">Fin Est.</label>
                                            <input
                                                type="date"
                                                value={taskForm.fecha_fin_estimada || ''}
                                                onChange={(e) => handleTaskChange('fecha_fin_estimada', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-1 py-0.5 text-[10px] focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT: Full Actions */}
                                <div className="col-span-8 bg-gray-50/50 overflow-y-auto relative">
                                    <div className="flex items-center justify-between p-2 sticky top-0 bg-gray-50 z-10 border-b border-gray-200 shadow-sm">
                                        <h3 className="text-[9px] font-bold text-gray-900 flex items-center gap-1">
                                            <Box size={10} className="text-gray-400" /> Acciones (Opcional)
                                        </h3>
                                        <button
                                            onClick={() => {
                                                const newActions = taskForm.fullActions || [];
                                                handleTaskChange('fullActions', [...newActions, {
                                                    descripcion: '',
                                                    ejecutor_nombre: '',
                                                    fecha_ejecucion: taskForm.fecha_inicio || format(new Date(), 'yyyy-MM-dd'),
                                                    fecha_fin: taskForm.fecha_inicio || format(new Date(), 'yyyy-MM-dd'),
                                                    requiere_aprobacion_ronald: false,
                                                    requiere_aprobacion_wiet: false,
                                                    requiere_aprobacion_alejo: false,
                                                }]);
                                            }}
                                            className="px-2 py-0.5 bg-blue-600 text-white rounded text-[9px] font-bold hover:bg-blue-700 transition-colors"
                                        >
                                            + Agregar
                                        </button>
                                    </div>

                                    <div className="space-y-1 p-2">
                                        {(taskForm.fullActions || []).map((action, idx) => (
                                            <FullActionRow
                                                key={idx}
                                                index={idx}
                                                action={action}
                                                staffers={staffers}
                                                onDragStart={handleDragStart}
                                                onDragOver={handleDragOver}
                                                onDrop={handleDrop}
                                                onChange={(field, value) => {
                                                    const newActions = [...(taskForm.fullActions || [])];
                                                    newActions[idx] = { ...newActions[idx], [field]: value };
                                                    handleTaskChange('fullActions', newActions);
                                                }}
                                                onDelete={() => {
                                                    const newActions = (taskForm.fullActions || []).filter((_, i) => i !== idx);
                                                    handleTaskChange('fullActions', newActions);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MODE: EDIT TASK */}
                        {panelMode === 'task' && (
                            <div className="grid grid-cols-12 h-full text-xs">
                                {/* LEFT: Task Form - NOW EDITABLE */}
                                <div className="col-span-4 p-2 border-r border-gray-100 overflow-y-auto space-y-1.5">
                                    <h3 className="text-[9px] font-bold text-gray-900 mb-1 flex items-center gap-1">
                                        <Layers size={10} className="text-blue-600" /> Datos de la Tarea
                                    </h3>

                                    {/* Task Description */}
                                    <div>
                                        <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Descripción</label>
                                        <input
                                            type="text"
                                            value={taskForm.task_description || ''}
                                            onChange={(e) => handleTaskChange('task_description', e.target.value)}
                                            className="w-full text-[10px] bg-white border border-gray-200 rounded px-1.5 py-1 focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                            placeholder="Descripción..."
                                        />
                                    </div>

                                    {/* Project & Space */}
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <div>
                                            <label className="block text-[8px] font-bold text-gray-400 uppercase mb-0.5">Proyecto</label>
                                            <select
                                                value={taskForm.proyecto_id || ''}
                                                onChange={(e) => handleTaskChange('proyecto_id', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-1 py-0.5 text-[10px] focus:ring-1 focus:ring-blue-500 appearance-none"
                                            >
                                                <option value="">-</option>
                                                {projects.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[8px] font-bold text-gray-400 uppercase mb-0.5">Espacio</label>
                                            <select
                                                value={taskForm.espacio_uuid || ''}
                                                onChange={(e) => handleTaskChange('espacio_uuid', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-1 py-0.5 text-[10px] focus:ring-1 focus:ring-blue-500 appearance-none"
                                            >
                                                <option value="">-</option>
                                                {spaces.map(s => (
                                                    <option key={s._id} value={s._id}>
                                                        {s.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <div>
                                            <label className="block text-[8px] font-bold text-gray-400 uppercase mb-0.5">Inicio</label>
                                            <input
                                                type="date"
                                                value={taskForm.fecha_inicio || ''}
                                                onChange={(e) => handleTaskChange('fecha_inicio', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-1 py-0.5 text-[10px] focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[8px] font-bold text-gray-400 uppercase mb-0.5">Fin Est.</label>
                                            <input
                                                type="date"
                                                value={taskForm.fecha_fin_estimada || ''}
                                                onChange={(e) => handleTaskChange('fecha_fin_estimada', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-1 py-0.5 text-[10px] focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-1 text-[8px] text-gray-400 bg-gray-50 p-1.5 rounded">
                                        <p>ℹ️ Edita los datos y guarda para aplicar cambios.</p>
                                    </div>
                                </div>

                                {/* RIGHT: Task Actions (Editable) */}
                                <div className="col-span-8 bg-gray-50/50 overflow-y-auto relative">
                                    <div className="flex items-center justify-between p-2 sticky top-0 bg-gray-50 z-10 border-b border-gray-200 shadow-sm">
                                        <h3 className="text-[9px] font-bold text-gray-900 flex items-center gap-1">
                                            <Box size={10} className="text-gray-400" /> Acciones de esta Tarea
                                        </h3>
                                        <button
                                            onClick={() => {
                                                // Add new action to task
                                                const newAction = {
                                                    descripcion: '',
                                                    ejecutor_nombre: '',
                                                    fecha_ejecucion: selectedTask?.fecha_inicio || format(new Date(), 'yyyy-MM-dd'),
                                                    fecha_fin: selectedTask?.fecha_inicio || format(new Date(), 'yyyy-MM-dd'),
                                                    requiere_aprobacion_ronald: false,
                                                    requiere_aprobacion_wiet: false,
                                                    requiere_aprobacion_alejo: false,
                                                    completado: false,
                                                    tarea_id: selectedTask?.id,
                                                    _isNew: true
                                                };
                                                setComponents(prev => [...prev, newAction]);
                                            }}
                                            className="px-2 py-0.5 bg-blue-600 text-white rounded text-[9px] font-bold hover:bg-blue-700 transition-colors"
                                        >
                                            + Agregar Acción
                                        </button>
                                    </div>

                                    <div className="space-y-1 p-2">
                                        {/* Show existing actions from the task */}
                                        {loading ? (
                                            <div className="text-center py-6 text-[9px] text-gray-400">
                                                <p>Cargando acciones...</p>
                                            </div>
                                        ) : components.length === 0 ? (
                                            <div className="text-center py-6 text-[9px] text-gray-400">
                                                <p>No hay acciones en esta tarea</p>
                                                <p className="text-[8px] mt-0.5">Haz clic en "+ Agregar Acción" para crear</p>
                                            </div>
                                        ) : (
                                            components.map((action, idx) => (
                                                <FullActionRow
                                                    key={action.id || idx}
                                                    index={idx}
                                                    action={action}
                                                    staffers={staffers}
                                                    isFirst={idx === 0}
                                                    isLast={idx === components.length - 1}
                                                    onDragStart={handleDragStart}
                                                    onDragOver={handleDragOver}
                                                    onDrop={handleDrop}
                                                    onChange={(field, value) => {
                                                        // STRICTLY UPDATE STATE ONLY - PERSISTENCE ON SAVE
                                                        setComponents(prev => prev.map((a, i) =>
                                                            i === idx ? { ...a, [field]: value } : a
                                                        ));
                                                    }}
                                                    onDelete={async () => {
                                                        if (action._isNew) {
                                                            // Remove from local state
                                                            setComponents(prev => prev.filter((_, i) => i !== idx));
                                                        } else {
                                                            // For deletions, user might expect immediate feedback, but given the "Save" context
                                                            // we could defer. However, deletion is rarely deferred in this UI.
                                                            // Let's stick to immediate delete for existing items for now, to ensure DB consistency.
                                                            if (confirm('¿Eliminar esta acción?')) {
                                                                try {
                                                                    await deleteAction(action.id);
                                                                    setComponents(prev => prev.filter(a => a.id !== action.id));
                                                                } catch (error) {
                                                                    alert('Error al eliminar: ' + error.message);
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};


// Componente de fila de aprobación COMPACTO
const ApprovalRow = ({ label, reqField, statusField, data, onChange }) => {
    const isRequired = data[reqField];
    const isApproved = data[statusField];
    return (
        <div className={`p-1.5 rounded border transition-all ${isRequired ? 'bg-white border-gray-200' : 'border-gray-100 bg-gray-50/50 opacity-70'}`}>
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" checked={!!isRequired} onChange={(e) => onChange(reqField, e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3 w-3" />
                    <span className="text-[10px] font-medium text-gray-700">{label}</span>
                </label>
                {isRequired && (
                    <label className="flex items-center gap-1 cursor-pointer select-none bg-green-50 px-2 py-0.5 rounded-full border border-green-100 hover:bg-green-100 transition-colors">
                        <input type="checkbox" checked={!!isApproved} onChange={(e) => onChange(statusField, e.target.checked)} className="rounded border-green-400 text-green-600 focus:ring-green-500 h-3 w-3" />
                        <span className="text-[9px] font-bold text-green-700 uppercase">{isApproved ? 'OK' : 'Pend'}</span>
                    </label>
                )}
            </div>
        </div>
    );
};

// Componente de fila de acción completa (ULTRA COMPACTO)
const FullActionRow = ({ action, onChange, onDelete, staffers = [], onMove, isFirst, isLast, onDragStart, onDragOver, onDrop, index }) => {
    return (
        <div
            draggable={!!onDragStart}
            onDragStart={(e) => onDragStart && onDragStart(e, index)}
            onDragOver={(e) => onDragOver && onDragOver(e, index)}
            onDrop={(e) => onDrop && onDrop(e, index)}
            className={`flex items-center gap-1 p-1 bg-white border border-gray-200 rounded hover:border-blue-300 transition-colors ${onDragStart ? 'cursor-move' : ''}`}
        >
            {/* Drag Handle or Arrows */}
            {onDragStart ? (
                <div className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing px-1" onMouseDown={(e) => {
                }}>
                    <GripVertical size={12} />
                </div>
            ) : (
                <div className="flex flex-col gap-0.5">
                    <button
                        onClick={() => onMove && onMove(-1)}
                        disabled={isFirst}
                        className="p-0.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-default"
                    >
                        <ArrowUp size={8} />
                    </button>
                    <button
                        onClick={() => onMove && onMove(1)}
                        disabled={isLast}
                        className="p-0.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-default"
                    >
                        <ArrowDown size={8} />
                    </button>
                </div>
            )}

            {/* Descripción */}
            <input
                type="text"
                value={action.descripcion || ''}
                onChange={(e) => onChange('descripcion', e.target.value)}
                placeholder="Descripción..."
                // Prevent drag when interacting with inputs
                onMouseDown={(e) => e.stopPropagation()}
                className="flex-1 text-[10px] bg-transparent border-0 focus:ring-0 px-1 py-0.5 min-w-0"
            />

            {/* Ejecutor - SELECT (Staff) */}
            <select
                value={action.ejecutor_nombre || ''}
                onChange={(e) => onChange('ejecutor_nombre', e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-20 text-[10px] bg-gray-50 border border-gray-200 rounded px-1 py-0.5 appearance-none"
                title="Seleccionar Staff"
            >
                <option value="">- Prof -</option>
                {staffers.map((s, idx) => (
                    <option key={s.id || idx} value={s.name}>{s.name}</option>
                ))}
            </select>

            {/* Ejecutor - FREE TEXT */}
            <input
                type="text"
                value={action.ejecutor_texto || ''}
                onChange={(e) => onChange('ejecutor_texto', e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-24 text-[10px] bg-gray-50 border border-gray-200 rounded px-1 py-0.5"
                placeholder="Ejecutor (Ext)..."
                title="Ejecutor Externo/Texto"
            />

            {/* Fecha Inicio */}
            <input
                type="date"
                value={action.fecha_ejecucion || ''}
                onChange={(e) => onChange('fecha_ejecucion', e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-24 text-[9px] bg-gray-50 border border-gray-200 rounded px-1 py-0.5"
            />

            {/* Fecha Fin */}
            <input
                type="date"
                value={action.fecha_fin || ''}
                onChange={(e) => onChange('fecha_fin', e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-24 text-[9px] bg-gray-50 border border-gray-200 rounded px-1 py-0.5"
            />

            {/* Aprobaciones (checkboxes compactos) */}
            <div className="flex items-center gap-0.5 px-1 border-l border-gray-200" onMouseDown={(e) => e.stopPropagation()}>
                <label className="flex items-center gap-0.5 cursor-pointer" title="Ronald">
                    <input
                        type="checkbox"
                        checked={action.requiere_aprobacion_ronald || false}
                        onChange={(e) => onChange('requiere_aprobacion_ronald', e.target.checked)}
                        className="h-3 w-3 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-[8px] text-gray-500">R</span>
                </label>
                <label className="flex items-center gap-0.5 cursor-pointer" title="Wiet">
                    <input
                        type="checkbox"
                        checked={action.requiere_aprobacion_wiet || false}
                        onChange={(e) => onChange('requiere_aprobacion_wiet', e.target.checked)}
                        className="h-3 w-3 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-[8px] text-gray-500">W</span>
                </label>
                <label className="flex items-center gap-0.5 cursor-pointer" title="Alejo">
                    <input
                        type="checkbox"
                        checked={action.requiere_aprobacion_alejo || false}
                        onChange={(e) => onChange('requiere_aprobacion_alejo', e.target.checked)}
                        className="h-3 w-3 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-[8px] text-gray-500">A</span>
                </label>
            </div>

            <button onClick={onDelete} className="p-1 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded transition-colors" title="Eliminar Acción">
                <X size={10} />
            </button>
        </div>
    );
};

export default ActionInspectorPanel;
