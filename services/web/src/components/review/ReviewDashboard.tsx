'use client';
import React, { useEffect, useState } from 'react';
import { UserType } from '@packages/entities/user';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectRecords } from '@root/store/reducers/auth';
import { useRouter } from 'next/navigation';
import { getPracticeId } from '@utils/index';
import { clearErrorMessage, clearSuccessMessage, fetchListings } from '@root/store/reducers/review';
import { EditIcon } from '../Icons';

const ReviewDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const router = useRouter();
  const userInfo = useAppSelector(selectRecords);
  useEffect(() => {
    console.log(userInfo);
    if (userInfo && userInfo?.type === UserType.ADMIN) {
      // Perform the redirect inside the useEffect
      //router.push('dashboard');
    }
  }, [userInfo, router]);

  const isModalOpen = () => {
    console.log('modal');
  };

  const handleCloseModal = () => {
    console.log('handleCloseModal');
  };
  const reviews = useAppSelector((state) =>
    Object.values(state.reviews.entities),
  );

  const [showModal, setShowModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.reviews.successMessage,
    errorMessage: state.reviews.errorMessage,
  }));

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId: practiceId }));
    }
  }, [practiceId, dispatch]);
  useEffect(() => {
    let timer;
    if (successMessage) {
      setShowModal(true);
      timer = setTimeout(() => {
        setShowModal(false);
        dispatch(clearSuccessMessage());
      }, 2000);
    }
    if (errorMessage) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
        dispatch(clearErrorMessage());
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Review Management</span>        
      </div>
      {showModal && <div className="text-green-700">{successMessage}</div>}
      {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="text-gray-50 w-full  items-center  bg-gray-50 py-4 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 grid grid-cols-12 rounded-lg w-auto">
          <div className="font-bold text-white p-4 w-auto text-center">
            Practice
          </div>
          <div className="font-bold text-white p-4 w-auto  text-center">
            MRN
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Name
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Source
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Review Comment
          </div>
          <div className="font-bold text-white p-4 w-auto  text-center">
            Status
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Action
          </div>
        </div>
        <div>      
    </div>
        {reviews.map((data, index) => (
          <React.Fragment key={data.id}>
            <div
              className={`flex pb-2 ${
                index !== reviews.length - 1 ? 'border-b border-gray-300' : ''
              }`}
            >              
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                {data?.practiceId}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                {data?.practiceId}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                {data?.patientId}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                {data?.source}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                {data?.reviewComment}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                {data?.reviewDate?.toLocaleDateString()}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                {data?.reviewStatus}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1 flex gap-4">
                <div
                  // onClick={() => data.id && handleOpenEditModal(data.id)}
                  className="cursor-pointer"
                >
                  <EditIcon className="mt-2"></EditIcon>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ReviewDashboard;
