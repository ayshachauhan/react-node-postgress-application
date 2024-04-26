import { UserType } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/users';
import { AddUser } from '@root/store/requests/users';
import { generateFullName, getPracticeId } from '@utils/index';
import { Select } from 'baseui/select';
import React, { useState } from 'react';

const AddUserPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const userTypeOptions = Object.keys(UserType).map((key) => ({
    label: UserType[key as keyof typeof UserType],
    id: key,
  }));
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [contactNumber, setcontactNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<UserType>(UserType.ADMIN);
  const practiceId = getPracticeId();

  const handleTypeChange = ({ value }) => {
    setType(value[0] ? value[0].label : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullName = generateFullName(firstName, lastName);
    if (practiceId) {
      const userPayloadData: AddUser = {
        practiceId,
        email,
        userName,
        firstName,
        lastName,
        fullName,
        url,
        type,
        contactNumber,
      };
      try {
        dispatch(addRecordAsync(userPayloadData));
        onClose();
      } catch (error) {
        onClose();
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between pt-4">
            <div className="space-y-2">
              <label
                htmlFor="userName"
                className="text-black text-sm font-normal"
              >
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
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-black text-sm font-normal">
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
            </div>
          </div>
          <div className="flex flex-row justify-between pt-4">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="text-black text-sm font-normal"
              >
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
            </div>
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="text-black text-sm font-normal"
              >
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
            </div>
          </div>
          <div className="flex flex-row justify-between pt-4">
            <div className="space-y-2">
              <label
                htmlFor="contactNumber"
                className="text-black text-sm font-normal"
              >
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
            </div>
            <div className="space-y-2">
              <label htmlFor="url" className="text-black text-sm font-normal">
                User URL
              </label>
              <TextInput
                name="url"
                value={url}
                onChange={(value) => {
                  setUrl(value);
                }}
              />
            </div>
          </div>
          <div className="flex flex-row gap-6 pt-4">
            <div className="w-1/2 space-y-2">
              <label htmlFor="type" className="text-black text-sm font-normal">
                Designation
              </label>
              <Select
                options={userTypeOptions}
                onChange={handleTypeChange}
                value={type ? [{ label: type, id: type }] : []}
                required
                overrides={{
                  ControlContainer: {
                    style: {
                      backgroundColor: 'rgba(250, 250, 250, 1)',
                      border: 'none',
                      color: 'rgba(82, 82, 91, 1)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow CSS here
                    },
                  },
                  ClearIcon: {
                    component: () => null,
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="text-right text-base pt-4">
          <Button kind="primary" title="Add new User" width={189} />
        </div>
      </form>
    </div>
  );
};

export default AddUserPage;
