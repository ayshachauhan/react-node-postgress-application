import Button from '@root/components/Button';
import RequiredIndicator from '@root/components/RequiredIndicator';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/practiceHomes';
import { CreatePracticeHomeInterface } from '@root/store/requests/practiceHomes';
import { getPracticeId } from '@utils/index';
import React, { useState } from 'react';

const AddPracticeHome: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [practiceHome, setPracticeHome] = useState('');
  const practiceId = getPracticeId();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId) {
      const practiceHomePayload: CreatePracticeHomeInterface = {
        practiceId,
        name: practiceHome,
      };
      try {
        dispatch(addRecordAsync(practiceHomePayload));
        onClose();
      } catch (error) {
        onClose();
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-1 pt-4">
          <label htmlFor="firstName" className="text-black text-sm">
            <RequiredIndicator />
            &nbsp;Patient Home Location
          </label>
          <div>
            <div>
              <TextInput
                name="practiceHome"
                value={practiceHome}
                onChange={(value) => {
                  setPracticeHome(value);
                }}
                required
              />
            </div>
            <div className="text-right align-bottom pt-4">
              <Button
                kind="primary"
                title="Add New Practice Home"
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

export default AddPracticeHome;
