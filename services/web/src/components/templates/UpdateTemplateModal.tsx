'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import TemplateUpdate from '@root/components/templates/UpdateTemplateForm';

const UpdateTemplateModal = ({
  isUpdateModalOpen,
  handleCloseUpdateModal,
  templateId,
  messageType,
  versionOffset,
  withLoader,
}) => {
  return (
    <BaseUIModal
      isOpen={isUpdateModalOpen}
      onClose={handleCloseUpdateModal}
      title=""
      additionalOverrides={{
        Dialog: {
          style: () => ({
            width: '1300px',
          }),
        },
      }}
    >
      {templateId !== null &&
        messageType !== null &&
        versionOffset !== null && (
          <TemplateUpdate
            data={{
              id: templateId,
              messageType: messageType,
              versionOffset: versionOffset,
            }}
            onClose={handleCloseUpdateModal}
            withLoader={withLoader}
          />
        )}
    </BaseUIModal>
  );
};
export default UpdateTemplateModal;
