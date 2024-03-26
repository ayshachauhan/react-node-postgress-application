'use client';

import React from 'react';

import Dropdown from '@root/components/Dropdown';
import { logoutUser } from '@root/store/reducers/auth';
import { Avatar } from 'baseui/avatar';
import { ChevronDown } from 'baseui/icon';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

const Header: React.FC = () => {
  const selectedUserBox = (
    <span className="inline-flex items-center gap-2">
      <Avatar />
      Dr. Shawan Lin
      <ChevronDown />
    </span>
  );

  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/login'); // Redirect to login page after logout
  };
  const goToProfile = () => {
    router.push('/profile'); // Redirect to login page after logout
  };

  return (
    <nav className="fixed top-0 right-0 z-40 bg-white shadow-md w-[calc(100%-16rem)] h-[68px]">
      <div className="px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Dropdown position="bottomLeft" trigger={selectedUserBox}>
              <Dropdown.Item id="profile" onClick={goToProfile}>
                Profile
              </Dropdown.Item>
              <Dropdown.Item id="setting">Settings</Dropdown.Item>
              <Dropdown.Item id="logout" onClick={handleLogout}>
                Log out
              </Dropdown.Item>
            </Dropdown>
          </div>

          <div className="flex items-center justify-end">
            <Dropdown position="bottomRight" trigger={<Avatar />}>
              <Dropdown.Item id="profile" onClick={goToProfile}>
                Profile
              </Dropdown.Item>
              <Dropdown.Item id="setting">Settings</Dropdown.Item>
              <Dropdown.Item id="logout" onClick={handleLogout}>
                Log out
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
