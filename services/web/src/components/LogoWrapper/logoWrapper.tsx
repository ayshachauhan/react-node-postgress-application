import { AzentiaLogo } from '@root/utils/constants';
import React from 'react';

export type Props = {
  children: React.ReactNode;
};

export const LogoWrapper = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col max-w-md w-full items-center shadow-xl rounded-2xl justify-center py-8">
        <div className=" flex flex-col justify-center items-center">
          <div
            className="mt3"
            dangerouslySetInnerHTML={{
              __html: AzentiaLogo,
            }}
          />
        </div>
        {children}
      </div>
    </div>
  );
};
