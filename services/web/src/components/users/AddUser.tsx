import {
  UserDesignation,
  UserStatus,
  UserType,
} from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchListings as fetchPermissions } from '@root/store/reducers/userPermissions';
import { addRecordAsync } from '@root/store/reducers/users';
import { AddUserDto } from '@root/store/requests/users/types';
import { generateFullName, getPracticeId } from '@utils/index';
import { Checkbox } from 'baseui/checkbox';
import { FileUploader } from 'baseui/file-uploader';
import { Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';
import RequiredIndicator from '../RequiredIndicator';
const AddUserPage: React.FC<{
  onClose: () => void;
  withLoader: (func: () => Promise<void>) => Promise<void>;
}> = ({ onClose, withLoader }) => {
  const userTypeOptions = Object.keys(UserType).map((key) => ({
    label: UserType[key as keyof typeof UserType],
    id: key,
  }));

  const userDesignations = Object.keys(UserDesignation).map((key) => ({
    label: UserDesignation[key as keyof typeof UserDesignation],
    id: key,
  }));

  const dispatch = useAppDispatch();
  const permissions = useAppSelector((state) =>
    Object.values(state.permissions.entities),
  );
  const [checkboxes, setCheckboxes] = useState(() =>
    Array(permissions.length).fill(false),
  );
  const [userName, setUserName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [contactNumber, setcontactNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<UserType>(UserType.ADMIN);
  const [userImg, setUserImg] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const practiceId = getPracticeId();

  const handleTypeChange = ({ value }) => {
    setType(value[0] ? value[0].label : null);
  };

  const handleCheckboxChange = (index: number) => {
    const updatedCheckboxes = [...checkboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index];
    setCheckboxes(updatedCheckboxes);
  };

  const getSelectedCheckboxIds = (): string[] => {
    return permissions.reduce((selectedIds: string[], permission, index) => {
      if (checkboxes[index]) {
        selectedIds.push(permission.id);
      }
      return selectedIds;
    }, []);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedUserPermissions = getSelectedCheckboxIds();
    const fullName = generateFullName(firstName, lastName);
    if (practiceId) {
      const userPayloadData: AddUserDto = {
        practiceId,
        email,
        userName,
        designation,
        firstName,
        lastName,
        fullName,
        url,
        type,
        status: UserStatus.ACTIVE,
        contactNumber,
        permissionIds: selectedUserPermissions,
        file: userImg,
      };
      try {
        await withLoader(async () => {
          await dispatch(addRecordAsync(userPayloadData));
        });
        onClose();
      } catch (error) {
        onClose();
      }
    }
  };

  useEffect(() => {
    dispatch(fetchPermissions(undefined));
  }, []);

  return (
    <div>
      {errorMessage && (
        <div className="flex justify-center text-red-500 mt-2">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between gap-7 pt-4">
            <div className="w-1/2 space-y-2">
              <label
                htmlFor="userName"
                className="text-black text-sm font-normal"
              >
                <RequiredIndicator />
                &nbsp;User Name
              </label>
              <TextInput
                name="userName"
                value={userName}
                onChange={(value) => {
                  setUserName(value);
                }}
                required
              />
            </div>
            <div className="w-1/2 space-y-2">
              <label htmlFor="email" className="text-black text-sm font-normal">
                <RequiredIndicator />
                &nbsp;Email
              </label>
              <TextInput
                name="email"
                value={email}
                onChange={(value) => {
                  setEmail(value);
                }}
                required
              />
            </div>
          </div>
          <div className="flex flex-row justify-between gap-7 pt-4">
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
                value={firstName}
                onChange={(value) => {
                  setFirstName(value);
                }}
                required
              />
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
                value={lastName}
                onChange={(value) => {
                  setLastName(value);
                }}
                required
              />
            </div>
          </div>
          <div className="flex flex-row justify-between gap-7 pt-4">
            <div className="w-1/2 space-y-2">
              <label
                htmlFor="contactNumber"
                className="text-black text-sm font-normal"
              >
                <RequiredIndicator />
                &nbsp;Contact No.
              </label>
              <TextInput
                name="contactNumber"
                value={contactNumber}
                onChange={(value) => {
                  setcontactNumber(value);
                }}
                required
              />
            </div>
            <div className="w-1/2 space-y-2">
              <label htmlFor="url" className="text-black text-sm font-normal">
                User URL
              </label>
              <TextInput
                name="url"
                value={url}
                onChange={(value) => {
                  setUrl(value);
                }}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between gap-7 pt-4">
            <div className="w-1/2 space-y-2">
              <label htmlFor="type" className="text-black text-sm font-normal">
                <RequiredIndicator />
                &nbsp;User Type
              </label>
              <Select
                options={userTypeOptions}
                onChange={handleTypeChange}
                value={type ? [{ label: type, id: type }] : []}
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
            <div className="w-1/2 space-y-2">
              <label htmlFor="type" className="text-black text-sm font-normal">
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
          <div className="flex flex-row justify-between gap-7 pt-4">
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
                            <p>{userImg?.name}</p>
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
              <div className="grid grid-cols-2 gap-1">
                {permissions.map((label, index) => (
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
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right text-base pt-4">
          <Button kind="primary" title="Add New User" width={189} />
        </div>
      </form>
    </div>
  );
};

export default AddUserPage;
