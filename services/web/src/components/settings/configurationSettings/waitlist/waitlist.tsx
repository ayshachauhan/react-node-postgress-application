'use client';
import { IWaitlist } from '@packages/entities';
import { ModalCloseEvent } from '@root/components/BaseUiModal/BaseUiModal';
import Button from '@root/components/Button';
import { AddIcon, DeleteIcon } from '@root/components/Icons';
import AddWaitlist from '@root/components/settings/configurationSettings/waitlist/addWaitlist';
import { useAppDispatch, useAppSelector } from '@root/store';
import { getPracticeInfo } from '@root/store/reducers/practices';
import {
  clearErrorMessage,
  clearSuccessMessage,
  deleteRecordAsync,
  fetchListings,
} from '@root/store/reducers/waitlist';
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

export default function WaitlistPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [waitlistId, setWaitlistId] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const modalRef = useRef(null);

  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const practiceName = useAppSelector(
    (state) => state.practices.practiceInfo?.name,
  );
  const waitlist: IWaitlist[] = useAppSelector((state) =>
    Object.values(state.waitlist.entities),
  );

  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.waitlist.successMessage,
    errorMessage: state.waitlist.errorMessage,
  }));

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId }));
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (event?: ModalCloseEvent) => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsModalOpen(false);
  };

  const handleOpenDeleteModal = (id: string) => {
    setWaitlistId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = (event?: ModalCloseEvent) => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (practiceId) {
      dispatch(deleteRecordAsync({ practiceId, id: waitlistId }));
      setIsDeleteModalOpen(false);
    }
  };

  const AddWaitlistModal = () => {
    return (
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
          Add New Waitlist
        </ModalHeader>
        <ModalBody>
          <AddWaitlist onClose={handleCloseModal} />
        </ModalBody>
      </Modal>
    );
  };

  const DeleteWaitlistModal = () => {
    return (
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
        <ModalBody>Are you sure you want to delete this waitlist?</ModalBody>
        <ModalFooter>
          <Button kind="primary" title="Delete" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold align-middle">Waitlist</span>
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
      <div className="text-gray-50 w-full  items-center  bg-gray-50 py-4 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 grid grid-cols-4 rounded-lg">
          <div className="font-bold text-white p-4">S. No.</div>
          <div className="font-bold text-white p-4">Practice Name</div>
          <div className="font-bold text-white p-4">Waitlist</div>
          <div className="font-bold text-white p-4">Action</div>
          {waitlist.map((data, index) => (
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
                  onClick={() => handleOpenDeleteModal(data.id)}
                  className="cursor-pointer"
                >
                  <DeleteIcon className="mt-2" />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <AddWaitlistModal />
      <DeleteWaitlistModal />
    </div>
  );
}
