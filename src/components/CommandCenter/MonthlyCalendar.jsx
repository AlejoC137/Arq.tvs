import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isToday,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    parseISO,
    isSameDay
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { setSelectedTask, clearSelection, initCreateTask } from '../../store/actions/appActions';
import { getWeeklyTasks } from '../../services/tasksService'; // Reusing this as it's date based, or create monthly?
// Actually getWeeklyTasks takes a date and calculates week range. I should probably modify it or create getMonthlyTasks.
// But wait, the user just wants the tasks. If I use getAllTasks I can filter in memory.
// Given previous turn, I created getWeeklyTasks. I should create getMonthlyTasks or just use getTasks (all) if performance allows.
// Let's use getTasks() generally available or filtered. 
// "Or just fetch all tasks and filter". The repo instructions say "avoid generic...".
// I'll filter by date range in memory for now using getAllTasks if available, or better:
// The user previously wanted "Weekly". Now "Monthly". 
// I will create `getTasksByDateRange` in `tasksService` or just use `getTasks` (which fetches ALL active tasks usually).
// `getTasks` in `tasksService` fetches EVERYTHING.
import { getTasks } from '../../services/tasksService';
import { getProjectColor } from '../../utils/projectColors';
import ActionInspectorPanel from './ActionInspectorPanel';

const TaskEventCard = ({ task, type, onClick }) => {
    const colors = getProjectColor(task.proyecto?.id || 'default');
    return (
        <div
            onClick={(e) => { e.stopPropagation(); onClick(task); }}
            className={`
                px-1.5 py-1 text-[10px] rounded border border-l-4 mb-0.5 cursor-pointer
                hover:shadow-md transition-all shadow-sm
                bg-white border-gray-100
                ${type === 'start' ? 'border-l-green-500' : 'border-l-red-500'}
            `}
            style={{ borderLeftColor: type === 'start' ? '#22c55e' : '#ef4444' }}
        >
            <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-gray-700 truncate">{task.task_description}</span>
                <span className={`text-[8px] font-extrabold px-1 rounded text-white ${type === 'start' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {type === 'start' ? 'INICIO' : 'FINAL'}
                </span>
            </div>
            <div className="text-[8px] text-gray-400 truncate mt-0.5">
                {task.proyecto?.name}
            </div>
        </div>
    );
};

const MonthlyCalendar = () => {
    const dispatch = useDispatch();
    const [currentDate, setCurrentDate] = useState(new Date());
    const { selectedTask } = useSelector(state => state.app);

    // Get all days to display (including padding days from prev/next month)
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const [tasks, setTasks] = useState([]);

    // Load tasks using general getTasks and filter client side for calendar
    // or improve service later. 
    React.useEffect(() => {
        getTasks().then(allTasks => {
            // Filter tasks relevant to this view (visible month range)
            // Just keep them all for now and filter in render for simplicity unless massive
            setTasks(allTasks);
        });
    }, [currentDate]);

    // Derived: Tasks events per day
    // We iterate days and find tasks.
    // Optimization: Create a map date -> events
    const eventsByDate = useMemo(() => {
        const map = {};
        tasks.forEach(task => {
            if (task.fecha_inicio) {
                const start = task.fecha_inicio.split('T')[0]; // Simple ISO date string
                if (!map[start]) map[start] = [];
                map[start].push({ type: 'start', task });
            }
            if (task.fecha_fin_estimada) {
                const end = task.fecha_fin_estimada.split('T')[0];
                if (!map[end]) map[end] = [];
                // Avoid Duplicate if start == end? The user said "INICIO" and "FINAL". 
                // If same day, maybe show both stacked or merged?
                // Visual preference: Show both lines so user sees it starts and ends.
                map[end].push({ type: 'end', task });
            }
        });
        return map;
    }, [tasks]);

    const handleTaskClick = (task) => {
        dispatch(setSelectedTask(task));
    };

    const handleActionUpdated = () => {
        // Reload tasks?
        getTasks().then(setTasks);
    };

    const handleDayClick = (day) => {
        console.log('Day clicked:', format(day, 'yyyy-MM-dd'));
        // TODO: Show day details or create task
    };

    const handlePrevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                    {format(currentDate, 'MMMM yyyy', { locale: es }).toUpperCase()}
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1 hover:bg-white rounded-md shadow-sm transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={handleToday}
                        className="px-3 text-xs font-medium hover:bg-white rounded-md transition-all"
                    >
                        Hoy
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-white rounded-md shadow-sm transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-auto">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                        <div key={day} className="py-2 text-center text-xs font-bold text-gray-600 uppercase">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 auto-rows-fr">
                    {days.map((day, idx) => {
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isCurrentDay = isToday(day);
                        const dayNumber = format(day, 'd');

                        return (
                            <div
                                key={idx}
                                onClick={() => handleDayClick(day)}
                                className={`
                                    min-h-[100px] border-r border-b border-gray-200 p-2 cursor-pointer
                                    hover:bg-blue-50 transition-colors
                                    ${!isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : 'bg-white'}
                                    ${isCurrentDay ? 'bg-blue-50/50' : ''}
                                `}
                            >
                                {/* Day Number */}
                                <div className={`
                                    text-sm font-bold mb-1
                                    ${isCurrentDay ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                                `}>
                                    {dayNumber}
                                </div>

                                {/* Tasks/Actions for this day */}
                                <div className="space-y-1">
                                    {(() => {
                                        const dateKey = format(day, 'yyyy-MM-dd');
                                        const dayEvents = eventsByDate[dateKey] || [];
                                        return dayEvents.map((evt, i) => (
                                            <TaskEventCard
                                                key={`${evt.task.id}_${evt.type}_${i}`}
                                                task={evt.task}
                                                type={evt.type}
                                                onClick={handleTaskClick}
                                            />
                                        ));
                                    })()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <ActionInspectorPanel onActionUpdated={handleActionUpdated} />
        </div>
    );
};

export default MonthlyCalendar;
