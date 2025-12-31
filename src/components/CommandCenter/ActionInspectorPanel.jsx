import { useRef, useEffect, useState } from 'react';
import { handleNativePrint } from '../../utils/printUtils';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelection, setSelectedAction, setSelectedTask, fetchPendingCallsCount, toggleInspectorCollapse, incrementRefreshCounter } from '../../store/actions/appActions';
import { updateAction, createAction, getTaskActions, updateActionsOrder, deleteAction } from '../../services/actionsService';
import { getSpaceComponents, updateComponent } from '../../services/componentsService';
import { getSpaces, getSpaceDetails, updateSpace, getStaffers } from '../../services/spacesService';
import { createTask, updateTask, getProjects, deleteTask, getTasksByDate, getStages, getTaskById } from '../../services/tasksService';
import { createCall, createMultipleCalls } from '../../services/callsService';
import TaskDependencySelector from './TaskDependencySelector'; // Import Selector
import { X, Save, CheckCircle, User, MapPin, Layers, Box, Edit3, Briefcase, Trash2, ArrowUp, ArrowDown, GripVertical, Calendar, Plus, AlertCircle, PlayCircle, PauseCircle, Book, Check, Phone, Users, Image as ImageIcon, Loader2, Lock, Unlock } from 'lucide-react';
import { format } from 'date-fns';
import PrintButton from '../common/PrintButton';
import EvidenceUploader from '../common/EvidenceUploader';
import SearchableSpaceSelector from '../common/SearchableSpaceSelector';

const ActionInspectorPanel = ({ onActionUpdated, onCollapseChange }) => {
    const dispatch = useDispatch();
    const { selectedAction, selectedTask, selectedDate, panelMode, isInspectorCollapsed: isCollapsed, refreshCounter } = useSelector(state => state.app);

    // Local state for Action form
    const [actionForm, setActionForm] = useState({});

    // Local state for Task form
    const [taskForm, setTaskForm] = useState({});

    // Local state for Task Components (Actions)
    const [components, setComponents] = useState([]);

    // Local state for Day Tasks
    const [dayTasks, setDayTasks] = useState([]);

    // Dropdown options
    const [spaces, setSpaces] = useState([]);
    const [projects, setProjects] = useState([]);
    const [staffers, setStaffers] = useState([]);
    const [stages, setStages] = useState([]);
    const [callerName, setCallerName] = useState('');

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // DnD State
    const [draggedIndex, setDraggedIndex] = useState(null);

    const printRef = useRef(null);
    const handlePrint = () => {
        handleNativePrint('action-inspector-print-view', `Detalle_${panelMode}_${selectedTask?.task_description || selectedAction?.descripcion || selectedDate}`);
    };

    // Load dropdown data on mount
    useEffect(() => {
        getSpaces().then(setSpaces).catch(console.error);
        getProjects().then(setProjects).catch(console.error);
        getStaffers().then(setStaffers).catch(console.error);
        getStages().then(setStages).catch(console.error);
    }, []);

    // Load Action Data
    useEffect(() => {
        if (panelMode === 'action' && selectedAction) {
            setActionForm({
                ...selectedAction,
                fecha_fin: selectedAction.fecha_fin || selectedAction.fecha_ejecucion,
                ejecutor_nombre: selectedAction.ejecutor_nombre || '',
                evidence_url: selectedAction.evidence_url || ''
            });
        } else if (panelMode === 'create') {
            const today = format(new Date(), 'yyyy-MM-dd');
            setActionForm({
                descripcion: '',
                fecha_ejecucion: today,
                fecha_fin: today,
                ejecutor_nombre: '',
                terminado: false, // Initial state
                requiere_aprobacion_ronald: false,
                estado_aprobacion_ronald: false,
                requiere_aprobacion_wiet: false,
                estado_aprobacion_wiet: false,
                requiere_aprobacion_alejo: false,
                estado_aprobacion_alejo: false,
                evidence_url: ''
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
                terminado: selectedTask.terminado || false,
                staff_id: selectedTask.staff?.id || selectedTask.staff_id || selectedTask.asignado_a || '',
                Priority: selectedTask.Priority || '1',
                stage_id: selectedTask.stage?.id || selectedTask.stage_id || '',
                status: selectedTask.status || 'Activa',
                notes: selectedTask.notes || '',
                RonaldPass: selectedTask.RonaldPass || false,
                WietPass: selectedTask.WietPass || false,
                AlejoPass: selectedTask.AlejoPass || false,
                evidence_url: selectedTask.evidence_url || ''
            });
            // Load draft fullActions if present (for JSON Importer)
            if (selectedTask.fullActions) {
                setComponents(selectedTask.fullActions.map((a, i) => ({ ...a, orden: i, _isNew: true })));
            } else {
                setComponents([]);
            }
        } else if (panelMode === 'task' && selectedTask) {
            // Load existing task data into taskForm for editing

            // NOTE: condiciona_a is a REAL column in the database (Image Confirmed).
            // We map it directly, but we also kept the "condiciona_a_task" join for the Label in the selector.

            setTaskForm({
                ...selectedTask,
                task_description: selectedTask.task_description || '',
                fecha_inicio: selectedTask.fecha_inicio || (selectedTask.created_at ? selectedTask.created_at.split('T')[0] : format(new Date(), 'yyyy-MM-dd')),
                fecha_fin_estimada: selectedTask.fecha_fin_estimada || format(new Date(), 'yyyy-MM-dd'),
                espacio_uuid: selectedTask.espacio ? (selectedTask.espacio._id || selectedTask.espacio.id) : (selectedTask.espacio_uuid || null),
                proyecto_id: selectedTask.proyecto ? selectedTask.proyecto.id : (selectedTask.proyecto_id || null),
                terminado: selectedTask.terminado || false,
                staff_id: selectedTask.staff?.id || selectedTask.staff_id || selectedTask.asignado_a || '',
                Priority: selectedTask.Priority || '1',
                stage_id: selectedTask.stage?.id || selectedTask.stage_id || '',
                status: selectedTask.status || 'Activa',
                notes: selectedTask.notes || '',
                WietPass: selectedTask.WietPass || false,
                AlejoPass: selectedTask.AlejoPass || false,
                RonaldPass: selectedTask.RonaldPass || false,
                condicionada_por: selectedTask.condicionada_por || null, // Direct Column
                condiciona_a: selectedTask.condiciona_a || null, // Direct Column mapping
                condicionada_por_task: selectedTask.condicionada_por_task || null,
                condiciona_a_task: selectedTask.condiciona_a_task || null,
                links_de_interes: selectedTask.links_de_interes || '',
                fullActions: [],
                evidence_url: selectedTask.evidence_url || ''
            });
        }
    }, [selectedTask?.id, panelMode, refreshCounter]); // Refetch if refreshCounter increments

    // Load Task Data (Actions)
    useEffect(() => {
        if (panelMode === 'task' && selectedTask?.id) {
            // CRITICAL FIX: Clear previous components immediately to avoid "zombie" state from previous task
            setComponents([]);
            setLoading(true);
            getTaskActions(selectedTask.id)
                .then(data => setComponents(data || []))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));

        } else if (panelMode === 'day' && selectedDate) {
            setLoading(true);
            setDayTasks([]); // Clear previous day tasks
            getTasksByDate(selectedDate)
                .then(setDayTasks)
                .catch(console.error)
                .finally(() => setLoading(false));

        } else if (panelMode !== 'createTask') {
            // Only clear if NOT in create/preview mode
            setComponents([]);
            setDayTasks([]);
        }
    }, [selectedTask?.id, selectedDate, panelMode, refreshCounter]); // Refetch if refreshCounter increments

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

    const handleNavToTask = async (targetTaskId) => {
        if (!targetTaskId) return;
        try {
            const targetTask = await getTaskById(targetTaskId);
            if (targetTask) {
                // If we are in a 'dirty' state, we might want to warn? 
                // For now, simpler is just jump.
                dispatch(setSelectedTask(targetTask));
                // Ensure panel is open and in task mode (should be already if we are here)
                if (!showPanel) dispatch(toggleInspector(true));
            }
        } catch (err) {
            console.error("Error navigating to task:", err);
            alert("Error al abrir la tarea vinculada.");
        }
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

    // AUTO-SAVE for Task Completion
    const handleTaskCompletionToggle = async (e) => {
        const checked = e.target.checked;
        // Optimistic update
        setTaskForm(prev => ({ ...prev, terminado: checked }));

        if (panelMode === 'task' && selectedTask?.id) {
            try {
                await updateTask(selectedTask.id, { terminado: checked });
                // Update Redux to reflect change in UI
                dispatch(setSelectedTask({ ...selectedTask, terminado: checked }));
                if (onActionUpdated) onActionUpdated(); // Refresh calendar
            } catch (error) {
                console.error("Error auto-saving task completion:", error);
                // Revert on error
                setTaskForm(prev => ({ ...prev, terminado: !checked }));
                alert("Error al actualizar estado: " + error.message);
            }
        }
    };

    const handlePassToggle = async (field, checked) => {
        // Optimistic update
        setTaskForm(prev => ({ ...prev, [field]: checked }));

        if (panelMode === 'task' && selectedTask?.id) {
            try {
                const updatedTask = await updateTask(selectedTask.id, { [field]: checked });
                // Update Redux to reflect change in UI using the FRESH data from server
                if (updatedTask) {
                    dispatch(setSelectedTask(updatedTask));
                }
                if (onActionUpdated) onActionUpdated(); // Refresh calendar
                dispatch(incrementRefreshCounter()); // Global refresh
            } catch (error) {
                console.error(`Error auto-saving ${field}:`, error);
                // Revert on error
                setTaskForm(prev => ({ ...prev, [field]: !checked }));
                alert("Error al actualizar: " + error.message);
            }
        }
    };

    // AUTO-SAVE for Main Action Completion
    const handleActionCompletionToggle = async (e) => {
        const checked = e.target.checked;
        // Optimistic update
        setActionForm(prev => ({ ...prev, completado: checked }));

        if (panelMode === 'action' && selectedAction?.id) {
            try {
                await updateAction(selectedAction.id, { completado: checked });
                // Update Redux
                dispatch(setSelectedAction({ ...selectedAction, completado: checked })); // Use completado consistently for actions
                if (onActionUpdated) onActionUpdated({ ...selectedAction, completado: checked });
            } catch (error) {
                console.error("Error auto-saving action completion:", error);
                setActionForm(prev => ({ ...prev, completado: !checked }));
                alert("Error al actualizar estado: " + error.message);
            }
        }
    };

    // AUTO-SAVE for Sub-Action in List
    const handleSubActionChange = async (index, field, value) => {
        // Special handling for completion
        if (field === 'completado') {
            const action = components[index];
            const newStatus = value; // Checkbox value

            // Optimistic Update
            setComponents(prev => prev.map((a, i) => i === index ? { ...a, completado: newStatus } : a));

            if (!action._isNew && action.id) {
                try {
                    await updateAction(action.id, { completado: newStatus });
                    if (onActionUpdated) onActionUpdated();
                } catch (error) {
                    console.error("Error auto-saving sub-action:", error);
                    // Revert
                    setComponents(prev => prev.map((a, i) => i === index ? { ...a, completado: !newStatus } : a));
                }
            }
        } else {
            // Normal field update (wait for save)
            setComponents(prev => prev.map((a, i) =>
                i === index ? { ...a, [field]: value } : a
            ));
        }
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
        if (saving) return; // RE-ENTRATION GUARD
        setSaving(true);

        try {
            if (panelMode === 'action' && selectedAction?.id) {
                console.log("Mode: ACTION UPDATE");
                const { tarea, ...updates } = actionForm;
                await updateAction(selectedAction.id, updates);
                dispatch(setSelectedAction({ ...selectedAction, ...updates }));
                if (onActionUpdated) onActionUpdated({ ...selectedAction, ...updates });

            } else if (panelMode === 'task' && selectedTask?.id) {
                // console.log("Mode: TASK & ACTIONS UPDATE");

                // 1. UPDATE TASK
                const updates = {};
                if (taskForm.task_description !== selectedTask.task_description) updates.task_description = taskForm.task_description;
                if (taskForm.fecha_inicio !== selectedTask.fecha_inicio) updates.fecha_inicio = taskForm.fecha_inicio;
                if (taskForm.fecha_fin_estimada !== selectedTask.fecha_fin_estimada) updates.fecha_fin_estimada = taskForm.fecha_fin_estimada;
                if (taskForm.terminado !== selectedTask.terminado) updates.terminado = taskForm.terminado;
                if (taskForm.staff_id !== (selectedTask.staff_id || selectedTask.asignado_a)) updates.staff_id = taskForm.staff_id || null;

                // Loose equality for IDs (string vs number)
                if (taskForm.proyecto_id && taskForm.proyecto_id != (selectedTask.proyecto?.id || selectedTask.project_id)) updates.project_id = taskForm.proyecto_id;
                if (taskForm.espacio_uuid && taskForm.espacio_uuid != (selectedTask.espacio?._id || selectedTask.espacio_uuid)) updates.espacio_uuid = taskForm.espacio_uuid;

                console.log("Task Updates:", updates);

                if (taskForm.terminado !== selectedTask.terminado) updates.terminado = taskForm.terminado;
                if (taskForm.staff_id !== (selectedTask.staff_id || selectedTask.asignado_a)) updates.staff_id = taskForm.staff_id || null;

                // New Fields Updates
                if (taskForm.Priority !== selectedTask.Priority) updates.Priority = taskForm.Priority;
                if (taskForm.stage_id !== selectedTask.stage_id) updates.stage_id = taskForm.stage_id || null;
                if (taskForm.status !== selectedTask.status) updates.status = taskForm.status;
                if (taskForm.notes !== selectedTask.notes) updates.notes = taskForm.notes;
                if (taskForm.RonaldPass !== selectedTask.RonaldPass) updates.RonaldPass = taskForm.RonaldPass;
                if (taskForm.WietPass !== selectedTask.WietPass) updates.WietPass = taskForm.WietPass;
                if (taskForm.AlejoPass !== selectedTask.AlejoPass) updates.AlejoPass = taskForm.AlejoPass;
                if (taskForm.condicionada_por !== selectedTask.condicionada_por) updates.condicionada_por = taskForm.condicionada_por || null;
                if (taskForm.condiciona_a !== selectedTask.condiciona_a) updates.condiciona_a = taskForm.condiciona_a || null; // SAVE DIRECTLY
                if (taskForm.links_de_interes !== selectedTask.links_de_interes) updates.links_de_interes = taskForm.links_de_interes;
                if (taskForm.evidence_url !== selectedTask.evidence_url) updates.evidence_url = taskForm.evidence_url;

                let updatedTaskData = selectedTask;
                if (Object.keys(updates).length > 0) {
                    updatedTaskData = await updateTask(selectedTask.id, updates);

                    // NEW: Automatic call if status is "Pausada"
                    if (updates.status === 'Pausada') {
                        // We use a small timeout to ensure state/db is updated or just call the logic
                        console.log("Automatic call triggered for Paused status");
                        // We need to ensure we have the IDs for seguimiento or just call handleCallSeguimiento
                        // handleCallSeguimiento depends on taskForm and selectedTask being correct
                        setTimeout(() => handleCallSeguimiento(false), 500);
                    }
                }

                // 1.5 UPDATE DEPENDENTS (Side Effects for Double-Linking)

                // SIDE EFFECT 1: If "Condiciona A" changed, update the Target's "Condicionada Por"
                if (taskForm.condiciona_a !== selectedTask.condiciona_a) {
                    console.log(`DEBUG: Cambio detectado en Condiciona A.\nAnterior: ${selectedTask.condiciona_a}\nNuevo: ${taskForm.condiciona_a}`);
                    try {
                        // New Target
                        if (taskForm.condiciona_a) {
                            console.log(`Syncing: Task ${taskForm.condiciona_a} is now conditioned by ${selectedTask.id}`);
                            await updateTask(taskForm.condiciona_a, { condicionada_por: selectedTask.id });
                        }
                        // Old Target (Clear it)
                        if (selectedTask.condiciona_a && selectedTask.condiciona_a !== taskForm.condiciona_a) {
                            console.log(`Syncing: Task ${selectedTask.condiciona_a} is no longer conditioned by ${selectedTask.id}`);
                            await updateTask(selectedTask.condiciona_a, { condicionada_por: null });
                        }
                    } catch (err) {
                        console.error("Error syncing Condiciona A:", err);
                    }
                } else {
                    console.log(`DEBUG: NO se detectó cambio en Condiciona A.\nForm: ${taskForm.condiciona_a}\nOrig: ${selectedTask.condiciona_a}`);
                }

                // SIDE EFFECT 2: If "Condicionada Por" changed, update the Target's "Condiciona A"
                if (taskForm.condicionada_por !== selectedTask.condicionada_por) {
                    console.log(`DEBUG: Cambio detectado en Condicionada Por.\nAnterior: ${selectedTask.condicionada_por}\nNuevo: ${taskForm.condicionada_por}`);
                    try {
                        // New Parent
                        if (taskForm.condicionada_por) {
                            console.log(`Syncing: Task ${taskForm.condicionada_por} conditions ${selectedTask.id}`);
                            await updateTask(taskForm.condicionada_por, { condiciona_a: selectedTask.id });
                        }
                        // Old Parent (Clear it)
                        if (selectedTask.condicionada_por && selectedTask.condicionada_por !== taskForm.condicionada_por) {
                            console.log(`Syncing: Task ${selectedTask.condicionada_por} no longer conditions ${selectedTask.id}`);
                            await updateTask(selectedTask.condicionada_por, { condiciona_a: null });
                        }
                    } catch (err) {
                        console.error("Error syncing Condicionada Por:", err);
                    }
                } else {
                    console.log(`DEBUG: NO se detectó cambio en Condicionada Por.\nForm: ${taskForm.condicionada_por}\nOrig: ${selectedTask.condicionada_por}`);
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
                            ...actionPayload,
                            tarea_id: selectedTask.id,
                            completado: action.completado || false
                        });
                    } else {
                        // UPDATE
                        // We update all potential fields to ensure they are in sync
                        return updateAction(action.id, actionPayload);
                    }
                });

                await Promise.all(actionPromises);

                // RE-FETCH FRESH DATA (Critical for relationships like 'condiciona_a' which are external)
                try {
                    const freshTask = await getTaskById(selectedTask.id);
                    dispatch(setSelectedTask(freshTask));
                } catch (fetchErr) {
                    console.error("Error reloading task:", fetchErr);
                    // Fallback to local update if fetch fails
                    dispatch(setSelectedTask(updatedTaskData));
                }

                if (onActionUpdated) onActionUpdated(); // Refresh calendar/list
                dispatch(incrementRefreshCounter()); // Global refresh
                alert("Guardado correctamente");

            } else if (panelMode === 'create') {
                const { id, ...createData } = actionForm;
                const res = await createAction(createData);
                const newAction = res && res[0] ? res[0] : res;
                if (onActionUpdated) onActionUpdated(newAction);
                dispatch(setSelectedAction(newAction));
                dispatch(incrementRefreshCounter()); // Global refresh

            } else if (panelMode === 'createTask') {
                const { id, proyecto, espacio, quickActions, fullActions, proyecto_id, ...createData } = taskForm;
                const taskPayload = {
                    ...createData,
                    project_id: proyecto_id || null,
                    espacio_uuid: taskForm.espacio_uuid || null,
                    terminado: taskForm.terminado || false,
                    staff_id: taskForm.staff_id || null,
                    Priority: taskForm.Priority || '1',
                    stage_id: taskForm.stage_id || null,
                    status: taskForm.status || 'Activa',
                    notes: taskForm.notes || '',
                    links_de_interes: taskForm.links_de_interes || '',
                    evidence_url: taskForm.evidence_url || ''
                };
                const newTask = await createTask(taskPayload);

                // Create full actions from COMPONENTS state (allows editing before save)
                if (components && components.length > 0) {
                    const actionPromises = components.map((fa, index) =>
                        createAction({
                            tarea_id: newTask.id,
                            descripcion: fa.descripcion,
                            fecha_ejecucion: fa.fecha_ejecucion,
                            fecha_fin: fa.fecha_fin,
                            ejecutor_nombre: fa.ejecutor_nombre || '',
                            ejecutor_texto: fa.ejecutor_texto || '',
                            completado: fa.completado || false,
                            requiere_aprobacion_ronald: fa.requiere_aprobacion_ronald || false,
                            requiere_aprobacion_wiet: fa.requiere_aprobacion_wiet || false,
                            requiere_aprobacion_alejo: fa.requiere_aprobacion_alejo || false,
                            orden: index
                        })
                    );
                    await Promise.all(actionPromises);
                }

                dispatch(setSelectedTask(newTask));
                if (onActionUpdated) onActionUpdated(); // Trigger calendar refresh
                dispatch(incrementRefreshCounter()); // Global refresh
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
            dispatch(incrementRefreshCounter()); // Global refresh
        } catch (error) {
            alert('Error al eliminar tarea: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        dispatch(clearSelection());
        // Clean local state explicitly
        setTaskForm({});
        setComponents([]);
        setDayTasks([]);
        setIsCollapsed(false);
    };

    const handleCreateTaskForDay = () => {
        if (!selectedDate) return;
        dispatch(initCreateTask({
            task_description: '',
            fecha_inicio: selectedDate,
            fecha_fin_estimada: selectedDate,
            espacio_uuid: null,
            proyecto_id: null,
        }));
    };

    const handleSelectTask = (task) => {
        dispatch(setSelectedTask(task));
    };

    // Duplicate handler removed

    const handleCallResponsible = async () => {
        if (!taskForm.staff_id || !selectedTask?.id) {
            alert("No hay un responsable asignado para llamar.");
            return;
        }

        try {
            setSaving(true);
            await createCall({
                tarea_id: selectedTask.id,
                llamado_id: taskForm.staff_id,
                llamador_name: callerName || 'Usuario',
                proyecto_id: taskForm.proyecto_id || (selectedTask.proyecto?.id)
            });
            alert("Llamado al responsable registrado.");
            dispatch(fetchPendingCallsCount());
        } catch (error) {
            alert("Error al registrar llamado: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCallSeguimiento = async (forceAll = false) => {
        if (!selectedTask?.id) return;

        const targets = [];
        if (taskForm.AlejoPass) targets.push('112973d6-7f9e-4b48-b484-73eca526b905');
        if (taskForm.RonaldPass) targets.push('8971b42e-2856-4a92-9fdf-25e50b82ce43');
        if (taskForm.WietPass) targets.push('421e8b2b-881b-4664-9c27-8ea0e5b40284');

        if (targets.length === 0) {
            if (!forceAll) alert("No hay encargados de seguimiento seleccionados (Alejo, Ronald, Wiet).");
            return;
        }

        try {
            setSaving(true);
            const calls = targets.map(id => ({
                tarea_id: selectedTask.id,
                llamado_id: id,
                llamador_name: callerName || 'Sistema',
                proyecto_id: taskForm.proyecto_id || (selectedTask.proyecto?.id)
            }));
            await createMultipleCalls(calls);
            alert(`Llamado a seguimiento registrado (${targets.length} personas).`);
            dispatch(fetchPendingCallsCount());
        } catch (error) {
            alert("Error al registrar llamados: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const showPanel = ['action', 'task', 'create', 'createTask', 'day'].includes(panelMode);

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
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col justify-center">
                            {panelMode === 'createTask' ? (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Nueva Tarea</span>
                            ) : panelMode === 'task' ? (
                                <>
                                    <span className="text-[8px] font-bold uppercase text-gray-400 leading-none">Editar Tarea:</span>
                                    <span className="text-[15px] font-bold text-gray-800 uppercase leading-tight line-clamp-1 max-w-md" title={taskForm?.task_description}>
                                        {taskForm?.task_description || '...'}
                                    </span>
                                </>
                            ) : panelMode === 'day' ? (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Tareas del Día: {selectedDate}</span>
                            ) : (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Detalles</span>
                            )}
                        </div>
                        {(loading || saving) && <span className="text-[9px] text-blue-500 animate-pulse">{saving ? 'Guardando...' : 'Cargando...'}</span>}
                    </div>

                    {/* Bitácora & Approvals in Header - Show for Task (Edit) AND CreateTask (Preview) */}
                    {(panelMode === 'task' || panelMode === 'createTask') && (
                        <div className="flex items-center gap-3 border-l border-gray-200 pl-3 flex-1">
                            <BitacoraManager
                                notesStr={taskForm.notes}
                                onChange={(newVal) => handleTaskChange('notes', newVal)}
                                staffers={staffers}
                            />

                            <LinksManager
                                linksStr={taskForm.links_de_interes}
                                onChange={(newVal) => handleTaskChange('links_de_interes', newVal)}
                            />

                            <div className="flex items-center gap-2">
                                <ApprovalSwitch
                                    label="Alejo"
                                    value={taskForm.AlejoPass}
                                    onChange={(val) => handlePassToggle('AlejoPass', val)}
                                />
                                <ApprovalSwitch
                                    label="Ronald"
                                    value={taskForm.RonaldPass}
                                    onChange={(val) => handlePassToggle('RonaldPass', val)}
                                />
                                <ApprovalSwitch
                                    label="Wiet"
                                    value={taskForm.WietPass}
                                    onChange={(val) => handlePassToggle('WietPass', val)}
                                />
                            </div>

                            <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Yo soy:</span>
                                <input
                                    type="text"
                                    value={callerName}
                                    onChange={(e) => setCallerName(e.target.value)}
                                    placeholder="Tu nombre..."
                                    className="text-[10px] bg-white border border-gray-200 rounded px-2 py-0.5 focus:ring-1 focus:ring-blue-500 w-24"
                                />
                            </div>

                            {/* Call Buttons Section - High Contrast + "!" icons */}
                            <div className="flex items-center gap-1.5 px-2 border-x border-gray-100">
                                <button
                                    onClick={handleCallResponsible}
                                    className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm"
                                    title="Llamar al responsable"
                                >
                                    <Phone size={12} />
                                    <AlertCircle size={10} className="text-blue-200" />
                                </button>
                                <button
                                    onClick={handleCallSeguimiento}
                                    className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors shadow-sm"
                                    title="Llamar a seguimiento (Alejo/Ronald/Wiet)"
                                >
                                    <Users size={12} />
                                    <AlertCircle size={10} className="text-purple-200" />
                                </button>
                            </div>

                            {/* Dependencies Selectors - Pushed to the right */}
                            <div className="flex items-center gap-2 w-[450px]">
                                <div className="flex-1 min-w-0">
                                    <TaskDependencySelector
                                        label="Condicionada Por"
                                        value={taskForm.condicionada_por}
                                        initialItem={taskForm.condicionada_por_task}
                                        onChange={(val) => handleTaskChange('condicionada_por', val)}
                                        onEdit={(item) => handleNavToTask(item.id)}
                                        placeholder="Buscar..."
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <TaskDependencySelector
                                        label="Condiciona A"
                                        value={taskForm.condiciona_a}
                                        initialItem={taskForm.condiciona_a_task}
                                        onChange={(val) => handleTaskChange('condiciona_a', val)}
                                        onEdit={(item) => handleNavToTask(item.id)}
                                        placeholder="Buscar..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1.5 no-print">
                    {showPanel && (panelMode === 'task' || panelMode === 'action' || panelMode === 'day') && (
                        <PrintButton
                            onClick={handlePrint}
                        />
                    )}
                    <button
                        onClick={() => {
                            const newState = !isCollapsed;
                            dispatch(toggleInspectorCollapse(newState));
                            if (onCollapseChange) onCollapseChange(newState);
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 rounded transition-colors mr-1"
                        title={isCollapsed ? "Expandir" : "Contraer"}
                    >
                        {isCollapsed ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    </button>

                    {(panelMode === 'task' || panelMode === 'createTask') && (
                        <button
                            onClick={handleDeleteTask}
                            disabled={saving || !selectedTask?.id} // Disable delete if new task (draft) doesn't have ID
                            className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Eliminar Tarea"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}

                    {showPanel && (
                        <button
                            onClick={handleSaveAction}
                            disabled={saving}
                            className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 rounded text-[10px] font-bold transition-colors disabled:opacity-50"
                            title="Guardar"
                        >
                            <Save size={12} />
                            Guardar
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
                    <div id="action-inspector-print-view" ref={printRef} className="h-full print-container">
                        {/* MODE: CREATE TASK & EDIT TASK (Unified) */}
                        {(panelMode === 'task' || panelMode === 'createTask') && (
                            <div className="grid grid-cols-12 h-full text-xs">
                                {/* LEFT: Task Form - NOW EDITABLE */}
                                <div className="col-span-4 p-2 border-r border-gray-100 overflow-y-auto space-y-1.5">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-[9px] font-bold text-gray-900 flex items-center gap-1">
                                            <Layers size={10} className="text-blue-600" /> Datos de la Tarea
                                        </h3>
                                    </div>

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

                                    {/* Task Completed & Responsible Row (EDIT) */}
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        {/* Task Completed Check */}
                                        <div className={`transition-opacity duration-200 ${taskForm.terminado ? 'opacity-70' : ''}`}>
                                            <label className={`flex items-center gap-2 cursor-pointer bg-white border rounded px-2 py-1 transition-all h-full ${taskForm.terminado ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-400'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={taskForm.terminado || false}
                                                    onChange={handleTaskCompletionToggle}
                                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-3 w-3"
                                                />
                                                <span className={`text-[9px] font-bold uppercase transition-colors ${taskForm.terminado ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                                                    {taskForm.terminado ? 'Terminada' : 'Terminar'}
                                                </span>
                                            </label>
                                        </div>

                                        {/* Responsible */}
                                        <div>
                                            <select
                                                value={taskForm.staff_id || ''}
                                                onChange={(e) => handleTaskChange('staff_id', e.target.value)}
                                                className="w-full text-[10px] bg-white border border-gray-200 rounded px-1.5 py-1 focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors h-full"
                                            >
                                                <option value="">- Responsable -</option>
                                                {staffers.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name || s.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>


                                    {/* Priority, Stage, Status - Single Row (EDIT) */}
                                    <div className="grid grid-cols-12 gap-1.5 mb-1.5">
                                        <div className="col-span-2">
                                            <label className="block text-[8px] font-bold text-gray-400 uppercase mb-0.5">Prioridad</label>
                                            <select
                                                value={taskForm.Priority || '1'}
                                                onChange={(e) => handleTaskChange('Priority', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-1 py-0.5 text-[10px] focus:ring-1 focus:ring-blue-500 appearance-none"
                                            >
                                                {[1, 2, 3, 4, 5].map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-6">
                                            <label className="block text-[8px] font-bold text-gray-400 uppercase mb-0.5">Etapa (Stage)</label>
                                            <select
                                                value={taskForm.stage_id || ''}
                                                onChange={(e) => handleTaskChange('stage_id', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-1 py-0.5 text-[10px] focus:ring-1 focus:ring-blue-500 appearance-none"
                                            >
                                                <option value="">- Seleccionar -</option>
                                                {stages.map(s => <option key={s.id} value={s.id}>{s.name || s.id}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-4">
                                            <label className="block text-[8px] font-bold text-gray-400 uppercase mb-0.5">Estatus</label>
                                            <select
                                                value={taskForm.status || 'Activa'}
                                                onChange={(e) => handleTaskChange('status', e.target.value)}
                                                className={`w-full border rounded px-1 py-0.5 text-[10px] appearance-none font-bold ${taskForm.status === 'Pausada' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
                                                    }`}
                                            >
                                                <option value="Activa">Activa</option>
                                                <option value="Pausada">Pausada</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Pause Reason (Conditional) */}
                                    {taskForm.status === 'Pausada' && (
                                        <div className="mb-2 transition-all">
                                            <label className="block text-[8px] font-bold text-red-500 uppercase mb-0.5 flex items-center gap-1">
                                                <AlertCircle size={8} /> Razón de Pausa
                                            </label>

                                            <div className="bg-red-50 border border-red-200 rounded p-1 mb-1">
                                                {(() => {
                                                    try {
                                                        const entries = JSON.parse(taskForm.notes || '[]');
                                                        if (!Array.isArray(entries) || entries.length === 0) {
                                                            return <span className="text-[9px] text-gray-400 italic">Sin razón registrada.</span>;
                                                        }

                                                        // Show only the latest entry (first item)
                                                        const latest = entries[0];
                                                        return (
                                                            <div className="text-[9px]">
                                                                <div className="flex justify-between font-bold text-red-700 opacity-70 text-[8px] mb-0.5">
                                                                    <span>{latest.date}</span>
                                                                    <span>{latest.user}</span>
                                                                </div>
                                                                <p className="text-gray-700 leading-tight whitespace-pre-wrap">{latest.text}</p>
                                                            </div>
                                                        );
                                                    } catch (e) {
                                                        // Legacy text fallback
                                                        return <p className="text-[9px] text-gray-700 whitespace-pre-wrap">{taskForm.notes || 'Sin razón especificada.'}</p>;
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    )}

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
                                            <SearchableSpaceSelector
                                                value={taskForm.espacio_uuid}
                                                onChange={(val) => handleTaskChange('espacio_uuid', val)}
                                                projectId={taskForm.proyecto_id}
                                                spaces={spaces}
                                                onSpaceCreated={() => {
                                                    // Refresh spaces list after creation
                                                    getSpaces().then(setSpaces).catch(console.error);
                                                }}
                                                placeholder="-"
                                            />
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

                                    {/* Evidence Uploader (Task) */}
                                    <div className="mt-2">
                                        <EvidenceUploader
                                            currentUrl={taskForm.evidence_url}
                                            onUpload={(url) => handleTaskChange('evidence_url', url)}
                                            pathPrefix="task"
                                            label="Evidencia de Tarea"
                                        />
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
                                                    onChange={(field, value) => handleSubActionChange(idx, field, value)}
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

                        {/* MODE: DAY VIEW */}
                        {panelMode === 'day' && (
                            <div className="flex flex-col h-full bg-gray-50/50">
                                <div className="p-3 border-b border-gray-200 bg-white flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-blue-500" />
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-800">Tareas del {selectedDate}</h3>
                                            <p className="text-[10px] text-gray-400">{dayTasks.length} tareas programadas</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCreateTaskForDay}
                                        className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        <Plus size={12} />
                                        Nueva Tarea
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                    {loading ? (
                                        <div className="text-center py-10 text-gray-400 text-xs">Cargando tareas...</div>
                                    ) : dayTasks.length === 0 ? (
                                        <div className="text-center py-10 text-gray-400">
                                            <Box size={24} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-xs font-medium">No hay tareas para este día</p>
                                            <p className="text-[10px] mt-1">Usa el botón "Nueva Tarea" para comenzar</p>
                                        </div>
                                    ) : (
                                        dayTasks.map(task => (
                                            <div
                                                key={task.id}
                                                onClick={() => handleSelectTask(task)}
                                                className={`
                                                    bg-white border rounded p-2 shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all group
                                                    ${task.terminado ? 'opacity-60 grayscale border-gray-100' : 'border-gray-200'}
                                                `}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-xs font-bold text-gray-800 line-clamp-2 ${task.terminado ? 'line-through' : ''}`}>
                                                        {task.task_description}
                                                    </span>
                                                    {task.terminado && <CheckCircle size={12} className="text-green-500 shrink-0 mt-0.5" />}
                                                </div>

                                                <div className="flex items-center gap-2 mt-2">
                                                    {/* Project Badge */}
                                                    {task.proyecto && (
                                                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-bold truncate max-w-[100px]">
                                                            {task.proyecto.name}
                                                        </span>
                                                    )}

                                                    {/* Staff Badge */}
                                                    {task.staff && (
                                                        <div className="flex items-center gap-1 text-gray-500 text-[9px]">
                                                            <User size={10} />
                                                            <span className="font-medium truncate">{task.staff.name.split(' ')[0]}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* MODE: ACTION (Create or Edit) */}
                        {(panelMode === 'action' || panelMode === 'create') && (
                            <div className="p-4 h-full overflow-y-auto">
                                <div className="max-w-2xl mx-auto space-y-4">
                                    <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1 mb-2">
                                        <Box size={14} className="text-blue-600" />
                                        {panelMode === 'create' ? 'Nueva Acción' : 'Editar Acción'}
                                    </h3>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Descripción</label>
                                        <input
                                            type="text"
                                            value={actionForm.descripcion || ''}
                                            onChange={(e) => handleActionChange('descripcion', e.target.value)}
                                            className="w-full text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500"
                                            placeholder="Describe la acción..."
                                        />
                                    </div>

                                    {/* Evidence Uploader (Action) */}
                                    <div>
                                        <EvidenceUploader
                                            currentUrl={actionForm.evidence_url}
                                            onUpload={(url) => handleActionChange('evidence_url', url)}
                                            pathPrefix="action"
                                            label="Evidencia de Acción"
                                        />
                                    </div>

                                    <div className={`transition-opacity duration-200 ${actionForm.completado ? 'opacity-70' : ''}`}>
                                        <label className={`flex items-center gap-2 cursor-pointer bg-white border rounded px-3 py-2 transition-all ${actionForm.completado ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-400'}`}>
                                            <input
                                                type="checkbox"
                                                checked={actionForm.completado || false}
                                                onChange={handleActionCompletionToggle}
                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                                            />
                                            <div className="flex flex-col">
                                                <span className={`text-xs font-bold uppercase ${actionForm.completado ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                                                    {actionForm.completado ? 'Acción Completada' : 'Marcar Completada'}
                                                </span>
                                                <span className="text-[9px] text-gray-400">
                                                    {actionForm.completado ? 'Esta acción ha sido finalizada' : 'Haga clic para finalizar'}
                                                </span>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Executor */}
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Ejecutor</label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={actionForm.ejecutor_nombre || ''}
                                                    onChange={(e) => handleActionChange('ejecutor_nombre', e.target.value)}
                                                    className="flex-1 bg-white border border-gray-200 rounded px-2 py-1.5 text-xs appearance-none"
                                                >
                                                    <option value="">- Seleccionar -</option>
                                                    {staffers.map((s, idx) => (
                                                        <option key={s.id || idx} value={s.name}>{s.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* External Executor Text (Optional backup) */}
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Ejecutor Externo (Opcional)</label>
                                            <input
                                                type="text"
                                                value={actionForm.ejecutor_texto || ''}
                                                onChange={(e) => handleActionChange('ejecutor_texto', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs"
                                                placeholder="Nombre externo..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Start Date */}
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Fecha Ejecución</label>
                                            <input
                                                type="date"
                                                value={actionForm.fecha_ejecucion || ''}
                                                onChange={(e) => handleActionChange('fecha_ejecucion', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs"
                                            />
                                        </div>

                                        {/* End Date */}
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Fecha Fin</label>
                                            <input
                                                type="date"
                                                value={actionForm.fecha_fin || ''}
                                                onChange={(e) => handleActionChange('fecha_fin', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs"
                                            />
                                        </div>
                                    </div>

                                    {/* Approvals */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Aprobaciones Requeridas</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 rounded px-3 py-1.5 hover:bg-white transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={actionForm.requiere_aprobacion_ronald || false}
                                                    onChange={(e) => handleActionChange('requiere_aprobacion_ronald', e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3 w-3"
                                                />
                                                <span className="text-xs text-gray-700">Ronald</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 rounded px-3 py-1.5 hover:bg-white transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={actionForm.requiere_aprobacion_wiet || false}
                                                    onChange={(e) => handleActionChange('requiere_aprobacion_wiet', e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3 w-3"
                                                />
                                                <span className="text-xs text-gray-700">Wiet</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 rounded px-3 py-1.5 hover:bg-white transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={actionForm.requiere_aprobacion_alejo || false}
                                                    onChange={(e) => handleActionChange('requiere_aprobacion_alejo', e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3 w-3"
                                                />
                                                <span className="text-xs text-gray-700">Alejo</span>
                                            </label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div >
        </div >
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
            className={`flex items-center gap-1 p-1 bg-white border border-gray-200 rounded hover:border-blue-300 transition-colors ${onDragStart ? 'cursor-move' : ''} ${action.completado ? 'opacity-60 bg-gray-50' : ''}`}
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
                className={`flex-1 text-[10px] bg-transparent border-0 focus:ring-0 px-1 py-0.5 min-w-0 ${action.completado ? 'line-through text-gray-500' : ''}`}
            />

            {/* Completed Checkbox */}
            <input
                type="checkbox"
                checked={!!action.completado}
                onChange={(e) => onChange('completado', e.target.checked)}
                className="h-3 w-3 rounded border-gray-300 text-green-600 focus:ring-green-500 ml-1"
                title="Completado"
                onMouseDown={(e) => e.stopPropagation()}
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

// Helper Component: Bitácora Manager
const BitacoraManager = ({ notesStr, onChange, staffers = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newEntry, setNewEntry] = useState('');
    const [selectedAuthorId, setSelectedAuthorId] = useState('');
    const [entries, setEntries] = useState([]);

    // Image State
    const [attachedImage, setAttachedImage] = useState(null); // URL string for NEW upload
    const [uploading, setUploading] = useState(false);

    // Preview State (for viewing existing images)
    const [previewImageUrl, setPreviewImageUrl] = useState(null);

    // Admin Mode
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [showAdminInput, setShowAdminInput] = useState(false);
    const [adminCodeInput, setAdminCodeInput] = useState('');

    const handleAdminLogin = () => {
        if (isAdminMode) {
            setIsAdminMode(false);
            setEditModeIndex(null);
            return;
        }
        setShowAdminInput(true);
        setAdminCodeInput('');
    };

    const confirmAdminLogin = () => {
        if (adminCodeInput === import.meta.env.VITE_BITACORA_ADMING_CODE) {
            setIsAdminMode(true);
            setShowAdminInput(false);
        } else {
            alert("Código incorrecto");
        }
        setAdminCodeInput('');
    };

    // Admin Edit/Delete Logic
    const [editModeIndex, setEditModeIndex] = useState(null);
    const [editData, setEditData] = useState({});

    const handleStartEdit = (index, entry) => {
        setEditModeIndex(index);
        setEditData({ ...entry });
    };

    const handleCancelEdit = () => {
        setEditModeIndex(null);
        setEditData({});
    };

    const handleSaveEdit = (index) => {
        const updatedEntries = [...entries];
        updatedEntries[index] = editData;

        // If image was removed during edit (set to null), ensure we track that
        // Note: Actual deletion from storage happens via specific button, this just updates the entry ref

        setEntries(updatedEntries);
        onChange(JSON.stringify(updatedEntries));
        setEditModeIndex(null);
        setEditData({});
    };

    const handleDeleteEntry = async (index) => {
        if (!confirm('¿Eliminar esta entrada permanentemente?')) return;

        try {
            const entry = entries[index];
            if (entry.imageUrl) {
                const { deleteEvidence } = await import('../../services/storageService');
                await deleteEvidence(entry.imageUrl);
            }

            const updatedEntries = entries.filter((_, i) => i !== index);
            setEntries(updatedEntries);
            onChange(JSON.stringify(updatedEntries));
        } catch (error) {
            console.error(error);
            alert("Error al eliminar entrada: " + error.message);
        }
    };

    const handleUpdateEntryImage = async (index, file) => {
        try {
            const { uploadBitacoraEvidence } = await import('../../services/storageService');

            // If we are replacing an existing image in the entry
            const currentEntry = editModeIndex === index ? editData : entries[index];
            if (currentEntry.imageUrl) {
                const { deleteEvidence } = await import('../../services/storageService');
                await deleteEvidence(currentEntry.imageUrl);
            }

            const url = await uploadBitacoraEvidence(file);

            if (editModeIndex === index) {
                setEditData(prev => ({ ...prev, imageUrl: url }));
            } else {
                const updatedEntries = [...entries];
                updatedEntries[index] = { ...updatedEntries[index], imageUrl: url };
                setEntries(updatedEntries);
                onChange(JSON.stringify(updatedEntries));
            }
        } catch (error) {
            console.error(error);
            alert("Error al actualizar imagen: " + error.message);
        }
    };

    const handleDeleteEntryImage = async (index) => {
        if (!confirm('¿Eliminar imagen de esta entrada?')) return;

        try {
            const entry = editModeIndex === index ? editData : entries[index];
            if (entry.imageUrl) {
                const { deleteEvidence } = await import('../../services/storageService');
                await deleteEvidence(entry.imageUrl);
            }

            if (editModeIndex === index) {
                const newEditData = { ...editData };
                delete newEditData.imageUrl;
                setEditData(newEditData);
            } else {
                const updatedEntries = [...entries];
                const updatedEntry = { ...updatedEntries[index] };
                delete updatedEntry.imageUrl;
                updatedEntries[index] = updatedEntry;

                setEntries(updatedEntries);
                onChange(JSON.stringify(updatedEntries));
            }
        } catch (error) {
            console.error(error);
            alert("Error al eliminar imagen: " + error.message);
        }
    };

    useEffect(() => {
        try {
            const parsed = JSON.parse(notesStr || '[]');
            setEntries(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
            // Legacy text support
            if (notesStr && typeof notesStr === 'string' && notesStr.trim()) {
                setEntries([{ date: '-', user: 'System', text: notesStr }]);
            } else {
                setEntries([]);
            }
        }
    }, [notesStr]);

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const { uploadBitacoraEvidence } = await import('../../services/storageService');
            const url = await uploadBitacoraEvidence(file);
            setAttachedImage(url);
        } catch (error) {
            console.error(error);
            alert("Error al subir imagen: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleAdd = () => {
        if ((!newEntry.trim() && !attachedImage) || !selectedAuthorId) return;

        const author = staffers.find(s => s.id === selectedAuthorId)?.name || 'Unknown';

        const entry = {
            date: format(new Date(), 'dd/MM/yyyy HH:mm'),
            user: author,
            text: newEntry,
            imageUrl: attachedImage // Save URL if exists
        };
        const updated = [entry, ...entries];
        onChange(JSON.stringify(updated));

        // Reset form
        setNewEntry('');
        setAttachedImage(null);
    };

    return (
        <div className="relative">
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (isOpen) setPreviewImageUrl(null); // Close preview when closing bitacora
                }}
                className={`h-6 px-2 rounded flex items-center gap-1.5 transition-colors border ${isOpen ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                title="Abrir Bitácora"
            >
                <Book size={12} />
                <span className="text-[9px] font-bold uppercase">Bitácora</span>
            </button>

            {isOpen && (
                <>
                    {/* Main Bitacora Panel */}
                    <div className="absolute bottom-full left-0 mb-2 w-[500px] bg-white border border-gray-200 shadow-xl rounded-lg z-50 p-3 flex flex-col gap-2">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                            <h4 className="text-[10px] font-bold text-gray-700 uppercase flex items-center gap-1">
                                <Book size={10} /> Historial de Cambios
                            </h4>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleAdminLogin}
                                    className={`text-[9px] flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors relative ${isAdminMode ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                    title="Modo Administrador"
                                >
                                    {isAdminMode ? <Unlock size={10} /> : <Lock size={10} />}
                                    {isAdminMode && "Admin"}
                                </button>

                                {/* Password Input Popover */}
                                {showAdminInput && (
                                    <div className="absolute top-8 right-8 bg-white shadow-xl border border-gray-200 rounded p-2 z-[60] flex flex-col gap-2 w-48 animate-in fade-in zoom-in-95 duration-100">
                                        <p className="text-[10px] font-bold text-gray-700">Ingrese Código:</p>
                                        <input
                                            type="password"
                                            autoFocus
                                            value={adminCodeInput}
                                            onChange={(e) => setAdminCodeInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && confirmAdminLogin()}
                                            className="w-full text-[10px] border border-gray-300 rounded px-1.5 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="••••"
                                        />
                                        <div className="flex justify-end gap-1">
                                            <button onClick={() => setShowAdminInput(false)} className="text-[9px] px-2 py-1 bg-gray-100 rounded text-gray-600 hover:bg-gray-200">Cancelar</button>
                                            <button onClick={confirmAdminLogin} className="text-[9px] px-2 py-1 bg-blue-600 rounded text-white hover:bg-blue-700">Confirmar</button>
                                        </div>
                                    </div>
                                )}

                                <button onClick={() => { setIsOpen(false); setPreviewImageUrl(null); }} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                            </div>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto space-y-2 p-1 bg-gray-50 rounded border border-gray-100">
                            {entries.length === 0 && <p className="text-[9px] text-center text-gray-400 italic py-2">No hay registros aún.</p>}
                            {entries.map((e, idx) => (
                                <div key={idx} className={`bg-white p-2 rounded shadow-sm border ${editModeIndex === idx ? 'border-blue-300 ring-2 ring-blue-50' : 'border-gray-100'}`}>
                                    {editModeIndex === idx ? (
                                        // EDIT MODE
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex flex-col gap-1 flex-1">
                                                    <label className="text-[8px] font-bold text-gray-500">Fecha/Hora</label>
                                                    <input
                                                        type="text"
                                                        value={editData.date}
                                                        onChange={(ev) => setEditData({ ...editData, date: ev.target.value })}
                                                        className="text-[9px] border border-gray-300 rounded px-1 py-0.5 w-full"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1 flex-1">
                                                    <label className="text-[8px] font-bold text-gray-500">Usuario</label>
                                                    <input
                                                        type="text"
                                                        value={editData.user}
                                                        onChange={(ev) => setEditData({ ...editData, user: ev.target.value })}
                                                        className="text-[9px] border border-gray-300 rounded px-1 py-0.5 w-full"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-[8px] font-bold text-gray-500">Nota</label>
                                                <textarea
                                                    value={editData.text}
                                                    onChange={(ev) => setEditData({ ...editData, text: ev.target.value })}
                                                    className="w-full text-[10px] border border-gray-300 rounded p-1.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    rows={3}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-1">
                                                <div className="flex items-center gap-2">
                                                    {/* Edit Image Controls */}
                                                    {editData.imageUrl ? (
                                                        <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                                                            <ImageIcon size={10} className="text-blue-500" />
                                                            <span className="text-[8px] text-gray-500">Imagen adjunta</span>
                                                            <button onClick={() => handleDeleteEntryImage(idx)} className="text-red-500 hover:bg-red-50 rounded p-0.5"><Trash2 size={10} /></button>
                                                        </div>
                                                    ) : (
                                                        <div className="relative">
                                                            <input
                                                                type="file"
                                                                id={`edit-mode-img-${idx}`}
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(evt) => evt.target.files[0] && handleUpdateEntryImage(idx, evt.target.files[0])}
                                                            />
                                                            <label htmlFor={`edit-mode-img-${idx}`} className="flex items-center gap-1 text-[9px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded cursor-pointer hover:bg-blue-100">
                                                                <Plus size={10} /> Add Img
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={handleCancelEdit} className="px-2 py-1 bg-white border border-gray-200 text-gray-600 text-[9px] rounded hover:bg-gray-50">Cancelar</button>
                                                    <button onClick={() => handleSaveEdit(idx)} className="px-2 py-1 bg-blue-600 text-white text-[9px] rounded hover:bg-blue-700 flex items-center gap-1"><Save size={10} /> Guardar</button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // VIEW MODE
                                        <>
                                            <div className="flex justify-between items-center text-[8px] text-gray-400 mb-1 border-b border-gray-50 pb-0.5">
                                                <span>{e.date}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-blue-600 bg-blue-50 px-1 rounded">{e.user}</span>
                                                    {isAdminMode && (
                                                        <div className="flex items-center gap-1">
                                                            <button onClick={() => handleStartEdit(idx, e)} className="text-gray-400 hover:text-blue-500" title="Editar entrada"><Edit3 size={10} /></button>
                                                            <button onClick={() => handleDeleteEntry(idx)} className="text-gray-400 hover:text-red-500" title="Eliminar entrada"><Trash2 size={10} /></button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-gray-800 whitespace-pre-wrap leading-relaxed">{e.text}</p>

                                            {e.imageUrl && (
                                                <div className="mt-1.5 flex items-center gap-2">
                                                    <button
                                                        onClick={() => setPreviewImageUrl(previewImageUrl === e.imageUrl ? null : e.imageUrl)}
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-[9px] transition-colors ${previewImageUrl === e.imageUrl ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-blue-600'}`}
                                                    >
                                                        <ImageIcon size={10} />
                                                        {previewImageUrl === e.imageUrl ? 'Ocultar' : 'Ver'}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-1 items-end pt-1 border-t border-gray-100 flex-col">
                            <select
                                value={selectedAuthorId}
                                onChange={(e) => setSelectedAuthorId(e.target.value)}
                                className="w-full text-[10px] border border-gray-200 rounded p-1 mb-1 focus:ring-1 focus:ring-blue-500 bg-white"
                            >
                                <option value="">- Quién escribe? -</option>
                                {staffers.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <div className="flex gap-1 w-full items-end">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={newEntry}
                                        onChange={(e) => setNewEntry(e.target.value)}
                                        placeholder="Escribe una nueva nota..."
                                        rows={3}
                                        className="w-full text-[10px] border border-gray-200 rounded p-1.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAdd();
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    {/* Image Attachment Trigger */}
                                    <input
                                        type="file"
                                        id="bitacora-img-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        disabled={uploading}
                                    />
                                    <label
                                        htmlFor="bitacora-img-upload"
                                        className={`p-1.5 rounded cursor-pointer transition-colors flex items-center justify-center h-8 w-8 ${attachedImage ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-500'} border border-transparent hover:border-blue-200`}
                                        title={attachedImage ? "Imagen adjunta (Click para cambiar)" : "Adjuntar imagen"}
                                    >
                                        {uploading ? (
                                            <Loader2 size={12} className="animate-spin" />
                                        ) : attachedImage ? (
                                            <CheckCircle size={12} />
                                        ) : (
                                            <ImageIcon size={14} />
                                        )}
                                    </label>

                                    <button
                                        onClick={handleAdd}
                                        disabled={(!newEntry.trim() && !attachedImage) || !selectedAuthorId || uploading}
                                        className="bg-blue-600 text-white rounded p-1.5 h-8 w-8 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-w-[32px]"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                            {attachedImage && (
                                <div className="w-full text-[8px] text-green-600 flex items-center justify-between bg-green-50 px-1.5 py-0.5 rounded">
                                    <span className="truncate max-w-[200px]">Imagen lista para adjuntar</span>
                                    <button onClick={() => setAttachedImage(null)} className="text-red-400 hover:text-red-600"><X size={8} /></button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Side Preview Panel */}
                    {previewImageUrl && (
                        <div className="absolute bottom-full left-[512px] mb-2 w-[400px] h-[400px] bg-white border border-gray-200 shadow-xl rounded-lg z-50 flex flex-col overflow-hidden">
                            <div className="flex justify-between items-center p-2 border-b border-gray-100 bg-gray-50">
                                <h4 className="text-[10px] font-bold text-gray-700 uppercase flex items-center gap-1">
                                    <ImageIcon size={10} /> Vista Previa
                                </h4>
                                <button onClick={() => setPreviewImageUrl(null)} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                            </div>
                            <div className="flex-1 p-2 flex items-center justify-center bg-gray-900 overflow-hidden relative group">
                                <img
                                    src={previewImageUrl}
                                    alt="Evidence"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// Helper Component: Links Manager
const LinksManager = ({ linksStr, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [links, setLinks] = useState([]);
    const [newName, setNewName] = useState('');
    const [newUrl, setNewUrl] = useState('');

    useEffect(() => {
        try {
            const parsed = JSON.parse(linksStr || '[]');
            setLinks(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
            setLinks([]);
        }
    }, [linksStr]);

    const handleAdd = () => {
        if (!newName.trim() || !newUrl.trim()) return;

        // Simple URL validation prefix
        let formattedUrl = newUrl.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = 'https://' + formattedUrl;
        }

        const newLinkObj = {
            nombre: newName.trim(),
            link: formattedUrl
        };

        const updated = [...links, newLinkObj];
        onChange(JSON.stringify(updated));

        setNewName('');
        setNewUrl('');
    };

    const handleDelete = (index) => {
        const updated = links.filter((_, i) => i !== index);
        onChange(JSON.stringify(updated));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`h-6 px-2 rounded flex items-center gap-1.5 transition-colors border ${isOpen ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                title="Links de Interés"
            >
                <Layers size={12} />
                <span className="text-[9px] font-bold uppercase">Links</span>
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-200 shadow-xl rounded-lg z-50 p-3 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                        <h4 className="text-[10px] font-bold text-gray-700 uppercase flex items-center gap-1">
                            <Layers size={10} /> Links de Interés
                        </h4>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                    </div>

                    <div className="max-h-32 overflow-y-auto space-y-1 py-1">
                        {links.length === 0 && <p className="text-[9px] text-center text-gray-400 italic">No hay links.</p>}
                        {links.map((li, idx) => (
                            <div key={idx} className="flex items-center justify-between group bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                <a
                                    href={li.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-blue-600 hover:underline truncate flex-1 font-medium"
                                    title={li.link}
                                >
                                    {li.nombre}
                                </a>
                                <button
                                    onClick={() => handleDelete(idx)}
                                    className="text-gray-300 hover:text-red-500 ml-2"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-2 space-y-1.5">
                        <input
                            type="text"
                            placeholder="Nombre del recurso..."
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full text-[10px] border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                        <div className="flex gap-1">
                            <input
                                type="text"
                                placeholder="URL (ej: google.com)"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                className="flex-1 text-[10px] border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                            <button
                                onClick={handleAdd}
                                disabled={!newName.trim() || !newUrl.trim()}
                                className="bg-blue-600 text-white rounded px-2 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ApprovalSwitch = ({ label, value, onChange, colorClass = "text-gray-600" }) => (
    <label className="flex items-center gap-1 cursor-pointer select-none hover:bg-gray-50 px-1.5 py-0.5 rounded transition-colors border border-transparent hover:border-gray-200">
        <div className={`relative flex items-center justify-center w-3 h-3 rounded border ${value ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
            <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
                className="opacity-0 absolute inset-0 cursor-pointer"
            />
            {value && <Check size={8} className="text-white" strokeWidth={4} />}
        </div>
        <span className={`text-[9px] font-bold uppercase ${value ? 'text-blue-700' : colorClass}`}>{label}</span>
    </label>
);

export default ActionInspectorPanel;
