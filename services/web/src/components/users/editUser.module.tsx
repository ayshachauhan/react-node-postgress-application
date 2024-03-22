import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectPractice } from '@root/store/reducers/auth';
import { updateRecordAsync } from '@root/store/reducers/users';
import { User } from '@root/store/requests/users';
import { generateFullName } from '@utils/methods';
import { Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';
interface Data {
  id: string;
}
interface ChildProps {
  data: Data;
  onClose: () => void;
}
const EditUserPage: React.FC<ChildProps> = ({ data, onClose }) => {
  const dispatch = useAppDispatch();
  const practiceId = useAppSelector(selectPractice); // Select user practice id
  const userInfo = useAppSelector((state) =>
    data.id ? state.users.users.find(({ id }) => id === data.id) : undefined,
  );
  const userId = data.id;

  const [updatedUserInfo, setUserInfo] = useState<Partial<User>>({});

  const handleStatusChange = (params) => {
    const { label } = params.option;
    setUserInfo({ ...updatedUserInfo, status: label });
  };

  const handleTypeChange = (params) => {
    const { label } = params.option;
    setUserInfo({ ...updatedUserInfo, type: label });
  };

  useEffect(() => {
    if (data.id && userInfo) {
      setUserInfo(userInfo);
    }
  }, [data.id, userInfo]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updatedUserInfo.firstName && updatedUserInfo.lastName) {
      const fullName = generateFullName(
        updatedUserInfo.firstName,
        updatedUserInfo.lastName,
      );
      updatedUserInfo.fullName = fullName;
    }
    if (userId && practiceId) {
      const userPayloadData = {
        ...updatedUserInfo,
        practiceId: practiceId,
        id: userId,
      };
      try {
        dispatch(updateRecordAsync(userPayloadData));
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
            value={updatedUserInfo?.userName}
            onChange={(value) => {
              setUserInfo({ ...updatedUserInfo, userName: value });
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
            value={updatedUserInfo?.email}
            onChange={(value) => {
              setUserInfo({ ...updatedUserInfo, email: value });
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
            value={updatedUserInfo?.firstName}
            onChange={(value) => {
              setUserInfo({ ...updatedUserInfo, firstName: value });
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
            value={updatedUserInfo?.lastName}
            onChange={(value) => {
              setUserInfo({ ...updatedUserInfo, lastName: value });
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
            value={updatedUserInfo?.contactNumber}
            onChange={(value) => {
              setUserInfo({ ...updatedUserInfo, contactNumber: value });
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
            value={updatedUserInfo?.url}
            onChange={(value) => {
              setUserInfo({ ...updatedUserInfo, url: value });
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
            overrides={{
              ClearIcon: {
                component: () => null, // This replaces the clear icon with null, effectively removing it
              },
            }}
            value={
              updatedUserInfo?.type
                ? [{ label: updatedUserInfo.type, id: updatedUserInfo.type }]
                : []
            }
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
            overrides={{
              ClearIcon: {
                component: () => null, // This replaces the clear icon with null, effectively removing it
              },
            }}
            value={
              updatedUserInfo?.status
                ? [
                    {
                      label: updatedUserInfo.status,
                      id: updatedUserInfo.status === 'active' ? '1' : '2',
                    },
                  ]
                : []
            }
          />
          <div className="space-y-4"></div>
        </div>
        <div className="text-right text-base">
          <Button kind="primary" title="Update" width={189} />
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
