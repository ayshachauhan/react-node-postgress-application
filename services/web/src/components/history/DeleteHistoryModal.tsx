'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import Button from '@root/components/Button';

const DeleteHistoryModal = ({
  isDeleteModalOpen,
  handleCloseDeleteModal,
  onConfirmDelete,
}) => {
  return (
    <BaseUIModal
      isOpen={isDeleteModalOpen}
      onClose={handleCloseDeleteModal}
      title="Confirm Deletion"
    >
      Are you sure you want to delete this history record?
      <div className="text-right pt-4">
        <Button kind="primary" title="Delete" onClick={onConfirmDelete}>
          Delete
        </Button>
      </div>
    </BaseUIModal>
  );
};
export default DeleteHistoryModal;
