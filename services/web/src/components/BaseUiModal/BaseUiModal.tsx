import { Modal, ModalBody, ModalHeader } from 'baseui/modal';
import React, { useRef } from 'react';

export type ModalCloseEvent = {
  closeSource?: 'closeButton' | 'backdrop' | 'escape';
};

const BaseUIModal = ({
  isOpen,
  onClose,
  title,
  children,
  additionalOverrides = {},
  closeOnBackdrop = false,
}) => {
  const modalRef = useRef(null);

  const defaultOverrides = {
    Root: {
      style: ({ $theme }) => ({
        outline: `${$theme.colors.warning200} solid`,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }),
    },
  };

  const combinedOverrides = {
    ...defaultOverrides,
    ...additionalOverrides,
  };

  const handleCloseModal = (event) => {
    if (event.closeSource === 'backdrop' && !closeOnBackdrop) {
      return;
    }
    onClose();
  };

  return (
    <Modal
      onClose={handleCloseModal}
      isOpen={isOpen}
      overrides={combinedOverrides}
      ref={modalRef}
    >
      {title && (
        <ModalHeader
          $style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            borderBottom: '1px solid rgba(244, 244, 245, 1)',
            paddingBottom: '8px',
          }}
        >
          {title}
        </ModalHeader>
      )}
      <ModalBody>{children}</ModalBody>
    </Modal>
  );
};

export default BaseUIModal;
