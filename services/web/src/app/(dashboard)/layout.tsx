'use client';
import React, { useEffect } from 'react';

import { SidebarLayout } from '@components/Layout';
import { ExtraLargeSpinner } from '@root/components/Spinner';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  return (
    <>
      {userInfo.isAuthenticated ? (
        <SidebarLayout>{children}</SidebarLayout>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <ExtraLargeSpinner />
        </div>
      )}
    </>
  );
};

export default RootLayout;
