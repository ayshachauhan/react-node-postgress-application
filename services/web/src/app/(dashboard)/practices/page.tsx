'use client';
import { AddIcon, DeleteIcon, EditIcon } from '@components/Icons';
import AddPracticeForm from '@components/practices/practices.module';
import Button from '@root/components/Button';
import PracticeEditModule from '@root/components/practices/editPractice.module';
import { UserType } from '@root/enums/userType.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectRecords } from '@root/store/reducers/auth';
import {
  clearErrorMessage,
  clearSuccessMessage,
  deleteRecordAsync,
  fetchListings,
  selectError,
  selectSuccessMessage,
} from '@root/store/reducers/practices';
import { PracticesEditInterface } from '@store/requests/practices';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ROLE,
  SIZE,
} from 'baseui/modal';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Practice: React.FC = () => {
  const dispatch = useAppDispatch();
  const practices = useAppSelector((state) => state.practices.practices);
  const [practiceId, setPracticeId] = useState<string | null>(null);
  const [editExistingValues, setEditExistingValue] =
    useState<PracticesEditInterface>({
      name: '',
      status: '',
      code: '',
      id: '',
    });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const successMessage = useAppSelector(selectSuccessMessage);
  const errorMessage = useAppSelector(selectError);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const router = useRouter();
  const userInfo = useAppSelector(selectRecords);
  useEffect(() => {
    if (userInfo && userInfo?.type === UserType.ADMIN) {
      // Perform the redirect inside the useEffect
      router.push('dashboard');
    }
  }, [userInfo, router]);

  useEffect(() => {
    dispatch(fetchListings(undefined));
  }, []); // Empty dependency array to run the effect only once

  const handleOpenCreateModal = (): void => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = (): void => {
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (
    practiceEditValues: PracticesEditInterface,
  ): void => {
    setEditExistingValue(practiceEditValues);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = (): void => {
    setIsEditModalOpen(false);
  };

  const handleOpenDeleteModal = (Id: string): void => {
    setIsDeleteModalOpen(true);
    setPracticeId(Id);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setPracticeId(null);
  };

  const onConfirmDelete = (): void => {
    if (practiceId) {
      try {
        dispatch(deleteRecordAsync({ id: practiceId }));
        setIsDeleteModalOpen(false);
        setPracticeId(null);
      } catch (error) {
        console.log(error);
      }
    }
    setPracticeId(null);
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
        <ModalHeader
          $style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            borderBottom: '1px solid rgba(244, 244, 245, 1)',
            paddingBottom: '8px',
          }}
        >
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
          <PracticeEditModule
            onClose={handleCloseEditModal}
            initialValues={editExistingValues}
          />
        </ModalBody>
      </Modal>
    );
  };

  const DeleteModal = () => {
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
        <ModalBody>Are you sure you want to delete this practice?</ModalBody>
        <ModalFooter>
          <Button kind="primary" title="Delete" onClick={onConfirmDelete}>
            Delete
          </Button>
        </ModalFooter>
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
        <span className="text-xl font-bold">All Practices</span>
        {showModal && <div className="text-green-700">{successMessage}</div>}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <Button
          kind="secondary"
          title="Add New"
          onClick={handleOpenCreateModal}
          startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
        />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="text-gray-50 w-full  items-center  bg-gray-50 py-4 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 grid grid-cols-12 rounded-lg w-auto">
          <div className="font-bold text-white p-4 w-auto ">S. No.</div>
          <div className="font-bold text-white p-4 w-auto  text-center">
            Practice Code
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Practice Name
          </div>
          <div className="font-bold text-white p-4 w-auto  text-center">
            Practice Photo
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            First Name
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Last Name
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Admin Email
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Admin M. No.
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Physician Email
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Physician M. No.
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Status
          </div>
          <div className="font-bold text-white p-4 w-auto text-center">
            Action
          </div>

          {practices.map((data, index) => (
            <React.Fragment key={data.id}>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 ">
                {index + 1}.
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 text-center">
                {data.code}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 text-center">
                {data.name}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 text-center">
                Profile Photo
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 text-center">
                {data.adminFirstName}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 text-center">
                {data.adminLastName}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 text-center">
                {data.adminEmail}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 text-center">
                {data.adminContactNumber}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 text-center">
                {data.physicianEmail}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 text-center">
                {data.physicianContactNumber}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex text-center items-center justify-center">
                <div
                  className={`rounded-md text-white px-3.5 ${
                    data.status?.toString() === 'pending'
                      ? 'bg-yellow-500'
                      : data.status?.toString() === 'inactive'
                        ? 'bg-red-500'
                        : 'bg-green-500'
                  }`}
                >
                  {data.status?.toString()}
                </div>
              </div>
              <div className="flex flex-row bg-gray-50 pt-2 px-6 text-center item-center justify-evenly">
                <div className="text-center">
                  <Button
                    kind="tertiary"
                    title=""
                    colors={{ backgroundColor: 'Transparent', color: 'black' }}
                    onClick={() =>
                      handleOpenEditModal({
                        name: data.name,
                        code: data.code,
                        status: data.status,
                        id: data.id,
                      })
                    }
                    startEnhancer={() => <EditIcon />}
                  />
                </div>
                <div className="text-center">
                  <Button
                    kind="tertiary"
                    title=""
                    colors={{ backgroundColor: 'Transparent', color: 'black' }}
                    onClick={() => data.id && handleOpenDeleteModal(data.id)}
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
      <DeleteModal />
    </div>
  );
};

export default Practice;
