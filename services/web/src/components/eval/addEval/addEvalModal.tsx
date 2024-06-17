'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import AddEvalForm from '@root/components/eval/addEval/addEval';

const AddEvalModal = ({
  isSecondModalOpen,
  handleCloseSecondModal,
  withLoader,
}) => {
  return (
    <BaseUIModal
      isOpen={isSecondModalOpen}
      onClose={handleCloseSecondModal}
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
      <AddEvalForm onClose={handleCloseSecondModal} withLoader={withLoader} />
    </BaseUIModal>
  );
};
export default AddEvalModal;
