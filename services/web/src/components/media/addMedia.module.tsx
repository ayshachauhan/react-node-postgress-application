import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/media';
import { MediaInterface } from '@root/store/requests/media';
import { getPracticeId } from '@utils/methods';
import React, { useState } from 'react';

const MediaPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const practiceId = getPracticeId(); // Select success message from Redux store
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [urlEmbed, setUrlEmbed] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId) {
      const data: MediaInterface = { name, url, urlEmbed, practiceId };
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
        <div className="space-y-4">
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
        <div className="space-y-4">
          <label htmlFor="url" className="text-black text-sm">
            URL
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
        <div className="space-y-4">
          <label htmlFor="urlEmbed" className="text-black text-sm">
            URL Embed
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

export default MediaPage;
