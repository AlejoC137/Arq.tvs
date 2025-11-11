// ARCHIVO: FloorPlanC2S1.jsx - Plano Sótano Casa 2

import React, { useMemo } from 'react';

// IDs de las habitaciones con opacidad
const roomsWithOpacity = [];

/**
 * Función para asignar clases de Tailwind dinámicamente
 */
const getRoomClassName = (roomId, selectedRoom) => {
  const baseClasses = "stroke-gray-900 stroke-[1px] cursor-pointer transition-all duration-200";
  const opacityClass = roomsWithOpacity.includes(roomId) ? 'opacity-50' : 'opacity-100';

  if (selectedRoom === roomId) {
    return `${baseClasses} fill-teal-400 ${opacityClass}`;
  }
  return `${baseClasses} fill-white hover:fill-teal-100 ${opacityClass}`;
};

/**
 * Centros y tamaños de etiquetas
 */
const ROOM_CENTERS = {
  // Agregar coordenadas cuando se tenga el SVG
};

/**
 * Etiquetas amigables
 */
const ROOM_LABELS = {
  // Agregar etiquetas cuando se definan los espacios
};

/**
 * Determinar nivel de criticidad
 */
const getTaskLevel = (count) => {
  if (count > 10) return 'critical';
  if (count > 5) return 'high';
  if (count > 2) return 'medium';
  if (count > 0) return 'low';
  return 'none';
};

/**
 * Componente de Etiqueta
 */
const RoomLabel = ({ roomId, count, isSelected }) => {
  const position = ROOM_CENTERS[roomId];
  if (!position) return null;

  const label = ROOM_LABELS[roomId] || roomId;
  const level = getTaskLevel(count);
  
  const textColors = {
    none: 'fill-gray-600',
    low: 'fill-green-700',
    medium: 'fill-yellow-800',
    high: 'fill-orange-700',
    critical: 'fill-red-700'
  };
  
  const textColor = textColors[level];
  const scale = isSelected ? 1.2 : 0.8;

  const isSmall = position.size === 'small';
  const isFurniture = position.size === 'furniture';
  
  let fontSize = '8px';
  if (isSmall) fontSize = '6px';
  if (isFurniture) fontSize = '5px';
  
  const displayText = count > 0 ? `${label} (${count})` : label;

  return (
    <g 
      transform={`translate(${position.x}, ${position.y}) scale(${scale})`} 
      className="pointer-events-none transition-all duration-200"
      style={{
        filter: isSelected 
          ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' 
          : 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))'
      }}
    >
      <text
        x="0"
        y="0"
        textAnchor="middle"
        dominantBaseline="middle"
        className={`${textColor} font-bold`}
        style={{ fontSize: fontSize }}
      >
        {displayText}
      </text>
    </g>
  );
};

/**
 * Componente Principal del Plano (Sótano - Casa 2)
 */
export function FloorPlanC2S1({ selectedRoom, onRoomClick, tasks = [] }) {
  const taskCountByRoom = useMemo(() => {
    const counts = {};
    
    tasks.forEach(task => {
      if (task.espacio) {
        counts[task.espacio] = (counts[task.espacio] || 0) + 1;
      }
      
      if (task.acciones) {
        try {
          const acciones = typeof task.acciones === 'string' 
            ? JSON.parse(task.acciones) 
            : task.acciones;
          
          if (Array.isArray(acciones)) {
            acciones.forEach(accion => {
              if (accion.espacio) {
                counts[accion.espacio] = (counts[accion.espacio] || 0) + 1;
              }
            });
          }
        } catch (e) {
          // Ignorar errores de parsing
        }
      }
    });
    
    return counts;
  }, [tasks]);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 588.05 326.07" width="100%">
      {/* TODO: Agregar SVG del sótano cuando esté disponible */}
      <g id="PisosEspacios">
        {/* Espacios interactivos aquí */}
      </g>
      
      <g id="Muros" className="fill-gray-600 pointer-events-none">
        {/* Muros aquí */}
      </g>
      
      <g id="Estructura" className="pointer-events-none" fill="#f0f">
        {/* Estructura aquí */}
      </g>
      
      <g id="Ventanas" className="fill-none stroke-blue-300 pointer-events-none stroke-[1px]">
        {/* Ventanas aquí */}
      </g>
      
      <g id="Frame" className="pointer-events-none">
        <rect x=".5" y=".5" width="587.05" height="325.07" fill="none" stroke="#000" strokeMiterlimit="10"/>
      </g>
      
      {/* Etiquetas de habitaciones */}
      {Object.keys(ROOM_CENTERS).map((roomId) => (
        <RoomLabel
          key={roomId}
          roomId={roomId}
          count={taskCountByRoom[roomId] || 0}
          isSelected={selectedRoom === roomId}
        />
      ))}
    </svg>
  );
}
