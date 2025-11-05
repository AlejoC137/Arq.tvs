import React, { useMemo } from 'react';

// --- INICIO: Definiciones para RoomLabel ---

/**
 * 1. Centros (Coordenadas X, Y) y Tamaños de Etiquetas
 * - 'size: small' para cuartos pequeños.
 * - 'size: furniture' para muebles (el más pequeño).
 * - (default) para cuartos normales.
 */
const ROOM_CENTERS = {
  // --- Habitaciones ---
  HabitacionPrincipal: { x: 407.4, y: 142.3 },
  Cocina: { x: 112.0, y: 133.8 },
  BalconOficina: { x: 502.7, y: 299.1 },
  Oficina: { x: 495.9, y: 241.7 },
  ClosetHabitacionPrincipal: { x: 441.9, y: 185 },
  Piscina: { x: 310.7, y: 70 },
  Servicios: { x: 78.8, y: 205 },
  BañoOficina: { x: 441.0, y: 286.5, size: 'small' },
  BañoHabitacionPrincipal: { x: 468.2, y: 134.7 },
  Escalera: { x: 406.1, y: 277.2 },
  EstudioPiso1: { x: 373.3, y: 249.1 },
  Sala: { x: 170.9, y: 237.2 },
  Comedor: { x: 168.0, y: 133.8 },
  JardinInterior: { x: 272.9, y: 280 },
  Acceso: { x: 191.1, y: 294.5 },
  Deck: { x: 232.0, y: 132.9 },
  BañoServicio: { x: 61, y: 224, size: 'small' },
  BañoSocial: { x: 129, y: 258, size: 'small' },
  Jacuzzi: { x: 289, y: 124, size: 'small' },
  CartPort: { x: 50, y: 260 },
  Jardin: { x: 272.9, y: 223.3 }, // Centro duplicado de JardinInterior a propósito

  // --- Muebles (NUEVO) ---
  'MuebleDespensa': { x: 55, y: 172, size: 'furniture' },
  'MuebleCocina': { x: 85, y: 133, size: 'furniture' },
  'MuebleRopas': { x: 61, y: 101, size: 'furniture' },
  'MuebleRopas-2': { x: 46.7, y: 124.1, size: 'furniture' },
  'ClosetServicio': { x: 104.8, y: 218.3, size: 'furniture' },
  'ClosetServicio-2': { x: 99, y: 276, size: 'furniture' },
  'MuebleBañoHabitacionPrincipal': { x: 480.9, y: 140.9, size: 'furniture' },
  'MuebleBañoSocial': { x: 121.5, y: 244.5, size: 'furniture' },
  'MuebleHabitacionPrincipal': { x: 448, y: 126, size: 'furniture' },
  'MuebleClosetHabitacionPrincipal': { x: 423, y: 205, size: 'furniture' },
  'MuebleClosetHabitacionPrincipal-2': { x: 469, y: 193, size: 'furniture' },
  'CocinetaOficina': { x: 472.6, y: 202.5, size: 'furniture' },
  'MuebleEstudioPiso1': { x: 336.7, y: 240.6, size: 'furniture' },
  'ClosetOficina': { x: 434, y: 239, size: 'furniture' },
  'MuebleEstudioPiso1-2': { x: 425.1, y: 275.9, size: 'furniture' },
  'MuebleEstudioPiso1-3': { x: 425.1, y: 229.3, size: 'furniture' },
};

/**
 * 2. Etiquetas amigables para mostrar en el plano
 */
const ROOM_LABELS = {
  // --- Habitaciones ---
  HabitacionPrincipal: 'Hab. Principal',
  Cocina: 'Cocina',
  BalconOficina: 'Balcón Oficina',
  Oficina: 'Oficina',
  ClosetHabitacionPrincipal: 'Closet Ppal.',
  Piscina: 'Piscina',
  Servicios: 'Servicios',
  BañoOficina: 'Baño Oficina',
  BañoHabitacionPrincipal: 'Baño Ppal.',
  Escalera: 'Escalera',
  EstudioPiso1: 'Estudio',
  Sala: 'Sala',
  Comedor: 'Comedor',
  JardinInterior: 'Jardín Interior',
  Acceso: 'Acceso',
  Deck: 'Deck',
  BañoServicio: 'Baño Serv.',
  BañoSocial: 'Baño Social',
  Jacuzzi: 'Jacuzzi',
  CartPort: 'CartPort',
  Jardin: 'Jardín',

  // --- Muebles (NUEVO) ---
  'MuebleDespensa': 'Despensa',
  'MuebleCocina': 'Mueble Cocina',
  'MuebleRopas': 'Mueble Ropas',
  'MuebleRopas-2': 'Lavadora',
  'ClosetServicio': 'Closet Serv.',
  'ClosetServicio-2': 'Closet Serv.',
  'MuebleBañoHabitacionPrincipal': 'Mueble Baño',
  'MuebleBañoSocial': 'Mueble Baño',
  'MuebleHabitacionPrincipal': 'Mueble Hab.',
  'MuebleClosetHabitacionPrincipal': 'Closet',
  'MuebleClosetHabitacionPrincipal-2': 'Closet',
  'CocinetaOficina': 'Cocineta',
  'MuebleEstudioPiso1': 'Mueble Est.',
  'ClosetOficina': 'Closet Ofic.',
  'MuebleEstudioPiso1-2': 'Mueble Est.',
  'MuebleEstudioPiso1-3': 'Mueble Est.',
};

/**
 * 3. Lógica para determinar el nivel de criticidad de las tareas
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

// --- FIN: Definiciones para RoomLabel ---


// IDs de las habitaciones que tienen opacidad en tu SVG (actualizado)
const roomsWithOpacity = [
  'HabitacionPrincipal', 'BalconOficina', 'Oficina', 'ClosetHabitacionPrincipal', 
  'Piscina', 'Servicios', 'EstudioPiso1', 'Sala', 'Comedor', 'Acceso', 'Deck',
  'JardinInterior', 'Jardin'
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
 * Componente Principal del Plano (Piso 1)
 * Acepta 'tasks' para calcular contadores de tareas por espacio
 */
export function FloorPlan1({ selectedRoom, onRoomClick, tasks = [] }) {
  // Contar tareas por espacio (igual que FloorPlan2)
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 588.05 326.07" width="100%">
      {/* Capa 2: Habitaciones (Interactivas) - Actualizado desde PisosEspacios */}
      <g id="PisosEspacios">
        <polygon id="HabitacionPrincipal" points="364.91 189.83 363.05 189.83 363.05 124.13 364.91 124.13 364.91 119.18 363.05 119.18 363.05 94.76 445.23 94.76 445.23 157.85 451.68 157.85 451.68 174.56 389.7 174.56 389.7 189.83 372.92 189.83 364.91 189.83" 
          fillRule="evenodd" 
          className={getRoomClassName('HabitacionPrincipal', selectedRoom)}
          onClick={() => onRoomClick('HabitacionPrincipal')}
        />
        <rect id="Cocina" x="90.08" y="75.92" width="43.92" height="115.77"
          className={getRoomClassName('Cocina', selectedRoom)}
          onClick={() => onRoomClick('Cocina')}
        />
        <polygon id="BalconOficina" points="453.34 293.48 453.34 306.59 552.01 306.57 552.01 291.63 527.22 291.63 527.22 293.48 453.34 293.48" 
          fillRule="evenodd" 
          className={getRoomClassName('BalconOficina', selectedRoom)}
          onClick={() => onRoomClick('BalconOficina')}
        />
        <polygon id="Oficina" points="437.97 209.71 437.97 268.19 453.34 268.19 453.34 291.63 552.01 291.63 552.01 288.49 553.86 288.49 553.86 258.05 553.86 258.05 553.86 253.09 553.86 253.1 553.86 217.15 552 217.14 552 209.71 553.86 209.71 553.86 191.69 487.87 191.69 487.87 206.19 457.31 206.19 457.31 209.71 437.97 209.71" 
          fillRule="evenodd" 
          className={getRoomClassName('Oficina', selectedRoom)}
          onClick={() => onRoomClick('Oficina')}
        />
        <polygon id="ClosetHabitacionPrincipal" points="399 176.42 399 200.41 455.45 200.41 455.45 189.83 484.77 189.83 484.77 176.42 399 176.42" 
          fillRule="evenodd" 
          className={getRoomClassName('ClosetHabitacionPrincipal', selectedRoom)}
          onClick={() => onRoomClick('ClosetHabitacionPrincipal')}
        />
        <path id="Piscina" d="M357.53,13.42h-93.62v79.11h49.58v61.97h-6.2v33.52h50.24V13.42M307.3,154.5h-8.68v33.52h8.68v-33.52M298.62,154.5h-8.68v33.52h8.68v-33.52M281.27,154.5h-8.68v33.52h8.68v-33.52M272.59,154.5h-8.68v33.52h8.68v-33.52M289.94,154.5h-8.68v33.52h8.68v-33.52Z" 
          fillRule="evenodd" 
          className={getRoomClassName('Piscina', selectedRoom)}
          onClick={() => onRoomClick('Piscina')}
        />
        <polygon id="Servicios" points="81.62 233.16 81.62 272.87 116.57 272.87 116.57 235.02 114.71 235.02 114.71 231.3 116.57 231.3 116.57 222.65 93.02 222.65 93.02 223.62 91.16 223.62 91.16 212.14 116.57 212.14 116.57 193.55 114.71 193.55 114.71 191.69 102.32 191.69 102.32 193.55 79.76 193.55 79.76 95.75 50.38 95.75 50.38 114.67 42.95 114.67 42.95 116.3 50.39 116.3 50.39 131.94 44.81 131.94 44.81 133.8 67.37 133.8 67.37 135.66 42.95 135.66 42.95 154.46 49.14 154.46 49.14 185.86 67.37 185.86 67.37 193.55 57.15 193.55 57.15 199.74 55.29 199.74 55.29 193.55 41.09 193.55 41.09 212.14 81.25 212.14 81.25 233.16 81.62 233.16" 
          fillRule="evenodd" 
          className={getRoomClassName('Servicios', selectedRoom)}
          onClick={() => onRoomClick('Servicios')}
        />
        <polygon id="BañoServicio" points="42.94 231.3 42.94 214 79.38 214 79.38 223.25 81.24 223.25 81.24 233.16 44.8 233.16 44.8 231.3 42.94 231.3" 
          fillRule="evenodd"
          className={getRoomClassName('BañoServicio', selectedRoom)}
          onClick={() => onRoomClick('BañoServicio')}
        />
        <polygon id="BañoOficina" points="430.54 270.04 430.64 304.73 451.48 304.73 451.48 268.19 441.57 268.19 441.57 270.04 430.54 270.04" 
          fillRule="evenodd"
          className={getRoomClassName('BañoOficina', selectedRoom)}
          onClick={() => onRoomClick('BañoOficina')}
        />
        <polygon id="BañoHabitacionPrincipal" points="477.08 124.13 477.09 157.85 477.09 159.71 484.77 159.71 484.77 174.56 467.54 174.56 467.54 157.85 465.68 157.85 465.68 174.56 451.68 174.56 451.68 124.13 451.68 94.76 484.76 94.76 484.76 119.18 477.08 119.18 477.08 124.13" 
          fillRule="evenodd"
          className={getRoomClassName('BañoHabitacionPrincipal', selectedRoom)}
          onClick={() => onRoomClick('BañoHabitacionPrincipal')}
        />
        <rect id="Escalera" x="390.63" y="249.57" width="30.99" height="55.16"
          className={getRoomClassName('Escalera', selectedRoom)}
          onClick={() => onRoomClick('Escalera')}
        />
        <polygon id="EstudioPiso1" points="364.91 193.55 324.93 193.55 324.93 209.71 331.13 209.71 331.13 212.84 342.24 212.84 342.24 268.26 331.13 268.26 331.13 271.39 324.93 271.39 324.93 291.63 331.13 291.63 331.13 304.73 386.91 304.73 386.91 302.87 390.63 302.87 390.63 249.57 421.61 249.57 421.61 209.71 389.7 209.71 389.7 193.55 364.91 193.55" 
          fillRule="evenodd" 
          className={getRoomClassName('EstudioPiso1', selectedRoom)}
          onClick={() => onRoomClick('EstudioPiso1')}
        />
        <polygon id="Sala" points="118.43 193.54 118.43 235.02 141.38 235.02 141.38 279.94 158.84 279.94 158.84 278.08 166.28 278.08 166.28 280.86 215.86 280.86 215.86 278.08 223.29 278.08 223.29 193.55 199.99 193.55 118.43 193.54" 
          fillRule="evenodd" 
          className={getRoomClassName('Sala', selectedRoom)}
          onClick={() => onRoomClick('Sala')}
        />
        <polygon id="Comedor" points="134.21 75.92 134.21 191.69 201.84 191.69 201.84 80.26 199.98 80.26 199.98 75.92 134.21 75.92" 
          fillRule="evenodd" 
          className={getRoomClassName('Comedor', selectedRoom)}
          onClick={() => onRoomClick('Comedor')}
        />
        <path id="JardinInterior" d="M223.29,253.21v24.87s0,13.55,0,13.55h99.16v-1.31h-7.65v-34.17h7.65v-3.19h-27.17l-71.99.25ZM275.78,256.15v34.17h-8.69v-34.17h8.69M279.02,256.15h8.69v34.17h-8.69v-34.17M263.86,256.15v34.17h-8.69v-34.17h8.69M290.94,256.15h8.69v34.17h-8.69v-34.17M251.93,256.15v34.17h-27.16v-34.17h27.16M302.87,256.15h8.69v34.17h-8.69v-34.17Z" 
          fillRule="evenodd" 
          className={getRoomClassName('JardinInterior', selectedRoom)}
          onClick={() => onRoomClick('JardinInterior')}
        />
        <polygon id="Acceso" points="221.81 306.59 215.75 282.35 166.39 282.35 160.33 306.59 221.81 306.59" 
          fillRule="evenodd" 
          className={getRoomClassName('Acceso', selectedRoom)}
          onClick={() => onRoomClick('Acceso')}
        />
        <rect id="Deck" x="203.71" y="74.06" width="56.54" height="117.63" 
          className={getRoomClassName('Deck', selectedRoom)}
          onClick={() => onRoomClick('Deck')}
        />
        <polygon id="BañoSocial" points="118.43 279.94 118.43 252.09 124.58 252.09 124.58 236.88 139.51 236.88 139.51 279.94 118.43 279.94" 
          fillRule="evenodd"
          className={getRoomClassName('BañoSocial', selectedRoom)}
          onClick={() => onRoomClick('BañoSocial')}
        />
        <rect id="Jacuzzi" x="263.91" y="92.53" width="49.58" height="61.97"
          className={getRoomClassName('Jacuzzi', selectedRoom)}
          onClick={() => onRoomClick('Jacuzzi')}
        />
        <polygon id="CartPort" points="79.75 74.06 79.75 86.45 41.86 86.45 41.86 235.02 80.53 235.02 79.9 281.72 19.85 281.72 20.48 74.06 77.37 74.06 79.75 74.06" 
          fillRule="evenodd"
          className={getRoomClassName('CartPort', selectedRoom)}
          onClick={() => onRoomClick('CartPort')}
        />
        <rect id="Jardin" x="223.29" y="193.54" width="99.17" height="59.42"
          className={getRoomClassName('Jardin', selectedRoom)}
          onClick={() => onRoomClick('Jardin')}
        />
      </g>
      
      {/* --- CAPAS ESTÁTICAS (NO INTERACTIVAS) --- */}
      
      {/* Muros - Actualizado */}
      <g id="Muros" className="fill-gray-600 pointer-events-none" fill="#636466">
        <g id="HATCH">
          <polygon id="Muros-2" data-name="Muros" points="486.62 174.57 467.53 174.57 467.53 157.85 465.67 157.85 465.67 174.57 449.19 174.57 449.19 176.42 484.76 176.43 484.76 176.42 486.62 176.42 486.62 174.57" fill="#636466" fillRule="evenodd"/>
        </g>
        <g id="HATCH-2" data-name="HATCH">
          <polygon id="Muros-3" data-name="Muros" points="428.67 301.63 428.67 301.63 428.67 248.95 425.32 248.95 425.32 245.23 428.67 245.23 428.67 213.43 425.33 213.43 425.33 209.71 389.7 209.71 389.7 174.57 400.6 174.57 400.6 176.42 391.56 176.42 391.56 207.85 455.44 207.85 455.44 198.75 455.44 196.89 482.9 196.89 482.9 193.55 487.86 193.55 487.86 189.83 490.4 189.83 490.4 189.83 487.86 189.83 487.86 198.75 487.77 198.75 457.3 198.75 457.3 209.71 430.53 209.71 430.53 268.2 441.56 268.2 441.56 270.04 430.53 270.04 430.53 304.73 439.08 304.73 439.08 306.59 428.67 306.58 428.67 304.79 428.67 304.73 428.67 301.63 428.67 301.63" fill="#636466" fillRule="evenodd"/>
        </g>
        <g id="HATCH-3" data-name="HATCH">
          <path id="Muros-4" data-name="Muros" d="M141.37,235.02h-1.86v40.06s.12.02.12.02l-.12.09v5.39h0v.8s0,.41,0,.41h1.86v-1.49h0s0-45.29,0-45.29M139.63,275.11l-.12-.02v.11l.12-.09Z" fill="#636466" fillRule="evenodd"/>
        </g>
        <g id="HATCH-4" data-name="HATCH">
          <polygon id="Muros-5" data-name="Muros" points="331.12 291.63 322.45 291.63 322.45 292.41 322.45 292.41 322.45 293.21 322.45 293.49 322.45 306.59 324.92 306.59 324.92 300.39 328.64 300.39 328.64 306.59 331.12 306.59 331.12 304.73 331.12 291.63" fill="#636466" fillRule="evenodd"/>
        </g>
        <g id="HATCH-5" data-name="HATCH">
          <polygon id="Muros-6" data-name="Muros" points="331.12 209.71 324.92 209.71 324.92 214.67 324.92 214.67 324.92 245.23 331.12 245.23 331.12 248.95 324.92 248.95 324.92 252.96 324.92 271.39 331.12 271.39 331.12 209.71" fill="#636466" fillRule="evenodd"/>
        </g>
        <g id="HATCH-6" data-name="HATCH">
          <rect id="Muros-7" data-name="Muros" x="361.19" y="124.14" width="1.86" height="65.69" fill="#636466"/>
        </g>
        <g id="HATCH-7" data-name="HATCH">
          <rect id="Muros-8" data-name="Muros" x="552" y="288.49" width="3.72" height="10.66" fill="#636466"/>
        </g>
        <g id="HATCH-8" data-name="HATCH">
          <polygon id="Muros-9" data-name="Muros" points="158.83 278.08 158.83 306.59 160.32 306.59 166.27 282.79 166.27 278.08 158.83 278.08" fill="#636466" fillRule="evenodd"/>
        </g>
        <g id="HATCH-9" data-name="HATCH">
          <polygon id="Muros-10" data-name="Muros" points="223.29 281.8 223.29 306.59 221.8 306.59 215.85 282.79 215.85 281.8 223.29 281.8" fill="#636466" fillRule="evenodd"/>
        </g>
        <g id="HATCH-10" data-name="HATCH">
          <rect id="Muros-11" data-name="Muros" x="477.08" y="157.85" width="7.68" height="1.86" fill="#636466"/>
        </g>
        <g id="HATCH-11" data-name="HATCH">
          <rect id="Muros-12" data-name="Muros" x="477.33" y="119.18" width="5.58" height="4.96" fill="#636466"/>
        </g>
        <g id="HATCH-12" data-name="HATCH">
          <polygon id="Muros-13" data-name="Muros" points="118.43 236.88 129.6 236.88 129.6 235.02 118.43 235.02 116.57 235.02 116.57 236.92 116.57 278.08 118.43 278.08 118.43 236.88" fill="#636466" fillRule="evenodd"/>
        </g>
        <g id="HATCH-13" data-name="HATCH">
          <rect id="Muros-14" data-name="Muros" x="44.8" y="191.69" width="22.56" height="1.86" fill="#636466"/>
        </g>
        <g id="HATCH-14" data-name="HATCH">
          <rect id="Muros-15" data-name="Muros" x="41.08" y="90.17" width="1.86" height="29.38" fill="#636466"/>
        </g>
        <g id="HATCH-15" data-name="HATCH">
          <rect id="Muros-16" data-name="Muros" x="41.08" y="148.06" width="1.86" height="41.77" fill="#636466"/>
        </g>
        <g id="HATCH-16" data-name="HATCH">
          <path id="Muros-17" data-name="Muros" d="M79.38,223.25c.1,0,.2,0,.3,0h1.56v-11.11h-40.16v1.86h.51s.8,0,.8,0h.18s.37,0,.37,0h36.44v9.25Z" fill="#636466" fillRule="evenodd"/>
        </g>
        <g id="HATCH-17" data-name="HATCH">
          <polygon id="Muros-18" data-name="Muros" points="44.8 233.16 44.8 235.02 79.75 235.02 80.09 235.02 80.09 235.02 80.89 235.02 81.61 235.02 81.61 233.16 44.8 233.16" fill="#636466" fillRule="evenodd"/>
        </g>
        <g id="HATCH-18" data-name="HATCH">
          <path id="Muros-19" data-name="Muros" d="M83.47,281.8h31.24v-1.86h-31.24v1.86M102.31,191.69h-18.84v1.86h18.84v-1.86M81.61,189.83h-1.86v-54.17h1.86v54.17M81.61,131.94h-1.86v-54.17h1.86v54.17Z" fill="#636466" fillRule="evenodd"/>
        </g>
        <g id="HATCH-19" data-name="HATCH">
          <rect id="Muros-20" data-name="Muros" x="118.43" y="279.94" width="11.17" height="1.86" fill="#636466"/>
        </g>
        <g id="HATCH-20" data-name="HATCH">
          <path id="Muros-21" data-name="Muros" d="M116.57,231.3h1.86v-19.11s-1.86,0-1.86,0v19.11M116.57,212.19h1.86v-18.64s-1.86,0-1.86,0v18.64M116.57,214v-1.81h-25.41v11.43h1.86v-9.62h23.55M116.57,203.3v-3.79,3.79M101.84,212.19h-3.79,3.79Z" fill="#636466" fillRule="evenodd"/>
        </g>
        <g id="HATCH-21" data-name="HATCH">
          <rect id="Muros-22" data-name="Muros" x="44.8" y="133.8" width="22.56" height="1.86" fill="#636466"/>
        </g>
        <g id="HATCH-22" data-name="HATCH">
          <rect id="Muros-23" data-name="Muros" x="79.75" y="249.9" width="1.86" height="28.18" fill="#636466"/>
        </g>
        <rect id="Muros-24" data-name="Muros" x="451.48" y="268.2" width="1.86" height="38.39" fill="#636466"/>
        <rect id="Muros-25" data-name="Muros" x="484.76" y="108.02" width="1.86" height="11.16" fill="#636466"/>
        <rect id="Muros-26" data-name="Muros" x="44.8" y="86.45" width="34.95" height="1.86" fill="#636466"/>
        <rect id="Muros-27" data-name="Muros" x="553.86" y="248.95" width="1.86" height="39.54" fill="#636466"/>
        <rect id="Muros-28" data-name="Muros" x="386.9" y="306.59" width="3.72" height="3.72" fill="#636466"/>
        <rect id="Muros-29" data-name="Muros" x="421.61" y="306.59" width="3.72" height="3.72" fill="#636466"/>
        <rect x="449.19" y="92.9" width="2.48" height="26.28" fill="#636466"/>
      </g>
      
      {/* Estructura - Actualizado */}
      <g id="Estructura" className="pointer-events-none" fill="#f0f">
        <polyline id="Estructura-2" data-name="Estructura" points="199.98 74.06 203.7 74.06 203.7 80.26 199.98 80.26 199.98 74.06" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-3" data-name="Estructura" points="363.05 193.55 363.05 189.83 355.61 189.83 355.61 193.55 363.05 193.55" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-4" data-name="Estructura" points="199.98 187.35 203.7 187.35 203.7 193.55 199.98 193.55 199.98 187.35" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-5" data-name="Estructura" points="451.48 302.87 455.2 302.87 455.2 306.59 451.48 306.59 451.48 302.87" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-6" data-name="Estructura" points="552 245.23 555.72 245.23 555.72 248.95 552 248.95 552 245.23" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-7" data-name="Estructura" points="166.27 281.8 166.27 278.08 158.83 278.08 158.83 281.8 166.27 281.8" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-8" data-name="Estructura" points="223.29 281.8 223.29 278.08 215.85 278.08 215.85 281.8 223.29 281.8" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-9" data-name="Estructura" points="79.75 189.83 83.47 189.83 83.47 193.55 79.75 193.55 79.75 189.83" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-10" data-name="Estructura" points="386.9 302.87 390.62 302.87 390.62 306.59 386.9 306.59 386.9 302.87" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-11" data-name="Estructura" points="41.08 86.45 44.8 86.45 44.8 90.17 41.08 90.17 41.08 86.45" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-12" data-name="Estructura" points="79.75 131.94 83.47 131.94 83.47 135.66 79.75 135.66 79.75 131.94" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-13" data-name="Estructura" points="41.08 131.94 44.8 131.94 44.8 135.66 41.08 135.66 41.08 131.94" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-14" data-name="Estructura" points="41.08 189.83 44.8 189.83 44.8 193.55 41.08 193.55 41.08 189.83" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-15" data-name="Estructura" points="41.08 231.3 44.8 231.3 44.8 235.02 41.08 235.02 41.08 231.3" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-16" data-name="Estructura" points="114.71 189.83 118.43 189.83 118.43 193.55 114.71 193.55 114.71 189.83" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-17" data-name="Estructura" points="114.71 231.3 118.43 231.3 118.43 235.02 114.71 235.02 114.71 231.3" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-18" data-name="Estructura" points="114.71 278.08 118.43 278.08 118.43 281.8 114.71 281.8 114.71 278.08" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-19" data-name="Estructura" points="79.75 74.06 87.19 74.06 87.19 77.78 79.75 77.78 79.75 74.06" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-20" data-name="Estructura" points="324.88 306.59 328.6 306.59 328.6 300.39 324.88 300.39 324.88 306.59" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-21" data-name="Estructura" points="331.12 248.95 331.12 245.23 324.92 245.23 324.92 248.95 331.12 248.95" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-22" data-name="Estructura" points="361.19 126.61 364.91 126.61 364.91 119.18 361.19 119.18 361.19 126.61" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-23" data-name="Estructura" points="447.95 126.61 451.67 126.61 451.67 119.18 447.95 119.18 447.95 126.61" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-24" data-name="Estructura" points="555.72 209.71 552 209.71 552 217.15 555.72 217.15 555.72 209.71" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-25" data-name="Estructura" points="555.72 299.15 552 299.15 552 306.59 555.72 306.59 555.72 299.15" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-26" data-name="Estructura" points="487.86 193.55 487.86 189.83 480.43 189.83 480.43 193.55 487.86 193.55" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-27" data-name="Estructura" points="431.52 213.43 431.52 209.71 421.61 209.71 421.61 213.43 431.52 213.43" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-28" data-name="Estructura" points="431.52 248.95 431.52 245.23 421.61 245.23 421.61 248.95 431.52 248.95" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-29" data-name="Estructura" points="431.52 306.58 431.52 302.87 421.61 302.87 421.61 306.58 431.52 306.58" fill="#f0f" fillRule="evenodd"/>
        <polyline id="Estructura-30" data-name="Estructura" points="83.47 274.36 79.75 274.36 79.75 281.8 83.47 281.8 83.47 274.36" fill="#f0f" fillRule="evenodd"/>
      </g>
      
      {/* Ventanas - Actualizado */}
      <g id="Ventanas" className="fill-none stroke-blue-300 pointer-events-none stroke-[1px]">
        <polyline id="Ventanas-2" data-name="Ventanas" points="203.7 191.69 355.61 191.69 355.61 193.55 203.7 193.55 203.7 191.69" fillRule="evenodd"/>
        <polyline id="Ventanas-3" data-name="Ventanas" points="361.19 119.18 361.19 92.9 449.19 92.9 449.19 94.76 363.05 94.76 363.05 119.18 361.19 119.18" fillRule="evenodd"/>
        <polyline id="Ventanas-4" data-name="Ventanas" points="555.72 217.15 553.86 217.15 553.86 245.23 555.72 245.23 555.72 217.15" fillRule="evenodd"/>
        <polyline id="Ventanas-5" data-name="Ventanas" points="41.08 214 42.94 214 42.94 231.3 41.08 231.3 41.08 214" fillRule="evenodd"/>
        <polyline id="Ventanas-6" data-name="Ventanas" points="42.94 148.06 41.08 148.06 41.08 135.66 42.94 135.66 42.94 148.06" fillRule="evenodd"/>
        <polyline id="Ventanas-7" data-name="Ventanas" points="42.94 119.55 41.08 119.55 41.08 131.94 42.94 131.94 42.94 119.55" fillRule="evenodd"/>
        <polyline id="Ventanas-8" data-name="Ventanas" points="79.75 249.9 81.61 249.9 81.61 235.02 79.75 235.02 79.75 249.9" fillRule="evenodd"/>
        <polyline id="Ventanas-9" data-name="Ventanas" points="57.14 199.74 55.28 199.74 55.28 193.55 57.14 193.55 57.14 199.74" fillRule="evenodd"/>
        <polyline id="Ventanas-10" data-name="Ventanas" points="553.86 209.71 555.72 209.71 555.72 191.68 553.86 191.68 553.86 209.71" fillRule="evenodd"/>
        <polyline id="Ventanas-11" data-name="Ventanas" points="451.67 92.9 484.76 92.9 484.76 94.76 451.67 94.76 451.67 92.9" fillRule="evenodd"/>
        <polyline id="Ventanas-12" data-name="Ventanas" points="486.62 124.13 484.76 124.13 484.76 174.57 486.62 174.57 486.62 124.13" fillRule="evenodd"/>
        <polyline id="Ventanas-13" data-name="Ventanas" points="484.76 176.42 486.62 176.42 486.62 189.83 484.76 189.83 484.76 176.42" fillRule="evenodd"/>
        <polyline id="Ventanas-14" data-name="Ventanas" points="223.29 291.63 322.45 291.63 322.45 293.49 223.29 293.49 223.29 291.63" fillRule="evenodd"/>
        <polyline id="Ventanas-15" data-name="Ventanas" points="87.19 75.92 199.98 75.92 199.98 74.06 87.19 74.06 87.19 75.92" fillRule="evenodd"/>
        <polyline id="Ventanas-16" data-name="Ventanas" points="201.84 187.35 203.7 187.35 203.7 80.26 201.84 80.26 201.84 187.35" fillRule="evenodd"/>
        <polyline id="Ventanas-17" data-name="Ventanas" points="527.21 293.49 453.34 293.49 453.34 291.63 527.21 291.63 527.21 293.49" fillRule="evenodd"/>
        <polyline id="Ventanas-18" data-name="Ventanas" points="487.86 191.69 555.72 191.69 555.72 189.83 487.86 189.83 487.86 191.69" fillRule="evenodd"/>
        <polyline id="Ventanas-19" data-name="Ventanas" points="331.12 304.73 386.9 304.74 386.9 306.59 331.12 306.59 331.12 304.73" fillRule="evenodd"/>
        <rect id="Ventanas-20" data-name="Ventanas" x="484.76" y="94.76" width="1.86" height="13.27"/>
        <polyline points="166.28 281.8 166.28 278.08 158.84 278.08 158.84 281.8 166.28 281.8" fill="#f0f" fillRule="evenodd"/>
      </g>
      
      {/* Frame - Nuevo */}
      <g id="Frame" className="pointer-events-none">
        <rect id="Frame-2" data-name="Frame" x=".5" y=".5" width="587.05" height="325.07" fill="none" stroke="#000" strokeMiterlimit="10"/>
      </g>
      
      {/* Muebles Fijos - ¡INTERACTIVOS! */}
      <g id="Muebles_Fijos" data-name="Muebles Fijos">
        <polygon id="MuebleDespensa" points="42.94 189.83 42.94 154.46 49.14 154.46 49.14 185.86 67.37 185.86 67.37 191.69 44.8 191.69 44.8 189.83 42.94 189.83" 
          fillRule="evenodd"
          className={getRoomClassName('MuebleDespensa', selectedRoom)}
          onClick={() => onRoomClick('MuebleDespensa')}
        />
        <polygon id="MuebleCocina" points="83.47 191.69 90.08 191.69 90.08 75.92 87.19 75.92 87.19 77.78 81.61 77.78 81.61 131.94 83.5 131.94 83.5 135.66 81.61 135.66 81.61 189.83 83.47 189.83 83.47 191.69" 
          fillRule="evenodd"
          className={getRoomClassName('MuebleCocina', selectedRoom)}
          onClick={() => onRoomClick('MuebleCocina')}
        />
        <polygon id="MuebleRopas" points="79.75 88.31 79.76 95.75 50.38 95.75 50.38 114.67 42.95 114.67 42.95 90.17 44.8 90.17 44.8 88.31 79.75 88.31" 
          fillRule="evenodd"
          className={getRoomClassName('MuebleRopas', selectedRoom)}
          onClick={() => onRoomClick('MuebleRopas')}
        />
        <rect id="MuebleRopas-2" data-name="MuebleRopas" x="42.94" y="116.3" width="7.44" height="15.65"
          className={getRoomClassName('MuebleRopas-2', selectedRoom)}
          onClick={() => onRoomClick('MuebleRopas-2')}
        />
        <rect id="ClosetServicio" x="93.02" y="214" width="23.56" height="8.65"
          className={getRoomClassName('ClosetServicio', selectedRoom)}
          onClick={() => onRoomClick('ClosetServicio')}
        />
        <polygon id="ClosetServicio-2" data-name="ClosetServicio" points="81.61 274.36 81.62 272.87 116.57 272.87 116.57 278.08 114.71 278.08 114.71 279.94 83.47 279.94 83.47 274.36 81.61 274.36" 
          fillRule="evenodd"
          className={getRoomClassName('ClosetServicio-2', selectedRoom)}
          onClick={() => onRoomClick('ClosetServicio-2')}
        />
        <rect id="MuebleBañoHabitacionPrincipal" x="477.09" y="124.13" width="7.68" height="33.71"
          className={getRoomClassName('MuebleBañoHabitacionPrincipal', selectedRoom)}
          onClick={() => onRoomClick('MuebleBañoHabitacionPrincipal')}
        />
        <rect id="MuebleBañoSocial" x="118.43" y="236.88" width="6.16" height="15.2"
          className={getRoomClassName('MuebleBañoSocial', selectedRoom)}
          onClick={() => onRoomClick('MuebleBañoSocial')}
        />
        <polygon id="MuebleHabitacionPrincipal" points="449.19 94.76 445.23 94.76 445.23 157.85 451.68 157.85 451.68 126.61 448.45 126.61 448.45 119.18 449.19 119.18 449.19 94.76" 
          fillRule="evenodd"
          className={getRoomClassName('MuebleHabitacionPrincipal', selectedRoom)}
          onClick={() => onRoomClick('MuebleHabitacionPrincipal')}
        />
        <polygon id="MuebleClosetHabitacionPrincipal" points="391.56 176.42 391.56 207.85 455.44 207.85 455.44 200.41 399 200.41 399 176.42 391.56 176.42" 
          fillRule="evenodd"
          className={getRoomClassName('MuebleClosetHabitacionPrincipal', selectedRoom)}
          onClick={() => onRoomClick('MuebleClosetHabitacionPrincipal')}
        />
        <polygon id="MuebleClosetHabitacionPrincipal-2" data-name="MuebleClosetHabitacionPrincipal" points="455.45 196.89 455.45 189.83 480.43 189.83 480.43 193.55 482.9 193.55 482.9 196.89 455.45 196.89" 
          fillRule="evenodd"
          className={getRoomClassName('MuebleClosetHabitacionPrincipal-2', selectedRoom)}
          onClick={() => onRoomClick('MuebleClosetHabitacionPrincipal-2')}
        />
        <rect id="CocinetaOficina" x="457.3" y="198.75" width="30.57" height="7.44"
          className={getRoomClassName('CocinetaOficina', selectedRoom)}
          onClick={() => onRoomClick('CocinetaOficina')}
        />
        <rect id="MuebleEstudioPiso1" x="331.13" y="212.84" width="11.11" height="55.43"
          className={getRoomClassName('MuebleEstudioPiso1', selectedRoom)}
          onClick={() => onRoomClick('MuebleEstudioPiso1')}
        />
        <polygon id="ClosetOficina" points="431.52 209.71 431.52 213.43 430.54 213.43 430.54 245.23 431.52 245.23 431.52 248.95 430.53 248.95 430.53 268.2 437.97 268.2 437.97 209.71 431.52 209.71" 
          fillRule="evenodd"
          className={getRoomClassName('ClosetOficina', selectedRoom)}
          onClick={() => onRoomClick('ClosetOficina')}
        />
        <rect id="MuebleEstudioPiso1-2" data-name="MuebleEstudioPiso1" x="421.61" y="248.95" width="7.06" height="53.92"
          className={getRoomClassName('MuebleEstudioPiso1-2', selectedRoom)}
          onClick={() => onRoomClick('MuebleEstudioPiso1-2')}
        />
        <rect id="MuebleEstudioPiso1-3" data-name="MuebleEstudioPiso1" x="421.61" y="213.43" width="7.06" height="31.8"
          className={getRoomClassName('MuebleEstudioPiso1-3', selectedRoom)}
          onClick={() => onRoomClick('MuebleEstudioPiso1-3')}
        />
      </g>

      {/* --- INICIO: Capa de Etiquetas Dinámicas --- */}
      {/* Esta capa renderiza las etiquetas sobre todo lo demás */}
      <g id="Capa_Labels">
        {Object.keys(ROOM_CENTERS).map(roomId => (
          <RoomLabel
            key={roomId}
            roomId={roomId}
            // Asigna el conteo calculado desde taskCountByRoom
            count={taskCountByRoom[roomId] || 0}
            isSelected={selectedRoom === roomId}
          />
        ))}
      </g>
      {/* --- FIN: Capa de Etiquetas Dinámicas --- */}

    </svg>
  );
}