import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { CollegeSection } from './CollegeSection';
import { UnmappedSection } from './UnmappedSection';
import type { College } from '../../types';

const COLLEGES: College[] = [
  {
    id: '1',
    name: 'Chabot College',
    departments: ['Computer Science', 'Engineering', 'Mathematics'],
  },
  {
    id: '2',
    name: 'Las Positas College',
    departments: ['Physics', 'Mathematics', 'Chemistry'],
  },
];

const SAMPLE_COURSES = {
  '1': [
    {
      id: 'cs101_1',
      code: 'CS101',
      name: 'Introduction to Programming',
      department: 'Computer Science',
      credits: 3,
      description: 'Fundamentals of programming using Python',
      color: '#3B82F6',
    },
    {
      id: 'cs201_1',
      code: 'CS201',
      name: 'Data Structures',
      department: 'Computer Science',
      credits: 4,
      description: 'Advanced data structures and algorithms',
      color: '#10B981',
    },
    {
      id: 'cs301_1',
      code: 'CS301',
      name: 'Database Systems',
      department: 'Computer Science',
      credits: 3,
      description: 'Introduction to database management systems',
      color: '#F59E0B',
    },
  ],
  '2': [
    {
      id: 'math101_2',
      code: 'MATH101',
      name: 'Calculus I',
      department: 'Mathematics',
      credits: 4,
      description: 'Limits, derivatives, and integrals',
      color: '#8B5CF6',
    },
    {
      id: 'math201_2',
      code: 'MATH201',
      name: 'Linear Algebra',
      department: 'Mathematics',
      credits: 3,
      description: 'Vectors, matrices, and linear transformations',
      color: '#EC4899',
    },
    {
      id: 'phys101_2',
      code: 'PHYS101',
      name: 'Physics I',
      department: 'Physics',
      credits: 4,
      description: 'Mechanics and thermodynamics',
      color: '#14B8A6',
    },
  ],
  'unmapped': [
    {
      id: 'unmapped1',
      code: 'UNMP101',
      name: 'Art History',
      department: 'Arts',
      credits: 3,
      description: 'Introduction to Art History',
      color: '#6B7280',
      isUnmapped: true,
    },
    {
      id: 'unmapped2',
      code: 'UNMP102',
      name: 'World Literature',
      department: 'English',
      credits: 3,
      description: 'Survey of World Literature',
      color: '#6B7280',
      isUnmapped: true,
    },
    {
      id: 'unmapped3',
      code: 'UNMP103',
      name: 'Music Theory',
      department: 'Music',
      credits: 3,
      description: 'Fundamentals of Music Theory',
      color: '#6B7280',
      isUnmapped: true,
    },
  ],
};

interface CollegeSelectProps {
  activeDragId?: string | null;
}

export const CollegeSelect: React.FC<CollegeSelectProps> = ({ activeDragId }) => {
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);

  const handleCollegeSelect = (college: College) => {
    setSelectedCollegeId(college.id === selectedCollegeId ? null : college.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
        <Building2 className="w-5 h-5" />
        <h2>Select College</h2>
      </div>

      <div className="space-y-4">
        {COLLEGES.map((college) => (
          <CollegeSection
            key={college.id}
            college={college}
            courses={SAMPLE_COURSES[college.id] || []}
            activeDragId={activeDragId || null}
            isSelected={college.id === selectedCollegeId}
            onSelect={() => handleCollegeSelect(college)}
          />
        ))}

        <UnmappedSection courses={SAMPLE_COURSES.unmapped} />
      </div>
    </div>
  );
};