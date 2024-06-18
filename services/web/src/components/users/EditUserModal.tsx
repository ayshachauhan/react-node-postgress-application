'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import EditUser from '@root/components/users/EditUser';

const EditUserModal = ({
  isEditModalOpen,
  handleCloseEditModal,
  userId,
  withLoader,
}) => {
  return (
    <BaseUIModal
      isOpen={isEditModalOpen}
      onClose={handleCloseEditModal}
      title="Edit User"
      additionalOverrides={{
        Dialog: {
          style: {
            width: '900px',
          },
        },
      }}
    >
      {userId !== null && (
        <EditUser
          data={{ id: userId }}
          onClose={handleCloseEditModal}
          withLoader={withLoader}
        />
      )}
    </BaseUIModal>
  );
};
export default EditUserModal;
