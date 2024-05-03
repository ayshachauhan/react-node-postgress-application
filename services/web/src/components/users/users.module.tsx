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
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectRecords } from '@root/store/reducers/auth';
import { getPracticeInfo } from '@root/store/reducers/practices';
import {
  clearErrorMessage,
  clearSuccessMessage,
  deleteRecordAsync,
  fetchListings,
} from '@root/store/reducers/users';
import { getPracticeId } from '@utils/index';
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

export default function UserPage() {
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => Object.values(state.users.entities));
  const userInfo = useAppSelector(selectRecords); // Select success message from Redux store
  const filteredUsers = users.filter((user) => user.id !== userInfo?.id);
  const [userId, setUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const practiceId = getPracticeId(); // Select success message from Redux store
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.users.successMessage,
    errorMessage: state.users.errorMessage,
  }));
  const router = useRouter();

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId: practiceId })); // Fetch listings from PostgreSQL database
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    let timer;
    if (successMessage) {
      setShowModal(true);
      timer = setTimeout(() => {
        setShowModal(false);
        dispatch(clearSuccessMessage()); // Clear success message
      }, 2000); // Hide modal after 2 seconds
    }
    if (errorMessage) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
        dispatch(clearErrorMessage()); // Clear error message
      }, 2000); // Hide modal after 2 seconds
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMessage, errorMessage, dispatch]);

  useEffect(() => {
    if (practiceId) {
      dispatch(getPracticeInfo({ id: practiceId })); // Fetch listings from PostgreSQL database
    }
  }, [practiceId, dispatch]);

  const practiceName = useAppSelector(
    (state) => state.practices.practiceInfo?.name,
  );

  const onConfirmDelete = (): void => {
    const id = userId;
    if (practiceId && id) {
      try {
        const id = userId;
        dispatch(deleteRecordAsync({ practiceId, id }));
        setIsDeleteModalOpen(false);
        setUserId(null);
      } catch (error) {
        console.log(error);
      }
    }
    setUserId(null);
  };

  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };

  const handleViewUser = (id: string): void => {
    const query = { id };
    const queryString = new URLSearchParams(query).toString(); // Serialize the query object
    const url = `/users/view/?${queryString}`; // Append the serialized query string to the pathname
    router.push(url);
  };

  const handleOpenEditModal = (Id: string): void => {
    setIsModalOpen(false);
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

  const handleCloseEditModal = (): void => {
    setIsEditModalOpen(false);
    setUserId(null);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setUserId(null);
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
        <ModalHeader
          $style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            borderBottom: '1px solid rgba(244, 244, 245, 1)',
            paddingBottom: '8px',
          }}
        >
          Add New User
        </ModalHeader>
        <ModalBody>
          <Form onClose={handleCloseModal} />
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
          {userId !== null && (
            <EditUser data={{ id: userId }} onClose={handleCloseEditModal} />
          )}
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
          <Button kind="primary" title="Delete" onClick={onConfirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Users</span>
        {showModal && <div className="text-green-700">{successMessage}</div>}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <Button
          kind="secondary"
          title="Add New"
          onClick={handleOpenModal}
          startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
        />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="text-gray-50 w-full  items-center  bg-gray-50 py-4 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 grid grid-cols-10 rounded-lg">
          <div className="font-bold text-white p-4">S. No.</div>
          {/* <div className="font-bold text-white p-4">Location</div> */}
          <div className="font-bold text-white p-4">Username</div>
          <div className="font-bold text-white p-4">Email</div>
          <div className="font-bold text-white p-4">Practice Name</div>
          <div className="font-bold text-white p-4">Display Name</div>
          <div className="font-bold text-white p-4">Contact No.</div>
          <div className="font-bold text-white p-4">Designation</div>
          <div className="font-bold text-white p-4">User URL</div>
          <div className="font-bold text-white p-4">Status</div>
          <div className="font-bold text-white p-4">Action</div>
          {filteredUsers.map((data, index) => (
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
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {practiceName}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.fullName}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.contactNumber}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.type}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.url}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex text-center items-center">
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
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex gap-4">
                <div
                  onClick={() => data.id && handleViewUser(data.id)}
                  className="cursor-pointer"
                >
                  <ViewIcon className="mt-2"></ViewIcon>
                </div>
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
            </React.Fragment>
          ))}
        </div>
      </div>
      <UserAddModal />
      <UserEditModal />
      <UserDeleteModal />
    </div>
  );
}
