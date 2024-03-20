'use client';
import Button from '@root/components/Button';
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from '@root/components/Icons';
import Form from '@root/components/users/addUser.module';
import EditUser from '@root/components/users/editUser.module';
import ViewUser from '@root/components/users/viewUser.module';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectPractice } from '@root/store/reducers/auth';
import { fetchListings } from '@root/store/reducers/users';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ROLE,
  SIZE,
} from 'baseui/modal';
import React, { useEffect, useState } from 'react';

export default function UserPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const practiceId = useAppSelector(selectPractice); // Select success message from Redux store
  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId: practiceId })); // Fetch listings from PostgreSQL database
    }
  }, [practiceId, dispatch]);

  const [userId, setUserId] = useState<string | null>(null);

  const userInfo = {
    id: userId,
  };

  const onConfirm = () => {
    console.log('Item deleted!');
    setUserId(null);
  };

  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (Id: string): void => {
    console.log(Id, 2);
    setIsModalOpen(false);
    setIsViewModalOpen(true);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setUserId(Id);
  };

  const handleOpenEditModal = (Id: string): void => {
    console.log(Id, 2);
    setIsModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
    setIsDeleteModalOpen(false);
    setUserId(Id);
  };

  const handleOpenDeleteModal = (Id: string): void => {
    setIsDeleteModalOpen(true);
    setUserId(Id);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const handleCloseViewModal = (): void => {
    setIsViewModalOpen(false);
    setUserId(null);
  };

  const handleCloseEditModal = (): void => {
    setIsEditModalOpen(false);
    setUserId(null);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
  };

  const UserAddModal = () => {
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
        <ModalHeader $style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          Add New User
        </ModalHeader>
        <ModalBody>
          <Form onClose={handleCloseModal} />
        </ModalBody>
      </Modal>
    );
  };
  const UserViewModal = () => {
    return (
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
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
          User Information
        </ModalHeader>
        <ModalBody>
          <ViewUser data={userInfo} />
        </ModalBody>
      </Modal>
    );
  };
  const UserEditModal = () => {
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
          Edit User
        </ModalHeader>
        <ModalBody>
          <EditUser data={userInfo} onClose={handleCloseEditModal} />
        </ModalBody>
      </Modal>
    );
  };
  const UserDeleteModal = () => {
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
        <ModalBody>Are you sure you want to delete this user?</ModalBody>
        <ModalFooter>
          <Button kind="primary" title="Delete" onClick={onConfirm}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <div id="__next" className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl">Users</span>
        <Button
          kind="secondary"
          title="Add New"
          onClick={handleOpenModal}
          startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
        />{' '}
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="text-gray-50 w-full  items-center  bg-gray-50 py-4 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 grid grid-cols-9 rounded-lg">
          <div className="font-bold text-white p-4">S. No.</div>
          {/* <div className="font-bold text-white p-4">Location</div> */}
          <div className="font-bold text-white p-4">Username</div>
          <div className="font-bold text-white p-4">Email</div>
          <div className="font-bold text-white p-4">Practice Name</div>
          <div className="font-bold text-white p-4">Display Name</div>
          <div className="font-bold text-white p-4">Designation</div>
          <div className="font-bold text-white p-4">User URL</div>
          <div className="font-bold text-white p-4">Status</div>
          <div className="font-bold text-white p-4">Action</div>
          {users.map((data, index) => (
            <React.Fragment key={data.id}>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {index + 1}
              </div>
              {/* <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                
              </div> */}
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.userName}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.email}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4"></div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.fullName}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.type}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.url}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.status}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex gap-4">
                <div
                  onClick={() => data.id && handleOpenViewModal(data.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <ViewIcon className="mt-2"></ViewIcon>
                </div>
                <div
                  onClick={() => data.id && handleOpenEditModal(data.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <EditIcon className="mt-2"></EditIcon>
                </div>
                <div
                  onClick={() => data.id && handleOpenDeleteModal(data.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <DeleteIcon className="mt-2"></DeleteIcon>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <UserAddModal />
      <UserViewModal />
      <UserEditModal />
      <UserDeleteModal />
    </div>
  );
}
