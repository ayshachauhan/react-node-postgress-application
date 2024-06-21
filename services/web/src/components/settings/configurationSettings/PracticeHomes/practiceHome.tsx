'use client';
import { IPracticeHomes } from '@packages/entities';
import { ModalCloseEvent } from '@root/components/BaseUiModal/BaseUiModal';
import Button from '@root/components/Button';
import { AddIcon, DeleteIcon } from '@root/components/Icons';
import AddPracticeHome from '@root/components/settings/configurationSettings/PracticeHomes/addPracticeHome';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  deleteRecordAsync,
  fetchListings,
} from '@root/store/reducers/practiceHomes';
import { getPracticeInfo } from '@root/store/reducers/practices';
import { getPracticeId } from '@utils/index';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ROLE,
  SIZE,
} from 'baseui/modal';
import React, { useEffect, useRef, useState } from 'react';

export default function PracticeHomesPage() {
  const [practiceHomeId, setPracticeHomeId] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const practiceName = useAppSelector(
    (state) => state.practices.practiceInfo?.name,
  );
  const practiceHomes: IPracticeHomes[] = useAppSelector((state) =>
    Object.values(state.practiceHomes.entities),
  );

  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.practiceHomes.successMessage,
    errorMessage: state.practiceHomes.errorMessage,
  }));
  const modalRef = useRef(null);

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId: practiceId }));
      dispatch(getPracticeInfo({ id: practiceId }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    let timer;
    if (successMessage) {
      setShowSuccessMessage(true);
      timer = setTimeout(() => {
        setShowSuccessMessage(false);
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

  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (event?: ModalCloseEvent): void => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsModalOpen(false);
  };

  const handleOpenDeleteModal = (id: string): void => {
    setPracticeHomeId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = (event?: ModalCloseEvent): void => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = (): void => {
    if (practiceId) {
      dispatch(deleteRecordAsync({ practiceId, id: practiceHomeId }));
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold align-middle">Practice Home</span>
        {showSuccessMessage && (
          <div className="text-green-700">{successMessage}</div>
        )}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <Button
          kind="primary"
          title="Add New"
          onClick={handleOpenModal}
          startEnhancer={() => <AddIcon className="mt-2" size={25} />}
        />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100" />
      <div className="text-gray-50 w-full items-center bg-gray-50 py-4 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 grid grid-cols-4 rounded-lg">
          <div className="font-bold text-white p-4">S. No.</div>
          <div className="font-bold text-white p-4">Practice Name</div>
          <div className="font-bold text-white p-4">Practice Home</div>
          <div className="font-bold text-white p-4">Action</div>
          {practiceHomes.map((data, index) => (
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
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                <div
                  onClick={() => data.id && handleOpenDeleteModal(data.id)}
                  className="cursor-pointer"
                >
                  <DeleteIcon className="mt-2" />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        closeable
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        ref={modalRef}
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
          Add New Practice Home
        </ModalHeader>
        <ModalBody>
          <AddPracticeHome onClose={handleCloseModal} />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        closeable
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        ref={modalRef}
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
          Are you sure you want to delete this Practice Home?
        </ModalBody>
        <ModalFooter>
          <Button kind="primary" title="Delete" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
