'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import UploadImageForm from './UploadImageForm';

const UploadImageModal = ({ isModalOpen, handleCloseModal }) => {
  return (
    <BaseUIModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title="Upload Image"
    >
      <UploadImageForm onClose={handleCloseModal} />
    </BaseUIModal>
  );
};
export default UploadImageModal;
