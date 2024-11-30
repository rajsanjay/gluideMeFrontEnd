import React from 'react';

interface TermSelectorProps {
  selectedTerm: string;
  onTermChange: (term: string) => void;
}

export const TermSelector: React.FC<TermSelectorProps> = ({
  selectedTerm,
  onTermChange,
}) => {
  return (
    <select
      value={selectedTerm}
      onChange={(e) => onTermChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="semester">Semester</option>
      <option value="quarter">Quarter</option>
      <option value="trimester">Trimester</option>
      <option value="summer">Summer</option>
      <option value="winter">Winter</option>
    </select>
  );
};