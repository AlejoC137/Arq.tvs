import React, { useEffect, useState, useMemo } from 'react';
import { format, addDays, startOfWeek, isSameDay, isToday, differenceInDays, parseISO, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Box, Layers } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { getWeeklyActions, toggleActionStatus, getTaskActions } from '../../services/actionsService';
import { getWeeklyTasks, getProjects } from '../../services/tasksService';
import { getProjectColor } from '../../utils/projectColors';
import { setSelectedAction, setSelectedTask, clearSelection, initCreateAction, initCreateTask } from '../../store/actions/appActions';
import ActionInspectorPanel from './ActionInspectorPanel';

// === HELPER: Height Calculation ===
const CARD_BASE_HEIGHT = 28; // Header + padding
const ACTION_ITEM_HEIGHT = 16; // Height per action item
const MAX_ACTIONS = 3;

const getCardHeight = (item) => {
    if (item.type === 'task_group') {
        const count = Math.min(item.actions.length, MAX_ACTIONS);
        // Base + items + optional footer if truncated?
        // Let's keep it simple: Base + (count * itemHeight) + padding
        // Actually, let's just make it content-based, but we need a specific pixel value for the Spacer.
        // Let's approximate: 
        // Header (approx 20px) + Padding (12px) + Items * 18px
        return 34 + (count * 18) + (item.actions.length > MAX_ACTIONS ? 14 : 0);
    }
    return 44; // Default ActionCard height
};

// === HELPER: Layout Algorithms ===
const getDateRange = (item) => {
    if (item.type === 'task_group') {
        // Try to use task dates, fallback to action dates
        let start = item.tarea?.fecha_inicio ? parseISO(item.tarea.fecha_inicio) : null;
        let end = item.tarea?.fecha_fin_estimada ? parseISO(item.tarea.fecha_fin_estimada) : null;

        // Fallbacks based on actions if task dates are missing or invalid
        if (!start || isNaN(start)) {
            const starts = item.actions.map(a => parseISO(a.fecha_ejecucion));
            start = starts.reduce((min, d) => d < min ? d : min, starts[0]);
        }
        if (!end || isNaN(end)) {
            // Task explicit end > actions end > task start
            const ends = item.actions.map(a => a.fecha_fin ? parseISO(a.fecha_fin) : parseISO(a.fecha_ejecucion));
            const maxActionEnd = ends.reduce((max, d) => d > max ? d : max, ends[0]);
            end = maxActionEnd;
        }

        return { start, end };
    } else {
        const start = parseISO(item.fecha_ejecucion);
        const end = item.fecha_fin ? parseISO(item.fecha_fin) : start;
        return { start, end };
    }
};

const calculateLayout = (items, weekStart) => {
    // Items are now discrete daily items
    const weekEnd = addDays(weekStart, 6);

    // Filter just in case
    const visibleItems = items.filter(item => {
        if (!item.currentDate) return false;
        try {
            const d = parseISO(item.currentDate);
            return d >= weekStart && d <= weekEnd;
        } catch (e) {
            return false;
        }
    });

    const layout = {}; // itemId -> { colStart, span, stackIndex }
    const dayOccupancy = Array(7).fill().map(() => []);

    // Sort: Tasks first, then by date priority?
    // Actually items are discrete now.
    const sorted = [...visibleItems].sort((a, b) => {
        // Sort by task id to keep them aligned if multiple on same day?
        if (a.id !== b.id) return a.id.localeCompare(b.id);
        return 0;
    });

    sorted.forEach(item => {
        if (!item.currentDate) return;
        const d = parseISO(item.currentDate);
        const colStart = differenceInDays(d, weekStart);
        const span = 1; // Always 1 day

        if (colStart < 0 || colStart > 6) return;

        let stackIndex = 0;
        let collision = true;
        while (collision) {
            collision = false; // Check only for this single day slot
            if (dayOccupancy[colStart][stackIndex]) {
                collision = true;
                stackIndex++;
            }
        }

        dayOccupancy[colStart][stackIndex] = true;

        // Use a composite key because we might have split the original ID
        layout[item.uniqueLayoutId] = { colStart, span, stackIndex };
    });

    return layout;
};

// === COMPONENT: Action Card ===
const ActionCard = ({ action, layoutStyle, onToggle, onClick, onTaskClick }) => {
    const { tarea, completado } = action;
    const colors = getProjectColor(tarea?.proyecto?.id || 'default');

    // Calculate width based on span
    const widthStyle = {
        width: `calc(${layoutStyle.span * 100}% + ${(layoutStyle.span - 1)}px)`,
        zIndex: 10 + layoutStyle.stackIndex,
        position: 'relative',
    };

    return (
        <div
            style={widthStyle}
            className={`
                group relative pl-3 pr-2 py-1.5 mb-1.5 rounded bg-white border border-gray-200 
                hover:shadow-md hover:border-blue-400 transition-all duration-150 flex flex-col justify-center min-h-[44px]
                ${completado ? 'opacity-50 grayscale' : ''}
                shadow-sm
            `}
            onClick={(e) => {
                // Default click Action
                e.stopPropagation();
                onClick(action);
            }}
        >
            {/* Barra de Color del Proyecto */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l ${colors.bar}`} />

            <div className="flex flex-col w-full overflow-hidden">
                {/* Task Header (Micro-Frame) - CLICKABLE */}
                <div
                    className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate mb-0.5 cursor-pointer hover:text-blue-600 hover:underline"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Open Task Inspector
                        onTaskClick(tarea);
                    }}
                >
                    {tarea?.task_description || 'Sin Tarea'}
                </div>

                <div className="flex items-center justify-between gap-2 w-full">
                    {/* Título Acción */}
                    <span className={`text-[11px] font-medium leading-tight truncate flex-1 text-gray-800 ${completado ? 'line-through' : ''}`}>
                        {action.descripcion}
                    </span>

                    {/* Badges */}
                    {(action.requiere_aprobacion_ronald || action.requiere_aprobacion_wiet || action.requiere_aprobacion_alejo) && (
                        <div className="flex -space-x-1 flex-shrink-0">
                            {[
                                { l: 'R', r: action.requiere_aprobacion_ronald, o: action.estado_aprobacion_ronald },
                                { l: 'W', r: action.requiere_aprobacion_wiet, o: action.estado_aprobacion_wiet },
                                { l: 'A', r: action.requiere_aprobacion_alejo, o: action.estado_aprobacion_alejo }
                            ].filter(x => x.r).map((badge, idx) => (
                                <div key={idx} className={`w-3.5 h-3.5 flex items-center justify-center rounded-full text-[8px] font-bold text-white ring-1 ring-white ${badge.o ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {badge.l}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// === COMPONENT: Task Group Card ===
const TaskGroupCard = ({ group, layoutStyle, onClick, onTaskClick, isStart, isEnd }) => {
    const { tarea, actions } = group;
    const colors = getProjectColor(tarea?.proyecto?.id || 'default');

    // Sort actions? maybe by index or creation?
    // Assuming they are loosely sorted by execution date from backend

    const height = getCardHeight(group);

    const widthStyle = {
        width: `calc(${layoutStyle.span * 100}% + ${(layoutStyle.span - 1)}px)`,
        zIndex: 10 + layoutStyle.stackIndex,
        position: 'relative',
        height: `${height}px`,
    };

    return (
        <div
            style={widthStyle}
            className={`
                group relative pl-3 pr-2 py-2 mb-1.5 rounded bg-white border border-gray-200 
                hover:shadow-md hover:border-blue-400 transition-all duration-150 flex flex-col
                shadow-sm overflow-hidden
            `}
            onClick={(e) => {
                e.stopPropagation();
                // Select Task
                onTaskClick(tarea);
            }}
        >
            {/* Barra de Color del Proyecto */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l ${colors.bar}`} />

            <div className="flex items-center justify-between mb-1.5 gap-2">
                {/* Task Title */}
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide truncate">
                    {tarea?.task_description || 'Tarea Sin Nombre'}
                </div>

                {/* Start/End Labels */}
                <div className="flex shrink-0 gap-1">
                    {isStart && <span className="text-[9px] font-extrabold text-red-500">INICIO</span>}
                    {isEnd && <span className="text-[9px] font-extrabold text-red-500">FINAL</span>}
                </div>
            </div>

            {/* Actions List */}
            <div className="flex flex-col gap-0.5">
                {actions.slice(0, MAX_ACTIONS).map((action, i) => (
                    <div key={action.id} className="flex items-center gap-1.5 text-[10px] text-gray-700">
                        <span className="font-mono text-gray-400 text-[9px] w-3">{i + 1}.</span>
                        <span className={`truncate ${action.completado ? 'line-through text-gray-400' : ''}`}>
                            {action.descripcion}
                        </span>
                    </div>
                ))}
                {actions.length > MAX_ACTIONS && (
                    <div className="text-[9px] text-gray-400 italic pl-4.5 mt-0.5">
                        (solo mostrar las primeras {MAX_ACTIONS})
                    </div>
                )}
            </div>
        </div>
    );
};

const Spacer = ({ height = 44 }) => <div style={{ height: `${height}px` }} className="w-full mb-1.5 pointer-events-none" />;

export default function WeeklyCalendar() {
    const dispatch = useDispatch();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [actions, setActions] = useState([]);
    const [weekTasks, setWeekTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    const [dragStart, setDragStart] = useState(null);
    const [dragEnd, setDragEnd] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    useEffect(() => { loadActions(); }, [currentDate]);
    // Force reload fix

    const loadActions = async () => {
        setLoading(true);
        try {
            const [wActions, wTasks] = await Promise.all([
                getWeeklyActions(currentDate),
                getWeeklyTasks(currentDate)
            ]);

            // Ensure we have actions for all tasks (for the list display)
            // If a task is in wTasks but has no actions in wActions, we need to fetch its actions for descriptive purposes
            const existingTaskIds = new Set(wActions.map(a => a.tarea?.id).filter(Boolean));
            const missingTasks = wTasks.filter(t => !existingTaskIds.has(t.id));

            let extraActions = [];
            if (missingTasks.length > 0) {
                const extraActionsResults = await Promise.all(
                    missingTasks.map(t => getTaskActions(t.id))
                );
                extraActions = extraActionsResults.flat();
            }

            setActions([...wActions, ...extraActions]);
            setWeekTasks(wTasks);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    useEffect(() => {
        getProjects().then(setProjects).catch(console.error);
    }, []);

    // === GROUPING & EXPANSION LOGIC ===
    const expandedItems = useMemo(() => {
        // We need robust handling even if loading
        const groups = {};
        const orphans = [];
        const expanded = [];
        const weekEnd = addDays(weekStart, 6);

        // 1. Initialize Groups from Week Tasks (Source of Truth for Tasks)
        weekTasks.forEach(task => {
            groups[task.id] = {
                type: 'task_group',
                id: `task_group_${task.id}`,
                tarea: task,
                actions: []
            };
        });

        // 2. Distribute Actions
        actions.forEach(action => {
            if (action.tarea && action.tarea.id) {
                // If group doesn't exist (e.g. task not in getWeeklyTasks but action is? Should likely not happen often if logic matches)
                // But let's be safe and create it.
                if (!groups[action.tarea.id]) {
                    groups[action.tarea.id] = {
                        type: 'task_group',
                        id: `task_group_${action.tarea.id}`,
                        tarea: action.tarea,
                        actions: []
                    };
                }
                // Avoid duplicates if we fetched same actions twice?
                // keys should be unique usually.
                groups[action.tarea.id].actions.push(action);
            } else {
                if (action.fecha_ejecucion) {
                    orphans.push({
                        type: 'action',
                        ...action,
                        currentDate: action.fecha_ejecucion,
                        uniqueLayoutId: `orphan_${action.id}`
                    });
                }
            }
        });

        // Deduplicate actions in groups just in case
        Object.values(groups).forEach(g => {
            const seen = new Set();
            g.actions = g.actions.filter(a => {
                if (seen.has(a.id)) return false;
                seen.add(a.id);
                return true;
            });
            // Sort actions by order or date
            g.actions.sort((a, b) => (a.orden - b.orden) || (new Date(a.fecha_ejecucion) - new Date(b.fecha_ejecucion)));
        });

        // 3. Expand Groups into Discrete Daily Items
        Object.values(groups).forEach(group => {
            const points = new Set();
            const start = group.tarea.fecha_inicio;
            const end = group.tarea.fecha_fin_estimada;

            // Add dates if they are within this week
            const addIfInWeek = (dateStr) => {
                if (!dateStr) return;
                const d = parseISO(dateStr);
                if (isWithinInterval(d, { start: weekStart, end: weekEnd })) {
                    points.add(dateStr);
                }
            };

            addIfInWeek(start);
            addIfInWeek(end);

            // Start and End dates are already added above. 
            // We NO LONGER add action dates as separate visualization points.
            // This ensures we only see "Start" and "End" boxes, not intermediate action boxes.

            // Create an item for each unique date point
            points.forEach(dateStr => {
                expanded.push({
                    ...group,
                    currentDate: dateStr,
                    isStart: start === dateStr,
                    isEnd: end === dateStr,
                    uniqueLayoutId: `${group.id}_${dateStr}`
                });
            });
        });

        return [...expanded, ...orphans];
    }, [actions, weekTasks, weekStart]); // Re-calc when actions, weekTasks or week changes

    // No longer a single global layout. We calculate layout per project row during render or memoize it grouped.
    // Let's Group items by project, then calculate layout for each project.
    const projectGroups = useMemo(() => {
        const groups = {};
        // Initialize with all projects if loaded, or at least active ones
        // But better to just group present items and maybe fill gaps with known projects

        // 1. Create buckets for all projects (or filtered)
        const visibleProjects = projects.filter(p => selectedProjectFilter === 'all' || p.id === selectedProjectFilter);
        visibleProjects.forEach(p => {
            groups[p.id] = { project: p, items: [] };
        });

        // 2. Distribute items
        expandedItems.forEach(item => {
            const pid = item.tarea?.proyecto?.id;
            if (pid && groups[pid]) {
                groups[pid].items.push(item);
            } else if (!pid) {
                // No project? 'Sueltas' or 'General'
                if (!groups['orphan']) groups['orphan'] = { project: { id: 'orphan', name: 'Sin Proyecto' }, items: [] };
                groups['orphan'].items.push(item);
            }
        });

        // 3. Delete empty groups if we strictly want to follow the wireframe which seems to show specific rows?
        // User asked: "Ver el proyecto... eje y". Usually implies all active projects visible.
        // Let's keep empty project rows so the user sees them.

        return groups;
    }, [expandedItems, projects, selectedProjectFilter]);

    // Calculate layout for EACH project group
    const projectLayouts = useMemo(() => {
        const layouts = {};
        Object.entries(projectGroups).forEach(([pid, group]) => {
            layouts[pid] = calculateLayout(group.items, weekStart);
        });
        return layouts;
    }, [projectGroups, weekStart]);

    const handleToggle = async (id, currentStatus) => {
        // ... (Optimistic toggle logic)
        setActions(prev => prev.map(a => a.id === id ? { ...a, completado: !currentStatus } : a));
        try { await toggleActionStatus(id, currentStatus); } catch { loadActions(); }
    };

    const handleCreateNew = () => dispatch(clearSelection());
    const handleCardClick = (action) => {
        // Open task editor instead of action inspector
        if (action.tarea) {
            dispatch(setSelectedTask(action.tarea));
        }
    };
    const handleTaskClick = (task) => {
        if (task) dispatch(setSelectedTask(task));
    };

    const handleActionUpdated = (updatedAction) => {
        if (!updatedAction || !updatedAction.tarea) loadActions();
        else {
            setActions(prev => {
                const exists = prev.find(a => a.id === updatedAction.id);
                if (exists) return prev.map(a => a.id === updatedAction.id ? { ...a, ...updatedAction } : a);
                return [...prev, updatedAction];
            });
        }
    };

    // Drag Logic
    const handleMouseDown = (date, colIndex) => { setDragStart({ date, colIndex }); setDragEnd({ date, colIndex }); setIsDragging(true); };
    const handleMouseEnter = (date, colIndex) => { if (isDragging) setDragEnd({ date, colIndex }); };
    const handleMouseUp = () => {
        if (isDragging && dragStart && dragEnd) {
            const start = dragStart.date < dragEnd.date ? dragStart.date : dragEnd.date;
            const end = dragStart.date < dragEnd.date ? dragEnd.date : dragStart.date;
            dispatch(initCreateAction({
                descripcion: '',
                fecha_ejecucion: format(start, 'yyyy-MM-dd'),
                fecha_fin: format(end, 'yyyy-MM-dd'),
                requiere_aprobacion_ronald: false,
                estado_aprobacion_ronald: false,
                requiere_aprobacion_wiet: false,
                estado_aprobacion_wiet: false,
                requiere_aprobacion_alejo: false,
                estado_aprobacion_alejo: false,
            }));
        }
        setIsDragging(false); setDragStart(null); setDragEnd(null);
    };
    const isInSelection = (date) => {
        if (!isDragging || !dragStart || !dragEnd) return false;
        const start = dragStart.date < dragEnd.date ? dragStart.date : dragEnd.date;
        const end = dragStart.date < dragEnd.date ? dragEnd.date : dragStart.date;
        return date >= start && date <= end;
    };

    // Add Button Logic
    const handleAddClick = (date, type) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        if (type === 'action') {
            dispatch(initCreateAction({
                descripcion: '',
                fecha_ejecucion: dateStr,
                fecha_fin: dateStr,
                completado: false,
                requiere_aprobacion_ronald: false,
                estado_aprobacion_ronald: false,
                requiere_aprobacion_wiet: false,
                estado_aprobacion_wiet: false,
                requiere_aprobacion_alejo: false,
                estado_aprobacion_alejo: false,
            }));
        } else if (type === 'task') {
            dispatch(initCreateTask({
                task_description: '',
                fecha_inicio: dateStr,
                fecha_fin_estimada: dateStr,
                espacio_uuid: null,
                proyecto_id: null,
            }));
        }
    };

    return (
        <div className="h-screen flex flex-col bg-white dark:bg-zinc-950 font-sans overflow-hidden" onMouseUp={handleMouseUp}>
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-zinc-800 shrink-0 bg-white z-10">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {format(weekStart, 'MMMM yyyy', { locale: es }).toUpperCase()}
                    </h2>
                    <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-0.5">
                        <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded-md shadow-sm transition-all"><ChevronLeft size={16} /></button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 text-xs font-medium hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-all">Hoy</button>
                        <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded-md shadow-sm transition-all"><ChevronRight size={16} /></button>
                    </div>

                    {/* Project Filter */}
                    <div className="flex items-center gap-2 border-l pl-4 ml-2 border-gray-200">
                        <span className="text-xs font-bold text-gray-400 uppercase">Filtrar:</span>
                        <select
                            value={selectedProjectFilter}
                            onChange={(e) => setSelectedProjectFilter(e.target.value)}
                            className="text-xs border-gray-200 rounded-md py-1 pr-8 pl-2 shadow-sm focus:ring-blue-500 max-w-[200px]"
                        >
                            <option value="all">Todos los Proyectos</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid Header (Days) - Sticky */}
            <div className="flex border-b border-gray-200 bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                <div className="w-32 shrink-0 p-2 text-xs font-bold text-gray-400 uppercase text-right border-r border-gray-200 flex items-center justify-end pr-4">
                    Proyectos
                </div>
                <div className="flex-1 grid grid-cols-7 divide-x divide-gray-200">
                    {weekDays.map((day) => (
                        <div key={day.toString()} className={`py-2 text-center text-[10px] font-bold uppercase ${isToday(day) ? 'text-blue-600 bg-blue-50/30' : 'text-gray-400'}`}>
                            {format(day, 'EEE d', { locale: es })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Rows by Project */}
            <div className="flex-1 overflow-y-auto mb-[300px]">
                {Object.entries(projectGroups).map(([pid, group]) => {
                    // Check if empty rows should be hidden if desired? 
                    // User's image shows empty projects too. Keep them.
                    const pLayout = projectLayouts[pid] || {};
                    const pItems = group.items;

                    return (
                        <div key={pid} className="flex border-b border-gray-100 min-h-[120px] bg-white relative group/row">
                            {/* Y-Axis Label: Project Name */}
                            <div className="w-32 shrink-0 p-3 bg-gray-50/20 border-r border-gray-200 text-xs font-bold text-gray-700 flex flex-col justify-center text-right pr-4 relative">
                                <span className="truncate">{group.project.name}</span>
                                {group.project.status && <span className="text-[9px] text-gray-400 font-normal uppercase">{group.project.status}</span>}
                                {/* Row Hover Effect Bar */}
                                <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-blue-500 opacity-0 group-hover/row:opacity-100 transition-opacity" />
                            </div>

                            {/* 7-Cols Grid for this Project */}
                            <div className="flex-1 grid grid-cols-7 divide-x divide-gray-100 relative">
                                {weekDays.map((day, colIndex) => {
                                    const itemsToRender = [];
                                    Object.entries(pLayout).forEach(([id, meta]) => {
                                        const { colStart, span, stackIndex } = meta;
                                        if (colIndex >= colStart && colIndex < (colStart + span)) {
                                            if (colIndex === colStart) {
                                                const item = pItems.find(g => g.uniqueLayoutId === id);
                                                if (item) {
                                                    itemsToRender.push({ type: item.type === 'task_group' ? 'task_group' : 'card', stackIndex, data: item, meta });
                                                }
                                            } else {
                                                const item = pItems.find(g => g.uniqueLayoutId === id);
                                                const height = item ? getCardHeight(item) : 44;
                                                itemsToRender.push({ type: 'spacer', stackIndex, height });
                                            }
                                        }
                                    });
                                    itemsToRender.sort((a, b) => a.stackIndex - b.stackIndex);

                                    const isSelected = isInSelection(day);

                                    return (
                                        <div
                                            key={day.toString()}
                                            className={`relative p-1 transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50/30'}`}
                                            onMouseDown={() => handleMouseDown(day, colIndex)}
                                            onMouseEnter={() => handleMouseEnter(day, colIndex)}
                                        >
                                            {/* Render Items */}
                                            {itemsToRender.map((item, idx) => {
                                                if (item.type === 'task_group') {
                                                    return <TaskGroupCard key={item.data.uniqueLayoutId} group={item.data} layoutStyle={item.meta} onClick={handleCardClick} onTaskClick={handleTaskClick} isStart={item.data.isStart} isEnd={item.data.isEnd} />;
                                                } else if (item.type === 'card') {
                                                    return <ActionCard key={item.data.uniqueLayoutId} action={item.data} layoutStyle={item.meta} onToggle={handleToggle} onClick={handleCardClick} onTaskClick={handleTaskClick} />;
                                                } else {
                                                    return <Spacer key={`spacer-${idx}`} height={item.height} />;
                                                }
                                            })}

                                            {/* Row-specific Add Button (Hidden by default, show on hover/empty) */}
                                            {/* Logic simplified for "Add Task to this Project" context could be added here later */}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <ActionInspectorPanel onActionUpdated={handleActionUpdated} />
        </div>
    );
}
