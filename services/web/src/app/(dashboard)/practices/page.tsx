'use client';
import { AddIcon, DeleteIcon, EditIcon } from '@components/Icons';
import AddPracticeForm from '@components/practices/practices.module';
import Button from '@root/components/Button';
import PracticeEditModule from '@root/components/practices/editPractice.module';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  deleteRecordAsync,
  fetchListings,
  selectError,
  selectSuccessMessage,
} from '@root/store/reducers/practices';
import { Modal, ModalBody, ModalHeader, ROLE, SIZE } from 'baseui/modal';
import React, { useEffect, useState } from 'react';

const Practice: React.FC = () => {
  const dispatch = useAppDispatch();
  const practices = useAppSelector((state) => state.practices.practices);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const successMessage = useAppSelector(selectSuccessMessage);
  const errorMessage = useAppSelector(selectError);
  const [showModal, setShowModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  const handleOpenCreateModal = (): void => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = (): void => {
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (): void => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = (): void => {
    setIsEditModalOpen(false);
  };

  const handleDeleteRecord = (practiceId: string | undefined): void => {
    dispatch(deleteRecordAsync(practiceId));
    dispatch(fetchListings());
  };

  const CreateFormModal = () => {
    return (
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
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
          Add New Practice
        </ModalHeader>
        <ModalBody>
          <AddPracticeForm onClose={handleCloseCreateModal} />
        </ModalBody>
      </Modal>
    );
  };

  const EditFormModal = () => {
    return (
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
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
          Edit Practice
        </ModalHeader>
        <ModalBody>
          <PracticeEditModule onClose={handleCloseEditModal} />
        </ModalBody>
      </Modal>
    );
  };

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
        <span className="text-xl">All Practices</span>
        {showModal && <div style={{ color: 'green' }}>{successMessage}</div>}
        {showErrorMessage && (
          <div style={{ color: 'red' }}>
            Error occurred while adding record.
          </div>
        )}
        <Button
          kind="secondary"
          title="Add New"
          onClick={handleOpenCreateModal}
          startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
        />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="text-gray-50 w-full  items-center  bg-gray-50 py-4 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 grid grid-cols-6 rounded-lg">
          <div className="font-bold text-white p-4 col-span-1">S. No.</div>
          <div className="font-bold text-white p-4 text-center">Practice</div>
          <div className="font-bold text-white p-4 text-center">
            Create Date
          </div>
          <div className="font-bold text-white p-4 text-center">
            Update Date
          </div>
          <div className="font-bold text-white p-4 text-center">Status</div>
          <div className="font-bold text-white p-4 text-center">Action</div>

          {practices.map((data, index) => (
            <React.Fragment key={data.id}>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 col-span-1">
                {index + 1}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 text-center">
                {data.name}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 text-center">
                {data.dateCreated?.toString()}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 text-center">
                {data.dateCreated?.toString()}
              </div>
              <div className="text-gray-900 bg-gray-50  pt-2   px-4 flex text-center items-center justify-center">
                <div className="bg-yellow-400 rounded-lg px-10">
                  {data.status?.toString()}
                </div>
              </div>
              <div className="flex flex-row bg-gray-50 pt-2 px-6 text-center item-center justify-evenly">
                <div className="text-center">
                  <Button
                    kind="secondary"
                    isDanger={true}
                    title=""
                    onClick={handleOpenEditModal}
                    startEnhancer={() => <EditIcon />}
                  />
                </div>
                <div className="text-center">
                  <Button
                    kind="secondary"
                    isDanger={true}
                    title=""
                    onClick={() => handleDeleteRecord(data.id)}
                    startEnhancer={() => <DeleteIcon />}
                  />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <CreateFormModal />
      <EditFormModal />
    </div>
  );
};

export default Practice;
