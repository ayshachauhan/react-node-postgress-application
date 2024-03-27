'use client';
import { AddIcon } from '@components/Icons';
import AddPracticeForm from '@components/practices/practices.module';
import Button from '@root/components/Button';
import { UserType } from '@root/enums/userType.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectRecords } from '@root/store/reducers/auth';
import {
  clearErrorMessage,
  clearSuccessMessage,
  fetchListings,
  selectError,
  selectSuccessMessage,
} from '@root/store/reducers/practices';
import { Modal, ModalBody, ModalHeader, ROLE, SIZE } from 'baseui/modal';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Practice: React.FC = () => {
  const dispatch = useAppDispatch();
  const practices = useAppSelector((state) => state.practices.practices);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const successMessage = useAppSelector(selectSuccessMessage);
  const errorMessage = useAppSelector(selectError);
  const [showModal, setShowModal] = useState(false);
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

  const handleOpenSecondModal = (): void => {
    setIsSecondModalOpen(true);
  };

  const handleCloseSecondModal = (): void => {
    setIsSecondModalOpen(false);
  };

  const FormModal = () => {
    return (
      <Modal
        isOpen={isSecondModalOpen}
        onClose={handleCloseSecondModal}
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
          {/* <AddPracticeForm /> */}
          <AddPracticeForm onClose={handleCloseSecondModal} />
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
        <span className="text-xl font-bold">All Practices</span>
        {showModal && <div style={{ color: 'green' }}>{successMessage}</div>}
        {showErrorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <Button
          kind="secondary"
          title="Add New"
          onClick={handleOpenSecondModal}
          startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
        />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="text-gray-50 w-full  items-center  bg-gray-50 py-4 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 grid grid-cols-4 rounded-lg">
          <div className="font-bold text-white p-4">S. No.</div>
          <div className="font-bold text-white p-4">Practice</div>
          <div className="font-bold text-white p-4">Create Date</div>
          <div className="font-bold text-white p-4">Update Date</div>
          {practices.map((data, index) => (
            <React.Fragment key={data.id}>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {index + 1}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.name}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.dateCreated?.toString()}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.dateCreated?.toString()}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <FormModal />
    </div>
  );
};

export default Practice;
