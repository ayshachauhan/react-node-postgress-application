'use client';

import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="bg-white shadow-inner bottom-0 fixed w-[calc(100%-10rem)] h-[36px]">
      <div className="px-5 py-1">
        <div className="text-center text-gray-600 text-base">
          © 2024 Azentia. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;
