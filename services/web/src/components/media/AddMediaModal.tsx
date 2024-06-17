'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import AddMediaForm from '@root/components/media/AddMedia';

const AddMediaModal = ({
  isSecondModalOpen,
  handleCloseSecondModal,
  selectedMediaType,
  withLoader,
}) => {
  return (
    <BaseUIModal
      isOpen={isSecondModalOpen}
      onClose={handleCloseSecondModal}
      title="POD Media"
    >
      <AddMediaForm
        onClose={handleCloseSecondModal}
        selectedMediaType={selectedMediaType}
        withLoader={withLoader}
      />
    </BaseUIModal>
  );
};
export default AddMediaModal;
