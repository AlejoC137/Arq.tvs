// ARCHIVO: src/components/InlineActionsTask.jsx

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Trash2 } from 'lucide-react';
import { updateTask } from '../store/actions/actions';

// Lista de espacios predefinida
const ESPACIOS_HABITACIONES = [
  'HabitacionPrincipal',
  'Cocina',
  'BalconOficina',
  'Oficina',
  'ClosetHabitacionPrincipal',
  'Piscina',
  'Servicios',
  'BañoOficina',
  'BañoHabitacionPrincipal',
  'Escalera',
  'EtudioPiso1',
  'Sala',
  'Comedor',
  'JardinInterior',
  'Acceso',
  'Deck',
  'HabitacionAuxiliar1',
  'VestierHabitacionAuxiliar1',
  'EstudioPiso2',
  'HallPiso2',
  'HabitacionPrincipalPiso2',
  'ClosetHabitacionPrincipalPiso2',
  'HabitacionAuxiliar2',
  'TerrazaHabitacionPrincipalPiso2',
  'BañoHabitacionAuxiliar',
  'ClostHabitacionAuxiliar',
  'BañoHabitacionPrincipalPiso2',
  'BañoHabitacionAuxiliar1'
];

// Debounce para no llamar a la API en cada tecleo
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Componente Textarea que se auto-ajusta
const AutoResizingTextarea = ({ value, onChange, ...props }) => {
    const textAreaRef = useRef(null);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [value]);

    return <textarea ref={textAreaRef} value={value} onChange={onChange} {...props} />;
};

const InlineActionsTask = ({ task }) => {
  const dispatch = useDispatch();
  
  const [actions, setActions] = useState([]);
  const [isLegacy, setIsLegacy] = useState(false);
  const [legacyContent, setLegacyContent] = useState('');
  
  const [newAction, setNewAction] = useState({
    espacio: ESPACIOS_HABITACIONES[0],
    nombreEspacio: '',
    accion: '',
    objetivo: '',
    ejecutor: '', // <-- NUEVO CAMPO
    completado: false
  });

  // Memoizamos el debounce para que no se recree en cada render
  const saveChangesToSupabase = useMemo(
    () => debounce((updatedActions) => {
      const actionsJsonString = JSON.stringify(updatedActions);
      dispatch(updateTask(task.id, { acciones: actionsJsonString }));
    }, 1000),
    [dispatch, task.id]
  );

  useEffect(() => {
    // Reseteamos estados
    setIsLegacy(false);
    setLegacyContent('');
    setActions([]);

    const data = task.acciones;

    if (!data) {
      setActions([]);
      setIsLegacy(false);
      return;
    }

    let parsedData;
    let isString = typeof data === 'string';

    if (isString) {
      try {
        parsedData = JSON.parse(data);
      } catch (error) {
        setIsLegacy(true);
        setLegacyContent(data);
        return;
      }
    } else {
      parsedData = data;
    }

    if (Array.isArray(parsedData)) {
      if (parsedData.length > 0) {
        const firstItem = parsedData[0];
        if (firstItem.hasOwnProperty('accion') || firstItem.hasOwnProperty('espacio') || firstItem.hasOwnProperty('ejecutor')) {
          
          // --- INICIO DE LA MIGRACIÓN AUTOMÁTICA ---
          let needsSave = false;
          const migratedActions = parsedData.map(act => {
            // Comprobamos si el objetivo tiene el prefijo y el campo ejecutor está vacío
            if (act.objetivo && act.objetivo.startsWith('Ejecutor: ') && !act.ejecutor) {
              needsSave = true;
              const ejecutorName = act.objetivo.substring(10).trim(); // "Ejecutor: " tiene 10 chars
              return { ...act, objetivo: '', ejecutor: ejecutorName };
            }
            return act;
          });
          // --- FIN DE LA MIGRACIÓN AUTOMÁTICA ---
          
          setActions(migratedActions);
          setIsLegacy(false);

          // Si migramos algo, lo guardamos en la BD
          if (needsSave) {
            // Usamos el saveChangesToSupabase pero sin debounce para que sea inmediato
            const actionsJsonString = JSON.stringify(migratedActions);
            dispatch(updateTask(task.id, { acciones: actionsJsonString }));
          }
          
        } else {
          setIsLegacy(true);
          setLegacyContent(isString ? data : JSON.stringify(data, null, 2));
        }
      } else {
        setActions([]);
        setIsLegacy(false);
      }
    } else {
      setIsLegacy(true);
      setLegacyContent(isString ? data : JSON.stringify(data, null, 2));
    }
  }, [task.acciones, dispatch, task.id]); // Quitamos saveChangesToSupabase de aquí

  const handleActionChange = (index, field, value) => {
    const updatedActions = actions.map((act, i) => 
      i === index ? { ...act, [field]: value } : act
    );
    setActions(updatedActions);
    saveChangesToSupabase(updatedActions);
  };

  const handleNewActionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAction(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddAction = (e) => {
    e.preventDefault();
    if (!newAction.accion) {
      alert('La acción es requerida.');
      return;
    }
    const updatedActions = [...actions, { ...newAction, id: Date.now() }];
    setActions(updatedActions);
    saveChangesToSupabase(updatedActions);
    setNewAction({
      espacio: ESPACIOS_HABITACIONES[0],
      nombreEspacio: '',
      accion: '',
      objetivo: '',
      ejecutor: '', // <-- RESETEAR CAMPO
      completado: false
    });
  };

  const handleDeleteAction = (indexToDelete) => {
    const actionToDelete = actions[indexToDelete];
    const updatedActions = actionToDelete.id 
      ? actions.filter(a => a.id !== actionToDelete.id)
      : actions.filter((_, index) => index !== indexToDelete);
      
    setActions(updatedActions);
    saveChangesToSupabase(updatedActions);
  };

  // Handler para la conversión
  const handleConvertToNewStructure = useCallback(() => {
    if (!window.confirm('Esto convertirá las acciones a la nueva estructura. ¿Continuar?')) {
      return;
    }

    let newActionsList = [];

    try {
      const parsedLegacy = JSON.parse(legacyContent);
      
      if (Array.isArray(parsedLegacy)) {
        newActionsList = parsedLegacy.map((oldItem, index) => ({
          id: Date.now() + index,
          espacio: ESPACIOS_HABITACIONES[0],
          nombreEspacio: '',
          accion: oldItem.action || '',
          objetivo: '', // <-- AHORA VACÍO
          ejecutor: oldItem.executer || '', // <-- MAPEAR AQUÍ
          completado: oldItem.lista || false,
        }));
      } else {
        throw new Error("Legacy content is JSON but not an array");
      }

    } catch (error) {
      newActionsList = [{
        id: Date.now(),
        espacio: ESPACIOS_HABITACIONES[0],
        nombreEspacio: '',
        accion: legacyContent,
        objetivo: '',
        ejecutor: '', // <-- NUEVO CAMPO
        completado: false,
      }];
    }

    saveChangesToSupabase(newActionsList);
    setActions(newActionsList);
    setIsLegacy(false);
  }, [legacyContent, saveChangesToSupabase]); // saveChangesToSupabase es estable por useMemo

  // ----- RENDERIZADO -----

  if (isLegacy) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-800">
        <h4 className="font-bold mb-2">Formato Antiguo Detectado</h4>
        <p className="text-sm mb-4">Se ha detectado contenido en el formato anterior. Puedes convertirlo a la nueva estructura.</p>
        <div className="p-2 bg-white border rounded text-gray-700 italic mb-4 whitespace-pre-wrap">
            {legacyContent || "No hay acciones definidas."}
        </div>
        <button
          onClick={handleConvertToNewStructure}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
        >
          Convertir a nueva estructura
        </button>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2 bg-gray-50">
      {/* Lista de acciones existentes */}
      {actions.length > 0 && (
        <div className="space-y-1">
          {actions.map((act, index) => (
            <div 
              key={act.id || index} 
              className={`grid grid-cols-12 gap-x-2 items-stretch p-1 rounded ${act.completado ? 'bg-green-100 opacity-70' : ''}`}
            >
              
              <select
                value={act.espacio || ESPACIOS_HABITACIONES[0]}
                onChange={(e) => handleActionChange(index, 'espacio', e.target.value)}
                className={`col-span-2 p-1 border rounded text-xs bg-transparent h-10 ${act.completado ? 'line-through' : ''}`}
              >
                {ESPACIOS_HABITACIONES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>

              <AutoResizingTextarea
                value={act.nombreEspacio || ''}
                onChange={(e) => handleActionChange(index, 'nombreEspacio', e.target.value)}
                className={`col-span-2 p-1 border rounded text-xs bg-transparent resize-none overflow-hidden min-h-[40px] ${act.completado ? 'line-through' : ''}`}
                placeholder="Elemento/Especifico"
                rows="1"
              />

              <AutoResizingTextarea
                value={act.accion || ''}
                onChange={(e) => handleActionChange(index, 'accion', e.target.value)}
                className={`col-span-4 p-1 border rounded text-xs bg-transparent resize-none overflow-hidden min-h-[40px] ${act.completado ? 'line-through' : ''}`}
                placeholder="Acción"
                rows="1"
              />
              
              {/* Ajuste de layout: col-span-1 para objetivo y ejecutor */}
              <AutoResizingTextarea
                value={act.objetivo || ''}
                onChange={(e) => handleActionChange(index, 'objetivo', e.target.value)}
                className={`col-span-1 p-1 border rounded text-xs bg-transparent resize-none overflow-hidden min-h-[40px] ${act.completado ? 'line-through' : ''}`}
                placeholder="Objetivo"
                rows="1"
              />

              <input
                type="text"
                value={act.ejecutor || ''}
                onChange={(e) => handleActionChange(index, 'ejecutor', e.target.value)}
                className={`col-span-1 p-1 border rounded text-xs bg-transparent h-10 ${act.completado ? 'line-through' : ''}`}
                placeholder="Ejecutor"
              />

              <div className="col-span-1 flex items-center justify-center">
                   <input
                     type="checkbox"
                     checked={!!act.completado}
                     onChange={(e) => handleActionChange(index, 'completado', e.target.checked)}
                     className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                   />
              </div>

              <div className="col-span-1 flex items-center justify-center">
                <button onClick={() => handleDeleteAction(index)} className="text-red-500 justify-center hover:text-red-700 p-1" title="Eliminar">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario para agregar nueva acción */}
      <form onSubmit={handleAddAction} className="grid grid-cols-12 gap-x-2 items-stretch pt-2 border-t">
        <select
          name="espacio"
          value={newAction.espacio}
          onChange={handleNewActionChange}
          className="col-span-2 p-1 border rounded text-xs h-10"
        >
          {ESPACIOS_HABITACIONES.map(e => <option key={e} value={e}>{e}</option>)}
        </select>

        <AutoResizingTextarea
          name="nombreEspacio"
          value={newAction.nombreEspacio}
          onChange={handleNewActionChange}
          className="col-span-2 p-1 border rounded text-xs resize-none overflow-hidden min-h-[40px]"
          placeholder="Elemento/Especifico"
          rows="1"
        />

        <AutoResizingTextarea
          name="accion"
          value={newAction.accion}
          onChange={handleNewActionChange}
          className="col-span-4 p-1 border rounded text-xs resize-none overflow-hidden min-h-[40px]"
          placeholder="Nueva acción..."
          rows="1"
        />

        <AutoResizingTextarea
          name="objetivo"
          value={newAction.objetivo}
          onChange={handleNewActionChange}
          className="col-span-1 p-1 border rounded text-xs resize-none overflow-hidden min-h-[40px]"
          placeholder="Objetivo..."
          rows="1"
        />
        
        <input
          type="text"
          name="ejecutor"
          value={newAction.ejecutor}
          onChange={handleNewActionChange}
          className="col-span-1 p-1 border rounded text-xs h-10"
          placeholder="Ejecutor"
        />

        <div className="col-span-1 flex items-center justify-center">
           <input
             type="checkbox"
             name="completado"
             checked={newAction.completado}
             onChange={handleNewActionChange}
             className="h-4 w-4"
           />
        </div>

        <div className="col-span-1 flex items-center justify-center">
          <button type="submit" className="text-green-600 hover:text-green-800 p-1" title="Agregar">
            <Plus size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InlineActionsTask;