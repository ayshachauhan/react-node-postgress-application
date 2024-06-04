'use client';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/practices';
import { PracticeCreateInterface } from '@store/requests/practices';
import { FileUploader } from 'baseui/file-uploader';
import React, { useState } from 'react';

const PracticePage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminContactNumber, setAdminContactNumber] = useState('');
  const generateRandomCode = () => {
    const min = 100000; // Minimum value for a 6-digit code
    const max = 999999; // Maximum value for a 6-digit code
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const [code, setCode] = useState(generateRandomCode().toString());
  const [practiceImg, setPracticeImg] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: PracticeCreateInterface = {
      name,
      adminFirstName,
      adminLastName,
      adminEmail,
      adminContactNumber,
      code,
      practiceImg,
    };
    try {
      dispatch(addRecordAsync(data));
      setName('');
      setAdminFirstName('');
      setAdminLastName('');
      setAdminEmail('');
      setAdminContactNumber('');
      setCode('');
      setPracticeImg(null);
      onClose();
    } catch (error) {
      onClose();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <div className="justify-between pt-4">
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
          </div>
          <div className="flex flex-row justify-between pt-4">
            <div className="">
              <label htmlFor="adminFirstName" className="text-black text-sm">
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
            <div className="">
              <label htmlFor="adminLastName" className="text-black text-sm">
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
          <div className="flex flex-row justify-between pt-4">
            <div className="">
              <label htmlFor="adminEmail" className="text-black text-sm">
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
          </div>
          <div className="justify-between pt-4">
            <div className="">
              <label htmlFor="adminEmail" className="text-black text-sm">
                Practice Photo
              </label>
              <FileUploader
                errorMessage={''}
                onDrop={(acceptedFiles: File[]) => {
                  setPracticeImg(acceptedFiles[0]);
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
          <div className="text-right text-base pt-4">
            <Button kind="primary" title="Add New Practice" width={189} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PracticePage;
