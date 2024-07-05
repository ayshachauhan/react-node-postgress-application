import React, { useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="w-full">
      <Sidebar onCollapseChange={handleSidebarCollapseChange} />

      <div className={`${!isSidebarCollapsed ? 'ml-40' : 'ml-16'}`}>
        <Header
          data={{
            collapsed: isSidebarCollapsed,
          }}
        />

        <div className="p-4 pb-12 mt-14">{children}</div>
        <Footer
          data={{
            collapsed: isSidebarCollapsed,
          }}
        />
      </div>
    </div>
  );
};

export default SidebarLayout;
