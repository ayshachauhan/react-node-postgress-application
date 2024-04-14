'use client';
import Button from '@root/components/Button';
import { AvatarIcon } from '@root/components/Icons';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectRecords } from '@root/store/reducers/auth';
import {
  getPracticeInfo,
  selectPracticeInfo,
} from '@root/store/reducers/practices';
import { getPracticeId } from '@utils/index';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectRecords);
  const userPracticeId = getPracticeId();
  useEffect(() => {
    if (userPracticeId) {
      dispatch(getPracticeInfo({ id: userPracticeId }));
    }
  }, [userPracticeId, dispatch]);
  const practiceName = useAppSelector(selectPracticeInfo);
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  return (
    <div id="__next" className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Profile</span>
        <Button kind="primary" title="Go Back" onClick={handleGoBack}></Button>
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
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
          <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
        </div>
      </div>
      <div className="flex flex-wrap gap-20 ml-64 mt-4">
        <div>
          <p>
            <span className="font-bold">First Name</span>
            <span> : {userInfo?.firstName}</span>
          </p>
          <p className="mt-2">
            <span className="font-bold">Display Name</span>{' '}
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
        </div>
        <div>
          <p>
            <span className="font-bold">Practice Name</span>{' '}
            <span>: {practiceName}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
