// ARCHIVO: Test.jsx (Modificado para aceptar onRoomSelect)

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
// ... otros imports si los necesitas dentro de Test ...

// Importa los componentes de plano
import { FloorPlanC2P1 } from './FloorPlanC2P1';
import { FloorPlanC2P2 } from './FloorPlanC2P2';

// 1. Acepta la nueva prop 'onRoomSelect'
const Test = ({ onRoomSelect }) => {
  // Estado local para el piso actual y la habitación seleccionada (para highlighting)
  const [currentFloor, setCurrentFloor] = useState(1); // O el piso por defecto que prefieras
  const [selectedRoomLocal, setSelectedRoomLocal] = useState(null); // Renombrado para evitar confusión

  // 2. Modifica handleRoomClick para llamar a onRoomSelect
  const handleRoomClick = (roomId) => {
    console.log(`Plano - Piso: ${currentFloor}, Habitación seleccionada: ${roomId}`);
    setSelectedRoomLocal(roomId); // Actualiza estado local para resaltar

    // Notifica al componente padre (ProjectTaskModal)
    if (onRoomSelect) {
      onRoomSelect(roomId);
    }
  };

  // Función para estilizar los botones de piso (sin cambios)
  const getFloorButtonClass = (floor) => {
    const base = "py-2 px-4 rounded-md font-medium transition-all";
    if (currentFloor === floor) {
      return `${base} bg-blue-600 text-white shadow`;
    }
    return `${base} bg-white text-gray-700 hover:bg-gray-100`;
  };

  return (
    // Removí el div contenedor principal y clases de altura/fondo,
    // ya que ProjectTaskModal ahora controla el layout.
    <div className="flex flex-col h-full">
      {/* Botones para cambiar de piso */}
      <div className="flex space-x-2 p-1 bg-gray-200 rounded-lg max-w-xs mb-4 flex-shrink-0">
        <button
          className={getFloorButtonClass(1)}
          onClick={() => {
            setCurrentFloor(1);
            setSelectedRoomLocal(null); // Resetea local
            if (onRoomSelect) onRoomSelect(null); // Resetea en padre
          }}
        >
          Piso 1
        </button>
        <button
          className={getFloorButtonClass(2)}
          onClick={() => {
            setCurrentFloor(2);
            setSelectedRoomLocal(null); // Resetea local
            if (onRoomSelect) onRoomSelect(null); // Resetea en padre
          }}
        >
          Piso 2
        </button>
      </div>

      {/* Contenedor del SVG que se ajusta al espacio disponible */}
      <div className="flex-grow w-full h-full">
        {/* Renderizado condicional del plano, usando el estado local para resaltar */}
        {currentFloor === 1 && (
          <FloorPlanC2P1
            selectedRoom={selectedRoomLocal}
            onRoomClick={handleRoomClick}
          />
        )}
        {currentFloor === 2 && (
          <FloorPlanC2P2
            selectedRoom={selectedRoomLocal}
            onRoomClick={handleRoomClick}
          />
        )}
      </div>
    </div>
  );
};

export default Test; // Asegúrate de que la exportación sea 'default'