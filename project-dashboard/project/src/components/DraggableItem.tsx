import React from 'react';
import { useDrag } from 'react-dnd';

interface DraggableItemProps {
  id: string;
  content: string;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ id, content }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: { id, content },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 
        cursor-move transition-all duration-200 hover:shadow-md hover:bg-gray-100
        ${isDragging ? 'opacity-50' : ''}`}
    >
      {content}
    </div>
  );
};