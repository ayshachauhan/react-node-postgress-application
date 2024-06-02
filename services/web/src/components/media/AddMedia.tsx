import { MediaType, Video } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/media';
import { fetchListings as fetchsurgeryConfigurations } from '@root/store/reducers/surgeryConfigurations';
import { getPracticeId } from '@utils/index';
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox';
import { SIZE, Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';
import { AddIcon, CloseIcon } from '../Icons';

const MediaPage: React.FC<{
  onClose: () => void;
  selectedMediaType: MediaType;
}> = ({ onClose, selectedMediaType }) => {
  const { surgeryConfigurations, patient } = useAppSelector((state) => ({
    surgeryConfigurations: state.surgeryConfigurations.entities,
    patient: state.patients.entities,
  }));
  const surgeryConfigurationOptions = Object.keys(surgeryConfigurations).map(
    (key) => ({
      label: surgeryConfigurations[key].name,
      id: surgeryConfigurations[key].id,
    }),
  );

  const patientOptions = Object.keys(patient).map((key) => ({
    label: patient[key].mrn,
    id: patient[key].id,
  }));

  const practiceId = getPracticeId();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [surgeryConfigurationId, setSurgeryConfigurationId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [selectedMedia, setSelectedMedia] =
    useState<MediaType>(selectedMediaType);

  const [video, setVideo] = useState<Video[]>([{ title: '', url: '' }]);
  const [image, setImage] = useState<Video[]>([{ title: '', url: '' }]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId) {
      const data = {
        name,
        url,
        practiceId,
        surgeryConfigurationId,
      };
      try {
        dispatch(addRecordAsync(data));
        setName('');
        setUrl('');
        setSurgeryConfigurationId('');
        setPatientId('');
        onClose();
      } catch (error) {
        onClose();
      }
    }
  };

  const handleSurgeryConfigurationChange = ({ value }) => {
    setSurgeryConfigurationId(value[0] ? value[0].id : null);
  };

  const handlePatientChange = ({ value }) => {
    setPatientId(value[0] ? value[0].id : null);
  };

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchsurgeryConfigurations({ practiceId: practiceId }));
    }
  }, [practiceId, dispatch]);

  const selectedPatient = () =>
    Object.values(patient).find((data) => data.id === patientId);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row justify-around">
          <div>
            <Checkbox
              checked={selectedMedia === MediaType.PRACTICE}
              onChange={() => setSelectedMedia(MediaType.PRACTICE)}
              labelPlacement={LABEL_PLACEMENT.right}
            >
              Practice Media
            </Checkbox>
          </div>
          <Checkbox
            checked={selectedMedia === MediaType.PATIENT}
            onChange={() => setSelectedMedia(MediaType.PATIENT)}
            labelPlacement={LABEL_PLACEMENT.right}
          >
            Patient Media
          </Checkbox>
        </div>
        {selectedMedia === MediaType.PRACTICE ? (
          <div>
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
            <div className="space-y-2 pt-4">
              <label
                htmlFor="urlEmbed"
                className="text-black text-sm font-normal"
              >
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
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="space-y-2">
              <label htmlFor="mrn" className="text-black text-sm font-normal">
                MRN
              </label>
              <div className="space-y-2 pt-4">
                <Select
                  options={patientOptions}
                  onChange={handlePatientChange}
                  value={
                    patientId
                      ? [
                          {
                            label: patientId,
                            id: patientId,
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
            </div>
            <div className="flex flex-row justify-between gap-7 pt-4">
              <div className="w-1/2 space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-black text-sm font-normal"
                >
                  First Name
                </label>
                <TextInput
                  name="firstName"
                  value={selectedPatient()?.firstName}
                  onChange={() => {}}
                  required
                />
              </div>
              <div className="w-1/2 space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-black text-sm font-normal"
                >
                  Last Name
                </label>
                <TextInput
                  name="lastName"
                  value={selectedPatient()?.lastName}
                  onChange={() => {}}
                  required
                />
              </div>
            </div>
            <div className="pt-6">
              <div className="flex">
                <div>
                  <label htmlFor="lastName" className="text-black text-lg">
                    Video Media
                  </label>
                </div>
                <div>
                  <div className="pl-3">
                    <Button
                      type="button"
                      kind="primary"
                      title=""
                      width={25}
                      height={25}
                      startEnhancer={() => (
                        <AddIcon className="mt-2 ml-2" size={25}></AddIcon>
                      )}
                      onClick={() => {}}
                    />
                  </div>
                </div>
              </div>
              <hr className="h-px bg-gray-100 border-1 dark:bg-gray-800"></hr>
              {video.map((inputField, index, arr) => (
                <>
                  <div className="flex gap-5">
                    <div className="space-y-2 flex-1">
                      <label
                        htmlFor="email"
                        className="text-black text-sm mt-2"
                      >
                        Video Title
                      </label>
                      <div className="flex flex-row gap-3">
                        <TextInput
                          size={SIZE.mini}
                          type="text"
                          value={inputField.title}
                          onChange={(event) =>
                            handleChecklistChangeInput(index, event)
                          }
                          endEnhancer={
                            arr.length > 1 ? (
                              <div
                                className="rounded-md cursor-pointer items-center pl-3"
                                onClick={() =>
                                  handleChecklistRemoveFields(index)
                                }
                              >
                                <CloseIcon className="" size={10} />
                              </div>
                            ) : null
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2 flex-1">
                      <label
                        htmlFor="email"
                        className="text-black text-sm mt-2"
                      >
                        Video Url
                      </label>
                      <div className="flex flex-row gap-3">
                        <TextInput
                          size={SIZE.mini}
                          type="text"
                          value={inputField.title}
                          onChange={() => {}}
                          endEnhancer={
                            arr.length > 1 ? (
                              <div
                                className="rounded-md cursor-pointer items-center pl-3"
                                onClick={() => {}}
                              >
                                <CloseIcon className="" size={10} />
                              </div>
                            ) : null
                          }
                        />
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        )}
        <div className="text-right text-base pt-4">
          <Button kind="primary" title="Add new video" width={189} />
        </div>
      </form>
    </div>
  );
};

export default MediaPage;
