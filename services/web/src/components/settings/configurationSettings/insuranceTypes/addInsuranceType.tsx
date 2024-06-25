import { CreateInsuranceTypeInterface } from '@packages/entities';
import Button from '@root/components/Button';
import RequiredIndicator from '@root/components/RequiredIndicator';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/insuranceTypes';
import { getPracticeId } from '@utils/index';
import React, { useState } from 'react';

const AddInsuranceType: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [insuranceType, setInsuranceType] = useState('');
  const practiceId = getPracticeId();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInsuranceType = insuranceType.trim();
    if (practiceId && trimmedInsuranceType !== '') {
      const insuranceTypePayload: CreateInsuranceTypeInterface = {
        practiceId,
        name: trimmedInsuranceType,
      };
      try {
        dispatch(addRecordAsync(insuranceTypePayload));
        onClose();
      } catch (error) {
        onClose();
      }
    } else {
      setErrorMessage('Insurance type is required.');
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
        <div className="space-y-1 pt-4">
          <label htmlFor="firstName" className="text-black text-sm">
            <RequiredIndicator />
            &nbsp;Insurance Type
          </label>
          <div>
            <div>
              <TextInput
                name="insuranceType"
                value={insuranceType}
                onChange={(value) => {
                  setInsuranceType(value);
                  setErrorMessage('');
                }}
                required
              />
            </div>
            <div className="text-right align-bottom pt-4">
              <Button
                kind="primary"
                title="Add New Insurance Type"
                type="submit"
                width={189}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddInsuranceType;
