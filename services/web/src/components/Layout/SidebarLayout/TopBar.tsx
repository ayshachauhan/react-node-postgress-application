import React from 'react';

const TopBar: React.FC = () => {
  return (
    <nav className="fixed top-0 right-0 z-40 bg-white shadow-md w-[calc(100%-16rem)] h-[68px]">
      <div className="px-3 py-3"></div>
    </nav>
  );
};

export default TopBar;
