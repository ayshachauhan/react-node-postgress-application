'use client';

import Dropdown from '@root/components/Dropdown';
import { AvatarIcon } from '@root/components/Icons';
import { useAppSelector } from '@root/store';
import { logoutUser, selectRecords } from '@root/store/reducers/auth';
import { ChevronDown } from 'baseui/icon';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';

const Header: React.FC = () => {
  const userInfo = useAppSelector(selectRecords);
  const is_super_admin = userInfo ? userInfo.isSuperAdmin : false;
  const selectedUserBox = (
    <span className="inline-flex items-center gap-2">
      <AvatarIcon size={40}></AvatarIcon>
      Dr. Shawan Lin
      <ChevronDown />
    </span>
  );

  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/login');
  };
  const goToProfile = () => {
    router.push('/profile');
  };

  return (
    <nav className="fixed top-0 right-0 z-40 bg-white shadow-md w-[calc(100%-16rem)] h-[68px]">
      <div className="px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {!is_super_admin && (
              <Dropdown position="bottomLeft" trigger={selectedUserBox}>
                <Dropdown.Item id="profile" onClick={goToProfile}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item id="setting">Settings</Dropdown.Item>
                <Dropdown.Item id="logout" onClick={handleLogout}>
                  Log out
                </Dropdown.Item>
              </Dropdown>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Dropdown
              position="bottomRight"
              trigger={<AvatarIcon size={40}></AvatarIcon>}
            >
              {!is_super_admin && (
                <Dropdown.Item id="profile" onClick={goToProfile}>
                  Profile
                </Dropdown.Item>
              )}
              {!is_super_admin && (
                <Dropdown.Item id="setting">Settings</Dropdown.Item>
              )}
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
