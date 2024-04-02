import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { UserStatus } from '@root/enums/status.enum';
import { UserType } from '@root/enums/userType.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectPractice } from '@root/store/reducers/auth';
import { updateRecordAsync } from '@root/store/reducers/users';
import { EditUser } from '@root/store/requests/users';
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
  const userTypeOptions = Object.keys(UserType).map((key) => ({
    label: UserType[key as keyof typeof UserType],
    id: key,
  }));
  const userStatusOptions = Object.keys(UserStatus).map((key) => ({
    label: UserStatus[key as keyof typeof UserStatus],
    id: key,
  }));
  const dispatch = useAppDispatch();
  const practiceId = useAppSelector(selectPractice); // Select user practice id
  const userInfo = useAppSelector((state) =>
    data.id ? state.users.users.find(({ id }) => id === data.id) : undefined,
  );
  const userId = data.id;

  const [updatedUserInfo, setUserInfo] = useState<Partial<EditUser>>({});

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
        userName: updatedUserInfo.userName ?? '',
        firstName: updatedUserInfo.firstName ?? '',
        lastName: updatedUserInfo.lastName ?? '',
        contactNumber: updatedUserInfo.contactNumber ?? '',
        fullName: updatedUserInfo.fullName ?? '',
        email: updatedUserInfo.email ?? '',
        url: updatedUserInfo.url ?? '',
        status: updatedUserInfo.status ?? UserStatus.INACTIVE,
        type: updatedUserInfo.type ?? UserType.EMPLOYEE,
        practiceId: practiceId,
        id: userId,
      };
      if ('password' in userPayloadData) {
        delete userPayloadData.password;
      }
      try {
        dispatch(updateRecordAsync(userPayloadData));
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
              <label htmlFor="userName" className="text-black text-sm">
                Username
              </label>
              <TextInput
                name="userName"
                value={updatedUserInfo?.userName || ''}
                onChange={(value) => {
                  setUserInfo({ ...updatedUserInfo, userName: value });
                }}
                disabled={true}
              />
              <div className="space-y-2"></div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-black text-sm">
                Email
              </label>
              <TextInput
                name="email"
                value={updatedUserInfo?.email || ''}
                onChange={(value) => {
                  setUserInfo({ ...updatedUserInfo, email: value });
                }}
                required
              />
              <div className="space-y-2"></div>
            </div>
          </div>
          <div className="flex flex-row justify-between pt-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-black text-sm">
                First Name
              </label>
              <TextInput
                name="firstName"
                value={updatedUserInfo?.firstName || ''}
                onChange={(value) => {
                  setUserInfo({ ...updatedUserInfo, firstName: value });
                }}
                required
              />
              <div className="space-y-2"></div>
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-black text-sm">
                Last Name
              </label>
              <TextInput
                name="lastName"
                value={updatedUserInfo?.lastName || ''}
                onChange={(value) => {
                  setUserInfo({ ...updatedUserInfo, lastName: value });
                }}
                required
              />
              <div className="space-y-2"></div>
            </div>
          </div>
          <div className="flex flex-row justify-between pt-4">
            <div className="space-y-2">
              <label htmlFor="contactNumber" className="text-black text-sm">
                Contact No.
              </label>
              <TextInput
                name="contactNumber"
                value={updatedUserInfo?.contactNumber || ''}
                onChange={(value) => {
                  setUserInfo({ ...updatedUserInfo, contactNumber: value });
                }}
                required
              />
              <div className="space-y-2"></div>
            </div>
            <div className="space-y-2">
              <label htmlFor="url" className="text-black text-sm">
                User URL
              </label>
              <TextInput
                name="url"
                value={updatedUserInfo?.url || ''}
                onChange={(value) => {
                  setUserInfo({ ...updatedUserInfo, url: value });
                }}
                required
              />
              <div className="space-y-2"></div>
            </div>
          </div>
          <div className="flex flex-row gap-6 pt-4">
            <div className="w-1/2 space-y-2">
              <label htmlFor="type" className="text-black text-sm">
                Designation
              </label>
              <Select
                options={userTypeOptions}
                onChange={handleTypeChange}
                overrides={{
                  ControlContainer: {
                    style: {
                      backgroundColor: 'rgba(250, 250, 250, 1)',
                      border: 'none',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow CSS here
                    },
                  },
                  ClearIcon: {
                    component: () => null,
                  },
                }}
                value={
                  updatedUserInfo?.type
                    ? [
                        {
                          label: updatedUserInfo.type,
                          id: updatedUserInfo.type,
                        },
                      ]
                    : []
                }
              />
              <div className="space-y-2"></div>
            </div>
            <div className="w-1/2 space-y-2">
              <label htmlFor="status" className="text-black text-sm">
                Status
              </label>
              <Select
                options={userStatusOptions}
                onChange={handleStatusChange}
                overrides={{
                  ControlContainer: {
                    style: {
                      backgroundColor: 'rgba(250, 250, 250, 1)',
                      border: 'none',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow CSS here
                    },
                  },
                  ClearIcon: {
                    component: () => null,
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
              <div className="space-y-2"></div>
            </div>
          </div>
        </div>
        <div className="text-right text-base pt-4">
          <Button kind="primary" title="Update" width={189} />
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
