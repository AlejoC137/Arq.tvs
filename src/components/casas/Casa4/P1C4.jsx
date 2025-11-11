// ARCHIVO: p1.jsx - Piso 1 para Casa 4
import React from 'react';
import { FloorPlanC4P1 } from '../../FloorPlanC4P1';

const P1C4 = ({ onRoomSelect, selectedRoom, tasks = [] }) => {
  const handleRoomClick = (roomId) => {
    console.log('[P1C4] Habitación clickeada:', roomId);
    if (onRoomSelect) {
      onRoomSelect(roomId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 px-4">Piso 1 - Casa 4</h3>
      <div className="flex-grow w-full h-full">
        <FloorPlanC4P1
          selectedRoom={selectedRoom}
          onRoomClick={handleRoomClick}
          tasks={tasks}
        />
      </div>
    </div>
  );
};

export default P1C4;
