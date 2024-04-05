'use client';

import Dropdown from '@root/components/Dropdown';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  logoutUser,
  selectPractice,
  selectRecords,
  userPractices,
} from '@root/store/reducers/auth';
import {
  getPracticeInfo,
  selectPracticeInfo,
} from '@root/store/reducers/practices';
import { Avatar } from 'baseui/avatar';
import { ChevronDown } from 'baseui/icon';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectRecords);
  const is_super_admin = userInfo ? userInfo.isSuperAdmin : false;
  const selectedUserBox = (
    <span className="inline-flex items-center gap-2">
      <Avatar />
      Dr. Shawan Lin
      <ChevronDown />
    </span>
  );
  const userPracticeId = useAppSelector(selectPractice); // Select success message from Redux store
  useEffect(() => {
    if (userPracticeId) {
      dispatch(getPracticeInfo({ id: userPracticeId })); // Fetch listings from PostgreSQL database
    }
  }, [userPracticeId, dispatch]);
  const userPracticesList = useAppSelector(userPractices);
  const practiceName = useAppSelector(selectPracticeInfo);
  let selectedPracticeBox = (
    <span className="inline-flex items-center gap-2">
      {practiceName}
      <ChevronDown />
    </span>
  );

  const router = useRouter();
  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/login'); // Redirect to login page after logout
  };
  const goToProfile = () => {
    router.push('/profile'); // Redirect to login page after logout
  };

  const setCurrentPracticeId = (
    practiceId: string,
    practiceName: string,
  ): void => {
    console.log(practiceId, 2);
    localStorage.setItem('practiceId', practiceId);
    selectedPracticeBox = (
      <span className="inline-flex items-center gap-2">
        {practiceName}
        <ChevronDown />
      </span>
    );
    window.location.reload();
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

          <div className="flex items-center gap-7 justify-end">
            <div className="flex items-center">
              {!is_super_admin && (
                <Dropdown position="bottomLeft" trigger={selectedPracticeBox}>
                  {userPracticesList.map((item) => (
                    <Dropdown.Item
                      key={item.practice.id}
                      id={item.practice.id}
                      onClick={() =>
                        setCurrentPracticeId(
                          item.practice.id,
                          item.practice.name,
                        )
                      }
                    >
                      {item.practice.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              )}
            </div>
            <Dropdown position="bottomRight" trigger={<Avatar />}>
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
