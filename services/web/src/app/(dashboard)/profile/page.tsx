'use client';
import Button from '@root/components/Button';
import { AvatarIcon } from '@root/components/Icons';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { getPracticeInfo } from '@root/store/reducers/practices';
import { fetchListings as fetchPermissions } from '@root/store/reducers/userPermissions';
import { getPracticeId } from '@utils/index';
import { Checkbox } from 'baseui/checkbox';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import UploadImageModal from './UploadImageModal';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const permissions = useAppSelector((state) =>
    Object.values(state.permissions.entities),
  );
  const userInfo = useAppSelector((state) => state.auth.user);
  const userPracticeId = getPracticeId();
  const [isModalOpen, setIsModalOpen] = useState(false);

  interface Permission {
    id: string;
  }

  const isChecked = (permissionsArray: Permission[], id: string): boolean => {
    return permissionsArray.some((permission) => permission.id === id);
  };
  useEffect(() => {
    if (userPracticeId) {
      dispatch(getPracticeInfo({ id: userPracticeId }));
    }
  }, [userPracticeId, dispatch]);

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPermissions(undefined));
  }, []);

  const practiceName = useAppSelector(
    (state) => state.practices.practiceInfo?.name,
  );
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  return (
    <div className="mt-4">
      <div className="flex justify-between border-gray-400 items-center">
        <span className="text-xl font-bold">Profile</span>
        <Button kind="primary" title="Go Back" onClick={handleGoBack}></Button>
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="flex mt-10 items-center">
        <div
          className="flex items-center justify-center shadow-lg w-44 h-44 bg-black-200 rounded-full flex-shrink-0"
          onClick={() => setIsModalOpen(true)}
        >
          {' '}
          {userInfo?.imgUrl ? (
            <Image
              src={userInfo.imgUrl}
              alt={userInfo.id!}
              width={50}
              height={50}
              className="inline-block rounded-full w-36 h-36"
              style={{
                objectFit: 'cover',
              }}
            />
          ) : (
            <AvatarIcon size={40}></AvatarIcon>
          )}
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
            <span className="font-bold">Display Name</span>{' '}
            <span>: {userInfo?.userName}</span>
          </p>
        </div>
        <div>
          <p>
            <span className="font-bold">Last Name</span>
            <span> :{userInfo?.lastName} </span>
          </p>
          <p className="mt-2">
            <span className="font-bold">Type</span>
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
          <p className="mt-2">
            <span className="font-bold">Designation</span>{' '}
            <span>: {userInfo?.designation}</span>
          </p>
        </div>
        <div>
          <p>
            <span className="font-bold">Practice Name</span>{' '}
            <span>: {practiceName}</span>
          </p>
        </div>
      </div>
      <div className="ml-64 mt-8 w-1/3">
        <span className="font-bold">Permissions </span>
        <div className="grid grid-cols-2 gap-1 mt-4 w-30">
          {permissions.map((label, index) => (
            <Checkbox
              key={index}
              checked={
                userInfo?.permissions
                  ? isChecked(userInfo.permissions, label.id)
                  : false
              }
              overrides={{
                Checkmark: {
                  style: ({ $checked }) => ({
                    backgroundColor: $checked
                      ? 'rgba(34, 197, 94, 1)'
                      : 'white',
                    borderColor: $checked
                      ? 'rgba(34, 197, 94, 1)'
                      : 'rgba(113, 113, 122, 1)',
                    width: '15px',
                    height: '15px',
                    marginTop: '7px',
                    marginRight: '0px',
                    borderRadius: '2px',
                    borderWidth: '2px',
                  }),
                },
              }}
            >
              <label
                htmlFor={`checkbox-${index}`}
                className="text-black text-sm font-normal"
              >
                <span className="truncate">{label.name}</span>
              </label>
            </Checkbox>
          ))}
        </div>
      </div>
      <UploadImageModal
        isModalOpen={isModalOpen}
        handleCloseModal={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
