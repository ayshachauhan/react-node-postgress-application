'use client';
import { IPatient } from '@packages/entities';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  fetchReferrerInfo,
} from '@root/store/reducers/referrer';
import { SanitizedUser } from '@root/store/types';
import {
  formatDate,
  generateFullName,
  getPracticeId,
  hasPermission,
} from '@utils/index';
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
  const referredPatients = referrerInfo?.patients;
  const dispatch = useAppDispatch();
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

  const viewBillingColumn =
    userPermissions !== undefined
      ? hasPermission(userPermissions, ['view_billing'])
      : false;

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
      <div className="text-gray-50 w-full items-center  py-4">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex rounded-t-md">
          <div className="font-bold text-white px-2 py-4 flex-1">Full Name</div>
          <div className="font-bold text-white px-2 py-4 flex-1">
            Refer Date
          </div>
          <div className="font-bold text-white px-2 py-4 flex-1">
            Surgery Date
          </div>
          <div className="font-bold text-white py-4 w-40">Options</div>
          {viewBillingColumn && (
            <div className="font-bold text-white px-2 py-4 flex-1">Billing</div>
          )}
        </div>
        <div className="border border-gray-300 rounded-b-md">
          {referredPatients && referredPatients.length > 0 ? (
            referredPatients.map((data: IPatient, index: number) => (
              <React.Fragment key={data.id}>
                <div
                  className={`flex pt-1 pb-2 ${
                    index !== referredPatients.length - 1
                      ? 'border-b border-gray-300'
                      : ''
                  }`}
                >
                  <div className="text-gray-900 px-2 flex-1">
                    {data
                      ? generateFullName(data.firstName, data.lastName)
                      : null}
                  </div>
                  <div className="text-gray-900 px-2 flex-1">
                    {data.dateCreated ? formatDate(data.dateCreated) : 'NA'}
                  </div>
                  <div className="text-gray-900 px-2 flex-1">
                    {data?.surgeries &&
                    data.surgeries.length > 0 &&
                    data.surgeries[0].dateCreated
                      ? formatDate(data.surgeries[0].date)
                      : 'NA'}
                  </div>
                  <div className="text-gray-900 w-40">
                    {data?.surgeries &&
                    data.surgeries.length > 0 &&
                    data.surgeries[0].selectedSurgeryOptions
                      ? Object.values(data.surgeries[0].selectedSurgeryOptions)
                          .map((option) => option.value)
                          .join(', ')
                      : 'NA'}
                  </div>
                  {viewBillingColumn && (
                    <div className="text-gray-900 px-2 flex-1">Billing</div>
                  )}
                </div>
              </React.Fragment>
            ))
          ) : (
            <div className="text-center p-2 flex-1">
              <span className="text-gray-900">No patients referred.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ReferedPatients;
