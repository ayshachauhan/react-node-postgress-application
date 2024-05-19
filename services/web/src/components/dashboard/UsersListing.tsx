'use client';
import { UserType } from '@packages/entities';
import { State, useAppSelector } from '@root/store';
import { SanitizedUser } from '@root/store/types';
import { hasPermission } from '@root/utils';
import React from 'react';

const UsersListing: React.FC = () => {
  const userInfo = useAppSelector((state) => state.auth.user);
  const loggedInUserId = userInfo?.id;
  const detailedInfoUser = useAppSelector((state) =>
    loggedInUserId
      ? Object.values(state.users.entities).find(
          ({ id }: SanitizedUser) => id === loggedInUserId,
        )
      : undefined,
  );
  const userPermissions = detailedInfoUser?.permissions;

  const viewUserMetrics =
    userPermissions !== undefined
      ? hasPermission(userPermissions, ['leaderboard_display'])
      : false;

  const { entities } = useAppSelector((state: State) => state.users);
  const userData = Object.values(entities).filter(
    (user) => user.type == UserType.DOCTOR,
  );

  return (
    <div>
      <div className="text-lg font-normal">
        Users
        <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      </div>
      {viewUserMetrics && (
        <div className="mt-2 text-xs">
          <div className="text-gray-50 w-full items-center rounded-lg">
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
                    {user.surgeries?.filter((surgery) => {
                      const surgeryDate = new Date(surgery.date);
                      const currentDate = new Date();
                      return (
                        surgeryDate.getFullYear() ===
                          currentDate.getFullYear() &&
                        surgeryDate.getMonth() === currentDate.getMonth() &&
                        surgeryDate.getDate() === currentDate.getDate()
                      );
                    }).length || 0}
                  </div>
                  <div className="text-black bg-gray-50 pt-2 pb-2 px-4 flex-1">
                    {user.surgeries?.filter((surgery) => {
                      const surgeryDate = new Date(surgery.date);
                      const currentDate = new Date();
                      return (
                        surgeryDate.getFullYear() ===
                          currentDate.getFullYear() &&
                        surgeryDate.getMonth() === currentDate.getMonth()
                      );
                    }).length || 0}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersListing;
