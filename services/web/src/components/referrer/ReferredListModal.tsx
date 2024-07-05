'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import ReferedPatients from '@root/components/referrer/ReferedPatients';

const ReferredListModal = ({
  isListModalOpen,
  referrerId,
  handleCloseListModal,
  withLoader,
}) => {
  return (
    <BaseUIModal
      isOpen={isListModalOpen}
      onClose={handleCloseListModal}
      title="Referred Patients"
      additionalOverrides={{
        Dialog: {
          style: () => ({
            width: '700px',
          }),
        },
      }}
    >
      <ReferedPatients referrerId={referrerId} withLoader={withLoader} />
    </BaseUIModal>
  );
};
export default ReferredListModal;
