'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import AddMediaForm from '@root/components/media/AddMedia';

const AddMediaModal = ({ isSecondModalOpen, handleCloseSecondModal }) => {
  return (
    <BaseUIModal
      isOpen={isSecondModalOpen}
      onClose={handleCloseSecondModal}
      title="POD Media"
    >
      <AddMediaForm onClose={handleCloseSecondModal} />
    </BaseUIModal>
  );
};
export default AddMediaModal;
