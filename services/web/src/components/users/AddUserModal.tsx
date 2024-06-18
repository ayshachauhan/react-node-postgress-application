'use client';
import BaseUIModal from '@root/components/BaseUiModal/BaseUiModal';
import Form from '@root/components/users/AddUser';

const UserAddModal = ({ isModalOpen, handleCloseModal, withLoader }) => {
  return (
    <BaseUIModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title="Add New User"
      additionalOverrides={{
        Dialog: {
          style: {
            width: '900px',
          },
        },
      }}
    >
      <Form onClose={handleCloseModal} withLoader={withLoader} />
    </BaseUIModal>
  );
};
export default UserAddModal;
