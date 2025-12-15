// ARCHIVO: src/components/actionsTask.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { updateTask } from '../store/actions/actions';

const ActionsTask = ({ task, onClose, onDataSaved }) => {
  const dispatch = useDispatch();

  // Estado para la lista de acciones
  const [actions, setActions] = useState([]);
  // Estado para el formulario (acción nueva o en edición)
  const [currentAction, setCurrentAction] = useState({ action: '', executer: '', lista: false });
  // Estado para saber si estamos editando (por el índice)
  const [editingIndex, setEditingIndex] = useState(null);

  // Cargar las acciones existentes desde la tarea cuando el componente se monta
  useEffect(() => {
    try {
      // La columna 'acciones' puede ser null o un string JSON inválido
      if (task.acciones && typeof task.acciones === 'string') {
        const parsedActions = JSON.parse(task.acciones);
        if (Array.isArray(parsedActions)) {
          setActions(parsedActions);
        }
      }
    } catch (error) {
      console.error("Error al parsear las acciones de la tarea:", error);
      setActions([]); // Empezar con una lista vacía si hay error
    }
  }, [task.acciones]);

  // Manejador para cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentAction(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejador para agregar o actualizar una acción en la lista local
  const handleAddOrUpdateAction = (e) => {
    e.preventDefault();
    if (!currentAction.action || !currentAction.executer) {
      alert('Por favor, completa los campos de acción y ejecutor.');
      return;
    }

    let updatedActions;
    if (editingIndex !== null) {
      // Actualizar la acción existente
      updatedActions = actions.map((item, index) =>
        index === editingIndex ? currentAction : item
      );
    } else {
      // Agregar una nueva acción
      updatedActions = [...actions, currentAction];
    }

    setActions(updatedActions);
    resetForm();
  };

  // Función para empezar a editar una acción
  const handleEdit = (index) => {
    setEditingIndex(index);
    setCurrentAction(actions[index]);
  };

  // Función para eliminar una acción de la lista local
  const handleDelete = (indexToDelete) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta acción?')) {
      const updatedActions = actions.filter((_, index) => index !== indexToDelete);
      setActions(updatedActions);
    }
  };

  // Función para guardar todas las acciones en Supabase
  const handleSaveToSupabase = async () => {
    try {
      // Convertimos el array de acciones a un string JSON para guardarlo
      const actionsJsonString = JSON.stringify(actions);

      // Llamamos a la acción de Redux para actualizar la tarea en Supabase
      await dispatch(updateTask(task.id, { acciones: actionsJsonString }));

      // Notificamos al componente padre que los datos se guardaron para que pueda refrescar
      onDataSaved();
      onClose(); // Cerramos el modal
    } catch (error) {
      console.error("Error al guardar las acciones en Supabase:", error);
      alert("No se pudieron guardar las acciones.");
    }
  };

  // Resetea el formulario a su estado inicial
  const resetForm = () => {
    setCurrentAction({ action: '', executer: '', lista: false });
    setEditingIndex(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Gestionar Acciones: <span className="font-normal">{task.tema}</span></h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Formulario para agregar/editar acciones */}
          <form onSubmit={handleAddOrUpdateAction} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 border rounded-lg bg-gray-50">
            <div className="md:col-span-3 font-medium text-gray-700">{editingIndex !== null ? 'Editando Acción' : 'Nueva Acción'}</div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Acción</label>
              <input type="text" name="action" value={currentAction.action} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Describir la acción" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Ejecutor</label>
              <input type="text" name="executer" value={currentAction.executer} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Quién la realiza" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center h-full">
                <input id="lista-checkbox" type="checkbox" name="lista" checked={currentAction.lista} onChange={handleInputChange} className="h-5 w-5 text-blue-600 border-gray-300 rounded" />
                <label htmlFor="lista-checkbox" className="ml-2 text-sm text-gray-700">¿Lista?</label>
              </div>
              <button type="submit" className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500   rounded-lg hover:bg-blue-600 w-full">
                {editingIndex !== null ? <Edit2 size={16} /> : <Plus size={16} />}
                {editingIndex !== null ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
            {editingIndex !== null && (
              <div className="md:col-span-3">
                <button type="button" onClick={resetForm} className="text-sm text-gray-600 hover:underline">Cancelar edición</button>
              </div>
            )}
          </form>

          {/* Lista de acciones existentes */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-800">Acciones Registradas ({actions.length})</h3>
            {actions.length > 0 ? (
              <ul className="border rounded-lg max-h-60 overflow-y-auto">
                {actions.map((act, index) => (
                  <li key={index} className={`flex items-center justify-between p-3 ${index !== actions.length - 1 ? 'border-b' : ''} ${act.lista ? 'bg-green-50 text-gray-500 line-through' : ''}`}>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{act.action}</p>
                      <p className="text-sm text-gray-600">Ejecutor: {act.executer}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {act.lista && <span className="text-xs font-bold text-green-600">LISTA</span>}
                      <button onClick={() => handleEdit(index)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full" title="Editar"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(index)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full" title="Eliminar"><Trash2 size={16} /></button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">No hay acciones registradas para esta tarea.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end items-center p-4 border-t bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 mr-2">Cancelar</button>
          <button onClick={handleSaveToSupabase} className="px-4 py-2 bg-green-600   rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Save size={16} /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionsTask;