'use client';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

const UserPermissionsContext = createContext();

export const UserPermissionsProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.auth);
  const [userPermissions, setUserPermissions] = useState(
    userInfo?.permissions || [],
  );

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      setUserPermissions(userInfo.permissions || []);
    } else {
      setUserPermissions([]);
    }
  }, [userInfo]);

  const updateUserPermissions = (newPermissions) => {
    setUserPermissions(newPermissions);
  };

  return (
    <UserPermissionsContext.Provider
      value={{ userPermissions, updateUserPermissions }}
    >
      {children}
    </UserPermissionsContext.Provider>
  );
};

export const useUserPermissions = () => useContext(UserPermissionsContext);
