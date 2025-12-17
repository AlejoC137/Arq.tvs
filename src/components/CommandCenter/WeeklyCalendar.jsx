import React, { useEffect, useState, useMemo } from 'react';
import { format, addDays, startOfWeek, isSameDay, isToday, differenceInDays, parseISO, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Box, Layers } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { getWeeklyActions, toggleActionStatus } from '../../services/actionsService';
import { getProjectColor } from '../../utils/projectColors';
import { setSelectedAction, setSelectedTask, clearSelection, initCreateAction, initCreateTask } from '../../store/actions/appActions';
import ActionInspectorPanel from './ActionInspectorPanel';

// === HELPER: Layout Algorithms ===
const calculateLayout = (actions, weekStart) => {
    // ... (Keep existing layout logic, it's fine)
    const weekEnd = addDays(weekStart, 6);
    const visibleActions = actions.filter(a => {
        const start = parseISO(a.fecha_ejecucion);
        const end = a.fecha_fin ? parseISO(a.fecha_fin) : start;
        return end >= weekStart && start <= weekEnd;
    });

    const layout = {};
    const dayOccupancy = Array(7).fill().map(() => []);

    const sorted = [...visibleActions].sort((a, b) => {
        const taskA = a.tarea?.id || 0;
        const taskB = b.tarea?.id || 0;
        if (taskA !== taskB) return taskA - taskB;
        const startA = parseISO(a.fecha_ejecucion);
        const startB = parseISO(b.fecha_ejecucion);
        return startA - startB;
    });

    sorted.forEach(action => {
        const start = parseISO(action.fecha_ejecucion);
        const end = action.fecha_fin ? parseISO(action.fecha_fin) : start;

        const effectiveStart = start < weekStart ? weekStart : start;
        const effectiveEnd = end > weekEnd ? weekEnd : end;
        const colStart = differenceInDays(effectiveStart, weekStart);
        const span = differenceInDays(effectiveEnd, effectiveStart) + 1;

        if (colStart < 0 || colStart > 6) return;

        let stackIndex = 0;
        let collision = true;
        while (collision) {
            collision = false;
            for (let i = 0; i < span; i++) {
                const dayIdx = colStart + i;
                if (dayIdx > 6) break;
                if (dayOccupancy[dayIdx][stackIndex]) {
                    collision = true;
                    break;
                }
            }
            if (collision) stackIndex++;
        }

        for (let i = 0; i < span; i++) {
            const dayIdx = colStart + i;
            if (dayIdx <= 6) dayOccupancy[dayIdx][stackIndex] = true;
        }

        layout[action.id] = { colStart, span, stackIndex };
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

const Spacer = () => <div className="h-[44px] w-full mb-1.5 pointer-events-none" />;

export default function WeeklyCalendar() {
    const dispatch = useDispatch();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dragStart, setDragStart] = useState(null);
    const [dragEnd, setDragEnd] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    useEffect(() => { loadActions(); }, [currentDate]);

    const loadActions = async () => {
        setLoading(true);
        try {
            const data = await getWeeklyActions(currentDate);
            setActions(data || []);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const layout = useMemo(() => calculateLayout(actions, weekStart), [actions, weekStart]);

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
        if (!updatedAction.tarea) loadActions();
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
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-zinc-800 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {format(weekStart, 'MMMM yyyy', { locale: es }).toUpperCase()}
                    </h2>
                    <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-0.5">
                        <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded-md shadow-sm transition-all"><ChevronLeft size={16} /></button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 text-xs font-medium hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-all">Hoy</button>
                        <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded-md shadow-sm transition-all"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto mb-[300px] select-none">
                <div className="grid grid-cols-7 min-h-full divide-x divide-gray-200 dark:divide-zinc-800">
                    {weekDays.map((day, colIndex) => {
                        const itemsToRender = [];
                        Object.entries(layout).forEach(([id, meta]) => {
                            const { colStart, span, stackIndex } = meta;
                            if (colIndex >= colStart && colIndex < (colStart + span)) {
                                if (colIndex === colStart) {
                                    const action = actions.find(a => a.id === id);
                                    if (action) itemsToRender.push({ type: 'card', stackIndex, data: action, meta });
                                } else {
                                    itemsToRender.push({ type: 'spacer', stackIndex });
                                }
                            }
                        });
                        itemsToRender.sort((a, b) => a.stackIndex - b.stackIndex);
                        const isSelected = isInSelection(day);
                        const isEmpty = itemsToRender.length === 0;

                        return (
                            <div
                                key={day.toString()}
                                className={`flex flex-col h-full min-h-[400px] transition-colors ${isSelected ? 'bg-blue-50/80' : ''} group/day`}
                                onMouseDown={() => handleMouseDown(day, colIndex)}
                                onMouseEnter={() => handleMouseEnter(day, colIndex)}
                            >
                                {/* Header */}
                                <div className={`py-2 border-b border-gray-100 dark:border-zinc-800 text-center pointer-events-none ${isToday(day) ? 'bg-blue-50/50' : 'bg-gray-50/30'}`}>
                                    <div className="text-[10px] font-bold uppercase text-gray-400">{format(day, 'EEE', { locale: es })}</div>
                                    <div className={`text-sm font-bold ${isToday(day) ? 'text-blue-600' : 'text-gray-700'}`}>{format(day, 'd')}</div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-1 relative">
                                    {itemsToRender.map((item, idx) => (
                                        item.type === 'card' ?
                                            <ActionCard key={item.data.id} action={item.data} layoutStyle={item.meta} onToggle={handleToggle} onClick={handleCardClick} onTaskClick={handleTaskClick} /> :
                                            <Spacer key={`spacer-${idx}`} />
                                    ))}

                                    {/* ADD BUTTONS LOGIC */}
                                    {isEmpty ? (
                                        // Empty State
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover/day:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleAddClick(day, 'task'); }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm hover:border-blue-400 hover:text-blue-600 transition-all text-xs font-medium text-gray-500"
                                            >
                                                <Layers size={12} /> Tarea
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <ActionInspectorPanel onActionUpdated={handleActionUpdated} />
        </div>
    );
}
