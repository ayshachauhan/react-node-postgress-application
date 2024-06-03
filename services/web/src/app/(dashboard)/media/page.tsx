'use client';
import { MediaType } from '@packages/entities';
import {
  IPatient,
  ISurgeryConfiguration,
  PatientMediaConfig,
  PracticeMediaConfig,
} from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import { AddIcon, PlayIcon } from '@root/components/Icons';
import AddMediaModal from '@root/components/media/AddMediaModal';
import ImageModal from '@root/components/media/ImageModal';
import PlayVideoModal from '@root/components/media/PlayVideoModal';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  fetchListings,
} from '@root/store/reducers/media';
import { fetchListings as fetchPatients } from '@root/store/reducers/patient';
import { extractVideoId, getImageUrl, getPracticeId } from '@utils/index';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export type SelectedMedia = {
  name: string;
  type: MediaType;
};

const Media: React.FC = () => {
  const dispatch = useAppDispatch();
  const { media, surgeryConfigurations, patients } = useAppSelector(
    (state) => ({
      media: Object.values(state.media.entities).reverse(),
      surgeryConfigurations: Object.values(
        state.surgeryConfigurations.entities,
      ),
      patients: Object.values(state.patients.entities),
    }),
  );
  const practiceId = getPracticeId();
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.media.successMessage,
    errorMessage: state.media.errorMessage,
  }));
  const [showModal, setShowModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [modalImgUrl, setModalImgUrl] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>(
    MediaType.PRACTICE,
  );
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );

  const mediaTab: SelectedMedia[] = [
    {
      name: 'Practice Media',
      type: MediaType.PRACTICE,
    },
    {
      name: 'Patient Media',
      type: MediaType.PATIENT,
    },
  ];

  const handleOpenFirstModal = (videoId: string): void => {
    setVideoId(videoId);
    setIsVideoLoaded(true);
    setIsFirstModalOpen(true);
    setIsSecondModalOpen(false);
  };

  const handleOpenImageModal = (videoId: string): void => {
    setModalImgUrl(videoId);
    setIsImgModalOpen(true);
    setIsSecondModalOpen(false);
  };

  const handleCloseImgModal = (): void => {
    setModalImgUrl(null);
    setIsImgModalOpen(false);
  };

  const handleCloseFirstModal = (): void => {
    setVideoId(null);
    setIsVideoLoaded(false);
    setIsFirstModalOpen(false);
  };

  const handleOpenSecondModal = (): void => {
    setIsSecondModalOpen(true);
    setIsFirstModalOpen(false);
  };

  const handleCloseSecondModal = (): void => {
    setIsSecondModalOpen(false);
  };

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId: practiceId }));
      dispatch(fetchPatients({ practiceId: practiceId }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    let timer;
    if (successMessage) {
      setShowModal(true);
      timer = setTimeout(() => {
        setShowModal(false);
        dispatch(clearSuccessMessage());
      }, 2000);
    }
    if (errorMessage) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
        dispatch(clearErrorMessage());
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMessage, errorMessage, dispatch]);

  const toggleActive = (mediaType: MediaType) => {
    setSelectedMediaType(mediaType);
  };

  const handlePatientMediaClick = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const getSurgeryConfigById = (
    id: string,
  ): ISurgeryConfiguration | undefined =>
    surgeryConfigurations.find((data) => data.id === id);

  const getPatientById = (id: string): IPatient | undefined =>
    patients.find((data) => data.id === id);

  console.log(
    selectedPatientId,
    media,
    getPatientById(selectedPatientId!),
    'pat',
  );

  return (
    <div className="mt-4">
      {showModal && <div className="text-green-700">{successMessage}</div>}
      {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
      <div className="flex justify-between border-gray-400 items-center">
        <div className="flex bg-green-50 pr-2 border-b border-green-200 items-center">
          <div className="flex items-center">
            {mediaTab.map((item, index) => (
              <div className="mr-1" key={index}>
                <button
                  className="py-2 px-4 text-xs text-black text-normal border-b-2 border-transparent hover:text-white hover:bg-gradient-to-r from-primary-light to-primary-dark hover:rounded-t-lg"
                  style={{
                    ...(selectedMediaType === item.type && {
                      backgroundImage:
                        'linear-gradient(to right, rgba(53, 165, 118, 1), rgba(17, 113, 128, 1))',
                      color: 'white',
                      borderTopLeftRadius: '0.5rem',
                      borderTopRightRadius: '0.5rem',
                    }),
                  }}
                  onClick={() => toggleActive(item.type)}
                >
                  {item.name}
                </button>
              </div>
            ))}
          </div>
        </div>
        <Button
          kind="secondary"
          title="Add"
          height={40}
          width={80}
          onClick={handleOpenSecondModal}
          startEnhancer={() => <AddIcon className="mt-2" size={25} />}
        />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100" />
      <div className="flex flex-wrap gap-6">
        {selectedMediaType === MediaType.PRACTICE &&
          media
            .filter((data) => data.mediaType === MediaType.PRACTICE)
            .map((data) => (
              <React.Fragment key={data.id}>
                <div className="rounded-lg shadow-md p-6 w-[298px] h-298 relative">
                  <div>
                    <Image
                      src={getImageUrl(data.mediaConfig.video[0].url)}
                      className="rounded-lg"
                      alt="External image description"
                      width={265}
                      height={208}
                      style={{ width: '265px', height: '208px' }}
                    />
                    <div
                      className="bg-black absolute text-center transform -translate-x-1/2 -translate-y-1/2 border top-32 left-1/2 text-white rounded-full flex justify-center items-center p-2 border-black w-14 h-14 pointer"
                      onClick={() =>
                        handleOpenFirstModal(
                          extractVideoId(data.mediaConfig.video[0].url),
                        )
                      }
                    >
                      <PlayIcon />
                    </div>
                    <div className="bg-black text-white rounded text-xs leading-[18px] absolute text-center border top-14 right-9 border-black py-1 px-1.5">
                      {
                        getSurgeryConfigById(
                          (data.mediaConfig as PracticeMediaConfig)
                            .surgeryConfigurationId,
                        )?.name
                      }
                    </div>
                    <div className="text-gray-900 pt-2 text-left">
                      {data.mediaConfig.video[0].title}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
        {selectedMediaType === MediaType.PATIENT &&
          !selectedPatientId &&
          media
            .filter((data) => data.mediaType === MediaType.PATIENT)
            .map((data) => (
              <React.Fragment key={data.id}>
                <div
                  className="rounded-lg shadow-md p-6 w-[298px] h-298 relative cursor-pointer"
                  onClick={() =>
                    handlePatientMediaClick(
                      (data.mediaConfig as PatientMediaConfig).patientId,
                    )
                  }
                >
                  <div>
                    <Image
                      src={getImageUrl(data.mediaConfig.video[0].url)}
                      className="rounded-lg"
                      alt="External image description"
                      width={265}
                      height={208}
                      style={{ width: '265px', height: '208px' }}
                    />
                    <div className="text-gray-900 pt-2 text-left">
                      {`Patient Name: ${getPatientById(
                        (data.mediaConfig as PatientMediaConfig).patientId,
                      )?.firstName}`}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
        {selectedMediaType === MediaType.PATIENT && selectedPatientId && (
          <div style={{ width: '100vw' }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex">
                Patient Name: {getPatientById(selectedPatientId!)?.firstName}
              </div>
              <Button
                title="Back"
                height={40}
                width={80}
                onClick={() => setSelectedPatientId(null)}
              ></Button>
            </div>
            <div className="flex flex-wrap gap-4">
              {media
                .filter(
                  (data) =>
                    (data.mediaConfig as PatientMediaConfig).patientId ===
                    selectedPatientId,
                )
                .map((data) => data.mediaConfig)
                .flatMap((data, index) => {
                  // Combine video and image arrays with appropriate identifiers
                  const videoElements = data.video.map((video, vidIndex) => (
                    <React.Fragment key={`video-${index}-${vidIndex}`}>
                      <div className="rounded-lg shadow-md p-6 w-[298px] h-[298px] relative">
                        <Image
                          src={getImageUrl(video.url)}
                          className="rounded-lg"
                          alt="Video thumbnail"
                          width={265}
                          height={208}
                          style={{ width: '265px', height: '208px' }}
                        />
                        <div
                          className="bg-black absolute text-center transform -translate-x-1/2 -translate-y-1/2 border top-32 left-1/2 text-white rounded-full flex justify-center items-center p-2 border-black w-14 h-14 pointer"
                          onClick={() =>
                            handleOpenFirstModal(extractVideoId(video.url))
                          }
                        >
                          <PlayIcon />
                        </div>
                        <div className="text-gray-900 pt-2 text-left">
                          {video.title}
                        </div>
                      </div>
                    </React.Fragment>
                  ));

                  const imageElements = (data as PatientMediaConfig)?.image
                    ? (data as PatientMediaConfig)?.image.map(
                        (image, imgIndex) => (
                          <React.Fragment key={`image-${index}-${imgIndex}`}>
                            <div
                              className="rounded-lg shadow-md p-6 w-[298px] h-[298px] relative"
                              onClick={() => handleOpenImageModal(image.url)}
                            >
                              <Image
                                src={image.url}
                                className="rounded-lg"
                                alt="Image description"
                                width={265}
                                height={208}
                                style={{ width: '265px', height: '208px' }}
                              />
                              <div className="text-gray-900 pt-2 text-left">
                                {image.title}
                              </div>
                            </div>
                          </React.Fragment>
                        ),
                      )
                    : [];

                  return [...videoElements, ...imageElements];
                })}
            </div>
          </div>
        )}
      </div>
      <div>
        {videoId && isVideoLoaded && (
          <PlayVideoModal
            isFirstModalOpen={isFirstModalOpen}
            handleCloseFirstModal={handleCloseFirstModal}
            videoId={videoId}
          />
        )}
      </div>
      <div>
        {modalImgUrl && (
          <ImageModal
            isModalOpen={isImgModalOpen}
            handleCloseModal={handleCloseImgModal}
            imgUrl={modalImgUrl}
          />
        )}
      </div>
      <AddMediaModal
        isSecondModalOpen={isSecondModalOpen}
        handleCloseSecondModal={handleCloseSecondModal}
        selectedMediaType={selectedMediaType}
      />
    </div>
  );
};

export default Media;
