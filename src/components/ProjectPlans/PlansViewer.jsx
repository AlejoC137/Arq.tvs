// ARCHIVO: src/components/ProjectPlans/PlansViewer.jsx

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getProjectPlanConfig } from '../../config/projectPlansConfig';

/**
 * Componente para visualizar y navegar entre los planos de un proyecto
 */
const PlansViewer = ({ project, selectedRoom, onRoomSelect, onClose }) => {
  // Obtener las tareas del proyecto desde Redux
  const allTasks = useSelector(state => state.tasks?.tasks || []);
  const projectTasks = allTasks.filter(task => task.project_id === project?.id);
  const planConfig = getProjectPlanConfig(project);
  const [selectedPlan, setSelectedPlan] = useState(planConfig.defaultPlan);

  // Actualizar el plano seleccionado cuando cambia el proyecto
  useEffect(() => {
    setSelectedPlan(planConfig.defaultPlan);
  }, [project, planConfig.defaultPlan]);

  // Si no hay planos configurados, mostrar mensaje
  if (!planConfig.plans || planConfig.plans.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center h-full">
        <div className="text-center p-8">
          <p className="text-gray-500 text-lg">No hay planos configurados para este proyecto</p>
          {onClose && (
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentPlanConfig = planConfig.plans.find(p => p.id === selectedPlan);
  const PlanComponent = currentPlanConfig?.component;

  const planProps = {
    onRoomSelect: (room) => {
      if (onRoomSelect) onRoomSelect(room);
      console.log('Espacio seleccionado:', room);
    },
    selectedRoom,
    tasks: projectTasks  // Pasar las tareas filtradas del proyecto
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800">Planos - {planConfig.title}</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cerrar
          </button>
        )}
      </div>

      {/* Plan Selector Buttons */}
      <div className="p-4 border-b border-gray-200 flex gap-2 flex-wrap flex-shrink-0">
        {planConfig.plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedPlan === plan.id
                ? 'bg-blue-600 text-white shadow'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {plan.label}
          </button>
        ))}
      </div>

      {/* Selected Room Filter */}
      {selectedRoom && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">Filtrando por: {selectedRoom}</span>
          <button
            onClick={() => onRoomSelect && onRoomSelect(null)}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Limpiar filtro
          </button>
        </div>
      )}

      {/* Plan Viewer */}
      <div className="flex-grow overflow-auto">
        {PlanComponent ? (
          <PlanComponent {...planProps} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Plano no disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansViewer;
