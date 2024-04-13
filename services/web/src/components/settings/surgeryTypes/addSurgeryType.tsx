import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/surgeryTypes';
import { createSurgeryTypeInterface } from '@root/store/requests/surgeryTypes';
import { getPracticeId } from '@utils/methods';
import React, { useState } from 'react';

const AddSurgeryType: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [surgeryType, setSurgeryType] = useState('');
  const practiceId = getPracticeId();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId) {
      const surgeryTypePayload: createSurgeryTypeInterface = {
        practiceId,
        name: surgeryType,
      };
      try {
        dispatch(addRecordAsync(surgeryTypePayload));
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
            Surgery Type
          </label>
          <div>
            <div>
              <TextInput
                name="surgeryType"
                value={surgeryType}
                onChange={(value) => {
                  setSurgeryType(value);
                }}
                required
              />
            </div>
            <div className="text-right align-bottom pt-4">
              <Button
                kind="primary"
                title="Add new Surgery Type"
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

export default AddSurgeryType;
