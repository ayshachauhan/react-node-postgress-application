'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';

const PlayVideoModal = ({
  isFirstModalOpen,
  handleCloseFirstModal,
  videoId,
}) => {
  return (
    <BaseUIModal
      isOpen={isFirstModalOpen}
      onClose={handleCloseFirstModal}
      title=""
      additionalOverrides={{
        Dialog: {
          style: {
            width: '900px',
            maxWidth: '90%',
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
        <iframe
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
    </BaseUIModal>
  );
};
export default PlayVideoModal;
