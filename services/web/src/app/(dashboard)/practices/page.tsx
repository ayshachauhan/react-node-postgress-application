'use client';
import { AddIcon, AvatarIcon, DeleteIcon, EditIcon } from '@components/Icons';
import AddPracticeForm from '@components/practices/practices.module';
import { ModalCloseEvent } from '@root/components/BaseUiModal/BaseUiModal';
import Button from '@root/components/Button';
import Loader from '@root/components/loader';
import PracticeEditModule from '@root/components/practices/editPractice.module';
import { useLoader } from '@root/hooks/useLoader';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  deleteRecordAsync,
  fetchListings,
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
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

const Practice: React.FC = () => {
  const dispatch = useAppDispatch();
  const practices = useAppSelector((state) =>
    Object.values(state.practices.entities),
  );
  const { isLoading, withLoader } = useLoader();
  const [practiceId, setPracticeId] = useState<string | null>(null);
  const [editExistingValues, setEditExistingValue] =
    useState<PracticesEditInterface>({
      name: '',
      status: '',
      code: '',
      id: '',
      adminFirstName: '',
      adminLastName: '',
      adminContactNumber: '',
      adminId: '',
    });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.practices.successMessage,
    errorMessage: state.practices.errorMessage,
  }));
  const modalRef = useRef(null);

  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await withLoader(async () => {
        await dispatch(fetchListings(undefined));
      });
    };
    loadData();
  }, [withLoader]);

  useEffect(() => {
    if (successMessage) {
      const loadData = async () => {
        await withLoader(async () => {
          await dispatch(fetchListings(undefined));
        });
      };
      loadData();
    }
  }, [successMessage, dispatch, withLoader]);

  const handleOpenCreateModal = (): void => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = (event?: ModalCloseEvent): void => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (
    practiceEditValues: PracticesEditInterface,
  ): void => {
    setEditExistingValue(practiceEditValues);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = (event?: ModalCloseEvent): void => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsEditModalOpen(false);
  };

  const handleOpenDeleteModal = (Id: string): void => {
    setIsDeleteModalOpen(true);
    setPracticeId(Id);
  };

  const handleCloseDeleteModal = (event?: ModalCloseEvent): void => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
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
          <AddPracticeForm
            onClose={handleCloseCreateModal}
            withLoader={withLoader}
          />
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
          Edit Practice
        </ModalHeader>
        <ModalBody>
          <PracticeEditModule
            onClose={handleCloseEditModal}
            initialValues={editExistingValues}
            withLoader={withLoader}
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
    <div className="my-4">
      {isLoading && <Loader />}
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">All Practices</span>
        {showModal && <div className="text-green-700">{successMessage}</div>}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <Button
          kind="secondary"
          padding="5px 8px"
          title="Add New"
          onClick={handleOpenCreateModal}
          startEnhancer={() => <AddIcon></AddIcon>}
        />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="table-responsive overflow-x-auto rounded-lg">
        <table className="">
          <tbody className="">
            <tr>
              <th className="">Practice Photo</th>
              <th className="">Practice Name</th>
              <th className="">First Name</th>
              <th className="">Last Name</th>
              <th className="">Admin Email</th>
              <th className="">Admin M. No.</th>
              <th className="">Status</th>
              <th className="">Action</th>
            </tr>
            {practices.map((data) => (
              <tr className="border-t border-gray-200 " key={data.id}>
                <td className="">
                  {data.imgUrl ? (
                    <Image
                      src={data.imgUrl}
                      alt={data.id ?? ''}
                      width={40}
                      height={40}
                      className="inline-block rounded-[10px]"
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'cover',
                        borderRadius: '100px',
                      }}
                    />
                  ) : (
                    <AvatarIcon size={40}></AvatarIcon>
                  )}
                </td>
                <td className="">{data.name}</td>
                <td className="">{data.adminFirstName}</td>
                <td className="">{data.adminLastName}</td>
                <td className="">{data.adminEmail}</td>
                <td className="">{data.adminContactNumber}</td>
                <td className="">
                  <div
                    className={`flex justify-center items-center rounded-md capitalize px-2 text-white ${
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
                <td className="">
                  <div className="flex gap-1">
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        handleOpenEditModal({
                          name: data.name,
                          code: data.code,
                          status: data.status,
                          id: data.id,
                          adminFirstName: data.adminFirstName,
                          adminLastName: data.adminLastName,
                          adminContactNumber: data.adminContactNumber,
                          adminId: data.adminId,
                        })
                      }
                    >
                      <EditIcon />
                    </div>

                    <div
                      className="cursor-pointer"
                      onClick={() => data.id && handleOpenDeleteModal(data.id)}
                    >
                      <DeleteIcon />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CreateFormModal />
      <EditFormModal />
      <DeleteModal />
    </div>
  );
};

export default Practice;
