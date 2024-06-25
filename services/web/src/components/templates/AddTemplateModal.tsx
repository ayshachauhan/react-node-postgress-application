'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import Form from '@root/components/templates/AddTemplateForm';

const AddTemplateModal = ({
  isAddModalOpen,
  handleCloseAddModal,
  withLoader,
  showDateOffsetControl,
}) => {
  return (
    <BaseUIModal
      isOpen={isAddModalOpen}
      onClose={handleCloseAddModal}
      title="Add New Template"
    >
      <Form
        onClose={handleCloseAddModal}
        withLoader={withLoader}
        showDateOffsetControl={showDateOffsetControl}
      />
    </BaseUIModal>
  );
};
export default AddTemplateModal;
