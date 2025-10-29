// ARCHIVO: src/components/ProjectPlans/TasksToolbar.jsx

import React from 'react';
import { Plus, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { hasProjectPlans } from '../../config/projectPlansConfig';

/**
 * Componente para la barra de herramientas de las tareas
 */
const TasksToolbar = ({ 
  searchTerm, 
  onSearchChange, 
  sortConfig, 
  onSortChange,
  onToggleDirection,
  onNewTask,
  project,
  showPlanView,
  onTogglePlanView
}) => {
  const projectHasPlans = hasProjectPlans(project);

  return (
    <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm font-medium text-gray-600">
            Ordenar por:
          </label>
          <select
            id="sort-select"
            value={sortConfig.key}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Priority">Prioridad</option>
            <option value="task_description">Nombre Tarea</option>
            <option value="status">Estado</option>
          </select>
          <button
            onClick={onToggleDirection}
            className="p-2 border rounded-lg hover:bg-gray-100"
            title={sortConfig.direction === 'ascending' ? 'Orden ascendente' : 'Orden descendente'}
          >
            {sortConfig.direction === 'ascending' ? (
              <ArrowUp className="w-5 h-5" />
            ) : (
              <ArrowDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {projectHasPlans && (
          <button
            onClick={onTogglePlanView}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
              showPlanView
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showPlanView ? '✓ Planos' : 'Ver Planos'}
          </button>
        )}
        <button
          onClick={onNewTask}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          <Plus size={18} /> Nueva Tarea
        </button>
      </div>
    </div>
  );
};

export default TasksToolbar;
