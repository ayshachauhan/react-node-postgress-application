'use client';
import Button from '@root/components/Button';
import Dropdown from '@root/components/Dropdown';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { updateRecordAsync } from '@root/store/reducers/practices';
import { PracticesEditInterface } from '@store/requests/practices';
import React, { useState } from 'react';

const PracticeEditModule: React.FC<{
  onClose: () => void;
  initialValues: PracticesEditInterface;
}> = ({ onClose, initialValues }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(initialValues.name);
  const [status, setStatus] = useState(initialValues.status);
  const [code, setCode] = useState(initialValues.code);

  const selectedStatusColumn = (
    <TextInput
      name="status"
      value={status}
      onChange={(value) => {
        setStatus(value);
      }}
      required
    />
  );

  const handleStatusDropdown = (value: string) => {
    setStatus(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: PracticesEditInterface = {
      id: initialValues.id,
      name,
      status,
      code,
    };
    try {
      dispatch(updateRecordAsync(data));
      setName('');
      setStatus('');
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
            <div className="">
              <label htmlFor="code" className="text-black text-sm">
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
            </div>
            <div className="">
              <label htmlFor="name" className="text-black text-sm">
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
            <div className="flex flex-col">
              <label htmlFor="status" className="text-black text-sm">
                Status
              </label>
              <div>
                <Dropdown position="bottom" trigger={selectedStatusColumn}>
                  <Dropdown.Item
                    id="active"
                    onClick={() => handleStatusDropdown('Active')}
                  >
                    Active
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="inactive"
                    onClick={() => handleStatusDropdown('Inactive')}
                  >
                    Inactive
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="pending"
                    onClick={() => handleStatusDropdown('Pending')}
                  >
                    Pending
                  </Dropdown.Item>
                </Dropdown>
              </div>
            </div>
            <div className="">
              <label htmlFor="status" className="text-black text-sm">
                Practice Photo
              </label>
              <TextInput
                name="practicePhoto"
                value=""
                onChange={(value) => {
                  setStatus(value);
                }}
              />
            </div>
          </div>
          <div className="text-right text-base pt-4">
            <Button kind="primary" title="Edit practice" width={189} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PracticeEditModule;
