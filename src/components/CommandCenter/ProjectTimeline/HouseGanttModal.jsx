import React, { useMemo, useRef, useState, useEffect } from 'react';
import { X, Calendar, User, ZoomIn, ZoomOut } from 'lucide-react';
import { format, parseISO, isValid, differenceInDays, addDays, startOfDay, isSameDay, min, max, getDaysInMonth, startOfMonth, endOfMonth, isWithinInterval, isMonday } from 'date-fns';
import { es } from 'date-fns/locale';
import { handleNativePrint } from '../../../utils/printUtils';
import PrintButton from '../../common/PrintButton';

const COLUMN_WIDTH = 35; // Compacted width
const HEADER_HEIGHT = 50; // Compacted header
const ROW_HEIGHT = 32; // Compacted row

const HouseGanttModal = ({ isOpen, onClose, project, tasks }) => {
    if (!isOpen || !project) return null;

    const [zoom, setZoom] = useState(1);
    const scrollContainerRef = useRef(null);
    const pixelPerDay = COLUMN_WIDTH * zoom;

    // 1. Process Data & Calculate Bounds
    const { processedTasks, timelineStart, timelineEnd, totalDays } = useMemo(() => {
        const validTasks = tasks.filter(t => t.fecha_inicio && isValid(parseISO(t.fecha_inicio)));

        if (validTasks.length === 0) {
            const today = startOfDay(new Date());
            return {
                processedTasks: [],
                timelineStart: addDays(today, -5),
                timelineEnd: addDays(today, 30),
                totalDays: 35
            };
        }

        // Sort by Start Date Ascending
        const sorted = validTasks.sort((a, b) => parseISO(a.fecha_inicio) - parseISO(b.fecha_inicio));

        // Find Min/Max dates
        const startDates = sorted.map(t => parseISO(t.fecha_inicio));
        const endDates = sorted.map(t => t.fecha_fin_estimada && isValid(parseISO(t.fecha_fin_estimada)) ? parseISO(t.fecha_fin_estimada) : parseISO(t.fecha_inicio));

        let minDate = min(startDates);
        let maxDate = max(endDates);

        // Add padding
        minDate = addDays(minDate, -7);
        maxDate = addDays(maxDate, 14);

        const days = differenceInDays(maxDate, minDate) + 1;

        return {
            processedTasks: sorted,
            timelineStart: minDate,
            timelineEnd: maxDate,
            totalDays: days
        };
    }, [tasks]);

    // 2. Generate Time Helpers
    const daysArray = useMemo(() => {
        return Array.from({ length: totalDays }, (_, i) => addDays(timelineStart, i));
    }, [timelineStart, totalDays]);

    const months = useMemo(() => {
        const monthsData = [];
        let currentMonth = startOfMonth(timelineStart);
        const end = endOfMonth(timelineEnd);

        while (currentMonth <= end) {
            const monthStart = currentMonth < timelineStart ? timelineStart : currentMonth;
            const monthEndRaw = endOfMonth(currentMonth);
            const monthEnd = monthEndRaw > timelineEnd ? timelineEnd : monthEndRaw;

            if (monthStart <= monthEnd) {
                const daysInSpan = differenceInDays(monthEnd, monthStart) + 1;
                monthsData.push({
                    date: currentMonth,
                    label: format(currentMonth, 'MMMM yyyy', { locale: es }),
                    width: daysInSpan * pixelPerDay
                });
            }
            currentMonth = startOfMonth(addDays(endOfMonth(monthStart), 1));
        }
        return monthsData;
    }, [timelineStart, timelineEnd, pixelPerDay]);


    // 3. Scroll to Today on Initial Load
    useEffect(() => {
        if (isOpen && scrollContainerRef.current) {
            const today = new Date();
            const diff = differenceInDays(today, timelineStart);
            if (diff > 0) {
                const scrollPos = (diff * pixelPerDay) - 100;
                scrollContainerRef.current.scrollLeft = scrollPos > 0 ? scrollPos : 0;
            }
        }
    }, [isOpen, timelineStart, pixelPerDay]);


    const handlePrint = () => {
        handleNativePrint('gantt-chart-container', `Cronograma_${project.name}`);
    };

    const handleTaskScroll = (dateStr) => {
        if (!dateStr || !scrollContainerRef.current) return;
        const taskDate = parseISO(dateStr);
        if (!isValid(taskDate)) return;

        const diff = differenceInDays(taskDate, timelineStart);
        if (diff >= 0) {
            // Scroll to the task start minus some padding (e.g. 100px) so it's not at the very edge
            const scrollPos = (diff * pixelPerDay) - 250; // Changed from 100 to 250 for better centering
            scrollContainerRef.current.scrollTo({
                left: Math.max(0, scrollPos),
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-[98vw] h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">

                {/* Header Control Panel */}
                <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0 z-50 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md">
                            <Calendar size={16} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-tight">Cronograma de Obra</h2>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="font-medium">{project.name}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>{processedTasks.length} Tareas</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Legend */}
                        <div className="hidden lg:flex items-center gap-3 mr-4 text-[10px] font-medium text-gray-600">
                            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>Terminado</div>
                            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>En Curso</div>
                            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span>Pausado</div>
                        </div>

                        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                            <button onClick={() => setZoom(Math.max(0.3, zoom - 0.2))} className="p-1 hover:bg-white rounded text-gray-600 transition-all" title="Alejar"><ZoomOut size={14} /></button>
                            <span className="text-[10px] font-bold text-gray-500 px-1.5 min-w-[32px] text-center">{Math.round(zoom * 100)}%</span>
                            <button onClick={() => setZoom(Math.min(1.5, zoom + 0.2))} className="p-1 hover:bg-white rounded text-gray-600 transition-all" title="Acercar"><ZoomIn size={14} /></button>
                        </div>

                        <div className="h-5 w-px bg-gray-200 mx-1"></div>
                        <PrintButton onClick={handlePrint} size={18} />
                        <button onClick={onClose} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition-colors"><X size={20} /></button>
                    </div>
                </div>

                {/* Main Content: Unified Scroll Container */}
                <div id="gantt-chart-container" className="flex-1 overflow-auto custom-scrollbar relative bg-white" ref={scrollContainerRef}>

                    {/* The Layout Container */}
                    <div className="inline-block relative min-w-full" style={{ height: (processedTasks.length * ROW_HEIGHT) + HEADER_HEIGHT }}>

                        {/* --- HEADER --- */}
                        {/* Top-Left Corner (Sticky Fix) */}
                        <div
                            className="sticky top-0 left-0 z-50 w-[240px] h-[50px] bg-gray-50 border-r border-b border-gray-200 flex items-center px-3 shadow-[2px_2px_5px_rgba(0,0,0,0.02)]"
                        >
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actividad</span>
                        </div>

                        {/* Timeline Headers (Month/Day) - Sticky Top */}
                        <div className="sticky top-0 z-40 bg-white h-[50px] flex border-b border-gray-200" style={{ paddingLeft: '240px', marginTop: '-50px', width: 'fit-content' }}>
                            <div className="flex flex-col h-full">
                                {/* Months Row */}
                                <div className="h-[24px] flex border-b border-gray-300 bg-gray-50/90 backdrop-blur-sm">
                                    {months.map((m, i) => (
                                        <div key={i} className="flex items-center px-2 border-r border-gray-300 text-[10px] font-bold text-gray-600 uppercase whitespace-nowrap overflow-hidden" style={{ width: m.width }}>
                                            {m.label}
                                        </div>
                                    ))}
                                </div>
                                {/* Days Row */}
                                <div className="h-[26px] flex bg-white">
                                    {daysArray.map((day, i) => (
                                        <div
                                            key={i}
                                            className={`flex-shrink-0 flex items-center justify-center text-[9px] border-r border-gray-100 font-medium ${isSameDay(day, new Date()) ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-400'}`}
                                            style={{ width: pixelPerDay }}
                                        >
                                            {format(day, 'd')}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* --- BODY --- */}
                        {/* Task Column - Sticky Left */}
                        <div className="sticky left-0 z-30 w-[240px] bg-white border-r border-gray-300 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]" style={{ marginTop: '0px', float: 'left', minHeight: 'calc(100% - 50px)' }}>
                            {processedTasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    onClick={() => handleTaskScroll(task.fecha_inicio)}
                                    className="h-[32px] px-3 flex flex-col justify-center border-b border-gray-300 bg-white hover:bg-blue-50 transition-colors group cursor-pointer"
                                    title="Clic para ir a la tarea"
                                >
                                    <div className={`text-[11px] font-medium leading-none truncate group-hover:text-blue-700 ${task.terminado ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                        {task.task_description}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bars Grid */}
                        <div className="relative z-10" style={{ paddingLeft: '240px', width: 'fit-content' }}>
                            {/* Background Lines */}
                            <div className="absolute inset-0 z-0 flex pointer-events-none">
                                {daysArray.map((day, i) => (
                                    <div
                                        key={i}
                                        className={`flex-shrink-0 h-full border-r ${isMonday(day) ? 'border-gray-300' : 'border-gray-50'}`}
                                        style={{ width: pixelPerDay }}
                                    ></div>
                                ))}
                            </div>

                            {/* Today Line */}
                            <div
                                className="absolute top-0 bottom-0 w-px bg-red-400 z-0 pointer-events-none"
                                style={{ left: (differenceInDays(new Date(), timelineStart) * pixelPerDay) + (pixelPerDay / 2) + 240 }}
                            ></div>

                            {/* Task Bars */}
                            {processedTasks.map((task, index) => {
                                const startDate = parseISO(task.fecha_inicio);
                                const endDate = task.fecha_fin_estimada && isValid(parseISO(task.fecha_fin_estimada)) ? parseISO(task.fecha_fin_estimada) : startDate;

                                const startOffsetDays = differenceInDays(startDate, timelineStart);
                                const durationDays = Math.max(0, differenceInDays(endDate, startDate)) + 1;

                                const left = startOffsetDays * pixelPerDay;
                                const width = Math.max(pixelPerDay, durationDays * pixelPerDay);

                                let barClass = 'bg-blue-400 border-blue-500';
                                if (task.terminado) barClass = 'bg-green-400 border-green-500 opacity-80';
                                else if (task.status === 'Pausada') barClass = 'bg-red-300 border-red-400';

                                return (
                                    <div key={task.id} className="h-[32px] border-b border-gray-300 relative flex items-center hover:bg-gray-50 transition-colors pointer-events-none">
                                        <div
                                            className={`h-[18px] rounded-sm shadow-sm border text-[9px] text-white font-bold flex items-center px-1.5 whitespace-nowrap overflow-hidden ${barClass}`}
                                            style={{ left: left, width: width, position: 'absolute' }}
                                            title={`${task.task_description} (${differenceInDays(endDate, startDate) + 1} días)`}
                                        >
                                            {width > 30 && task.task_description}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex justify-between items-center z-50 text-[10px] text-gray-400">
                    <p>Rango: {format(timelineStart, 'dd/MM/yyyy')} — {format(timelineEnd, 'dd/MM/yyyy')}</p>
                    <button onClick={onClose} className="hover:text-gray-600 hover:underline">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default HouseGanttModal;
