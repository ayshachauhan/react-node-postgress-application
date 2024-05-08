'use client';
import React from 'react';

const userData = [
  { id: 1, name: 'Marlyn', age: 10, month: 0 },
  { id: 2, name: 'Luther', age: 15, month: 0 },
  { id: 3, name: 'Kiera', age: 13, month: 0 },
  { id: 4, name: 'Edna', age: 20, month: 0 },
  { id: 5, name: 'Soraya', age: 18, month: 0 },
  { id: 6, name: 'Dorris', age: 32, month: 0 },
  { id: 7, name: 'Astrid', age: 26, month: 0 },
];

const UsersListing: React.FC = () => {
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
                  {user.name}
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4 flex-1">
                  {user.age}
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4 flex-1">
                  {user.month}
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
