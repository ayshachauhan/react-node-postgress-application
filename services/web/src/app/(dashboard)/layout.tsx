'use client';
import React, { useEffect } from 'react';

import { SidebarLayout } from '@components/Layout';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { withStyle } from 'baseui';
import { Spinner } from 'baseui/spinner';

export const ExtraLargeSpinner = withStyle(Spinner, {
  width: '96px',
  height: '96px',
  borderLeftWidth: '12px',
  borderRightWidth: '12px',
  borderTopWidth: '12px',
  borderBottomWidth: '12px',
  borderTopColor: '#299479',
  margin: 'auto',
});

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
