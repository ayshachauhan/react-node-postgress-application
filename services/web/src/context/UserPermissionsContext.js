'use client';
import React, { createContext, useContext, useState } from 'react';

const UserPermissionsContext = createContext();

export const UserPermissionsProvider = ({ children }) => {
  const [userPermissions, setUserPermissions] = useState([]);

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
