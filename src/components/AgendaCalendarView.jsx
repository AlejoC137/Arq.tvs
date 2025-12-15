import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Users } from 'lucide-react';

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const AgendaCalendarView = ({ eventos = [], onEventClick, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Generar días del calendario
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Días del mes anterior (espacios vacíos)
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, date: null, isCurrentMonth: false });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ day, date, isCurrentMonth: true });
    }

    // Completar la última semana con días del siguiente mes
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push({ day: null, date: null, isCurrentMonth: false });
      }
    }

    return days;
  }, [year, month]);

  // Agrupar eventos por fecha
  const eventosPorFecha = useMemo(() => {
    const map = {};
    eventos.forEach(evento => {
      if (evento.fecha) {
        const dateKey = evento.fecha.split('T')[0]; // formato YYYY-MM-DD
        if (!map[dateKey]) {
          map[dateKey] = [];
        }
        map[dateKey].push(evento);
      }
    });
    return map;
  }, [eventos]);

  const getEventosForDay = (date) => {
    if (!date) return [];
    const dateKey = date.toISOString().split('T')[0];
    return eventosPorFecha[dateKey] || [];
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const parseServicios = (servicios) => {
    if (typeof servicios === 'string') {
      try {
        return JSON.parse(servicios);
      } catch {
        return {};
      }
    }
    return servicios || {};
  };

  const getActiveServices = (evento) => {
    const servicios = parseServicios(evento.servicios);
    const active = [];
    if (servicios.alimentos?.activo) active.push('🍽️');
    if (servicios.mesas?.activo) active.push('🪑');
    if (servicios.audioVisual?.activo) active.push('🔊');
    if (servicios.otros?.activo) active.push('📋');
    return active;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header con controles */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          {MESES[month]} {year}
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={goToPreviousMonth}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DIAS_SEMANA.map(dia => (
          <div
            key={dia}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {dia}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((dayInfo, index) => {
          const { day, date, isCurrentMonth } = dayInfo;
          const dayEventos = getEventosForDay(date);
          const hasEvents = dayEventos.length > 0;
          const today = isToday(date);

          return (
            <div
              key={index}
              onClick={() => isCurrentMonth && onDateClick?.(date)}
              className={`
                min-h-[120px] border border-gray-200 rounded-lg p-2
                ${isCurrentMonth ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'}
                ${today ? 'ring-2 ring-blue-500 border-blue-500' : ''}
                transition-all
              `}
            >
              {isCurrentMonth && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`
                        text-sm font-semibold
                        ${today ? 'bg-blue-500 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-700'}
                      `}
                    >
                      {day}
                    </span>
                    {hasEvents && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                        {dayEventos.length}
                      </span>
                    )}
                  </div>

                  {/* Lista de eventos del día */}
                  <div className="space-y-1 overflow-y-auto max-h-[80px]">
                    {dayEventos.map((evento, idx) => {
                      const services = getActiveServices(evento);
                      return (
                        <div
                          key={evento.id || idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick?.(evento);
                          }}
                          className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded p-1.5 text-xs cursor-pointer transition-colors"
                        >
                          <div className="font-medium text-blue-900 truncate">
                            {evento.titulo}
                          </div>
                          <div className="flex items-center gap-1 text-blue-700 mt-0.5">
                            {evento.hora_inicio && (
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-3 h-3" />
                                {evento.hora_inicio.substring(0, 5)}
                              </span>
                            )}
                            {evento.num_personas && (
                              <span className="flex items-center gap-0.5">
                                <Users className="w-3 h-3" />
                                {evento.num_personas}
                              </span>
                            )}
                          </div>
                          {services.length > 0 && (
                            <div className="flex gap-0.5 mt-0.5">
                              {services.map((icon, i) => (
                                <span key={i} className="text-xs">{icon}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Día actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
            <span>Evento programado</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🍽️ Alimentos</span>
            <span>🪑 Mesas</span>
            <span>🔊 Audio</span>
            <span>📋 Otros</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaCalendarView;
