import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { UserStatus } from '@root/enums/status.enum';
import { UserType } from '@root/enums/userType.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectPractice } from '@root/store/reducers/auth';
import { addRecordAsync } from '@root/store/reducers/users';
import { User } from '@root/store/requests/users';
import { generateFullName } from '@utils/methods';
import { Select } from 'baseui/select';
import React, { useState } from 'react';

const AddUserPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [contactNumber, setcontactNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<UserType>(UserType.ADMIN);
  const [status, setStatus] = useState<UserStatus>(UserStatus.ACTIVE);
  const practiceId = useAppSelector(selectPractice); // Select success message from Redux store

  const handleStatusChange = ({ value }) => {
    // Assuming only one option can be selected
    setStatus(value[0] ? value[0].label : null);
  };

  const handleTypeChange = ({ value }) => {
    setType(value[0] ? value[0].label : null);
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullName = generateFullName(firstName, lastName);
    if (practiceId) {
      const userPayloadData: Omit<User, 'userPractices' | 'id'> = {
        practiceId,
        email,
        userName,
        firstName,
        lastName,
        fullName,
        url,
        type,
        status,
        contactNumber,
      };
      try {
        dispatch(addRecordAsync(userPayloadData));
        onClose(); // Close the modal after form submission
      } catch (error) {
        onClose();
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <label htmlFor="userName" className="text-black text-sm">
            Username
          </label>
          <TextInput
            name="userName"
            value={userName}
            onChange={(value) => {
              setUserName(value);
            }}
            required
          />
          <div className="space-y-4"></div>
        </div>
        <div className="space-y-4">
          <label htmlFor="email" className="text-black text-sm">
            Email
          </label>
          <TextInput
            name="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
            }}
            required
          />
          <div className="space-y-4"></div>
        </div>
        <div className="space-y-4">
          <label htmlFor="firstName" className="text-black text-sm">
            First Name
          </label>
          <TextInput
            name="firstName"
            value={firstName}
            onChange={(value) => {
              setFirstName(value);
            }}
            required
          />
          <div className="space-y-4"></div>
        </div>
        <div className="space-y-4">
          <label htmlFor="lastName" className="text-black text-sm">
            Last Name
          </label>
          <TextInput
            name="lastName"
            value={lastName}
            onChange={(value) => {
              setLastName(value);
            }}
            required
          />
          <div className="space-y-4"></div>
        </div>
        <div className="space-y-4">
          <label htmlFor="contactNumber" className="text-black text-sm">
            Contact No.
          </label>
          <TextInput
            name="contactNumber"
            value={contactNumber}
            onChange={(value) => {
              setcontactNumber(value);
            }}
            required
          />
          <div className="space-y-4"></div>
        </div>
        <div className="space-y-4">
          <label htmlFor="url" className="text-black text-sm">
            User URL
          </label>
          <TextInput
            name="url"
            value={url}
            onChange={(value) => {
              setUrl(value);
            }}
            required
          />
          <div className="space-y-4"></div>
        </div>
        <div className="space-y-4">
          <label htmlFor="type" className="text-black text-sm">
            Designation
          </label>
          <Select
            options={[
              { label: 'employee', id: '1' },
              { label: 'doctor', id: '2' },
              { label: 'admin', id: '3' },
              { label: 'physician', id: '4' },
            ]}
            onChange={handleTypeChange}
            value={type ? [{ label: type, id: type }] : []} // Convert string to array format
            required
            overrides={{
              ClearIcon: {
                component: () => null, // This replaces the clear icon with null, effectively removing it
              },
            }}
          />
          <div className="space-y-4"></div>
        </div>
        <div className="space-y-4">
          <label htmlFor="status" className="text-black text-sm">
            Status
          </label>
          <Select
            options={[
              { label: 'active', id: '1' },
              { label: 'inactive', id: '2' },
              { label: 'pending', id: '3' },
            ]}
            onChange={handleStatusChange}
            value={status ? [{ label: status, id: status }] : []} // Convert string to array format
            required
            overrides={{
              ClearIcon: {
                component: () => null, // This replaces the clear icon with null, effectively removing it
              },
            }}
          />
          <div className="space-y-4"></div>
        </div>
        <div className="text-right text-base">
          <Button kind="primary" title="Add new User" width={189} />
        </div>
      </form>
    </div>
  );
};

export default AddUserPage;
