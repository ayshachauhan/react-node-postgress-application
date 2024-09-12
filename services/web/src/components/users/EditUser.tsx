import {
  IPermission,
  IUser,
  UserDesignation,
  UserStatus,
  UserType,
} from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useUserPermissions } from '@root/context/UserPermissionsContext';
import { useAppDispatch, useAppSelector } from '@root/store';
import { updateRecordAsync } from '@root/store/reducers/users';
import { SanitizedUser } from '@root/store/types';
import { generateFullName, getPracticeId } from '@utils/index';
import { Checkbox } from 'baseui/checkbox';
import { FileUploader } from 'baseui/file-uploader';
import { Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import RequiredIndicator from '../RequiredIndicator';
interface Data {
  id: string;
}
interface ChildProps {
  data: Data;
  onClose: () => void;
  withLoader: (func: () => Promise<void>) => Promise<void>;
}
interface SelectedItems {
  permissions: IPermission[];
  checkboxIds: string[];
}

const EditUserPage: React.FC<ChildProps> = ({ data, onClose, withLoader }) => {
  const userTypeOptions = Object.keys(UserType).map((key) => ({
    label: UserType[key as keyof typeof UserType],
    id: key,
  }));
  const userStatusOptions = Object.keys(UserStatus).map((key) => ({
    label: UserStatus[key as keyof typeof UserStatus],
    id: key,
  }));

  const userDesignations = Object.keys(UserDesignation).map((key) => ({
    label: UserDesignation[key as keyof typeof UserDesignation],
    id: key,
  }));

  const dispatch = useAppDispatch();
  const permissions =
    useAppSelector((state) => Object.values(state.permissions.entities)) || [];
  const [checkboxes, setCheckboxes] = useState(() =>
    Array(permissions.length).fill(false),
  );

  const [userImg, setUserImg] = useState<File | null>(null);
  const getSelectedItems = (): SelectedItems => {
    const selectedItems = permissions.reduce(
      (acc: SelectedItems, permission, index) => {
        if (checkboxes[index]) {
          acc.permissions.push(permission);
          acc.checkboxIds.push(permission.id);
        }
        return acc;
      },
      { permissions: [], checkboxIds: [] },
    );
    return selectedItems;
  };
  const practiceId = getPracticeId(); // Select user practice id
  const userInfo = useAppSelector((state) =>
    data.id
      ? Object.values(state.users.entities).find(
          ({ id }: SanitizedUser) => id === data.id,
        )
      : undefined,
  );
  const userId = data.id;

  const [updatedUserInfo, setUserInfo] = useState<Partial<IUser>>({});
  const loggedInUserInfo = useAppSelector((state) => state.auth.user);
  const loggedInUserId = loggedInUserInfo?.id;
  const isDisabled = loggedInUserId === userId;
  const [errorMessage, setErrorMessage] = useState('');
  const [permissionsUpdated, setPermissionsUpdated] = useState(false);
  const [designation, setDesignation] = useState('');

  useEffect(() => {
    if (updatedUserInfo?.permissions) {
      const updatedCheckboxes = permissions.map(
        (permission) =>
          updatedUserInfo.permissions?.some(
            (updatedPermission) => updatedPermission.id === permission.id,
          ) ?? false,
      );
      setCheckboxes(updatedCheckboxes);
    }
  }, [updatedUserInfo?.permissions]);

  const { updateUserPermissions } = useUserPermissions();

  const handleStatusChange = (params) => {
    const { label } = params.option;
    setUserInfo({ ...updatedUserInfo, status: label });
  };

  const handleTypeChange = (params) => {
    const { label } = params.option;
    setUserInfo({ ...updatedUserInfo, type: label });
  };

  const handleDesignationChange = ({ value }) => {
    setDesignation(value[0] ? value[0].label : null);
  };

  const handleDesignationBlur = ({ target }) => {
    if (target.value) {
      const newValue: string = target.value;
      setDesignation(newValue);
    }
  };

  const handleCheckboxChange = (index: number) => {
    const updatedCheckboxes = [...checkboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index];
    setCheckboxes(updatedCheckboxes);
    setPermissionsUpdated(true);
  };

  useEffect(() => {
    if (data.id && userInfo) {
      setUserInfo(userInfo);
      setDesignation(userInfo?.designation);
    }
  }, [data.id, userInfo]);
  const selectedItems = getSelectedItems();

  const handleInputChange = (fieldName: keyof IUser, value: string) => {
    setUserInfo((prevState) => ({
      ...prevState,
      [fieldName]: value.trim() === '' ? undefined : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedUserPermissions = selectedItems.checkboxIds;
    const newPermissions = selectedItems.permissions;
    let updatedPayloadData = { ...updatedUserInfo };
    if (updatedPayloadData.firstName && updatedPayloadData.lastName) {
      const fullName = generateFullName(
        updatedPayloadData.firstName,
        updatedPayloadData.lastName,
      );
      updatedPayloadData = { ...updatedPayloadData, fullName };
    }
    if (userId && practiceId) {
      const userPayloadData = {
        ...updatedUserInfo,
        userName: updatedUserInfo.userName ?? '',
        firstName: updatedUserInfo.firstName ?? '',
        lastName: updatedUserInfo.lastName ?? '',
        countryCode: updatedUserInfo.countryCode ?? '',
        contactNumber: updatedUserInfo.contactNumber ?? '',
        fullName: updatedPayloadData.fullName ?? '',
        email: updatedUserInfo.email ?? '',
        url: updatedUserInfo.url ?? '',
        designation: designation
          ? designation
          : updatedUserInfo.designation || '',
        status: updatedUserInfo.status ?? UserStatus.INACTIVE,
        type: updatedUserInfo.type ?? UserType.EMPLOYEE,
        practiceId: practiceId,
        id: userId,
        permissionIds: selectedUserPermissions,
        file: userImg,
        permissionsUpdated,
      };
      if ('password' in userPayloadData) {
        delete userPayloadData.password;
      }
      try {
        await withLoader(async () => {
          await dispatch(updateRecordAsync(userPayloadData));
          if (loggedInUserId === userId) {
            updateUserPermissions(newPermissions);
          }
        });
        onClose();
      } catch (error) {
        onClose();
      }
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
        <div className="flex flex-col">
          <div className="flex flex-row justify-between pt-4 gap-7">
            <div className="w-1/2 space-y-2">
              <label
                htmlFor="userName"
                className="text-black text-sm font-normal"
              >
                <RequiredIndicator />
                &nbsp;Username
              </label>
              <TextInput
                name="userName"
                value={updatedUserInfo?.userName || ''}
                onChange={(value) => handleInputChange('userName', value)}
                disabled={true}
              />
              <div className="w-1/2 space-y-2"></div>
            </div>
            <div className="w-1/2 space-y-2">
              <label htmlFor="email" className="text-black text-sm font-normal">
                <RequiredIndicator />
                &nbsp;Email
              </label>
              <TextInput
                name="email"
                value={updatedUserInfo?.email || ''}
                onChange={(value) => handleInputChange('email', value)}
                disabled={true}
              />
              <div className="w-1/2 space-y-2"></div>
            </div>
          </div>
          <div className="flex flex-row justify-between pt-4 gap-7">
            <div className="w-1/2 space-y-2">
              <label
                htmlFor="firstName"
                className="text-black text-sm font-normal"
              >
                <RequiredIndicator />
                &nbsp;First Name
              </label>
              <TextInput
                name="firstName"
                value={updatedUserInfo?.firstName || ''}
                onChange={(value) => handleInputChange('firstName', value)}
                required
              />
              <div className="w-1/2 space-y-2"></div>
            </div>
            <div className="w-1/2 space-y-2">
              <label
                htmlFor="lastName"
                className="text-black text-sm font-normal"
              >
                <RequiredIndicator />
                &nbsp;Last Name
              </label>
              <TextInput
                name="lastName"
                value={updatedUserInfo?.lastName || ''}
                onChange={(value) => handleInputChange('lastName', value)}
                required
              />
              <div className="w-1/2 space-y-2"></div>
            </div>
          </div>
          <div className="flex flex-row justify-between pt-4 gap-7">
            <div className="w-1/2 space-y-2">
              <label
                htmlFor="contactNumber"
                className="text-black text-sm font-normal"
              >
                <RequiredIndicator />
                &nbsp;Contact No.
              </label>
              <PhoneInput
                name="countryCode"
                value={updatedUserInfo?.countryCode || ''}
              />
              <TextInput
                name="contactNumber"
                value={updatedUserInfo?.contactNumber || ''}
                onChange={(value) => handleInputChange('contactNumber', value)}
                required
              />
              <div className="w-1/2 space-y-2"></div>
            </div>
            <div className="w-1/2 space-y-2">
              <label htmlFor="url" className="text-black text-sm font-normal">
                User URL
              </label>
              <TextInput
                name="url"
                value={updatedUserInfo?.url || ''}
                onChange={(value) => {
                  setUserInfo({ ...updatedUserInfo, url: value });
                }}
              />
              <div className="w-1/2 space-y-2"></div>
            </div>
          </div>
          <div className="flex flex-row gap-6 pt-4">
            <div className="w-1/2 space-y-2">
              <label htmlFor="type" className="text-black text-sm font-normal">
                <RequiredIndicator />
                &nbsp;User Type
              </label>
              <Select
                options={userTypeOptions}
                onChange={handleTypeChange}
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
              <div className="w-1/2 space-y-2"></div>
            </div>
            <div className="w-1/2 space-y-2">
              <label
                htmlFor="status"
                className="text-black text-sm font-normal"
              >
                Status
              </label>
              <Select
                options={userStatusOptions}
                onChange={handleStatusChange}
                disabled={isDisabled || false}
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
              <div className="w-1/2 space-y-2"></div>
            </div>
          </div>
          <div className="flex flex-row gap-6 pt-4">
            <div className="w-1/2 space-y-2">
              <label
                htmlFor="designation"
                className="text-black text-sm font-normal"
              >
                Designation
              </label>
              <Select
                options={userDesignations}
                onChange={handleDesignationChange}
                onBlur={handleDesignationBlur}
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
                value={
                  designation
                    ? [
                        {
                          id: String(designation),
                          label: String(String(designation)),
                        },
                      ]
                    : []
                }
              />
            </div>
          </div>
          <div className="flex flex-row gap-6 pt-4 gap-7">
            <div className="w-1/2 space-y-2">
              <label htmlFor="type" className="text-black text-sm font-normal">
                User Photo
              </label>
              <FileUploader
                errorMessage={''}
                onDrop={(acceptedFiles: File[]) => {
                  setUserImg(acceptedFiles[0]);
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
                        {userImg ? (
                          <div>
                            <p>{userImg.name}</p>
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
            <div className="w-1/2 space-y-2 flex flex-col">
              <label
                htmlFor="permissions"
                className="text-black text-sm font-normal"
              >
                Permissions
              </label>
              <div className="grid grid-cols-3 gap-1">
                {permissions && permissions.length
                  ? permissions.map((label, index) => (
                      <Checkbox
                        key={index}
                        checked={checkboxes[index]}
                        onChange={() => handleCheckboxChange(index)}
                        overrides={{
                          Checkmark: {
                            style: ({ $checked }) => ({
                              backgroundColor: $checked
                                ? 'rgba(34, 197, 94, 1)'
                                : 'white',
                              borderColor: $checked
                                ? 'rgba(34, 197, 94, 1)'
                                : 'rgba(113, 113, 122, 1)',
                              width: '15px',
                              height: '15px',
                              marginTop: '7px',
                              marginRight: '0px',
                              borderRadius: '2px',
                              borderWidth: '2px',
                            }),
                          },
                        }}
                      >
                        <label
                          htmlFor={`checkbox-${index}`}
                          className="text-black text-xs"
                        >
                          <span className="truncate">{label.name}</span>
                        </label>
                      </Checkbox>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right mt-4">
          <Button kind="primary" title="Update" />
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
