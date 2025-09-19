import React, { useState, useEffect } from 'react';
import { Plus, X, Save, CalendarDays } from 'lucide-react';

// Helper para convertir el formato DD/MM/YYYY a YYYY-MM-DD, que es el que necesita el input de tipo "date".
const toInputDate = (dmyString) => {
  if (!dmyString || typeof dmyString !== 'string' || dmyString.split('/').length !== 3) {
    return ''; // Retorna un string vacío si el formato es inválido o no existe
  }
  const [day, month, year] = dmyString.split('/');
  return `${year}-${month}-${day}`;
};

// Helper para convertir el formato YYYY-MM-DD (del input) de vuelta a DD/MM/YYYY para guardarlo.
const toDisplayDate = (ymdString) => {
  if (!ymdString || typeof ymdString !== 'string' || ymdString.split('-').length !== 3) {
    return ''; // Retorna un string vacío si el formato es inválido
  }
  const [year, month, day] = ymdString.split('-');
  return `${day}/${month}/${year}`;
};


const DatesManager = ({ task, onSave }) => {
  
  const parseDates = (datesJson) => {
    try {
      // Si no hay JSON, devuelve una estructura por defecto
      if (!datesJson) return { assignDate: '', dueDate: '', logs: [] };
      const parsed = JSON.parse(datesJson);
      return {
          assignDate: parsed.assignDate || '',
          dueDate: parsed.dueDate || '',
          logs: parsed.logs || []
      };
    } catch (error) {
      console.error("Error parsing Dates JSON in DatesManager:", error);
      return { assignDate: '', dueDate: '', logs: [] };
    }
  };

  // El estado local maneja las fechas de la tarea actual
  const [dates, setDates] = useState(() => parseDates(task.Dates));

  // Sincroniza el estado si la tarea que se pasa como prop cambia
  useEffect(() => {
    setDates(parseDates(task.Dates));
  }, [task.Dates]);


  const handleDateChange = (e) => {
    const { name, value } = e.target; // 'value' viene en formato "YYYY-MM-DD"
    
    // Convierte la fecha al formato DD/MM/YYYY antes de guardarla
    const displayDate = toDisplayDate(value);

    // Crea el objeto de datos actualizado, manteniendo los logs existentes
    const updatedDates = { 
        ...parseDates(task.Dates), // Asegura que los logs no se pierdan
        [name]: displayDate 
    };
    
    // Llama a la función onSave del componente padre para persistir el cambio
    onSave(task.id, { dates: JSON.stringify(updatedDates) });
  };

  return (
    <div className="flex flex-col gap-1 text-xs p-1">
      <div className="flex items-center justify-between">
        <label htmlFor={`assignDate-${task.id}`} className="font-semibold text-gray-600 mr-2">Asig:</label>
        <input
          id={`assignDate-${task.id}`}
          name="assignDate"
          type="date"
          value={toInputDate(dates.assignDate)}
          onChange={handleDateChange}
          className="p-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
        />
      </div>
      <div className="flex items-center justify-between">
        <label htmlFor={`dueDate-${task.id}`} className="font-semibold text-gray-600 mr-2">Límite:</label>
        <input
          id={`dueDate-${task.id}`}
          name="dueDate"
          type="date"
          value={toInputDate(dates.dueDate)}
          onChange={handleDateChange}
          className="p-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
        />
      </div>
    </div>
  );
};

export default DatesManager;






