// ARCHIVO: p1.jsx - Planta Piso 1 para Casa 2
import React from 'react';
import { FloorPlanC2P1 } from '../../FloorPlanC2P1';

const P1C2 = ({ onRoomSelect, selectedRoom, tasks = [] }) => {
  const handleRoomClick = (roomId) => {
    console.log('[P1C2] Habitación clickeada:', roomId);
    console.log('[P1C2] onRoomSelect exists?', !!onRoomSelect);
    if (onRoomSelect) {
      onRoomSelect(roomId);
    } else {
      console.warn('[P1C2] onRoomSelect no está definido!');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 px-4">Piso 1 - Casa 2</h3>
      <div className="flex-grow w-full h-full">
        <FloorPlanC2P1
          selectedRoom={selectedRoom}
          onRoomClick={handleRoomClick}
          tasks={tasks}
        />
      </div>
    </div>
  );
};

export default P1C2;
