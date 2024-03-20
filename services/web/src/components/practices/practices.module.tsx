'use client';
import { useAppSelector } from '@root/store';
import { fetchListings } from '@root/store/reducers/practices';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function PracticePage() {
  const dispatch = useDispatch();
  const practices = useAppSelector((state) => state.practices.practices);

  useEffect(() => {
    dispatch(fetchListings()); // Fetch listings from PostgreSQL database
  }, [dispatch]);

  useEffect(() => {
    console.log(practices);
  }, [practices]);

  return (
    <>
      <div className="msm:px-6 lg:px-8  text-3xl pt-8">
        <h1 className="" style={{ fontWeight: 100 }}>
          All Practices
        </h1>
      </div>
      <div className="text-gray-50 w-full  items-center  bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 grid grid-cols-4 rounded-lg">
          <div className="font-bold text-white p-4">S. No.</div>
          <div className="font-bold text-white p-4">Practice</div>
          <div className="font-bold text-white p-4">Create Date</div>
          <div className="font-bold text-white p-4">Update Date</div>
          {practices.map((data, index) => (
            <React.Fragment key={data.id}>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {index + 1}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.name}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.dateCreated.toString()}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.dateUpdated.toString()}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

// interface Practice {
//   id: string;
//   name: string;
//   dateCreated: Date;
//   dateUpdated: Date;
// }
