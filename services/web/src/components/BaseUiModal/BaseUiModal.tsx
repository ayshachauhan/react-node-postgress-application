import { Modal, ModalBody, ModalHeader } from 'baseui/modal';
import React from 'react';

const BaseUIModal = ({
  isOpen,
  onClose,
  title,
  children,
  additionalOverrides = {},
}) => {
  const defaultOverrides = {
    Root: {
      style: ({ $theme }) => ({
        outline: `${$theme.colors.warning200} solid`,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
      }),
    },
  };

  const combinedOverrides = {
    ...defaultOverrides,
    ...additionalOverrides,
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} overrides={combinedOverrides}>
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
