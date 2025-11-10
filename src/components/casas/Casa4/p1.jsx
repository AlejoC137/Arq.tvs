// ARCHIVO: p1.jsx - Piso 1 para Casa 4
import React from 'react';

const P1Casa4 = ({ onRoomSelect, selectedRoom, tasks = [] }) => {
  const handleRoomClick = (roomId) => {
    console.log('[P1Casa4] Habitación clickeada:', roomId);
    if (onRoomSelect) {
      onRoomSelect(roomId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 px-4">Piso 1 - Casa 4</h3>
      <div className="flex-grow w-full h-full overflow-auto">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 406.05 343.41">
  <g id="_-A0-Estructura" data-name="-A0-Estructura">
    <rect x="94.5" y="156.08" width="7.5" height="4.37" transform="translate(-85.39 126.98) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="92.47 161.5 87.5 167.11 90.78 170.01 95.75 164.4" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="202.05" y="33.58" width="7.5" height="4.37" transform="translate(42.65 166.2) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="276.9" y="99.8" width="7.5" height="4.37" transform="translate(18.31 244.6) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="270.28" y="107.28" width="7.5" height="4.37" transform="translate(10.47 242.17) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="263.66" y="114.77" width="7.5" height="4.37" transform="translate(2.63 239.73) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="87.88" y="163.57" width="7.5" height="4.37" transform="translate(-93.23 124.55) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="102.37 156.91 99.09 154.02 94.13 159.63 97.4 162.53" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="101.12" y="148.6" width="7.5" height="4.37" transform="translate(-77.55 129.41) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="162.31" y="229.42" width="7.5" height="4.37" transform="translate(-117.44 202.51) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="168.93" y="221.93" width="7.5" height="4.37" transform="translate(-109.6 204.94) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="195.43" y="41.06" width="7.5" height="4.37" transform="translate(34.81 163.77) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="188.81" y="48.54" width="7.5" height="4.37" transform="translate(26.97 161.33) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="182.17" y="56.01" width="7.5" height="4.37" transform="translate(19.14 158.87) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="257.03" y="122.25" width="7.5" height="4.37" transform="translate(-5.21 237.3) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="84.19 170.86 82.95 172.26 84.36 173.5 85.6 172.1 84.19 170.86" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="68.29" y="50.31" width="7.5" height="3.75" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="178.98" y1="274.92" x2="186.48" y2="274.92" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="327.25" y1="274.92" x2="334.74" y2="274.92" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="237.43" y1="274.92" x2="244.93" y2="274.92" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="175.74" y="214.92" width="7.5" height="3.75" transform="translate(-101.82 207.57) rotate(-48.5)" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="327.42" y="187.47" width="7.5" height="3.75" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="331.17" y="120.38" width="3.75" height="7.5" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="255.42" y="183.72" width="3.75" height="7.5" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="68.29" y="147.73" width="3.75" height="3.75" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="178.98 271.17 178.98 278.67 186.48 278.67 186.48 271.17" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="327.25 271.17 327.25 278.67 334.74 278.67 334.74 271.17" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="237.43 271.17 237.43 278.67 244.93 278.67 244.93 271.17" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="244.93" y1="271.17" x2="237.43" y2="271.17" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="334.74" y1="271.17" x2="327.25" y2="271.17" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="186.48" y1="271.17" x2="178.98" y2="271.17" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x=".35" y=".35" width="405.35" height="342.7" fill="none" stroke="#f0f" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <g id="_-A0-Proy" data-name="-A0-Proy">
    <line x1="196.68" y1="49.37" x2="105.39" y2="153.5" fill="none" stroke="#ff7f00" strokeDasharray="3.12 2.08" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="263.28" y1="118.31" x2="180.56" y2="212.75" fill="none" stroke="#ff7f00" strokeDasharray="3.12 2.08" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="172.74 227.35 172.74 318.64 359.9 318.64 359.9 114.14 273.26 114.14" fill="none" stroke="#ff7f00" strokeDasharray="3.12 2.08" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="62.04 54.06 62.04 157.73 95.81 157.73" fill="none" stroke="#ff7f00" strokeDasharray="3.12 2.08" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x=".35" y=".35" width="405.35" height="342.7" fill="none" stroke="#ff7f00" strokeDasharray="3.12 2.08" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <g id="_-A0-Muros" data-name="-A0-Muros">
    <polygon points="333.04 159.65 328.04 159.65 328.04 164.64 328.04 164.64 328.04 166.52 333.04 166.52 333.04 187.47 334.91 187.47 334.91 159.65 333.04 159.65 333.04 159.65" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="333.04 150.9 334.91 150.9 334.91 127.88 333.04 127.88 333.04 149.03 328.04 149.03 328.04 150.9 333.04 150.9 333.04 150.9" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="328.04" y="120.38" width="3.13" height="1.87" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="296.64 122.26 296.64 150.9 257.32 150.9 257.29 183.72 255.42 183.72 255.45 146.53 257.32 146.53 257.32 149.03 294.77 149.03 294.77 120.38 306.01 120.38 306.01 122.26 296.64 122.26" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="197.3" y="51.62" width="1.87" height="15.78" transform="translate(22.3 168.53) rotate(-48.49)" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="75.78 50.31 190.84 50.31 189.18 52.19 74.29 52.19 74.29 48.82 68.29 48.82 68.29 54.06 62.04 54.06 62.04 44.06 75.78 44.06 75.78 50.31 75.78 50.31" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="268.21" y="99.12" width="1.87" height="10.01" transform="translate(12.82 236.71) rotate(-48.5)" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="257.59" y="95.26" width="1.87" height="10.62" transform="translate(11.9 227.55) rotate(-48.5)" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="246.71" y="91.43" width="1.87" height="10.7" transform="translate(11.07 218.13) rotate(-48.5)" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="296.64 164.64 314.57 164.64 314.57 166.52 296.64 166.52 296.64 189.34 314.93 189.34 314.93 191.21 259.17 191.21 259.17 189.34 260.67 189.34 260.67 186.72 259.17 186.72 259.17 183.72 262.16 183.72 262.16 189.34 280.22 189.34 280.22 159.65 282.09 159.65 282.09 189.34 294.77 189.34 294.77 161.52 289.59 161.52 289.59 159.65 296.64 159.65 296.64 164.64" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="256.7 125.83 258.11 127.06 257.29 127.99 257.29 128.79 265.16 119.96 266.56 121.21 267.29 120.38 282.28 120.38 282.28 122.26 265.62 122.26 257.29 131.61 257.29 136.54 255.42 136.54 255.42 127.29 256.7 125.83" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="306.91" y="273.05" width="20.15" height="1.87" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x=".35" y=".35" width="405.35" height="342.7" fill="none" stroke="blue" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <g id="_-A0-Pisos_Espacios_" data-name="-A0-Pisos( Espacios )">
    <rect id="Frame" x=".35" y=".35" width="405.35" height="342.7" fill="none" stroke="#ff7f00" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <g id="_-A0-Ventanas" data-name="-A0-Ventanas">
    <polygon points="105.26 153.64 104.02 155.04 175.6 218.36 176.84 216.96 105.26 153.64 105.26 153.64" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="68.29" y="54.06" width="1.87" height="93.67" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polygon points="72.04 149.61 103.53 149.61 101.87 151.48 72.04 151.48 72.04 149.61" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="180.47" y="273.05" width="56.96" height="1.88" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="244.93" y="273.05" width="61.98" height="1.87" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polygon points="332.68 191.21 334.91 191.21 334.74 271.17 332.68 271.17 332.68 191.21" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="333.04" y="127.88" width="1.87" height="59.59" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polygon points="180.86 271.17 178.98 271.17 178.98 220.19 180.86 218.07 180.86 271.17" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="306.01" y="120.38" width="22.03" height="1.87" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="282.28" y="120.38" width="12.49" height="1.87" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="209.05" y="62.1" width="1.87" height="15.6" transform="translate(18.49 180.86) rotate(-48.5)" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x=".35" y=".35" width="405.35" height="342.7" fill="none" stroke="aqua" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <g id="_-A0-Puertas" data-name="-A0-Puertas">
    <path d="M287.63,151.71c-.18,4.05,2.95,7.48,7,7.67.41.02.82,0,1.23-.05" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="295.33 151.21 287.63 151.21 287.63 151.71 295.33 151.71" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="296.83 159.65 296.83 150.9 295.33 150.9 295.33 159.65" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="296.83" y1="159.65" x2="295.33" y2="159.65" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="295.36 150.9 295.36 151.21 296.83 151.21" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M283.09,167.89c3.68-.43,6.44-3.58,6.37-7.29" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="282.59 159.65 282.59 167.88 283.09 167.88 283.09 161.15" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="282.28 159.65 289.77 159.65 289.77 161.15 282.28 161.15" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="282.28" y1="161.15" x2="282.28" y2="159.65" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="289.45" y1="159.65" x2="289.45" y2="161.15" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M326.61,178.57c-5.92,1.02-10.51,5.74-11.37,11.69" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="327.11 189.71 327.11 178.57 326.61 178.57 326.61 189.71" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="327.42" y1="189.71" x2="314.93" y2="189.71" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="314.93" y1="189.71" x2="314.93" y2="191.21" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="327.02" y1="189.71" x2="327.02" y2="191.21" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M265.57,145.9c-.81-4.74-4.57-8.42-9.33-9.12" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="256.65 146.28 265.57 146.3 265.57 145.9 256.65 145.88" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="256.65 146.53 256.67 136.54 255.47 136.54 255.45 146.53" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="255.47" y1="136.86" x2="256.67" y2="136.86" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="256.65" y1="146.21" x2="255.45" y2="146.21" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="255.45" y1="146.53" x2="256.65" y2="146.53" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="327.42" y1="191.21" x2="327.42" y2="189.71" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="315.33" y1="191.21" x2="315.33" y2="189.71" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="314.93" y1="191.21" x2="327.42" y2="191.21" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="295.33" y1="159.33" x2="296.83" y2="159.33" fill="none" stroke="lime" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
  </g>
  <g id="_-A0-Muebles" data-name="-A0-Muebles">
    <rect x="296.64" y="122.26" width="7.5" height="28.64" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="289.77" y="161.52" width="5" height="7.14" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x=".35" y=".35" width="405.35" height="342.7" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x=".35" y=".35" width="405.35" height="342.7" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="235.83" y="228.94" width="72.62" height="21.62" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="296.64 185.59 301.82 185.59 301.82 171.51 314.57 171.51 314.57 166.52 296.64 166.52 296.64 185.59" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="296.64" y="185.59" width="18.29" height="3.75" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="328.04" y="166.52" width="5" height="20.95" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="328.04 149.03 328.04 122.26 331.17 122.26 331.17 127.88 333.04 127.88 333.04 149.03 328.04 149.03" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="286.72" y="134.36" width="8.05" height="14.67" fill="none" stroke="#c7c8ca" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <g id="_-A0-Dotacion" data-name="-A0-Dotacion">
    <path d="M297.49,142.95c-.03-.17-.2-.28-.37-.25s-.28.2-.25.37.2.28.37.25c.04,0,.07-.02.1-.04" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M301.14,144.37l-.52-.14c.06.17-.02.35-.18.43l.46.28c.18.02.34-.11.36-.28.01-.11-.03-.21-.11-.28Z" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M300.54,144.25l-3.29-1.41c-.09-.04-.2,0-.24.09s0,.2.09.24l3.29,1.41c.11-.07.16-.2.14-.33Z" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="303.06 139.88 303.06 146.15 297.72 146.15 297.72 139.88 297.99 139.88" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="297.99" y1="139.88" x2="303.06" y2="139.88" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M297.3,144.04c.09-.06.11-.19.05-.28s-.19-.11-.28-.05-.11.19-.05.28c.01.02.03.03.05.05" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M297.16,144.94c.03-.14.11-.27.22-.36l-.1-.7c0-.05-.04-.09-.09-.1s-.09.04-.1.09c0,0,0,0,0,0l-.16,1.09.22-.03Z" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M297.32,144.16c.11-.05.18-.16.18-.28v-.54" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M297.16,141.08c.03.14.11.27.22.36l-.1.7s0,0,0,0c0,.05-.04.09-.1.09s-.09-.04-.09-.1l-.16-1.09.22.03Z" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M297.07,141.98c-.09.06-.11.19-.05.28s.19.11.28.05.11-.19.05-.28c-.01-.02-.03-.03-.05-.05" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M297.62,143.01c0-.11-.05-.22-.13-.3v-.56c0-.12-.07-.23-.18-.28" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M297.05,141.86c-.11.05-.18.16-.18.28v.56c-.17.17-.17.45,0,.62v.56c0,.12.07.23.18.28" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="297.72" y1="142.47" x2="297.72" y2="143.05" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="297.72" y1="143.44" x2="297.72" y2="143.55" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="300.39" cy="142.37" r=".26" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="303.06" y1="139.88" x2="300.39" y2="142.98" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="303.06" y1="146.15" x2="299.91" y2="142.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="297.72" y1="146.15" x2="300.27" y2="141.79" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="297.72" y1="139.88" x2="300.97" y2="142.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M275.36,127.22c.18-.01.33-.16.34-.34l.16-1.77c.02-.21-.13-.39-.34-.41-.01,0-.02,0-.03,0h-6.05c-.21,0-.37.17-.37.37,0,.01,0,.02,0,.03l.16,1.77c.02.18.16.33.34.34l2.89.23,2.89-.23M274.72,130.48c.03-.88-.17-1.75-.56-2.53h-3.37c-.4.78-.59,1.65-.56,2.53,0,.41.06.83.19,1.22.11.34.27.67.49.96s.47.5.77.67c.25.14.52.21.8.21s.56-.07.8-.21c.3-.17.56-.39.77-.67.22-.29.38-.61.49-.96.12-.4.19-.81.19-1.22M270.22,130.48c0,.41.06.83.19,1.22.11.34.27.67.49.96s.47.5.77.67c.25.14.52.21.8.21s.56-.07.8-.21c.3-.17.56-.39.77-.67.22-.29.38-.61.49-.96.12-.4.19-.81.19-1.22M270.78,127.95c-.4.78-.59,1.65-.56,2.53M274.15,127.95h-3.37M274.72,130.48c.03-.88-.17-1.75-.56-2.53M270.22,130.48c0,.41.06.83.19,1.22-.12-.4-.19-.81-.19-1.22M270.4,131.7c.11.34.27.67.49.96-.38-.61-.22-.29,0,0M270.89,132.65c.21.27.47.5.77.67-.56-.39-.3-.17,0,0M274.53,131.7c.12-.4.19-.81.19-1.22,0,.41-.06.83-.19,1.22M274.04,132.65c.22-.29.38-.61.49-.96-.27.67-.11.34,0,0M273.27,133.32c.3-.17.56-.39.77-.67-.47.5-.21.27,0,0M272.47,133.53c.28,0,.56-.07.8-.21-.52.21-.25.14,0,0M271.66,133.32c.25.14.52.21.8.21-.56-.07-.28,0,0,0M274.53,130.47c.03-.88-.18-1.75-.59-2.52l.96,2.53c-4.32-1.75-4.52-.88-4.5,0h-.37c.37.4.43.79.55,1.17.1.32.26.63.46.9.19.25.43.46.71.62.22.12.46.18.71.18s.49-.06.71-.18c.28-.15.52-.36.71-.62.2-.27.36-.58.46-.9.12-.38.18-.77.18-1.16-4.5.43-4.43.86-4.3,1.28.11.36.29.71.52,1.01s.5.54.83.72c.27.15.58.23.89.23s.62-.08.89-.23c.32-.18.61-.42.83-.72s.41-.65.52-1.01c.13-.41.19-.84.19-1.28h-.37Z" fill="#005f7f" fillRule="evenodd"/>
    <path d="M272.47,127.45l-2.81-.22.37,3.25.19,1.28.52,1.01.83.72.89.23.89-.23.83-.72.52-1.01.19-1.28.37-3.25-2.81.22M274.15,127.95l.56,2.53-.19,1.22-.49.96-.77.67-.8.21-.8-.21-.77-.67-.49-.96-.19-1.22.56-2.53h3.37Z" fill="#005f7f" fillRule="evenodd"/>
    <path d="M270.03,130.48c0,.43.07.86.19,1.28.11.36.29.71.52,1.01s.5.54.83.72c.27.15.58.23.89.23s.62-.08.89-.23c.32-.18.61-.42.83-.72s.41-.65.52-1.01c.13-.41.19-.84.19-1.28" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="275.49" y1="124.7" x2="269.44" y2="124.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="272.47" y1="127.45" x2="275.36" y2="127.22" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="274.15" y1="127.95" x2="270.78" y2="127.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M270.22,130.48c0,.41.06.83.19,1.22.11.34.27.67.49.96s.47.5.77.67c.25.14.52.21.8.21s.56-.07.8-.21c.3-.17.56-.39.77-.67.22-.29.38-.61.49-.96.12-.4.19-.81.19-1.22" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M270.41,130.48c0,.39.06.79.18,1.16.1.32.26.63.46.9.19.25.43.46.71.62.22.12.46.18.71.18s.49-.06.71-.18c.28-.15.52-.36.71-.62.2-.27.36-.58.46-.9.12-.38.18-.77.18-1.16" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="269.66" y1="127.23" x2="270.03" y2="130.48" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M270.78,127.95c-.4.78-.59,1.65-.56,2.53" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M270.99,127.95c-.41.78-.61,1.65-.59,2.52" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="272.47" y1="127.45" x2="269.57" y2="127.22" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M269.44,124.7c-.21,0-.37.17-.37.37,0,.01,0,.02,0,.03" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="269.07" y1="125.11" x2="269.23" y2="126.88" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M269.23,126.88c.02.18.16.33.34.34" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="275.28" y1="127.23" x2="274.9" y2="130.48" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M274.72,130.48c.03-.88-.17-1.75-.56-2.53" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M274.53,130.47c.03-.88-.18-1.75-.59-2.52" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M275.87,125.11c.02-.21-.13-.39-.34-.41-.01,0-.02,0-.03,0" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="275.87" y1="125.11" x2="275.7" y2="126.88" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M275.36,127.22c.18-.01.33-.16.34-.34" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M292.75,173.8c-.17.02-.3.15-.31.32l-.21,2.67.21,2.67c.01.17.15.3.31.32l1.64.15c.19.02.36-.12.38-.31,0-.01,0-.02,0-.03v-5.59c0-.19-.16-.35-.35-.35-.01,0-.02,0-.03,0l-1.64.15M291.77,175.23c-.72-.37-1.53-.54-2.34-.52-.38,0-.76.06-1.13.17-.32.1-.62.25-.88.45s-.46.43-.62.71c-.13.23-.19.48-.19.74s.07.52.19.74c.15.28.36.52.62.71.27.2.57.35.88.45.37.11.75.17,1.13.17.81.02,1.61-.16,2.34-.52v-3.12M289.43,178.87c-.38,0-.76-.06-1.13-.17-.32-.1-.62-.25-.88-.45s-.46-.43-.62-.71c-.13-.23-.19-.48-.19-.74s.07-.52.19-.74c.15-.28.36-.52.62-.71.27-.2.57-.35.88-.45.37-.11.75-.17,1.13-.17M289.43,178.87c.81.02,1.61-.16,2.34-.52M291.77,175.23v3.12M291.77,175.23c-.72-.37-1.53-.54-2.34-.52M288.3,178.7c.37.11.75.17,1.13.17-.38,0-.76-.06-1.13-.17M288.3,178.7c.37.11.75.17,1.13.17-.76-.06-.38,0,0,0M287.41,178.25c.27.2.57.35.88.45-.62-.25-.32-.1,0,0M286.8,177.54c.15.28.36.52.62.71-.46-.43-.25-.19,0,0M286.61,176.79c0,.26.07.52.19.74-.19-.48-.13-.23,0,0M288.3,174.89c.37-.11.75-.17,1.13-.17-.38,0-.76.06-1.13.17M289.43,174.71c-.38,0-.76.06-1.13.17.75-.17.37-.11,0,0M288.3,174.89c-.32.1-.62.25-.88.45.57-.35.27-.2,0,0M287.41,175.34c-.25.19-.46.43-.62.71.36-.52.15-.28,0,0M286.8,176.05c-.13.23-.19.48-.19.74.07-.52,0-.26,0,0M291.77,175.43c-.72-.38-1.52-.57-2.33-.54v-.35c.81,4.18,1.62,3.99,2.33,3.62l-2.34.89c-.37-.35-.73-.4-1.08-.51-.3-.09-.58-.24-.83-.43-.23-.18-.43-.4-.57-.66-.11-.2-.17-.43-.17-.66s.06-.46.17-.66c.14-.26.34-.48.57-.66.25-.19.53-.33.83-.43.35-.11.71-.16,1.08-.16-.4,4.16-.8,4.1-1.18,3.98-.34-.11-.65-.27-.94-.48s-.5-.47-.66-.77c-.14-.25-.21-.54-.21-.83s.07-.57.21-.83c.16-.3.39-.56.66-.77s.6-.37.94-.48c.38-.12.78-.18,1.18-.18l2.34.89Z" fill="#005f7f" fillRule="evenodd"/>
    <path d="M292.23,176.79l.2,2.6-3-.35-1.18-.18-.94-.48-.66-.77-.21-.83.21-.83.66-.77.94-.48,1.18-.18,3-.35-.2,2.6M291.77,175.23l-2.34-.52-1.13.17-.88.45-.62.71-.19.74.19.74.62.71.88.45,1.13.17,2.34-.52v-3.12Z" fill="#005f7f" fillRule="evenodd"/>
    <path d="M289.43,179.05c-.4,0-.8-.06-1.18-.18-.34-.11-.65-.27-.94-.48s-.5-.47-.66-.77c-.14-.25-.21-.54-.21-.83s.07-.57.21-.83c.16-.3.39-.56.66-.77s.6-.37.94-.48c.38-.12.78-.18,1.18-.18" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="294.77" y1="174" x2="294.77" y2="179.59" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="292.23" y1="176.79" x2="292.44" y2="174.12" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="291.77" y1="175.23" x2="291.77" y2="178.35" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M289.43,178.87c-.38,0-.76-.06-1.13-.17-.32-.1-.62-.25-.88-.45s-.46-.43-.62-.71c-.13-.23-.19-.48-.19-.74s.07-.52.19-.74c.15-.28.36-.52.62-.71.27-.2.57-.35.88-.45.37-.11.75-.17,1.13-.17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M289.43,178.7c-.37,0-.73-.06-1.08-.16-.3-.09-.58-.24-.83-.43-.23-.18-.43-.4-.57-.66-.11-.2-.17-.43-.17-.66s.06-.46.17-.66c.14-.26.34-.48.57-.66.25-.19.53-.33.83-.43.35-.11.71-.16,1.08-.16" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="292.43" y1="179.39" x2="289.43" y2="179.05" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M289.43,178.87c.81.02,1.61-.16,2.34-.52" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M289.43,178.7c.81.02,1.62-.16,2.33-.54" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="292.23" y1="176.79" x2="292.44" y2="179.47" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M294.39,179.94c.19.02.36-.12.38-.31,0-.01,0-.02,0-.03" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="294.39" y1="179.94" x2="292.75" y2="179.79" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M292.44,179.47c.01.17.15.3.31.32" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="292.43" y1="174.19" x2="289.43" y2="174.54" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M291.77,175.23c-.72-.37-1.53-.54-2.34-.52" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M291.77,175.43c-.72-.38-1.52-.57-2.33-.54" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M294.77,174c0-.19-.16-.35-.35-.35-.01,0-.02,0-.03,0" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="294.39" y1="173.65" x2="292.75" y2="173.8" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M292.75,173.8c-.17.02-.3.15-.31.32" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M292.95,165c-.06-.15-.22-.22-.37-.17s-.22.22-.17.37.22.22.37.17c.08-.03.14-.09.17-.17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M293.01,164.98c-.07-.18-.27-.27-.45-.2s-.27.27-.2.45.27.27.45.2c.09-.04.17-.11.2-.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M294.16,165.25c.09.13.26.17.39.08s.17-.26.08-.39-.26-.17-.39-.08c-.03.02-.06.05-.09.09" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="293.28 165.21 293.27 165.36 293.25 165.51 293.22 165.66 293.18 165.8 293.13 165.94 293.08 166.08 293.01 166.21 292.94 166.33 292.86 166.45 292.78 166.56 292.69 166.66 292.59 166.76 292.48 166.84 292.38 166.92 292.26 166.98 292.15 167.04 292.03 167.08 291.91 167.12 291.78 167.14 291.66 167.15 291.53 167.16 291.41 167.15 291.28 167.13 291.16 167.09 291.04 167.05 290.92 167 290.81 166.93 290.7 166.86 290.6 166.78 290.5 166.69 290.4 166.59 290.32 166.48 290.24 166.36 290.16 166.24 290.1 166.11 290.04 165.98 289.99 165.84 289.95 165.7 289.92 165.55 289.89 165.4 289.88 165.25 289.88 165.1 289.88 164.95 289.89 164.8 289.92 164.65 289.95 164.5 289.99 164.36 290.04 164.22 290.1 164.09 290.16 163.96 290.24 163.84 290.32 163.72 290.4 163.61 290.5 163.51 290.6 163.42 290.7 163.34 290.81 163.26 290.92 163.2 291.04 163.15 291.16 163.11 291.28 163.07 291.41 163.05 291.53 163.04 291.66 163.04 291.78 163.06 291.91 163.08 292.03 163.11 292.15 163.16 292.26 163.22 292.38 163.28 292.48 163.36 292.59 163.44 292.69 163.54 292.78 163.64 292.86 163.75 292.94 163.86 293.01 163.99 293.08 164.12 293.13 164.25 293.18 164.39 293.22 164.54 293.25 164.69 293.27 164.83 293.28 164.98" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="294.39" cy="166.35" r=".23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="294.39" cy="166.35" r=".17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="293.25" y1="165.25" x2="292.76" y2="165.17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="293.25" y1="164.95" x2="292.76" y2="165.03" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M292.72,165.1s.01.06.04.07" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M292.76,165.03s-.05.04-.04.07" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="294.39" cy="163.85" r=".23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="293.25" y1="165.25" x2="294.58" y2="165.25" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="293.25" y1="164.95" x2="294.58" y2="164.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M294.58,165.25c.03-.1.03-.2,0-.3" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="294.39" cy="163.85" r=".17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="99.25" y="78.82" width="27.73" height="8.83" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="302.6" y="123.59" width=".88" height=".82" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="300.54" cy="127.86" r="2.51" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="300.54" cy="127.86" r="2.35" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="297.67" y="124.85" width="5.81" height="6.1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M296.64,131.57h6.97c.22,0,.39-.18.39-.39v-7.74c0-.22-.18-.39-.39-.39h-6.97v8.53Z" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="297.3" y1="123.04" x2="297.3" y2="131.57" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M297.3,131.37h6.31c.11,0,.2-.09.2-.2v-7.74c0-.11-.09-.2-.2-.2h-6.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="297.67" y="123.59" width="4.65" height=".82" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="148.32" y="140.31" width="54.05" height="15.09" transform="translate(-51.51 181.66) rotate(-48.61)" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M106.2,133.72c2.54-.74,4-3.4,3.26-5.93-.59-2.04-2.47-3.45-4.6-3.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M106.2,133.72c-4.06,1.18-7.23,4.36-8.41,8.42" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M93.23,145.57c2.11,0,3.97-1.4,4.56-3.43" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="104.86" y1="124.33" x2="82.16" y2="124.33" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.16" y1="124.33" x2="82.16" y2="131.4" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.16" y1="145.57" x2="93.23" y2="145.57" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="87.16" y1="124.33" x2="87.16" y2="145.57" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.16" y1="131.98" x2="82.16" y2="138.03" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="86.54" y1="144.94" x2="86.54" y2="124.96" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="86.54" y1="124.96" x2="82.16" y2="124.96" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.16" y1="144.94" x2="86.54" y2="144.94" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="124.96" x2="82.48" y2="131.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="124.96" x2="82.48" y2="125.21" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="125.21" x2="86.54" y2="125.21" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="125.46" x2="86.54" y2="125.46" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="125.71" x2="86.54" y2="125.71" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="125.96" x2="86.54" y2="125.96" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="126.21" x2="86.54" y2="126.21" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="126.46" x2="86.54" y2="126.46" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="126.71" x2="86.54" y2="126.71" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="126.96" x2="86.54" y2="126.96" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="127.21" x2="86.54" y2="127.21" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="127.46" x2="86.54" y2="127.46" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="127.71" x2="86.54" y2="127.71" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="127.96" x2="86.54" y2="127.96" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="128.21" x2="86.54" y2="128.21" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="128.45" x2="86.54" y2="128.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="128.7" x2="86.54" y2="128.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="128.95" x2="86.54" y2="128.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="129.2" x2="86.54" y2="129.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="129.45" x2="86.54" y2="129.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="129.7" x2="86.54" y2="129.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="129.95" x2="86.54" y2="129.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="130.2" x2="86.54" y2="130.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="130.45" x2="86.54" y2="130.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="130.7" x2="86.54" y2="130.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="130.95" x2="86.54" y2="130.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="131.2" x2="86.54" y2="131.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="131.45" x2="86.54" y2="131.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="131.7" x2="86.54" y2="131.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="83.7" y1="131.95" x2="86.54" y2="131.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="132.2" x2="86.54" y2="132.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="132.45" x2="83.61" y2="132.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="132.7" x2="86.54" y2="132.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="132.95" x2="86.54" y2="132.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="133.2" x2="86.54" y2="133.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="133.45" x2="86.54" y2="133.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="133.7" x2="86.54" y2="133.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="133.95" x2="86.54" y2="133.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="134.2" x2="86.54" y2="134.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="134.45" x2="86.54" y2="134.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="134.7" x2="86.54" y2="134.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="134.95" x2="86.54" y2="134.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="135.2" x2="86.54" y2="135.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="135.45" x2="86.54" y2="135.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="135.7" x2="86.54" y2="135.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="135.95" x2="86.54" y2="135.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="136.2" x2="86.54" y2="136.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="136.45" x2="86.54" y2="136.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="136.7" x2="86.54" y2="136.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="136.95" x2="86.54" y2="136.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="137.2" x2="86.54" y2="137.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="137.45" x2="86.54" y2="137.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="137.7" x2="86.54" y2="137.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="137.95" x2="83.06" y2="137.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="138.2" x2="86.54" y2="138.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.93" y1="138.45" x2="86.54" y2="138.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="138.7" x2="86.54" y2="138.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="138.95" x2="86.54" y2="138.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="139.2" x2="86.54" y2="139.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="139.45" x2="86.54" y2="139.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="139.7" x2="86.54" y2="139.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="139.95" x2="86.54" y2="139.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="140.2" x2="86.54" y2="140.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="140.45" x2="86.54" y2="140.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="140.7" x2="86.54" y2="140.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="140.95" x2="86.54" y2="140.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="141.2" x2="86.54" y2="141.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="141.45" x2="86.54" y2="141.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="141.7" x2="86.54" y2="141.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="141.95" x2="86.54" y2="141.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="142.2" x2="86.54" y2="142.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="142.45" x2="86.54" y2="142.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="142.7" x2="86.54" y2="142.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="142.95" x2="86.54" y2="142.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="143.2" x2="86.54" y2="143.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="143.45" x2="86.54" y2="143.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="143.7" x2="86.54" y2="143.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="143.95" x2="86.54" y2="143.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="144.19" x2="86.54" y2="144.19" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="144.44" x2="86.54" y2="144.44" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="144.69" x2="86.54" y2="144.69" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="144.94" x2="86.54" y2="144.94" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="125.21" x2="84.35" y2="125.46" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="125.71" x2="84.35" y2="125.96" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="126.21" x2="84.35" y2="126.46" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="126.71" x2="84.35" y2="126.96" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="127.21" x2="84.35" y2="127.46" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="127.71" x2="84.35" y2="127.96" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="128.21" x2="84.35" y2="128.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="128.7" x2="84.35" y2="128.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="129.2" x2="84.35" y2="129.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="129.7" x2="84.35" y2="129.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="130.2" x2="84.35" y2="130.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="130.7" x2="84.35" y2="130.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="131.2" x2="84.35" y2="131.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="131.7" x2="84.35" y2="131.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="132.2" x2="84.35" y2="132.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="132.7" x2="84.35" y2="132.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="133.2" x2="84.35" y2="133.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="133.7" x2="84.35" y2="133.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="134.2" x2="84.35" y2="134.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="134.7" x2="84.35" y2="134.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="135.2" x2="84.35" y2="135.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="135.7" x2="84.35" y2="135.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="136.2" x2="84.35" y2="136.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="136.7" x2="84.35" y2="136.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="137.2" x2="84.35" y2="137.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="137.7" x2="84.35" y2="137.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="138.2" x2="84.35" y2="138.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="138.7" x2="84.35" y2="138.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="139.2" x2="84.35" y2="139.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="139.7" x2="84.35" y2="139.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="140.2" x2="84.35" y2="140.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="140.7" x2="84.35" y2="140.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="141.2" x2="84.35" y2="141.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="141.7" x2="84.35" y2="141.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="142.2" x2="84.35" y2="142.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="142.7" x2="84.35" y2="142.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="143.2" x2="84.35" y2="143.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="143.7" x2="84.35" y2="143.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="144.19" x2="84.35" y2="144.44" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.35" y1="144.69" x2="84.35" y2="144.94" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M84.35,144.69v.25h2.19v-.25h-2.19M86.54,144.44v-.25h-2.19v.25h2.19M84.35,143.7v.25h2.19v-.25h-2.19M86.54,143.45v-.25h-2.19v.25h2.19M84.35,142.7v.25h2.19v-.25h-2.19M84.35,142.2v.25h2.19v-.25h-2.19M86.54,141.95v-.25h-2.19v.25h2.19M84.35,141.2v.25h2.19v-.25h-2.19M84.35,140.7v.25h2.19v-.25h-2.19M86.54,140.45v-.25h-2.19v.25h2.19M84.35,139.7v.25h2.19v-.25h-2.19M86.54,139.45v-.25h-2.19v.25h2.19M86.54,138.95v-.25h-2.19v.25h2.19M84.35,138.2v.25h2.19v-.25h-2.19M86.54,137.95v-.25h-2.19v.25h2.19M86.54,137.45v-.25h-2.19v.25h2.19M86.54,136.7h-2.19v.25h2.19v-.25M84.35,136.45h2.19v-.25h-2.19v.25M84.35,135.95h2.19v-.25h-2.19v.25Z" fill="none"/>
    <path d="M86.52,135.7l.02.02M86.45,135.7l.09.09M86.38,135.7l.15.15M86.32,135.7l.22.22M86.25,135.7l.25.25M86.18,135.7l.25.25M86.12,135.7l.25.25M86.05,135.7l.25.25M85.99,135.7l.25.25M86.49,136.2l.05.05M85.92,135.7l.25.25M86.42,136.2l.12.12M85.85,135.7l.25.25M86.35,136.2l.18.18M85.79,135.7l.25.25M86.29,136.2l.25.25M85.72,135.7l.25.25M86.22,136.2l.25.25M85.65,135.7l.25.25M86.15,136.2l.25.25M85.59,135.7l.25.25M86.09,136.2l.25.25M85.52,135.7l.25.25M86.52,136.7l.02.02M86.02,136.2l.25.25M85.46,135.7l.25.25M86.46,136.7l.08.08M85.96,136.2l.25.25M85.39,135.7l.25.25M86.39,136.7l.15.15M85.89,136.2l.25.25M85.32,135.7l.25.25M86.32,136.7l.21.21M85.82,136.2l.25.25M85.26,135.7l.25.25M86.26,136.7l.25.25M85.76,136.2l.25.25M85.19,135.7l.25.25M86.19,136.7l.25.25M85.69,136.2l.25.25M85.12,135.7l.25.25M86.12,136.7l.25.25M85.62,136.2l.25.25M85.06,135.7l.25.25M86.06,136.7l.25.25M85.56,136.2l.25.25M84.99,135.7l.25.25M86.49,137.2l.05.05M85.49,136.2l.25.25M85.99,136.7l.25.25M84.93,135.7l.25.25M86.43,137.2l.11.11M85.43,136.2l.25.25M85.93,136.7l.25.25M84.86,135.7l.25.25M86.36,137.2l.18.18M85.36,136.2l.25.25M85.86,136.7l.25.25M84.79,135.7l.25.25M86.29,137.2l.24.24M85.29,136.2l.25.25M85.79,136.7l.25.25M84.73,135.7l.25.25M86.23,137.2l.25.25M85.23,136.2l.25.25M85.73,136.7l.25.25M84.66,135.7l.25.25M86.16,137.2l.25.25M85.16,136.2l.25.25M85.66,136.7l.25.25M84.59,135.7l.25.25M86.09,137.2l.25.25M85.09,136.2l.25.25M85.59,136.7l.25.25M84.53,135.7l.25.25M86.53,137.7h0M85.03,136.2l.25.25M86.03,137.2l.25.25M85.53,136.7l.25.25M84.46,135.7l.25.25M86.46,137.7l.08.08M84.96,136.2l.25.25M85.96,137.2l.25.25M85.46,136.7l.25.25M84.4,135.7l.25.25M86.39,137.7l.14.14M84.9,136.2l.25.25M85.9,137.2l.25.25M85.4,136.7l.25.25M84.35,135.72l.23.23M86.33,137.7l.21.21M84.83,136.2l.25.25M85.83,137.2l.25.25M85.33,136.7l.25.25M84.35,135.79l.16.16M86.26,137.7l.25.25M84.76,136.2l.25.25M85.76,137.2l.25.25M85.26,136.7l.25.25M84.35,135.85l.1.1M86.2,137.7l.25.25M84.7,136.2l.25.25M85.7,137.2l.25.25M85.2,136.7l.25.25M84.35,135.92l.03.03M86.13,137.7l.25.25M84.63,136.2l.25.25M85.63,137.2l.25.25M85.13,136.7l.25.25M84.56,136.2l.25.25M86.06,137.7l.25.25M85.06,136.7l.25.25M85.56,137.2l.25.25M84.5,136.2l.25.25M86.5,138.2l.04.04M85,136.7l.25.25M86,137.7l.25.25M85.5,137.2l.25.25M84.43,136.2l.25.25M86.43,138.2l.11.11M84.93,136.7l.25.25M85.93,137.7l.25.25M85.43,137.2l.25.25M84.37,136.2l.25.25M86.36,138.2l.17.17M84.87,136.7l.25.25M85.86,137.7l.25.25M85.37,137.2l.25.25M84.35,136.25l.2.2M86.3,138.2l.24.24M84.8,136.7l.25.25M85.8,137.7l.25.25M85.3,137.2l.25.25M84.35,136.32l.13.13M86.23,138.2l.25.25M84.73,136.7l.25.25M85.73,137.7l.25.25M85.23,137.2l.25.25M84.35,136.38l.07.07M86.17,138.2l.25.25M84.67,136.7l.25.25M85.67,137.7l.25.25M85.17,137.2l.25.25M84.6,136.7l.25.25M86.1,138.2l.25.25M85.1,137.2l.25.25M85.6,137.7l.25.25M84.53,136.7l.25.25M86.53,138.7h0M85.03,137.2l.25.25M86.03,138.2l.25.25M85.53,137.7l.25.25M84.47,136.7l.25.25M86.47,138.7l.07.07M84.97,137.2l.25.25M85.97,138.2l.25.25M85.47,137.7l.25.25M84.4,136.7l.25.25M86.4,138.7l.14.14M84.9,137.2l.25.25M85.9,138.2l.25.25M85.4,137.7l.25.25M84.35,136.72l.23.23M86.33,138.7l.2.2M84.84,137.2l.25.25M85.83,138.2l.25.25M85.33,137.7l.25.25M84.35,136.78l.17.17M86.27,138.7l.25.25M84.77,137.2l.25.25M85.77,138.2l.25.25M85.27,137.7l.25.25M84.35,136.85l.1.1M86.2,138.7l.25.25M84.7,137.2l.25.25M85.7,138.2l.25.25M85.2,137.7l.25.25M84.35,136.91l.04.04M86.14,138.7l.25.25M84.64,137.2l.25.25M85.64,138.2l.25.25M85.14,137.7l.25.25M84.57,137.2l.25.25M86.07,138.7l.25.25M85.07,137.7l.25.25M85.57,138.2l.25.25M84.5,137.2l.25.25M86.5,139.2l.03.03M85,137.7l.25.25M86,138.7l.25.25M85.5,138.2l.25.25M84.44,137.2l.25.25M86.44,139.2l.1.1M84.94,137.7l.25.25M85.94,138.7l.25.25M85.44,138.2l.25.25M84.37,137.2l.25.25M86.37,139.2l.17.17M84.87,137.7l.25.25M85.87,138.7l.25.25M85.37,138.2l.25.25M84.35,137.25l.2.2M86.3,139.2l.23.23M84.8,137.7l.25.25M85.8,138.7l.25.25M85.3,138.2l.25.25M84.35,137.31l.14.14M86.24,139.2l.25.25M84.74,137.7l.25.25M85.74,138.7l.25.25M85.24,138.2l.25.25M84.35,137.38l.07.07M86.17,139.2l.25.25M84.67,137.7l.25.25M85.67,138.7l.25.25M85.17,138.2l.25.25M84.35,137.44h0M86.11,139.2l.25.25M84.61,137.7l.25.25M85.61,138.7l.25.25M85.11,138.2l.25.25M84.54,137.7l.25.25M86.04,139.2l.25.25M85.04,138.2l.25.25M85.54,138.7l.25.25M84.47,137.7l.25.25M86.47,139.7l.06.06M84.97,138.2l.25.25M85.97,139.2l.25.25M85.47,138.7l.25.25M84.41,137.7l.25.25M86.41,139.7l.13.13M84.91,138.2l.25.25M85.91,139.2l.25.25M85.41,138.7l.25.25M84.35,137.71l.24.24M86.34,139.7l.2.2M84.84,138.2l.25.25M85.84,139.2l.25.25M85.34,138.7l.25.25M84.35,137.78l.17.17M86.27,139.7l.25.25M84.77,138.2l.25.25M85.77,139.2l.25.25M85.27,138.7l.25.25M84.35,137.84l.11.11M86.21,139.7l.25.25M84.71,138.2l.25.25M85.71,139.2l.25.25M85.21,138.7l.25.25M84.35,137.91l.04.04M86.14,139.7l.25.25M84.64,138.2l.25.25M85.64,139.2l.25.25M85.14,138.7l.25.25M84.58,138.2l.25.25M86.07,139.7l.25.25M85.08,138.7l.25.25M85.58,139.2l.25.25M84.51,138.2l.25.25M86.51,140.2l.03.03M85.01,138.7l.25.25M86.01,139.7l.25.25M85.51,139.2l.25.25M84.44,138.2l.25.25M86.44,140.2l.1.1M84.94,138.7l.25.25M85.94,139.7l.25.25M85.44,139.2l.25.25M84.38,138.2l.25.25M86.38,140.2l.16.16M84.88,138.7l.25.25M85.88,139.7l.25.25M85.38,139.2l.25.25M84.35,138.24l.21.21M86.31,140.2l.23.23M84.81,138.7l.25.25M85.81,139.7l.25.25M85.31,139.2l.25.25M84.35,138.31l.14.14M86.24,140.2l.25.25M84.74,138.7l.25.25M85.74,139.7l.25.25M85.24,139.2l.25.25M84.35,138.37l.08.08M86.18,140.2l.25.25M84.68,138.7l.25.25M85.68,139.7l.25.25M85.18,139.2l.25.25M84.35,138.44h.01M86.11,140.2l.25.25M84.61,138.7l.25.25M85.61,139.7l.25.25M85.11,139.2l.25.25M84.55,138.7l.25.25M86.04,140.2l.25.25M85.05,139.2l.25.25M85.54,139.7l.25.25M84.48,138.7l.25.25M86.48,140.7l.06.06M84.98,139.2l.25.25M85.98,140.2l.25.25M85.48,139.7l.25.25M84.41,138.7l.25.25M86.41,140.7l.13.13M84.91,139.2l.25.25M85.91,140.2l.25.25M85.41,139.7l.25.25M84.35,138.7l.25.25M86.35,140.7l.19.19M84.85,139.2l.25.25M85.85,140.2l.25.25M85.35,139.7l.25.25M84.35,138.77l.18.18M86.28,140.7l.25.25M84.78,139.2l.25.25M85.78,140.2l.25.25M85.28,139.7l.25.25M84.35,138.84l.11.11M86.21,140.7l.25.25M84.71,139.2l.25.25M85.71,140.2l.25.25M85.21,139.7l.25.25M84.35,138.9l.05.05M86.15,140.7l.25.25M84.65,139.2l.25.25M85.65,140.2l.25.25M85.15,139.7l.25.25M84.58,139.2l.25.25M86.08,140.7l.25.25M85.08,139.7l.25.25M85.58,140.2l.25.25M84.52,139.2l.25.25M86.51,141.2l.02.02M85.01,139.7l.25.25M86.01,140.7l.25.25M85.51,140.2l.25.25M84.45,139.2l.25.25M86.45,141.2l.09.09M84.95,139.7l.25.25M85.95,140.7l.25.25M85.45,140.2l.25.25M84.38,139.2l.25.25M86.38,141.2l.16.16M84.88,139.7l.25.25M85.88,140.7l.25.25M85.38,140.2l.25.25M84.35,139.23l.22.22M86.32,141.2l.22.22M84.82,139.7l.25.25M85.82,140.7l.25.25M85.32,140.2l.25.25M84.35,139.3l.15.15M86.25,141.2l.25.25M84.75,139.7l.25.25M85.75,140.7l.25.25M85.25,140.2l.25.25M84.35,139.37l.08.08M86.18,141.2l.25.25M84.68,139.7l.25.25M85.68,140.7l.25.25M85.18,140.2l.25.25M84.35,139.43l.02.02M86.12,141.2l.25.25M84.62,139.7l.25.25M85.62,140.7l.25.25M85.12,140.2l.25.25M84.55,139.7l.25.25M86.05,141.2l.25.25M85.05,140.2l.25.25M85.55,140.7l.25.25M84.48,139.7l.25.25M86.48,141.7l.05.05M84.98,140.2l.25.25M85.98,141.2l.25.25M85.48,140.7l.25.25M84.42,139.7l.25.25M86.42,141.7l.12.12M84.92,140.2l.25.25M85.92,141.2l.25.25M85.42,140.7l.25.25M84.35,139.7l.25.25M86.35,141.7l.19.19M84.85,140.2l.25.25M85.85,141.2l.25.25M85.35,140.7l.25.25M84.35,139.76l.18.18M86.28,141.7l.25.25M84.79,140.2l.25.25M85.79,141.2l.25.25M85.29,140.7l.25.25M84.35,139.83l.12.12M86.22,141.7l.25.25M84.72,140.2l.25.25M85.72,141.2l.25.25M85.22,140.7l.25.25M84.35,139.9l.05.05M86.15,141.7l.25.25M84.65,140.2l.25.25M85.65,141.2l.25.25M85.15,140.7l.25.25M84.59,140.2l.25.25M86.09,141.7l.25.25M85.09,140.7l.25.25M85.59,141.2l.25.25M84.52,140.2l.25.25M86.52,142.2l.02.02M85.02,140.7l.25.25M86.02,141.7l.25.25M85.52,141.2l.25.25M84.45,140.2l.25.25M86.45,142.2l.08.08M84.95,140.7l.25.25M85.95,141.7l.25.25M85.45,141.2l.25.25M84.39,140.2l.25.25M86.39,142.2l.15.15M84.89,140.7l.25.25M85.89,141.7l.25.25M85.39,141.2l.25.25M84.35,140.23l.22.22M86.32,142.2l.22.22M84.82,140.7l.25.25M85.82,141.7l.25.25M85.32,141.2l.25.25M84.35,140.29l.15.15M86.25,142.2l.25.25M84.76,140.7l.25.25M85.75,141.7l.25.25M85.26,141.2l.25.25M84.35,140.36l.09.09M86.19,142.2l.25.25M84.69,140.7l.25.25M85.69,141.7l.25.25M85.19,141.2l.25.25M84.35,140.43l.02.02M86.12,142.2l.25.25M84.62,140.7l.25.25M85.62,141.7l.25.25M85.12,141.2l.25.25M84.56,140.7l.25.25M86.06,142.2l.25.25M85.06,141.2l.25.25M85.56,141.7l.25.25M84.49,140.7l.25.25M86.49,142.7l.05.05M84.99,141.2l.25.25M85.99,142.2l.25.25M85.49,141.7l.25.25M84.42,140.7l.25.25M86.42,142.7l.11.11M84.92,141.2l.25.25M85.92,142.2l.25.25M85.42,141.7l.25.25M84.36,140.7l.25.25M86.36,142.7l.18.18M84.86,141.2l.25.25M85.86,142.2l.25.25M85.36,141.7l.25.25M84.35,140.76l.19.19M86.29,142.7l.25.25M84.79,141.2l.25.25M85.79,142.2l.25.25M85.29,141.7l.25.25M84.35,140.82l.12.12M86.22,142.7l.25.25M84.73,141.2l.25.25M85.72,142.2l.25.25M85.22,141.7l.25.25M84.35,140.89l.06.06M86.16,142.7l.25.25M84.66,141.2l.25.25M85.66,142.2l.25.25M85.16,141.7l.25.25M84.59,141.2l.25.25M86.09,142.7l.25.25M85.09,141.7l.25.25M85.59,142.2l.25.25M84.53,141.2l.25.25M86.53,143.2h.01M85.03,141.7l.25.25M86.03,142.7l.25.25M85.53,142.2l.25.25M84.46,141.2l.25.25M86.46,143.2l.08.08M84.96,141.7l.25.25M85.96,142.7l.25.25M85.46,142.2l.25.25M84.39,141.2l.25.25M86.39,143.2l.14.14M84.89,141.7l.25.25M85.89,142.7l.25.25M85.39,142.2l.25.25M84.35,141.22l.23.23M86.33,143.2l.21.21M84.83,141.7l.25.25M85.83,142.7l.25.25M85.33,142.2l.25.25M84.35,141.29l.16.16M86.26,143.2l.25.25M84.76,141.7l.25.25M85.76,142.7l.25.25M85.26,142.2l.25.25M84.35,141.35l.09.09M86.19,143.2l.25.25M84.69,141.7l.25.25M85.69,142.7l.25.25M85.19,142.2l.25.25M84.35,141.42l.03.03M86.13,143.2l.25.25M84.63,141.7l.25.25M85.63,142.7l.25.25M85.13,142.2l.25.25M84.56,141.7l.25.25M86.06,143.2l.25.25M85.06,142.2l.25.25M85.56,142.7l.25.25M84.5,141.7l.25.25M86.49,143.7l.04.04M85,142.2l.25.25M86,143.2l.25.25M85.5,142.7l.25.25M84.43,141.7l.25.25M86.43,143.7l.11.11M84.93,142.2l.25.25M85.93,143.2l.25.25M85.43,142.7l.25.25M84.36,141.7l.25.25M86.36,143.7l.17.17M84.86,142.2l.25.25M85.86,143.2l.25.25M85.36,142.7l.25.25M84.35,141.75l.2.2M86.3,143.7l.24.24M84.8,142.2l.25.25M85.8,143.2l.25.25M85.3,142.7l.25.25M84.35,141.82l.13.13M86.23,143.7l.25.25M84.73,142.2l.25.25M85.73,143.2l.25.25M85.23,142.7l.25.25M84.35,141.88l.06.06M86.16,143.7l.25.25M84.66,142.2l.25.25M85.66,143.2l.25.25M85.16,142.7l.25.25M84.6,142.2l.25.25M86.1,143.7l.25.25M85.1,142.7l.25.25M85.6,143.2l.25.25M84.53,142.2l.25.25M86.53,144.19h0M85.03,142.7l.25.25M86.03,143.7l.25.25M85.53,143.2l.25.25M84.47,142.2l.25.25M86.46,144.19l.07.07M84.97,142.7l.25.25M85.96,143.7l.25.25M85.47,143.2l.25.25M84.4,142.2l.25.25M86.4,144.19l.14.14M84.9,142.7l.25.25M85.9,143.7l.25.25M85.4,143.2l.25.25M84.35,142.21l.23.23M86.33,144.19l.21.21M84.83,142.7l.25.25M85.83,143.7l.25.25M85.33,143.2l.25.25M84.35,142.28l.17.17M86.27,144.19l.25.25M84.77,142.7l.25.25M85.77,143.7l.25.25M85.27,143.2l.25.25M84.35,142.35l.1.1M86.2,144.19l.25.25M84.7,142.7l.25.25M85.7,143.7l.25.25M85.2,143.2l.25.25M84.35,142.41l.03.03M86.13,144.19l.25.25M84.63,142.7l.25.25M85.63,143.7l.25.25M85.13,143.2l.25.25M84.57,142.7l.25.25M86.07,144.19l.25.25M85.07,143.2l.25.25M85.57,143.7l.25.25M84.5,142.7l.25.25M86.5,144.69l.04.04M85,143.2l.25.25M86,144.19l.25.25M85.5,143.7l.25.25M84.44,142.7l.25.25M86.43,144.69l.1.1M84.94,143.2l.25.25M85.93,144.19l.25.25M85.43,143.7l.25.25M84.37,142.7l.25.25M86.37,144.69l.17.17M84.87,143.2l.25.25M85.87,144.19l.25.25M85.37,143.7l.25.25M84.35,142.74l.2.2M86.3,144.69l.24.24M84.8,143.2l.25.25M85.8,144.19l.25.25M85.3,143.7l.25.25M84.35,142.81l.14.14M86.24,144.69l.25.25M84.74,143.2l.25.25M85.74,144.19l.25.25M85.24,143.7l.25.25M84.35,142.88l.07.07M86.17,144.69l.25.25M84.67,143.2l.25.25M85.67,144.19l.25.25M85.17,143.7l.25.25M84.35,142.94h0M86.1,144.69l.25.25M84.6,143.2l.25.25M85.6,144.19l.25.25M85.1,143.7l.25.25M84.54,143.2l.25.25M86.04,144.69l.25.25M85.04,143.7l.25.25M85.54,144.19l.25.25M84.47,143.2l.25.25M85.97,144.69l.25.25M84.97,143.7l.25.25M85.47,144.19l.25.25M84.41,143.2l.25.25M85.9,144.69l.25.25M84.9,143.7l.25.25M85.4,144.19l.25.25M84.35,143.21l.24.24M85.84,144.69l.25.25M84.84,143.7l.25.25M85.34,144.19l.25.25M84.35,143.27l.17.17M85.77,144.69l.25.25M84.77,143.7l.25.25M85.27,144.19l.25.25M84.35,143.34l.11.11M85.71,144.69l.25.25M84.71,143.7l.25.25M85.21,144.19l.25.25M84.35,143.41l.04.04M85.64,144.69l.25.25M84.64,143.7l.25.25M85.14,144.19l.25.25M84.57,143.7l.25.25M85.57,144.69l.25.25M85.07,144.19l.25.25M84.51,143.7l.25.25M85.51,144.69l.25.25M85.01,144.19l.25.25M84.44,143.7l.25.25M85.44,144.69l.25.25M84.94,144.19l.25.25M84.37,143.7l.25.25M85.37,144.69l.25.25M84.87,144.19l.25.25M84.35,143.74l.21.21M85.31,144.69l.25.25M84.81,144.19l.25.25M84.35,143.8l.14.14M85.24,144.69l.25.25M84.74,144.19l.25.25M84.35,143.87l.07.07M85.18,144.69l.25.25M84.68,144.19l.25.25M84.35,143.94h0M85.11,144.69l.25.25M84.61,144.19l.25.25M84.54,144.19l.25.25M85.04,144.69l.25.25M84.48,144.19l.25.25M84.98,144.69l.25.25M84.41,144.19l.25.25M84.91,144.69l.25.25M84.35,144.2l.24.24M84.84,144.69l.25.25M84.35,144.27l.18.18M84.78,144.69l.25.25M84.35,144.33l.11.11M84.71,144.69l.25.25M84.35,144.4l.04.04M84.65,144.69l.25.25M84.58,144.69l.25.25M84.51,144.69l.25.25M84.45,144.69l.25.25M84.38,144.69l.25.25M84.35,144.73l.21.21M84.35,144.8l.15.15M84.35,144.86l.08.08M84.35,144.93h.01" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M84.35,125.21v.25h2.19v-.25h-2.19M86.54,125.96v-.25h-2.19v.25h2.19M86.54,126.46v-.25h-2.19v.25h2.19M84.35,126.71v.25h2.19v-.25h-2.19M86.54,127.46v-.25h-2.19v.25h2.19M84.35,127.71v.25h2.19v-.25h-2.19M86.54,128.45v-.25h-2.19v.25h2.19M86.54,128.95v-.25h-2.19v.25h2.19M84.35,129.2v.25h2.19v-.25h-2.19M84.35,129.7v.25h2.19v-.25h-2.19M86.54,130.45v-.25h-2.19v.25h2.19M84.35,130.7v.25h2.19v-.25h-2.19M84.35,131.2v.25h2.19v-.25h-2.19M86.54,131.95v-.25h-2.19v.25h2.19M84.35,132.2v.25h2.19v-.25h-2.19M84.35,132.7v.25h2.19v-.25h-2.19M84.35,133.2v.25h2.19v-.25h-2.19M86.54,133.95v-.25h-2.19v.25h2.19M84.35,134.2v.25h2.19v-.25h-2.19M86.54,134.95v-.25h-2.19v.25h2.19M84.35,135.2v.25h2.19v-.25h-2.19Z" fill="none"/>
    <path d="M86.49,125.21l.05.05M86.42,125.21l.11.11M86.36,125.21l.18.18M86.29,125.21l.25.25M86.23,125.21l.25.25M86.16,125.21l.25.25M86.09,125.21l.25.25M86.03,125.21l.25.25M86.53,125.71h.01M85.96,125.21l.25.25M86.46,125.71l.08.08M85.89,125.21l.25.25M86.39,125.71l.14.14M85.83,125.21l.25.25M86.33,125.71l.21.21M85.76,125.21l.25.25M86.26,125.71l.25.25M85.7,125.21l.25.25M86.19,125.71l.25.25M85.63,125.21l.25.25M86.13,125.71l.25.25M85.56,125.21l.25.25M86.06,125.71l.25.25M85.5,125.21l.25.25M86.5,126.21l.04.04M86,125.71l.25.25M85.43,125.21l.25.25M86.43,126.21l.11.11M85.93,125.71l.25.25M85.36,125.21l.25.25M86.36,126.21l.17.17M85.86,125.71l.25.25M85.3,125.21l.25.25M86.3,126.21l.24.24M85.8,125.71l.25.25M85.23,125.21l.25.25M86.23,126.21l.25.25M85.73,125.71l.25.25M85.17,125.21l.25.25M86.16,126.21l.25.25M85.66,125.71l.25.25M85.1,125.21l.25.25M86.1,126.21l.25.25M85.6,125.71l.25.25M85.03,125.21l.25.25M86.53,126.71h0M85.53,125.71l.25.25M86.03,126.21l.25.25M84.97,125.21l.25.25M86.47,126.71l.07.07M85.47,125.71l.25.25M85.97,126.21l.25.25M84.9,125.21l.25.25M86.4,126.71l.14.14M85.4,125.71l.25.25M85.9,126.21l.25.25M84.83,125.21l.25.25M86.33,126.71l.2.2M85.33,125.71l.25.25M85.83,126.21l.25.25M84.77,125.21l.25.25M86.27,126.71l.25.25M85.27,125.71l.25.25M85.77,126.21l.25.25M84.7,125.21l.25.25M86.2,126.71l.25.25M85.2,125.71l.25.25M85.7,126.21l.25.25M84.64,125.21l.25.25M86.13,126.71l.25.25M85.13,125.71l.25.25M85.63,126.21l.25.25M84.57,125.21l.25.25M86.07,126.71l.25.25M85.07,125.71l.25.25M85.57,126.21l.25.25M84.5,125.21l.25.25M86.5,127.21l.04.04M85,125.71l.25.25M86,126.71l.25.25M85.5,126.21l.25.25M84.44,125.21l.25.25M86.44,127.21l.1.1M84.94,125.71l.25.25M85.94,126.71l.25.25M85.44,126.21l.25.25M84.37,125.21l.25.25M86.37,127.21l.17.17M84.87,125.71l.25.25M85.87,126.71l.25.25M85.37,126.21l.25.25M84.35,125.25l.2.2M86.3,127.21l.23.23M84.8,125.71l.25.25M85.8,126.71l.25.25M85.3,126.21l.25.25M84.35,125.32l.14.14M86.24,127.21l.25.25M84.74,125.71l.25.25M85.74,126.71l.25.25M85.24,126.21l.25.25M84.35,125.39l.07.07M86.17,127.21l.25.25M84.67,125.71l.25.25M85.67,126.71l.25.25M85.17,126.21l.25.25M84.35,125.45h0M86.1,127.21l.25.25M84.6,125.71l.25.25M85.6,126.71l.25.25M85.1,126.21l.25.25M84.54,125.71l.25.25M86.04,127.21l.25.25M85.04,126.21l.25.25M85.54,126.71l.25.25M84.47,125.71l.25.25M86.47,127.71l.07.07M84.97,126.21l.25.25M85.97,127.21l.25.25M85.47,126.71l.25.25M84.41,125.71l.25.25M86.4,127.71l.13.13M84.91,126.21l.25.25M85.91,127.21l.25.25M85.41,126.71l.25.25M84.35,125.72l.24.24M86.34,127.71l.2.2M84.84,126.21l.25.25M85.84,127.21l.25.25M85.34,126.71l.25.25M84.35,125.78l.17.17M86.27,127.71l.25.25M84.77,126.21l.25.25M85.77,127.21l.25.25M85.27,126.71l.25.25M84.35,125.85l.11.11M86.21,127.71l.25.25M84.71,126.21l.25.25M85.71,127.21l.25.25M85.21,126.71l.25.25M84.35,125.92l.04.04M86.14,127.71l.25.25M84.64,126.21l.25.25M85.64,127.21l.25.25M85.14,126.71l.25.25M84.57,126.21l.25.25M86.07,127.71l.25.25M85.07,126.71l.25.25M85.57,127.21l.25.25M84.51,126.21l.25.25M86.51,128.21l.03.03M85.01,126.71l.25.25M86.01,127.71l.25.25M85.51,127.21l.25.25M84.44,126.21l.25.25M86.44,128.21l.1.1M84.94,126.71l.25.25M85.94,127.71l.25.25M85.44,127.21l.25.25M84.38,126.21l.25.25M86.37,128.21l.16.16M84.88,126.71l.25.25M85.87,127.71l.25.25M85.38,127.21l.25.25M84.35,126.25l.21.21M86.31,128.21l.23.23M84.81,126.71l.25.25M85.81,127.71l.25.25M85.31,127.21l.25.25M84.35,126.31l.14.14M86.24,128.21l.25.25M84.74,126.71l.25.25M85.74,127.71l.25.25M85.24,127.21l.25.25M84.35,126.38l.08.08M86.18,128.21l.25.25M84.68,126.71l.25.25M85.68,127.71l.25.25M85.18,127.21l.25.25M84.35,126.45h0M86.11,128.21l.25.25M84.61,126.71l.25.25M85.61,127.71l.25.25M85.11,127.21l.25.25M84.54,126.71l.25.25M86.04,128.21l.25.25M85.04,127.21l.25.25M85.54,127.71l.25.25M84.48,126.71l.25.25M86.48,128.7l.06.06M84.98,127.21l.25.25M85.98,128.21l.25.25M85.48,127.71l.25.25M84.41,126.71l.25.25M86.41,128.7l.13.13M84.91,127.21l.25.25M85.91,128.21l.25.25M85.41,127.71l.25.25M84.35,126.71l.24.24M86.34,128.7l.19.19M84.85,127.21l.25.25M85.84,128.21l.25.25M85.34,127.71l.25.25M84.35,126.78l.18.18M86.28,128.7l.25.25M84.78,127.21l.25.25M85.78,128.21l.25.25M85.28,127.71l.25.25M84.35,126.84l.11.11M86.21,128.7l.25.25M84.71,127.21l.25.25M85.71,128.21l.25.25M85.21,127.71l.25.25M84.35,126.91l.05.05M86.15,128.7l.25.25M84.65,127.21l.25.25M85.65,128.21l.25.25M85.15,127.71l.25.25M84.58,127.21l.25.25M86.08,128.7l.25.25M85.08,127.71l.25.25M85.58,128.21l.25.25M84.51,127.21l.25.25M86.51,129.2l.02.02M85.01,127.71l.25.25M86.01,128.7l.25.25M85.51,128.21l.25.25M84.45,127.21l.25.25M86.45,129.2l.09.09M84.95,127.71l.25.25M85.95,128.7l.25.25M85.45,128.21l.25.25M84.38,127.21l.25.25M86.38,129.2l.16.16M84.88,127.71l.25.25M85.88,128.7l.25.25M85.38,128.21l.25.25M84.35,127.24l.21.21M86.31,129.2l.22.22M84.81,127.71l.25.25M85.81,128.7l.25.25M85.31,128.21l.25.25M84.35,127.31l.15.15M86.25,129.2l.25.25M84.75,127.71l.25.25M85.75,128.7l.25.25M85.25,128.21l.25.25M84.35,127.37l.08.08M86.18,129.2l.25.25M84.68,127.71l.25.25M85.68,128.7l.25.25M85.18,128.21l.25.25M84.35,127.44l.02.02M86.12,129.2l.25.25M84.62,127.71l.25.25M85.62,128.7l.25.25M85.12,128.21l.25.25M84.55,127.71l.25.25M86.05,129.2l.25.25M85.05,128.21l.25.25M85.55,128.7l.25.25M84.48,127.71l.25.25M86.48,129.7l.05.05M84.98,128.21l.25.25M85.98,129.2l.25.25M85.48,128.7l.25.25M84.42,127.71l.25.25M86.42,129.7l.12.12M84.92,128.21l.25.25M85.92,129.2l.25.25M85.42,128.7l.25.25M84.35,127.71l.25.25M86.35,129.7l.19.19M84.85,128.21l.25.25M85.85,129.2l.25.25M85.35,128.7l.25.25M84.35,127.77l.18.18M86.28,129.7l.25.25M84.78,128.21l.25.25M85.78,129.2l.25.25M85.28,128.7l.25.25M84.35,127.84l.12.12M86.22,129.7l.25.25M84.72,128.21l.25.25M85.72,129.2l.25.25M85.22,128.7l.25.25M84.35,127.9l.05.05M86.15,129.7l.25.25M84.65,128.21l.25.25M85.65,129.2l.25.25M85.15,128.7l.25.25M84.59,128.21l.25.25M86.08,129.7l.25.25M85.09,128.7l.25.25M85.59,129.2l.25.25M84.52,128.21l.25.25M86.52,130.2l.02.02M85.02,128.7l.25.25M86.02,129.7l.25.25M85.52,129.2l.25.25M84.45,128.21l.25.25M86.45,130.2l.09.09M84.95,128.7l.25.25M85.95,129.7l.25.25M85.45,129.2l.25.25M84.39,128.21l.25.25M86.39,130.2l.15.15M84.89,128.7l.25.25M85.89,129.7l.25.25M85.39,129.2l.25.25M84.35,128.24l.22.22M86.32,130.2l.22.22M84.82,128.7l.25.25M85.82,129.7l.25.25M85.32,129.2l.25.25M84.35,128.3l.15.15M86.25,130.2l.25.25M84.75,128.7l.25.25M85.75,129.7l.25.25M85.25,129.2l.25.25M84.35,128.37l.09.09M86.19,130.2l.25.25M84.69,128.7l.25.25M85.69,129.7l.25.25M85.19,129.2l.25.25M84.35,128.43l.02.02M86.12,130.2l.25.25M84.62,128.7l.25.25M85.62,129.7l.25.25M85.12,129.2l.25.25M84.56,128.7l.25.25M86.05,130.2l.25.25M85.06,129.2l.25.25M85.55,129.7l.25.25M84.49,128.7l.25.25M86.49,130.7l.05.05M84.99,129.2l.25.25M85.99,130.2l.25.25M85.49,129.7l.25.25M84.42,128.7l.25.25M86.42,130.7l.12.12M84.92,129.2l.25.25M85.92,130.2l.25.25M85.42,129.7l.25.25M84.36,128.7l.25.25M86.36,130.7l.18.18M84.86,129.2l.25.25M85.86,130.2l.25.25M85.36,129.7l.25.25M84.35,128.77l.19.19M86.29,130.7l.25.25M84.79,129.2l.25.25M85.79,130.2l.25.25M85.29,129.7l.25.25M84.35,128.83l.12.12M86.22,130.7l.25.25M84.72,129.2l.25.25M85.72,130.2l.25.25M85.22,129.7l.25.25M84.35,128.9l.06.06M86.16,130.7l.25.25M84.66,129.2l.25.25M85.66,130.2l.25.25M85.16,129.7l.25.25M84.59,129.2l.25.25M86.09,130.7l.25.25M85.09,129.7l.25.25M85.59,130.2l.25.25M84.53,129.2l.25.25M86.52,131.2h.01M85.02,129.7l.25.25M86.02,130.7l.25.25M85.52,130.2l.25.25M84.46,129.2l.25.25M86.46,131.2l.08.08M84.96,129.7l.25.25M85.96,130.7l.25.25M85.46,130.2l.25.25M84.39,129.2l.25.25M86.39,131.2l.15.15M84.89,129.7l.25.25M85.89,130.7l.25.25M85.39,130.2l.25.25M84.35,129.23l.23.23M86.33,131.2l.21.21M84.83,129.7l.25.25M85.83,130.7l.25.25M85.33,130.2l.25.25M84.35,129.3l.16.16M86.26,131.2l.25.25M84.76,129.7l.25.25M85.76,130.7l.25.25M85.26,130.2l.25.25M84.35,129.36l.09.09M86.19,131.2l.25.25M84.69,129.7l.25.25M85.69,130.7l.25.25M85.19,130.2l.25.25M84.35,129.43l.03.03M86.13,131.2l.25.25M84.63,129.7l.25.25M85.63,130.7l.25.25M85.13,130.2l.25.25M84.56,129.7l.25.25M86.06,131.2l.25.25M85.06,130.2l.25.25M85.56,130.7l.25.25M84.49,129.7l.25.25M86.49,131.7l.04.04M84.99,130.2l.25.25M85.99,131.2l.25.25M85.49,130.7l.25.25M84.43,129.7l.25.25M86.43,131.7l.11.11M84.93,130.2l.25.25M85.93,131.2l.25.25M85.43,130.7l.25.25M84.36,129.7l.25.25M86.36,131.7l.18.18M84.86,130.2l.25.25M85.86,131.2l.25.25M85.36,130.7l.25.25M84.35,129.76l.19.19M86.29,131.7l.24.24M84.8,130.2l.25.25M85.8,131.2l.25.25M85.3,130.7l.25.25M84.35,129.83l.13.13M86.23,131.7l.25.25M84.73,130.2l.25.25M85.73,131.2l.25.25M85.23,130.7l.25.25M84.35,129.89l.06.06M86.16,131.7l.25.25M84.66,130.2l.25.25M85.66,131.2l.25.25M85.16,130.7l.25.25M84.6,130.2l.25.25M86.1,131.7l.25.25M85.1,130.7l.25.25M85.6,131.2l.25.25M84.53,130.2l.25.25M86.53,132.2h0M85.03,130.7l.25.25M86.03,131.7l.25.25M85.53,131.2l.25.25M84.46,130.2l.25.25M86.46,132.2l.07.07M84.96,130.7l.25.25M85.96,131.7l.25.25M85.46,131.2l.25.25M84.4,130.2l.25.25M86.4,132.2l.14.14M84.9,130.7l.25.25M85.9,131.7l.25.25M85.4,131.2l.25.25M84.35,130.22l.23.23M86.33,132.2l.21.21M84.83,130.7l.25.25M85.83,131.7l.25.25M85.33,131.2l.25.25M84.35,130.29l.16.16M86.26,132.2l.25.25M84.77,130.7l.25.25M85.76,131.7l.25.25M85.27,131.2l.25.25M84.35,130.36l.1.1M86.2,132.2l.25.25M84.7,130.7l.25.25M85.7,131.7l.25.25M85.2,131.2l.25.25M84.35,130.42l.03.03M86.13,132.2l.25.25M84.63,130.7l.25.25M85.63,131.7l.25.25M85.13,131.2l.25.25M84.57,130.7l.25.25M86.07,132.2l.25.25M85.07,131.2l.25.25M85.57,131.7l.25.25M84.5,130.7l.25.25M86.5,132.7l.04.04M85,131.2l.25.25M86,132.2l.25.25M85.5,131.7l.25.25M84.43,130.7l.25.25M86.43,132.7l.1.1M84.93,131.2l.25.25M85.93,132.2l.25.25M85.43,131.7l.25.25M84.37,130.7l.25.25M86.37,132.7l.17.17M84.87,131.2l.25.25M85.87,132.2l.25.25M85.37,131.7l.25.25M84.35,130.75l.2.2M86.3,132.7l.24.24M84.8,131.2l.25.25M85.8,132.2l.25.25M85.3,131.7l.25.25M84.35,130.82l.13.13M86.23,132.7l.25.25M84.74,131.2l.25.25M85.73,132.2l.25.25M85.23,131.7l.25.25M84.35,130.89l.07.07M86.17,132.7l.25.25M84.67,131.2l.25.25M85.67,132.2l.25.25M85.17,131.7l.25.25M84.35,130.95h0M86.1,132.7l.25.25M84.6,131.2l.25.25M85.6,132.2l.25.25M85.1,131.7l.25.25M84.54,131.2l.25.25M86.54,133.2h0M85.04,131.7l.25.25M86.04,132.7l.25.25M85.54,132.2l.25.25M84.47,131.2l.25.25M86.47,133.2l.07.07M84.97,131.7l.25.25M85.97,132.7l.25.25M85.47,132.2l.25.25M84.4,131.2l.25.25M86.4,133.2l.13.13M84.9,131.7l.25.25M85.9,132.7l.25.25M85.4,132.2l.25.25M84.35,131.22l.24.24M86.34,133.2l.2.2M84.84,131.7l.25.25M85.84,132.7l.25.25M85.34,132.2l.25.25M84.35,131.28l.17.17M86.27,133.2l.25.25M84.77,131.7l.25.25M85.77,132.7l.25.25M85.27,132.2l.25.25M84.35,131.35l.1.1M86.2,133.2l.25.25M84.7,131.7l.25.25M85.7,132.7l.25.25M85.2,132.2l.25.25M84.35,131.42l.04.04M86.14,133.2l.25.25M84.64,131.7l.25.25M85.64,132.7l.25.25M85.14,132.2l.25.25M84.57,131.7l.25.25M86.07,133.2l.25.25M85.07,132.2l.25.25M85.57,132.7l.25.25M84.51,131.7l.25.25M86.5,133.7l.03.03M85.01,132.2l.25.25M86.01,133.2l.25.25M85.51,132.7l.25.25M84.44,131.7l.25.25M86.44,133.7l.1.1M84.94,132.2l.25.25M85.94,133.2l.25.25M85.44,132.7l.25.25M84.37,131.7l.25.25M86.37,133.7l.16.16M84.87,132.2l.25.25M85.87,133.2l.25.25M85.37,132.7l.25.25M84.35,131.75l.21.21M86.31,133.7l.23.23M84.81,132.2l.25.25M85.81,133.2l.25.25M85.31,132.7l.25.25M84.35,131.81l.14.14M86.24,133.7l.25.25M84.74,132.2l.25.25M85.74,133.2l.25.25M85.24,132.7l.25.25M84.35,131.88l.07.07M86.17,133.7l.25.25M84.67,132.2l.25.25M85.67,133.2l.25.25M85.17,132.7l.25.25M84.35,131.95h0M86.11,133.7l.25.25M84.61,132.2l.25.25M85.61,133.2l.25.25M85.11,132.7l.25.25M84.54,132.2l.25.25M86.04,133.7l.25.25M85.04,132.7l.25.25M85.54,133.2l.25.25M84.48,132.2l.25.25M86.47,134.2l.06.06M84.98,132.7l.25.25M85.97,133.7l.25.25M85.48,133.2l.25.25M84.41,132.2l.25.25M86.41,134.2l.13.13M84.91,132.7l.25.25M85.91,133.7l.25.25M85.41,133.2l.25.25M84.35,132.21l.24.24M86.34,134.2l.2.2M84.84,132.7l.25.25M85.84,133.7l.25.25M85.34,133.2l.25.25M84.35,132.28l.18.18M86.28,134.2l.25.25M84.78,132.7l.25.25M85.78,133.7l.25.25M85.28,133.2l.25.25M84.35,132.34l.11.11M86.21,134.2l.25.25M84.71,132.7l.25.25M85.71,133.7l.25.25M85.21,133.2l.25.25M84.35,132.41l.04.04M86.14,134.2l.25.25M84.64,132.7l.25.25M85.64,133.7l.25.25M85.14,133.2l.25.25M84.58,132.7l.25.25M86.08,134.2l.25.25M85.08,133.2l.25.25M85.58,133.7l.25.25M84.51,132.7l.25.25M86.51,134.7l.03.03M85.01,133.2l.25.25M86.01,134.2l.25.25M85.51,133.7l.25.25M84.45,132.7l.25.25M86.44,134.7l.09.09M84.95,133.2l.25.25M85.94,134.2l.25.25M85.44,133.7l.25.25M84.38,132.7l.25.25M86.38,134.7l.16.16M84.88,133.2l.25.25M85.88,134.2l.25.25M85.38,133.7l.25.25M84.35,132.74l.21.21M86.31,134.7l.23.23M84.81,133.2l.25.25M85.81,134.2l.25.25M85.31,133.7l.25.25M84.35,132.81l.15.15M86.25,134.7l.25.25M84.75,133.2l.25.25M85.75,134.2l.25.25M85.25,133.7l.25.25M84.35,132.87l.08.08M86.18,134.7l.25.25M84.68,133.2l.25.25M85.68,134.2l.25.25M85.18,133.7l.25.25M84.35,132.94h.01M86.11,134.7l.25.25M84.61,133.2l.25.25M85.61,134.2l.25.25M85.11,133.7l.25.25M84.55,133.2l.25.25M86.05,134.7l.25.25M85.05,133.7l.25.25M85.55,134.2l.25.25M84.48,133.2l.25.25M86.48,135.2l.06.06M84.98,133.7l.25.25M85.98,134.7l.25.25M85.48,134.2l.25.25M84.42,133.2l.25.25M86.41,135.2l.12.12M84.91,133.7l.25.25M85.91,134.7l.25.25M85.41,134.2l.25.25M84.35,133.2l.25.25M86.35,135.2l.19.19M84.85,133.7l.25.25M85.85,134.7l.25.25M85.35,134.2l.25.25M84.35,133.27l.18.18M86.28,135.2l.25.25M84.78,133.7l.25.25M85.78,134.7l.25.25M85.28,134.2l.25.25M84.35,133.34l.12.12M86.22,135.2l.25.25M84.72,133.7l.25.25M85.72,134.7l.25.25M85.22,134.2l.25.25M84.35,133.4l.05.05M86.15,135.2l.25.25M84.65,133.7l.25.25M85.65,134.7l.25.25M85.15,134.2l.25.25M84.58,133.7l.25.25M86.08,135.2l.25.25M85.08,134.2l.25.25M85.58,134.7l.25.25M84.52,133.7l.25.25M86.02,135.2l.25.25M85.02,134.2l.25.25M85.52,134.7l.25.25M84.45,133.7l.25.25M85.95,135.2l.25.25M84.95,134.2l.25.25M85.45,134.7l.25.25M84.38,133.7l.25.25M85.88,135.2l.25.25M84.88,134.2l.25.25M85.38,134.7l.25.25M84.35,133.73l.22.22M85.82,135.2l.25.25M84.82,134.2l.25.25M85.32,134.7l.25.25M84.35,133.8l.15.15M85.75,135.2l.25.25M84.75,134.2l.25.25M85.25,134.7l.25.25M84.35,133.87l.08.08M85.69,135.2l.25.25M84.69,134.2l.25.25M85.19,134.7l.25.25M84.35,133.93l.02.02M85.62,135.2l.25.25M84.62,134.2l.25.25M85.12,134.7l.25.25M84.55,134.2l.25.25M85.55,135.2l.25.25M85.05,134.7l.25.25M84.49,134.2l.25.25M85.49,135.2l.25.25M84.99,134.7l.25.25M84.42,134.2l.25.25M85.42,135.2l.25.25M84.92,134.7l.25.25M84.35,134.2l.25.25M85.35,135.2l.25.25M84.85,134.7l.25.25M84.35,134.26l.19.19M85.29,135.2l.25.25M84.79,134.7l.25.25M84.35,134.33l.12.12M85.22,135.2l.25.25M84.72,134.7l.25.25M84.35,134.4l.05.05M85.16,135.2l.25.25M84.66,134.7l.25.25M84.59,134.7l.25.25M85.09,135.2l.25.25M84.52,134.7l.25.25M85.02,135.2l.25.25M84.46,134.7l.25.25M84.96,135.2l.25.25M84.39,134.7l.25.25M84.89,135.2l.25.25M84.35,134.73l.22.22M84.82,135.2l.25.25M84.35,134.79l.16.16M84.76,135.2l.25.25M84.35,134.86l.09.09M84.69,135.2l.25.25M84.35,134.93l.02.02M84.63,135.2l.25.25M84.56,135.2l.25.25M84.49,135.2l.25.25M84.43,135.2l.25.25M84.36,135.2l.25.25M84.35,135.26l.19.19M84.35,135.32l.13.13M84.35,135.39l.06.06" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="100.56" y1="134.36" x2="94.42" y2="129.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="102.4" y1="132.51" x2="99.13" y2="129.64" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="96.26" y1="140.09" x2="89.71" y2="133.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M78.27,132.36c-1.43.34-2.31,1.78-1.96,3.21.23.94.95,1.69,1.88,1.94" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M81.06,131.85c-.31.28-.82.54-1.28.65" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M79.58,132.7s0,0,0,0c-.11.4-.54.73-.95.72s-.65-.33-.53-.73.54-.73.95-.72" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M81.08,138.16c-.31-.27-.82-.53-1.28-.64" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M79.6,137.32c-.11-.4-.54-.73-.95-.73s-.65.33-.54.73.54.73.95.73c0,0,0,0,0,0" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.06,137.96c-.49-.02-1.21.09-1.7.25" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M81.2,138.61c.36.08,1.1.02,1.66-.14.2-.06.36-.12.45-.19" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M79.26,138.12c-.05-.05-.12-.07-.19-.07" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M81.08,138.16c.08.07.18.09.27.05" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M79.26,138.12c.32.29,1,.52,1.5.53.11,0,.21-.01.29-.03" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.84,137.55c-.02-.06-.08-.09-.14-.08-.04.01-.07.04-.08.07" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.29,137.7s-.12-.04-.16,0c0,0-.02.02-.02.03" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.11,137.73c-.03.08-.05.15-.06.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.29,137.7c.06.06.18.04.27-.04.03-.03.06-.07.07-.11" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.31,138.28c.21,0,.44-.19.52-.45.03-.1.04-.2.01-.28" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M79.6,137.32c.03.1.1.17.2.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M79.78,132.5c-.1.03-.17.1-.2.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M79.38,133.06c.24.19.44.46.59.8.48,1.09.27,2.55-.46,3.26" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M78.07,132.82c-.41.24-.53.37-.66.52-.09.11-.18.24-.24.4-.07.2-.09.45-.09.68-.01.52,0,.99.05,1.45.02.26.05.51.12.71.04.1.08.19.15.3.1.16.24.37.77.6" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <ellipse cx="78.65" cy="135.01" rx="1.41" ry=".99" transform="translate(-.55 .32) rotate(-.23)" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <ellipse cx="78.65" cy="135.01" rx="1.41" ry=".99" transform="translate(-.55 .32) rotate(-.23)" fill="#005f7f"/>
    <path d="M83.6,132.44c.02.06.08.09.14.07.04-.01.06-.04.07-.08" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.09,132.26c-.04-.08-.05-.15-.06-.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.09,132.26c.03.06.09.08.15.05.01,0,.02-.01.03-.02" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.27,132.29s.06-.04.1-.04c.1,0,.21.08.24.18" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M79.04,131.98c.07,0,.14-.03.19-.07" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.03,132.03c-.49.02-1.21-.08-1.7-.24" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M81.03,131.4s.1.01.14,0" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M81.17,131.4c.13-.03.31-.05.53-.04.61.01,1.32.17,1.58.35" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M81.33,131.79c-.09-.03-.2-.01-.27.06" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M79.23,131.9c.07-.07.16-.13.27-.19.48-.27,1.16-.41,1.52-.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.28,131.71c.08,0,.17.03.26.08.21.15.34.43.28.64" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="83.81" y1="132.45" x2="86.54" y2="132.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="132.02" x2="82.48" y2="137.99" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="83.78" y1="137.95" x2="86.54" y2="137.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.48" y1="138.56" x2="82.48" y2="144.94" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="82.16 138.61 82.16 145.57 87.16 145.57 87.16 124.33 82.16 124.33 82.16 131.4" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.16" y1="138.61" x2="82.16" y2="145.57" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="82.16" y1="131.98" x2="82.16" y2="138.03" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M79.72,137.48c1.4-.45,2.17-1.95,1.71-3.35-.24-.76-.82-1.36-1.56-1.66" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polygon points="280.4 165.21 269.16 165.21 269.16 182.58 276.42 179.91 277.61 180.13 278.74 179.8 280.4 182.58 280.4 165.21" fill="none"/>
    <path d="M280.4,182.46h-.07M280.4,181.87h-.43M270.88,181.87h-1.72M280.4,181.27h-.78M272.72,181.27h-3.56M274.34,180.68h-5.18M275.96,180.08h-6.8M277.78,180.08h-.44M280.4,179.49h-9.52M280.4,178.89h-7.14M280.4,178.3h-4.76M270.88,178.3h-1.72M280.4,177.7h-2.38M273.26,177.7h-4.1M275.64,177.11h-6.48M278.02,176.51h-8.86M280.4,175.92h-9.52M280.4,175.32h-7.14M280.4,174.73h-4.76M270.88,174.73h-1.72M280.4,174.13h-2.38M273.26,174.13h-4.1M275.64,173.54h-6.48M278.02,172.94h-8.86M280.4,172.35h-9.52M280.4,171.75h-7.14M280.4,171.16h-4.76M270.88,171.16h-1.72M280.4,170.56h-2.38M273.26,170.56h-4.1M275.64,169.97h-6.48M278.02,169.37h-8.86M280.4,168.78h-9.52M280.4,168.18h-7.14M280.4,167.59h-4.76M270.88,167.59h-1.72M280.4,166.99h-2.38M273.26,166.99h-4.1M275.64,166.4h-6.48M278.02,165.8h-8.86M279.81,167.59v9.52M279.21,169.97v9.52M278.62,165.21v2.38M278.62,172.35v7.49M278.02,165.21v4.76M278.02,174.73v5.28M277.43,165.21v7.14M277.43,177.11v2.99M276.83,165.21v9.52M276.83,179.49v.5M276.24,167.59v9.52M275.64,169.97v9.52M275.05,165.21v2.38M275.05,172.35v8.07M274.45,165.21v4.76M274.45,174.73v5.91M273.86,165.21v7.14M273.86,177.11v3.75M273.26,165.21v9.52M273.26,179.49v1.59M272.67,167.59v9.52M272.07,169.97v9.52M271.48,165.21v2.38M271.48,172.35v9.38M270.88,165.21v4.76M270.88,174.73v7.22M270.29,165.21v7.14M270.29,177.11v5.06M269.69,165.21v9.52M269.69,179.49v2.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="269.16" y="165.21" width="11.24" height="23.73" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="269.16" y1="182.58" x2="280.4" y2="182.58" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="270.53" y="183.88" width="8.71" height="3.75" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="280.4 182.58 278.74 179.8 269.16 182.58" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <polyline points="269.16 182.58 276.42 179.91 277.61 180.13" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="264.82" y1="185.19" x2="264.82" y2="187.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <circle cx="264.78" cy="186.6" r="1.18" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="263.44" y1="186.57" x2="266.19" y2="186.57" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="262.36" y="184.01" width="4.73" height="4.94" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x="262.56" y="184.21" width="4.32" height="4.53" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <rect x=".35" y=".35" width="405.35" height="342.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="113.81" y1="60.5" x2="86.89" y2="60.5" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="95.04" y1="70.31" x2="88.34" y2="70.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M86.72,61.56c2.8-.54,5.66-.6,8.48-.17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M95.26,63.66c-2.92.63-5.95.53-8.82-.3" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M113.82,69.09c-.55,0-1-.45-1-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M114.35,63.36c-2.87.83-5.9.94-8.82.3" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M105.59,61.39c2.81-.43,5.68-.37,8.48.17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="112.69" y1="70.31" x2="105.74" y2="70.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="113.81" y1="61.51" x2="113.81" y2="60.5" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="112.82" y1="63.73" x2="112.82" y2="68.09" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="113.69" y1="69.08" x2="113.69" y2="69.08" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="113.69" y1="69.08" x2="113.69" y2="69.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="115.07" y1="68.19" x2="115.07" y2="62.56" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="113.82" y1="69.09" x2="114.17" y2="69.09" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M115.07,68.19c0,.5-.4.9-.9.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="115.07" y1="62.48" x2="115.07" y2="62.48" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="115.07" y1="62.48" x2="115.07" y2="62.56" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M115.07,62.48c-.03.41-.32.76-.72.88" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M114.07,61.56c.52,0,.95.4,1,.92" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M113.69,69.31c0,.55-.45,1-1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M103.97,63.66c-2.36.51-4.8.54-7.18.09" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M96.86,61.33c2.34-.31,4.71-.29,7.05.06" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M96.79,63.75c-.5-.19-.81-.69-.76-1.22" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M96.03,62.53c-.06-.55.29-1.06.83-1.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="96.03" y1="62.68" x2="96.03" y2="62.38" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M103.91,61.39s0,0,0,0c.55.08.92.59.84,1.14" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M104.74,62.53c.08.52-.26,1.02-.78,1.13" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M96.03,62.53c.08.52-.26,1.02-.78,1.13" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M95.19,61.39s0,0,0,0c.55.08.92.59.84,1.14" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="96.04" y1="63.47" x2="96.04" y2="69.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="103.75" y1="70.31" x2="97.04" y2="70.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M104.74,69.31c0,.55-.45,1-1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M97.04,70.31c-.55,0-1-.45-1-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="104.74" y1="63.47" x2="104.74" y2="69.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="104.74" y1="68.63" x2="104.74" y2="69.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M105.53,63.66c-.46-.1-.79-.51-.79-.98" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="104.74" y1="62.68" x2="104.74" y2="62.38" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="104.74" y1="62.68" x2="104.74" y2="62.38" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M104.74,62.38c0-.49.36-.91.85-.99" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M105.74,70.31c-.55,0-1-.45-1-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M96.04,69.31c0,.55-.45,1-1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M88.34,70.31c-.55,0-1-.45-1-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="87.97" y1="66.96" x2="87.98" y2="66.96" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M87.97,68.21c0,.55-.45,1-1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M85.72,62.48c.04-.52.48-.92,1-.92" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="86.89" y1="60.5" x2="86.89" y2="61.53" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M86.44,63.36c-.4-.12-.68-.46-.72-.88" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="85.72" y1="62.48" x2="85.72" y2="62.48" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M86.62,69.21c-.5,0-.9-.4-.9-.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="87.34" y1="69.13" x2="87.34" y2="69.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="86.62" y1="69.21" x2="86.97" y2="69.21" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="87.97" y1="63.73" x2="87.97" y2="68.21" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="85.72" y1="68.31" x2="85.72" y2="62.48" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M145.9,78.77c-.55,0-1-.45-1-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M150.45,86.06c-.63-2.92-.53-5.95.3-8.82" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M152.55,77.52c.54,2.8.6,5.66.17,8.48" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="153.61" y1="95.91" x2="153.61" y2="77.69" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M143.8,79.14c0-.55.45-1,1-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="150.38" y1="78.77" x2="145.9" y2="78.77" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M151.43,86.85c-.47,0-.88-.33-.98-.79" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="150.64" y1="86.85" x2="144.8" y2="86.85" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="145.48" y1="86.85" x2="144.8" y2="86.85" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M150.45,87.63c.1-.46.51-.79.98-.79" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="151.43" y1="86.85" x2="151.73" y2="86.85" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="151.43" y1="86.85" x2="151.73" y2="86.85" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M152.72,86c-.07.49-.49.85-.99.85" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M151.73,86.85c.49,0,.91.36.99.85" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="147.15" y1="78.77" x2="147.15" y2="78.78" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M145.02,95.92c0-.55.45-1,1-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="150.38" y1="94.92" x2="146.02" y2="94.92" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="145.03" y1="95.79" x2="145.03" y2="95.79" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="145.03" y1="95.79" x2="144.8" y2="95.79" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="145.92" y1="97.17" x2="151.55" y2="97.17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="145.02" y1="95.92" x2="145.02" y2="96.27" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M145.92,97.17c-.5,0-.9-.4-.9-.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="151.63" y1="97.17" x2="151.63" y2="97.17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="151.63" y1="97.17" x2="151.55" y2="97.17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M151.63,97.17c-.41-.03-.76-.32-.88-.72" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="152.6" y1="95.91" x2="153.61" y2="95.91" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M152.55,96.17c0,.52-.4.95-.92,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M150.76,96.45c-.83-2.87-.94-5.9-.3-8.82" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M152.72,87.7c.43,2.81.37,5.68-.17,8.48" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="143.8" y1="85.85" x2="143.8" y2="79.14" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="143.8" y1="94.79" x2="143.8" y2="87.85" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M144.8,95.79c-.55,0-1-.45-1-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M144.8,86.85c-.55,0-1-.45-1-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M143.8,87.85c0-.55.45-1,1-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="145.8" y1="76.52" x2="151.63" y2="76.52" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="144.9" y1="77.42" x2="144.9" y2="77.77" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="144.98" y1="78.15" x2="144.8" y2="78.15" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M144.9,77.42c0-.5.4-.9.9-.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="151.63" y1="76.52" x2="151.63" y2="76.52" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M150.76,77.24c.12-.4.46-.68.88-.72" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="153.61" y1="77.69" x2="152.58" y2="77.69" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M151.63,76.52c.52.04.92.48.92,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.15" y1="85.41" x2="84.38" y2="85.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="75.57" y1="76.35" x2="75.57" y2="85.52" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="76.58" y1="85.52" x2="75.57" y2="85.52" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M78.43,75.8c.95,3.36.95,6.91,0,10.26" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M76.63,85.79c-.6-3.21-.6-6.5,0-9.71" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M77.55,86.79c-.52-.04-.92-.48-.92-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="77.55" y1="86.78" x2="77.55" y2="86.79" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="77.55" y1="86.79" x2="77.63" y2="86.79" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M78.43,86.07c-.12.4-.46.68-.88.72" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.15" y1="85.41" x2="84.38" y2="85.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.16,84.54c.55,0,1,.45,1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.15" y1="85.41" x2="84.15" y2="85.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.15" y1="85.41" x2="84.38" y2="85.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.16" y1="85.54" x2="84.16" y2="85.89" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M84.16,85.89c0,.5-.4.9-.9.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="78.8" y1="84.54" x2="83.16" y2="84.54" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="83.26" y1="86.79" x2="77.63" y2="86.79" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M85.38,84.41c0,.55-.45,1-1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M84.38,76.46c.55,0,1,.45,1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="85.38" y1="77.46" x2="85.38" y2="84.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M76.63,76.08c0-.52.4-.95.92-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="76.58" y1="76.35" x2="75.57" y2="76.35" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M77.55,75.09c.41.03.76.32.88.72" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="77.55" y1="75.08" x2="77.63" y2="75.08" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="77.55" y1="75.09" x2="77.55" y2="75.08" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.26,75.08c.5,0,.9.4.9.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.16" y1="76.33" x2="84.16" y2="75.98" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="83.26" y1="75.08" x2="77.63" y2="75.08" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.15" y1="76.46" x2="84.38" y2="76.46" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.15" y1="76.46" x2="84.15" y2="76.46" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="78.8" y1="77.33" x2="83.16" y2="77.33" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M84.16,76.33c0,.55-.45,1-1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="140.91" y1="60.5" x2="114" y2="60.5" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="122.15" y1="70.31" x2="115.45" y2="70.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M113.82,61.56c2.8-.54,5.66-.6,8.48-.17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M122.36,63.66c-2.92.63-5.95.53-8.82-.3" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M140.93,69.09c-.55,0-1-.45-1-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M141.45,63.36c-2.87.83-5.9.94-8.82.3" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M132.7,61.39c2.81-.43,5.68-.37,8.48.17" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="139.8" y1="70.31" x2="132.85" y2="70.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="140.91" y1="61.51" x2="140.91" y2="60.5" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="139.93" y1="63.73" x2="139.93" y2="68.09" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="140.79" y1="69.08" x2="140.79" y2="69.08" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="140.79" y1="69.08" x2="140.79" y2="69.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="142.17" y1="68.19" x2="142.17" y2="62.56" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="140.93" y1="69.09" x2="141.27" y2="69.09" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M142.17,68.19c0,.5-.4.9-.9.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="142.17" y1="62.48" x2="142.17" y2="62.48" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="142.17" y1="62.48" x2="142.17" y2="62.56" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M142.17,62.48c-.03.41-.32.76-.72.88" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M141.17,61.56c.52,0,.95.4,1,.92" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M140.79,69.31c0,.55-.45,1-1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M131.07,63.66c-2.36.51-4.8.54-7.18.09" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M123.97,61.33c2.34-.31,4.71-.29,7.05.06" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M123.9,63.75c-.5-.19-.81-.69-.76-1.22" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M123.14,62.53c-.06-.55.29-1.06.83-1.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="123.14" y1="62.68" x2="123.14" y2="62.38" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M131.01,61.39s0,0,0,0c.55.08.92.59.84,1.14" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M131.85,62.53c.08.52-.26,1.02-.78,1.13" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M123.14,62.53c.08.52-.26,1.02-.78,1.13" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M122.3,61.39s0,0,0,0c.55.08.92.59.84,1.14" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="123.15" y1="63.47" x2="123.15" y2="69.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="130.85" y1="70.31" x2="124.15" y2="70.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M131.85,69.31c0,.55-.45,1-1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M124.15,70.31c-.55,0-1-.45-1-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="131.85" y1="63.47" x2="131.85" y2="69.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="131.85" y1="68.63" x2="131.85" y2="69.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M132.64,63.66c-.46-.1-.79-.51-.79-.98" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="131.85" y1="62.68" x2="131.85" y2="62.38" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="131.85" y1="62.68" x2="131.85" y2="62.38" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M131.85,62.38c0-.49.36-.91.85-.99" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M132.85,70.31c-.55,0-1-.45-1-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M123.15,69.31c0,.55-.45,1-1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M115.45,70.31c-.55,0-1-.45-1-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="115.07" y1="66.96" x2="115.08" y2="66.96" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M115.07,68.21c0,.55-.45,1-1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M112.83,62.48c.04-.52.48-.92,1-.92" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="114" y1="60.5" x2="114" y2="61.53" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M113.54,63.36c-.4-.12-.68-.46-.72-.88" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="112.83" y1="62.48" x2="112.82" y2="62.48" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M113.72,69.21c-.5,0-.9-.4-.9-.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="114.45" y1="69.13" x2="114.45" y2="69.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="113.72" y1="69.21" x2="114.07" y2="69.21" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="115.07" y1="63.73" x2="115.07" y2="68.21" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="112.82" y1="68.31" x2="112.82" y2="62.48" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.15" y1="99.9" x2="84.38" y2="99.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="75.57" y1="90.83" x2="75.57" y2="100.01" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="76.58" y1="100.01" x2="75.57" y2="100.01" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M78.43,90.29c.95,3.36.95,6.91,0,10.26" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M76.63,100.28c-.6-3.21-.6-6.5,0-9.71" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M77.55,101.27c-.52-.04-.92-.48-.92-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="77.55" y1="101.27" x2="77.55" y2="101.28" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="77.55" y1="101.28" x2="77.63" y2="101.28" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M78.43,100.55c-.12.4-.46.68-.88.72" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.15" y1="99.9" x2="84.38" y2="99.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.16,99.03c.55,0,1,.45,1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.15" y1="99.9" x2="84.15" y2="99.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.15" y1="99.9" x2="84.38" y2="99.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.16" y1="100.03" x2="84.16" y2="100.38" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M84.16,100.38c0,.5-.4.9-.9.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="78.8" y1="99.03" x2="83.16" y2="99.03" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="83.26" y1="101.28" x2="77.63" y2="101.28" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M85.38,98.9c0,.55-.45,1-1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M84.38,90.95c.55,0,1,.45,1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="85.38" y1="91.95" x2="85.38" y2="98.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M76.63,90.57c0-.52.4-.95.92-1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="76.58" y1="90.83" x2="75.57" y2="90.83" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M77.55,89.57c.41.03.76.32.88.72" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="77.55" y1="89.57" x2="77.63" y2="89.57" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="77.55" y1="89.57" x2="77.55" y2="89.57" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M83.26,89.57c.5,0,.9.4.9.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.16" y1="90.82" x2="84.16" y2="90.47" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="83.26" y1="89.57" x2="77.63" y2="89.57" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.15" y1="90.95" x2="84.38" y2="90.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="84.15" y1="90.95" x2="84.15" y2="90.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="78.8" y1="91.82" x2="83.16" y2="91.82" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M84.16,90.82c0,.55-.45,1-1,1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M174.71,166.07c1.29,1.14,3.26,1.03,4.41-.26s1.03-3.26-.26-4.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="177.78" y1="159.6" x2="177.28" y2="160.16" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M177.78,159.6c-.52-.46-1.31-.41-1.76.11" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M174.3,166.53c1.55,1.37,3.92,1.23,5.29-.32s1.23-3.92-.32-5.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="177.87" y1="159.68" x2="177.45" y2="160.15" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="179.27" y1="160.93" x2="177.87" y2="159.68" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="178.86" y1="161.39" x2="177.45" y2="160.15" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M172.7,163.44c-.46.52-.41,1.31.11,1.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M174.79,165.97c1.24,1.1,3.13.99,4.23-.25s.99-3.13-.25-4.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="178.77" y1="161.49" x2="177.28" y2="160.16" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="174.3" y1="166.53" x2="172.9" y2="165.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="174.79" y1="165.97" x2="173.3" y2="164.65" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="174.71" y1="166.07" x2="173.31" y2="164.82" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="173.3" y1="164.65" x2="172.8" y2="165.21" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="173.31" y1="164.82" x2="172.9" y2="165.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="176.01" y1="159.71" x2="172.7" y2="163.44" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M167.25,174.47c1.29,1.14,3.26,1.03,4.41-.26s1.03-3.26-.26-4.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="170.32" y1="168.01" x2="169.82" y2="168.57" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M170.32,168.01c-.52-.46-1.31-.41-1.76.11" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M166.84,174.94c1.55,1.37,3.92,1.23,5.29-.32s1.23-3.92-.32-5.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="170.41" y1="168.09" x2="170" y2="168.56" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="171.81" y1="169.33" x2="170.41" y2="168.09" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="171.4" y1="169.8" x2="170" y2="168.56" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M165.24,171.85c-.46.52-.41,1.31.11,1.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M167.34,174.38c1.24,1.1,3.13.99,4.23-.25s.99-3.13-.25-4.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="171.32" y1="169.89" x2="169.82" y2="168.57" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="166.84" y1="174.94" x2="165.44" y2="173.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="167.34" y1="174.38" x2="165.84" y2="173.05" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="167.25" y1="174.47" x2="165.85" y2="173.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="165.84" y1="173.05" x2="165.35" y2="173.61" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="165.85" y1="173.23" x2="165.44" y2="173.7" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="168.56" y1="168.11" x2="165.24" y2="171.85" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M154.46,153.81c-1.29-1.14-3.26-1.03-4.41.26s-1.03,3.26.26,4.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="151.4" y1="160.28" x2="151.89" y2="159.72" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M151.4,160.28c.52.46,1.31.41,1.76-.11" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M154.87,153.35c-1.55-1.37-3.92-1.23-5.29.32s-1.23,3.92.32,5.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="151.3" y1="160.2" x2="151.72" y2="159.73" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="149.9" y1="158.95" x2="151.3" y2="160.2" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="150.31" y1="158.49" x2="151.72" y2="159.73" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M156.47,156.44c.46-.52.41-1.31-.11-1.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M154.38,153.91c-1.24-1.1-3.13-.99-4.23.25s-.99,3.13.25,4.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="150.4" y1="158.39" x2="151.89" y2="159.72" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="154.87" y1="153.35" x2="156.28" y2="154.59" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="154.38" y1="153.91" x2="155.87" y2="155.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="154.46" y1="153.81" x2="155.86" y2="155.06" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="155.87" y1="155.23" x2="156.37" y2="154.67" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="155.86" y1="155.06" x2="156.28" y2="154.59" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="153.16" y1="160.17" x2="156.47" y2="156.44" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M161.92,145.41c-1.29-1.14-3.26-1.03-4.41.26s-1.03,3.26.26,4.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="158.85" y1="151.87" x2="159.35" y2="151.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M158.85,151.87c.52.46,1.31.41,1.76-.11" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M162.33,144.94c-1.55-1.37-3.92-1.23-5.29.32s-1.23,3.92.32,5.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="158.76" y1="151.79" x2="159.17" y2="151.32" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="157.36" y1="150.55" x2="158.76" y2="151.79" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="157.77" y1="150.08" x2="159.17" y2="151.32" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M163.93,148.03c.46-.52.41-1.31-.11-1.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M161.83,145.5c-1.24-1.1-3.13-.99-4.23.25s-.99,3.13.25,4.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="157.85" y1="149.99" x2="159.35" y2="151.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="162.33" y1="144.94" x2="163.73" y2="146.18" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="161.83" y1="145.5" x2="163.33" y2="146.83" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="161.92" y1="145.41" x2="163.32" y2="146.65" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="163.33" y1="146.83" x2="163.83" y2="146.27" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="163.32" y1="146.65" x2="163.73" y2="146.18" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="160.62" y1="151.77" x2="163.93" y2="148.03" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M182.42,157.38c1.29,1.14,3.26,1.03,4.41-.26s1.03-3.26-.26-4.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="185.48" y1="150.91" x2="184.99" y2="151.47" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M185.48,150.91c-.52-.46-1.31-.41-1.76.11" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M182,157.85c1.55,1.37,3.92,1.23,5.29-.32s1.23-3.92-.32-5.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="185.58" y1="150.99" x2="185.16" y2="151.46" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="186.98" y1="152.24" x2="185.58" y2="150.99" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="186.56" y1="152.71" x2="185.16" y2="151.46" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M180.4,154.76c-.46.52-.41,1.31.11,1.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M182.5,157.28c1.24,1.1,3.13.99,4.23-.25s.99-3.13-.25-4.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="186.48" y1="152.8" x2="184.99" y2="151.47" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="182" y1="157.85" x2="180.6" y2="156.6" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="182.5" y1="157.28" x2="181.01" y2="155.96" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="182.42" y1="157.38" x2="181.02" y2="156.13" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="181.01" y1="155.96" x2="180.51" y2="156.52" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="181.02" y1="156.13" x2="180.6" y2="156.6" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="183.72" y1="151.02" x2="180.4" y2="154.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M169.62,136.72c-1.29-1.14-3.26-1.03-4.41.26s-1.03,3.26.26,4.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="166.56" y1="143.19" x2="167.06" y2="142.63" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M166.56,143.19c.52.46,1.31.41,1.76-.11" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M170.04,136.25c-1.55-1.37-3.92-1.23-5.29.32s-1.23,3.92.32,5.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="166.47" y1="143.1" x2="166.88" y2="142.64" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="165.06" y1="141.86" x2="166.47" y2="143.1" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="165.48" y1="141.39" x2="166.88" y2="142.64" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M171.64,139.34c.46-.52.41-1.31-.11-1.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M169.54,136.81c-1.24-1.1-3.13-.99-4.23.25s-.99,3.13.25,4.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="165.56" y1="141.3" x2="167.06" y2="142.63" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="170.04" y1="136.25" x2="171.44" y2="137.5" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="169.54" y1="136.81" x2="171.04" y2="138.14" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="169.62" y1="136.72" x2="171.03" y2="137.96" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="171.04" y1="138.14" x2="171.53" y2="137.58" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="171.03" y1="137.96" x2="171.44" y2="137.5" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="168.32" y1="143.08" x2="171.64" y2="139.34" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M152.65,169.47c-1.14,1.29-1.03,3.26.26,4.41s3.26,1.03,4.41-.26" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="159.12" y1="172.53" x2="158.56" y2="172.04" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M159.12,172.53c.46-.52.41-1.31-.11-1.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M152.18,169.06c-1.37,1.55-1.23,3.92.32,5.29s3.92,1.23,5.29-.32" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="159.03" y1="172.63" x2="158.57" y2="172.21" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="157.79" y1="174.03" x2="159.03" y2="172.63" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="157.32" y1="173.62" x2="158.57" y2="172.21" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M155.27,167.46c-.52-.46-1.31-.41-1.76.11" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M152.74,169.55c-1.1,1.24-.99,3.13.25,4.23s3.13.99,4.23-.25" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="157.23" y1="173.53" x2="158.56" y2="172.04" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="152.18" y1="169.06" x2="153.43" y2="167.65" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="152.74" y1="169.55" x2="154.07" y2="168.06" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="152.65" y1="169.47" x2="153.89" y2="168.07" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="154.07" y1="168.06" x2="153.51" y2="167.56" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="153.89" y1="168.07" x2="153.43" y2="167.65" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="159.01" y1="170.77" x2="155.27" y2="167.46" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M198.6,127.04c1.14-1.29,1.03-3.26-.26-4.41s-3.26-1.03-4.41.26" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="192.14" y1="123.97" x2="192.7" y2="124.47" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M192.14,123.97c-.46.52-.41,1.31.11,1.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M199.07,127.45c1.37-1.55,1.23-3.92-.32-5.29s-3.92-1.23-5.29.32" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="192.22" y1="123.88" x2="192.69" y2="124.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="193.46" y1="122.48" x2="192.22" y2="123.88" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="193.93" y1="122.89" x2="192.69" y2="124.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M195.98,129.05c.52.46,1.31.41,1.76-.11" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M198.51,126.95c1.1-1.24.99-3.13-.25-4.23s-3.13-.99-4.23.25" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="194.02" y1="122.98" x2="192.7" y2="124.47" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="199.07" y1="127.45" x2="197.83" y2="128.85" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="198.51" y1="126.95" x2="197.18" y2="128.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="198.6" y1="127.04" x2="197.36" y2="128.44" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="197.18" y1="128.45" x2="197.74" y2="128.95" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="197.36" y1="128.44" x2="197.83" y2="128.85" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="192.24" y1="125.74" x2="195.98" y2="129.05" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M190.22,148.69c1.29,1.14,3.26,1.03,4.41-.26s1.03-3.26-.26-4.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="193.29" y1="142.22" x2="192.79" y2="142.78" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M193.29,142.22c-.52-.46-1.31-.41-1.76.11" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M189.81,149.16c1.55,1.37,3.92,1.23,5.29-.32s1.23-3.92-.32-5.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="193.38" y1="142.31" x2="192.96" y2="142.77" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="194.78" y1="143.55" x2="193.38" y2="142.31" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="194.37" y1="144.02" x2="192.96" y2="142.77" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M188.21,146.07c-.46.52-.41,1.31.11,1.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M190.3,148.6c1.24,1.1,3.13.99,4.23-.25s.99-3.13-.25-4.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="194.28" y1="144.11" x2="192.79" y2="142.78" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="189.81" y1="149.16" x2="188.4" y2="147.91" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="190.3" y1="148.6" x2="188.81" y2="147.27" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="190.22" y1="148.69" x2="188.82" y2="147.45" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="188.81" y1="147.27" x2="188.31" y2="147.83" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="188.82" y1="147.45" x2="188.4" y2="147.91" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="191.52" y1="142.33" x2="188.21" y2="146.07" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M197.51,140.76c1.29,1.14,3.26,1.03,4.41-.26s1.03-3.26-.26-4.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="200.58" y1="134.3" x2="200.08" y2="134.86" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M200.58,134.3c-.52-.46-1.31-.41-1.76.11" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M197.1,141.23c1.55,1.37,3.92,1.23,5.29-.32s1.23-3.92-.32-5.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="200.67" y1="134.38" x2="200.26" y2="134.85" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="202.07" y1="135.62" x2="200.67" y2="134.38" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="201.66" y1="136.09" x2="200.26" y2="134.85" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M195.5,138.14c-.46.52-.41,1.31.11,1.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M197.6,140.67c1.24,1.1,3.13.99,4.23-.25s.99-3.13-.25-4.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="201.57" y1="136.18" x2="200.08" y2="134.86" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="197.1" y1="141.23" x2="195.7" y2="139.99" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="197.6" y1="140.67" x2="196.1" y2="139.34" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="197.51" y1="140.76" x2="196.11" y2="139.52" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="196.1" y1="139.34" x2="195.6" y2="139.9" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="196.11" y1="139.52" x2="195.7" y2="139.99" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="198.81" y1="134.4" x2="195.5" y2="138.14" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M176.78,128.36c-1.29-1.14-3.26-1.03-4.41.26s-1.03,3.26.26,4.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="173.71" y1="134.82" x2="174.21" y2="134.26" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M173.71,134.82c.52.46,1.31.41,1.76-.11" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M177.19,127.89c-1.55-1.37-3.92-1.23-5.29.32s-1.23,3.92.32,5.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="173.62" y1="134.74" x2="174.04" y2="134.27" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="172.22" y1="133.5" x2="173.62" y2="134.74" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="172.63" y1="133.03" x2="174.04" y2="134.27" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M178.79,130.98c.46-.52.41-1.31-.11-1.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M176.7,128.45c-1.24-1.1-3.13-.99-4.23.25s-.99,3.13.25,4.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="172.72" y1="132.94" x2="174.21" y2="134.26" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="177.19" y1="127.89" x2="178.6" y2="129.13" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="176.7" y1="128.45" x2="178.19" y2="129.78" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="176.78" y1="128.36" x2="178.18" y2="129.6" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="178.19" y1="129.78" x2="178.69" y2="129.22" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="178.18" y1="129.6" x2="178.6" y2="129.13" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="175.48" y1="134.72" x2="178.79" y2="130.98" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M183.4,120.87c-1.29-1.14-3.26-1.03-4.41.26s-1.03,3.26.26,4.41" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="180.34" y1="127.34" x2="180.84" y2="126.78" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M180.34,127.34c.52.46,1.31.41,1.76-.11" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M183.82,120.41c-1.55-1.37-3.92-1.23-5.29.32s-1.23,3.92.32,5.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="180.25" y1="127.26" x2="180.66" y2="126.79" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="178.84" y1="126.01" x2="180.25" y2="127.26" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="179.26" y1="125.55" x2="180.66" y2="126.79" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M185.42,123.5c.46-.52.41-1.31-.11-1.76" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <path d="M183.32,120.97c-1.24-1.1-3.13-.99-4.23.25s-.99,3.13.25,4.23" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="179.34" y1="125.45" x2="180.84" y2="126.78" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="183.82" y1="120.41" x2="185.22" y2="121.65" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="183.32" y1="120.97" x2="184.82" y2="122.29" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="183.4" y1="120.87" x2="184.81" y2="122.12" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="184.82" y1="122.29" x2="185.31" y2="121.73" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="184.81" y1="122.12" x2="185.22" y2="121.65" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
    <line x1="182.1" y1="127.23" x2="185.42" y2="123.5" fill="none" stroke="#005f7f" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".71"/>
  </g>
</svg>
      </div>
    </div>
  );
};

export default P1Casa4;
