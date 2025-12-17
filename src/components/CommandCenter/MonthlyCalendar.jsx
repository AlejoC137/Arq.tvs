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
    endOfWeek
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { setSelectedTask } from '../../store/actions/appActions';

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

    // TODO: Fetch actions/tasks for the month
    const actions = []; // Placeholder

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
                                    {/* TODO: Map actual tasks/actions here */}
                                    {/* Placeholder */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MonthlyCalendar;
