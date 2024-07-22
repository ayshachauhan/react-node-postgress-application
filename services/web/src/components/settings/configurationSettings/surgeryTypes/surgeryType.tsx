'use client';
import { ModalCloseEvent } from '@root/components/BaseUiModal/BaseUiModal';
import Button from '@root/components/Button';
import { AddIcon, DeleteIcon, EditIcon } from '@root/components/Icons';
import EditSurgeryLocationModal from '@root/components/settings/configurationSettings/surgeryTypes/EditSurgeryLocationModal';
import AddSurgeryType from '@root/components/settings/configurationSettings/surgeryTypes/addSurgeryType';
import { useAppDispatch, useAppSelector } from '@root/store';
import { getPracticeInfo } from '@root/store/reducers/practices';
import {
  clearErrorMessage,
  clearSuccessMessage,
  deleteRecordAsync,
  fetchListings as fetchSurgeryTypes,
  selectError,
  selectSuccessMessage,
} from '@root/store/reducers/surgeryTypes';
import { DEFAULT_SURGERYLOCATION_COLOR } from '@root/utils/constants';
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

export default function SurgeryTypePage() {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const practiceId = getPracticeId();
  const surgeryTypes = useAppSelector((state) =>
    Object.values(state.surgeryTypes.entities),
  );
  const [surgeryTypeId, setSurgeryTypeId] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const successMessage = useAppSelector(selectSuccessMessage);
  const errorMessage = useAppSelector(selectError);
  const modalRef = useRef(null);

  const handleOpenEditModal = (Id: string): void => {
    setIsModalOpen(false);
    setIsEditModalOpen(true);
    setIsDeleteModalOpen(false);
    setSurgeryTypeId(Id);
  };

  const handleCloseEditModal = (): void => {
    setIsEditModalOpen(false);
    setSurgeryTypeId('');
  };

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchSurgeryTypes({ practiceId: practiceId }));
      dispatch(getPracticeInfo({ id: practiceId }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    let timer;
    if (successMessage) {
      setShowModal(true);
      timer = setTimeout(() => {
        setShowModal(false);
        dispatch(clearSuccessMessage());
      }, 300);
    }
    if (errorMessage) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
        dispatch(clearErrorMessage());
      }, 300);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMessage, errorMessage, dispatch]);

  const onConfirmDelete = (): void => {
    if (practiceId) {
      try {
        dispatch(deleteRecordAsync({ practiceId, id: surgeryTypeId }));
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (Id: string): void => {
    setIsDeleteModalOpen(true);
    setSurgeryTypeId(Id);
  };

  const handleCloseModal = (event?: ModalCloseEvent): void => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsModalOpen(false);
  };

  const handleCloseDeleteModal = (event?: ModalCloseEvent): void => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsDeleteModalOpen(false);
  };

  const AddSurgeryModal = () => {
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
          Add New Surgery Location
        </ModalHeader>
        <ModalBody>
          <AddSurgeryType onClose={handleCloseModal} />
        </ModalBody>
      </Modal>
    );
  };

  const DeleteSurgeryTypeModal = () => {
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
          Are you sure you want to delete this surgery Location?
        </ModalBody>
        <ModalFooter>
          <Button kind="primary" title="Delete" onClick={onConfirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold align-middle">Surgery Location</span>
        {showModal && <div className="text-green-700">{successMessage}</div>}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <Button
          kind="secondary"
          title="Add New"
          padding="5px 8px"
          onClick={handleOpenModal}
          startEnhancer={() => <AddIcon></AddIcon>}
        />
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="table-responsive overflow-x-auto rounded-lg">
        <table className="">
          <tbody>
            <tr>
              <th className="">Surgery Location</th>
              <th className="">Color</th>
              <th className="">Action</th>
            </tr>
            {surgeryTypes.map((data) => (
              <React.Fragment key={data.id}>
                <tr className="border-t border-gray-300">
                  <td className="">{data.name}</td>
                  <td className="">
                    <input
                      type="color"
                      required={true}
                      disabled
                      id="primary_color"
                      value={data.color ?? DEFAULT_SURGERYLOCATION_COLOR}
                      style={{
                        height: '30px',
                        width: '30px',
                        border: 'none',
                        outline: 'none',
                      }}
                    />
                  </td>
                  <td className="">
                    <div className="flex gap-1">
                      <div
                        onClick={() => data.id && handleOpenEditModal(data.id)}
                        className="cursor-pointer"
                      >
                        <EditIcon></EditIcon>
                      </div>
                      <div
                        onClick={() =>
                          data.id && handleOpenDeleteModal(data.id)
                        }
                        className="cursor-pointer"
                      >
                        <DeleteIcon></DeleteIcon>
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <AddSurgeryModal />
      <DeleteSurgeryTypeModal />
      <EditSurgeryLocationModal
        isEditModalOpen={isEditModalOpen}
        handleCloseEditModal={handleCloseEditModal}
        surgeryTypeId={surgeryTypeId}
      />
    </div>
  );
}
