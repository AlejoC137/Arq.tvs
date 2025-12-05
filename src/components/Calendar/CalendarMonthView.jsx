import React from 'react';

const CalendarMonthView = ({ currentDate, tasks }) => {
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        // Adjust for Monday start (0 = Sunday, 1 = Monday, ...)
        // If Sunday (0), make it 6. If Monday (1), make it 0.
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
        return { days, firstDay: adjustedFirstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);
    const daysArray = Array.from({ length: days }, (_, i) => i + 1);
    const blanksArray = Array.from({ length: firstDay }, (_, i) => i);

    const getEventsForDate = (day) => {
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateString = targetDate.toISOString().split('T')[0];

        return tasks.filter(event => {
            if (!event.date) return false;
            const eventDate = event.date.toISOString().split('T')[0];
            return eventDate === dateString;
        });
    };

    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    return (
        <div className="flex flex-col h-full">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-gray-200">
                {weekDays.map(day => (
                    <div key={day} className="py-2 text-center text-sm font-semibold text-gray-500 bg-gray-50">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                {/* Blanks for previous month */}
                {blanksArray.map(blank => (
                    <div key={`blank-${blank}`} className="bg-gray-50/30 border-b border-r border-gray-100 min-h-[100px]" />
                ))}

                {/* Days */}
                {daysArray.map(day => {
                    const dayEvents = getEventsForDate(day);
                    const isToday =
                        day === new Date().getDate() &&
                        currentDate.getMonth() === new Date().getMonth() &&
                        currentDate.getFullYear() === new Date().getFullYear();

                    return (
                        <div
                            key={day}
                            className={`border-b border-r border-gray-100 p-2 min-h-[100px] transition-colors hover:bg-gray-50 ${isToday ? 'bg-blue-50/30' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'
                                    }`}>
                                    {day}
                                </span>
                                {dayEvents.length > 0 && (
                                    <span className="text-xs font-medium text-gray-400">
                                        {dayEvents.length}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1 overflow-y-auto max-h-[100px] custom-scrollbar">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className={`text-xs p-1.5 rounded border truncate cursor-pointer transition-colors ${event.type === 'action'
                                                ? 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
                                                : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                                            } ${event.status === 'Completado' ? 'line-through opacity-60' : ''}`}
                                        title={`${event.type === 'action' ? 'Acción: ' : 'Tarea: '}${event.title}`}
                                    >
                                        {event.type === 'action' && (
                                            <span className="font-bold mr-1">A:</span>
                                        )}
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarMonthView;
