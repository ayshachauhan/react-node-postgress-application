import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
} from 'baseui/modal';
import React from 'react';

const BaseUIModal = ({ isOpen, onClose, title, footerTerm, children }) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <ModalButton onClick={onClose}>{footerTerm}</ModalButton>
      </ModalFooter>
    </Modal>
  );
};

export default BaseUIModal;
