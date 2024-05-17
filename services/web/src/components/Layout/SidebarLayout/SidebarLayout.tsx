import React from 'react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="w-full">
      <Sidebar />

      <div className="ml-40">
        <Header />

        <div className="p-4 mt-14">{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default SidebarLayout;
