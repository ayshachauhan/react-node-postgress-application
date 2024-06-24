import { CreateWaitlist } from '@packages/entities';
import Button from '@root/components/Button';
import RequiredIndicator from '@root/components/RequiredIndicator';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/waitlist';
import { getPracticeId } from '@utils/index';
import React, { useState } from 'react';

const AddWaitlist: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [waitlist, setWaitlist] = useState('');
  const practiceId = getPracticeId();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId) {
      const waitlistPayload: CreateWaitlist = {
        practiceId,
        name: waitlist,
      };
      try {
        dispatch(addRecordAsync(waitlistPayload));
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
            &nbsp;Waitlist
          </label>
          <div>
            <div>
              <TextInput
                name="waitlist"
                value={waitlist}
                onChange={(value) => {
                  setWaitlist(value);
                }}
                required
              />
            </div>
            <div className="text-right align-bottom pt-4">
              <Button
                kind="primary"
                title="Add New Waitlist"
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

export default AddWaitlist;
