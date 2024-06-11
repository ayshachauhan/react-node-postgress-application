'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import AddSurgeryForm from '@root/components/dashboard/AddSurgery';

const AddSurgeryModal = ({
  isModalOpen,
  handleCloseModal,
  items,
  autoFillFromEval = false,
  autoFillFromSurgery = false,
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
        items={items}
        autoFillFromEval={autoFillFromEval}
        autoFillFromSurgery={autoFillFromSurgery}
      />
    </BaseUIModal>
  );
};
export default AddSurgeryModal;
