import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { ScheduleEvent } from '../../types';

interface DraggableEventProps {
  event: ScheduleEvent;
  title: string;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const DraggableEvent: React.FC<DraggableEventProps> = ({
  event,
  title,
  onDragStart,
  onDragEnd,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
    data: event,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-1 text-sm font-medium truncate"
      role="button"
      tabIndex={0}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      aria-label={`${title}. Drag to reschedule.`}
    >
      {title}
    </div>
  );
};