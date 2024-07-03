'use client';
import Button from '@root/components/Button';
import {
  AddIcon,
  AvatarIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from '@root/components/Icons';
import Loader from '@root/components/loader';
import AddUserModal from '@root/components/users/AddUserModal';
import EditUserModal from '@root/components/users/EditUserModal';
import { useLoader } from '@root/hooks/useLoader';
import { useAppDispatch, useAppSelector } from '@root/store';
import { getPracticeInfo } from '@root/store/reducers/practices';
import { fetchListings as fetchPermissions } from '@root/store/reducers/userPermissions';
import {
  clearErrorMessage,
  clearSuccessMessage,
  deleteRecordAsync,
  fetchListings,
} from '@root/store/reducers/users';
import { getPracticeId } from '@utils/index';
import { Checkbox } from 'baseui/checkbox';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ROLE,
  SIZE,
} from 'baseui/modal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { ModalCloseEvent } from '../BaseUiModal/BaseUiModal';

export default function UserPage() {
  const [showModal, setShowModal] = useState(false);
  const { isLoading, withLoader } = useLoader();
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => Object.values(state.users.entities));
  const [userId, setUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const practiceId = getPracticeId();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.users.successMessage,
    errorMessage: state.users.errorMessage,
  }));
  const router = useRouter();

  const modalRef = useRef(null);

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
    dispatch(fetchPermissions(undefined));
  }, []);

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

  useEffect(() => {
    if (practiceId) {
      dispatch(getPracticeInfo({ id: practiceId }));
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
    const queryString = new URLSearchParams(query).toString();
    const url = `/users/view/?${queryString}`;
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

  const handleCloseDeleteModal = (event?: ModalCloseEvent): void => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsDeleteModalOpen(false);
    setUserId(null);
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
    <div className="mt-4 mb-8">
      {isLoading && <Loader />}
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Users</span>
        {showModal && <div className="text-green-700">{successMessage}</div>}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <Button
          kind="secondary"
          title="Add New"
          onClick={handleOpenModal}
          startEnhancer={() => <AddIcon></AddIcon>}
        />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="text-gray-50 w-full items-center border-l border rounded-t-lg rounded-b-lg border-gray-200 text-sm overflow-x-auto mt-2">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_0.5fr_0.5fr_0.5fr_2fr_1fr_0.5fr_0.5fr] gap-4 p-4">
          <div className="font-bold text-white">UserPhoto</div>
          <div className="font-bold text-white">Username</div>
          <div className="font-bold text-white">Email</div>
          <div className="font-bold text-white">Practice Name</div>
          <div className="font-bold text-white">Display Name</div>
          <div className="font-bold text-white">Contact No.</div>
          <div className="font-bold text-white">User Type</div>
          <div className="font-bold text-white w-36">Designation</div>
          <div className="font-bold text-white">Permissions</div>
          <div className="font-bold text-white">Social Media URL</div>
          <div className="font-bold text-white">Status</div>
          <div className="font-bold text-white">Action</div>
        </div>
        {!isLoading &&
          users.map((data) => (
            <React.Fragment key={data.id}>
              <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_0.5fr_0.5fr_0.5fr_2fr_1fr_0.5fr_0.5fr] gap-4 px-4 py-2 flex ">
                <div className="text-gray-900 overflow-hidden whitespace-nowrap">
                  {data.imgUrl ? (
                    <Image
                      src={data.imgUrl}
                      alt={data.id}
                      width={50}
                      height={50}
                      className="inline-block mr-2 rounded-[10px]"
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '100px',
                      }}
                    />
                  ) : (
                    <AvatarIcon size={50}></AvatarIcon>
                  )}
                </div>
                <div className="text-gray-900 overflow-hidden whitespace-nowrap">
                  {data.userName}
                </div>
                <div className="text-gray-900 overflow-hidden whitespace-nowrap">
                  {data.email}
                </div>
                <div className="text-gray-900 overflow-hidden whitespace-nowrap">
                  {practiceName}
                </div>
                <div className="text-gray-900 overflow-hidden whitespace-nowrap">
                  {data.fullName}
                </div>
                <div className="text-gray-900 overflow-hidden whitespace-nowrap">
                  {data.contactNumber}
                </div>
                <div className="text-gray-900 overflow-hidden whitespace-nowrap">
                  {data.type}
                </div>
                <div className="text-gray-900 overflow-hidden whitespace-nowrap ml-2 w-36">
                  {data.designation}
                </div>
                <div className="text-gray-900">
                  <div className="grid grid-cols-2 gap-1">
                    {data?.permissions.map((label, index) => (
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
                      >
                        <label
                          htmlFor={`checkbox-${index}`}
                          className="text-black text-sm font-normal"
                        >
                          <span className="truncate">{label.name}</span>
                        </label>
                      </Checkbox>
                    ))}
                  </div>
                </div>
                <div className="text-gray-900 overflow-hidden whitespace-nowrap">
                  {data.url}
                </div>
                <div className="text-gray-900 text-center overflow-hidden whitespace-nowrap">
                  <div
                    className={`rounded-md text-white px-1 ${
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
                <div className="text-gray-900 flex gap-1">
                  <div
                    onClick={() => data.id && handleViewUser(data.id)}
                    className="cursor-pointer"
                  >
                    <ViewIcon></ViewIcon>
                  </div>
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
          ))}
      </div>
      <AddUserModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        withLoader={withLoader}
      />
      <EditUserModal
        isEditModalOpen={isEditModalOpen}
        handleCloseEditModal={handleCloseEditModal}
        userId={userId}
        withLoader={withLoader}
      />
      <UserDeleteModal />
    </div>
  );
}
