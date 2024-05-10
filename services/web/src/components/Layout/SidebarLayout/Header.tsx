'use client';

import { UserType } from '@packages/entities';
import Dropdown from '@root/components/Dropdown';
import { AvatarIcon } from '@root/components/Icons';
import { State, useAppDispatch, useAppSelector } from '@root/store';
import {
  logoutUser,
  selectRecords,
  selectedPracticeName,
  userPractices,
} from '@root/store/reducers/auth';
import { getPracticeInfo } from '@root/store/reducers/practices';
import { fetchListings } from '@root/store/reducers/users';
import { SanitizedUser } from '@root/store/types';
import { SELECTED_DOCTOR_KEY, getPracticeId } from '@utils/index';
import { ChevronDown } from 'baseui/icon';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const getSelectedUserId: string | null =
    localStorage.getItem(SELECTED_DOCTOR_KEY);

  const userInfo = useAppSelector(selectRecords);
  const { entities } = useAppSelector((state: State) => state.users);
  const practiceId = getPracticeId();

  const users: SanitizedUser[] = Object.values(entities).filter(
    (user) => user.type == UserType.DOCTOR,
  );

  const findSelectedUser = (userId: string): SanitizedUser | undefined =>
    Object.values(entities).find((user) => user.id === userId);

  const [selectedUser, setSelectedUser] = useState<SanitizedUser | null>(null);
  if (!localStorage.getItem(SELECTED_DOCTOR_KEY) && users.length > 0) {
    localStorage.setItem(SELECTED_DOCTOR_KEY, users[0].id);
  }

  const is_super_admin = userInfo ? userInfo.isSuperAdmin : false;
  const selectedUserBox = (
    <span className="inline-flex items-center gap-2">
      <AvatarIcon size={40}></AvatarIcon>
      {selectedUser?.fullName}
      <ChevronDown />
    </span>
  );

  const [selectedPractice, setSelectedPractice] = useState<string>('');
  const practiceName = useAppSelector(selectedPracticeName);

  useEffect(() => {
    const defaultPracticeName = practiceName;
    setSelectedPractice(defaultPracticeName!);
  }, [practiceName]);

  useEffect(() => {
    if (practiceId) {
      dispatch(getPracticeInfo({ id: practiceId })).then((action) => {
        if (action.payload && action.payload.name) {
          setSelectedPractice(action.payload.name);
        }
      });
    }
  }, [dispatch]);

  const userPracticesList = useAppSelector(userPractices);

  const router = useRouter();
  const currentPath = usePathname();
  const isDashboardPage = currentPath === '/dashboard';
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
  const goToSettings = () => {
    router.push('/settings');
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

  const handlePracticeChange = (practiceId: string, practiceName: string) => {
    setSelectedPractice(practiceName);
    localStorage.setItem('practiceId', practiceId);
    router.refresh();
  };

  return (
    <nav className="fixed top-0 right-0 z-9 bg-white shadow-md w-[calc(100%-16rem)] h-[68px]">
      <div className="px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {!is_super_admin && isDashboardPage && (
              <Dropdown
                position="bottomLeft"
                trigger={selectedUserBox}
                onSelect={handleUserSelect}
              >
                {users.map((user: SanitizedUser, index: number) => (
                  <Dropdown.Item id={user.id} key={index}>
                    {user.fullName}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            )}
          </div>

          <div className="flex items-center gap-7 justify-end">
            <div className="flex items-center">
              {!is_super_admin && (
                <>
                  <div>Practice Name:</div>
                  <Dropdown
                    position="bottomLeft"
                    trigger={
                      <span className="inline-flex items-center gap-2 font-bold">
                        &nbsp;&nbsp;&nbsp;
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
                </>
              )}
            </div>
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
                <Dropdown.Item id="setting" onClick={goToSettings}>
                  Settings
                </Dropdown.Item>
              )}
              {!is_super_admin && (
                <Dropdown.Item
                  id="reset_password"
                  onClick={() => router.push('/resetpassword')}
                >
                  Reset Password
                </Dropdown.Item>
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
