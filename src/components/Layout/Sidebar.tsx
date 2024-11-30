import React from 'react';
import { CollegeSelect } from '../Sidebar/CollegeSelect';

interface SidebarProps {
  activeDragId?: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeDragId }) => {
  return (
    <aside className="w-80 bg-gray-50 p-4 border-r border-gray-200 overflow-y-auto">
      <div className="space-y-6">
        <CollegeSelect activeDragId={activeDragId} />
      </div>
    </aside>
  );
};