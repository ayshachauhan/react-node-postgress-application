'use client';
import { useState } from 'react';
import BaseUIModal from '../BaseUiModal/BaseUiModal';
import { AddIcon } from '../Icons';
import TextInput from '../TextInput/TextInput';
// import { useAppDispatch, useAppSelector } from "@root/store";

export default function ReferrerHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const openModal = () => {
    setIsOpen(true);
  };

  const handleOnClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div className="flex justify-between  p-4">
        <div className="text-lg font-semibold">Referrer</div>
        <div
          className="flex items-center bg-purple-700 text-white rounded-md px-4 py-2"
          onClick={openModal}
        >
          <div className="mr-2">
            <AddIcon />
          </div>
          <div>ADD</div>
        </div>
      </div>
      <BaseUIModal
        isOpen={isOpen}
        onClose={handleOnClose}
        title="Add a Referrer"
        footerTerm="Add New Referrer"
      >
        <label htmlFor="firstName">First Name</label>
        <TextInput
          name="firstName"
          value={firstName}
          onChange={(value) => setFirstName(value)}
          required
        />
        <label htmlFor="lastName">Last Name</label>
        <TextInput
          name="lastName"
          value={lastName}
          onChange={(value) => setLastName(value)}
          required
        />
        <label htmlFor="email">Email</label>
        <TextInput
          name="email"
          value={email}
          onChange={(value) => setEmail(value)}
          required
        />
      </BaseUIModal>
    </>
  );
}
