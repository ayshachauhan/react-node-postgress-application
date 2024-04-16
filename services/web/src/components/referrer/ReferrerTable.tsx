'use client';
import Button from '@root/components/Button';
import { AddIcon, DeleteIcon } from '@root/components/Icons';
import Form from '@root/components/referrer/addReferrer.module';
import ReferedPatients from '@root/components/referrer/referedPatients.module';
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
} from '@root/store/reducers/referrer';
import { generateFullName, getPracticeId } from '@utils/methods';
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

export default function ReferrerTable() {
  const router = useRouter();
  const practiceId = getPracticeId();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };
  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };
  const referrers = useAppSelector((state) => state.referrers.referrers);
  const [showModal, setShowModal] = useState(false);
  const userInfo = useAppSelector(selectRecords);
  const errorMessage = useAppSelector(selectError);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const successMessage = useAppSelector(selectSuccessMessage);
  const [referrerId, setReferrerId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const handleOpenDeleteModal = (Id: string): void => {
    setIsDeleteModalOpen(true);
    setReferrerId(Id);
  };
  const handleOpenListModal = (Id: string): void => {
    setIsListModalOpen(true);
    setReferrerId(Id);
  };
  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setReferrerId(null);
  };
  const handleCloseListModal = (): void => {
    setIsListModalOpen(false);
    setReferrerId(null);
  };
  const onConfirmDelete = (): void => {
    const id = referrerId;
    if (practiceId && id) {
      try {
        const id = referrerId;
        dispatch(deleteRecordAsync({ practiceId, id }));
        setIsDeleteModalOpen(false);
        setReferrerId(null);
      } catch (error) {
        console.log(error);
      }
    }
    setReferrerId(null);
  };
  const ReferrerDeleteModal = () => {
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
        <ModalBody>Are you sure you want to delete this referrer?</ModalBody>
        <ModalFooter>
          <Button kind="primary" title="Delete" onClick={onConfirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    );
  };
  const ReferrerAddModal = () => {
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
          Add New Referrer
        </ModalHeader>
        <ModalBody>
          <Form onClose={handleCloseModal} />
        </ModalBody>
      </Modal>
    );
  };
  const ReferedListModal = () => {
    return (
      <Modal
        isOpen={isListModalOpen}
        onClose={handleCloseListModal}
        closeable
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        overrides={{
          Dialog: {
            style: () => ({
              width: '800px',
            }),
          },
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
          Referred Patients
        </ModalHeader>
        <ModalBody>
          <ReferedPatients />
        </ModalBody>
      </Modal>
    );
  };
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (userInfo && userInfo?.type !== UserType.ADMIN) {
      router.push('practices');
    }
  }, [userInfo, router]);

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId: practiceId }));
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
  return (
    <div className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Referrer</span>
        {showModal && <div className="text-green-700">{successMessage}</div>}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <Button
          kind="secondary"
          title="Add"
          onClick={handleOpenModal}
          startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
        />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="text-gray-50 w-full items-center  bg-gray-50 py-4 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex rounded-lg">
          <div className="font-bold text-white p-4 flex-1">Name</div>
          <div className="font-bold text-white p-4 flex-1">Type</div>
          <div className="font-bold text-white p-4 flex-1">Ref#</div>
          <div className="font-bold text-white p-4 flex-1">Email</div>
          <div className="font-bold text-white p-4 flex-1">Action</div>
        </div>
        {referrers.map((data) => (
          <React.Fragment key={data.id}>
            <div className="flex">
              <div
                className="text-blue-600 underline decoration-solid cursor-pointer bg-gray-50 pt-2 px-4 flex-1"
                onClick={() => data.id && handleOpenListModal(data.id)}
              >
                {data ? generateFullName(data.firstName, data.lastName) : null}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                {data?.referrerType}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                Ref#
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                {data?.email}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex-1">
                <div
                  onClick={() => data.id && handleOpenDeleteModal(data.id)}
                  className="cursor-pointer"
                >
                  <DeleteIcon className="mt-2"></DeleteIcon>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <ReferrerAddModal />
      <ReferrerDeleteModal />
      <ReferedListModal />
    </div>
  );
}
