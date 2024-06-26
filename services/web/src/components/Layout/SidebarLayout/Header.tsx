'use client';

import { UserType } from '@packages/entities/index.browser';
import Dropdown from '@root/components/Dropdown';
import { AvatarIcon } from '@root/components/Icons';
import { State, useAppDispatch, useAppSelector } from '@root/store';
import {
  fetchLoggedInUser,
  logoutUser,
  selectedPracticeName,
  userPractices,
} from '@root/store/reducers/auth';
import { fetchFilteredCalendars } from '@root/store/reducers/calendar';
import { getPracticeInfo } from '@root/store/reducers/practices';
import { fetchListings } from '@root/store/reducers/users';
import { SanitizedUser } from '@root/store/types';
import {
  SELECTED_DOCTOR_KEY,
  getPracticeId,
  getSelectedMonths,
} from '@utils/index';
import { ChevronDown } from 'baseui/icon';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Data {
  collapsed: boolean;
}

interface ChildProps {
  data: Data;
}

const Header: React.FC<ChildProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const getSelectedUserId: string | null =
    localStorage.getItem(SELECTED_DOCTOR_KEY);

  const userInfo = useAppSelector((state) => state.auth.user);
  const loggedInUserId = userInfo?.id;
  const { selectedMonth, selectedValue } = useAppSelector(
    (state) => state.surgeries.surgeryFilters,
  );
  const selectedValueStr = selectedValue || '';

  const month = getSelectedMonths(selectedMonth);
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
      &nbsp;&nbsp;&nbsp;
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
      dispatch(fetchLoggedInUser());
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
      const userId = user.id;
      setSelectedUser(user);
      localStorage.setItem(SELECTED_DOCTOR_KEY, user.id);
      if (practiceId !== null && userId !== null && loggedInUserId !== null) {
        dispatch(
          fetchFilteredCalendars({
            practiceId,
            userId,
            month,
            option: selectedValueStr,
            loggedInUserId,
          }),
        );
      }
    }
  };

  const goToProfile = () => {
    router.push('/profile');
  };

  useEffect(() => {
    if (practiceId !== null && practiceId) {
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
    <nav
      className={`fixed top-0 z-9 bg-white shadow-md h-[60px] ${
        data.collapsed ? 'w-[calc(100%-4rem)] ' : 'left-40 w-[calc(100%-10rem)]'
      }`}
    >
      <div className="px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {!is_super_admin && isDashboardPage && (
              <>
                <div>Doctor:</div>
                {users && users.length > 1 ? (
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
                ) : (
                  <div>&nbsp;&nbsp;&nbsp;{users && users[0]?.fullName}</div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-7 justify-end">
            <div className="flex items-center">
              {!is_super_admin && (
                <>
                  <div>Practice:</div>
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
                        key={item.id}
                        id={item.id}
                        onClick={() => handlePracticeChange(item.id, item.name)}
                      >
                        {item.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                </>
              )}
            </div>
            <Dropdown
              position="bottomRight"
              trigger={
                userInfo?.imgUrl ? (
                  <Image
                    src={userInfo.imgUrl}
                    alt={userInfo.id!}
                    width={50}
                    height={50}
                    className="inline-block rounded-full"
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <AvatarIcon size={40}></AvatarIcon>
                )
              }
            >
              {!is_super_admin && (
                <Dropdown.Item id="profile" onClick={goToProfile}>
                  Profile
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
