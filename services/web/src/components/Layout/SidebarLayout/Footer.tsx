'use client';

import React from 'react';

interface Data {
  collapsed: boolean;
}

interface ChildProps {
  data: Data;
}

const Footer: React.FC<ChildProps> = ({ data }) => {
  return (
    <div
      className={`bg-white shadow-inner bottom-0 fixed h-[36px] ${
        data.collapsed ? 'w-[calc(100%-4rem)] ' : 'w-[calc(100%-10rem)]'
      }`}
    >
      <div className="px-5 py-1">
        <div className="text-center text-gray-600 text-base">
          © 2024 Azentia. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;
