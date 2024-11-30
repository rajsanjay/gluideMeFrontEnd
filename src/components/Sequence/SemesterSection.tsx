import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ConnectionPoint } from './ConnectionPoint';
import type { PlacedCourse } from '../../types';

interface SemesterSectionProps {
  number: number;
  courses: PlacedCourse[];
  onConnectionStart: (courseId: string) => void;
  onConnectionEnd: (courseId: string) => void;
  connectingFrom: string | null;
}

export const SemesterSection: React.FC<SemesterSectionProps> = ({
  number,
  courses,
  onConnectionStart,
  onConnectionEnd,
  connectingFrom,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `semester-${number}`,
  });

  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[200px] h-full border-r border-gray-200 last:border-r-0 flex flex-col
        ${isOver ? 'bg-blue-50' : ''}`}
    >
      <div className="p-2 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Semester {number}</h3>
      </div>
      <div className="p-2 flex-1 overflow-y-auto">
        {courses.map((course) => (
          <div
            key={course.id}
            id={course.id}
            className={`mb-2 p-2 bg-white rounded border shadow-sm relative group
              ${connectingFrom === course.id ? 'border-blue-500' : 'border-gray-200'}
              ${connectingFrom && connectingFrom !== course.id ? 'hover:border-green-500' : 'hover:border-blue-300'}`}
          >
            <div className="text-xs font-medium text-gray-900">{course.name}</div>
            <div className="text-xs text-gray-500 mt-0.5">{course.code}</div>
            <div className="text-xs text-gray-400 mt-0.5">{course.credits} credits</div>
            <ConnectionPoint
              position="left"
              isActive={connectingFrom !== null && connectingFrom !== course.id}
              onClick={() => connectingFrom && onConnectionEnd(course.id)}
            />
            <ConnectionPoint
              position="right"
              isActive={connectingFrom === course.id}
              onClick={() => !connectingFrom && onConnectionStart(course.id)}
            />
          </div>
        ))}
      </div>
      <div className="p-2 bg-gray-50 border-t border-gray-200">
        <div className="text-sm font-medium text-gray-700">
          Total Credits: {totalCredits}
        </div>
      </div>
    </div>
  );
};