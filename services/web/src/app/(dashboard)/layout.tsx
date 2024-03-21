'use client';
import React, { useEffect } from 'react';

import { SidebarLayout } from '@components/Layout';
import { useAppDispatch } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  return (
    <>
      <SidebarLayout>{children}</SidebarLayout>
    </>
  );
};

export default RootLayout;
