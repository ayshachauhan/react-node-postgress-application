import React from 'react';

import { SidebarLayout } from '@components/Layout';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <SidebarLayout>{children}</SidebarLayout>
    </>
  );
};

export default RootLayout;
