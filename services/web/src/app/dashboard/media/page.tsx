'use client';
import Button from '@root/components/Button';
import { PlayIcon } from '@root/components/Icons';
import Form from '@root/components/media/addMedia.module';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import YouTube from 'react-youtube';
import { publicRuntimeConfig } from '../../../../next.config';

const Media: React.FC = () => {
  const { NEXT_PUBLIC_API_BASE_URL } = publicRuntimeConfig;

  const [media, setMedia] = useState<Media[]>([]);
  const [videoId, setVideoId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (videoId) => {
    setVideoId(videoId);
    setIsOpen(true);
  };

  const closeModal = () => {
    setVideoId(null);
    setIsOpen(false);
  };

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  const FormModal = ({ isOpen, closeModal }) => {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          content: {
            backgroundColor: 'white',
            borderRadius: '8px',
            textAlign: 'center',
            width: 'auto',
            maxWidth: '30%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 0,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <button onClick={closeModal}>Close Modal</button>
        <h1>Add a Video</h1>
        <Form />
      </Modal>
    );
  };

  const extractVideoId = (url: string) => {
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    if (match) {
      return match[1];
    }
    return '';
  };

  const getImageUrl = (videoUrl) => {
    const youTubeVideoid = extractVideoId(videoUrl);
    return `https://img.youtube.com/vi/${youTubeVideoid}/hqdefault.jpg`;
  };

  const getMedia = async () => {
    try {
      const response = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/practices/12e738c5-bded-4733-837f-b6fa987284cf/videos`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg0N2JmMjdhLTRiNTAtNGUwYS04NjMzLTI4MDM0NWQxOWIzYiIsImRhdGVDcmVhdGVkIjoiMjAyNC0wMy0xM1QwMDozODowMC45MTlaIiwiZGF0ZVVwZGF0ZWQiOiIyMDI0LTAzLTEzVDAwOjM4OjAwLjkxOVoiLCJlbWFpbCI6InB1bGtlc2hAdGhpbmtzeXMuY29tIiwidXNlck5hbWUiOiJ0cml5YW5rX3RqIiwiZmlyc3ROYW1lIjoiUHVsa2VzaCIsImxhc3ROYW1lIjoiSmFpbiIsImZ1bGxOYW1lIjoiUHVsa2VzaCBKYWluIiwidXJsIjpudWxsLCJzdGF0dXMiOiJhY3RpdmUiLCJ0eXBlIjoiZW1wbG95ZWUiLCJpYXQiOjE3MTAzOTczMTYsImV4cCI6MTcxMDQ4MzcxNn0.C6HFSmA--JdXf5tmV-1AeYlih8PxpzO1wwygQ99Pm2U',
          },
        },
      );
      const data = await response.json();

      setMedia(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    Modal.setAppElement('#__next');
    getMedia();
  }, []);

  useEffect(() => {}, [media]);

  return (
    <div id="__next" className="mt-4">
      <div className="flex justify-between border-gray-400">
        <h1>Media</h1>
        <Button kind="secondary" title="Add New" onClick={openModal} />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="flex flex-wrap gap-6">
        {media.map((data) => (
          <React.Fragment key={data.id}>
            {/* <GeneralCard
                    id={this.props.id}
                    /> */}
            <div className="rounded-lg shadow-md p-6 w-[298px] h-298 relative">
              {/* <iframe
                          width="265"
                          height="208"
                          src="https://www.youtube.com/embed/n_3cG9oeuNo"
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          className="rounded-lg"
                      ></iframe> */}
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
                  onClick={() => openModal(extractVideoId(data.url))}
                  style={{ cursor: 'pointer' }}
                >
                  <PlayIcon></PlayIcon>
                </div>
                <div className="bg-black text-white rounded text-xs leading-[18px] absolute text-center border top-14 left-44 border-black py-1 px-1.5">
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
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Video Modal"
            appElement={document.getElementById('__next')}
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
              content: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '8px',
                textAlign: 'center',
                width: 'auto',
                maxWidth: '80%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 0,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              },
            }}
          >
            <YouTube videoId={videoId} opts={opts} />
          </Modal>
        )}
      </div>
      <FormModal isOpen={isOpen} closeModal={closeModal} />
    </div>
  );
};

interface Media {
  id: string;
  name: string;
  urlEmbed: string;
  url: string;
  dateCreated: Date;
  dateUpdated: Date;
}
export default Media;
