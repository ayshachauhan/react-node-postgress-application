'use client';
import { PracticeStatus } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { updateRecordAsync } from '@root/store/reducers/practices';
import { PracticesEditInterface } from '@store/requests/practices';
import { FileUploader } from 'baseui/file-uploader';
import { Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';

const PracticeEditModule: React.FC<{
  onClose: () => void;
  initialValues: PracticesEditInterface;
  withLoader: (func: () => Promise<void>) => Promise<void>;
}> = ({ onClose, initialValues, withLoader }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(initialValues.name);
  const [adminFirstName, setAdminFirstName] = useState(
    initialValues.adminFirstName,
  );
  const [adminLastName, setAdminLastName] = useState(
    initialValues.adminLastName,
  );
  const [adminContactNumber, setAdminContactNumber] = useState(
    initialValues.adminContactNumber,
  );
  const [status, setStatus] = useState(initialValues.status);
  const practiceStatusOptions = Object.keys(PracticeStatus).map((key) => ({
    label: PracticeStatus[key as keyof typeof PracticeStatus],
    id: key,
  }));
  const [practiceImg, setPracticeImg] = useState<File | null>(null);

  const [formChanged, setFormChanged] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setErrorMessage('Practice Name cannot be empty.');
      return false;
    }
    if (!status.trim()) {
      setErrorMessage('Status cannot be empty.');
      return false;
    }

    if (practiceImg && !practiceImg.type.startsWith('image/')) {
      setErrorMessage('Only Image type Files are allowed.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  useEffect(() => {
    setFormChanged(
      name !== initialValues.name ||
        status !== initialValues.status ||
        adminContactNumber !== initialValues.adminContactNumber ||
        adminLastName !== initialValues.adminLastName ||
        adminFirstName !== initialValues.adminFirstName ||
        status !== initialValues.status ||
        practiceImg !== null,
    );
  }, [
    name,
    status,
    practiceImg,
    adminContactNumber,
    adminLastName,
    adminFirstName,
    initialValues,
  ]);

  const handleStatusDropdown = (params) => {
    const { label } = params.option;
    setStatus(label);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: PracticesEditInterface = {
      id: initialValues.id,
      name,
      status,
      code: initialValues.code,
      practiceImg,
      adminFirstName,
      adminLastName,
      adminContactNumber,
      adminId: initialValues.adminId,
    };
    try {
      if (validateForm()) {
        await withLoader(async () => {
          await dispatch(updateRecordAsync(data));
        });
        setName('');
        setStatus('');
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
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-1/2 space-y-2">
              <label htmlFor="name" className="">
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
            <div className="space-y-2 w-1/2">
              <label htmlFor="status" className="">
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
          <div className="flex gap-4">
            <div className="w-1/2 space-y-2">
              <label htmlFor="adminFirstName" className="">
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
            <div className="space-y-2 w-1/2">
              <label htmlFor="adminLastName" className="">
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
          <div className="w-full">
            <div className="space-y-2">
              <label htmlFor="adminContactNumber" className="">
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
          <div className="w-full">
            <div className="space-y-2">
              <label htmlFor="imgUrl" className="">
                Practice Photo
              </label>
              <FileUploader
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
            <Button
              kind="primary"
              title="Update Practice"
              disabled={!formChanged}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PracticeEditModule;
