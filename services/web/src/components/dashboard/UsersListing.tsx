'use client';
import { UserType } from '@packages/entities';
import { State, useAppSelector } from '@root/store';
import React from 'react';

const UsersListing: React.FC = () => {
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
      <div className="mt-2 text-xs">
        <table className="w-full">
          <thead className="">
            <th className="">User</th>
            <th className="text-center">Day</th>
            <th className="text-center">Month</th>
          </thead>
          <tbody>
            {userData.map((user, index) => (
              <React.Fragment key={user.id}>
                <tr
                  className={`${
                    index !== userData.length - 1
                      ? 'border-b border-gray-300'
                      : ''
                  }`}
                >
                  <td className="">{user?.firstName}</td>
                  <td className="text-center">
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
                  </td>
                  <td className="text-center">
                    {user.surgeries?.filter((surgery) => {
                      const surgeryDate = new Date(surgery.date);
                      const currentDate = new Date();
                      return (
                        surgeryDate.getFullYear() ===
                          currentDate.getFullYear() &&
                        surgeryDate.getMonth() === currentDate.getMonth()
                      );
                    }).length || 0}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersListing;
