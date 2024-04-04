'use client';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { PracticeStatus } from '@root/enums/status.enum';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/practices';
import { PracticeCreateInterface } from '@store/requests/practices';
import { Select } from 'baseui/select';
import React, { useState } from 'react';

const PracticePage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const practiceStatusOptions = Object.keys(PracticeStatus).map((key) => ({
    label: PracticeStatus[key as keyof typeof PracticeStatus],
    id: key,
  }));
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminContactNumber, setAdminContactNumber] = useState('');
  const [physicianEmail, setPhysicianEmail] = useState('');
  const [physicianContactNumber, setPhysicianContactNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [status, setStatus] = useState('');
  const generateRandomCode = () => {
    const min = 100000; // Minimum value for a 6-digit code
    const max = 999999; // Maximum value for a 6-digit code
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const [code, setCode] = useState(generateRandomCode().toString());

  const handleStatusDropdown = ({ value }) => {
    setStatus(value[0] ? value[0].label : null);
  };

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
      photoUrl,
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
      setPhotoUrl('');
      setCode('');
      onClose();
    } catch (error) {
      onClose();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between pt-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-black text-sm font-normal">
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
            <div className="space-y-2">
              <label
                htmlFor="adminFirstName"
                className="text-black text-sm font-normal"
              >
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
          </div>
          <div className="flex flex-row justify-between pt-4">
            <div className="space-y-2">
              <label
                htmlFor="adminLastName"
                className="text-black text-sm font-normal"
              >
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
            <div className="space-y-2">
              <label
                htmlFor="adminEmail"
                className="text-black text-sm font-normal"
              >
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
          </div>
          <div className="flex flex-row justify-between pt-4">
            <div className="space-y-2">
              <label
                htmlFor="adminContactNumber"
                className="text-black text-sm font-normal"
              >
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
            <div className="space-y-2">
              <label
                htmlFor="physicianEmail"
                className="text-black text-sm font-normal"
              >
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
          </div>
          <div className="flex flex-row pt-4 gap-7">
            <div className="space-y-2">
              <label
                htmlFor="physicianContactNumber"
                className="text-black text-sm font-normal"
              >
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
            <div className="w-1/2 space-y-2">
              <label
                htmlFor="status"
                className="text-black text-sm font-normal"
              >
                Status
              </label>
              <Select
                options={practiceStatusOptions}
                onChange={handleStatusDropdown}
                value={status ? [{ label: status, id: status }] : []}
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
          <div className="flex flex-row justify-between pt-4">
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-black text-sm font-normal"
              >
                Practice Photo
              </label>
              <TextInput
                name="photoUrl"
                value={photoUrl}
                onChange={(value) => {
                  setPhotoUrl(value);
                }}
              />
            </div>
          </div>
          <div className="text-right text-base pt-4">
            <Button kind="primary" title="Add new practice" width={189} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PracticePage;
