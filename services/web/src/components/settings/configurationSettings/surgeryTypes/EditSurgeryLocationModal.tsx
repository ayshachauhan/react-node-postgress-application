'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import EditSurgeryLocation from '@root/components/settings/configurationSettings/surgeryTypes/EditSurgeryLocation';

const EditSurgeryLocationModal = ({
  isEditModalOpen,
  handleCloseEditModal,
  surgeryTypeId,
}) => {
  return (
    <BaseUIModal
      isOpen={isEditModalOpen}
      onClose={handleCloseEditModal}
      title="Edit Surgery Location"
      additionalOverrides={{
        Dialog: {
          style: {
            width: '900px',
          },
        },
      }}
    >
      {surgeryTypeId !== null && (
        <EditSurgeryLocation
          data={{ id: surgeryTypeId }}
          onClose={handleCloseEditModal}
        />
      )}
    </BaseUIModal>
  );
};
export default EditSurgeryLocationModal;
