'use client';
import { UserType } from '@packages/entities';
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
  const loggedInUserInfo = useAppSelector((state) => state.auth.user);
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

  const addUserPermission = UserType.ADMIN === loggedInUserInfo?.type;
  const editUserPermission = UserType.ADMIN === loggedInUserInfo?.type;
  const deleteUserPermission = UserType.ADMIN === loggedInUserInfo?.type;

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
        {addUserPermission && (
          <Button
            kind="secondary"
            padding="5px 8px"
            title="Add New"
            onClick={handleOpenModal}
            startEnhancer={() => <AddIcon></AddIcon>}
          />
        )}
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="rounded-lg">
        <table className="">
          <tbody>
            <tr className="">
              <th className="">UserPhoto</th>
              <th className="">Username</th>
              <th className="">Email</th>
              <th className="">Practice Name</th>
              <th className="">Display Name</th>
              <th className="">Contact No.</th>
              <th className="">User Type</th>
              <th className="">Designation</th>
              <th className="">Social Media URL</th>
              <th className="">Status</th>
              <th className="">Action</th>
            </tr>
            {!isLoading &&
              users.map((data) => (
                <React.Fragment key={data.id}>
                  <tr className="border-t border-gray-300">
                    <td rowSpan={2} className="">
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
                    </td>
                    <td rowSpan={1} className="">
                      {data.userName}
                    </td>
                    <td rowSpan={1} className="">
                      {data.email}
                    </td>
                    <td rowSpan={1} className="">
                      {practiceName}
                    </td>
                    <td rowSpan={1} className="">
                      {data.fullName}
                    </td>
                    <td rowSpan={1} className="">
                      {data.countryCode}
                      {data.contactNumber}
                    </td>
                    <td rowSpan={1} className="">
                      {data.type}
                    </td>
                    <td rowSpan={1} className="">
                      {data.designation}
                    </td>

                    <td rowSpan={1} className="">
                      {data.url}
                    </td>
                    <td rowSpan={2} className="">
                      <div
                        className={`rounded-md text-white px-1 text-center capitalize ${
                          data.status?.toString() === 'pending'
                            ? 'bg-yellow-500'
                            : data.status?.toString() === 'inactive'
                              ? 'bg-red-500'
                              : 'bg-green-500'
                        }`}
                      >
                        {data.status?.toString()}
                      </div>
                    </td>
                    <td rowSpan={2} className="">
                      <div className="flex gap-1">
                        <div
                          onClick={() => data.id && handleViewUser(data.id)}
                          className="cursor-pointer"
                        >
                          <ViewIcon></ViewIcon>
                        </div>
                        {editUserPermission && (
                          <div
                            onClick={() =>
                              data.id && handleOpenEditModal(data.id)
                            }
                            className="cursor-pointer"
                          >
                            <EditIcon></EditIcon>
                          </div>
                        )}
                        {deleteUserPermission && (
                          <div
                            onClick={() =>
                              data.id && handleOpenDeleteModal(data.id)
                            }
                            className="cursor-pointer"
                          >
                            <DeleteIcon></DeleteIcon>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={8} className="">
                      <div className="grid grid-cols-9 text-[10px] bg-white px-1">
                        {data?.permissions && data?.permissions.length
                          ? data?.permissions
                              .filter(() => {
                                const isAdmin =
                                  loggedInUserInfo?.type === UserType.ADMIN;
                                const isProduction =
                                  process.env.NODE_ENV === 'production';
                                return isProduction
                                  ? isAdmin || data.id === loggedInUserInfo?.id
                                  : true;
                              })
                              .map((label, index) => (
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
                                        width: '10px',
                                        height: '10px',
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
                                    className=""
                                  >
                                    <span className="">{label.name}</span>
                                  </label>
                                </Checkbox>
                              ))
                          : null}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
          </tbody>
        </table>
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
