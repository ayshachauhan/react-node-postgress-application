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
      <div className="table-responsive overflow-x-auto rounded-lg">
        <table className="">
          <tbody>
            <tr className="">
              <th className="">Full Name</th>
              <th className="">Refer Date</th>
              <th className="">Surgery/Eval Date</th>
              <th className="">Surgery Name</th>
              {viewBillingColumn && <th className="">Billing</th>}
            </tr>

            {filteredReferredPatients && filteredReferredPatients.length > 0 ? (
              filteredReferredPatients.map((data: IPatient) => (
                <React.Fragment key={data.id}>
                  {data.surgeries?.map((surgery, surgIndex) => (
                    <tr
                      key={`${data.id}-surgery-${surgIndex}`}
                      className="border-t border-gray-200"
                    >
                      <td className="">
                        {data
                          ? generateFullName(data.firstName, data.lastName)
                          : null}
                      </td>
                      <td className="">
                        {surgery.dateCreated
                          ? formatDate(surgery.dateCreated)
                          : 'NA'}
                      </td>
                      <td className="">
                        {surgery.date ? formatDate(surgery.date) : 'NA'}
                      </td>
                      <td className="text-gray-900 w-40">
                        {surgery?.bodyPart}{' '}
                        {surgery?.surgeryConfiguration?.name || ''}
                      </td>
                      {viewBillingColumn && (
                        <td className="">
                          {surgery
                            ? +surgery.totalProfessionalPricing +
                              +surgery.totalHospitalPricing
                            : 0}
                        </td>
                      )}
                    </tr>
                  ))}
                  {data.evals?.map((evalEntity, evalIndex) => (
                    <tr
                      key={`${data.id}-eval-${evalIndex}`}
                      className="border-t border-gray-200"
                    >
                      <td className="">
                        {data
                          ? generateFullName(data.firstName, data.lastName)
                          : null}
                      </td>
                      <td className="">
                        {evalEntity.dateCreated
                          ? formatDate(evalEntity.dateCreated)
                          : 'NA'}
                      </td>
                      <td className="">
                        {evalEntity.date ? formatDate(evalEntity.date) : 'NA'}
                      </td>
                      <td className="text-gray-900 w-40">
                        {evalEntity?.surgeryConfiguration?.name}
                      </td>
                      <td className="">NA</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <tr className="">
                <td colSpan={5} className="text-gray-900">
                  No patients referred.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ReferedPatients;
