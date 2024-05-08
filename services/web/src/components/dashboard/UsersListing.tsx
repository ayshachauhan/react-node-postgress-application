'use client';
import { useAppSelector } from '@root/store';
import React from 'react';

const UsersListing: React.FC = () => {
  const userInfo = useAppSelector((state) => state.auth.user);
  const userData = useAppSelector((state) =>
    Object.values(state.users.entities),
  ).filter((user) => user.id !== userInfo?.id);

  return (
    <div>
      <div className="text-lg font-normal">
        Users
        <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      </div>
      <div className="mt-2 text-xs">
        <div className="text-gray-50 w-full items-center bg-gray-50 rounded-lg">
          <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
            <div className="font-bold text-white p-4 flex-1">User</div>
            <div className="font-bold text-white p-4 flex-1">Day</div>
            <div className="font-bold text-white p-4 flex-1">Month</div>
          </div>
          {userData.map((user, index) => (
            <React.Fragment key={user.id}>
              <div
                className={`flex ${
                  index !== userData.length - 1
                    ? 'border-b border-gray-300'
                    : ''
                }`}
              >
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4 flex-1">
                  {user?.firstName}
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4 flex-1">
                  0
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4 flex-1">
                  0
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersListing;
