'use client';
import Button from '@root/components/Button';
import { AddIcon, DeleteIcon, EditIcon } from '@root/components/Icons';
import Loader from '@root/components/loader';
import AddReferrerModal from '@root/components/referrer/AddReferrerModal';
import EditReferrerModal from '@root/components/referrer/EditReferrerModal';
import ReferredListModal from '@root/components/referrer/ReferredListModal';
import { useLoader } from '@root/hooks/useLoader';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import {
  clearErrorMessage,
  clearSuccessMessage,
  deleteRecordAsync,
  fetchListings,
} from '@root/store/reducers/referrer';
import { generateFullName, getPracticeId } from '@utils/index';
import { Checkbox } from 'baseui/checkbox';
import React, { useEffect, useState } from 'react';
import DeleteReferrerModal from './DeleteReferrerModal';

export default function ReferrerTable() {
  const practiceId = getPracticeId();
  const { isLoading, withLoader } = useLoader();
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
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  useEffect(() => {
    if (practiceId !== null) {
      const loadData = async () => {
        await withLoader(async () => {
          await dispatch(fetchListings({ practiceId: practiceId }));
        });
      };

      loadData();
    }
  }, [practiceId, dispatch, withLoader]);
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
    <div className="mt-4 mb-8">
      {isLoading && <Loader />}
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
      <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="w-full overflow-x-auto mt-2 border rounded-t-lg rounded-b-lg border-gray-200">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
          <div className="font-bold text-white p-4 flex-1">Name</div>
          <div className="font-bold text-white p-4 flex-1">Type</div>
          <div className="font-bold text-white p-4 flex-1">Ref#</div>
          <div className="font-bold text-white p-4 flex-1">Email</div>
          <div className="font-bold text-white p-4 flex-1">Action</div>
        </div>
        {!isLoading &&
          referrers.map((data, index) => {
            const totalSurgeries = data.patients?.reduce(
              (sum, patient) => sum + (patient.surgeries?.length || 0),
              0,
            );
            const totalEvals = data.patients?.reduce(
              (sum, patient) => sum + (patient.evals?.length || 0),
              0,
            );
            const total = totalSurgeries + totalEvals;

            return (
              <React.Fragment key={data.id}>
                <div
                  className={`flex pb-2 ${
                    index !== referrers.length - 1
                      ? 'border-b border-gray-300'
                      : ''
                  }`}
                >
                  <div
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600 decoration-solid cursor-pointer bg-gray-50 pt-2 px-4 flex-1"
                    onClick={() => data.id && handleOpenListModal(data.id)}
                  >
                    <div className="flex">
                      {data
                        ? generateFullName(data.firstName, data.lastName)
                        : null}
                      {data && data.verified && (
                        <Checkbox
                          key={index}
                          checked={true}
                          overrides={{
                            Checkmark: {
                              style: ({ $checked }) => ({
                                backgroundColor: $checked
                                  ? 'rgba(34, 197, 94, 1)'
                                  : 'white',
                                borderColor: $checked
                                  ? 'rgba(34, 197, 94, 1)'
                                  : 'rgba(113, 113, 122, 1)',
                                width: '15px',
                                height: '15px',
                                marginTop: '7px',
                                marginRight: '0px',
                                borderRadius: '2px',
                                borderWidth: '2px',
                              }),
                            },
                          }}
                        ></Checkbox>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                    {data?.referrerType}
                  </div>
                  <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                    {total ? total : 0}
                  </div>
                  <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                    {data?.email}
                  </div>
                  <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1 flex gap-1">
                    <div
                      onClick={() => data.id && handleOpenEditModal(data.id)}
                      className="cursor-pointer"
                    >
                      <EditIcon></EditIcon>
                    </div>
                    <div
                      onClick={() => data.id && handleOpenDeleteModal(data.id)}
                      className="cursor-pointer"
                    >
                      <DeleteIcon></DeleteIcon>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
      </div>
      <AddReferrerModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        withLoader={withLoader}
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
        withLoader={withLoader}
      />
      <EditReferrerModal
        isEditModalOpen={isEditModalOpen}
        handleCloseEditModal={handleCloseEditModal}
        referrerId={referrerId}
        withLoader={withLoader}
      />
    </div>
  );
}
