'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import AddEvalForm from '@root/components/eval/addEval/addEval';

interface AddEvalModalProps {
  isSecondModalOpen: boolean;
  handleCloseSecondModal: () => void;
  withLoader: (func: () => Promise<void>) => Promise<void>;
  onRecordAdded?: () => void;
}

const AddEvalModal: React.FC<AddEvalModalProps> = ({
  isSecondModalOpen,
  handleCloseSecondModal,
  withLoader,
  onRecordAdded,
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
      <AddEvalForm
        onClose={handleCloseSecondModal}
        withLoader={withLoader}
        onRecordAdded={onRecordAdded}
      />
    </BaseUIModal>
  );
};
export default AddEvalModal;
