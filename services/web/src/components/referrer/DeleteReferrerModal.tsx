'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import Button from '@root/components/Button';

const DeleteReferrerModal = ({
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
      Are you sure you want to delete this referrer?
      <div className="text-right text-base pt-4">
        <Button kind="primary" title="Delete" onClick={onConfirmDelete}>
          Delete
        </Button>
      </div>
    </BaseUIModal>
  );
};
export default DeleteReferrerModal;
