'use client';
import { IPatient } from '@packages/entities';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import { useUserPermission } from '@root/hooks/userHasPermission';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  fetchReferrerInfo,
} from '@root/store/reducers/referrer';
import { formatDate, generateFullName, getPracticeId } from '@utils/index';
import React, { useEffect, useState } from 'react';

const ReferedPatients = ({ referrerId, withLoader }) => {
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
  const referredPatients = referrerInfo?.patients ?? [];
  const filteredReferredPatients = referredPatients.filter(
    (patient: IPatient) =>
      (patient.surgeries && patient.surgeries.length > 0) ||
      (patient.evals && patient.evals.length > 0),
  );

  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.auth.user);
  const userPermissions = userInfo?.permissions;
  const viewBillingColumn = useUserPermission(userPermissions, [
    USER_PERMISSIONS.VIEW_BILLING,
  ]);

  useEffect(() => {
    if (practiceId !== null && referrerId !== null) {
      const loadData = async () => {
        await withLoader(async () => {
          await dispatch(
            fetchReferrerInfo({ id: referrerId, practiceId: practiceId }),
          );
        });
      };
      loadData();
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
            Surgery/Eval Date
          </div>
          <div className="font-bold text-white py-4 w-40">Surgery Name</div>
          {viewBillingColumn && (
            <div className="font-bold text-white px-2 py-4 flex-1">Billing</div>
          )}
        </div>
        <div className="border border-gray-300 rounded-b-md">
          {filteredReferredPatients && filteredReferredPatients.length > 0 ? (
            filteredReferredPatients.map((data: IPatient) => (
              <React.Fragment key={data.id}>
                {data.surgeries?.map((surgery, surgIndex) => (
                  <div
                    key={`${data.id}-surgery-${surgIndex}`}
                    className="flex pt-1 pb-2 border-b border-gray-300"
                  >
                    <div className="text-gray-900 px-2 flex-1">
                      {data
                        ? generateFullName(data.firstName, data.lastName)
                        : null}
                    </div>
                    <div className="text-gray-900 px-2 flex-1">
                      {surgery.dateCreated
                        ? formatDate(surgery.dateCreated)
                        : 'NA'}
                    </div>
                    <div className="text-gray-900 px-2 flex-1">
                      {surgery.date ? formatDate(surgery.date) : 'NA'}
                    </div>
                    <div className="text-gray-900 w-40">
                      {surgery?.bodyPart}{' '}
                      {surgery?.surgeryConfiguration?.name || ''}
                    </div>
                    {viewBillingColumn && (
                      <div className="text-gray-900 px-2 flex-1">
                        {surgery
                          ? +surgery.totalProfessionalPricing +
                            +surgery.totalHospitalPricing
                          : 0}
                      </div>
                    )}
                  </div>
                ))}
                {data.evals?.map((evalEntity, evalIndex) => (
                  <div
                    key={`${data.id}-eval-${evalIndex}`}
                    className="flex pt-1 pb-2 border-b border-gray-300"
                  >
                    <div className="text-gray-900 px-2 flex-1">
                      {data
                        ? generateFullName(data.firstName, data.lastName)
                        : null}
                    </div>
                    <div className="text-gray-900 px-2 flex-1">
                      {evalEntity.dateCreated
                        ? formatDate(evalEntity.dateCreated)
                        : 'NA'}
                    </div>
                    <div className="text-gray-900 px-2 flex-1">
                      {evalEntity.date ? formatDate(evalEntity.date) : 'NA'}
                    </div>
                    <div className="text-gray-900 w-40">
                      {evalEntity?.surgeryConfiguration?.name}
                    </div>
                    <div className="text-gray-900 px-2 flex-1">NA</div>
                  </div>
                ))}
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
