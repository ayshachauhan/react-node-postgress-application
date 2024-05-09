'use client';
import { AvatarIcon } from '@root/components/Icons';
import { useAppDispatch, useAppSelector } from '@root/store';
import { getPracticeInfo } from '@root/store/reducers/practices';
import { fetchListings } from '@root/store/reducers/users';
import { SanitizedUser } from '@root/store/types';
import { getPracticeId } from '@utils/index';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const UserViewPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const userPracticeId = getPracticeId();

  useEffect(() => {
    if (userPracticeId) {
      dispatch(getPracticeInfo({ id: userPracticeId }));
    }
  }, [userPracticeId, dispatch]);

  useEffect(() => {
    if (userPracticeId) {
      dispatch(fetchListings({ practiceId: userPracticeId }));
    }
  }, [userPracticeId, dispatch]);

  const userInfo: SanitizedUser | undefined = useAppSelector((state) =>
    Object.values(state.users.entities).find(
      (user: SanitizedUser) => user.id === id,
    ),
  );

  const practiceName = useAppSelector(
    (state) => state.practices.practiceInfo?.name,
  );
  return (
    <div className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">User Information</span>
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      <div>
        {userInfo && (
          <div>
            <div className="flex mt-10 items-center">
              <div className="flex items-center justify-center shadow-lg w-44 h-44 bg-black-200 rounded-full  flex-shrink-0">
                {' '}
                <AvatarIcon size={40}></AvatarIcon>
              </div>
              <div className="w-full flex-grow">
                <p className="ml-4">
                  <span className="font-bold">{userInfo?.fullName}</span> (
                  {userInfo?.type})
                </p>
                <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
              </div>
            </div>
            <div className="flex flex-wrap gap-20 ml-64 mt-4">
              <div>
                <p>
                  <span className="font-bold">First Name</span>
                  <span> : {userInfo?.firstName}</span>
                </p>
                <p className="mt-2">
                  <span className="font-bold">Username</span>{' '}
                  <span>: {userInfo?.userName}</span>
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Last Name</span>
                  <span> : Kumar</span>
                </p>
                <p className="mt-2">
                  <span className="font-bold">Designation</span>
                  <span> : {userInfo?.type}</span>
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Contact No.</span>{' '}
                  <span>: {userInfo?.contactNumber}</span>
                </p>
                <p className="mt-2">
                  <span className="font-bold">User URL </span>
                  <span>: {userInfo?.url}</span>
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Email</span>{' '}
                  <span>: {userInfo?.email}</span>
                </p>
                <p>
                  <span className="font-bold">Status</span>{' '}
                  <span>: {userInfo?.status}</span>
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Practice Name</span>{' '}
                  <span>: {practiceName}</span>
                </p>
              </div>
            </div>
          </div>
        )}
        {!userInfo && <div>User not found</div>}
      </div>
    </div>
  );
};

export default UserViewPage;
