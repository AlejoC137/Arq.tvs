// ARCHIVO: FloorPlanC4P1.jsx - Plano Piso 1 Casa 4

import React, { useMemo } from 'react';

/**
 * Centros (Coordenadas X, Y) y Tamaños de Etiquetas
 */
const ROOM_CENTERS = {
  // --- Habitaciones ---
  CocinaComedor: { x: 258, y: 240 },
  SalaAuxiliar: { x: 90, y: 100 },
  SalaPrincipal: { x: 180, y: 135 },
  BañoServicio: { x: 287, y: 179, size: 'small' },
  HabitacionServicio: { x: 271, y: 167 },
  BañoSocialPiso1: { x: 276, y: 135, size: 'small' },
  Almacen: { x: 314, y: 178, size: 'small' },
  ZonaDeRopas: { x: 314, y: 137 },
  BalconJacuzzi: { x: 90, y: 225 },
  Acceso: { x: 246, y: 70 },
};

/**
 * Etiquetas amigables para mostrar en el plano
 */
const ROOM_LABELS = {
  CocinaComedor: 'CocinaComedor',
  SalaAuxiliar: 'Sala Auxiliar',
  SalaPrincipal: 'Sala Principal',
  BañoServicio: 'Baño Servicio',
  HabitacionServicio: 'Hab. Servicio',
  BañoSocialPiso1: 'Baño Social',
  Almacen: 'Almacén',
  ZonaDeRopas: 'Zona Ropas',
  BalconJacuzzi: 'Balcón/Jacuzzi',
  Acceso: 'Acceso',
};

// IDs de las habitaciones que tienen opacidad
const roomsWithOpacity = [
  'CocinaComedor', 'SalaAuxiliar', 'SalaPrincipal', 'BalconJacuzzi', 'Acceso'
];

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
      {/* Espacios Interactivos */}
      <g id="Espacios">
        <polygon id="CocinaComedor" points="183.37 215.23 255.42 191.21 332.68 191.21 332.68 271.17 327.25 271.17 327.06 273.05 244.93 273.05 244.93 271.17 237.43 271.17 237.43 273.05 186.48 273.05 186.48 271.17 180.86 271.17 180.89 218.04 183.37 215.23"
          className={getRoomClassName('CocinaComedor', selectedRoom)}
          onClick={() => onRoomClick('CocinaComedor')}
        />
        <polygon id="SalaAuxiliar" points="103.23 149.34 105.71 146.53 107.35 147.98 183.43 61 181.96 59.7 188.55 52.19 75.78 52.19 75.78 54.06 70.16 54.06 70.16 147.73 72.04 147.73 72.04 149.61 103.23 149.34"
          className={getRoomClassName('SalaAuxiliar', selectedRoom)}
          onClick={() => onRoomClick('SalaAuxiliar')}
        />
        <polygon id="SalaPrincipal" points="185.07 62.45 183.43 61 107.35 147.98 108.99 149.43 105.26 153.64 176.84 216.96 180.56 212.75 183.37 215.23 255.42 191.21 255.42 127.29 272.39 108.02 266.18 102.75 263.28 106.03 255.33 98.99 252.43 102.27 244.42 95.18 241.23 98.79 191.71 54.98 185.07 62.45"
          className={getRoomClassName('SalaPrincipal', selectedRoom)}
          onClick={() => onRoomClick('SalaPrincipal')}
        />
        <polygon id="BañoServicio" points="294.77 189.34 294.77 168.66 289.77 168.66 289.77 161.52 282.09 161.52 282.09 189.34 294.77 189.34"
          className={getRoomClassName('BañoServicio', selectedRoom)}
          onClick={() => onRoomClick('BañoServicio')}
        />
        <polygon id="HabitacionServicio" points="262.16 189.34 262.16 183.72 257.29 183.72 257.32 150.9 295.36 150.9 295.33 159.65 280.22 159.65 280.22 189.34 262.16 189.34"
          className={getRoomClassName('HabitacionServicio', selectedRoom)}
          onClick={() => onRoomClick('HabitacionServicio')}
        />
        <polygon id="BañoSocialPiso1" points="257.32 149.03 257.32 131.61 265.62 122.26 294.77 122.26 294.77 149.03 257.32 149.03"
          className={getRoomClassName('BañoSocialPiso1', selectedRoom)}
          onClick={() => onRoomClick('BañoSocialPiso1')}
        />
        <polygon id="Almacen" points="328.04 166.52 333.04 166.52 333.04 187.47 327.42 187.47 327.42 189.71 296.64 189.34 296.64 166.52 314.57 166.52 328.04 166.52"
          className={getRoomClassName('Almacen', selectedRoom)}
          onClick={() => onRoomClick('Almacen')}
        />
        <polygon id="ZonaDeRopas" points="314.57 164.64 296.64 164.64 296.64 150.9 304.14 150.9 304.14 122.26 331.17 122.26 331.17 127.88 333.04 127.88 333.04 149.03 328.04 149.03 328.04 150.9 333.04 150.9 333.04 159.65 328.04 159.65 328.04 164.68 314.57 164.64"
          className={getRoomClassName('ZonaDeRopas', selectedRoom)}
          onClick={() => onRoomClick('ZonaDeRopas')}
        />
        <polygon id="BalconJacuzzi" points="100.75 152.14 101.33 151.48 68.29 151.48 26 202.14 141.77 299.9 237.43 299.9 237.43 274.92 178.98 274.92 179.01 220.22 178.67 221.09 100.75 152.14"
          className={getRoomClassName('BalconJacuzzi', selectedRoom)}
          onClick={() => onRoomClick('BalconJacuzzi')}
        />
        <polygon id="Acceso" points="223.02 45.99 209.92 34.4 192.97 53.6 241.06 96.15 244.26 92.53 252.27 99.62 255.17 96.35 263.12 103.38 266.02 100.11 273.52 106.74 274.87 105.21 278.12 108.09 284.75 100.6 268.38 86.12 223.02 45.99"
          className={getRoomClassName('Acceso', selectedRoom)}
          onClick={() => onRoomClick('Acceso')}
        />
      </g>

      {/* --- CAPAS ESTÁTICAS (NO INTERACTIVAS) --- */}
      
      {/* Muros */}
      <g id="_-A0-Muros" data-name="-A0-Muros" className="pointer-events-none" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="333.04 159.65 328.04 159.65 328.04 164.64 328.04 164.64 328.04 166.52 333.04 166.52 333.04 187.47 334.91 187.47 334.91 159.65 333.04 159.65 333.04 159.65"/>
        <polygon points="333.04 150.9 334.91 150.9 334.91 127.88 333.04 127.88 333.04 149.03 328.04 149.03 328.04 150.9 333.04 150.9 333.04 150.9"/>
        <rect x="328.04" y="120.38" width="3.13" height="1.87"/>
        <polygon points="296.64 122.26 296.64 150.9 257.32 150.9 257.29 183.72 255.42 183.72 255.45 146.53 257.32 146.53 257.32 149.03 294.77 149.03 294.77 120.38 306.01 120.38 306.01 122.26 296.64 122.26"/>
        <rect x="197.3" y="51.62" width="1.87" height="15.78" transform="translate(22.3 168.53) rotate(-48.49)"/>
        <polygon points="75.78 50.31 190.84 50.31 189.18 52.19 74.29 52.19 74.29 48.82 68.29 48.82 68.29 54.06 62.04 54.06 62.04 44.06 75.78 44.06 75.78 50.31 75.78 50.31"/>
        <rect x="268.21" y="99.12" width="1.87" height="10.01" transform="translate(12.82 236.71) rotate(-48.5)"/>
        <rect x="257.59" y="95.26" width="1.87" height="10.62" transform="translate(11.9 227.55) rotate(-48.5)"/>
        <rect x="246.71" y="91.43" width="1.87" height="10.7" transform="translate(11.07 218.13) rotate(-48.5)"/>
        <polygon points="296.64 164.64 314.57 164.64 314.57 166.52 296.64 166.52 296.64 189.34 314.93 189.34 314.93 191.21 259.17 191.21 259.17 189.34 260.67 189.34 260.67 186.72 259.17 186.72 259.17 183.72 262.16 183.72 262.16 189.34 280.22 189.34 280.22 159.65 282.09 159.65 282.09 189.34 294.77 189.34 294.77 161.52 289.59 161.52 289.59 159.65 296.64 159.65 296.64 164.64"/>
        <polygon points="256.7 125.83 258.11 127.06 257.29 127.99 257.29 128.79 265.16 119.96 266.56 121.21 267.29 120.38 282.28 120.38 282.28 122.26 265.62 122.26 257.29 131.61 257.29 136.54 255.42 136.54 255.42 127.29 256.7 125.83"/>
        <rect x="306.91" y="273.05" width="20.15" height="1.87" strokeWidth=".71"/>
        <rect x=".35" y=".35" width="405.35" height="342.7"/>
      </g>

      {/* Estructura */}
      <g id="_-A0-Estructura" data-name="-A0-Estructura" className="pointer-events-none" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round">
        <rect x="94.5" y="156.08" width="7.5" height="4.37" transform="translate(-85.39 126.98) rotate(-48.5)"/>
        <polyline points="92.47 161.5 87.5 167.11 90.78 170.01 95.75 164.4"/>
        <rect x="202.05" y="33.58" width="7.5" height="4.37" transform="translate(42.65 166.2) rotate(-48.5)"/>
        <rect x="276.9" y="99.8" width="7.5" height="4.37" transform="translate(18.31 244.6) rotate(-48.5)"/>
        <rect x="270.28" y="107.28" width="7.5" height="4.37" transform="translate(10.47 242.17) rotate(-48.5)"/>
        <rect x="263.66" y="114.77" width="7.5" height="4.37" transform="translate(2.63 239.73) rotate(-48.5)"/>
        <rect x="87.88" y="163.57" width="7.5" height="4.37" transform="translate(-93.23 124.55) rotate(-48.5)"/>
        <polyline points="102.37 156.91 99.09 154.02 94.13 159.63 97.4 162.53"/>
        <rect x="101.12" y="148.6" width="7.5" height="4.37" transform="translate(-77.55 129.41) rotate(-48.5)"/>
        <rect x="162.31" y="229.42" width="7.5" height="4.37" transform="translate(-117.44 202.51) rotate(-48.5)"/>
        <rect x="168.93" y="221.93" width="7.5" height="4.37" transform="translate(-109.6 204.94) rotate(-48.5)"/>
        <rect x="195.43" y="41.06" width="7.5" height="4.37" transform="translate(34.81 163.77) rotate(-48.5)"/>
        <rect x="188.81" y="48.54" width="7.5" height="4.37" transform="translate(26.97 161.33) rotate(-48.5)"/>
        <rect x="182.17" y="56.01" width="7.5" height="4.37" transform="translate(19.14 158.87) rotate(-48.5)"/>
        <rect x="257.03" y="122.25" width="7.5" height="4.37" transform="translate(-5.21 237.3) rotate(-48.5)"/>
        <polyline points="84.19 170.86 82.95 172.26 84.36 173.5 85.6 172.1 84.19 170.86"/>
        <rect x="68.29" y="50.31" width="7.5" height="3.75"/>
        <line x1="178.98" y1="274.92" x2="186.48" y2="274.92" strokeWidth=".71"/>
        <line x1="327.25" y1="274.92" x2="334.74" y2="274.92" strokeWidth=".71"/>
        <line x1="237.43" y1="274.92" x2="244.93" y2="274.92" strokeWidth=".71"/>
        <rect x="175.74" y="214.92" width="7.5" height="3.75" transform="translate(-101.82 207.57) rotate(-48.5)" strokeWidth=".71"/>
        <rect x="327.42" y="187.47" width="7.5" height="3.75" strokeWidth=".71"/>
        <rect x="331.17" y="120.38" width="3.75" height="7.5" strokeWidth=".71"/>
        <rect x="255.42" y="183.72" width="3.75" height="7.5"/>
        <rect x="68.29" y="147.73" width="3.75" height="3.75"/>
        <polyline points="178.98 271.17 178.98 278.67 186.48 278.67 186.48 271.17" strokeWidth=".71"/>
        <polyline points="327.25 271.17 327.25 278.67 334.74 278.67 334.74 271.17" strokeWidth=".71"/>
        <polyline points="237.43 271.17 237.43 278.67 244.93 278.67 244.93 271.17" strokeWidth=".71"/>
        <line x1="244.93" y1="271.17" x2="237.43" y2="271.17" strokeWidth=".71"/>
        <line x1="334.74" y1="271.17" x2="327.25" y2="271.17" strokeWidth=".71"/>
        <line x1="186.48" y1="271.17" x2="178.98" y2="271.17" strokeWidth=".71"/>
        <rect x=".35" y=".35" width="405.35" height="342.7"/>
      </g>

      {/* Ventanas */}
      <g id="_-A0-Ventanas" data-name="-A0-Ventanas" className="pointer-events-none" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71">
        <polygon points="105.26 153.64 104.02 155.04 175.6 218.36 176.84 216.96 105.26 153.64 105.26 153.64"/>
        <rect x="68.29" y="54.06" width="1.87" height="93.67"/>
        <polygon points="72.04 149.61 103.53 149.61 101.87 151.48 72.04 151.48 72.04 149.61"/>
        <rect x="180.47" y="273.05" width="56.96" height="1.88"/>
        <rect x="244.93" y="273.05" width="61.98" height="1.87"/>
        <polygon points="332.68 191.21 334.91 191.21 334.74 271.17 332.68 271.17 332.68 191.21"/>
        <rect x="333.04" y="127.88" width="1.87" height="59.59"/>
        <polygon points="180.86 271.17 178.98 271.17 178.98 220.19 180.86 218.07 180.86 271.17"/>
        <rect x="306.01" y="120.38" width="22.03" height="1.87"/>
        <rect x="282.28" y="120.38" width="12.49" height="1.87"/>
        <rect x="209.05" y="62.1" width="1.87" height="15.6" transform="translate(18.49 180.86) rotate(-48.5)"/>
        <rect x=".35" y=".35" width="405.35" height="342.7"/>
      </g>

      {/* Frame */}
      <g id="Frame" className="pointer-events-none">
        <rect id="Frame-2" data-name="Frame" x=".35" y=".35" width="405.35" height="342.7" fill="none" stroke="#ff7f00" strokeLinecap="round" strokeLinejoin="round"/>
      </g>

      {/* --- INICIO: Capa de Etiquetas Dinámicas --- */}
      <g id="Capa_Labels">
        {Object.keys(ROOM_CENTERS).map(roomId => (
          <RoomLabel
            key={roomId}
            roomId={roomId}
            count={taskCountByRoom[roomId] || 0}
            isSelected={selectedRoom === roomId}
          />
        ))}
      </g>
      {/* --- FIN: Capa de Etiquetas Dinámicas --- */}

    </svg>
  );
}
