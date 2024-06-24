'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import Image from 'next/image';

const ImageModal = ({ isModalOpen, handleCloseModal, imgUrl }) => {
  return (
    <BaseUIModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title=""
      additionalOverrides={{
        Close: {
          style: {
            width: '900px',
            maxWidth: '90%',
          },
        },
        Dialog: {
          style: {
            width: 'auto',
          },
        },
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 800,
          height: 600,
          paddingBottom: '56.25%',
          overflow: 'hidden',
          margin: 'auto',
          marginTop: '40px',
          marginBottom: '40px',
        }}
      >
        <Image
          src={imgUrl}
          className="rounded-lg"
          alt="Image description"
          width={800}
          height={600}
          style={{ width: '800px', height: '600px' }}
        />
      </div>
    </BaseUIModal>
  );
};
export default ImageModal;
