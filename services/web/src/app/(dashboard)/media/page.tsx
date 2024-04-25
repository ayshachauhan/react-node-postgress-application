'use client';
import Button from '@root/components/Button';
import { AddIcon, PlayIcon } from '@root/components/Icons';
import AddMediaModal from '@root/components/media/AddMediaModal';
import PlayVideoModal from '@root/components/media/PlayVideoModal';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  fetchListings,
} from '@root/store/reducers/media';
import { extractVideoId, getImageUrl, getPracticeId } from '@utils/index';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const Media: React.FC = () => {
  const dispatch = useAppDispatch();
  const media = useAppSelector((state) => Object.values(state.media.entities));
  const practiceId = getPracticeId();
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.media.successMessage,
    errorMessage: state.media.errorMessage,
  }));
  const [showModal, setShowModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

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

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId: practiceId }));
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

  return (
    <div className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Media</span>
        {showModal && <div className="text-green-700">{successMessage}</div>}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <Button
          kind="secondary"
          title="Add New"
          onClick={handleOpenSecondModal}
          startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
        />{' '}
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="flex flex-wrap gap-6">
        {Object.values(media).map((data) => (
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
                  style={{ width: '265px', height: '208px' }}
                />
                <div
                  className="bg-black absolute text-center transform -translate-x-1/2 -translate-y-1/2 border top-32 left-1/2 text-white rounded-full flex justify-center items-center p-2 border-black w-14 h-14 pointer"
                  onClick={() => handleOpenFirstModal(extractVideoId(data.url))}
                >
                  <PlayIcon></PlayIcon>
                </div>
                <div className="bg-black text-white rounded text-xs leading-[18px] absolute text-center border top-14 right-9 border-black py-1 px-1.5">
                  {data?.surgeryType?.name}
                </div>
                <div className="text-gray-900 pt-2 text-left">{data.name}</div>
              </div>
            </div>
          </React.Fragment>
        ))}
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
      <AddMediaModal
        isSecondModalOpen={isSecondModalOpen}
        handleCloseSecondModal={handleCloseSecondModal}
      />
    </div>
  );
};

export default Media;
