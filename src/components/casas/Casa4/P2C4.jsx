// ARCHIVO: p2.jsx - Piso 2 para Casa 4
import React from 'react';
import { FloorPlanC4P2 } from '../../FloorPlanC4P2';

const P2C4 = ({ onRoomSelect, selectedRoom, tasks = [] }) => {
  const handleRoomClick = (roomId) => {
    console.log('[P2C4] Habitación clickeada:', roomId);
    if (onRoomSelect) {
      onRoomSelect(roomId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 px-4">Piso 2 - Casa 4</h3>
      <div className="flex-grow w-full h-full">
        <FloorPlanC4P2
          selectedRoom={selectedRoom}
          onRoomClick={handleRoomClick}
          tasks={tasks}
        />
      </div>
    </div>
  );
};

export default P2C4;
