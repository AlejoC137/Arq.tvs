// ARCHIVO: s1.jsx - Sótano para Casa 4
import React from 'react';
import { FloorPlanC4S1 } from '../../FloorPlanC4S1';

const S1C4 = ({ onRoomSelect, selectedRoom, tasks = [] }) => {
  const handleRoomClick = (roomId) => {
    console.log('[S1C4] Habitación clickeada:', roomId);
    if (onRoomSelect) {
      onRoomSelect(roomId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 px-4">Sótano - Casa 4</h3>
      <div className="flex-grow w-full h-full">
        <FloorPlanC4S1
          selectedRoom={selectedRoom}
          onRoomClick={handleRoomClick}
          tasks={tasks}
        />
      </div>
    </div>
  );
};

export default S1C4;
