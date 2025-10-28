// ARCHIVO: p2.jsx - Planta Piso 2 para Casa 1
import React from 'react';
import { FloorPlan2 } from '../../FloorPlan2';

const P2Casa1 = ({ onRoomSelect, selectedRoom }) => {
  const handleRoomClick = (roomId) => {
    console.log(`Casa 1 - Piso 2, Habitación seleccionada: ${roomId}`);
    if (onRoomSelect) {
      onRoomSelect(roomId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 px-4">Piso 2 - Casa 1</h3>
      <div className="flex-grow w-full h-full">
        <FloorPlan2
          selectedRoom={selectedRoom}
          onRoomClick={handleRoomClick}
        />
      </div>
    </div>
  );
};

export default P2Casa1;
