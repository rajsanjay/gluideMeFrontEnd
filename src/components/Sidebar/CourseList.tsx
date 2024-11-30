import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../../store/useStore';
import type { Course } from '../../types';

interface DraggableCourseProps {
  course: Course;
  isDragging: boolean;
  isPlaced: boolean;
}

const DraggableCourse: React.FC<DraggableCourseProps> = ({ course, isDragging, isPlaced }) => {
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
      className={`p-3 bg-white rounded-lg shadow-sm border-2 transition-all
        ${isDragging ? 'opacity-50 border-blue-300' : 'border-gray-100 hover:border-blue-300'}
        ${isPlaced ? 'opacity-50 cursor-not-allowed' : 'cursor-move'}
        ${course.isUnmapped ? 'cursor-not-allowed opacity-50' : ''}`}
      style={style}
    >
      <div className="flex justify-between items-start">
        <h3 className={`font-medium ${isPlaced ? 'text-gray-400' : ''}`}>{course.name}</h3>
        <span
          className={`text-sm font-mono px-2 py-1 rounded ${
            isPlaced ? 'bg-gray-100 text-gray-400' : `bg-opacity-20 text-opacity-100`
          }`}
          style={{
            backgroundColor: isPlaced ? undefined : course.color + '20',
            color: isPlaced ? undefined : course.color,
          }}
        >
          {course.code}
        </span>
      </div>
      <p className={`text-sm ${isPlaced ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
        {course.description}
      </p>
      <div className="mt-2 text-sm">
        <span className={isPlaced ? 'text-gray-400' : 'text-gray-600'}>{course.credits} credits</span>
        <span className={`mx-2 ${isPlaced ? 'text-gray-400' : 'text-gray-600'}`}>•</span>
        <span className={isPlaced ? 'text-gray-400' : 'text-gray-600'}>{course.department}</span>
      </div>
    </div>
  );
};

interface CourseListProps {
  courses: Course[];
  activeDragId: string | null;
}

export const CourseList: React.FC<CourseListProps> = ({ courses, activeDragId }) => {
  const { placedCourses } = useStore();

  const isCoursePlaced = (courseId: string) => {
    return placedCourses.some(course => course.id === courseId);
  };

  return (
    <div className="space-y-2">
      {courses.map((course) => (
        <DraggableCourse 
          key={course.id} 
          course={course} 
          isDragging={activeDragId === course.id}
          isPlaced={isCoursePlaced(course.id)}
        />
      ))}
    </div>
  );
};