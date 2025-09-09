import React from 'react';
import { 
  CheckCircle2, 
  Play, 
  Pause, 
  X, 
  Eye, 
  Calendar,
  Users,
  Flag,
  MessageCircle,
  Copy,
  Trash2
} from 'lucide-react';
// Estados definidos localmente hasta integrar con Supabase
const ESTADOS = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En Proceso', 
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
  EN_REVISION: 'En Revisión'
};

const TaskActions = ({ selectedRows, data, updateMultipleTasks, deselectAll }) => {
  const selectedTasks = data.filter(task => selectedRows.has(task.id));
  
  if (selectedRows.size === 0) return null;

  const handleBulkStatusChange = (newStatus) => {
    updateMultipleTasks(Array.from(selectedRows), { estado: newStatus });
    deselectAll();
  };

  const handleBulkPriorityChange = (newPriority) => {
    updateMultipleTasks(Array.from(selectedRows), { prioridad: newPriority });
    deselectAll();
  };

  const handleBulkAssign = (responsable) => {
    const updates = {};
    selectedTasks.forEach(task => {
      if (!task.responsables.includes(responsable)) {
        updates[task.id] = {
          responsables: [...task.responsables, responsable]
        };
      }
    });
    
    Object.entries(updates).forEach(([taskId, update]) => {
      updateMultipleTasks([parseInt(taskId)], update);
    });
    
    deselectAll();
  };

  const handleBulkDelete = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedRows.size} tarea(s)?`)) {
      // Implementar lógica de eliminación
      console.log('Eliminar tareas:', Array.from(selectedRows));
      deselectAll();
    }
  };

  const handleDuplicateTasks = () => {
    const duplicates = selectedTasks.map(task => ({
      ...task,
      id: Math.max(...data.map(t => t.id)) + Math.random(),
      tarea: `${task.tarea} (Copia)`,
      estado: ESTADOS.PENDIENTE,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    }));
    
    // Agregar duplicados
    console.log('Duplicar tareas:', duplicates);
    deselectAll();
  };

  const getStatusStats = () => {
    const stats = selectedTasks.reduce((acc, task) => {
      acc[task.estado] = (acc[task.estado] || 0) + 1;
      return acc;
    }, {});
    return stats;
  };

  const statusStats = getStatusStats();

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-4 min-w-[600px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-800">{selectedRows.size}</span>
            </div>
            <span className="font-medium text-gray-900">
              {selectedRows.size} tarea{selectedRows.size > 1 ? 's' : ''} seleccionada{selectedRows.size > 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={deselectAll}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="flex items-center space-x-4 mb-4 text-xs text-gray-600">
          {Object.entries(statusStats).map(([estado, count]) => (
            <span key={estado} className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
              <span>{estado}: {count}</span>
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Cambios de Estado */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Estado</h4>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => handleBulkStatusChange(ESTADOS.EN_PROCESO)}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                <Play size={14} />
                <span>Iniciar</span>
              </button>
              <button
                onClick={() => handleBulkStatusChange(ESTADOS.COMPLETADO)}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
              >
                <CheckCircle2 size={14} />
                <span>Completar</span>
              </button>
              <button
                onClick={() => handleBulkStatusChange(ESTADOS.EN_REVISION)}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors"
              >
                <Eye size={14} />
                <span>Revisar</span>
              </button>
            </div>
          </div>

          {/* Cambios de Prioridad */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Prioridad</h4>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => handleBulkPriorityChange('Alta')}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
              >
                <Flag size={14} />
                <span>Alta</span>
              </button>
              <button
                onClick={() => handleBulkPriorityChange('Media')}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors"
              >
                <Flag size={14} />
                <span>Media</span>
              </button>
              <button
                onClick={() => handleBulkPriorityChange('Baja')}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
              >
                <Flag size={14} />
                <span>Baja</span>
              </button>
            </div>
          </div>

          {/* Otras Acciones */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Acciones</h4>
            <div className="flex flex-col space-y-1">
              <button
                onClick={handleDuplicateTasks}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Copy size={14} />
                <span>Duplicar</span>
              </button>
              <button
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  updateMultipleTasks(Array.from(selectedRows), { deadlineDiseno: today });
                  deselectAll();
                }}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors"
              >
                <Calendar size={14} />
                <span>Fecha Hoy</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Asignación rápida de responsables */}
        <div className="mt-4 pt-3 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Asignar a:</h4>
          <div className="flex flex-wrap gap-2">
            {['Francisco', 'Manuela', 'David', 'Laura', 'Santiago', 'Alejandro'].map(responsable => (
              <button
                key={responsable}
                onClick={() => handleBulkAssign(responsable)}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Users size={12} />
                <span>{responsable}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskActions;
