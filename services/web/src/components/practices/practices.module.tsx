'use client';
import Button from '@root/components/Button';
import Dropdown from '@root/components/Dropdown';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/practices';
import { PracticeCreateInterface } from '@store/requests/practices';
import React, { useState } from 'react';

const PracticePage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminContactNumber, setAdminContactNumber] = useState('');
  const [status, setStatus] = useState('');
  const [code, setCode] = useState('');

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

    const data: PracticeCreateInterface = {
      name,
      adminFirstName,
      adminLastName,
      adminEmail,
      adminContactNumber,
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
            <div className="">
              <label
                htmlFor="adminContactNumber"
                className="text-black text-sm"
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
            <Button kind="primary" title="Add new practice" width={189} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PracticePage;
