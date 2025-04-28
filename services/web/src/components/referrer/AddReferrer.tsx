'use client';
import { IReferrer, ReferrerType } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import { useAppDispatch } from '@root/store';
import {
  addRecordAsync,
  fetchReferrerByEmail,
} from '@root/store/reducers/referrer';
import { getPracticeId } from '@utils/index';
import { Select } from 'baseui/select';
import { useState } from 'react';
import RequiredIndicator from '../RequiredIndicator';
import TextInput from '../TextInput/TextInput';

const AddReferrerForm: React.FC<{
  onClose: () => void;
  withLoader: (func: () => Promise<void>) => Promise<void>;
}> = ({ onClose, withLoader }) => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const referrerTypeOptions = Object.keys(ReferrerType).map((key) => ({
    label: ReferrerType[key as keyof typeof ReferrerType],
    id: key,
  }));
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [referrerType, setReferrerType] = useState<ReferrerType>();
  const handlereferrerTypeChange = ({ value }) => {
    setReferrerType(value[0] ? value[0].label : null);
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  type AddReferrerDto = Omit<IReferrer, 'dateCreated' | 'dateUpdated' | 'id'>;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailError) {
      setEmailError(emailError);
      return;
    }
    if (email && practiceId) {
      try {
        const emailCheckResult = (await dispatch(
          fetchReferrerByEmail({
            email: email,
            practiceId,
          }),
        )) as { payload: boolean };

        if (emailCheckResult.payload) {
          setEmailError('Referrer with this email already exists.');
          return;
        }
      } catch (error) {
        setEmailError('Error checking email');
        return;
      }
    }

    setEmailError('');
    if (practiceId) {
      const referrerPayloadData: AddReferrerDto = {
        practiceId,
        email,
        firstName,
        lastName,
        referrerType,
        verified: true,
        evals: [],
        surgeries: [],
        pcpEvals: [],
        pcpSurgeries: [],
      };
      try {
        await withLoader(async () => {
          await dispatch(addRecordAsync(referrerPayloadData));
        });
        onClose();
      } catch (error) {
        onClose();
      }
    }
  };

  return (
    <>
      <div className="border-gray-400">
        <form onSubmit={handleSubmit}>
          {emailError && (
            <div className="flex justify-center text-red-500 mt-2">
              {emailError}
            </div>
          )}
          <div className="pt-4">
            <div className="space-y-2">
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
                onChange={(value) => setFirstName(value)}
                required
              />
            </div>
          </div>
          <div className="pt-4">
            <div className="space-y-2">
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
                onChange={(value) => setLastName(value)}
                required
              />
            </div>
          </div>
          <div className="pt-4">
            <div className="space-y-2">
              <label
                htmlFor="referrerType"
                className="text-black text-sm font-normal"
              >
                &nbsp;Referrer Type
              </label>
              <Select
                options={referrerTypeOptions}
                backspaceClearsInputValue
                onChange={handlereferrerTypeChange}
                value={
                  referrerType
                    ? [{ label: referrerType, id: referrerType }]
                    : []
                }
                overrides={{
                  ControlContainer: {
                    style: {
                      backgroundColor: 'rgba(250, 250, 250, 1)',
                      border: 'none',
                      color: 'rgba(82, 82, 91, 1)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    },
                  },
                  ClearIcon: {
                    component: () => null,
                  },
                }}
              />
            </div>
          </div>
          <div className="pt-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-black text-sm font-normal">
                Email
              </label>
              <TextInput
                name="email"
                value={email}
                onChange={(value) => {
                  setEmail(value);
                  validateEmail(value);
                }}
              />
            </div>
          </div>
          <div className="text-right  mt-4">
            <Button kind="primary" title="Add New Referrer" />
          </div>
        </form>
      </div>
    </>
  );
};

export default AddReferrerForm;
