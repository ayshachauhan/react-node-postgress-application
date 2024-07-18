'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import AddSurgeryForm from '@root/components/dashboard/AddSurgery';

const AddSurgeryModal = ({
  isModalOpen,
  handleCloseModal,
  autoFillFromEval = false,
  autoFillFromSurgery = false,
  withLoader,
  surgeryTypeSelected = '',
}) => {
  return (
    <BaseUIModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title=""
      additionalOverrides={{
        Dialog: {
          style: () => ({
            width: '900px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
          }),
        },
        Root: {
          style: ({ $theme }) => ({
            outline: `${$theme.colors.warning200} solid`,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }),
        },
      }}
    >
      <AddSurgeryForm
        onClose={handleCloseModal}
        autoFillFromEval={autoFillFromEval}
        autoFillFromSurgery={autoFillFromSurgery}
        withLoader={withLoader}
        surgeryTypeSelected={surgeryTypeSelected}
      />
    </BaseUIModal>
  );
};
export default AddSurgeryModal;
