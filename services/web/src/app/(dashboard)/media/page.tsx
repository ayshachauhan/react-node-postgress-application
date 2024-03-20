'use client';
import Button from '@root/components/Button';
import { AddIcon, PlayIcon } from '@root/components/Icons';
import Form from '@root/components/media/addMedia.module';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectPractice } from '@root/store/reducers/auth';
import {
  clearErrorMessage,
  clearSuccessMessage,
  fetchListings,
  selectError,
  selectSuccessMessage,
} from '@root/store/reducers/media';
import { extractVideoId } from '@utils/extractVideoId';
import { getImageUrl } from '@utils/getImageUrl';
import { Modal, ModalBody, ModalHeader, ROLE, SIZE } from 'baseui/modal';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const Media: React.FC = () => {
  const dispatch = useAppDispatch();
  const media = useAppSelector((state) => state.media.media);
  const practiceId = useAppSelector(selectPractice); // Select success message from Redux store
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const successMessage = useAppSelector(selectSuccessMessage); // Select success message from Redux store
  const errorMessage = useAppSelector(selectError); // Select error message from Redux store
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleOpenFirstModal = (videoId: string): void => {
    setVideoId(videoId);
    setIsVideoLoaded(true);
    setIsFirstModalOpen(true);
    setIsSecondModalOpen(false);
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

  const [videoId, setVideoId] = useState<string | null>(null);

  const FormModal = () => {
    return (
      <Modal
        isOpen={isSecondModalOpen}
        onClose={handleCloseSecondModal}
        closeable
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        overrides={{
          Root: {
            style: ({ $theme }) => ({
              outline: `${$theme.colors.warning200} solid`,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }),
          },
        }}
      >
        <ModalHeader $style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          Add a Video
        </ModalHeader>
        <ModalBody>
          <Form onClose={handleCloseSecondModal} />
        </ModalBody>
      </Modal>
    );
  };

  useEffect(() => {
    dispatch(fetchListings({ practiceId: practiceId })); // Fetch listings from PostgreSQL database
  }, [practiceId, dispatch]);

  useEffect(() => {
    let timer;
    if (successMessage) {
      setShowModal(true);
      timer = setTimeout(() => {
        setShowModal(false);
        dispatch(clearSuccessMessage()); // Clear success message
      }, 2000); // Hide modal after 2 seconds
    }
    if (errorMessage) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
        dispatch(clearErrorMessage()); // Clear error message
      }, 2000); // Hide modal after 2 seconds
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div id="__next" className="mt-4">
      <div className="flex justify-between border-gray-400">
        <h1>Media</h1>
        {showModal && <div style={{ color: 'green' }}>{successMessage}</div>}
        {showErrorMessage && (
          <div style={{ color: 'red' }}>
            Error occurred while adding record.
          </div>
        )}
        <Button
          kind="secondary"
          title="Add New"
          onClick={handleOpenSecondModal}
          startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
        />{' '}
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="flex flex-wrap gap-6">
        {media.map((data) => (
          <React.Fragment key={data.id}>
            {/* <GeneralCard
                    id={this.props.id}
                    /> */}
            <div className="rounded-lg shadow-md p-6 w-[298px] h-298 relative">
              <div>
                <Image
                  src={getImageUrl(data.url)}
                  className="rounded-lg"
                  alt="External image description"
                  width={265}
                  height={208}
                  style={{ width: '265px', height: '208px' }} // Set the width using inline style
                />
                <div
                  className="bg-black absolute text-center transform -translate-x-1/2 -translate-y-1/2 border top-32 left-1/2 text-white rounded-full flex justify-center items-center p-2 border-black w-14 h-14"
                  onClick={() => handleOpenFirstModal(extractVideoId(data.url))}
                  style={{ cursor: 'pointer' }}
                >
                  <PlayIcon></PlayIcon>
                </div>
                <div className="bg-black text-white rounded text-xs leading-[18px] absolute text-center border top-14 right-9 border-black py-1 px-1.5">
                  Surgery Type
                </div>
                <div className="text-gray-900 pt-2 text-left">{data.name}</div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div>
        {videoId && (
          <Modal
            isOpen={isFirstModalOpen}
            onClose={handleCloseFirstModal}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
            overrides={{
              Root: {
                style: ({ $theme }) => ({
                  outline: `${$theme.colors.warning200} solid`,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  padding: 0, // Set padding to zero for modal container
                  margin: 0, // Set margin to zero for modal container
                }),
              },
              Close: {
                style: {
                  display: 'none', // Hide the close icon
                },
              },
            }}
          >
            <ModalBody>
              {isVideoLoaded && (
                <div
                  style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    overflow: 'hidden',
                  }}
                >
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/Bb8bnjnEM00?si=N_KX5ZVF2C7BMXbB"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  ></iframe>
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="YouTube video player"
                    className="rounded-lg"
                    allow="autoplay; fullscreen"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  ></iframe>
                </div>
              )}
            </ModalBody>
          </Modal>
        )}
      </div>
      <FormModal />
    </div>
  );
};

export default Media;
