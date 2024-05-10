'use client';
import { DeleteIcon } from '@root/components/Icons';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  deleteRecordAsync,
} from '@root/store/reducers/referrer';
import { getPracticeId } from '@utils/index';
import React, { useEffect, useState } from 'react';
import DeleteReferredPatientModal from './DeleteReferredPatientModal';

const ReferedPatients: React.FC = () => {
  const practiceId = getPracticeId();
  const [showModal, setShowModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.referrers.successMessage,
    errorMessage: state.referrers.errorMessage,
  }));
  const [referrerId, setReferrerId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = (): void => {
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
  };
  const onConfirmDelete = (): void => {
    const id = referrerId;
    if (practiceId && id) {
      try {
        const id = referrerId;
        dispatch(deleteRecordAsync({ practiceId, id }));
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.log(error);
      }
    }
    setReferrerId(null);
  };
  const dispatch = useAppDispatch();
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
      <div className="text-gray-50 w-full items-center  bg-gray-50 py-4 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex rounded-lg">
          <div className="font-bold text-white px-2 py-4 flex-1">Full Name</div>
          <div className="font-bold text-white px-2 py-4 flex-1">
            Refer Date
          </div>
          <div className="font-bold text-white px-2 py-4 flex-1">
            Surgery Date
          </div>
          <div className="font-bold text-white px-2 py-4 flex-1">Lens</div>
          <div className="font-bold text-white px-2 py-4 flex-1">Billing</div>
          <div className="font-bold text-white px-2 py-4 flex-1">Action</div>
        </div>
        <div className="flex">
          <div className="text-gray-900 bg-gray-50 pt-2 px-2 flex-1">
            Harris Benjamin
          </div>
          <div className="text-gray-900 bg-gray-50 pt-2 px-2 flex-1">
            03/11/2024
          </div>
          <div className="text-gray-900 bg-gray-50 pt-2 px-2 flex-1">
            04/17/2024
          </div>
          <div className="text-gray-900 bg-gray-50 pt-2 px-2 flex-1">
            Standard
          </div>
          <div className="text-gray-900 bg-gray-50 pt-2 px-2 flex-1">
            Billing
          </div>
          <div className="text-gray-900 bg-gray-50 pt-2 px-2 flex-1">
            <div
              onClick={() => handleOpenDeleteModal()}
              className="cursor-pointer"
            >
              <DeleteIcon className="mt-2"></DeleteIcon>
            </div>
          </div>
        </div>
      </div>
      <DeleteReferredPatientModal
        onConfirmDelete={onConfirmDelete}
        isDeleteModalOpen={isDeleteModalOpen}
        handleCloseDeleteModal={handleCloseDeleteModal}
      />
    </div>
  );
};
export default ReferedPatients;
