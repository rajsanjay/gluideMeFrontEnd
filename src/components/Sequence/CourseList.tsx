import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Course } from '../../types';

interface DraggableCourseProps {
  course: Course;
}

const DraggableCourse: React.FC<DraggableCourseProps> = ({ course }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: course.id,
    data: course,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-4 bg-white rounded-lg shadow-sm border-2 border-gray-100 hover:border-blue-300 cursor-move"
      style={style}
    >
      <h3 className="font-medium text-gray-900">{course.name}</h3>
      <p className="text-sm text-gray-500">{course.code}</p>
      <div className="mt-1 text-xs text-gray-400">{course.credits} credits</div>
    </div>
  );
};

interface CourseListProps {
  courses: Course[];
}

export const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  return (
    <div className="space-y-3">
      {courses.map((course) => (
        <DraggableCourse key={course.id} course={course} />
      ))}
    </div>
  );
};