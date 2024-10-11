import React, { useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  let style = {
    overflow: 'auto',
    maxWidth: isSidebarCollapsed ? 'calc(100vw - 60px)' : 'calc(100vw - 160px)',
    maxHeight: 'calc(100vh - 93px)',
  };

  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    style = {
      ...style,
      maxWidth: collapsed ? 'calc(100vw - 60px)' : 'calc(100vw - 160px)',
    };
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

        <div className="p-4 pb-12 mt-14" style={style}>
          {children}
        </div>
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
