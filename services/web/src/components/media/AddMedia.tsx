import { IMediaRequest } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/media';
import { fetchListings as fetchsurgeryConfigurations } from '@root/store/reducers/surgeryConfigurations';
import { getPracticeId } from '@utils/index';
import { Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';

const MediaPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const surgeryConfigurations = useAppSelector(
    (state) => state.surgeryConfigurations.entities,
  );
  const surgeryConfigurationOptions = Object.keys(surgeryConfigurations).map(
    (key) => ({
      label: surgeryConfigurations[key].name,
      id: surgeryConfigurations[key].id,
    }),
  );
  const practiceId = getPracticeId();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [urlEmbed, setUrlEmbed] = useState('');
  const [surgeryConfigurationId, setSurgeryConfigurationId] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId) {
      const data: IMediaRequest = {
        name,
        url,
        urlEmbed,
        practiceId,
        surgeryConfigurationId,
      };
      try {
        dispatch(addRecordAsync(data));
        setName('');
        setUrl('');
        setUrlEmbed('');
        setSurgeryConfigurationId('');
        onClose();
      } catch (error) {
        onClose();
      }
    }
  };

  const handleSurgeryConfigurationChange = ({ value }) => {
    setSurgeryConfigurationId(value[0] ? value[0].id : null);
  };

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchsurgeryConfigurations({ practiceId: practiceId }));
    }
  }, [practiceId, dispatch]);

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
            Surgery
          </label>
          <Select
            options={surgeryConfigurationOptions}
            onChange={handleSurgeryConfigurationChange}
            value={
              surgeryConfigurationId
                ? [
                    {
                      label: surgeryConfigurationId,
                      id: surgeryConfigurationId,
                    },
                  ]
                : []
            }
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
        <div className="text-right text-base pt-4">
          <Button kind="primary" title="Add new video" width={189} />
        </div>
      </form>
    </div>
  );
};

export default MediaPage;
