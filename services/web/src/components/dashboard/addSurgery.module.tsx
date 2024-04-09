import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectPractice } from '@root/store/reducers/auth';
import { addRecordAsync } from '@root/store/reducers/surgery';
import { SurgeryInterface } from '@root/store/requests/surgery';
import React, { useState } from 'react';

const SurgeryPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const practiceId = useAppSelector(selectPractice); // Select success message from Redux store
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [urlEmbed, setUrlEmbed] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId) {
      const data: SurgeryInterface = { name, url, urlEmbed, practiceId };
      try {
        dispatch(addRecordAsync(data));
        setName('');
        setUrl('');
        setUrlEmbed('');
        onClose(); // Close the modal after form submission
      } catch (error) {
        onClose();
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-5">
          <div className="space-y-4 flex-grow">
            <label htmlFor="title" className="text-black text-sm">
              First Name
            </label>
            <TextInput
              name="name"
              value={name}
              onChange={(value) => {
                setName(value);
              }}
              required
            />
            <div className="space-y-4"></div>
          </div>
          <div className="space-y-4 flex-grow">
            <label htmlFor="url" className="text-black text-sm">
              Last Name
            </label>
            <TextInput
              name="url"
              value={url}
              onChange={(value) => {
                setUrl(value);
              }}
              required
            />
            <div className="space-y-4"></div>
          </div>
          <div className="space-y-4 flex-grow">
            <label htmlFor="urlEmbed" className="text-black text-sm">
              MRN
            </label>
            <TextInput
              name="urlEmbed"
              value={urlEmbed}
              onChange={(value) => {
                setUrlEmbed(value);
              }}
              required
            />
            <div className="space-y-4"></div>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="space-y-4 flex-grow">
            <label htmlFor="title" className="text-black text-sm">
              Email
            </label>
            <TextInput
              name="name"
              value={name}
              onChange={(value) => {
                setName(value);
              }}
              required
            />
            <div className="space-y-4"></div>
          </div>
          <div className="space-y-4 flex-grow">
            <label htmlFor="url" className="text-black text-sm">
              Phone Number
            </label>
            <TextInput
              name="url"
              value={url}
              onChange={(value) => {
                setUrl(value);
              }}
              required
            />
            <div className="space-y-4"></div>
          </div>
          <div className="space-y-4 flex-grow">
            <label htmlFor="urlEmbed" className="text-black text-sm">
              No Waitlist
            </label>
            <TextInput
              name="urlEmbed"
              value={urlEmbed}
              onChange={(value) => {
                setUrlEmbed(value);
              }}
              required
            />
            <div className="space-y-4"></div>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="space-y-4 flex-grow">
            <label htmlFor="title" className="text-black text-sm">
              Referrer
            </label>
            <TextInput
              name="name"
              value={name}
              onChange={(value) => {
                setName(value);
              }}
              required
            />
            <div className="space-y-4"></div>
          </div>
          <div className="space-y-4 flex-grow">
            <label htmlFor="url" className="text-black text-sm">
              Home
            </label>
            <TextInput
              name="url"
              value={url}
              onChange={(value) => {
                setUrl(value);
              }}
              required
            />
            <div className="space-y-4"></div>
          </div>
          <div className="space-y-4 flex-grow">
            <label htmlFor="urlEmbed" className="text-black text-sm">
              PCP (Check box if same)
            </label>
            <TextInput
              name="urlEmbed"
              value={urlEmbed}
              onChange={(value) => {
                setUrlEmbed(value);
              }}
              required
            />
            <div className="space-y-4"></div>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="space-y-4 flex-grow">
            <label htmlFor="title" className="text-black text-sm">
              Title
            </label>
            <TextInput
              name="name"
              value={name}
              onChange={(value) => {
                setName(value);
              }}
              required
            />
            <div className="space-y-4"></div>
          </div>
          <div className="space-y-4 flex-grow">
            <label htmlFor="url" className="text-black text-sm">
              Insurance Type
            </label>
            <TextInput
              name="url"
              value={url}
              onChange={(value) => {
                setUrl(value);
              }}
              required
            />
            <div className="space-y-4"></div>
          </div>
          <div className="space-y-4 flex-grow">
            <label htmlFor="urlEmbed" className="text-black text-sm">
              Insurance Details
            </label>
            <TextInput
              name="urlEmbed"
              value={urlEmbed}
              onChange={(value) => {
                setUrlEmbed(value);
              }}
              required
            />
            <div className="space-y-4"></div>
          </div>
        </div>
        <div>
          <label htmlFor="urlEmbed" className="text-black text-sm">
            Notes
          </label>
          <TextInput
            name="urlEmbed"
            value={urlEmbed}
            onChange={(value) => {
              setUrlEmbed(value);
            }}
            required
          />
          <div className="space-y-4"></div>
        </div>
        <div className="text-right text-base">
          <Button kind="primary" title="Add new video" width={189} />
        </div>
      </form>
    </div>
  );
};

export default SurgeryPage;
