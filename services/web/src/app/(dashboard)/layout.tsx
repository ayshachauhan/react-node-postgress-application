'use client';
import React, { useEffect } from 'react';

import { SidebarLayout } from '@components/Layout';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  fetchLoggedInUser,
  selectIsAuthenticated,
} from '@root/store/reducers/auth';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) =>
    selectIsAuthenticated(state),
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchLoggedInUser());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <SidebarLayout>{children}</SidebarLayout>
    </>
  );
};

export default RootLayout;
