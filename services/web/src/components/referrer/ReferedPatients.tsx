'use client';
import { IPatient } from '@packages/entities';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  fetchReferrerInfo,
} from '@root/store/reducers/referrer';
import { generateFullName, getPracticeId, usDateFormatter } from '@utils/index';
import React, { useEffect, useState } from 'react';

const ReferedPatients = ({ referrerId }) => {
  const practiceId = getPracticeId();
  const [showModal, setShowModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { successMessage, errorMessage, referrerInfo } = useAppSelector(
    (state) => ({
      successMessage: state.referrers.successMessage,
      errorMessage: state.referrers.errorMessage,
      referrerInfo: state.referrers.referrerInfo,
    }),
  );
  console.log(referrerInfo);
  const referredPatients = referrerInfo?.patients;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (practiceId !== null && referrerId !== null) {
      dispatch(fetchReferrerInfo({ id: referrerId, practiceId: practiceId }));
    }
  }, [practiceId, referrerId, dispatch]);

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
        {showModal && <div className="text-green-700">{successMessage}</div>}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
      </div>
      <div className="text-gray-50 w-full items-center  bg-gray-50 py-4">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex rounded-t-md">
          <div className="font-bold text-white px-2 py-4 flex-1">Full Name</div>
          <div className="font-bold text-white px-2 py-4 flex-1">
            Refer Date
          </div>
          <div className="font-bold text-white px-2 py-4 flex-1">
            Surgery Date
          </div>
          <div className="font-bold text-white px-2 py-4 flex-1">Lens</div>
          <div className="font-bold text-white px-2 py-4 flex-1">Billing</div>
          <div className="font-bold text-white px-2 py-4 flex-1">Surgery#</div>
        </div>
        <div className="border border-gray-300 rounded-b-md">
          {referredPatients && referredPatients.length > 0 ? (
            referredPatients.map((data: IPatient, index: number) => (
              <React.Fragment key={data.id}>
                <div
                  className={`flex pt-1 pb-2 items-center justify-center ${
                    index !== referredPatients.length - 1
                      ? 'border-b border-gray-300'
                      : ''
                  }`}
                >
                  <div className="text-gray-900 bg-gray-50 pt-2 px-2 flex-1">
                    {data
                      ? generateFullName(data.firstName, data.lastName)
                      : null}
                  </div>
                  <div className="text-gray-900 bg-gray-50 pt-2 px-2 flex-1">
                    {data.dateCreated
                      ? usDateFormatter(data.dateCreated)
                      : 'Date is undefined'}
                  </div>
                  <div className="text-gray-900 bg-gray-50 pt-2 px-2 flex-1">
                    03/11/2024
                  </div>
                  <div className="text-gray-900 bg-gray-50 pt-2 px-2 flex-1">
                    Standard
                  </div>
                  <div className="text-gray-900 bg-gray-50 pt-2 px-2 flex-1">
                    Billing
                  </div>
                  <div className="text-gray-900 bg-gray-50 pt-2 px-2 flex-1">
                    {referredPatients.length}
                  </div>
                </div>
              </React.Fragment>
            ))
          ) : (
            <span>No patients referred.</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default ReferedPatients;
