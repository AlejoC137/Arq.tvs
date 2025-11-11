// ARCHIVO: FloorPlanC4P2.jsx - Plano Piso 2 Casa 4

import React, { useMemo } from 'react';

/**
 * Centros (Coordenadas X, Y) y Tamaños de Etiquetas
 */
const ROOM_CENTERS = {
  // --- Habitaciones ---
  VestierHabitacionAuxiliar2: { x: 296, y: 244 },
  BañoHabitacionAuxiliar2: { x: 285, y: 283 },
  HabitacionAuxiliar2: { x: 325, y: 257 },
  HallPiso2: { x: 295, y: 207 },
  VestierHabitacionPrincipalPiso2: { x: 238, y: 160 },
  BañoHabitacionAuxiliar1: { x: 289, y: 146, size: 'small' },
  BalconHabitacionPrincipalPiso2: { x: 205, y: 301 },
  BañoHabitacionPrincipalPiso2: { x: 251, y: 267 },
  HabitacionPrincipalPiso2: { x: 224, y: 240 },
  HabitacionAuxiliar1: { x: 313, y: 153 },
  Escaleras: { x: 295, y: 199 },
};

/**
 * Etiquetas amigables para mostrar en el plano
 */
const ROOM_LABELS = {
  VestierHabitacionAuxiliar2: 'Vestier Aux 2',
  BañoHabitacionAuxiliar2: 'Baño Aux 2',
  HabitacionAuxiliar2: 'Hab. Aux 2',
  HallPiso2: 'Hall',
  VestierHabitacionPrincipalPiso2: 'Vestier Ppal',
  BañoHabitacionAuxiliar1: 'Baño Aux 1',
  BalconHabitacionPrincipalPiso2: 'Balcón Ppal',
  BañoHabitacionPrincipalPiso2: 'Baño Ppal',
  HabitacionPrincipalPiso2: 'Hab. Principal',
  HabitacionAuxiliar1: 'Hab. Aux 1',
  Escaleras: 'Escaleras',
};

// IDs de las habitaciones que tienen opacidad
const roomsWithOpacity = [
  'HabitacionPrincipalPiso2', 'HabitacionAuxiliar1', 'HabitacionAuxiliar2', 
  'BalconHabitacionPrincipalPiso2', 'HallPiso2'
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
 * Componente Principal del Plano (Piso 2 - Casa 4)
 */
export function FloorPlanC4P2({ selectedRoom, onRoomClick, tasks = [] }) {
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
        <rect id="VestierHabitacionAuxiliar2" x="284.28" y="235.32" width="23.43" height="18.76"
          className={getRoomClassName('VestierHabitacionAuxiliar2', selectedRoom)}
          onClick={() => onRoomClick('VestierHabitacionAuxiliar2')}
        />
        <polygon id="BañoHabitacionAuxiliar2" points="295.5 310.52 295.52 256.19 284.28 256.19 284.28 274.92 276.78 274.92 276.78 292.94 278.02 292.94 278.02 310.52 295.5 310.52"
          className={getRoomClassName('BañoHabitacionAuxiliar2', selectedRoom)}
          onClick={() => onRoomClick('BañoHabitacionAuxiliar2')}
        />
        <path id="HabitacionAuxiliar2" d="M297.39,271.18v20.62h1.24s0,18.72,0,18.72h53.16s0-82.46,0-82.46h-32.22c-1.38,0-2.5,1.12-2.5,2.5h0v21.3s0,.03,0,.04c-.02,2.39-1.98,4.32-4.37,4.3h-15.31v14.99Z"
          className={getRoomClassName('HabitacionAuxiliar2', selectedRoom)}
          onClick={() => onRoomClick('HabitacionAuxiliar2')}
        />
        <polygon id="HallPiso2" points="259.17 207.45 330.37 207.45 330.37 191.21 351.78 191.21 351.78 226.19 259.17 226.19 259.17 207.45"
          className={getRoomClassName('HallPiso2', selectedRoom)}
          onClick={() => onRoomClick('HallPiso2')}
        />
        <path id="VestierHabitacionPrincipalPiso2" d="M250.42,205.58h-50.72s68.74-77.7,68.74-77.7h5.73s0,55.84,0,55.84h-18.75c-2.76,0-5,2.24-5,5,0,.04,0,.08,0,.12v16.74Z"
          className={getRoomClassName('VestierHabitacionPrincipalPiso2', selectedRoom)}
          onClick={() => onRoomClick('VestierHabitacionPrincipalPiso2')}
        />
        <polygon id="BañoHabitacionAuxiliar1" points="283.55 134.75 283.55 122.26 294.77 122.26 294.77 123.75 296.64 123.75 296.64 122.26 304.78 122.26 304.78 170.73 291.03 170.73 291.04 149.74 283.55 149.74 283.55 134.75"
          className={getRoomClassName('BañoHabitacionAuxiliar1', selectedRoom)}
          onClick={() => onRoomClick('BañoHabitacionAuxiliar1')}
        />
        <rect id="BalconHabitacionPrincipalPiso2" x="180.86" y="292.39" width="48.49" height="18.11"
          className={getRoomClassName('BalconHabitacionPrincipalPiso2', selectedRoom)}
          onClick={() => onRoomClick('BalconHabitacionPrincipalPiso2')}
        />
        <path id="BañoHabitacionPrincipalPiso2" d="M231.22,310.52v-33.1s0-.06,0-.08c.05-1.38,1.2-2.46,2.58-2.41h3.62v3.75h17.24v-28.74h1.87s0-21.86,0-21.86h18.36v13.72s-3.37,0-3.37,0v6.27s-4.1,0-4.1,0v24.99h6.2v6.25h1.26s0,31.23,0,31.23h-43.68Z"
          className={getRoomClassName('BañoHabitacionPrincipalPiso2', selectedRoom)}
          onClick={() => onRoomClick('BañoHabitacionPrincipalPiso2')}
        />
        <path id="HabitacionPrincipalPiso2" d="M180.86,290.63v-72.55s2.52-2.84,2.52-2.84c3.63-4.09,8.54-6.84,13.92-7.78h60s0,18.74,0,18.74c-1.17-.25-2.32.49-2.57,1.65-.03.14-.05.28-.05.43v42.9h-17.24c-4.46,0-8.08,3.62-8.08,8.08v11.37h-48.49Z"
          className={getRoomClassName('HabitacionPrincipalPiso2', selectedRoom)}
          onClick={() => onRoomClick('HabitacionPrincipalPiso2')}
        />
        <path id="HabitacionAuxiliar1" d="M289.79,172.23h15.76c.81,1.17,2.14,1.87,3.57,1.87h4.41c1.19,0,2.16-.97,2.16-2.16s-.96-2.16-2.16-2.16h-2.54s-.02,0-.02,0c-2.39-.01-4.32-1.96-4.31-4.36v-43.17h24.52v7.5h3.75v-7.5h16.86s0,67.08,0,67.08h-15.35c-.05-.88-.66-1.64-1.51-1.87h-21.4v1.87h-23.73v-17.11Z"
          className={getRoomClassName('HabitacionAuxiliar1', selectedRoom)}
          onClick={() => onRoomClick('HabitacionAuxiliar1')}
        />
        <rect id="Escaleras" x="259.17" y="191.21" width="71.2" height="16.24"
          className={getRoomClassName('Escaleras', selectedRoom)}
          onClick={() => onRoomClick('Escaleras')}
        />
      </g>

      {/* --- CAPAS ESTÁTICAS (NO INTERACTIVAS) --- */}
      
      {/* Muros */}
      <g id="_-A0-Muros" data-name="-A0-Muros" className="pointer-events-none" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round">
        <path d="M244.97,278.67v-7.5c2.07,0,3.75,1.68,3.75,3.75,0,2.07-1.68,3.75-3.75,3.75h0Z"/>
        <rect x="229.35" y="300.49" width="1.87" height="2.5"/>
        <polygon points="298.63 312.4 298.5 312.4 295.52 312.4 295.52 271.18 297.39 271.18 297.39 292.42 298.01 292.42 298.01 291.8 298.63 291.8 298.63 312.4 298.63 312.4"/>
        <path d="M336.43,189.34c-.05-.88-.66-1.64-1.51-1.87v3.75h1.51v-1.87Z"/>
        <path d="M320.78,273.52c1.34-.31,2.19-1.65,1.88-2.99-.31-1.34-1.65-2.19-2.99-1.88l-7.31,1.68c-1.34.31-2.19,1.65-1.88,2.99.31,1.34,1.65,2.19,2.99,1.88l7.31-1.68Z"/>
        <path d="M334.74,275.55c1.38,0,2.5-1.12,2.5-2.5,0-1.38-1.12-2.5-2.5-2.5h-7.5c-1.38,0-2.5,1.12-2.5,2.5s1.12,2.5,2.5,2.5h7.5Z"/>
        <path d="M276.78,256.19v14.99h7.5s0,3.74,0,3.74h-1.93v-1.87h-5.57v19.88s0,0,0,0h1.24s0,5.5,0,5.5h-1.24v6.26h1.24v7.69h-3.11v-7.48h-.63v.62h-.64v-1.25h1.26v-24.99h-1.26s0-6.25,0-6.25h-6.2v-1.87s7.47,0,7.47,0v-21.25h-7.47s0-1.87,0-1.87h4.1v-6.27s3.37,0,3.37,0v-13.72h-18.36s0,21.86,0,21.86h-1.87v-21.62s0-.02,0-.04c0-1.15.93-2.08,2.08-2.08h77.55v1.87h-14.73c-1.38,0-2.5,1.12-2.5,2.5v21.26s0,.05,0,.08c-.02,2.39-1.98,4.32-4.37,4.3h-17.18v-1.87h17.18c1.36.02,2.48-1.06,2.5-2.42,0-.02,0-.05,0-.07v-23.76h-38.42s0,26.25,0,26.25h7.5s0,1.87,0,1.87h-7.5Z"/>
        <path d="M259.17,191.21v16.24h-13.62s0-1.87,0-1.87h11.74v-16.24h3.37v-4.12h-1.5s0-1.5,0-1.5h3s0,5.62,0,5.62h18.25v-67.08h-16.17s-73.72,83.32-73.72,83.32h40.03v1.88h-33.26c-5.58.34-10.71,3.21-13.92,7.78l-2.04-1.8,83.19-94.03,1.1.98h16.66v14.99h.62v-.62h.64v35.97s7.49,0,7.49,0v1.5h-6.25c-1.38,0-2.5,1.12-2.5,2.5v12.12c0,1.38,1.12,2.5,2.5,2.5h29.86v-.63h-1.12v-1.25h13.9v3.75h-68.26Z"/>
        <path d="M231.22,277.42v14.97h-1.87v-13.14c0-4.46,3.62-8.08,8.08-8.08v3.75c-1.21,0-2.42,0-3.62,0-1.33.14-2.4,1.17-2.58,2.5h0Z"/>
        <polygon points="231.22 311.09 231.22 312.4 229.35 312.38 229.35 311.09 231.22 311.09"/>
        <rect x="331.17" y="127.88" width="3.75" height="1.87"/>
        <polygon points="334.92 122.26 334.92 120.38 353.66 120.38 353.66 129.75 351.78 129.75 351.78 122.26 334.92 122.26"/>
        <rect x="349.29" y="226.19" width="4.01" height="1.87"/>
        <rect x="197.81" y="51" width="1.87" height="15.78" transform="translate(22.93 168.7) rotate(-48.49)"/>
        <polygon points="74.29 52.19 74.29 48.82 68.29 48.82 68.29 54.06 62.04 54.06 62.04 44.06 75.78 44.06 75.78 50.31 190.84 50.31 189.18 52.19 74.29 52.19 74.29 52.19"/>
        <rect x="268.85" y="98.82" width="1.87" height="9.64" transform="translate(13.4 237.03) rotate(-48.5)"/>
        <rect x="258.51" y="95.2" width="1.87" height="10.24" transform="translate(12.4 228.16) rotate(-48.5)"/>
        <rect x="247.49" y="90.69" width="1.87" height="11.45" transform="translate(11.61 218.59) rotate(-48.5)"/>
        <path d="M304.78,169.73c-.02,2.39,1.9,4.35,4.3,4.37.03,0,.05,0,.08,0h4.37c1.19,0,2.16-.96,2.16-2.16s-.96-2.16-2.16-2.16h-2.54s-.02,0-.03,0c-2.41-.03-4.33-2-4.31-4.41v-43.12h24.52s0-1.87,0-1.87h-36.4s0,3.37,0,3.37h1.87v-1.49h8.14s0,47.51,0,47.51v-.04Z"/>
        <rect x=".35" y=".35" width="405.35" height="342.7"/>
      </g>

      {/* Estructura */}
      <g id="_-A0-Estructura" data-name="-A0-Estructura" className="pointer-events-none" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="84.19 170.86 82.95 172.26 84.36 173.5 85.6 172.1 84.19 170.86"/>
        <rect x="178.98" y="272.92" width="2.75" height="2" strokeWidth=".71"/>
        <rect x="187.66" y="199.73" width="7.5" height="1.85" transform="translate(-85.71 211.05) rotate(-48.5)"/>
        <rect x="194.28" y="192.25" width="7.5" height="1.85" transform="translate(-77.87 213.49) rotate(-48.5)"/>
        <rect x="200.9" y="184.76" width="7.5" height="1.85" transform="translate(-70.03 215.92) rotate(-48.5)"/>
        <rect x="216.31" y="167.54" width="7.5" height="1.85" transform="translate(-51.93 221.65) rotate(-48.5)"/>
        <rect x="222.93" y="160.06" width="7.5" height="1.85" transform="translate(-44.09 224.09) rotate(-48.5)"/>
        <rect x="229.46" y="152.49" width="7.5" height="1.85" transform="translate(-36.22 226.42) rotate(-48.5)"/>
        <rect x="242.8" y="137.6" width="7.5" height="1.85" transform="translate(-20.57 231.39) rotate(-48.5)"/>
        <rect x="249.42" y="130.12" width="7.5" height="1.85" transform="translate(-12.73 233.82) rotate(-48.5)"/>
        <rect x="256.04" y="122.63" width="7.5" height="1.85" transform="translate(-4.89 236.26) rotate(-48.5)"/>
        <rect x="181.04" y="207.22" width="7.5" height="1.85" transform="translate(-93.55 208.62) rotate(-48.5)"/>
        <rect x="94.5" y="156.08" width="7.5" height="4.37" transform="translate(-85.39 126.98) rotate(-48.5)"/>
        <polyline points="92.47 161.5 87.5 167.11 90.78 170.01 95.75 164.4"/>
        <rect x="202.05" y="33.58" width="7.5" height="4.37" transform="translate(42.65 166.2) rotate(-48.5)"/>
        <rect x="87.88" y="163.57" width="7.5" height="4.37" transform="translate(-93.23 124.55) rotate(-48.5)"/>
        <polyline points="102.37 156.91 99.09 154.02 94.13 159.63 97.4 162.53"/>
        <rect x="101.12" y="148.6" width="7.5" height="4.37" transform="translate(-77.55 129.41) rotate(-48.5)"/>
        <rect x="162.31" y="229.42" width="7.5" height="4.37" transform="translate(-117.44 202.51) rotate(-48.5)"/>
        <rect x="168.93" y="221.93" width="7.5" height="4.37" transform="translate(-109.6 204.94) rotate(-48.5)"/>
        <rect x="195.43" y="41.06" width="7.5" height="4.37" transform="translate(34.81 163.77) rotate(-48.5)"/>
        <rect x="188.81" y="48.54" width="7.5" height="4.37" transform="translate(26.97 161.33) rotate(-48.5)"/>
        <rect x="182.17" y="56.01" width="7.5" height="4.37" transform="translate(19.14 158.87) rotate(-48.5)"/>
        <rect x="276.88" y="99.78" width="7.5" height="4.37" transform="translate(18.31 244.58) rotate(-48.5)"/>
        <rect x="263.63" y="114.71" width="7.5" height="4.44" transform="translate(2.63 239.71) rotate(-48.5)"/>
        <rect x="270.25" y="107.23" width="7.5" height="4.44" transform="translate(10.47 242.14) rotate(-48.5)"/>
        <rect x="175.48" y="214.35" width="7.5" height="4.44" transform="translate(-101.73 207.3) rotate(-48.5)"/>
        <rect x="68.29" y="50.31" width="7.5" height="3.75" strokeWidth=".71"/>
        <rect x="327.25" y="271.17" width="7.5" height="3.75" strokeWidth=".71"/>
        <line x1="237.43" y1="274.92" x2="244.93" y2="274.92" strokeWidth=".71"/>
        <rect x="327.42" y="187.47" width="7.5" height="3.75" strokeWidth=".71"/>
        <rect x="331.17" y="120.38" width="3.75" height="7.5" strokeWidth=".71"/>
        <rect x="255.42" y="183.72" width="3.75" height="7.5" strokeWidth=".71"/>
        <rect x="68.29" y="147.73" width="3.75" height="3.75"/>
        <polyline points="237.43 271.17 237.43 278.67 244.93 278.67 244.93 271.17" strokeWidth=".71"/>
        <line x1="244.93" y1="271.17" x2="237.43" y2="271.17" strokeWidth=".71"/>
        <rect x="327.25" y="274.92" width="7.5" height="3.75" strokeWidth=".71"/>
        <rect x=".35" y=".35" width="405.35" height="342.7"/>
      </g>

      {/* Ventanas */}
      <g id="_-A0-Ventanas" data-name="-A0-Ventanas" className="pointer-events-none" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="180.86 272.92 178.98 272.92 178.98 220.19 180.86 218.08 180.86 272.92"/>
        <rect x="282.28" y="120.38" width="12.49" height="1.87"/>
        <rect x="231.22" y="310.52" width="43.68" height="1.87" strokeWidth=".71"/>
        <rect x="278.02" y="310.52" width="17.49" height="1.87" strokeWidth=".71"/>
        <rect x="351.78" y="129.75" width="1.87" height="96.44" strokeWidth=".71"/>
        <polygon points="105.26 153.64 104.02 155.04 175.09 217.89 176.33 216.49 105.26 153.64 105.26 153.64"/>
        <rect x="68.29" y="54.06" width="1.87" height="93.67" strokeWidth=".71"/>
        <polygon points="72.04 149.61 102.99 149.61 101.33 151.48 72.04 151.48 72.04 149.61" strokeWidth=".71"/>
        <rect x="209.56" y="61.49" width="1.87" height="15.6" transform="translate(19.12 181.03) rotate(-48.5)"/>
        <polygon points="178.98 274.92 180.86 274.92 180.86 290.63 229.35 290.63 229.35 292.39 180.86 292.39 180.86 310.51 229.35 310.51 229.35 312.38 178.96 312.38 178.98 274.92 178.98 274.92"/>
        <polygon points="353.66 312.4 353.66 228.07 351.78 228.07 351.78 310.52 298.63 310.52 298.63 312.4 353.66 312.4" strokeWidth=".71"/>
        <rect x="244.68" y="278.67" width=".25" height="10.93" strokeWidth=".71"/>
        <rect x="244.68" y="299.59" width=".25" height="10.93" strokeWidth=".71"/>
        <path d="M286.77,292.94h-8.76s8.76,0,8.76,0Z" strokeWidth=".71"/>
        <path d="M278.02,293.06h8.76s-8.76,0-8.76,0Z" strokeWidth=".71"/>
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
