import React from 'react';

interface ConnectionPointProps {
  position: 'left' | 'right';
  isActive: boolean;
  onClick?: () => void;
}

export const ConnectionPoint: React.FC<ConnectionPointProps> = ({
  position,
  isActive,
  onClick,
}) => {
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all connection-point-${position}
        ${position === 'left' ? '-left-1.5' : '-right-1.5'}
        ${isActive ? 'bg-blue-500 scale-125' : 'bg-gray-300 hover:bg-blue-400'}
        ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    />
  );
};