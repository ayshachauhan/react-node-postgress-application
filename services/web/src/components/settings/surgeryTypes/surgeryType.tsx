'use client';
import Button from '@root/components/Button';
import { AddIcon, DeleteIcon } from '@root/components/Icons';
import AddSurgeryType from '@root/components/settings/surgeryTypes/addSurgeryType';
import { useAppDispatch, useAppSelector } from '@root/store';
import { getPracticeInfo } from '@root/store/reducers/practices';
import {
  clearErrorMessage,
  clearSuccessMessage,
  deleteRecordAsync,
  fetchListings,
  selectError,
  selectSuccessMessage,
} from '@root/store/reducers/surgeryTypes';
import { getPracticeId } from '@utils/index';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ROLE,
  SIZE,
} from 'baseui/modal';
import React, { useEffect, useState } from 'react';

export default function SurgeryTypePage() {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const practiceId = getPracticeId();
  const practiceName = useAppSelector(
    (state) => state.practices.practiceInfo?.name,
  );
  const surgeryTypes = useAppSelector(
    (state) => state.surgeryTypes.surgeryTypes,
  );
  const [surgeryTypeId, setSurgeryTypeId] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const successMessage = useAppSelector(selectSuccessMessage);
  const errorMessage = useAppSelector(selectError);

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId: practiceId }));
      dispatch(getPracticeInfo({ id: practiceId }));
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

  const onConfirmDelete = (): void => {
    if (practiceId) {
      try {
        dispatch(deleteRecordAsync({ practiceId, id: surgeryTypeId }));
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (Id: string): void => {
    setIsDeleteModalOpen(true);
    setSurgeryTypeId(Id);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
  };

  const AddSurgeryModal = () => {
    return (
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        closeable
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        overrides={{
          Root: {
            style: ({ $theme }) => ({
              outline: `${$theme.colors.warning200} solid`,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }),
          },
        }}
      >
        <ModalHeader
          $style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            borderBottom: '1px solid rgba(244, 244, 245, 1)',
            paddingBottom: '8px',
          }}
        >
          Add New Surgery Type
        </ModalHeader>
        <ModalBody>
          <AddSurgeryType onClose={handleCloseModal} />
        </ModalBody>
      </Modal>
    );
  };

  const DeleteSurgeryTypeModal = () => {
    return (
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        closeable
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        overrides={{
          Root: {
            style: ({ $theme }) => ({
              outline: `${$theme.colors.warning200} solid`,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }),
          },
        }}
      >
        <ModalHeader $style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          Confirm Deletion
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this surgery type?
        </ModalBody>
        <ModalFooter>
          <Button kind="primary" title="Delete" onClick={onConfirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <div id="__next" className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold align-middle">Surgery Type</span>
        {showModal && <div className="text-green-700">{successMessage}</div>}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <Button
          kind="primary"
          title="Add New"
          onClick={handleOpenModal}
          startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
        />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="text-gray-50 w-full  items-center  bg-gray-50 py-4 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 grid grid-cols-4 rounded-lg">
          <div className="font-bold text-white p-4">S. No.</div>
          <div className="font-bold text-white p-4">Practice Name</div>
          <div className="font-bold text-white p-4">Surgery Type</div>
          <div className="font-bold text-white p-4">Action</div>
          {surgeryTypes.map((data, index) => (
            <React.Fragment key={data.id}>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {index + 1}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {practiceName}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.name}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex gap-4">
                <div
                  onClick={() => data.id && handleOpenDeleteModal(data.id)}
                  className="cursor-pointer"
                >
                  <DeleteIcon className="mt-2"></DeleteIcon>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <AddSurgeryModal />
      <DeleteSurgeryTypeModal />
    </div>
  );
}
