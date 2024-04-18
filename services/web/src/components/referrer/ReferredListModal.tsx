'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import ReferedPatients from '@root/components/referrer/ReferedPatients';

const ReferredListModal = ({ isListModalOpen, handleCloseListModal }) => {
  return (
    <BaseUIModal
      isOpen={isListModalOpen}
      onClose={handleCloseListModal}
      title="Referred Patients"
      additionalOverrides={{
        Dialog: {
          style: () => ({
            width: '800px',
          }),
        },
      }}
    >
      <ReferedPatients />
    </BaseUIModal>
  );
};
export default ReferredListModal;
