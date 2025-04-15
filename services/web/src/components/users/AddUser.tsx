import {
  UserDesignation,
  UserStatus,
  UserType,
} from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { ValidatedFileUploader } from '@root/components/shared/ValidatedFileUploader';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchListings as fetchPermissions } from '@root/store/reducers/userPermissions';
import {
  addRecordAsync,
  checkEmailExistence,
} from '@root/store/reducers/users';
import { AddUserDto } from '@root/store/requests/users/types';
import { allowedExtensions } from '@root/utils/constants';
import {
  cleanedPhoneNumber,
  generateFullName,
  getPracticeId,
} from '@utils/index';
import { Checkbox } from 'baseui/checkbox';
import { Select } from 'baseui/select';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
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
  const permissions =
    useAppSelector((state) => Object.values(state.permissions.entities)) || [];
  const [checkboxes, setCheckboxes] = useState(() =>
    Array(permissions.length).fill(false),
  );
  const [userName, setUserName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [contactNumber, setcontactNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [lastName, setLastName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<UserType>(UserType.ADMIN);
  const [userImg, setUserImg] = useState<File | null>(null);

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

  const handleUserNameChange = (value: string) => {
    setUserName(value);

    if (value.trim() === '') {
      setErrorMessage('Username cannot be empty');
    } else {
      setErrorMessage('');
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    validateEmail(value);

    if (value.trim() === '') {
      setErrorMessage('Email cannot be empty');
    } else {
      setErrorMessage('');
    }
  };

  const checkEmailExists = debounce(async (email: string) => {
    if (!email) return;
    setIsCheckingEmail(true);
    const encodedEmail = encodeURIComponent(email);
    try {
      const { exists } = await dispatch(
        checkEmailExistence({ email: encodedEmail }),
      ).unwrap();

      setEmailExists(exists);

      if (exists) {
        setEmailError('Email already exists');
      } else {
        setEmailError('');
      }
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setIsCheckingEmail(false);
    }
  }, 500);

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);

    if (value.trim() === '') {
      setErrorMessage('First name cannot be empty');
    } else {
      setErrorMessage('');
    }
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);

    if (value.trim() === '') {
      setErrorMessage('Last name cannot be empty');
    } else {
      setErrorMessage('');
    }
  };

  const handleContactNumberChange = (value: string) => {
    setcontactNumber(value);
    const fullPhoneNumber = countryCode + value;
    validatePhoneNumber(fullPhoneNumber);
  };

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
    const fullPhoneNumber = value + contactNumber;
    validatePhoneNumber(fullPhoneNumber);
  };

  const [isValidPhnNo, setIsValidPhnNo] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const validatePhoneNumber = (fullNumber: string) => {
    try {
      const parsedPhoneNumber = cleanedPhoneNumber(fullNumber);

      if (parsedPhoneNumber.isValid()) {
        setIsValidPhnNo(true);
        setErrorMessage('');
      } else {
        setIsValidPhnNo(false);
        setErrorMessage('Invalid phone number');
      }
    } catch (error) {
      setIsValidPhnNo(false);
      setErrorMessage('Invalid phone number');
    }
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Invalid email address');
      setEmailExists(false);
      return;
    }

    setEmailError('');
    checkEmailExists(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isCheckingEmail) {
      setEmailError('Checking email, please wait...');
      return;
    }

    if (emailError || emailExists) {
      if (!emailError && emailExists) {
        setEmailError('Email already exists');
      }
      return;
    }

    if (isValidPhnNo) {
      if (
        userName.trim() === '' ||
        email.trim() === '' ||
        firstName.trim() === '' ||
        lastName.trim() === '' ||
        contactNumber.trim() === '' ||
        countryCode.trim() === ''
      ) {
        return;
      }
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
          countryCode,
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
    } else {
      setErrorMessage('Invalid phone number');
    }
  };

  const phoneInputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (phoneInputRef.current) {
      const button = phoneInputRef.current.querySelector(
        '.react-international-phone-country-selector-button',
      );
      if (button) {
        const buttonElement = button as HTMLElement;
        buttonElement.style.borderTopRightRadius = '0';
        buttonElement.style.borderBottomRightRadius = '0';
        buttonElement.style.borderRight = '0';
        buttonElement.style.border = '0';
        buttonElement.style.backgroundColor = 'rgb(250, 250, 250)';
      }
    }
  }, []);

  useEffect(() => {
    dispatch(fetchPermissions(undefined));
  }, []);

  const acceptAttribute = allowedExtensions.join(', ');

  return (
    <div>
      {!isValidPhnNo && (
        <div className="flex justify-center text-red-500 mt-2">
          {errorMessage}
        </div>
      )}
      {errorMessage && isValidPhnNo && (
        <div className="flex justify-center text-red-500 mt-2">
          {errorMessage}
        </div>
      )}
      {emailError && (
        <div className="flex justify-center text-red-500 mt-2">
          {emailError}
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
                  handleUserNameChange(value);
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
                  handleEmailChange(value);
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
                  handleFirstNameChange(value);
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
                  handleLastNameChange(value);
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
              <div className="flex gap-3">
                <div ref={phoneInputRef}>
                  <PhoneInput
                    className="shadow-md"
                    defaultCountry="us"
                    value={countryCode}
                    onChange={(value) => {
                      handleCountryCodeChange(value);
                    }}
                    preferredCountries={['us', 'in']} // Set preferred countries to US and India
                    inputProps={{
                      disabled: true,
                      className: 'react-international-phone-input',
                      style: {
                        width: '60px',
                        borderTopRightRadius: '0',
                        borderBottomRightRadius: '0',
                        borderRight: '0',
                        border: '0',
                        backgroundColor: 'rgb(250, 250, 250)',
                      },
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <TextInput
                    name="contactNumber"
                    value={contactNumber}
                    onChange={(value) => {
                      handleContactNumberChange(value);
                    }}
                    required
                  />
                </div>
              </div>
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
              <ValidatedFileUploader
                accept={acceptAttribute}
                onSuccess={(file) => {
                  setUserImg(file);
                  setErrorMessage('');
                }}
                onError={setErrorMessage}
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
        <div className="text-right pt-4">
          <Button kind="primary" title="Add New User" />
        </div>
      </form>
    </div>
  );
};

export default AddUserPage;
