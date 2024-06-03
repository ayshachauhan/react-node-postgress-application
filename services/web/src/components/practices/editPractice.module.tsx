'use client';
import { PracticeStatus } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { updateRecordAsync } from '@root/store/reducers/practices';
import { PracticesEditInterface } from '@store/requests/practices';
import { FileUploader } from 'baseui/file-uploader';
import { Select } from 'baseui/select';
import React, { useState } from 'react';

const PracticeEditModule: React.FC<{
  onClose: () => void;
  initialValues: PracticesEditInterface;
}> = ({ onClose, initialValues }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(initialValues.name);
  const [status, setStatus] = useState(initialValues.status);
  const practiceStatusOptions = Object.keys(PracticeStatus).map((key) => ({
    label: PracticeStatus[key as keyof typeof PracticeStatus],
    id: key,
  }));
  const [practiceImg, setPracticeImg] = useState<File | null>(null);

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
    };
    try {
      dispatch(updateRecordAsync(data));
      setName('');
      setStatus('');
      onClose();
    } catch (error) {
      onClose();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <div className="flex flex-row gap-7 pt-4">
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
            <div className="flex flex-col space-y-2 w-1/2">
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
              <label htmlFor="imgUrl" className="text-black text-sm">
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
            <Button kind="primary" title="Update Practice" width={189} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PracticeEditModule;
