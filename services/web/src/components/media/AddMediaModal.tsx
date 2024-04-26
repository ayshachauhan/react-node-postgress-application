'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import AddMediaForm from '@root/components/media/AddMedia';

const AddMediaModal = ({ isSecondModalOpen, handleCloseSecondModal }) => {
  return (
    <BaseUIModal
      isOpen={isSecondModalOpen}
      onClose={handleCloseSecondModal}
      title="Add a Video"
    >
      <AddMediaForm onClose={handleCloseSecondModal} />
    </BaseUIModal>
  );
};
export default AddMediaModal;
