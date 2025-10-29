// ARCHIVO: FloorPlan2Enhanced.jsx (Versión mejorada con contadores y colores personalizables)

import React, { useMemo } from 'react';

// IDs de las habitaciones que tienen opacidad en tu SVG
const roomsWithOpacity = [
  'HabitacionAuxiliar2', 
  'TerrazaHabitacionPrincipalPiso2', 
  'ClostHabitacionAuxiliar'
];

/**
 * Configuración de colores por estado de tareas
 * Puedes personalizar estos colores según tus necesidades
 */
const TASK_STATUS_COLORS = {
  none: {
    fill: 'fill-gray-100',
    hover: 'hover:fill-gray-200',
    selected: 'fill-gray-300'
  },
  low: {  // 1-2 tareas
    fill: 'fill-green-100',
    hover: 'hover:fill-green-200',
    selected: 'fill-green-400'
  },
  medium: {  // 3-5 tareas
    fill: 'fill-yellow-100',
    hover: 'hover:fill-yellow-200',
    selected: 'fill-yellow-400'
  },
  high: {  // 6+ tareas
    fill: 'fill-orange-100',
    hover: 'hover:fill-orange-200',
    selected: 'fill-orange-400'
  },
  critical: {  // 10+ tareas
    fill: 'fill-red-100',
    hover: 'hover:fill-red-200',
    selected: 'fill-red-400'
  }
};

/**
 * Determina el nivel de intensidad según la cantidad de tareas
 */
const getTaskLevel = (count) => {
  if (count === 0) return 'none';
  if (count <= 2) return 'low';
  if (count <= 5) return 'medium';
  if (count <= 9) return 'high';
  return 'critical';
};

/**
 * Función para asignar clases de Tailwind dinámicamente
 */
const getRoomClassName = (roomId, selectedRoom, taskCount = 0) => {
  const baseClasses = "stroke-gray-900 stroke-[1.5px] cursor-pointer transition-all duration-200";
  const opacityClass = roomsWithOpacity.includes(roomId) ? 'opacity-50' : 'opacity-100';
  
  const level = getTaskLevel(taskCount);
  const colors = TASK_STATUS_COLORS[level];

  if (selectedRoom === roomId) {
    return `${baseClasses} ${colors.selected} ${opacityClass} drop-shadow-lg`;
  }
  
  return `${baseClasses} ${colors.fill} ${colors.hover} ${opacityClass}`;
};

/**
 * Coordenadas centrales aproximadas para cada habitación
 * Estas se usan para posicionar los badges con el contador
 */
const ROOM_CENTERS = {
  'HabitacionAuxiliar1': { x: 197, y: 100 },
  'VestierHabitacionAuxiliar1': { x: 197, y: 153 },
  'EstudioPiso2': { x: 295, y: 157 },
  'HallPiso2': { x: 275, y: 116 },
  'HabitacionPrincipalPiso2': { x: 357, y: 125 },
  'ClosetHabitacionPrincipalPiso2': { x: 357, y: 160 },
  'HabitacionAuxiliar2': { x: 275, y: 51 },
  'TerrazaHabitacionPrincipalPiso2': { x: 376, y: 84 },
  'BañoHabitacionAuxiliar': { x: 328, y: 53 },
  'ClostHabitacionAuxiliar': { x: 306, y: 84 },
  'BañoHabitacionPrincipalPiso2': { x: 357, y: 180 },
  'BañoHabitacionAuxiliar1': { x: 200, y: 181 }
};

/**
 * Nombres amigables para mostrar en las etiquetas
 */
const ROOM_LABELS = {
  'HabitacionAuxiliar1': 'Hab. Aux. 1',
  'VestierHabitacionAuxiliar1': 'Vestier',
  'EstudioPiso2': 'Estudio',
  'HallPiso2': 'Hall',
  'HabitacionPrincipalPiso2': 'Hab. Principal',
  'ClosetHabitacionPrincipalPiso2': 'Closet',
  'HabitacionAuxiliar2': 'Hab. Aux. 2',
  'TerrazaHabitacionPrincipalPiso2': 'Terraza',
  'BañoHabitacionAuxiliar': 'Baño Aux.',
  'ClostHabitacionAuxiliar': 'Closet Aux.',
  'BañoHabitacionPrincipalPiso2': 'Baño Princ.',
  'BañoHabitacionAuxiliar1': 'Baño Aux. 1'
};

/**
 * Componente para mostrar etiqueta con nombre y contador de tareas
 */
const RoomLabel = ({ roomId, count, isSelected }) => {
  const position = ROOM_CENTERS[roomId];
  if (!position) return null;

  const label = ROOM_LABELS[roomId] || roomId;
  const level = getTaskLevel(count);
  
  // Colores del texto según el nivel
  const textColors = {
    none: 'fill-gray-600',
    low: 'fill-green-700',
    medium: 'fill-yellow-800',
    high: 'fill-orange-700',
    critical: 'fill-red-700'
  };

  const bgColors = {
    none: 'fill-white',
    low: 'fill-green-50',
    medium: 'fill-yellow-50',
    high: 'fill-orange-50',
    critical: 'fill-red-50'
  };

  const textColor = textColors[level];
  const bgColor = bgColors[level];
  const scale = isSelected ? 1.15 : 1;

  // Calcular ancho del rectángulo según el texto
  const textWidth = label.length * 5.5 + 20;
  const rectWidth = Math.max(textWidth, 60);

  return (
    <g transform={`translate(${position.x}, ${position.y}) scale(${scale})`} className="pointer-events-none">
      {/* Rectángulo de fondo con sombra */}
      <rect
        x={-rectWidth/2}
        y="-12"
        width={rectWidth}
        height="24"
        rx="4"
        className={`${bgColor} stroke-gray-700 stroke-[0.8px] transition-all duration-200`}
        style={{ 
          filter: isSelected ? 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          opacity: 0.95
        }}
      />
      
      {/* Nombre del espacio */}
      <text
        x="0"
        y="-2"
        textAnchor="middle"
        className={`${textColor} font-bold transition-all duration-200`}
        style={{ fontSize: '9px' }}
      >
        {label}
      </text>
      
      {/* Contador de tareas (si hay tareas) */}
      {count > 0 && (
        <text
          x="0"
          y="8"
          textAnchor="middle"
          className={`${textColor} font-bold transition-all duration-200`}
          style={{ fontSize: '11px' }}
        >
          {count} {count === 1 ? 'tarea' : 'tareas'}
        </text>
      )}
    </g>
  );
};

export function FloorPlan2({ selectedRoom, onRoomClick, tasks = [] }) {
  // Contar tareas por espacio
  const taskCountByRoom = useMemo(() => {
    const counts = {};
    
    tasks.forEach(task => {
      // Contar por campo espacio directo
      if (task.espacio) {
        counts[task.espacio] = (counts[task.espacio] || 0) + 1;
      }
      
      // También contar por acciones que tengan espacio
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396.89 192.97" width="100%">
      {/* Capa 2: Habitaciones (Interactivas) */}
      <g id="Capa_2">
        <polygon id="HabitacionAuxiliar1" points="229.92 104.76 229.92 76.21 165.47 76.21 165.47 92.38 169.8 92.37 169.8 124.45 229.92 124.45 229.92 117.15 229.92 104.76"
          fillRule="evenodd"
          className={getRoomClassName('HabitacionAuxiliar1', selectedRoom, taskCountByRoom['HabitacionAuxiliar1'])}
          onClick={() => onRoomClick('HabitacionAuxiliar1')}
        />
        <rect id="VestierHabitacionAuxiliar1" x="165.47" y="133.75" width="64.45" height="38.68"
          className={getRoomClassName('VestierHabitacionAuxiliar1', selectedRoom, taskCountByRoom['VestierHabitacionAuxiliar1'])}
          onClick={() => onRoomClick('VestierHabitacionAuxiliar1')}
        />
        <rect id="EstudioPiso2" x="273.25" y="127.9" width="45.05" height="59.5"
          className={getRoomClassName('EstudioPiso2', selectedRoom, taskCountByRoom['EstudioPiso2'])}
          onClick={() => onRoomClick('EstudioPiso2')}
        />
        <polygon id="HallPiso2" points="231.78 132.24 231.78 101 318.29 101 318.29 127.9 262.77 127.9 262.77 132.24 231.78 132.24"
          fillRule="evenodd"
          className={getRoomClassName('HallPiso2', selectedRoom, taskCountByRoom['HallPiso2'])}
          onClick={() => onRoomClick('HallPiso2')}
        />
        <polygon id="HabitacionPrincipalPiso2" points="394.98 149.65 320.15 149.65 320.15 113.4 318.29 113.4 318.29 101 355.73 101 355.73 97.7 394.98 97.7 394.98 149.65"
          fillRule="evenodd"
          className={getRoomClassName('HabitacionPrincipalPiso2', selectedRoom, taskCountByRoom['HabitacionPrincipalPiso2'])}
          onClick={() => onRoomClick('HabitacionPrincipalPiso2')}
        />
        <polygon id="ClosetHabitacionPrincipalPiso2" points="394.98 171.16 320.15 170.37 320.15 149.65 338.41 149.66 338.37 158.94 394.98 158.94 394.98 171.16"
          fillRule="evenodd"
          className={getRoomClassName('ClosetHabitacionPrincipalPiso2', selectedRoom, taskCountByRoom['ClosetHabitacionPrincipalPiso2'])}
          onClick={() => onRoomClick('ClosetHabitacionPrincipalPiso2')}
        />
        <polygon id="HabitacionAuxiliar2" points="231.78 101 256.57 101 256.57 74.35 258.43 74.35 318.91 74.35 318.91 72.48 318.91 72.49 318.91 58.01 315.32 58.01 315.32 1.84 231.78 1.84 231.78 101"
          fillRule="evenodd"
          className={getRoomClassName('HabitacionAuxiliar2', selectedRoom, taskCountByRoom['HabitacionAuxiliar2'])}
          onClick={() => onRoomClick('HabitacionAuxiliar2')}
        />
        <polygon id="TerrazaHabitacionPrincipalPiso2" points="394.98 95.85 394.98 95.84 396.88 95.84 396.88 72.49 355.73 72.49 355.73 74.35 355.73 76.21 355.73 91.7 355.73 95.85 394.98 95.85"
          fillRule="evenodd"
          className={getRoomClassName('TerrazaHabitacionPrincipalPiso2', selectedRoom, taskCountByRoom['TerrazaHabitacionPrincipalPiso2'])}
          onClick={() => onRoomClick('TerrazaHabitacionPrincipalPiso2')}
        />
        <polygon id="BañoHabitacionAuxiliar" points="320.77 31.59 320.77 58.01 318.91 58.01 318.91 74.35 321.59 74.35 321.59 72.49 334.78 72.49 334.78 58.01 336.64 58.01 336.64 74.35 353.87 74.35 353.87 59.87 346.19 59.87 346.19 58.01 346.42 58.01 346.42 31.59 320.77 31.59"
          fillRule="evenodd"
          className={getRoomClassName('BañoHabitacionAuxiliar', selectedRoom, taskCountByRoom['BañoHabitacionAuxiliar'])}
          onClick={() => onRoomClick('BañoHabitacionAuxiliar')}
        />
        <rect id="ClostHabitacionAuxiliar" x="258.43" y="76.21" width="95.44" height="15.49"
          className={getRoomClassName('ClostHabitacionAuxiliar', selectedRoom, taskCountByRoom['ClostHabitacionAuxiliar'])}
          onClick={() => onRoomClick('ClostHabitacionAuxiliar')}
        />
        <polygon id="BañoHabitacionPrincipalPiso2" points="394.98 173.02 374.57 173.02 374.57 171.16 334.23 171.16 334.23 173.02 320.15 173.02 320.15 187.39 343.4 187.39 343.4 180.55 376.43 180.55 376.43 187.39 393.16 187.39 393.16 184.29 394.98 184.29 394.98 173.02"
          fillRule="evenodd"
          className={getRoomClassName('BañoHabitacionPrincipalPiso2', selectedRoom, taskCountByRoom['BañoHabitacionPrincipalPiso2'])}
          onClick={() => onRoomClick('BañoHabitacionPrincipalPiso2')}
        />
        <polygon id="BañoHabitacionAuxiliar1" points="172.28 174.29 172.28 187.39 228.06 187.38 228.06 185.53 229.92 185.53 229.92 174.29 213.54 174.29 213.54 172.43 191 172.43 191 174.29 172.28 174.29"
          fillRule="evenodd"
          className={getRoomClassName('BañoHabitacionAuxiliar1', selectedRoom, taskCountByRoom['BañoHabitacionAuxiliar1'])}
          onClick={() => onRoomClick('BañoHabitacionAuxiliar1')}
        />
      </g>
      
      {/* --- CAPAS ESTÁTICAS (NO INTERACTIVAS) --- */}
      
      {/* Capa 3: Muros (Estáticos) - PUEDES CAMBIAR EL COLOR AQUÍ */}
      <g id="Capa_3" className="fill-gray-700 pointer-events-none" fill="#636466">
        <rect id="Muros" x="229.94" y="76.21" width="1.86" height="28.55"/>
        <polygon id="Muros-2" points="355.74 76.21 355.74 74.35 353.89 74.35 336.65 74.35 336.65 58.01 334.79 58.01 334.79 72.49 329.04 72.49 329.04 74.35 329.04 76.21 355.74 76.21" fillRule="evenodd"/>
        <rect id="Muros-3" x="256.58" y="74.35" width="1.86" height="24.79"/>
        <rect id="Muros-4" x="374.58" y="180.55" width="1.86" height="6.84"/>
        <rect id="Muros-5" x="346.45" y="26.63" width="9.3" height="4.96"/>
        <rect id="Muros-6" x="346.2" y="58.01" width="7.68" height="1.86"/>
        <rect id="Muros-7" x="228.08" y="189.25" width="3.72" height="3.72"/>
        <rect id="Muros-8" x="229.94" y="35.47" width="1.86" height="40.74"/>
        <rect id="Muros-9" x="262.78" y="189.25" width="3.72" height="3.72"/>
        <rect id="Muros-10" x="338.39" y="149.65" width="58.51" height="1.86"/>
        <polygon id="Muros-11" points="320.17 113.4 318.31 113.4 318.31 189.25 320.17 189.25 320.17 187.39 320.17 113.4" fillRule="evenodd"/>
        <polygon id="Muros-12" points="64.46 164.46 57.03 164.46 57.03 165.45 62.98 189.25 64.46 189.25 64.46 175.88 64.46 175.88 64.46 175.08 64.46 174.66 64.46 164.46" fillRule="evenodd"/>
        <polygon id="Muros-13" points="7.45 165.45 7.45 164.46 .01 164.46 .01 189.25 1.5 189.25 7.45 165.45" fillRule="evenodd"/>
        <polygon id="Muros-14" points="231.79 147.11 231.79 143.39 231.79 139.67 231.79 135.95 231.79 132.24 231.79 117.15 229.94 117.15 229.94 185.53 231.79 185.53 231.79 165.7 231.79 161.98 231.79 158.27 231.79 154.55 231.79 150.83 231.79 147.11" fillRule="evenodd"/>
        <path id="Muros-15" d="m315.83,26.63h3.1v1.24h-3.1v-1.24m0-24.79h1.24v24.79h-1.24V1.84Z" fillRule="evenodd"/>
        <rect id="Muros-16" x="213.56" y="172.43" width="16.38" height="1.86"/>
        <rect id="Muros-17" x="184.13" y="151.42" width="33.79" height="1.86"/>
        <rect id="Muros-18" x="272.7" y="187.39" width="7.56" height="1.86"/>
        <rect id="Muros-19" x="318.93" y="26.63" width="1.86" height="31.38"/>
        <path id="Muros-20" d="m334.25,187.39h0s-14.08,0-14.08,0h0v1.86h14.08s0-1.86,0-1.86m0-16.24h-14.08v1.86h14.08v-1.86m62.64,0h-.35s-.8,0-.8,0h-.74s-20.42,0-20.42,0v1.86h20.42s0,14.38,0,14.38h-20.42s0,1.86,0,1.86h22.31s0-1.86,0-1.86v-16.24Z" fillRule="evenodd"/>
        <rect id="Muros-21" x="262.78" y="131.62" width="1.86" height="53.91"/>
        <polygon id="Muros-22" points="172.3 174.29 191.01 174.29 191.01 172.43 165.48 172.43 165.48 126.31 217.91 126.31 217.91 124.45 165.48 124.45 165.48 97.33 166.1 97.33 166.1 92.38 165.48 92.38 165.48 74.72 163.62 74.72 163.62 76.21 163.62 172.43 163.62 175.59 163.62 189.25 172.3 189.25 172.3 174.29" fillRule="evenodd"/>
        <polygon id="Muros-23" points="355.74 91.7 354.56 91.7 353.88 91.7 353.88 99.14 355.74 99.14 355.74 96.94 355.74 96.94 355.74 96.14 355.74 91.7" fillRule="evenodd"/>
        <rect id="Muros-24" x="256.58" y="99.14" width="99.16" height="1.86"/>
        <rect id="Muros-25" x="395" y="131.62" width="1.89" height="18.03"/>
        <rect id="Muros-26" x="318.93" y="74.35" width="2.67" height="1.86"/>
      </g>
      
      {/* Capa 4: Estructura (Estática) - PUEDES CAMBIAR EL COLOR AQUÍ */}
      <g id="Capa_4" className="pointer-events-none fill-pink-400" fill="#f0f">
        <path id="Estructura" d="m393.17,127.92h3.72v3.72h-3.72v-3.72M317.06,9.3h3.72V1.86h-3.72v7.44M7.44,164.48v-3.72H0v3.72h7.44m57.02,0v-3.72h-7.44v3.72h7.44m163.61,21.07h3.72v3.72h-3.72v-3.72M51.07,76.23v-3.72h-9.92v3.72h9.92m114.99,113.04h3.72v-6.2h-3.72v6.2m6.24-57.64v-3.72h-6.2v3.72h6.2m57.64-96.15h3.72v-7.44h-3.72v7.44m166.96,56.91h-3.72v7.44h3.72v-7.44m0,89.44h-3.72v7.44h3.72v-7.44m-67.85-105.6v-3.72h-7.44v3.72h7.44m-122.96,0v-3.72h-9.92v3.72h9.92m66.62,19.88v-3.72h-9.92v3.72h9.92m0,35.52v-3.72h-9.92v3.72h9.92m0,57.63v-3.72h-9.92v3.72h9.92Z" fillRule="evenodd"/>
      </g>
      
      {/* Capa 5: Ventanas (Estáticas) - PUEDES CAMBIAR EL COLOR AQUÍ */}
      <g id="Capa_5" className="fill-none stroke-blue-400 pointer-events-none stroke-[2px]" fill="none" stroke="#00aeef">
        <polyline id="Ventanas" points="394.99 151.52 396.88 151.52 396.88 171.17 394.99 171.17 394.99 151.52" fillRule="evenodd"/>
        <polyline id="Ventanas-2" points="318.92 1.86 231.78 1.86 231.78 0 318.92 0 318.92 1.86" fillRule="evenodd"/>
        <polyline id="Ventanas-3" points="353.87 76.23 355.73 76.23 355.73 91.72 353.87 91.72 353.87 76.23" fillRule="evenodd"/>
        <polyline id="Ventanas-4" points="320.78 0 353.87 0 353.87 1.86 320.78 1.86 320.78 0" fillRule="evenodd"/>
        <polyline id="Ventanas-5" points="355.73 31.61 353.87 31.61 353.87 74.37 355.73 74.37 355.73 31.61" fillRule="evenodd"/>
        <polyline id="Ventanas-6" points="353.87 26.65 355.73 26.65 355.73 0 353.87 0 353.87 26.65" fillRule="evenodd"/>
        <polyline id="Ventanas-7" points="355.73 97.72 393.16 97.72 393.16 95.87 355.73 95.87 355.73 97.72" fillRule="evenodd"/>
        <polyline id="Ventanas-8" points="396.88 127.92 394.99 127.92 394.99 99.83 396.88 99.83 396.88 127.92" fillRule="evenodd"/>
        <polyline id="Ventanas-9" points="334.24 187.41 374.57 187.41 374.57 189.27 334.24 189.27 334.24 187.41" fillRule="evenodd"/>
        <polyline id="Ventanas-10" points="280.25 187.41 318.3 187.41 318.3 189.27 280.25 189.27 280.25 187.41" fillRule="evenodd"/>
        <polyline id="Ventanas-11" points="165.47 74.74 196.16 74.72 196.16 76.2 165.47 76.23 165.47 74.74" fillRule="evenodd"/>
        <polyline id="Ventanas-12" points="64.45 174.31 163.61 174.31 163.61 176.17 64.45 176.17 64.45 174.31" fillRule="evenodd"/>
        <polyline id="Ventanas-13" points="5.58 160.76 7.44 160.76 7.44 76.23 41.15 76.23 41.15 74.37 5.58 74.37 5.58 160.76" fillRule="evenodd"/>
        <polyline id="Ventanas-14" points="231.78 189.27 231.78 187.41 262.77 187.41 262.77 189.27 231.78 189.27" fillRule="evenodd"/>
        <polyline id="Ventanas-15" points="172.29 189.27 172.29 187.41 228.07 187.41 228.07 189.27 172.29 189.27" fillRule="evenodd"/>
        <polyline id="Ventanas-16" points="231.78 28.05 231.78 0 229.93 0 229.93 28.05 231.78 28.05" fillRule="evenodd"/>
        <polyline id="Ventanas-17" points="51.07 76.23 51.07 74.74 163.61 74.74 163.61 76.23 51.07 76.23" fillRule="evenodd"/>
      </g>

      {/* Capa 6: Etiquetas con Nombres y Contadores (NUEVA) */}
      <g id="Capa_RoomLabels">
        {Object.keys(ROOM_CENTERS).map(roomId => (
          <RoomLabel
            key={roomId}
            roomId={roomId}
            count={taskCountByRoom[roomId] || 0}
            isSelected={selectedRoom === roomId}
          />
        ))}
      </g>
    </svg>
  );
}
