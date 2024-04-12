import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/insuranceTypes';
import { CreateInsuranceTypeInterface } from '@root/store/requests/insuranceTypes';
import { getPracticeId } from '@utils/methods';
import React, { useState } from 'react';

const AddInsuranceType: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [insuranceType, setInsuranceType] = useState('');
  const practiceId = getPracticeId();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId) {
      const insuranceTypePayload: CreateInsuranceTypeInterface = {
        practiceId,
        name: insuranceType,
      };
      try {
        dispatch(addRecordAsync(insuranceTypePayload));
        onClose();
      } catch (error) {
        onClose();
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-2 pt-4">
          <label htmlFor="firstName" className="text-black text-sm">
            Insurance Type
          </label>
          <div>
            <div>
              <TextInput
                name="insuranceType"
                value={insuranceType}
                onChange={(value) => {
                  setInsuranceType(value);
                }}
                required
              />
            </div>
            <div className="text-right align-bottom pt-4">
              <Button
                kind="primary"
                title="Add new insurance type"
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
