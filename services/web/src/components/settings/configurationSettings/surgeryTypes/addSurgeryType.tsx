import { SurgeryType } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import RequiredIndicator from '@root/components/RequiredIndicator';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/surgeryTypes';
import { DEFAULT_SURGERYLOCATION_COLOR } from '@root/utils/constants';
import { getPracticeId } from '@utils/index';
import React, { useState } from 'react';

const AddSurgeryType: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [surgeryType, setSurgeryType] = useState('');
  const [surgeryLocationColor, setSurgeryLocationColor] = useState<string>(
    DEFAULT_SURGERYLOCATION_COLOR,
  );
  const practiceId = getPracticeId();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSurgeryType = surgeryType.trim();
    if (practiceId && trimmedSurgeryType !== '') {
      const surgeryTypePayload: SurgeryType = {
        practiceId,
        name: trimmedSurgeryType,
        color: surgeryLocationColor ?? DEFAULT_SURGERYLOCATION_COLOR,
      };
      try {
        dispatch(addRecordAsync(surgeryTypePayload));
        onClose();
      } catch (error) {
        onClose();
      }
    } else {
      setErrorMessage('Surgery Location is required.');
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
            &nbsp;Surgery Location
          </label>
          <div>
            <div className="py-2">
              <TextInput
                name="surgeryType"
                value={surgeryType}
                onChange={(value) => {
                  setSurgeryType(value);
                  setErrorMessage('');
                }}
                required
              />
            </div>
            <div className="py-2">
              <label htmlFor="surgeryName" className="text-black text-sm">
                <RequiredIndicator />
                &nbsp;Surgery Location Color
              </label>
              <div className="d-block">
                <input
                  type="color"
                  required={true}
                  id="primary_color"
                  value={surgeryLocationColor}
                  onChange={(e) => setSurgeryLocationColor(e.target.value)}
                  style={{
                    height: '30px',
                    width: '30px',
                    border: 'none',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
            <div className="text-right align-bottom pt-4">
              <Button
                kind="primary"
                title="Add New Surgery Location"
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
