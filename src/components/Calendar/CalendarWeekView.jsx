import React from 'react';

const CalendarWeekView = ({ currentDate, tasks }) => {
    const getWeekDays = (date) => {
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
        startOfWeek.setDate(diff);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const weekDays = getWeekDays(currentDate);

    const getEventsForDate = (date) => {
        const dateString = date.toISOString().split('T')[0];
        return tasks.filter(event => {
            if (!event.date) return false;
            const eventDate = event.date.toISOString().split('T')[0];
            return eventDate === dateString;
        });
    };

    const weekDayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    return (
        <div className="flex h-full overflow-hidden">
            <div className="flex-1 grid grid-cols-7 h-full divide-x divide-gray-200">
                {weekDays.map((date, index) => {
                    const dayEvents = getEventsForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();

                    return (
                        <div key={index} className="flex flex-col h-full bg-white">
                            {/* Header */}
                            <div className={`p-3 text-center border-b border-gray-200 ${isToday ? 'bg-blue-50' : ''}`}>
                                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                    {weekDayNames[index]}
                                </div>
                                <div className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                                    {date.getDate()}
                                </div>
                            </div>

                            {/* Tasks Area */}
                            <div className="flex-1 p-2 overflow-y-auto bg-gray-50/30 space-y-2">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className={`p-2 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer group ${event.type === 'action'
                                                ? 'bg-white border-purple-200'
                                                : 'bg-white border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-1">
                                            {event.type === 'action' ? (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase bg-purple-100 text-purple-700">
                                                    Acción
                                                </span>
                                            ) : (
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${event.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                                                        event.priority === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                    }`}>
                                                    {event.priority || 'Normal'}
                                                </span>
                                            )}
                                        </div>

                                        <p className={`text-sm font-medium text-gray-800 line-clamp-3 mb-1 ${event.status === 'Completado' ? 'line-through opacity-60' : ''}`}>
                                            {event.title}
                                        </p>

                                        {event.type === 'action' && event.executor && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                <span className="font-semibold">Resp:</span> {event.executor}
                                            </div>
                                        )}

                                        {event.type === 'action' && event.parentTask && (
                                            <div className="text-[10px] text-gray-400 mt-1 italic line-clamp-1">
                                                de: {event.parentTask}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                                            <span className="truncate max-w-[80px]">
                                                {event.category || event.espacio || '-'}
                                            </span>
                                            <span className={`px-1.5 py-0.5 rounded ${event.status === 'Completado' ? 'bg-green-50 text-green-600' :
                                                    event.status === 'En Progreso' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {dayEvents.length === 0 && (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">
                                        Sin eventos
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarWeekView;
