'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import EditReferrer from '@root/components/referrer/EditReferrer';

const EditReferrerModal = ({
  isEditModalOpen,
  handleCloseEditModal,
  referrerId,
  withLoader,
}) => {
  return (
    <BaseUIModal
      isOpen={isEditModalOpen}
      onClose={handleCloseEditModal}
      title="Edit Referrer"
    >
      {referrerId !== null && (
        <EditReferrer
          data={{ id: referrerId }}
          onClose={handleCloseEditModal}
          withLoader={withLoader}
        />
      )}
    </BaseUIModal>
  );
};
export default EditReferrerModal;
