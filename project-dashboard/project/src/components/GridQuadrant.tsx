import React from 'react';
import { useDrop } from 'react-dnd';

interface GridQuadrantProps {
  id: string;
  items: Array<{ id: string; content: string }>;
  onDrop: (item: any, quadrantId: string) => void;
}

export const GridQuadrant: React.FC<GridQuadrantProps> = ({ id, items, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item) => onDrop(item, id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`p-4 rounded-lg transition-colors duration-200
        ${isOver ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50 border border-gray-200'}
        min-h-[200px]`}
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Quadrant {id}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="p-3 bg-white rounded-md shadow-sm border border-gray-100">
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};