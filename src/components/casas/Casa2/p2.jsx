// ARCHIVO: p2.jsx - Planta Piso 2 para Casa 2
import React from 'react';
import { FloorPlan2 } from '../../FloorPlan2Enhanced';

const P2Casa2 = ({ onRoomSelect, selectedRoom, tasks = [] }) => {
  const handleRoomClick = (roomId) => {
    console.log('[P2Casa2] Habitación clickeada:', roomId);
    console.log('[P2Casa2] onRoomSelect exists?', !!onRoomSelect);
    if (onRoomSelect) {
      onRoomSelect(roomId);
    } else {
      console.warn('[P2Casa2] onRoomSelect no está definido!');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 px-4">Piso 2 - Casa 2</h3>
      <div className="flex-grow w-full h-full">
        <FloorPlan2
          selectedRoom={selectedRoom}
          onRoomClick={handleRoomClick}
          tasks={tasks}
        />
      </div>
    </div>
  );
};

export default P2Casa2;
