'use client';
import { PracticeStatus } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { ValidatedFileUploader } from '@root/components/shared/ValidatedFileUploader';
import { useAppDispatch } from '@root/store';
import { updateRecordAsync } from '@root/store/reducers/practices';
import { cleanedPhoneNumber } from '@root/utils';
import { allowedExtensions } from '@root/utils/constants';
import { PracticesEditInterface } from '@store/requests/practices';
import { Select } from 'baseui/select';
import React, { useEffect, useRef, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

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
  const [adminCountryCode, setAdminCountryCode] = useState(
    initialValues.adminCountryCode,
  );

  const [status, setStatus] = useState(initialValues.status);
  const practiceStatusOptions = Object.keys(PracticeStatus).map((key) => ({
    label: PracticeStatus[key as keyof typeof PracticeStatus],
    id: key,
  }));
  const [practiceImg, setPracticeImg] = useState<File | null>(null);

  const [formChanged, setFormChanged] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isValidPhnNo, setIsValidPhnNo] = useState(true);

  const handleCountryCodeChange = (value: string) => {
    setAdminCountryCode(value);
    const fullPhoneNumber = value + adminContactNumber;
    validatePhoneNumber(fullPhoneNumber);
  };

  const handlePhoneNumberChange = (value: string) => {
    setAdminContactNumber(value);
    const fullPhoneNumber = adminCountryCode + value;
    validatePhoneNumber(fullPhoneNumber);
  };

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

  const phoneInputRef = useRef<HTMLDivElement | null>(null);

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
        buttonElement.style.color = 'rgba(82, 82, 91, 1)';
        buttonElement.style.fontSize = '0.75rem';
      }
    }
  }, []);

  useEffect(() => {
    const fullPhoneNumber = adminCountryCode + adminContactNumber;

    const parsedPhoneNumber = cleanedPhoneNumber(fullPhoneNumber);
    if (parsedPhoneNumber.isValid()) {
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid phone number');
    }

    setFormChanged(
      name !== initialValues.name ||
        status !== initialValues.status ||
        adminContactNumber !== initialValues.adminContactNumber ||
        adminCountryCode !== initialValues.adminCountryCode ||
        adminLastName !== initialValues.adminLastName ||
        adminFirstName !== initialValues.adminFirstName ||
        status !== initialValues.status ||
        practiceImg !== null ||
        !parsedPhoneNumber.isValid(),
    );
  }, [
    name,
    status,
    practiceImg,
    adminContactNumber,
    adminCountryCode,
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
    if (isValidPhnNo) {
      const data: PracticesEditInterface = {
        id: initialValues.id,
        name,
        status,
        code: initialValues.code,
        practiceImg,
        adminFirstName,
        adminLastName,
        adminContactNumber,
        adminCountryCode,
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
    } else {
      setErrorMessage('Invalid phone number');
    }
  };

  const acceptAttribute = allowedExtensions.join(', ');

  return (
    <div>
      {errorMessage && isValidPhnNo && (
        <div className="flex justify-center text-red-500 mt-2 mb-2">
          {errorMessage}
        </div>
      )}
      {!isValidPhnNo && (
        <div className="flex justify-center text-red-500 mt-2 mb-2">
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
              <div className="flex gap-3 ">
                <div ref={phoneInputRef}>
                  <PhoneInput
                    className="shadow-md"
                    defaultCountry="us"
                    value={adminCountryCode}
                    onChange={(value) => {
                      handleCountryCodeChange(value);
                    }}
                    preferredCountries={['us', 'in']} // Set preferred countries to US and India
                    inputProps={{
                      disabled: true,
                      className: 'react-international-phone-input',
                      style: {
                        width: '40px',
                        borderTopRightRadius: '0',
                        borderBottomRightRadius: '0',
                        borderRight: '0',
                        border: '0',
                        backgroundColor: 'rgb(250, 250, 250)',
                        color: 'rgba(82, 82, 91, 1)',
                        fontSize: '0.75rem',
                      },
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <TextInput
                    name="adminContactNumber"
                    value={adminContactNumber}
                    onChange={(value) => {
                      handlePhoneNumberChange(value);
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="space-y-2">
              <label htmlFor="imgUrl" className="">
                Practice Photo
              </label>
              <ValidatedFileUploader
                accept={acceptAttribute}
                onSuccess={(file) => {
                  setPracticeImg(file);
                  setErrorMessage('');
                }}
                onError={setErrorMessage}
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
