'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import AddReferrerForm from '@root/components/referrer/AddReferrer';

const AddReferrerModal = ({ isModalOpen, handleCloseModal }) => {
  return (
    <BaseUIModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title="Add New Referrer"
    >
      <AddReferrerForm onClose={handleCloseModal} />
    </BaseUIModal>
  );
};
export default AddReferrerModal;
