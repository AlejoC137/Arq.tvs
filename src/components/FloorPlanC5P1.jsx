// ARCHIVO: FloorPlanC4P1.jsx - Plano Piso 1 Casa 4

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
  // TODO: Agregar coordenadas de cada espacio del Piso 1 Casa 4
  // Ejemplo: HabitacionPrincipal: { x: 300, y: 200 },
};

/**
 * Etiquetas amigables
 */
const ROOM_LABELS = {
  // TODO: Agregar etiquetas de cada espacio
  // Ejemplo: HabitacionPrincipal: 'Hab. Principal',
};

/**
 * Determinar nivel de criticidad
 */
const getTaskLevel = (count) => {
  if (count > 10) return 'critical';
  if (count > 5) return 'high';
  if (count > 2) return 'medium';
  if (count > 0) return 'low';
  return 'none';\
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
 * Componente Principal del Plano (Piso 1 - Casa 4)
 */
export function FloorPlanC4P1({ selectedRoom, onRoomClick, tasks = [] }) {
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 406.05 343.41" width="100%">
      {/* TODO: Agregar grupos de espacios interactivos aquí */}
      {/* Cada espacio debe tener:
          - Un <g> o elemento SVG (polygon, rect, path, etc.)
          - className={getRoomClassName('NombreEspacio', selectedRoom)}
          - onClick={() => onRoomClick('NombreEspacio')}
      */}
      <g id="PisosEspacios">
        {/* Espacios interactivos aquí */}
      </g>
      
      {/* Capas estáticas (no interactivas) */}
      <g id="Muros" className="fill-none stroke-blue pointer-events-none">
        {/* TODO: Copiar SVG de muros desde p1.jsx */}
      </g>
      
      <g id="Estructura" className="pointer-events-none" fill="#f0f">
        {/* TODO: Copiar SVG de estructura desde p1.jsx */}
      </g>
      
      <g id="Ventanas" className="fill-none stroke-aqua pointer-events-none">
        {/* TODO: Copiar SVG de ventanas desde p1.jsx */}
      </g>
      
      <g id="Puertas" className="fill-none stroke-lime pointer-events-none">
        {/* TODO: Copiar SVG de puertas desde p1.jsx */}
      </g>
      
      <g id="Muebles" className="fill-none stroke-gray pointer-events-none">
        {/* TODO: Copiar SVG de muebles desde p1.jsx */}
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
