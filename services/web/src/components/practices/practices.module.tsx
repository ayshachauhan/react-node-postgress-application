'use client';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/practices';
import { PracticeCreateInterface } from '@store/requests/practices';
import { FileUploader } from 'baseui/file-uploader';
import React, { useState } from 'react';
import RequiredIndicator from '../RequiredIndicator';

const PracticePage: React.FC<{
  onClose: () => void;
  withLoader: (func: () => Promise<void>) => Promise<void>;
}> = ({ onClose, withLoader }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminContactNumber, setAdminContactNumber] = useState('');
  const [adminCountryCode, setAdminCountryCode] = useState('');
  const generateRandomCode = () => {
    const min = 100000; // Minimum value for a 6-digit code
    const max = 999999; // Maximum value for a 6-digit code
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const [code, setCode] = useState(generateRandomCode().toString());
  const [practiceImg, setPracticeImg] = useState<File | null>(null);

  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setErrorMessage('Practice Name cannot be empty.');
      return false;
    }
    if (!adminFirstName.trim()) {
      setErrorMessage('First Name cannot be empty.');
      return false;
    }
    if (!adminLastName.trim()) {
      setErrorMessage('Last Name cannot be empty.');
      return false;
    }

    if (!adminEmail.trim() || !/\S+@\S+\.\S+/.test(adminEmail)) {
      setErrorMessage('Invalid email address.');
      return false;
    }
    if (!adminContactNumber.trim() || !/^\d{10}$/.test(adminContactNumber)) {
      setErrorMessage('Invalid contact number. Must be 10 digits.');
      return false;
    }

    if (!adminCountryCode.trim() || !/^\d{10}$/.test(adminCountryCode)) {
      setErrorMessage('Invalid contact number. Must be 10 digits.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: PracticeCreateInterface = {
      name: name.trim(),
      adminFirstName: adminFirstName.trim(),
      adminLastName: adminLastName.trim(),
      adminEmail: adminEmail.trim(),
      adminContactNumber: adminContactNumber.trim(),
      adminCountryCode: adminCountryCode.trim(),
      code,
      practiceImg,
    };

    try {
      if (validateForm()) {
        await withLoader(async () => {
          await dispatch(addRecordAsync(data));
        });
        setName('');
        setAdminFirstName('');
        setAdminLastName('');
        setAdminEmail('');
        setAdminContactNumber('');
        setAdminCountryCode('');
        setCode('');
        setPracticeImg(null);
        onClose();
      }
    } catch (error) {
      onClose();
    }
  };

  return (
    <div>
      {errorMessage && (
        <div className="flex justify-center text-red-500 mt-2">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 flex-col">
          <div className="justify-between ">
            <div className="space-y-2">
              <label htmlFor="name" className=" ">
                <RequiredIndicator />
                &nbsp;Practice Name
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
          <div className="grid grid-cols-2 gap-4 justify-between">
            <div className="flex-1 space-y-2">
              <label htmlFor="adminFirstName" className="">
                <RequiredIndicator />
                &nbsp;First Name
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
            <div className="flex-1 space-y-2">
              <label htmlFor="adminLastName" className="">
                <RequiredIndicator />
                &nbsp;Last Name
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
          <div className="grid grid-cols-2 gap-4 justify-between">
            <div className="flex-1 space-y-2">
              <label htmlFor="adminEmail" className="">
                <RequiredIndicator />
                &nbsp;Admin Email
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
            <div className="flex-1 space-y-2">
              <label htmlFor="adminContactNumber" className=" ">
                <RequiredIndicator />
                &nbsp;Admin Contact No.
              </label>
              <TextInput
                name="adminCountryCode"
                value={adminCountryCode}
                onChange={(value) => {
                  setAdminCountryCode(value);
                }}
                required
                maxLength={14}
              />
              <TextInput
                name="adminContactNumber"
                value={adminContactNumber}
                onChange={(value) => {
                  setAdminContactNumber(value);
                }}
                required
                maxLength={14}
              />
            </div>
          </div>
          <div className="justify-between">
            <div className="space-y-2">
              <label htmlFor="adminEmail" className="">
                Practice Photo
              </label>
              <FileUploader
                errorMessage={''}
                onDrop={(acceptedFiles: File[]) => {
                  setPracticeImg(acceptedFiles[0]);
                }}
                onDropRejected={(file: File[]) => {
                  if (!file[0].type.startsWith('image'))
                    setErrorMessage('Only Image type Files are allowed.');
                }}
                accept="image/*"
                overrides={{
                  ContentMessage: {
                    component: () => (
                      <div>
                        {practiceImg ? (
                          <div>
                            <p>{practiceImg?.name}</p>
                          </div>
                        ) : (
                          <span>Drag and drop or click to upload</span>
                        )}
                      </div>
                    ),
                  },
                  FileDragAndDrop: {
                    style: {
                      marginBottom: '16px',
                      borderColor: '#22C55E',
                      color: '##F0FDF4',
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="text-right">
            <Button kind="primary" title="Add New Practice" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PracticePage;
