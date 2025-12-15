// ARCHIVO: FloorPlan2.jsx (Corregido con todas las mejoras visuales)

import React, { useMemo } from 'react';

// IDs de las habitaciones que tienen opacidad en tu SVG [cite: 2, 3]
const roomsWithOpacity = [
  'HabitacionAuxiliar2',
  'TerrazaHabitacionPrincipalPiso2',
  'ClostHabitacionAuxiliar'
];

/**
 * Función para asignar clases de Tailwind dinámicamente (COLORES ACTUALIZADOS)
 */
const getRoomClassName = (roomId, selectedRoom) => {
  // Los muebles usarán opacity-100 por defecto al no estar en 'roomsWithOpacity'
  const baseClasses = "stroke-gray-900 stroke-[1px] cursor-pointer transition-all duration-200";
  const opacityClass = roomsWithOpacity.includes(roomId) ? 'opacity-50' : 'opacity-100';

  if (selectedRoom === roomId) {
    // --- NUEVO COLOR DE SELECCIÓN ---
    return `${baseClasses} fill-teal-400 ${opacityClass}`;
  }
  // --- NUEVO COLOR DE HOVER ---
  return `${baseClasses} fill-white hover:fill-teal-100 ${opacityClass}`;
};

/**
 * 1. Centros (Coordenadas X, Y) y Tamaños de Etiquetas
 * - 'size: small' para cuartos pequeños.
 * - 'size: furniture' para muebles (el más pequeño).
 * - (default) para cuartos normales.
 */
const ROOM_CENTERS = {
  // --- PisosEspacios --- [cite: 1, 2, 3, 4]
  'HabitacionAuxiliar1': { x: 356.5, y: 217.6, size: 'small' },
  'VestierHabitacionAuxiliar1': { x: 356.5, y: 260, size: 'small' },
  'EstudioPiso2': { x: 454.6, y: 274.9, size: 'small' },
  'HallPiso2': { x: 433.9, y: 231.9 },
  'HabitacionPrincipalPiso2': { x: 515.4, y: 241.0 },
  'ClosetHabitacionPrincipalPiso2': { x: 516.4, y: 282.5, size: 'small' },
  'HabitacionAuxiliar2': { x: 434.2, y: 168.7 },
  'TerrazaHabitacionPrincipalPiso2': { x: 535.1, y: 201.5 },
  'BañoHabitacionAuxiliar': { x: 496.2, y: 155.4, size: 'small' },
  'ClostHabitacionAuxiliar': { x: 465.0, y: 201.6, size: 'small' },
  'BañoHabitacionPrincipalPiso2': { x: 516.4, y: 295, size: 'small' },
  'BañoHabitacionAuxiliar1': { x: 359.0, y: 297.2, size: 'small' },
  'MuebleEstudioPiso2': { x: 427.5, y: 276.1, size: 'furniture' }, // Este ID estaba en PisosEspacios [cite: 4]

  // --- MueblesFijos --- 
  'MuebleVestierHabitacionAuxiliar1': { x: 356.5, y: 247.3, size: 'furniture' },
  'MuebleBañoHabitacionAuxiliar': { x: 509.0, y: 162.1, size: 'furniture' },
  'MuebleClostHabitacionAuxiliar': { x: 465.0, y: 213.1, size: 'furniture' },
  'MuebleClosetHabitacionPrincipalPiso2': { x: 525.5, y: 272.5, size: 'furniture' },
  'MuebleHabitacionAuxiliar1': { x: 326.5, y: 225.7, size: 'furniture' },
  'MuebleHabitacionAuxiliar2': { x: 474.7, y: 147.2, size: 'furniture' },
  'MuebleBañoHabitacionPrincipalPiso2': { x: 517.9, y: 301.2, size: 'furniture' },
};

/**
 * 2. Etiquetas amigables para mostrar en el plano
 */
const ROOM_LABELS = {
  // --- PisosEspacios ---
  'HabitacionAuxiliar1': 'Hab. Aux. 1',
  'VestierHabitacionAuxiliar1': 'Vestier Aux. 1',
  'EstudioPiso2': 'Estudio P2',
  'HallPiso2': 'Hall P2',
  'HabitacionPrincipalPiso2': 'Hab. Principal',
  'ClosetHabitacionPrincipalPiso2': 'Closet Ppal.',
  'HabitacionAuxiliar2': 'Hab. Aux. 2',
  'TerrazaHabitacionPrincipalPiso2': 'Terraza Ppal.',
  'BañoHabitacionAuxiliar': 'Baño Aux. 2',
  'ClostHabitacionAuxiliar': 'Closet Aux. 2',
  'BañoHabitacionPrincipalPiso2': 'Baño Ppal.',
  'BañoHabitacionAuxiliar1': 'Baño Aux. 1',
  'MuebleEstudioPiso2': 'Mueble Est.',

  // --- MueblesFijos ---
  'MuebleVestierHabitacionAuxiliar1': 'Mueble Vestier',
  'MuebleBañoHabitacionAuxiliar': 'Mueble Baño',
  'MuebleClostHabitacionAuxiliar': 'Mueble Closet',
  'MuebleClosetHabitacionPrincipalPiso2': 'Mueble Closet',
  'MuebleHabitacionAuxiliar1': 'Mueble Hab.',
  'MuebleHabitacionAuxiliar2': 'Mueble Hab.',
  'MuebleBañoHabitacionPrincipalPiso2': 'Mueble Baño',
};


/**
 * 3. Lógica para determinar el nivel de criticidad de las tareas
 * (Usado para el color del texto de la etiqueta)
 */
const getTaskLevel = (count) => {
  if (count > 10) return 'critical';
  if (count > 5) return 'high';
  if (count > 2) return 'medium';
  if (count > 0) return 'low';
  return 'none';
};

/**
 * 4. Componente de Etiqueta (Actualizado)
 * - Muestra el conteo al lado del texto.
 * - Ajusta el tamaño de fuente basado en 'position.size'.
 */
const RoomLabel = ({ roomId, count, isSelected, mappedSpace }) => {
  const position = ROOM_CENTERS[roomId];
  if (!position) return null;

  // Prioridad: Datos de DB > Datos Hardcodeados
  const label = mappedSpace
    ? (mappedSpace.nombre + (mappedSpace.apellido ? ` ${mappedSpace.apellido}` : ''))
    : (ROOM_LABELS[roomId] || roomId);
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

  // --- LÓGICA DE TAMAÑO ACTUALIZADA ---
  const isSmall = position.size === 'small';
  const isFurniture = position.size === 'furniture';

  let fontSize = '8px'; // Tamaño normal
  if (isSmall) fontSize = '6px'; // Tamaño pequeño
  if (isFurniture) fontSize = '5px'; // Tamaño mueble (más pequeño)

  const displayText = count > 0 ? `${label} (${count})` : label;
  // --- FIN LÓGICA ACTUALIZADA ---

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
      {/* Texto unificado (etiqueta + conteo) */}
      <text
        x="0"
        y="0"
        textAnchor="middle"
        dominantBaseline="middle"
        className={`${textColor} font-bold`}
        style={{ fontSize: fontSize }} // Fuente dinámica
      >
        {displayText}
      </text>
    </g>
  );
};

export function FloorPlanC2P2({ selectedRoom: propSelectedRoom, onRoomClick, tasks = [], spaceMapping = {} }) {
  // Translate selection (UUID -> String ID) for highlighting
  const selectedRoom = useMemo(() => {
    if (ROOM_CENTERS[propSelectedRoom]) return propSelectedRoom;
    const foundKey = Object.keys(spaceMapping).find(key =>
      spaceMapping[key]._id === propSelectedRoom || spaceMapping[key].id === propSelectedRoom
    );
    return foundKey || propSelectedRoom;
  }, [propSelectedRoom, spaceMapping]);
  // Contar tareas por espacio (Lógica existente, se mantiene)
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
    // SVG con ViewBox actualizado [cite: 1]
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 588.05 326.07" width="100%">
      {/* Capa de Espacios (INTERACTIVA) [cite: 1, 2, 3, 4] */}
      <g id="PisosEspacios">
        <polygon id="HabitacionAuxiliar1" points="388.76 222.07 388.76 193.53 324.31 193.53 324.31 209.69 328.64 209.69 328.64 241.77 388.76 241.77 388.76 234.47 388.76 222.07"
          fillRule="evenodd"
          className={getRoomClassName('HabitacionAuxiliar1', selectedRoom)}
          onClick={() => onRoomClick('HabitacionAuxiliar1')}
        />
        <rect id="VestierHabitacionAuxiliar1" x="324.31" y="251.06" width="64.45" height="38.68"
          className={getRoomClassName('VestierHabitacionAuxiliar1', selectedRoom)}
          onClick={() => onRoomClick('VestierHabitacionAuxiliar1')}
        />
        <rect id="EstudioPiso2" x="432.09" y="245.21" width="45.05" height="59.5"
          className={getRoomClassName('EstudioPiso2', selectedRoom)}
          onClick={() => onRoomClick('EstudioPiso2')}
        />
        <polygon id="HallPiso2" points="390.62 249.55 390.62 218.32 477.13 218.32 477.13 245.21 421.61 245.21 421.61 249.55 390.62 249.55"
          fillRule="evenodd"
          className={getRoomClassName('HallPiso2', selectedRoom)}
          onClick={() => onRoomClick('HallPiso2')}
        />
        <polygon id="HabitacionPrincipalPiso2" points="553.82 266.96 478.99 266.96 478.99 230.71 477.13 230.71 477.13 218.32 514.57 218.32 514.57 215.02 553.82 215.02 553.82 266.96"
          fillRule="evenodd"
          className={getRoomClassName('HabitacionPrincipalPiso2', selectedRoom)}
          onClick={() => onRoomClick('HabitacionPrincipalPiso2')}
        />
        <polygon id="ClosetHabitacionPrincipalPiso2" points="553.82 288.47 478.99 287.68 478.99 266.96 497.25 266.97 497.21 276.26 553.82 276.26 553.82 288.47"
          fillRule="evenodd"
          className={getRoomClassName('ClosetHabitacionPrincipalPiso2', selectedRoom)}
          onClick={() => onRoomClick('ClosetHabitacionPrincipalPiso2')}
        />
        <polygon id="HabitacionAuxiliar2" points="390.62 218.32 415.41 218.32 415.41 191.67 417.27 191.67 477.75 191.67 477.75 189.8 477.75 189.81 477.75 175.32 471.69 175.32 471.69 119.16 390.62 119.16 390.62 218.32"
          fillRule="evenodd"
          className={getRoomClassName('HabitacionAuxiliar2', selectedRoom)}
          onClick={() => onRoomClick('HabitacionAuxiliar2')}
        />
        <polygon id="TerrazaHabitacionPrincipalPiso2" points="553.82 213.16 553.82 213.16 555.72 213.16 555.72 189.81 514.57 189.81 514.57 191.67 514.57 193.53 514.57 209.02 514.57 213.16 553.82 213.16"
          fillRule="evenodd"
          className={getRoomClassName('TerrazaHabitacionPrincipalPiso2', selectedRoom)}
          onClick={() => onRoomClick('TerrazaHabitacionPrincipalPiso2')}
        />
        <polygon id="BañoHabitacionAuxiliar" points="479.61 119.16 479.61 175.32 477.75 175.32 477.75 191.67 480.43 191.67 480.43 189.81 493.62 189.81 493.62 175.32 495.48 175.32 495.48 191.67 512.71 191.67 512.71 177.18 505.03 177.18 505.03 175.32 505.26 175.32 505.26 143.95 512.71 143.97 512.71 119.16 479.61 119.16"
          fillRule="evenodd"
          className={getRoomClassName('BañoHabitacionAuxiliar', selectedRoom)}
          onClick={() => onRoomClick('BañoHabitacionAuxiliar')}
        />
        <rect id="ClostHabitacionAuxiliar" x="417.27" y="193.53" width="95.44" height="16.18"
          className={getRoomClassName('ClostHabitacionAuxiliar', selectedRoom)}
          onClick={() => onRoomClick('ClostHabitacionAuxiliar')}
        />
        <polygon id="BañoHabitacionPrincipalPiso2" points="553.82 290.33 533.41 290.33 533.41 288.47 493.07 288.47 493.07 290.33 478.99 290.33 478.99 304.71 502.24 304.71 502.24 297.87 535.27 297.87 535.27 304.71 552 304.71 552 301.61 553.82 301.61 553.82 290.33"
          fillRule="evenodd"
          className={getRoomClassName('BañoHabitacionPrincipalPiso2', selectedRoom)}
          onClick={() => onRoomClick('BañoHabitacionPrincipalPiso2')}
        />
        <polygon id="BañoHabitacionAuxiliar1" points="331.12 291.61 331.12 304.71 386.9 304.7 386.9 302.85 388.76 302.85 388.76 291.61 372.38 291.61 372.38 289.75 349.84 289.75 349.84 291.61 331.12 291.61"
          fillRule="evenodd"
          className={getRoomClassName('BañoHabitacionAuxiliar1', selectedRoom)}
          onClick={() => onRoomClick('BañoHabitacionAuxiliar1')}
        />
        <rect id="MuebleEstudioPiso2" x="423.48" y="248.95" width="8.05" height="54.32"
          className={getRoomClassName('MuebleEstudioPiso2', selectedRoom)}
          onClick={() => onRoomClick('MuebleEstudioPiso2')}
        />
      </g>

      {/* Capa de Muebles (INTERACTIVA)  */}
      <g id="MueblesFijos">
        <polyline id="MuebleVestierHabitacionAuxiliar1" points="324.32 243.63 388.76 243.63 388.76 251.06 324.31 251.06 324.31 248.95 331.13 248.95 331.13 245.23 324.31 245.23 324.32 243.63"
          fillRule="evenodd"
          className={getRoomClassName('MuebleVestierHabitacionAuxiliar1', selectedRoom)}
          onClick={() => onRoomClick('MuebleVestierHabitacionAuxiliar1')}
        />
        <rect id="MuebleBañoHabitacionAuxiliar" x="505.29" y="148.92" width="7.43" height="26.4"
          className={getRoomClassName('MuebleBañoHabitacionAuxiliar', selectedRoom)}
          onClick={() => onRoomClick('MuebleBañoHabitacionAuxiliar')}
        />
        <polygon id="MuebleClostHabitacionAuxiliar" points="421.61 209.71 417.27 209.71 417.27 216.46 512.72 216.46 512.72 209.71 431.53 209.71 431.53 213.43 421.61 213.43 421.61 209.71"
          fillRule="evenodd"
          className={getRoomClassName('MuebleClostHabitacionAuxiliar', selectedRoom)}
          onClick={() => onRoomClick('MuebleClostHabitacionAuxiliar')}
        />
        <rect id="MuebleClosetHabitacionPrincipalPiso2" x="497.21" y="268.84" width="56.62" height="7.42"
          className={getRoomClassName('MuebleClosetHabitacionPrincipalPiso2', selectedRoom)}
          onClick={() => onRoomClick('MuebleClosetHabitacionPrincipalPiso2')}
        />
        <rect id="MuebleHabitacionAuxiliar1" x="324.32" y="209.69" width="4.32" height="32.08"
          className={getRoomClassName('MuebleHabitacionAuxiliar1', selectedRoom)}
          onClick={() => onRoomClick('MuebleHabitacionAuxiliar1')}
        />
        <polygon id="MuebleHabitacionAuxiliar2" points="471.69 119.16 471.69 175.32 477.75 175.32 477.75 145.19 474.67 145.19 474.67 119.16 471.69 119.16"
          fillRule="evenodd"
          className={getRoomClassName('MuebleHabitacionAuxiliar2', selectedRoom)}
          onClick={() => onRoomClick('MuebleHabitacionAuxiliar2')}
        />
        <rect id="MuebleBañoHabitacionPrincipalPiso2" x="502.24" y="297.87" width="31.26" height="6.74"
          className={getRoomClassName('MuebleBañoHabitacionPrincipalPiso2', selectedRoom)}
          onClick={() => onRoomClick('MuebleBañoHabitacionPrincipalPiso2')}
        />
      </g>

      {/* --- CAPAS ESTÁTICAS (NO INTERACTIVAS) --- */}

      {/* Capa 3: Muros (Estáticos) [cite: 5, 6, 7, 8, 9] */}
      <g id="Capa_3" data-name="Capa 3" className="fill-gray-600 pointer-events-none" fill="#636466">
        <rect id="Muros" x="388.78" y="193.53" width="1.86" height="28.55" fill="#636466" />
        <polygon id="Muros-2" data-name="Muros" points="514.58 193.53 514.58 191.67 512.72 191.67 495.49 191.67 495.49 175.32 493.63 175.32 493.63 189.81 487.88 189.81 487.88 191.67 487.88 193.53 514.58 193.53" fill="#636466" fillRule="evenodd" />
        <rect id="Muros-3" data-name="Muros" x="415.42" y="191.67" width="1.86" height="24.79" fill="#636466" />
        <rect id="Muros-4" data-name="Muros" x="533.42" y="297.87" width="1.86" height="6.84" fill="#636466" />
        <rect id="Muros-5" data-name="Muros" x="505.29" y="143.95" width="9.3" height="4.96" fill="#636466" />
        <rect id="Muros-6" data-name="Muros" x="505.04" y="175.32" width="7.68" height="1.86" fill="#636466" />
        <rect id="Muros-7" data-name="Muros" x="386.92" y="306.57" width="3.72" height="3.72" fill="#636466" />
        <rect id="Muros-8" data-name="Muros" x="388.78" y="152.78" width="1.86" height="40.74" fill="#636466" />
        <rect id="Muros-9" data-name="Muros" x="421.62" y="306.57" width="3.72" height="3.72" fill="#636466" />
        <rect id="Muros-10" data-name="Muros" x="497.22" y="266.96" width="58.51" height="1.86" fill="#636466" />
        <polygon id="Muros-11" data-name="Muros" points="479.01 230.71 477.15 230.71 477.15 306.57 479.01 306.57 479.01 304.71 479.01 230.71" fill="#636466" fillRule="evenodd" />
        <polygon id="Muros-12" data-name="Muros" points="223.3 281.78 215.87 281.78 215.87 282.77 221.82 306.57 223.3 306.57 223.3 293.19 223.3 293.19 223.3 292.39 223.3 291.98 223.3 281.78" fill="#636466" fillRule="evenodd" />
        <polygon id="Muros-13" data-name="Muros" points="166.29 282.77 166.29 281.78 158.85 281.78 158.85 306.57 160.34 306.57 166.29 282.77" fill="#636466" fillRule="evenodd" />
        <polygon id="Muros-14" data-name="Muros" points="390.63 264.43 390.63 260.71 390.63 256.99 390.63 253.27 390.63 249.55 390.63 234.47 388.78 234.47 388.78 302.85 390.63 302.85 390.63 283.02 390.63 279.3 390.63 275.58 390.63 271.86 390.63 268.15 390.63 264.43" fill="#636466" fillRule="evenodd" />
        <path id="Muros-15" data-name="Muros" d="M474.67,143.95h3.1v1.24h-3.1v-1.24M474.67,119.16h1.24v24.79h-1.24v-24.79Z" fill="#636466" fillRule="evenodd" />
        <rect id="Muros-16" data-name="Muros" x="372.4" y="289.75" width="16.38" height="1.86" fill="#636466" />
        <rect id="Muros-17" data-name="Muros" x="342.97" y="268.73" width="33.79" height="1.86" fill="#636466" />
        <rect id="Muros-18" data-name="Muros" x="431.54" y="304.71" width="7.56" height="1.86" fill="#636466" />
        <rect id="Muros-19" data-name="Muros" x="477.77" y="143.95" width="1.86" height="31.38" fill="#636466" />
        <path id="Muros-20" data-name="Muros" d="M493.09,304.71h0s-14.08,0-14.08,0h0v1.86h14.08s0-1.86,0-1.86M493.09,288.47h-14.08v1.86h14.08v-1.86M555.73,288.47h-.35s-.8,0-.8,0h-.74s-20.42,0-20.42,0v1.86h20.42s0,14.38,0,14.38h-20.42s0,1.86,0,1.86h22.31s0-1.86,0-1.86v-16.24Z" fill="#636466" fillRule="evenodd" />
        <rect id="Muros-21" data-name="Muros" x="421.62" y="248.93" width="1.86" height="53.91" fill="#636466" />
        <polygon id="Muros-22" data-name="Muros" points="331.14 291.61 349.85 291.61 349.85 289.75 324.32 289.75 324.32 243.63 376.75 243.63 376.75 241.77 324.32 241.77 324.32 214.65 324.38 214.69 324.38 209.74 324.32 209.69 324.32 192.04 322.46 192.04 322.46 193.53 322.46 289.75 322.46 292.9 322.46 306.57 331.14 306.57 331.14 291.61" fill="#636466" fillRule="evenodd" />
        <polygon id="Muros-23" data-name="Muros" points="514.58 209.02 513.4 209.02 512.72 209.02 512.72 216.46 514.58 216.46 514.58 214.26 514.58 214.26 514.58 213.46 514.58 209.02" fill="#636466" fillRule="evenodd" />
        <rect id="Muros-24" data-name="Muros" x="415.42" y="216.46" width="99.16" height="1.86" fill="#636466" />
        <rect id="Muros-25" data-name="Muros" x="553.84" y="248.93" width="1.89" height="18.03" fill="#636466" />
        <rect id="Muros-26" data-name="Muros" x="477.77" y="191.67" width="2.67" height="1.86" fill="#636466" />
      </g>

      {/* Capa 4: Estructura (Estática) [cite: 9] */}
      <g id="Capa_4" data-name="Capa 4" className="pointer-events-none fill-pink-400" fill="#f0f">
        <path id="Estructura" d="M552,245.23h3.72v3.72h-3.72v-3.72M475.9,126.61h3.72v-7.44h-3.72v7.44M166.28,281.8v-3.72h-7.44v3.72h7.44M223.29,281.8v-3.72h-7.44v3.72h7.44M386.91,302.87h3.72v3.72h-3.72v-3.72M209.91,193.55v-3.72h-9.92v3.72h9.92M324.89,306.59h3.72v-6.2h-3.72v6.2M331.13,248.95v-3.72h-6.2v3.72h6.2M388.76,152.8h3.72v-7.44h-3.72v7.44M555.72,209.71h-3.72v7.44h3.72v-7.44M555.72,299.15h-3.72v7.44h3.72v-7.44M487.87,193.54v-3.72h-7.44v3.72h7.44M364.91,193.55v-3.72h-9.92v3.72h9.92M431.53,213.43v-3.72h-9.92v3.72h9.92M431.53,248.95v-3.72h-9.92v3.72h9.92M431.53,306.58v-3.72h-9.92v3.72h9.92Z" fill="#f0f" fillRule="evenodd" />
        <polyline points="166.28 281.8 166.28 278.08 158.84 278.08 158.84 281.8 166.28 281.8" fill="#f0f" fillRule="evenodd" />
      </g>

      {/* Capa 5: Ventanas (Estática) [cite: 9, 10, 11, 12] */}
      <g id="Capa_5" data-name="Capa 5" className="fill-none stroke-blue-300 pointer-events-none stroke-[1px]">
        <polyline id="Ventanas" points="553.83 268.84 555.72 268.84 555.72 288.49 553.83 288.49 553.83 268.84" fillRule="evenodd" />
        <polyline id="Ventanas-2" data-name="Ventanas" points="477.76 119.18 390.62 119.18 390.62 117.32 477.76 117.32 477.76 119.18" fillRule="evenodd" />
        <polyline id="Ventanas-3" data-name="Ventanas" points="512.71 193.55 514.57 193.55 514.57 209.04 512.71 209.04 512.71 193.55" fillRule="evenodd" />
        <polyline id="Ventanas-4" data-name="Ventanas" points="479.62 117.32 512.71 117.32 512.71 119.18 479.62 119.18 479.62 117.32" fillRule="evenodd" />
        <polyline id="Ventanas-5" data-name="Ventanas" points="514.57 148.92 512.71 148.92 512.71 191.69 514.57 191.69 514.57 148.92" fillRule="evenodd" />
        <polyline id="Ventanas-6" data-name="Ventanas" points="512.71 143.97 514.57 143.97 514.57 117.32 512.71 117.32 512.71 143.97" fillRule="evenodd" />
        <polyline id="Ventanas-7" data-name="Ventanas" points="514.57 215.04 552 215.04 552 213.18 514.57 213.18 514.57 215.04" fillRule="evenodd" />
        <polyline id="Ventanas-8" data-name="Ventanas" points="555.72 245.23 553.83 245.23 553.83 217.14 555.72 217.14 555.72 245.23" fillRule="evenodd" />
        <polyline id="Ventanas-9" data-name="Ventanas" points="493.08 304.73 533.41 304.73 533.41 306.59 493.08 306.59 493.08 304.73" fillRule="evenodd" />
        <polyline id="Ventanas-10" data-name="Ventanas" points="439.09 304.73 477.14 304.73 477.14 306.59 439.09 306.59 439.09 304.73" fillRule="evenodd" />
        <polyline id="Ventanas-11" data-name="Ventanas" points="324.31 192.06 355 192.03 355 193.52 324.31 193.55 324.31 192.06" fillRule="evenodd" />
        <polyline id="Ventanas-12" data-name="Ventanas" points="223.29 291.63 322.45 291.63 322.45 293.48 223.29 293.48 223.29 291.63" fillRule="evenodd" />
        <polyline id="Ventanas-13" data-name="Ventanas" points="164.42 278.08 166.28 278.08 166.28 193.55 199.99 193.55 199.99 191.69 164.42 191.69 164.42 278.08" fillRule="evenodd" />
        <polyline id="Ventanas-14" data-name="Ventanas" points="390.62 306.59 390.62 304.73 421.61 304.73 421.61 306.59 390.62 306.59" fillRule="evenodd" />
        <polyline id="Ventanas-15" data-name="Ventanas" points="331.13 306.59 331.13 304.73 386.91 304.73 386.91 306.59 331.13 306.59" fillRule="evenodd" />
        <polyline id="Ventanas-16" data-name="Ventanas" points="390.62 145.36 390.62 117.32 388.76 117.32 388.76 145.36 390.62 145.36" fillRule="evenodd" />
        <polyline id="Ventanas-17" data-name="Ventanas" points="209.91 193.55 209.91 192.06 322.45 192.06 322.45 193.54 209.91 193.55" fillRule="evenodd" />
      </g>

      {/* Capa 6: Frame (Estática) [cite: 12] */}
      <g id="Capa_6" data-name="Capa 6" className="pointer-events-none">
        <rect id="FRAME" x=".5" y=".5" width="587.05" height="325.07" fill="none" stroke="#000" strokeMiterlimit="10" />
      </g>

      {/* Capa de Etiquetas con Nombres y Contadores (Dinámica) */}
      <g id="Capa_Labels">
        {Object.keys(ROOM_CENTERS).map(roomId => (
          <RoomLabel
            key={roomId}
            roomId={roomId}
            mappedSpace={spaceMapping[roomId]}
            count={taskCountByRoom[roomId] || 0}
            isSelected={selectedRoom === roomId}
          />
        ))}
      </g>
    </svg>
  );
}