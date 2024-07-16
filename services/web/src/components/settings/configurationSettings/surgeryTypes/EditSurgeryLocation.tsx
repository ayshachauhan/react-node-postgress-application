import { ISurgeryType } from '@packages/entities';
import { SurgeryType } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import RequiredIndicator from '@root/components/RequiredIndicator';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import { editRecordAsync } from '@root/store/reducers/surgeryTypes';
import { DEFAULT_SURGERYLOCATION_COLOR } from '@root/utils/constants';
import { getPracticeId } from '@utils/index';
import React, { useEffect, useState } from 'react';

interface Data {
  id: string;
}
interface ChildProps {
  data: Data;
  onClose: () => void;
}

const EditSurgeryLocation: React.FC<ChildProps> = ({ data, onClose }) => {
  const dispatch = useAppDispatch();
  const surgeryTypeId = data.id;
  const [updatedSurgeryTypeInfo, setSurgeryTypeInfo] = useState<
    Partial<ISurgeryType>
  >({});
  const surgeryTypeInfo = useAppSelector((state) =>
    data.id
      ? Object.values(state.surgeryTypes.entities).find(
          ({ id }: ISurgeryType) => id === data.id,
        )
      : undefined,
  );
  const [errorMessage, setErrorMessage] = useState('');
  const practiceId = getPracticeId();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSurgeryType = updatedSurgeryTypeInfo.name;
    if (practiceId && trimmedSurgeryType !== '' && surgeryTypeId) {
      const surgeryTypePayload: SurgeryType = {
        ...updatedSurgeryTypeInfo,
        practiceId,
        name: trimmedSurgeryType ?? '',
        color: updatedSurgeryTypeInfo.color ?? DEFAULT_SURGERYLOCATION_COLOR,
      };
      try {
        dispatch(editRecordAsync(surgeryTypePayload));
        onClose();
      } catch (error) {
        onClose();
      }
    } else {
      setErrorMessage('Surgery Location is required.');
    }
  };

  useEffect(() => {
    if (data.id && surgeryTypeInfo) {
      setSurgeryTypeInfo(surgeryTypeInfo);
    }
  }, [data.id, surgeryTypeInfo]);

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
                value={updatedSurgeryTypeInfo?.name || ''}
                onChange={(value) => {
                  setSurgeryTypeInfo({
                    ...updatedSurgeryTypeInfo,
                    name: value,
                  });
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
                  value={updatedSurgeryTypeInfo?.color || ''}
                  onChange={(e) => {
                    setSurgeryTypeInfo({
                      ...updatedSurgeryTypeInfo,
                      color: e.target.value,
                    });
                  }}
                  style={{
                    height: '30px',
                    width: '30px',
                    border: 'none',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
            <div className="text-right align-bottom mt-4">
              <Button kind="primary" title="Update" type="submit" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditSurgeryLocation;
