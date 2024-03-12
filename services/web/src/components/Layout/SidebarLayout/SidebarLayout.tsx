import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="w-full">
      <Sidebar />

      <div className="ml-64">
        <TopBar />

        <div className="p-4 mt-14">{children}</div>
      </div>
    </div>
  );
};

export default SidebarLayout;
