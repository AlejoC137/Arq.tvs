// ARCHIVO: src/components/InlineActionsTask.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { updateTask } from '../store/actions/actions';

// Usaremos un debounce para no llamar a la API en cada tecleo
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const InlineActionsTask = ({ task }) => {
  const dispatch = useDispatch();
  
  // Estado para la lista de acciones
  const [actions, setActions] = useState([]);
  // Estado para la nueva acción a agregar
  const [newAction, setNewAction] = useState({ action: '', executer: '', lista: false });

  // Cargar las acciones de la tarea al montar el componente
  useEffect(() => {
    try {
      if (task.acciones && typeof task.acciones === 'string') {
        const parsedActions = JSON.parse(task.acciones);
        setActions(Array.isArray(parsedActions) ? parsedActions : []);
      } else {
        setActions([]);
      }
    } catch (error) {
      console.error("Error parsing task actions:", error);
      setActions([]);
    }
  }, [task.acciones]);

  // Función para guardar los cambios en Supabase (con debounce)
  const saveChangesToSupabase = useMemo(
    () => debounce((updatedActions) => {
      const actionsJsonString = JSON.stringify(updatedActions);
      dispatch(updateTask(task.id, { acciones: actionsJsonString }));
    }, 1000), // Espera 1 segundo después del último cambio para guardar
    [dispatch, task.id]
  );

  // Manejar cambios en los inputs de una acción existente
  const handleActionChange = (index, field, value) => {
    const updatedActions = actions.map((act, i) => 
      i === index ? { ...act, [field]: value } : act
    );
    setActions(updatedActions);
    saveChangesToSupabase(updatedActions);
  };

  // Manejar cambios en los inputs del formulario de nueva acción
  const handleNewActionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAction(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Agregar una nueva acción a la lista
  const handleAddAction = (e) => {
    e.preventDefault();
    if (!newAction.action || !newAction.executer) {
      alert('La acción y el ejecutor son requeridos.');
      return;
    }
    const updatedActions = [...actions, newAction];
    setActions(updatedActions);
    saveChangesToSupabase(updatedActions); // Guardar inmediatamente al agregar
    setNewAction({ action: '', executer: '', lista: false }); // Limpiar formulario
  };

  // Eliminar una acción de la lista
  const handleDeleteAction = (indexToDelete) => {
    const updatedActions = actions.filter((_, index) => index !== indexToDelete);
    setActions(updatedActions);
    saveChangesToSupabase(updatedActions); // Guardar inmediatamente al eliminar
  };

  return (
    <div className="p-2 space-y-2 bg-gray-50">
      {/* Lista de acciones existentes */}
      {actions.length > 0 && (
        <div className="space-y-1">
          {actions.map((act, index) => (
            <div key={index} className={`grid grid-cols-12 gap-x-2 items-center p-1 rounded ${act.lista ? 'bg-green-100' : ''}`}>
              <input
                type="text"
                value={act.action}
                onChange={(e) => handleActionChange(index, 'action', e.target.value)}
                className="col-span-5 p-1 border rounded text-xs bg-transparent"
                placeholder="Acción"
              />
              <input
                type="text"
                value={act.executer}
                onChange={(e) => handleActionChange(index, 'executer', e.target.value)}
                className="col-span-4 p-1 border rounded text-xs bg-transparent"
                placeholder="Ejecutor"
              />
              <div className="col-span-2 flex items-center justify-center">
                 <input
                    type="checkbox"
                    checked={!!act.lista}
                    onChange={(e) => handleActionChange(index, 'lista', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                 />
              </div>
              <div className="col-span-1 flex justify-end">
                <button onClick={() => handleDeleteAction(index)} className="text-red-500 hover:text-red-700 p-1" title="Eliminar">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario para agregar nueva acción */}
      <form onSubmit={handleAddAction} className="grid grid-cols-12 gap-x-2 items-center pt-2 border-t">
        <input
          type="text"
          name="action"
          value={newAction.action}
          onChange={handleNewActionChange}
          className="col-span-5 p-1 border rounded text-xs"
          placeholder="Nueva acción..."
        />
        <input
          type="text"
          name="executer"
          value={newAction.executer}
          onChange={handleNewActionChange}
          className="col-span-4 p-1 border rounded text-xs"
          placeholder="Ejecutor..."
        />
        <div className="col-span-2 flex items-center justify-center">
           <input
              type="checkbox"
              name="lista"
              checked={newAction.lista}
              onChange={handleNewActionChange}
              className="h-4 w-4"
           />
        </div>
        <div className="col-span-1 flex justify-end">
          <button type="submit" className="text-green-600 hover:text-green-800 p-1" title="Agregar">
            <Plus size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InlineActionsTask;