// ARCHIVO: p2.jsx - Planta Piso 2 para Casa 2
import React from 'react';
import { FloorPlan2 } from '../../FloorPlan2';

const P2Casa2 = ({ onRoomSelect, selectedRoom }) => {
  const handleRoomClick = (roomId) => {
    console.log(`Casa 2 - Piso 2, Habitación seleccionada: ${roomId}`);
    if (onRoomSelect) {
      onRoomSelect(roomId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 px-4">Piso 2 - Casa 2</h3>
      <div className="flex-grow w-full h-full">
        <FloorPlan2
          selectedRoom={selectedRoom}
          onRoomClick={handleRoomClick}
        />
      </div>
    </div>
  );
};

export default P2Casa2;
