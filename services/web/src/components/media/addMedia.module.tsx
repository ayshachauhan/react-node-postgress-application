import { SurgeryType } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/media';
import { IMediaDTO } from '@root/store/requests/media/types';
import { getPracticeId } from '@utils/index';
import { Select } from 'baseui/select';
import React, { useState } from 'react';

const MediaPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const surgeryTypeOptions = Object.keys(SurgeryType).map((key) => ({
    label: SurgeryType[key as keyof typeof SurgeryType],
    id: key,
  }));
  const practiceId = getPracticeId();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [urlEmbed, setUrlEmbed] = useState('');
  const [surgeryType, setSurgeryType] = useState<SurgeryType>();

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId && surgeryType) {
      const data: IMediaDTO = {
        name,
        url,
        urlEmbed,
        practiceId,
        surgeryType,
      };
      try {
        dispatch(addRecordAsync(data));
        setName('');
        setUrl('');
        setUrlEmbed('');
        setSurgeryType(undefined);
        onClose(); // Close the modal after form submission
      } catch (error) {
        onClose();
      }
    }
  };

  const handleSurgeryTypeChange = ({ value }) => {
    setSurgeryType(value[0] ? value[0].label : null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="title" className="text-black text-sm font-normal">
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
          <div className="space-y-2"></div>
        </div>
        <div className="space-y-2  pt-4">
          <label htmlFor="url" className="text-black text-sm font-normal">
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
          <div className="space-y-2"></div>
        </div>
        <div className="space-y-2  pt-4">
          <label htmlFor="urlEmbed" className="text-black text-sm font-normal">
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
          <div className="space-y-2"></div>
        </div>
        <div className="space-y-2 pt-4">
          <label htmlFor="urlEmbed" className="text-black text-sm font-normal">
            Surgery Type
          </label>
          <Select
            options={surgeryTypeOptions}
            onChange={handleSurgeryTypeChange}
            value={surgeryType ? [{ label: surgeryType, id: surgeryType }] : []}
            required
            overrides={{
              ControlContainer: {
                style: {
                  backgroundColor: 'rgba(250, 250, 250, 1)',
                  border: 'none',
                  color: 'rgba(82, 82, 91, 1)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                },
              },
              ClearIcon: {
                component: () => null,
              },
            }}
          />
          <div className="space-y-2"></div>
        </div>
        <div className="text-right text-base">
          <Button kind="primary" title="Add new video" width={189} />
        </div>
      </form>
    </div>
  );
};

export default MediaPage;
