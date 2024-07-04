'use client';
import { IInsuranceType } from '@packages/entities/index.browser';
import { ModalCloseEvent } from '@root/components/BaseUiModal/BaseUiModal';
import Button from '@root/components/Button';
import { AddIcon, DeleteIcon } from '@root/components/Icons';
import AddInsuranceType from '@root/components/settings/configurationSettings/insuranceTypes/addInsuranceType';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  deleteRecordAsync,
  fetchListings,
} from '@root/store/reducers/insuranceTypes';
import { getPracticeInfo } from '@root/store/reducers/practices';
import { getPracticeId } from '@utils/index';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ROLE,
  SIZE,
} from 'baseui/modal';
import React, { useEffect, useRef, useState } from 'react';

export default function InsuranceTypePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [insuranceTypeId, setInsuranceTypeId] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const insuranceTypes: IInsuranceType[] = useAppSelector((state) =>
    Object.values(state.insuranceTypes.entities),
  );
  const modalRef = useRef(null);

  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.insuranceTypes.successMessage,
    errorMessage: state.insuranceTypes.errorMessage,
  }));

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId }));
      dispatch(getPracticeInfo({ id: practiceId }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    let timer;
    if (successMessage) {
      setShowSuccessMessage(true);
      timer = setTimeout(() => {
        setShowSuccessMessage(false);
        dispatch(clearSuccessMessage());
      }, 2000);
    }
    if (errorMessage) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
        dispatch(clearErrorMessage());
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMessage, errorMessage, dispatch]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (event?: ModalCloseEvent) => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsModalOpen(false);
  };

  const handleOpenDeleteModal = (id: string) => {
    setInsuranceTypeId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = (event?: ModalCloseEvent) => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (practiceId) {
      dispatch(deleteRecordAsync({ practiceId, id: insuranceTypeId }));
      setIsDeleteModalOpen(false);
    }
  };

  const AddInsuranceTypeModal = () => {
    return (
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        closeable
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        ref={modalRef}
        overrides={{
          Root: {
            style: ({ $theme }) => ({
              outline: `${$theme.colors.warning200} solid`,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }),
          },
        }}
      >
        <ModalHeader
          $style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            borderBottom: '1px solid rgba(244, 244, 245, 1)',
            paddingBottom: '8px',
          }}
        >
          Add New Insurance Type
        </ModalHeader>
        <ModalBody>
          <AddInsuranceType onClose={handleCloseModal} />
        </ModalBody>
      </Modal>
    );
  };

  const DeleteInsuranceTypeModal = () => {
    return (
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        closeable
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        ref={modalRef}
        overrides={{
          Root: {
            style: ({ $theme }) => ({
              outline: `${$theme.colors.warning200} solid`,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }),
          },
        }}
      >
        <ModalHeader $style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          Confirm Deletion
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this Insurance Type?
        </ModalBody>
        <ModalFooter>
          <Button kind="primary" title="Delete" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold align-middle">Insurance Type</span>
        {showSuccessMessage && (
          <div className="text-green-700">{successMessage}</div>
        )}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <Button
          kind="secondary"
          padding="5px 8px"
          title="Add New"
          onClick={handleOpenModal}
          startEnhancer={() => <AddIcon />}
        />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100" />
      <div className="table-responsive overflow-x-auto rounded-lg">
        <table className="">
          <tbody className="">
            <tr>
              <th className="">S. No.</th>
              <th className="">Insurance Type</th>
              <th className="">Action</th>
            </tr>
            {insuranceTypes.map((data, index) => (
              <React.Fragment key={data.id}>
                <tr>
                  <td className="">{index + 1}</td>
                  <td className="">{data.name}</td>
                  <td className="">
                    <div
                      onClick={() => handleOpenDeleteModal(data.id)}
                      className="cursor-pointer"
                    >
                      <DeleteIcon />
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <AddInsuranceTypeModal />
      <DeleteInsuranceTypeModal />
    </div>
  );
}
