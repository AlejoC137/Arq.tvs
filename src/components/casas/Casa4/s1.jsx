// ARCHIVO: s1.jsx - Sótano para Casa 4
import React from 'react';

const S1Casa4 = ({ onRoomSelect, selectedRoom, tasks = [] }) => {
  const handleRoomClick = (roomId) => {
    console.log('[S1Casa4] Habitación clickeada:', roomId);
    if (onRoomSelect) {
      onRoomSelect(roomId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 px-4">Sótano - Casa 4</h3>
      <div className="flex-grow w-full h-full overflow-auto">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 395.35 343.41">
  <g id="_-A0-Estructura" data-name="-A0-Estructura">
    <rect x="283.57" y="111.57" width="7.5" height="4.37" transform="translate(11.74 253.57) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="276.95" y="119.05" width="7.5" height="4.37" transform="translate(3.9 251.13) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="123.03" y="156.34" width="7.5" height="4.37" transform="translate(-75.96 148.44) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="194.35" y="271.17" width="7.5" height="3.75" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="348.44" y="271.17" width="7.5" height="3.75" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="258.8" y="271.17" width="7.5" height="3.75" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="191.1" y="216.87" width="7.5" height="3.75" transform="translate(-98.09 219.73) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="348.44" y="187.47" width="7.5" height="3.75" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="352.18" y="124.67" width="3.75" height="7.5" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="276.79" y="183.72" width="3.75" height="7.5" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="89.07" y="156.14" width="3.75" height="3.75" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <g id="_-A0-Proy" data-name="-A0-Proy">
    <rect x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="#ff7f00" strokeDasharray="3.12 2.08" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <g id="_-A0-Muros" data-name="-A0-Muros">
    <polygon points="123.21 181.98 117.59 177.02 116.35 178.42 121.96 183.39 107 200.3 101.39 195.33 100.15 196.74 107.16 202.95 135.34 171.1 190.96 220.31 192.21 218.92 126.72 160.97 125.46 162.36 133.93 169.86 123.21 181.98 123.21 181.98" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="345.13" y="271.17" width="3.31" height="3.75" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="354.06 271.17 354.06 216.2 348.44 216.2 348.44 214.32 354.06 214.32 354.06 191.21 355.93 191.21 355.93 271.17 354.06 271.17" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="314.27 273.05 314.27 230.56 319.89 230.56 319.89 228.69 312.39 228.69 312.39 274.92 319.89 274.92 319.89 273.05 314.27 273.05 314.27 273.05" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="177.23 240.54 198.85 240.54 198.85 238.68 175.54 238.68 150.04 267.5 151.91 269.16 177.23 240.54" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="82.26" y="205.72" width="2.5" height="2.5" transform="translate(-126.84 132.37) rotate(-48.5)" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="195.93 191.21 195.93 189.34 276.79 189.34 276.79 191.21 221.76 191.21 198.72 217.17 197.32 215.93 219.25 191.21 195.93 191.21" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M227.58,273.05h6.24v1.87h-31.98v-1.87h23.87s0-32.49,0-32.49h-14.37v-1.87h14.37s0-26.23,0-26.23c0-2.76,2.24-5,5-5h15.74s-.05,8.75-.05,8.75h-1.87l.04-6.89h-13.78c-1.73-.03-3.16,1.34-3.2,3.07,0,.03,0,.06,0,.09v60.57Z" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="312.39 209.33 270.92 209.32 270.88 216.2 269.01 216.2 269.06 207.45 312.39 207.45 312.39 191.21 280.54 191.21 280.54 189.34 348.44 189.34 348.44 191.21 314.27 191.21 314.27 214.32 324.89 214.32 324.89 216.2 312.39 216.2 312.39 209.33" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="28.4" y="156.14" width="60.67" height="3.75" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="92.82 159.88 122.66 159.88 125.98 156.14 92.82 156.14 92.82 159.88" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <g id="_-A0-Pisos_Espacios_" data-name="-A0-Pisos( Espacios )">
    <rect id="Frame" x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="#ff7f00" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon 
      id="BañoSotano" 
      points="92.1 212.9 65.96 189.78 92.82 159.88 122.66 159.88 133.93 169.86 123.21 181.98 117.59 177.02 100.15 196.74 103.65 199.84 92.1 212.9" 
      fill={selectedRoom === 'BañoSotano' ? '#4ade80' : 'none'} 
      stroke="#ff7f00" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth=".71"
      onClick={() => handleRoomClick('BañoSotano')}
      className="cursor-pointer hover:fill-teal-100 transition-all"
    />
  </g>
  <g id="_-A0-Ventanas" data-name="-A0-Ventanas">
    <rect x="233.82" y="273.05" width="24.98" height="1.88" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="266.3" y="273.05" width="46.09" height="1.87" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="319.9" y="273.05" width="25.22" height="1.87" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="71.66" y="184.71" width="2.5" height="25.78" transform="translate(-123.41 121.31) rotate(-48.51)" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="116.41" y="192.84" width="2.5" height="88.69" transform="translate(-137.94 168.14) rotate(-48.5)" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polygon points="64.09 188.12 89.07 159.88 92.41 159.88 65.96 189.78 64.09 188.12" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polygon points="194.35 274.92 178.57 292.75 151.91 269.16 153.15 267.75 178.41 290.1 194.35 272.09 194.35 274.92" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
  </g>
  <g id="_-A0-Puertas" data-name="-A0-Puertas">
    <path d="M230,192.27c1.33,7.69,7.46,13.66,15.19,14.78" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="244.49 191.62 230 191.62 230 192.27 244.49 192.27" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="244.49" y1="191.21" x2="244.49" y2="207.45" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="244.49" y1="207.45" x2="246.44" y2="207.45" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="244.49" y1="191.74" x2="246.44" y2="191.74" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="246.44" y1="191.21" x2="244.49" y2="191.21" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="246.44" y1="206.93" x2="244.49" y2="206.93" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="246.44" y1="207.45" x2="246.44" y2="191.21" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
  </g>
  <g id="_-A0-Muebles" data-name="-A0-Muebles">
    <rect x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M313.36,228.38c5.95-.86,10.66-5.45,11.69-11.37" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="313.89 216.51 325.04 216.51 325.04 217.01 313.89 217.01" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="313.89" y1="216.2" x2="313.89" y2="228.69" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="313.89" y1="228.69" x2="312.39" y2="228.69" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="313.89" y1="216.6" x2="312.39" y2="216.6" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="312.39" y1="216.2" x2="313.89" y2="216.2" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="312.39" y1="228.29" x2="313.89" y2="228.29" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="312.39" y1="228.69" x2="312.39" y2="216.2" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="270.9" y="209.33" width="41.49" height="6.87" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="198.85" y1="240.54" x2="198.85" y2="248.04" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M244.56,209.33l-.04,6.87h-10.71s0,56.85,0,56.85h-6.24s-.06-60.57-.06-60.57c.04-1.74,1.45-3.13,3.18-3.16h13.86" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="314.27 214.32 324.89 214.32 324.89 196.21 354.06 196.21 354.06 191.21 314.27 191.21 314.27 214.32" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="319.9 230.56 314.27 230.56 314.27 273.05 319.89 273.05 319.9 273.05 319.9 230.56 319.9 230.56" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="348.44" y="216.2" width="5.62" height="54.98" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M185.97,222.57c2.24,1.85,5.45,1.95,7.8.23l-58.43-51.69-3.31,3.74,53.94,47.72h0Z" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="180.6 248.04 198.85 248.04 198.85 240.54 177.23 240.54 153.57 267.29 153.15 267.75 158.77 272.72 180.6 248.04 180.6 248.04" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="225.71 240.55 218.21 240.55 218.21 273.05 225.71 273.05 225.71 240.55 225.71 240.55" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="100.38" y="185.61" width="22.58" height="7.5" transform="translate(-104.15 147.53) rotate(-48.5)" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <g id="_-A0-Dotacion" data-name="-A0-Dotacion">
    <rect x="246.16" y="238.45" width="11.24" height="9.99" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="308.41" y="236.3" width="3.07" height="9.12" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="295.25" y="237.36" width="13.16" height="7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="296.84" y1="237.36" x2="296.84" y2="244.36" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="294.44" y="243.6" width=".14" height=".45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="295.25 243.75 294.58 243.75 294.58 243.9 295.25 243.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="297.08" y="237.56" width="11.1" height="6.59" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="308.41" y="251.7" width="3.07" height="9.12" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="295.25" y="252.77" width="13.16" height="7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="296.84" y1="252.77" x2="296.84" y2="259.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="294.44" y="259.01" width=".14" height=".45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="295.25 259.16 294.58 259.16 294.58 259.31 295.25 259.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="297.08" y="252.97" width="11.1" height="6.59" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <ellipse cx="79.13" cy="191.69" rx="3.44" ry="8.37" transform="translate(-117.54 125.89) rotate(-49.07)" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M71.86,185.39c-.4.46-.62,1.05-.68,1.63s.02,1.17.19,1.77c.37,1.3,1.19,2.67,2.29,4.01s2.49,2.62,3.94,3.67c1.38.99,2.81,1.75,4.14,2.18.97.31,1.88.45,2.75.33.66-.09,1.31-.37,1.79-.86s.73-1.17.79-1.83-.07-1.33-.3-2c-.47-1.37-1.4-2.82-2.63-4.2s-2.73-2.68-4.28-3.68c-1.37-.89-2.76-1.54-4.05-1.84-.92-.22-1.8-.27-2.62-.02-.5.15-.98.44-1.34.85Z" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M116.2,185.96c.06-.15-.02-.32-.17-.37s-.32.02-.37.17.02.32.17.37c.08.03.16.02.24-.01" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polygon points="112.68 184.49 112.62 184.67 112.57 184.86 112.53 185.04 112.51 185.22 112.5 185.4 112.5 185.58 112.52 185.76 112.55 185.93 112.6 186.1 112.65 186.26 112.72 186.41 112.8 186.56 112.89 186.69 112.99 186.82 113.11 186.94 113.23 187.05 113.36 187.14 113.5 187.23 113.65 187.3 113.81 187.36 113.97 187.41 114.14 187.44 114.31 187.46 114.48 187.47 114.66 187.46 114.84 187.44 115.02 187.41 115.2 187.36 115.37 187.3 115.55 187.23 115.72 187.15 115.89 187.05 116.05 186.95 116.21 186.83 116.36 186.7 116.5 186.56 116.26 186.35 116.11 186.16 116.25 186 116.46 186.13 116.7 186.34 116.82 186.18 116.93 186.02 117.02 185.85 117.11 185.68 117.19 185.5 117.25 185.32 117.3 185.14 117.34 184.96 117.37 184.77 117.38 184.59 117.38 184.41 117.36 184.23 117.34 184.06 117.3 183.89 117.24 183.73 117.18 183.58 117.1 183.43 117.01 183.29 116.91 183.16 116.8 183.04 116.68 182.93 116.55 182.83 116.41 182.74 116.26 182.67 116.11 182.61 115.95 182.56 115.78 182.52 115.61 182.49 115.44 182.48 115.26 182.49 115.08 182.5 114.91 182.53 114.73 182.58 114.55 182.63 114.37 182.7 114.2 182.78 114.03 182.87 113.87 182.98 113.71 183.09 113.56 183.22 113.42 183.35 113.28 183.5 113.15 183.65 113.04 183.81 112.93 183.97 112.83 184.14 112.75 184.32 112.68 184.49" fill="#005f7f" fillRule="evenodd"/>
    <path d="M116.26,185.99c.07-.18-.02-.38-.2-.45s-.38.02-.45.2.02.38.2.45c.09.04.2.03.29-.02" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M116.93,186.95c-.03.15.07.3.23.33s.3-.07.33-.23-.07-.3-.23-.33c-.04,0-.08,0-.12,0" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="116.7 186.34 116.82 186.18 116.93 186.02 117.02 185.85 117.11 185.68 117.19 185.5 117.25 185.32 117.3 185.14 117.34 184.96 117.37 184.77 117.38 184.59 117.38 184.41 117.36 184.23 117.34 184.06 117.3 183.89 117.24 183.73 117.18 183.58 117.1 183.43 117.01 183.29 116.91 183.16 116.8 183.04 116.68 182.93 116.55 182.83 116.41 182.74 116.26 182.67 116.11 182.61 115.95 182.56 115.78 182.52 115.61 182.49 115.44 182.48 115.26 182.49 115.08 182.5 114.91 182.53 114.73 182.58 114.55 182.63 114.37 182.7 114.2 182.78 114.03 182.87 113.87 182.98 113.71 183.09 113.56 183.22 113.42 183.35 113.28 183.5 113.15 183.65 113.04 183.81 112.93 183.97 112.83 184.14 112.75 184.32 112.68 184.49 112.62 184.67 112.57 184.86 112.53 185.04 112.51 185.22 112.5 185.4 112.5 185.58 112.52 185.76 112.55 185.93 112.6 186.1 112.65 186.26 112.72 186.41 112.8 186.56 112.89 186.69 112.99 186.82 113.11 186.94 113.23 187.05 113.36 187.14 113.5 187.23 113.65 187.3 113.81 187.36 113.97 187.41 114.14 187.44 114.31 187.46 114.48 187.47 114.66 187.46 114.84 187.44 115.02 187.41 115.2 187.36 115.37 187.3 115.55 187.23 115.72 187.15 115.89 187.05 116.05 186.95 116.21 186.83 116.36 186.7 116.5 186.56" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="118.04" cy="186.06" r=".23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="118.04" cy="186.06" r=".17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="116.46" y1="186.13" x2="116.04" y2="185.86" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="116.26" y1="186.35" x2="115.94" y2="185.97" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M116.04,185.86s-.06,0-.08.03" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M115.96,185.89s-.03.05-.02.08" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="116.38" cy="187.93" r=".23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="116.46" y1="186.13" x2="117.45" y2="187.01" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="116.26" y1="186.35" x2="117.25" y2="187.24" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M117.25,187.24c.09-.05.16-.13.2-.22" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="116.38" cy="187.93" r=".17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M108.95,194.1c.06-.15-.02-.32-.17-.37s-.32.02-.37.17.02.32.17.37c.08.03.16.02.24-.01" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polygon points="105.43 192.63 105.37 192.81 105.32 192.99 105.28 193.17 105.26 193.36 105.25 193.54 105.26 193.72 105.27 193.89 105.3 194.07 105.35 194.23 105.4 194.39 105.47 194.55 105.55 194.69 105.64 194.83 105.74 194.96 105.86 195.07 105.98 195.18 106.11 195.28 106.25 195.36 106.4 195.43 106.56 195.49 106.72 195.54 106.89 195.58 107.06 195.6 107.23 195.6 107.41 195.6 107.59 195.58 107.77 195.54 107.95 195.5 108.12 195.44 108.3 195.37 108.47 195.28 108.64 195.19 108.8 195.08 108.96 194.96 109.11 194.84 109.25 194.7 109.01 194.49 108.86 194.3 109 194.13 109.21 194.26 109.45 194.48 109.57 194.32 109.68 194.16 109.77 193.99 109.86 193.81 109.94 193.64 110 193.46 110.05 193.27 110.09 193.09 110.12 192.91 110.13 192.73 110.13 192.55 110.11 192.37 110.09 192.2 110.05 192.03 109.99 191.87 109.93 191.71 109.85 191.57 109.76 191.43 109.66 191.3 109.55 191.18 109.43 191.07 109.3 190.97 109.16 190.88 109.01 190.8 108.86 190.74 108.7 190.69 108.53 190.65 108.36 190.63 108.19 190.62 108.01 190.62 107.83 190.64 107.66 190.67 107.48 190.71 107.3 190.77 107.12 190.84 106.95 190.92 106.78 191.01 106.62 191.11 106.46 191.23 106.31 191.35 106.17 191.49 106.03 191.63 105.9 191.78 105.79 191.94 105.68 192.11 105.58 192.28 105.5 192.45 105.43 192.63" fill="#005f7f" fillRule="evenodd"/>
    <path d="M109.01,194.12c.07-.18-.02-.38-.2-.45s-.38.02-.45.2.02.38.2.45c.09.04.2.03.29-.02" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M109.68,195.09c-.03.15.07.3.23.33s.3-.07.33-.23-.07-.3-.23-.33c-.04,0-.08,0-.12,0" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="109.45 194.48 109.57 194.32 109.68 194.16 109.77 193.99 109.86 193.81 109.94 193.64 110 193.46 110.05 193.27 110.09 193.09 110.12 192.91 110.13 192.73 110.13 192.55 110.11 192.37 110.09 192.2 110.05 192.03 109.99 191.87 109.93 191.71 109.85 191.57 109.76 191.43 109.66 191.3 109.55 191.18 109.43 191.07 109.3 190.97 109.16 190.88 109.01 190.8 108.86 190.74 108.7 190.69 108.53 190.65 108.36 190.63 108.19 190.62 108.01 190.62 107.83 190.64 107.66 190.67 107.48 190.71 107.3 190.77 107.12 190.84 106.95 190.92 106.78 191.01 106.62 191.11 106.46 191.23 106.31 191.35 106.17 191.49 106.03 191.63 105.9 191.78 105.79 191.94 105.68 192.11 105.58 192.28 105.5 192.45 105.43 192.63 105.37 192.81 105.32 192.99 105.28 193.17 105.26 193.36 105.25 193.54 105.26 193.72 105.27 193.89 105.3 194.07 105.35 194.23 105.4 194.39 105.47 194.55 105.55 194.69 105.64 194.83 105.74 194.96 105.86 195.07 105.98 195.18 106.11 195.28 106.25 195.36 106.4 195.43 106.56 195.49 106.72 195.54 106.89 195.58 107.06 195.6 107.23 195.6 107.41 195.6 107.59 195.58 107.77 195.54 107.95 195.5 108.12 195.44 108.3 195.37 108.47 195.28 108.64 195.19 108.8 195.08 108.96 194.96 109.11 194.84 109.25 194.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="110.79" cy="194.2" r=".23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="110.79" cy="194.2" r=".17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="109.21" y1="194.26" x2="108.79" y2="194" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="109.01" y1="194.49" x2="108.69" y2="194.1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="109.13" cy="196.06" r=".23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="109.21" y1="194.26" x2="110.2" y2="195.15" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="109.01" y1="194.49" x2="110" y2="195.37" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="109.13" cy="196.06" r=".17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="78.62" y1="174.53" x2="87.04" y2="181.98" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="87.04" y1="181.98" x2="106.91" y2="159.53" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="85.39" y1="166.88" x2="93.81" y2="174.33" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="94.32" cy="165.27" r=".39" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="86.22" cy="174.43" r=".39" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="94.02" y1="165.01" x2="85.39" y2="166.88" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="94.06" y1="165.57" x2="93.81" y2="174.33" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="94.61" y1="165.54" x2="106.91" y2="159.53" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="94.58" y1="164.98" x2="92.16" y2="159.22" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="85.39" y1="166.88" x2="85.92" y2="174.17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="86.48" y1="174.13" x2="93.81" y2="174.33" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="86.51" y1="174.69" x2="87.04" y2="181.98" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="85.96" y1="174.72" x2="78.62" y2="174.53" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polygon points="164.65 211.17 151.92 204.08 151.64 202.82 150.63 202.18 145.94 194.61 133.92 208.2 152.63 224.76 164.65 211.17" fill="none"/>
    <path d="M145.93,194.62h.02M145.54,195.06l1.5,1.33M163.41,210.87l.85.75M145.15,195.51l1.83,1.61M161.23,209.74l2.63,2.33M144.75,195.95l.04.04M148.36,199.15l.87.77M159.05,208.61l4.41,3.9M146.18,198.01l4.14,3.66M156.88,207.48l6.19,5.48M151.56,202.77l.08.07M144.01,196.88l7.13,6.31M154.7,206.34l7.13,6.31M143.57,197.29l5.39,4.77M152.52,205.21l7.13,6.31M143.18,197.74l3.61,3.19M150.35,204.08l7.13,6.31M161.04,213.54l.85.75M142.78,198.18l1.83,1.61M148.17,202.95l7.13,6.31M158.86,212.41l2.63,2.33M142.39,198.63l.04.04M145.99,201.82l7.13,6.31M156.69,211.28l4.41,3.9M143.82,200.69l7.13,6.31M154.51,210.15l6.19,5.48M141.64,199.56l7.13,6.31M152.34,209.02l7.13,6.31M141.2,199.96l5.39,4.77M150.16,207.89l7.13,6.31M140.81,200.41l3.61,3.19M147.98,206.75l7.13,6.31M158.68,216.22l.85.75M140.42,200.86l1.83,1.61M145.81,205.62l7.13,6.31M156.5,215.08l2.63,2.33M140.02,201.3l.04.04M143.63,204.49l7.13,6.31M154.32,213.95l4.41,3.9M141.45,203.36l7.13,6.31M152.15,212.82l6.19,5.48M139.28,202.23l7.13,6.31M149.97,211.69l7.13,6.31M138.84,202.64l5.39,4.77M147.79,210.56l7.13,6.31M138.44,203.08l3.61,3.19M145.62,209.43l7.13,6.31M156.31,218.89l.85.75M138.05,203.53l1.83,1.61M143.44,208.3l7.13,6.31M154.13,217.76l2.63,2.33M137.66,203.97l.04.04M141.26,207.17l7.13,6.31M151.96,216.63l4.41,3.9M139.09,206.03l7.13,6.31M149.78,215.5l6.19,5.48M136.91,204.9l7.13,6.31M147.6,214.36l7.13,6.31M136.47,205.31l5.39,4.77M145.43,213.23l7.13,6.31M136.08,205.76l3.61,3.19M143.25,212.1l7.13,6.31M153.95,221.56l.85.75M135.69,206.2l1.83,1.61M141.08,210.97l7.13,6.31M151.77,220.43l2.63,2.33M135.29,206.65l.04.04M138.9,209.84l7.13,6.31M149.59,219.3l4.41,3.9M136.72,208.71l7.13,6.31M147.42,218.17l6.19,5.48M134.55,207.58l7.13,6.31M145.24,217.04l7.13,6.31M134.11,207.98l5.39,4.77M143.06,215.91l7.13,6.31M133.96,208.24l4.53-5.12M141.64,199.56l4.33-4.89M134.4,208.63l6.11-6.9M143.66,198.17l2.63-2.98M136.23,207.47l6.31-7.13M145.69,196.78l.94-1.06M138.25,206.09l6.31-7.13M135.74,209.82l1.38-1.56M140.27,204.7l6.31-7.13M136.19,210.21l2.95-3.34M142.29,203.31l5.32-6.01M136.63,210.61l4.53-5.12M144.31,201.92l3.62-4.09M137.08,211l6.11-6.9M146.34,200.53l1.93-2.18M138.9,209.84l6.31-7.13M148.36,199.15l.23-.26M140.92,208.45l6.31-7.13M138.41,212.18l1.38-1.56M142.94,207.06l6.3-7.12M138.86,212.58l2.95-3.34M144.97,205.67l4.61-5.21M139.3,212.97l4.53-5.12M146.99,204.29l2.91-3.29M139.75,213.37l6.11-6.9M149.01,202.9l1.22-1.37M141.57,212.2l6.31-7.13M143.59,210.82l6.31-7.13M141.09,214.55l1.38-1.56M145.62,209.43l5.91-6.68M141.53,214.94l2.95-3.34M147.64,208.04l4.13-4.66M141.98,215.34l4.53-5.12M149.66,206.65l2.27-2.57M142.42,215.73l6.11-6.9M151.68,205.26l.78-.89M144.25,214.57l6.31-7.13M146.27,213.18l6.31-7.13M143.76,216.91l1.38-1.56M148.29,211.79l5.77-6.53M144.21,217.31l2.95-3.34M150.31,210.41l4.28-4.84M144.65,217.7l4.53-5.12M152.34,209.02l2.79-3.16M145.1,218.1l6.11-6.9M154.36,207.63l1.3-1.47M146.92,216.94l6.31-7.13M148.94,215.55l6.31-7.13M146.43,219.28l1.38-1.56M150.96,214.16l6.29-7.11M146.88,219.67l2.95-3.34M152.99,212.77l4.8-5.43M147.33,220.07l4.53-5.12M155.01,211.38l3.31-3.74M147.77,220.46l6.11-6.9M157.03,209.99l1.82-2.06M149.59,219.3l6.31-7.13M159.05,208.61l.33-.37M151.61,217.91l6.31-7.13M149.11,221.64l1.38-1.56M153.64,216.52l6.31-7.13M149.55,222.04l2.95-3.34M155.66,215.14l5.32-6.01M150,222.43l4.53-5.12M157.68,213.75l3.83-4.33M150.44,222.83l6.11-6.9M159.7,212.36l2.34-2.64M152.27,221.67l6.31-7.13M161.73,210.97l.85-.96M154.29,220.28l6.31-7.13M151.78,224.01l1.38-1.56M156.31,218.89l6.31-7.13M152.23,224.4l2.95-3.34M158.33,217.5l5.84-6.6" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="151.64 202.82 151.92 204.08 164.65 211.17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="145.94 194.61 150.63 202.18 164.65 211.17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="152.63 224.76 133.92 208.2 149.64 190.43 168.35 206.98 152.63 224.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="145.94" y1="194.61" x2="164.65" y2="211.17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="158.21" y="199.5" width="3.75" height="8.39" transform="translate(-98.55 188.61) rotate(-48.5)" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="139.07" y="195.32" width="23.73" height="24.98" transform="translate(-104.72 183.16) rotate(-48.5)" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="151.08" y="193.19" width="3.75" height="8.39" transform="translate(-96.23 181.15) rotate(-48.5)" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x=".35" y=".35" width="394.64" height="342.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M148.1,253.15c.03-.86.37-1.68.96-2.31l6.64-.03c.59.63.94,1.44.98,2.3" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M148.57,253.72c-.58,2.11.67,4.3,2.78,4.87s4.3-.67,4.87-2.78c.19-.7.19-1.43,0-2.13h0s0,0,0,0c-.07-.24.08-.49.32-.55s.49.08.55.32c.24.85.25,1.76.01,2.61-.71,2.59-3.39,4.12-5.98,3.41s-4.12-3.39-3.41-5.98c0,0,0,0,0,0,.07-.24.32-.38.56-.31s.38.32.31.56h0Z" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="152.36" cy="245.22" r="3.75" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M160.29,249.47c-.86-.03-1.68-.37-2.31-.96l-.03-6.64c.63-.59,1.44-.94,2.3-.98" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M160.86,249c2.11.58,4.3-.67,4.87-2.78s-.67-4.3-2.78-4.87c-.7-.19-1.43-.19-2.13,0h0s0,0,0,0c-.24.07-.49-.08-.55-.32s.08-.49.32-.55c.85-.24,1.76-.25,2.61-.01,2.59.71,4.12,3.39,3.41,5.98s-3.39,4.12-5.98,3.41c0,0,0,0,0,0-.24-.07-.38-.32-.31-.56s.32-.38.56-.31h0Z" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M147.7,253.48l.87.24,7.64-.03.87-.25-9.38.04M160.62,249.87l.24-.87-.03-7.64-.25-.87.04,9.38Z" fill="#939598" fillRule="evenodd"/>
    <path d="M157.95,241.87l2.3-.98.57.46.03,7.64-.57.47-2.31-.96-.03-6.64M155.7,250.81l.98,2.3-.46.57-7.64.03-.47-.57.96-2.31,6.64-.03M149.72,247.88l5.28-5.32-5.28,5.32Z" fill="#c7c8ca" fillRule="evenodd"/>
    <line x1="272.4" y1="232.83" x2="274.27" y2="232.83" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="263.65" y1="232.83" x2="272.4" y2="232.83" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="274.27" y1="232.83" x2="274.27" y2="265.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="272.4" y1="232.83" x2="272.4" y2="263.43" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="274.27" y1="265.31" x2="246.79" y2="265.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="272.4" y1="263.43" x2="258.03" y2="263.43" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="246.79" y1="265.31" x2="246.79" y2="254.69" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="258.03" y1="265.31" x2="258.03" y2="263.43" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="246.79" y1="254.69" x2="272.4" y2="254.69" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="263.65" y1="263.43" x2="263.65" y2="232.83" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="272.4" y1="243.44" x2="263.65" y2="243.44" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M125.39,169.85c-.32-.29-.69-.52-1.08-.7-.35-.16-.72-.25-1.1-.28s-.74.02-1.09.14c-.29.11-.56.28-.76.52s-.35.52-.42.82c-.08.36-.08.73-.01,1.1s.22.73.41,1.06c.22.37.5.7.83.99" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="126.1" y1="177.77" x2="130.11" y2="173.24" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="126.04" y1="173.69" x2="124.3" y2="176" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="124.55" y1="174.62" x2="126.79" y2="172.09" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M125.27,169.99c-.31-.27-.66-.5-1.04-.67-.33-.15-.68-.24-1.04-.27s-.69.02-1.01.13c-.26.09-.5.25-.69.47s-.32.46-.38.74c-.08.33-.08.68-.01,1.02.07.35.2.69.39,1,.21.35.48.67.79.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M125.14,170.14c-.3-.26-.63-.48-.99-.64-.31-.14-.64-.22-.98-.25-.32-.03-.63.02-.93.12-.23.08-.44.23-.61.41s-.28.41-.34.66c-.07.31-.07.63,0,.94.07.33.19.65.37.94.2.34.46.64.75.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="128.07" y1="171.73" x2="125.39" y2="169.85" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M126.79,172.09c-.32-.82-.85-1.54-1.52-2.1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M126.65,172.25c-.31-.82-.83-1.55-1.5-2.11" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="126.04" y1="173.69" x2="128.13" y2="171.67" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M130.11,173.24c.14-.16.12-.39-.03-.53,0,0-.02-.01-.03-.02" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="130.05" y1="172.69" x2="128.61" y2="171.64" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M128.61,171.64c-.15-.11-.35-.09-.48.03" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="124.35" y1="175.94" x2="122.16" y2="173.5" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M122.29,173.36c.64.6,1.42,1.03,2.27,1.25" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M122.41,173.23c.64.6,1.43,1.03,2.28,1.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M125.54,177.78c.14.15.38.16.53.02,0,0,.02-.02.02-.02" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="125.54" y1="177.78" x2="124.32" y2="176.48" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M124.3,176c-.11.15-.1.35.03.48" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M124.3,176c-.11.15-.1.35.03.48l1.22,1.3c.14.15.38.16.53.02,0,0,.02-.02.02-.02l4.01-4.53c.14-.16.12-.39-.03-.53,0,0-.02-.01-.03-.02l-1.44-1.06c-.15-.11-.35-.09-.48.03l-2.09,2.02-1.75,2.32M122.29,173.36c.64.6,1.42,1.03,2.27,1.25l2.23-2.52c-.32-.82-.85-1.54-1.52-2.1-.31-.27-.66-.5-1.04-.67-.33-.15-.68-.24-1.04-.27s-.69.02-1.01.13c-.26.09-.5.25-.69.47s-.32.46-.38.74c-.08.33-.08.68-.01,1.02.07.35.2.69.39,1,.21.35.48.67.79.95M125.27,169.99c-.31-.27-.66-.5-1.04-.67-.33-.15-.68-.24-1.04-.27s-.69.02-1.01.13c-.26.09-.5.25-.69.47s-.32.46-.38.74c-.08.33-.08.68-.01,1.02.07.35.2.69.39,1,.21.35.48.67.79.95M126.79,172.09c-.32-.82-.85-1.54-1.52-2.1M124.55,174.62l2.23-2.52M122.29,173.36c.64.6,1.42,1.03,2.27,1.25M125.27,169.99c-.31-.27-.66-.5-1.04-.67.38.17.73.4,1.04.67M124.23,169.33c-.33-.15-.68-.24-1.04-.27.71.12.36.03,0,0M123.19,169.06c-.34-.03-.69.02-1.01.13.67-.16.32-.12,0,0M121.49,172.42c.21.35.48.67.79.95-.31-.27-.58-.59-.79-.95M121.1,171.41c.07.35.2.69.39,1-.32-.65-.19-.31,0,0M121.11,170.4c-.08.33-.08.68-.01,1.02-.07-.68-.07-.34,0,0M121.49,169.66c-.19.21-.32.46-.38.74.19-.53.06-.27,0,0M122.18,169.19c-.26.09-.5.25-.69.47.42-.37.19-.21,0,0M122.41,173.23c.64.6,1.43,1.03,2.28,1.23l-2.53-.96c4.18-2.07,3.66-2.8,2.98-3.36l.24-.28c-.54.02-.88-.2-1.24-.36-.31-.14-.64-.22-.98-.25-.32-.03-.63.02-.93.12-.23.08-.44.23-.61.41s-.28.41-.34.66c-.07.31-.07.63,0,.94.07.33.19.65.37.94.2.34.46.64.75.9,2.66-3.65,2.29-3.89,1.9-4.07-.35-.16-.72-.25-1.1-.28s-.74.02-1.09.14c-.29.11-.56.28-.76.52s-.35.52-.42.82c-.08.36-.08.73-.01,1.1s.22.73.41,1.06c.22.37.5.7.83.99l.25-.28Z" fill="#fff" fillRule="evenodd"/>
    <path d="M126.04,173.69l2.03-1.96-2.68-1.87-1.08-.7-1.1-.28-1.09.14-.76.52-.42.82v1.1s.4,1.06.4,1.06l.83.99,2.18,2.43,1.7-2.25M124.55,174.62l-2.27-1.25-.79-.95-.39-1v-1.02s.39-.74.39-.74l.69-.47,1.01-.13,1.04.27,1.04.67,1.52,2.1-2.23,2.52Z" fill="#fff" fillRule="evenodd"/>
  </g>
</svg>
      </div>
    </div>
  );
};

export default S1Casa4;
