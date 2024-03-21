'use client';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
// import { selectError, selectSuccessMessage } from '@root/store/reducers/media';
import { addRecordAsync, fetchListings } from '@root/store/reducers/practices';
import { Modal, ModalBody, ModalHeader, ROLE, SIZE } from 'baseui/modal';
import React, { useEffect, useState } from 'react';
import { AddIcon } from '../Icons';
import { PracticeCreateInterface } from './types';

export default function PracticePage({ onClose }) {
  const dispatch = useAppDispatch();
  const practices = useAppSelector((state) => state.practices.practices);
  // const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  // const successMessage = useAppSelector(selectSuccessMessage);
  // const errorMessage = useAppSelector(selectError);
  // const [showModal, setShowModal] = useState(false);
  // const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [name, setName] = useState('');
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminContactNumber, setAdminContactNumber] = useState('');
  const [physicianEmail, setPhysicianEmail] = useState('');
  const [physicianContactNumber, setPhysicianContactNumber] = useState('');
  const [status, setStatus] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    dispatch(fetchListings()); // Fetch listings from PostgreSQL database
  }, [dispatch]);

  const handleOpenSecondModal = (): void => {
    setIsSecondModalOpen(true);
    // setIsFirstModalOpen(false);
  };

  // const handleCloseSecondModal = (): void => {
  //   setIsSecondModalOpen(false);
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: PracticeCreateInterface = {
      name,
      adminFirstName,
      adminLastName,
      adminEmail,
      adminContactNumber,
      physicianEmail,
      physicianContactNumber,
      status,
      code,
    };
    try {
      dispatch(addRecordAsync(data));
      setName('');
      setAdminFirstName('');
      setAdminLastName('');
      setAdminEmail('');
      setAdminContactNumber('');
      setPhysicianEmail('');
      setPhysicianContactNumber('');
      setStatus('');
      setCode('');
      onClose(); // Close the modal after form submission
    } catch (error) {
      onClose();
    }
  };

  const AddPracticeForm = () => {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="space-y-4">
                <label htmlFor="title" className="text-black text-sm">
                  Practice Code
                </label>
                <TextInput
                  name="code"
                  value={code}
                  onChange={(value) => {
                    setCode(value);
                  }}
                  required
                />
                <div className="space-y-4"></div>
              </div>
              <div className="space-y-4">
                <label htmlFor="title" className="text-black text-sm">
                  Practice Name
                </label>
                <TextInput
                  name="practiceName"
                  value={name}
                  onChange={(value) => {
                    setName(value);
                  }}
                  required
                />
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="space-y-4">
                <label htmlFor="title" className="text-black text-sm">
                  First Name
                </label>
                <TextInput
                  name="adminFirstName"
                  value={adminFirstName}
                  onChange={(value) => {
                    setAdminFirstName(value);
                  }}
                  required
                />
              </div>
              <div className="space-y-4">
                <label htmlFor="title" className="text-black text-sm">
                  Last Name
                </label>
                <TextInput
                  name="adminLastName"
                  value={adminLastName}
                  onChange={(value) => {
                    setAdminLastName(value);
                  }}
                  required
                />
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="space-y-4">
                <label htmlFor="title" className="text-black text-sm">
                  Admin Email
                </label>
                <TextInput
                  name="adminEmail"
                  value={adminEmail}
                  onChange={(value) => {
                    setAdminEmail(value);
                  }}
                  required
                />
              </div>
              <div className="space-y-4">
                <label htmlFor="title" className="text-black text-sm">
                  Admin Contact No.
                </label>
                <TextInput
                  name="adminContactNumber"
                  value={adminContactNumber}
                  onChange={(value) => {
                    setAdminContactNumber(value);
                  }}
                  required
                />
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="space-y-4">
                <label htmlFor="title" className="text-black text-sm">
                  Physician Email
                </label>
                <TextInput
                  name="physicianEmail"
                  value={physicianEmail}
                  onChange={(value) => {
                    setPhysicianEmail(value);
                  }}
                  required
                />
              </div>
              <div className="space-y-4">
                <label htmlFor="title" className="text-black text-sm">
                  Physician Contact No.
                </label>
                <TextInput
                  name="physicianContactNumber"
                  value={physicianContactNumber}
                  onChange={(value) => {
                    setPhysicianContactNumber(value);
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <label htmlFor="title" className="text-black text-sm">
                Status
              </label>
              <TextInput
                name="status"
                value={status}
                onChange={(value) => {
                  setStatus(value);
                }}
                required
              />
            </div>
          </div>
        </form>
      </div>
    );
  };

  const FormModal = () => {
    return (
      <Modal
        isOpen={isSecondModalOpen}
        // onClose={handleCloseSecondModal}
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
          <AddPracticeForm />
          {/* <AddPracticeForm onClose={handleCloseSecondModal} /> */}
        </ModalBody>
      </Modal>
    );
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl">All Practices</span>
        {/* {showModal && <div style={{ color: 'green' }}>{successMessage}</div>}
        {showErrorMessage && (
          <div style={{ color: 'red' }}>
            Error occurred while adding record.
          </div>
        )} */}
        <Button
          kind="secondary"
          title="Add New"
          onClick={handleOpenSecondModal}
          startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
        />{' '}
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
}
