'use client';

import Dropdown from '@root/components/Dropdown';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  logoutUser,
  selectRecords,
  selectedPracticeName,
  userPractices,
} from '@root/store/reducers/auth';
import { getPracticeInfo } from '@root/store/reducers/practices';
import { getPracticeId } from '@utils/methods';
import { Avatar } from 'baseui/avatar';
import { ChevronDown } from 'baseui/icon';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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

  const [selectedPractice, setSelectedPractice] = useState<string>('');
  const practiceName = useAppSelector(selectedPracticeName);

  useEffect(() => {
    const defaultPracticeName = practiceName;
    setSelectedPractice(defaultPracticeName);
  }, [practiceName]);

  useEffect(() => {
    const userPracticeId = getPracticeId();
    if (userPracticeId) {
      dispatch(getPracticeInfo({ id: userPracticeId })).then((action) => {
        if (action.payload && action.payload.name) {
          setSelectedPractice(action.payload.name);
        }
      });
    }
  }, [dispatch]);

  const userPracticesList = useAppSelector(userPractices);

  const router = useRouter();
  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/login'); // Redirect to login page after logout
  };
  const goToProfile = () => {
    router.push('/profile');
  };

  const handlePracticeChange = (practiceId: string, practiceName: string) => {
    setSelectedPractice(practiceName);
    localStorage.setItem('practiceId', practiceId);
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
                <Dropdown
                  position="bottomLeft"
                  trigger={
                    <span className="inline-flex items-center gap-2">
                      {selectedPractice}
                      <ChevronDown />
                    </span>
                  }
                >
                  {userPracticesList.map((item) => (
                    <Dropdown.Item
                      key={item.practice.id}
                      id={item.practice.id}
                      onClick={() =>
                        handlePracticeChange(
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
