'use client';

import Dropdown from '@root/components/Dropdown';
import { AvatarIcon } from '@root/components/Icons';
import { State, useAppDispatch, useAppSelector } from '@root/store';
import {
  logoutUser,
  selectPractice,
  selectRecords,
} from '@root/store/reducers/auth';
import { fetchListings } from '@root/store/reducers/users';
import { User } from '@root/store/requests/users';
import { ChevronDown } from 'baseui/icon';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SELECTED_DOCTOR_KEY: string = 'SELECTED_DOCTOR';

const Header: React.FC = () => {
  const getSelectedUserId: string | null =
    localStorage.getItem(SELECTED_DOCTOR_KEY);

  const userInfo = useAppSelector(selectRecords);
  const { users } = useAppSelector((state: State) => state.users);
  const practiceId = useAppSelector(selectPractice);

  const findSelectedUser = (userId: string): User | undefined =>
    users.find((user) => user.id === userId);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const is_super_admin = userInfo ? userInfo.isSuperAdmin : false;
  const selectedUserBox = (
    <span className="inline-flex items-center gap-2">
      <AvatarIcon size={40}></AvatarIcon>
      {selectedUser?.fullName ?? userInfo?.fullName}
      <ChevronDown />
    </span>
  );

  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/login');
  };

  /**
   * @summary Handle Selection of user in dropdown
   * @param userId
   */
  const handleUserSelect = (userId: string): void => {
    const user = findSelectedUser(userId);

    if (user) {
      setSelectedUser(user);
      localStorage.setItem(SELECTED_DOCTOR_KEY, user.id);
    }
  };

  const goToProfile = () => {
    router.push('/profile');
  };

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId: practiceId }));
    }
  }, [dispatch, practiceId]);

  useEffect(() => {
    if (getSelectedUserId) {
      setSelectedUser(findSelectedUser(getSelectedUserId) ?? null);
    }
  }, [users]);

  return (
    <nav className="fixed top-0 right-0 z-40 bg-white shadow-md w-[calc(100%-16rem)] h-[68px]">
      <div className="px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {!is_super_admin && (
              <Dropdown
                position="bottomLeft"
                trigger={selectedUserBox}
                onSelect={handleUserSelect}
              >
                {users.map((user: User, index: number) => (
                  <Dropdown.Item id={user.id} key={index}>
                    {user.fullName}
                  </Dropdown.Item>
                ))}
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
