import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../store/actions/actions';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from 'lucide-react';
import CalendarMonthView from './Calendar/CalendarMonthView';
import CalendarWeekView from './Calendar/CalendarWeekView';

const CalendarView = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector(state => state.tasks);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week'

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getTitle = () => {
    const options = { year: 'numeric', month: 'long' };
    if (viewMode === 'week') {
      // Logic to show week range could be added here, for now showing Month Year of current date
      return currentDate.toLocaleDateString('es-ES', options);
    }
    return currentDate.toLocaleDateString('es-ES', options);
  };

  const getCalendarEvents = () => {
    const events = [];

    tasks.forEach(task => {
      // 1. Add the Task itself if it has a due date
      const taskDate = task.due_date || task.deadlineDiseno || task.deadlineEjecucion;
      if (taskDate) {
        events.push({
          id: `task-${task.id}`,
          originalId: task.id,
          type: 'task',
          title: task.task_description,
          date: new Date(taskDate),
          status: task.status,
          priority: task.priority,
          project_id: task.project_id,
          staff_id: task.staff_id,
          category: task.category
        });
      }

      // 2. Add Actions from the 'acciones' field
      if (task.acciones) {
        try {
          let acciones = [];
          if (typeof task.acciones === 'string') {
            acciones = JSON.parse(task.acciones);
          } else if (Array.isArray(task.acciones)) {
            acciones = task.acciones;
          }

          if (Array.isArray(acciones)) {
            acciones.forEach((accion, index) => {
              // Try multiple fields for the date
              // 1. fechaEjecucion (New format)
              // 2. dates.assignDate (Seen in screenshot)
              // 3. dates.dueDate (Fallback)
              let actionDateStr = accion.fechaEjecucion;

              if (!actionDateStr && accion.dates) {
                // Handle case where dates might be a string or object
                const datesObj = typeof accion.dates === 'string' ? JSON.parse(accion.dates) : accion.dates;
                actionDateStr = datesObj.assignDate || datesObj.dueDate;
              }

              if (actionDateStr) {
                events.push({
                  id: `action-${task.id}-${index}`,
                  originalId: task.id, // Link back to parent task
                  type: 'action',
                  title: accion.accion,
                  date: new Date(actionDateStr),
                  status: accion.completado ? 'Completado' : 'Pendiente',
                  priority: 'Normal', // Actions don't have priority usually, default to Normal
                  executor: accion.ejecutor,
                  espacio: accion.espacio,
                  parentTask: task.task_description
                });
              }
            });
          }
        } catch (e) {
          console.error("Error parsing actions for task", task.id, e);
        }
      }
    });

    return events;
  };

  const events = getCalendarEvents();

  return (
    <div className="flex flex-col h-full bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            {getTitle()}
          </h1>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={handlePrev}
              className="p-1 hover:bg-white rounded-md transition-colors text-gray-600"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Hoy
            </button>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-white rounded-md transition-colors text-gray-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('month')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'month'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <CalendarIcon size={16} />
            <span>Mes</span>
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'week'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <List size={16} />
            <span>Semana</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {viewMode === 'month' ? (
              <CalendarMonthView currentDate={currentDate} tasks={events} />
            ) : (
              <CalendarWeekView currentDate={currentDate} tasks={events} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
