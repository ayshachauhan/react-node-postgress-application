'use client';

import { UserType } from '@packages/entities/index.browser';
import Dropdown from '@root/components/Dropdown';
import { AvatarIcon } from '@root/components/Icons';
import { useUserPermissions } from '@root/context/UserPermissionsContext';
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
import React, { useEffect, useMemo, useState } from 'react';

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

  const users: SanitizedUser[] = useMemo(() => {
    if (userInfo?.type === UserType.DOCTOR) {
      return Object.values(entities).filter(
        (user) => user.type == UserType.DOCTOR && user.id === loggedInUserId,
      );
    }
    return Object.values(entities).filter(
      (user) => user.type == UserType.DOCTOR,
    );
  }, [entities]);
  const { updateUserPermissions } = useUserPermissions();

  const findSelectedUser = (userId: string): SanitizedUser | undefined =>
    Object.values(entities).find((user) => user.id === userId);

  const [selectedUser, setSelectedUser] = useState<SanitizedUser | null>(null);

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
  const [isDoctorChange, setIsDoctorChange] = useState(false);

  const router = useRouter();
  const currentPath = usePathname();
  const isDashboardPage =
    currentPath === '/dashboard' || currentPath === '/eval';
  const handleLogout = () => {
    dispatch(logoutUser());
    updateUserPermissions([]);
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
      setIsDoctorChange(true);
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
    setIsDoctorChange(false);
    router.refresh();
  };

  useEffect(() => {
    if (practiceId && users?.length && !isDoctorChange) {
      const selectedDoctor = localStorage.getItem('SELECTED_DOCTOR');
      const userIds = users?.map((user) => user?.id);
      if (!selectedDoctor || !userIds.includes(selectedDoctor)) {
        setSelectedUser(users[0]);
        localStorage.setItem('SELECTED_DOCTOR', users[0]?.id);
      }
    }
    if (!users?.length) {
      localStorage.removeItem('SELECTED_DOCTOR');
    }
  }, [practiceId, users]);

  const selectedDoctorName = useMemo(
    () =>
      users?.find(
        (user) => user?.id === localStorage.getItem('SELECTED_DOCTOR'),
      )?.fullName,
    [users],
  );

  return (
    <nav
      className={`fixed top-0 z-9 bg-white shadow-md h-[60px] ${
        data.collapsed ? 'w-[calc(100%-4rem)] ' : 'left-40 w-[calc(100%-10rem)]'
      }`}
    >
      <div className="px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {!is_super_admin && (
              <>
                <div className="flex items-center border-r-2 pr-4 mr-4">
                  {!is_super_admin && (
                    <>
                      <div>Practice:</div>
                      <Dropdown
                        position="bottomLeft"
                        width={220}
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
                            onClick={() =>
                              handlePracticeChange(item.id, item.name)
                            }
                          >
                            {item?.imgUrl ? (
                              <Image
                                src={item.imgUrl}
                                alt={item.id!}
                                className="inline-block rounded-full mr-2 h-10 w-10"
                                width={40}
                                height={40}
                              />
                            ) : (
                              <AvatarIcon className="mr-2" size={40} />
                            )}
                            {item.name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown>
                    </>
                  )}
                </div>
                {isDashboardPage && <div>Doctor:</div>}
                {isDashboardPage && users && users.length > 1 ? (
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
                  isDashboardPage && (
                    <div>&nbsp;&nbsp;&nbsp;{users && selectedDoctorName}</div>
                  )
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-end">
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
