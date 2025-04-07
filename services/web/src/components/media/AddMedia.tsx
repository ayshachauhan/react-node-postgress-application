import { MediaType } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/media';
import { fetchListings as fetchsurgeryConfigurations } from '@root/store/reducers/surgeryConfigurations';
import { AddMediaDTO } from '@root/store/requests/media/types';
import { getPracticeId, isValidYouTubeUrl } from '@utils/index';
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox';
import { Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';
import { AddIcon, CloseIcon } from '../Icons';
import RequiredIndicator from '../RequiredIndicator';

const MediaPage: React.FC<{
  onClose: () => void;
  selectedMediaType: MediaType;
  withLoader: (func: () => Promise<void>) => Promise<void>;
}> = ({ onClose, selectedMediaType, withLoader }) => {
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
  const [videoErrors, setVideoErrors] = useState(['']);

  const practiceId = getPracticeId();
  const dispatch = useAppDispatch();
  const [practiceForm, setPracticeForm] = useState({
    surgeryConfigurationId: '',
    image: [{ title: '', file: null }],
    video: [{ title: '', url: '' }],
  });

  const [patientForm, setPatientForm] = useState({
    patientId: '',
    video: [{ title: '', url: '' }],
    image: [{ title: '', file: null }],
  });

  const sanitizeStateValues = (data) => {
    const sanitizeVideoArray = (arr: [{ title: string; url: string }]) =>
      arr.filter((item) => item.title && item.url);

    const sanitizeImageArray = (arr: [{ title: string; file: File }]) =>
      arr.filter((item) => item.title && item.file);

    return {
      ...data,
      video: sanitizeVideoArray(data.video),
      ...(data.image ? { image: sanitizeImageArray(data.image) } : {}),
    };
  };

  const isFormFilled = (): boolean => {
    if (selectedMedia === MediaType.PATIENT) {
      const { video, image } = patientForm;

      const areVideosFilled = video.every(
        (item) => item.title.trim() !== '' && item.url.trim() !== '',
      );
      const areImagesFilled = image.every(
        (item) => item.title.trim() !== '' && item.file !== null,
      );

      return areVideosFilled || areImagesFilled;
    } else {
      const { video, image } = practiceForm;

      const areVideosFilled = video.every(
        (item) => item.title.trim() !== '' && item.url.trim() !== '',
      );
      const areImagesFilled = image.every(
        (item) => item.title.trim() !== '' && item.file !== null,
      );

      return areVideosFilled || areImagesFilled;
    }
  };

  const [selectedMedia, setSelectedMedia] =
    useState<MediaType>(selectedMediaType);

  const handlePracticeFormChange = (field, value) => {
    setPracticeForm({ ...practiceForm, [field]: value });
  };

  const handlePatientFormChange = (field, value) => {
    setPatientForm({ ...patientForm, [field]: value });
  };

  const handleAddVideoField = () => {
    if (selectedMedia === MediaType.PRACTICE) {
      if (practiceForm.video.length < 5) {
        setPracticeForm((prev) => ({
          ...prev,
          video: [...prev.video, { title: '', url: '' }],
        }));
        setVideoErrors((prev) => [...prev, '']);
      }
    } else {
      if (patientForm.video.length < 5) {
        setPatientForm((prev) => ({
          ...prev,
          video: [...prev.video, { title: '', url: '' }],
        }));
        setVideoErrors((prev) => [...prev, '']);
      }
    }
  };

  const handleRemoveVideoField = (index) => {
    if (selectedMedia === MediaType.PRACTICE) {
      const updated = [...practiceForm.video];
      updated.splice(index, 1);
      setPracticeForm((prev) => ({ ...prev, video: updated }));
    } else {
      const updated = [...patientForm.video];
      updated.splice(index, 1);
      setPatientForm((prev) => ({ ...prev, video: updated }));
    }

    setVideoErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChangeInput = (index, value, field) => {
    const isVideoUrlField = field === 'url';
    const updatedErrors = [...videoErrors];

    let shouldValidate = false;

    if (selectedMedia === MediaType.PRACTICE) {
      const newFields = [...practiceForm.video];
      newFields[index][field] = value;

      if (isVideoUrlField && newFields[index].title) {
        shouldValidate = true;
        const isValid = isValidYouTubeUrl(value);
        updatedErrors[index] = isValid ? '' : 'Invalid YouTube URL';
      } else if (isVideoUrlField) {
        updatedErrors[index] = '';
      }

      setPracticeForm({ ...practiceForm, video: newFields });
    } else {
      const newFields = [...patientForm.video];
      newFields[index][field] = value;

      if (isVideoUrlField && newFields[index].title) {
        shouldValidate = true;
        const isValid = isValidYouTubeUrl(value);
        updatedErrors[index] = isValid ? '' : 'Invalid YouTube URL';
      } else if (isVideoUrlField) {
        updatedErrors[index] = '';
      }

      setPatientForm({ ...patientForm, video: newFields });
    }

    if (isVideoUrlField && shouldValidate) {
      setVideoErrors(updatedErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const videosToCheck =
      selectedMedia === MediaType.PRACTICE
        ? practiceForm.video
        : patientForm.video;

    const updatedErrors: string[] = [];

    videosToCheck.forEach((video) => {
      if (video.url && !isValidYouTubeUrl(video.url)) {
        updatedErrors.push('Invalid YouTube URL');
      } else {
        updatedErrors.push('');
      }
    });

    setVideoErrors(updatedErrors);

    const hasInvalidVideoUrl = updatedErrors.some((err) => err !== '');

    if (hasInvalidVideoUrl) {
      alert('Please correct all invalid YouTube URLs before submitting.');
      return;
    }
    if (practiceId) {
      const sanitizedPracticeForm = sanitizeStateValues(practiceForm);
      const sanitizedPatientForm = sanitizeStateValues(patientForm);

      const data: AddMediaDTO =
        selectedMedia === MediaType.PRACTICE
          ? {
              practiceId,
              mediaType: selectedMedia,
              mediaConfig: sanitizedPracticeForm,
              entityId: practiceForm.surgeryConfigurationId,
            }
          : {
              practiceId,
              mediaType: selectedMedia,
              entityId: patientForm.patientId,
              mediaConfig: sanitizedPatientForm,
            };

      console.log(data, 'finaldata');

      try {
        await withLoader(async () => {
          await dispatch(addRecordAsync(data));
        });
        setPracticeForm({
          surgeryConfigurationId: '',
          video: [{ title: '', url: '' }],
          image: [{ title: '', file: null }],
        });
        setPatientForm({
          patientId: '',
          video: [{ title: '', url: '' }],
          image: [{ title: '', file: null }],
        });
        onClose();
      } catch (error) {
        onClose();
      }
    }
  };

  const handleAddImageField = () => {
    if (selectedMedia === MediaType.PRACTICE) {
      if (practiceForm.image.length < 5) {
        setPracticeForm({
          ...practiceForm,
          image: [...practiceForm.image, { title: '', file: null }],
        });
      }
    } else {
      if (patientForm.image.length < 5) {
        setPatientForm({
          ...patientForm,
          image: [...patientForm.image, { title: '', file: null }],
        });
      }
    }
  };

  const handleRemoveImageField = (index) => {
    if (selectedMedia === MediaType.PRACTICE) {
      const newImageFields = practiceForm.image.filter((_, i) => i !== index);
      setPracticeForm({ ...practiceForm, image: newImageFields });
    } else {
      const newImageFields = patientForm.image.filter((_, i) => i !== index);
      setPatientForm({ ...patientForm, image: newImageFields });
    }
  };

  const handleImageChangeInput = (index, event, field) => {
    if (selectedMedia === MediaType.PRACTICE) {
      const newImageFields = [...practiceForm.image];
      if (field === 'file') {
        newImageFields[index][field] = event.target.files[0];
      } else {
        newImageFields[index][field] = event.target.value;
      }
      setPracticeForm({ ...practiceForm, image: newImageFields });
    } else {
      const newImageFields = [...patientForm.image];
      if (field === 'file') {
        newImageFields[index][field] = event.target.files[0];
      } else {
        newImageFields[index][field] = event.target.value;
      }
      setPatientForm({ ...patientForm, image: newImageFields });
    }
  };

  const handleSurgeryConfigurationChange = ({ value }) => {
    handlePracticeFormChange(
      'surgeryConfigurationId',
      value[0] ? value[0].id : null,
    );
  };

  const handlePatientChange = ({ value }) => {
    handlePatientFormChange('patientId', value[0] ? value[0].id : null);
  };

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchsurgeryConfigurations({ practiceId: practiceId }));
    }
  }, [practiceId, dispatch]);

  const selectedPatient = () =>
    Object.values(patient).find((data) => data.id === patientForm.patientId);

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
          <div className="flex gap-5 flex-col">
            <div className="mt-4">
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
                  practiceForm.surgeryConfigurationId
                    ? [
                        {
                          label: practiceForm.surgeryConfigurationId,
                          id: practiceForm.surgeryConfigurationId,
                        },
                      ]
                    : []
                }
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
            <div className="">
              <div className="flex items-center mb-1">
                <div>
                  <label htmlFor="lastName" className="">
                    Video Media
                  </label>
                </div>
                <div>
                  <div className="ml-4">
                    <Button
                      type="button"
                      kind="primary"
                      title=""
                      width={25}
                      height={25}
                      startEnhancer={() => (
                        <AddIcon className="-mr-2"></AddIcon>
                      )}
                      onClick={handleAddVideoField}
                    />
                  </div>
                </div>
              </div>
              <hr className="h-px bg-gray-100 border-1 dark:bg-gray-800"></hr>
              {practiceForm.video.map((inputField, index, arr) => (
                <>
                  <div className="flex gap-5 mt-4">
                    <div className="w-1/2">
                      <label htmlFor="email" className="">
                        Video Title
                      </label>
                      <div className="">
                        <TextInput
                          type="text"
                          value={inputField.title}
                          onChange={(value) =>
                            handleVideoChangeInput(index, value, 'title')
                          }
                          endEnhancer={
                            arr.length > 1 ? (
                              <div
                                className="rounded-md cursor-pointer items-center"
                                onClick={() => handleRemoveVideoField(index)}
                              >
                                <CloseIcon className="" size={10} />
                              </div>
                            ) : null
                          }
                        />
                      </div>
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="email" className="">
                        Video Url
                      </label>
                      <div className="">
                        <TextInput
                          type="text"
                          value={inputField.url}
                          onChange={(value) =>
                            handleVideoChangeInput(index, value, 'url')
                          }
                          endEnhancer={
                            arr.length > 1 ? (
                              <div
                                className="rounded-md cursor-pointer"
                                onClick={() => handleRemoveVideoField(index)}
                              >
                                <CloseIcon className="" size={10} />
                              </div>
                            ) : null
                          }
                        />
                      </div>
                      {videoErrors[index] && (
                        <p className="text-sm text-red-500 mt-1">
                          {videoErrors[index]}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex gap-4 items-center mb-1">
                <div>
                  <label htmlFor="imageMedia" className="">
                    Image Media
                  </label>
                </div>
                <div>
                  <div className="">
                    <Button
                      title=""
                      type="button"
                      kind="primary"
                      width={25}
                      height={25}
                      startEnhancer={() => (
                        <AddIcon className="-mr-2"></AddIcon>
                      )}
                      onClick={handleAddImageField}
                    />
                  </div>
                </div>
              </div>
              <hr className="h-px bg-gray-100 border-1 dark:bg-gray-800"></hr>
              {practiceForm.image.map((inputField, index, arr) => (
                <div key={index} className="flex gap-5 mt-4">
                  <div className="w-1/2">
                    <label htmlFor="imageTitle" className="">
                      Image Title
                    </label>
                    <div className="">
                      <TextInput
                        type="text"
                        value={inputField.title}
                        onChange={(__value, event) =>
                          handleImageChangeInput(index, event, 'title')
                        }
                        endEnhancer={
                          arr.length > 1 ? (
                            <div
                              className="rounded-md cursor-pointer"
                              onClick={() => handleRemoveImageField(index)}
                            >
                              <CloseIcon size={10} />
                            </div>
                          ) : null
                        }
                      />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="imageFile" className="">
                      Image File
                    </label>
                    <div className="">
                      <TextInput
                        type="file"
                        onChange={(__value, event) =>
                          handleImageChangeInput(index, event, 'file')
                        }
                        endEnhancer={
                          arr.length > 1 ? (
                            <div
                              className="rounded-md cursor-pointer"
                              onClick={() => handleRemoveImageField(index)}
                            >
                              <CloseIcon size={10} />
                            </div>
                          ) : null
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-5 flex-col">
            <div className=" mt-4">
              <label htmlFor="mrn" className="">
                <RequiredIndicator />
                &nbsp;MRN
              </label>
              <div className="">
                <Select
                  options={patientOptions}
                  onChange={handlePatientChange}
                  value={
                    patientForm.patientId
                      ? [
                          {
                            label: patientForm.patientId,
                            id: patientForm.patientId,
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
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-1/2">
                <label htmlFor="firstName" className="">
                  First Name
                </label>
                <TextInput
                  name="firstName"
                  value={selectedPatient()?.firstName}
                  onChange={() => {}}
                  required
                  disabled={true}
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className="">
                  Last Name
                </label>
                <TextInput
                  name="lastName"
                  value={selectedPatient()?.lastName}
                  onChange={() => {}}
                  required
                  disabled={true}
                />
              </div>
            </div>
            <div className="">
              <div className="flex items-center mb-1">
                <div>
                  <label htmlFor="lastName" className="">
                    Video Media
                  </label>
                </div>
                <div>
                  <div className="ml-4">
                    <Button
                      type="button"
                      kind="primary"
                      title=""
                      width={25}
                      height={25}
                      startEnhancer={() => (
                        <AddIcon className="-mr-2"></AddIcon>
                      )}
                      onClick={handleAddVideoField}
                    />
                  </div>
                </div>
              </div>
              <hr className="h-px bg-gray-100 border-1 dark:bg-gray-800"></hr>
              {patientForm.video.map((inputField, index, arr) => (
                <>
                  <div className="flex gap-5 mt-4">
                    <div className="w-1/2">
                      <label htmlFor="email" className="">
                        Video Title
                      </label>
                      <div className="">
                        <TextInput
                          type="text"
                          value={inputField.title}
                          onChange={(value) =>
                            handleVideoChangeInput(index, value, 'title')
                          }
                          endEnhancer={
                            arr.length > 1 ? (
                              <div
                                className="rounded-md cursor-pointer items-center"
                                onClick={() => handleRemoveVideoField(index)}
                              >
                                <CloseIcon className="" size={10} />
                              </div>
                            ) : null
                          }
                        />
                      </div>
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="email" className="">
                        Video Url
                      </label>
                      <div className="">
                        <TextInput
                          type="text"
                          value={inputField.url}
                          onChange={(value) =>
                            handleVideoChangeInput(index, value, 'url')
                          }
                          endEnhancer={
                            arr.length > 1 ? (
                              <div
                                className="rounded-md cursor-pointer"
                                onClick={() => handleRemoveVideoField(index)}
                              >
                                <CloseIcon className="" size={10} />
                              </div>
                            ) : null
                          }
                        />
                      </div>
                      {videoErrors[index] && (
                        <p className="text-sm text-red-500 mt-1">
                          {videoErrors[index]}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ))}
            </div>
            <div className="">
              <div className="flex gap-4 items-center mb-1">
                <div>
                  <label htmlFor="imageMedia" className="">
                    Image Media
                  </label>
                </div>
                <div>
                  <div className="">
                    <Button
                      title=""
                      type="button"
                      kind="primary"
                      width={25}
                      height={25}
                      startEnhancer={() => (
                        <AddIcon className="-mr-2"></AddIcon>
                      )}
                      onClick={handleAddImageField}
                    />
                  </div>
                </div>
              </div>
              <hr className="h-px bg-gray-100 border-1 dark:bg-gray-800"></hr>
              {patientForm.image.map((inputField, index, arr) => (
                <div key={index} className="flex gap-5 mt-4">
                  <div className="w-1/2">
                    <label htmlFor="imageTitle" className="">
                      Image Title
                    </label>
                    <div className="">
                      <TextInput
                        type="text"
                        value={inputField.title}
                        onChange={(__value, event) =>
                          handleImageChangeInput(index, event, 'title')
                        }
                        endEnhancer={
                          arr.length > 1 ? (
                            <div
                              className="rounded-md cursor-pointer"
                              onClick={() => handleRemoveImageField(index)}
                            >
                              <CloseIcon size={10} />
                            </div>
                          ) : null
                        }
                      />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="imageFile" className="">
                      Image File
                    </label>
                    <div className="">
                      <TextInput
                        type="file"
                        onChange={(__value, event) =>
                          handleImageChangeInput(index, event, 'file')
                        }
                        endEnhancer={
                          arr.length > 1 ? (
                            <div
                              className="rounded-md cursor-pointer"
                              onClick={() => handleRemoveImageField(index)}
                            >
                              <CloseIcon size={10} />
                            </div>
                          ) : null
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="text-right mt-4">
          <Button
            kind="primary"
            title="Add New Media"
            disabled={!isFormFilled()}
          />
        </div>
      </form>
    </div>
  );
};

export default MediaPage;
