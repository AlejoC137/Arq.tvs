// ARCHIVO: s1.jsx - Sección 1 para Casa 2
import React from 'react';

const S1Casa2 = ({ onRoomSelect, selectedRoom }) => {
  return (
    <div className="flex flex-col h-full p-4">
      <h3 className="text-lg font-semibold mb-4">Sección 1 - Casa 2</h3>
      <div className="flex-grow w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Vista de sección transversal (SVG pendiente)</p>
      </div>
    </div>
  );
};

export default S1Casa2;
