// ARCHIVO: FloorPlan1.jsx

import React from 'react';

// IDs de las habitaciones que tienen opacidad en tu SVG
const roomsWithOpacity = [
  'HabitacionPrincipal', 'BalconOficina', 'Oficina', 'ClosetHabitacionPrincipal', 
  'Piscina', 'Servicios', 'EtudioPiso1', 'Sala', 'Comedor', 'Acceso', 'Deck'
];

/**
 * Función para asignar clases de Tailwind dinámicamente
 */
const getRoomClassName = (roomId, selectedRoom) => {
  const baseClasses = "stroke-gray-900 stroke-[1px] cursor-pointer transition-all duration-200";
  const opacityClass = roomsWithOpacity.includes(roomId) ? 'opacity-50' : 'opacity-100';

  if (selectedRoom === roomId) {
    return `${baseClasses} fill-blue-500 ${opacityClass}`;
  }
  return `${baseClasses} fill-white hover:fill-blue-200 ${opacityClass}`;
};

export function FloorPlan1({ selectedRoom, onRoomClick }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 514.64 296.89" width="100%">
      {/* Capa 2: Habitaciones (Interactivas) */}
      <g id="Capa_2">
        <polygon id="HabitacionPrincipal" points="323.83 176.41 321.97 176.41 321.97 110.71 323.83 110.71 323.83 105.75 321.97 105.75 321.97 81.34 404.15 81.34 404.15 144.43 410.6 144.43 410.6 161.14 348.62 161.14 348.62 176.41 331.84 176.41 323.83 176.41"
          fillRule="evenodd"
          className={getRoomClassName('HabitacionPrincipal', selectedRoom)}
          onClick={() => onRoomClick('HabitacionPrincipal')}
        />
        <rect id="Cocina" x="48.99" y="62.5" width="43.92" height="115.77"
          className={getRoomClassName('Cocina', selectedRoom)}
          onClick={() => onRoomClick('Cocina')}
        />
        <polygon id="BalconOficina" points="412.26 280.06 412.26 293.17 510.92 293.15 510.92 278.2 486.13 278.2 486.13 280.06 412.26 280.06"
          fillRule="evenodd"
          className={getRoomClassName('BalconOficina', selectedRoom)}
          onClick={() => onRoomClick('BalconOficina')}
        />
        <polygon id="Oficina" points="396.89 196.29 396.89 254.77 412.26 254.77 412.26 278.2 510.92 278.21 510.92 275.07 512.78 275.07 512.78 244.63 512.78 244.63 512.78 239.67 512.78 239.68 512.78 203.73 510.92 203.72 510.92 196.29 512.78 196.29 512.78 178.27 446.79 178.27 446.79 192.77 416.23 192.77 416.23 196.29 396.89 196.29"
          fillRule="evenodd"
          className={getRoomClassName('Oficina', selectedRoom)}
          onClick={() => onRoomClick('Oficina')}
        />
        <polygon id="ClosetHabitacionPrincipal" points="357.92 163 357.92 186.99 414.37 186.99 414.37 176.41 443.69 176.41 443.69 163 357.92 163"
          fillRule="evenodd"
          className={getRoomClassName('ClosetHabitacionPrincipal', selectedRoom)}
          onClick={() => onRoomClick('ClosetHabitacionPrincipal')}
        />
        <path id="Piscina" d="m316.45,0h-93.62v79.11h49.58v61.97h-6.2v33.52h50.24V0m-50.24,141.08h-8.68v33.52h8.68v-33.52m-8.68,0h-8.68v33.52h8.68v-33.52m-17.35,0h-8.68v33.52h8.68v-33.52m-8.68,0h-8.68v33.52h8.68v-33.52m17.35,0h-8.68v33.52h8.68v-33.52Z"
          fillRule="evenodd"
          className={getRoomClassName('Piscina', selectedRoom)}
          onClick={() => onRoomClick('Piscina')}
        />
        <polygon id="Servicios" points="40.54 219.74 40.54 259.45 75.49 259.45 75.49 221.6 73.63 221.6 73.63 217.88 75.49 217.88 75.49 209.23 51.94 209.23 51.94 210.2 50.08 210.2 50.08 198.72 75.49 198.72 75.49 180.12 73.63 180.12 73.63 178.26 61.24 178.26 61.24 180.12 38.68 180.12 38.68 82.33 9.3 82.33 9.3 101.25 1.87 101.25 1.87 102.88 9.3 102.88 9.3 118.52 3.73 118.52 3.73 120.38 26.28 120.38 26.28 122.24 1.87 122.24 1.87 141.03 8.06 141.03 8.06 172.44 26.28 172.44 26.28 180.12 16.07 180.12 16.07 186.32 14.21 186.32 14.21 180.12 0 180.12 0 198.72 40.17 198.72 40.17 219.74 40.54 219.74"
          fillRule="evenodd"
          className={getRoomClassName('Servicios', selectedRoom)}
          onClick={() => onRoomClick('Servicios')}
        />
        <polygon id="BañoOficina" points="389.46 256.62 389.55 291.31 410.4 291.31 410.4 254.77 400.49 254.77 400.49 256.62 389.46 256.62"
          fillRule="evenodd"
          className={getRoomClassName('BañoOficina', selectedRoom)}
          onClick={() => onRoomClick('BañoOficina')}
        />
        <polygon id="BañoHabitacionPrincipal" points="410.6 110.71 410.59 161.14 424.6 161.14 424.6 144.43 426.46 144.43 426.46 161.14 443.69 161.14 443.69 146.29 436.01 146.29 436.01 144.43 436.24 144.43 436.25 110.71 410.6 110.71"
          fillRule="evenodd"
          className={getRoomClassName('BañoHabitacionPrincipal', selectedRoom)}
          onClick={() => onRoomClick('BañoHabitacionPrincipal')}
        />
        <rect id="Escalera" x="349.54" y="236.15" width="30.99" height="55.16"
          className={getRoomClassName('Escalera', selectedRoom)}
          onClick={() => onRoomClick('Escalera')}
        />
        <polygon id="EtudioPiso1" points="323.83 180.12 283.85 180.13 283.85 196.29 290.05 196.29 290.05 199.42 301.16 199.42 301.16 254.84 290.05 254.84 290.05 257.97 283.85 257.97 283.85 278.2 290.05 278.2 290.04 291.31 345.82 291.31 345.82 289.45 349.54 289.45 349.54 236.15 380.53 236.15 380.53 196.29 348.62 196.29 348.62 180.12 323.83 180.12"
          fillRule="evenodd"
          className={getRoomClassName('EtudioPiso1', selectedRoom)}
          onClick={() => onRoomClick('EtudioPiso1')}
        />
        <polygon id="Sala" points="77.35 180.11 77.35 221.6 100.3 221.6 100.3 266.52 117.76 266.52 117.76 264.66 125.19 264.66 125.19 267.44 174.77 267.44 174.77 264.66 182.21 264.66 182.21 180.12 158.91 180.12 77.35 180.11"
          fillRule="evenodd"
          className={getRoomClassName('Sala', selectedRoom)}
          onClick={() => onRoomClick('Sala')}
        />
        <polygon id="Comedor" points="92.92 62.5 92.92 178.26 160.55 178.26 160.55 66.83 158.69 66.83 158.69 62.5 92.92 62.5"
          fillRule="evenodd"
          className={getRoomClassName('Comedor', selectedRoom)}
          onClick={() => onRoomClick('Comedor')}
        />
        <path id="JardinInterior" d="m254.2,203.7h27.17v-23.57h-99.16s0,84.53,0,84.53v13.55h99.16v-1.31h-7.65v-34.17h7.65v-3.19h-27.17v-35.84m-19.5,39.03v34.17h-8.69v-34.17h8.69m3.23,0h8.69v34.17h-8.69v-34.17m-15.16,0v34.17h-8.69v-34.17h8.69m27.09,0h8.69v34.17h-8.69v-34.17m-39.02,0v34.17h-27.16v-34.17h27.16m50.94,0h8.69v34.17h-8.69v-34.17Z"
          fillRule="evenodd"
          className={getRoomClassName('JardinInterior', selectedRoom)}
          onClick={() => onRoomClick('JardinInterior')}
        />
        <polygon id="Acceso" points="180.72 293.17 174.66 268.93 125.31 268.93 119.25 293.17 180.72 293.17"
          fillRule="evenodd"
          className={getRoomClassName('Acceso', selectedRoom)}
          onClick={() => onRoomClick('Acceso')}
        />
        <rect id="Deck" x="162.63" y="60.64" width="56.54" height="117.63"
          className={getRoomClassName('Deck', selectedRoom)}
          onClick={() => onRoomClick('Deck')}
        />
      </g>
      
      {/* --- CAPAS ESTÁTICAS (NO INTERACTIVAS) --- */}
      <g id="Capa_3" className="fill-gray-600 pointer-events-none" fill="#636466">
        <g id="HATCH"><polygon id="Muros" points="445.54 161.15 426.45 161.15 426.45 144.43 424.59 144.43 424.59 161.15 408.11 161.14 408.11 163 443.68 163 443.68 163 445.54 163 445.54 161.15" fillRule="evenodd"/></g>
        <g id="HATCH-2"><polygon id="Muros-2" points="387.59 288.21 387.59 288.21 387.59 235.53 384.24 235.53 384.24 231.81 387.59 231.81 387.59 200.01 384.24 200.01 384.24 196.29 348.61 196.29 348.61 161.14 359.52 161.14 359.52 163 350.47 163 350.47 194.43 414.36 194.43 414.36 185.33 414.36 183.47 441.82 183.47 441.82 180.13 446.78 180.13 446.78 176.41 449.32 176.41 449.32 176.41 446.78 176.41 446.78 185.33 446.68 185.33 416.22 185.33 416.22 196.29 389.45 196.29 389.45 254.77 400.48 254.77 400.48 256.62 389.45 256.62 389.45 291.31 398 291.31 398 293.17 387.59 293.16 387.59 291.37 387.59 291.31 387.59 288.21 387.59 288.21" fillRule="evenodd"/></g>
        <g id="HATCH-3"><path id="Muros-3" d="m100.29,221.6h-1.86v40.06s.12.02.12.02l-.12.09v5.39h0v.8s0,.41,0,.41h1.86v-1.49h0s0-45.29,0-45.29m-1.74,40.08l-.12-.02v.11l.12-.09Z" fillRule="evenodd"/></g>
        <g id="HATCH-4"><polygon id="Muros-4" points="290.04 278.21 281.36 278.21 281.36 278.99 281.36 278.99 281.36 279.79 281.36 280.06 281.36 293.17 283.84 293.17 283.84 286.97 287.56 286.97 287.56 293.17 290.04 293.17 290.04 291.31 290.04 278.21" fillRule="evenodd"/></g>
        <g id="HATCH-5"><polygon id="Muros-5" points="290.04 196.29 283.84 196.29 283.84 201.25 283.84 201.25 283.84 231.81 290.04 231.81 290.04 235.53 283.84 235.53 283.84 239.54 283.84 257.97 290.04 257.97 290.04 196.29" fillRule="evenodd"/></g>
        <g id="HATCH-6"><rect id="Muros-6" x="320.11" y="110.71" width="1.86" height="65.69"/></g>
        <g id="HATCH-7"><rect id="Muros-7" x="510.92" y="275.07" width="3.72" height="10.66"/></g>
        <g id="HATCH-8"><polygon id="Muros-8" points="117.75 264.66 117.75 293.17 119.24 293.17 125.19 269.37 125.19 264.66 117.75 264.66" fillRule="evenodd"/></g>
        <g id="HATCH-9"><polygon id="Muros-9" points="182.2 268.38 182.2 293.17 180.72 293.17 174.77 269.37 174.77 268.38 182.2 268.38" fillRule="evenodd"/></g>
        <g id="HATCH-10"><rect id="Muros-10" x="436" y="144.43" width="7.68" height="1.86"/></g>
        <g id="HATCH-11"><rect id="Muros-11" x="436.25" y="105.76" width="5.58" height="4.96"/></g>
        <g id="HATCH-12"><polygon id="Muros-12" points="77.34 223.46 88.52 223.46 88.52 221.6 77.34 221.6 75.48 221.6 75.48 223.5 75.48 264.66 77.34 264.66 77.34 223.46" fillRule="evenodd"/></g>
        <g id="HATCH-13"><rect id="Muros-13" x="3.72" y="178.27" width="22.56" height="1.86"/></g>
        <g id="HATCH-14"><rect id="Muros-14" y="76.75" width="1.86" height="29.38"/></g>
        <g id="HATCH-15"><rect id="Muros-15" y="134.64" width="1.86" height="41.77"/></g>
        <g id="HATCH-16"><path id="Muros-16" d="m38.3,209.83c.1,0,.2,0,.3,0h1.56v-11.11H0v1.86h.51s.8,0,.8,0h.18s.37,0,.37,0h36.44v9.25Z" fillRule="evenodd"/></g>
        <g id="HATCH-17"><polygon id="Muros-17" points="3.72 219.74 3.72 221.6 38.67 221.6 39.01 221.6 39.01 221.6 39.81 221.6 40.53 221.6 40.53 219.74 3.72 219.74" fillRule="evenodd"/></g>
        <g id="HATCH-18"><rect id="Muros-18" x="3.72" y="73.03" width="34.95" height="1.86"/></g>
        <g id="HATCH-19"><path id="Muros-19" d="m42.39,268.38h31.24v-1.86h-31.24v1.86m18.84-90.11h-18.84v1.86h18.84v-1.86m-20.7-1.86h-1.86v-54.17h1.86v54.17m0-57.88h-1.86v-54.17h1.86v54.17Z" fillRule="evenodd"/></g>
        <g id="HATCH-20"><rect id="Muros-20" x="77.34" y="266.52" width="11.17" height="1.86"/></g>
        <g id="HATCH-21"><path id="Muros-21" d="m75.48,217.88h1.86v-19.11s-1.86,0-1.86,0v19.11m0-19.11h1.86v-18.64s-1.86,0-1.86,0v18.64m0,1.81v-1.81h-25.41v11.43h1.86v-9.62h23.55m0-10.7v-3.79,3.79m-14.72,8.89h-3.79,3.79Z" fillRule="evenodd"/></g>
        <g id="HATCH-22"><rect id="Muros-22" x="3.72" y="120.38" width="22.56" height="1.86"/></g>
        <g id="HATCH-23"><rect id="Muros-23" x="38.67" y="236.48" width="1.86" height="28.18"/></g>
        <rect id="Muros-24" x="410.4" y="254.77" width="1.86" height="38.39"/>
        <rect id="Muros-25" x="443.68" y="94.6" width="1.86" height="11.16"/>
        <rect id="Muros-26" x="512.78" y="235.53" width="1.86" height="39.54"/>
        <rect id="Muros-27" x="345.82" y="293.17" width="3.72" height="3.72"/>
        <rect id="Muros-28" x="380.52" y="293.17" width="3.72" height="3.72"/>
      </g>
      <g id="Capa_4" className="pointer-events-none" fill="#f0f">
        <polyline id="Estructura" points="158.9 60.64 162.62 60.64 162.62 66.84 158.9 66.84 158.9 60.64" fillRule="evenodd"/>
        <polyline id="Estructura-2" points="321.97 180.13 321.97 176.41 314.53 176.41 314.53 180.13 321.97 180.13" fillRule="evenodd"/>
        <polyline id="Estructura-3" points="158.9 173.93 162.62 173.93 162.62 180.13 158.9 180.13 158.9 173.93" fillRule="evenodd"/>
        <polyline id="Estructura-4" points="410.4 289.45 414.11 289.45 414.11 293.17 410.4 293.17 410.4 289.45" fillRule="evenodd"/>
        <polyline id="Estructura-5" points="510.92 231.81 514.64 231.81 514.64 235.53 510.92 235.53 510.92 231.81" fillRule="evenodd"/>
        <polyline id="Estructura-6" points="125.19 268.38 125.19 264.66 117.75 264.66 117.75 268.38 125.19 268.38" fillRule="evenodd"/>
        <polyline id="Estructura-7" points="182.2 268.38 182.2 264.66 174.77 264.66 174.77 268.38 182.2 268.38" fillRule="evenodd"/>
        <polyline id="Estructura-8" points="38.67 176.41 42.39 176.41 42.39 180.13 38.67 180.13 38.67 176.41" fillRule="evenodd"/>
        <polyline id="Estructura-9" points="345.82 289.45 349.54 289.45 349.54 293.17 345.82 293.17 345.82 289.45" fillRule="evenodd"/>
        <polyline id="Estructura-10" points="0 73.03 3.72 73.03 3.72 76.75 0 76.75 0 73.03" fillRule="evenodd"/>
        <polyline id="Estructura-11" points="38.67 118.52 42.39 118.52 42.39 122.24 38.67 122.24 38.67 118.52" fillRule="evenodd"/>
        <polyline id="Estructura-12" points="0 118.52 3.72 118.52 3.72 122.24 0 122.24 0 118.52" fillRule="evenodd"/>
        <polyline id="Estructura-13" points="0 176.41 3.72 176.41 3.72 180.13 0 180.13 0 176.41" fillRule="evenodd"/>
        <polyline id="Estructura-14" points="0 217.88 3.72 217.88 3.72 221.6 0 221.6 0 217.88" fillRule="evenodd"/>
        <polyline id="Estructura-15" points="73.63 176.41 77.34 176.41 77.34 180.13 73.63 180.13 73.63 176.41" fillRule="evenodd"/>
        <polyline id="Estructura-16" points="73.63 217.88 77.34 217.88 77.34 221.6 73.63 221.6 73.63 217.88" fillRule="evenodd"/>
        <polyline id="Estructura-17" points="73.63 264.66 77.34 264.66 77.34 268.38 73.63 268.38 73.63 264.66" fillRule="evenodd"/>
        <polyline id="Estructura-18" points="38.67 60.64 38.67 64.36 46.11 64.36 46.11 60.64 38.67 60.64" fillRule="evenodd"/>
        <polyline id="Estructura-19" points="283.8 293.17 287.52 293.17 287.52 286.97 283.8 286.97 283.8 293.17" fillRule="evenodd"/>
        <polyline id="Estructura-20" points="290.04 235.53 290.04 231.81 283.84 231.81 283.84 235.53 290.04 235.53" fillRule="evenodd"/>
        <polyline id="Estructura-21" points="320.11 113.19 323.82 113.19 323.82 105.76 320.11 105.76 320.11 113.19" fillRule="evenodd"/>
        <polyline id="Estructura-22" points="406.87 113.19 410.59 113.19 410.59 105.76 406.87 105.76 406.87 113.19" fillRule="evenodd"/>
        <polyline id="Estructura-23" points="514.64 196.29 510.92 196.29 510.92 203.73 514.64 203.73 514.64 196.29" fillRule="evenodd"/>
        <polyline id="Estructura-24" points="514.64 285.73 510.92 285.73 510.92 293.17 514.64 293.17 514.64 285.73" fillRule="evenodd"/>
        <polyline id="Estructura-25" points="446.78 180.13 446.78 176.41 439.34 176.41 439.34 180.13 446.78 180.13" fillRule="evenodd"/>
        <polyline id="Estructura-26" points="390.44 200.01 390.44 196.29 380.52 196.29 380.52 200.01 390.44 200.01" fillRule="evenodd"/>
        <polyline id="Estructura-27" points="390.44 235.53 390.44 231.81 380.52 231.81 380.52 235.53 390.44 235.53" fillRule="evenodd"/>
        <polyline id="Estructura-28" points="390.44 293.16 390.44 289.44 380.52 289.44 380.52 293.16 390.44 293.16" fillRule="evenodd"/>
        <polyline id="Estructura-29" points="42.39 260.94 38.67 260.94 38.67 268.38 42.39 268.38 42.39 260.94" fillRule="evenodd"/>
      </g>
      <g id="Capa_5" className="fill-none stroke-blue-300 pointer-events-none stroke-[1px]" fill="none" stroke="#00aeef">
        <polyline id="Ventanas" points="162.62 178.27 314.53 178.27 314.53 180.13 162.62 180.13 162.62 178.27" fillRule="evenodd"/>
        <polyline id="Ventanas-2" points="320.11 105.76 320.11 79.48 408.11 79.48 408.11 81.34 321.96 81.34 321.96 105.76 320.11 105.76" fillRule="evenodd"/>
        <polyline id="Ventanas-3" points="514.64 203.73 512.78 203.73 512.78 231.81 514.64 231.81 514.64 203.73" fillRule="evenodd"/>
        <polyline id="Ventanas-4" points="0 200.58 1.86 200.58 1.86 217.88 0 217.88 0 200.58" fillRule="evenodd"/>
        <polyline id="Ventanas-5" points="1.86 134.64 0 134.64 0 122.24 1.86 122.24 1.86 134.64" fillRule="evenodd"/>
        <polyline id="Ventanas-6" points="1.86 106.13 0 106.13 0 118.52 1.86 118.52 1.86 106.13" fillRule="evenodd"/>
        <polyline id="Ventanas-7" points="38.67 236.48 40.53 236.48 40.53 221.6 38.67 221.6 38.67 236.48" fillRule="evenodd"/>
        <polyline id="Ventanas-8" points="16.06 186.32 14.2 186.32 14.2 180.13 16.06 180.13 16.06 186.32" fillRule="evenodd"/>
        <polyline id="Ventanas-9" points="512.78 196.29 514.64 196.29 514.64 178.26 512.78 178.26 512.78 196.29" fillRule="evenodd"/>
        <polyline id="Ventanas-10" points="410.59 79.48 443.68 79.48 443.68 81.34 410.59 81.34 410.59 79.48" fillRule="evenodd"/>
        <polyline id="Ventanas-11" points="445.54 110.71 443.68 110.71 443.68 161.14 445.54 161.14 445.54 110.71" fillRule="evenodd"/>
        <polyline id="Ventanas-12" points="443.68 163 445.54 163 445.54 176.41 443.68 176.41 443.68 163" fillRule="evenodd"/>
        <polyline id="Ventanas-13" points="182.2 278.21 281.36 278.21 281.36 280.06 182.2 280.06 182.2 278.21" fillRule="evenodd"/>
        <polyline id="Ventanas-14" points="46.11 62.5 158.9 62.5 158.9 60.64 46.11 60.64 46.11 62.5" fillRule="evenodd"/>
        <polyline id="Ventanas-15" points="160.76 173.93 162.62 173.93 162.62 66.84 160.76 66.84 160.76 173.93" fillRule="evenodd"/>
        <polyline id="Ventanas-16" points="486.13 280.06 412.26 280.06 412.26 278.21 486.13 278.21 486.13 280.06" fillRule="evenodd"/>
        <polyline id="Ventanas-17" points="446.78 178.27 514.64 178.27 514.64 176.41 446.78 176.41 446.78 178.27" fillRule="evenodd"/>
        <polyline id="Ventanas-18" points="290.04 291.31 345.82 291.31 345.82 293.17 290.04 293.17 290.04 291.31" fillRule="evenodd"/>
        <rect id="Ventanas-19" x="443.68" y="81.33" width="1.86" height="13.27"/>
      </g>
    </svg>
  );
}