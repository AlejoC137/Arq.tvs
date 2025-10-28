// ARCHIVO: p1.jsx - Planta Piso 1 para Casa 1
import React from 'react';
import { FloorPlan1 } from '../../FloorPlan1';

const P1Casa1 = ({ onRoomSelect, selectedRoom }) => {
  const handleRoomClick = (roomId) => {
    console.log(`Casa 1 - Piso 1, Habitación seleccionada: ${roomId}`);
    if (onRoomSelect) {
      onRoomSelect(roomId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 px-4">Piso 1 - Casa 1</h3>
      <div className="flex-grow w-full h-full">
        <FloorPlan1
          selectedRoom={selectedRoom}
          onRoomClick={handleRoomClick}
        />
      </div>
    </div>
  );
};

export default P1Casa1;
