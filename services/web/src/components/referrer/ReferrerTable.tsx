'use client';
import Button from '@root/components/Button';
import { AddIcon, DeleteIcon, EditIcon } from '@root/components/Icons';
import AddReferrerModal from '@root/components/referrer/AddReferrerModal';
import EditReferrerModal from '@root/components/referrer/EditReferrerModal';
import ReferredListModal from '@root/components/referrer/ReferredListModal';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  deleteRecordAsync,
  fetchListings,
} from '@root/store/reducers/referrer';
import { generateFullName, getPracticeId } from '@utils/index';
import React, { useEffect, useState } from 'react';
import DeleteReferrerModal from './DeleteReferrerModal';

export default function ReferrerTable() {
  const practiceId = getPracticeId();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };
  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };
  const referrers = useAppSelector((state) =>
    Object.values(state.referrers.entities),
  );
  const [showModal, setShowModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.referrers.successMessage,
    errorMessage: state.referrers.errorMessage,
  }));
  const [referrerId, setReferrerId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleOpenDeleteModal = (Id: string): void => {
    setIsDeleteModalOpen(true);
    setReferrerId(Id);
  };
  const handleOpenListModal = (Id: string): void => {
    setIsListModalOpen(true);
    setReferrerId(Id);
  };
  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setReferrerId(null);
  };
  const handleCloseListModal = (): void => {
    setIsListModalOpen(false);
    setReferrerId(null);
  };
  const handleOpenEditModal = (Id: string): void => {
    setIsModalOpen(false);
    setIsEditModalOpen(true);
    setIsDeleteModalOpen(false);
    setReferrerId(Id);
  };
  const handleCloseEditModal = (): void => {
    setIsEditModalOpen(false);
    setReferrerId(null);
  };
  const onConfirmDelete = (): void => {
    const id = referrerId;
    if (practiceId && id) {
      try {
        const id = referrerId;
        dispatch(deleteRecordAsync({ practiceId, id }));
        setIsDeleteModalOpen(false);
        setReferrerId(null);
      } catch (error) {
        console.log(error);
      }
    }
    setReferrerId(null);
  };
  const dispatch = useAppDispatch();

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
    <div className="my-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Referrer</span>
        {showModal && <div className="text-green-700">{successMessage}</div>}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <Button
          kind="secondary"
          title="Add"
          onClick={handleOpenModal}
          startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
        />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="text-gray-50 w-full items-center  bg-gray-50 py-4 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex rounded-lg">
          <div className="font-bold text-white p-4 flex-1">Name</div>
          <div className="font-bold text-white p-4 flex-1">Type</div>
          <div className="font-bold text-white p-4 flex-1">Ref#</div>
          <div className="font-bold text-white p-4 flex-1">Email</div>
          <div className="font-bold text-white p-4 flex-1">Action</div>
        </div>
        {referrers.map((data) => (
          <React.Fragment key={data.id}>
            <div className="flex">
              <div
                className="text-blue-600 hover:text-blue-800 visited:text-purple-600 decoration-solid cursor-pointer bg-gray-50 pt-2 px-4 flex-1"
                onClick={() => data.id && handleOpenListModal(data.id)}
              >
                {data ? generateFullName(data.firstName, data.lastName) : null}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                {data?.referrerType}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                Ref#
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                {data?.email}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1 flex gap-4">
                <div
                  onClick={() => data.id && handleOpenEditModal(data.id)}
                  className="cursor-pointer"
                >
                  <EditIcon className="mt-2"></EditIcon>
                </div>
                <div
                  onClick={() => data.id && handleOpenDeleteModal(data.id)}
                  className="cursor-pointer"
                >
                  <DeleteIcon className="mt-2"></DeleteIcon>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <AddReferrerModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
      />
      <DeleteReferrerModal
        onConfirmDelete={onConfirmDelete}
        isDeleteModalOpen={isDeleteModalOpen}
        handleCloseDeleteModal={handleCloseDeleteModal}
      />
      <ReferredListModal
        isListModalOpen={isListModalOpen}
        referrerId={referrerId}
        handleCloseListModal={handleCloseListModal}
      />
      <EditReferrerModal
        isEditModalOpen={isEditModalOpen}
        handleCloseEditModal={handleCloseEditModal}
        referrerId={referrerId}
      />
    </div>
  );
}
