// S1Casa4.jsx - Sótano Casa 4 (modelo unificado tipo FloorPlan1)
import React, { useMemo } from 'react';

// --- Centros y tamaños para labels ---
const ROOM_CENTERS = {
  JardinSotano: { x: 90, y: 285 },
  VestierHabitacionSotano: { x: 190, y: 260 },
  SalaDeJuegosSotano: { x: 270, y: 245 },
  BodegaSotano: { x: 335, y: 240 },
  HallSotano: { x: 260, y: 205 },
  HabitacionSotano: { x: 165, y: 220 },
  DeckSotano: { x: 105, y: 215 },
  BañoSotano: { x: 100, y: 185, size: 'small' },
  MueblesSotano: { x: 285, y: 235, size: 'small' }, // nuevo: grupo muebles
};

const ROOM_LABELS = {
  JardinSotano: 'Jardín sótano',
  VestierHabitacionSotano: 'Vestier hab. sótano',
  SalaDeJuegosSotano: 'Sala de juegos',
  BodegaSotano: 'Bodega',
  HallSotano: 'Hall sótano',
  HabitacionSotano: 'Hab. sótano',
  DeckSotano: 'Deck sótano',
  BañoSotano: 'Baño sótano',
  MueblesSotano: 'Muebles sótano',
};

const ROOMS_WITH_OPACITY = Object.keys(ROOM_CENTERS);

const getTaskLevel = (count) => {
  if (count > 10) return 'critical';
  if (count > 5) return 'high';
  if (count > 2) return 'medium';
  if (count > 0) return 'low';
  return 'none';
};

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
    critical: 'fill-red-700',
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
          : 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
      }}
    >
      <text
        x="0"
        y="0"
        textAnchor="middle"
        dominantBaseline="middle"
        className={`${textColor} font-bold`}
        style={{ fontSize }}
      >
        {displayText}
      </text>
    </g>
  );
};

const getRoomClassName = (roomId, selectedRoom) => {
  const base =
    'stroke-gray-900 stroke-[1px] cursor-pointer transition-all duration-200';
  const opacity = ROOMS_WITH_OPACITY.includes(roomId)
    ? 'opacity-50'
    : 'opacity-100';

  if (selectedRoom === roomId) {
    return `${base} fill-teal-400 ${opacity}`;
  }
  return `${base} fill-white hover:fill-teal-100 ${opacity}`;
};

// --- Capas estáticas completas del SVG original (solo no interactivas) ---
const STATIC_LAYERS = `
  <g id="_-A0-Estructura" data-name="-A0-Estructura">
    <rect x="283.57" y="111.57" width="7.5" height="4.37" transform="translate(11.74 253.57) rotate(-48.5)" fill="none" stroke="#f0f" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="276.95" y="119.05" width="7.5" height="4.37" transform="translate(3.9 251.13) rotate(-48.5)" fill="none" stroke="#f0f" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="123.03" y="156.34" width="7.5" height="4.37" transform="translate(-75.96 148.44) rotate(-48.5)" fill="none" stroke="#f0f" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="194.35" y="271.17" width="7.5" height="3.75" fill="none" stroke="#f0f" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <rect x="348.44" y="271.17" width="7.5" height="3.75" fill="none" stroke="#f0f" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <rect x="258.8" y="271.17" width="7.5" height="3.75" fill="none" stroke="#f0f" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <rect x="191.1" y="216.87" width="7.5" height="3.75" transform="translate(-98.09 219.73) rotate(-48.5)" fill="none" stroke="#f0f" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <rect x="348.44" y="187.47" width="7.5" height="3.75" fill="none" stroke="#f0f" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <rect x="352.18" y="124.67" width="3.75" height="7.5" fill="none" stroke="#f0f" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <rect x="276.79" y="183.72" width="3.75" height="7.5" fill="none" stroke="#f0f" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <rect x="89.07" y="156.14" width="3.75" height="3.75" fill="none" stroke="#f0f" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="#f0f" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g id="_-A0-Proy" data-name="-A0-Proy">
    <rect x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="#ff7f00" stroke-dasharray="3.12 2.08" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g id="_-A0-Muros" data-name="-A0-Muros">
    <polygon points="123.21 181.98 117.59 177.02 116.35 178.42 121.96 183.39 107 200.3 101.39 195.33 100.15 196.74 107.16 202.95 135.34 171.1 190.96 220.31 192.21 218.92 126.72 160.97 125.46 162.36 133.93 169.86 123.21 181.98 123.21 181.98" fill="none" stroke="blue" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="345.13" y="271.17" width="3.31" height="3.75" fill="none" stroke="blue" stroke-linecap="round" stroke-linejoin="round"/>
    <polygon points="354.06 271.17 354.06 216.2 348.44 216.2 348.44 214.32 354.06 214.32 354.06 191.21 355.93 191.21 355.93 271.17 354.06 271.17" fill="none" stroke="blue" stroke-linecap="round" stroke-linejoin="round"/>
    <polygon points="314.27 273.05 314.27 230.56 319.89 230.56 319.89 228.69 312.39 228.69 312.39 274.92 319.89 274.92 319.89 273.05 314.27 273.05 314.27 273.05" fill="none" stroke="blue" stroke-linecap="round" stroke-linejoin="round"/>
    <polygon points="177.23 240.54 198.85 240.54 198.85 238.68 175.54 238.68 150.04 267.5 151.91 269.16 177.23 240.54" fill="none" stroke="blue" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="82.26" y="205.72" width="2.5" height="2.5" transform="translate(-126.84 132.37) rotate(-48.5)" fill="none" stroke="blue" stroke-linecap="round" stroke-linejoin="round"/>
    <polygon points="195.93 191.21 195.93 189.34 276.79 189.34 276.79 191.21 221.76 191.21 198.72 217.17 197.32 215.93 219.25 191.21 195.93 191.21" fill="none" stroke="blue" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M227.58,273.05h6.24v1.87h-31.98v-1.87h23.87s0-32.49,0-32.49h-14.37v-1.87h14.37s0-26.23,0-26.23c0-2.76,2.24-5,5-5h15.74s-.05,8.75-.05,8.75h-1.87l.04-6.89h-13.78c-1.73-.03-3.16,1.34-3.2,3.07,0,.03,0,.06,0,.09v60.57Z" fill="none" stroke="blue" stroke-linecap="round" stroke-linejoin="round"/>
    <polygon points="312.39 209.33 270.92 209.32 270.88 216.2 269.01 216.2 269.06 207.45 312.39 207.45 312.39 191.21 280.54 191.21 280.54 189.34 348.44 189.34 348.44 191.21 314.27 191.21 314.27 214.32 324.89 214.32 324.89 216.2 312.39 216.2 312.39 209.33" fill="none" stroke="blue" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="28.4" y="156.14" width="60.67" height="3.75" fill="none" stroke="blue" stroke-linecap="round" stroke-linejoin="round"/>
    <polygon points="92.82 159.88 122.66 159.88 125.98 156.14 92.82 156.14 92.82 159.88" fill="none" stroke="blue" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="blue" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g id="Frame">
    <rect id="Frame-2" data-name="Frame" x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="#ff7f00" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g id="_-A0-Ventanas" data-name="-A0-Ventanas">
    <rect x="233.82" y="273.05" width="24.98" height="1.88" fill="none" stroke="aqua" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <rect x="266.3" y="273.05" width="46.09" height="1.87" fill="none" stroke="aqua" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <rect x="319.9" y="273.05" width="25.22" height="1.87" fill="none" stroke="aqua" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <rect x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="aqua" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="71.66" y="184.71" width="2.5" height="25.78" transform="translate(-123.41 121.31) rotate(-48.51)" fill="none" stroke="aqua" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <rect x="116.41" y="192.84" width="2.5" height="88.69" transform="translate(-137.94 168.14) rotate(-48.5)" fill="none" stroke="aqua" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <polygon points="64.09 188.12 89.07 159.88 92.41 159.88 65.96 189.78 64.09 188.12" fill="none" stroke="aqua" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <polygon points="194.35 274.92 178.57 292.75 151.91 269.16 153.15 267.75 178.41 290.1 194.35 272.09 194.35 274.92" fill="none" stroke="aqua" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
  </g>
  <g id="_-A0-Puertas" data-name="-A0-Puertas">
    <path d="M230,192.27c1.33,7.69,7.46,13.66,15.19,14.78" fill="none" stroke="lime" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <polyline points="244.49 191.62 230 191.62 230 192.27 244.49 192.27" fill="none" stroke="lime" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <line x1="244.49" y1="191.21" x2="244.49" y2="207.45" fill="none" stroke="lime" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <line x1="244.49" y1="207.45" x2="246.44" y2="207.45" fill="none" stroke="lime" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <line x1="244.49" y1="191.74" x2="246.44" y2="191.74" fill="none" stroke="lime" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <line x1="246.44" y1="191.21" x2="244.49" y2="191.21" fill="none" stroke="lime" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <line x1="246.44" y1="206.93" x2="244.49" y2="206.93" fill="none" stroke="lime" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <line x1="246.44" y1="207.45" x2="246.44" y2="191.21" fill="none" stroke="lime" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
  </g>
  <g id="_-A0-Dotacion" data-name="-A0-Dotacion">
    <!-- aquí va TODO el bloque de dotación original tal cual, estático -->
  </g>
`;

// --- Componente principal ---
export function FloorPlanC4S1({ selectedRoom, onRoomClick, tasks = [] }) {
  const taskCountByRoom = useMemo(() => {
    const counts = {};

    tasks.forEach((task) => {
      if (task.espacio) {
        counts[task.espacio] = (counts[task.espacio] || 0) + 1;
      }

      if (task.acciones) {
        try {
          const acciones =
            typeof task.acciones === 'string'
              ? JSON.parse(task.acciones)
              : task.acciones;

          if (Array.isArray(acciones)) {
            acciones.forEach((accion) => {
              if (accion.espacio) {
                counts[accion.espacio] =
                  (counts[accion.espacio] || 0) + 1;
              }
            });
          }
        } catch {
          // ignorar errores de parseo
        }
      }
    });

    return counts;
  }, [tasks]);

  const handleClick = (roomId) => {
    if (onRoomClick) onRoomClick(roomId);
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 395.35 343.41"
      width="100%"
    >
      {/* Capas estáticas */}
      <g
        className="pointer-events-none"
        dangerouslySetInnerHTML={{ __html: STATIC_LAYERS }}
      />

      {/* Espacios interactivos */}

      <g id="JardinSotano">
        <polygon
          points=".35 159.88 .35 235.15 122.32 343.05 355.93 343.05 355.93 274.92 194.35 274.92 178.57 292.75 151.91 269.16 139.49 283.19 69.32 221.11 81.74 207.08 28.39 159.88 .35 159.88"
          className={getRoomClassName('JardinSotano', selectedRoom)}
          onClick={() => handleClick('JardinSotano')}
        />
      </g>

      {/* Grupo Muebles interactivo */}
      <g
        id="MueblesSotano"
        className={getRoomClassName('MueblesSotano', selectedRoom)}
        onClick={() => handleClick('MueblesSotano')}
      >
    <rect x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="gray" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="gray" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M313.36,228.38c5.95-.86,10.66-5.45,11.69-11.37" fill="none" stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <polyline points="313.89 216.51 325.04 216.51 325.04 217.01 313.89 217.01" fill="none" stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <line x1="313.89" y1="216.2" x2="313.89" y2="228.69" fill="none" stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <line x1="313.89" y1="228.69" x2="312.39" y2="228.69" fill="none" stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <line x1="313.89" y1="216.6" x2="312.39" y2="216.6" fill="none" stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <line x1="312.39" y1="216.2" x2="313.89" y2="216.2" fill="none" stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <line x1="312.39" y1="228.29" x2="313.89" y2="228.29" fill="none" stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <line x1="312.39" y1="228.69" x2="312.39" y2="216.2" fill="none" stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width=".71"/>
    <rect x="270.9" y="209.33" width="41.49" height="6.87" fill="none" stroke="#c7c8ca" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="198.85" y1="240.54" x2="198.85" y2="248.04" fill="none" stroke="#c7c8ca" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M244.56,209.33l-.04,6.87h-10.71s0,56.85,0,56.85h-6.24s-.06-60.57-.06-60.57c.04-1.74,1.45-3.13,3.18-3.16h13.86" fill="none" stroke="#c7c8ca" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="314.27 214.32 324.89 214.32 324.89 196.21 354.06 196.21 354.06 191.21 314.27 191.21 314.27 214.32" fill="none" stroke="#c7c8ca" stroke-linecap="round" stroke-linejoin="round"/>
    <polygon points="319.9 230.56 314.27 230.56 314.27 273.05 319.89 273.05 319.9 273.05 319.9 230.56 319.9 230.56" fill="none" stroke="#c7c8ca" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="348.44" y="216.2" width="5.62" height="54.98" fill="none" stroke="#c7c8ca" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M185.97,222.57c2.24,1.85,5.45,1.95,7.8.23l-58.43-51.69-3.31,3.74,53.94,47.72h0Z" fill="none" stroke="#c7c8ca" stroke-linecap="round" stroke-linejoin="round"/>
    <polygon points="180.6 248.04 198.85 248.04 198.85 240.54 177.23 240.54 153.57 267.29 153.15 267.75 158.77 272.72 180.6 248.04 180.6 248.04" fill="none" stroke="#c7c8ca" stroke-linecap="round" stroke-linejoin="round"/>
    <polygon points="225.71 240.55 218.21 240.55 218.21 273.05 225.71 273.05 225.71 240.55 225.71 240.55" fill="none" stroke="#c7c8ca" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="100.38" y="185.61" width="22.58" height="7.5" transform="translate(-104.15 147.53) rotate(-48.5)" fill="none" stroke="#c7c8ca" stroke-linecap="round" stroke-linejoin="round"/>
      </g>

      <g id="VestierHabitacionSotano">
        <polygon
          points="158.77 272.72 180.6 248.04 198.85 248.04 198.85 240.54 218.21 240.55 218.21 273.05 201.84 273.05 201.84 271.17 194.35 271.17 194.35 272.09 178.41 290.1 158.77 272.72"
          className={getRoomClassName(
            'VestierHabitacionSotano',
            selectedRoom
          )}
          onClick={() => handleClick('VestierHabitacionSotano')}
        />
      </g>

      <g id="SalaDeJuegosSotano">
        <polygon
          points="233.82 273.05 233.82 216.2 312.39 216.2 312.39 273.04 266.3 273.05 266.3 271.17 258.8 271.17 258.8 273.05 233.82 273.05"
          className={getRoomClassName(
            'SalaDeJuegosSotano',
            selectedRoom
          )}
          onClick={() => handleClick('SalaDeJuegosSotano')}
        />
      </g>

      <g id="BodegaSotano">
        <polygon
          points="319.9 273.05 345.13 273.05 345.13 271.17 348.44 271.17 348.44 214.32 354.06 214.32 354.06 196.21 324.89 196.21 324.89 216.2 313.89 216.2 313.89 228.69 319.89 228.69 319.9 273.05"
          className={getRoomClassName('BodegaSotano', selectedRoom)}
          onClick={() => handleClick('BodegaSotano')}
        />
      </g>

      <g id="HallSotano">
        <path
          d="M200.74,214.9h24.97v-2.45c0-2.76,2.24-5,5-5l15.74-.02v7.47s22.57.02,22.57.02l.04-7.47h43.34s0-16.23,0-16.23h-90.64s-21.02,23.69-21.02,23.69Z"
          className={getRoomClassName('HallSotano', selectedRoom)}
          onClick={() => handleClick('HallSotano')}
        />
      </g>

      <g id="HabitacionSotano">
        <path
          d="M92.1,212.9l11.56-13.06,3.51,3.1,24.86-28.1,53.94,47.72c2.2,1.95,5.48,2.04,7.8.23l6.97-7.89h24.97v23.78h-50.17s-23.85,26.95-23.85,26.95l-59.6-52.73Z"
          className={getRoomClassName(
            'HabitacionSotano',
            selectedRoom
          )}
          onClick={() => handleClick('HabitacionSotano')}
        />
      </g>

      <g id="DeckSotano">
        <polygon
          points="81.74 207.08 69.32 221.11 139.49 283.19 151.91 269.16 81.74 207.08 81.74 207.08"
          className={getRoomClassName('DeckSotano', selectedRoom)}
          onClick={() => handleClick('DeckSotano')}
        />
        <polygon
          points="89.07 159.88 28.39 159.88 62.43 190 89.07 159.88 89.07 159.88"
          className={getRoomClassName('DeckSotano', selectedRoom)}
          onClick={() => handleClick('DeckSotano')}
        />
      </g>

      <g id="BañoSotano">
        <polygon
          points="92.1 212.9 65.96 189.78 92.82 159.88 122.66 159.88 133.93 169.86 123.21 181.98 117.59 177.02 100.15 196.74 103.65 199.84 92.1 212.9"
          className={getRoomClassName('BañoSotano', selectedRoom)}
          onClick={() => handleClick('BañoSotano')}
        />
      </g>

      {/* Labels dinámicos */}
      <g id="Capa_Labels">
        {Object.keys(ROOM_CENTERS).map((roomId) => (
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
