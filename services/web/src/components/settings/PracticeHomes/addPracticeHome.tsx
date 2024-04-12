import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectPractice } from '@root/store/reducers/auth';
import { addRecordAsync } from '@root/store/reducers/practiceHomes';
import { CreatePracticeHomeInterface } from '@root/store/requests/practiceHomes';
import React, { useState } from 'react';

const AddPracticeHome: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [practiceHome, setPracticeHome] = useState('');
  const practiceId = useAppSelector(selectPractice);

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
        <div className="space-y-2 pt-4">
          <label htmlFor="firstName" className="text-black text-sm">
            Practice Home
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
                title="Add new practice home"
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
