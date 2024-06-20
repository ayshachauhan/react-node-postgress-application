'use client';
import { ModalCloseEvent } from '@root/components/BaseUiModal/BaseUiModal';
import Button from '@root/components/Button';
import { AddIcon, DeleteIcon, EditIcon } from '@root/components/Icons';
import Loader from '@root/components/loader';
import AddForm from '@root/components/settings/modularDesignSettings/addModularField/addModularField';
import EditForm from '@root/components/settings/modularDesignSettings/editModularFields/editModuleFields';
import { useLoader } from '@root/hooks/useLoader';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  deleteRecordAsync,
  fetchListings as fetchSurgeryConfigurationsList,
} from '@root/store/reducers/surgeryConfigurations';
import { fetchListings as fetchSurgeryTypes } from '@root/store/reducers/surgeryTypes';
import { getPracticeId } from '@root/utils';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ROLE,
  SIZE,
} from 'baseui/modal';
import React, { useEffect, useRef, useState } from 'react';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, withLoader } = useLoader();
  const practiceId = getPracticeId();
  useEffect(() => {
    if (practiceId) {
      const loadData = async () => {
        await withLoader(async () => {
          await dispatch(fetchSurgeryConfigurationsList({ practiceId }));
          await dispatch(fetchSurgeryTypes({ practiceId }));
        });
      };

      loadData();
    }
  }, [practiceId, dispatch, withLoader]);
  const [showModal, setShowModal] = useState(false);
  const [configurationId, setConfigurationId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [surgeryTypeId, setSurgeryTypeId] = useState<string>('');
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.users.successMessage,
    errorMessage: state.users.errorMessage,
  }));
  const modalRef = useRef(null);

  const surgeryConfigurationsList = useAppSelector((state) =>
    Object.values(state.surgeryConfigurations.entities),
  );

  const surgeryTypesList = useAppSelector((state) =>
    Object.values(state.surgeryTypes.entities),
  );

  const handleOpenDeleteModal = (Id: string): void => {
    setIsDeleteModalOpen(true);
    setConfigurationId(Id);
  };

  const handleOpenEditModal = (data): void => {
    setIsEditModalOpen(true);
    setIsDeleteModalOpen(false);
    setConfigurationId(data.id);
  };

  const onConfirmDelete = (): void => {
    const id = configurationId;
    if (practiceId && id) {
      try {
        dispatch(
          deleteRecordAsync({ practiceId, id: configurationId, surgeryTypeId }),
        );
        setIsDeleteModalOpen(false);
        setConfigurationId(null);
      } catch (error) {
        console.log(error);
      }
    }
    setConfigurationId(null);
  };

  const modifySurgeryConfigList = surgeryConfigurationsList
    .map((ele, index) => {
      return {
        surgeryName: ele.name,
        surgeryType: ele.surgeryType.name,
        surgeryTypeId: ele.surgeryType.id,
        bodyPart: ele.bodyPart ? ele.bodyPart.join(', ') : '',
        facility: ele.facility ? ele.facility.join(', ') : '',
        index: index + 1,
        id: ele.id,
      };
    })
    .filter((ele) => ele.surgeryName);

  const ConfigurationAddModel = () => {
    return (
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        closeable
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        ref={modalRef}
        overrides={{
          Dialog: {
            style: () => ({
              width: '1300px',
              maxWidth: '90%',
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
        <ModalBody>
          <AddForm
            onClose={handleCloseAddModal}
            items={{
              surgeryTypesList,
            }}
            withLoader={withLoader}
          />
        </ModalBody>
      </Modal>
    );
  };

  const handleCloseAddModal = (event?: ModalCloseEvent): void => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsAddModalOpen(false);
  };

  const handleOpenAddModal = (): void => {
    setIsAddModalOpen(true);
  };

  const handleCloseDeleteModal = (event?: ModalCloseEvent): void => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsDeleteModalOpen(false);
    setConfigurationId(null);
  };

  const handleCloseEditModal = (event?: ModalCloseEvent): void => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsEditModalOpen(false);
    setConfigurationId(null);
  };

  const ConfigurationDeleteModal = () => {
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
          Are you sure you want to delete this Surgery Configuration?
        </ModalBody>
        <ModalFooter>
          <Button kind="primary" title="Delete" onClick={onConfirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const ConfigurationEditModal = () => {
    return (
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        closeable
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        ref={modalRef}
        overrides={{
          Dialog: {
            style: () => ({
              width: '1300px',
              maxWidth: '90%',
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
        <ModalBody>
          {configurationId !== null && surgeryTypeId && (
            <EditForm
              data={{
                surgeryTypesList,
                configurationId,
                surgeryTypeId,
              }}
              onClose={handleCloseEditModal}
              withLoader={withLoader}
            />
          )}
        </ModalBody>
      </Modal>
    );
  };

  useEffect(() => {
    let timer;
    if (successMessage) {
      setShowModal(true);
      timer = setTimeout(() => {
        setShowModal(false);
        dispatch(clearSuccessMessage()); // Clear success message
      }, 2000); // Hide modal after 2 seconds
    }
    if (errorMessage) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
        dispatch(clearErrorMessage()); // Clear error message
      }, 2000); // Hide modal after 2 seconds
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div id="__next" className="mt-4">
      {isLoading && <Loader />}
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Modular Fields </span>
        {showModal && <div className="text-green-700">{successMessage}</div>}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <div className="flex justify-between">
          <div className="flex ml-5"></div>
          <Button
            kind="secondary"
            title="Add New"
            onClick={handleOpenAddModal}
            startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
          />{' '}
        </div>
      </div>
      <hr className="h-px my-2.5 px-0 mx-0 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      <div className="text-gray-50 w-full  items-center  bg-gray-50 py-4 rounded-lg">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 grid grid-cols-6 rounded-lg">
          <div className="font-bold text-white p-4">S. No.</div>
          <div className="font-bold text-white p-4">Surgery Location</div>
          <div className="font-bold text-white p-4">Surgery Name</div>
          <div className="font-bold text-white p-4">Body Part</div>
          <div className="font-bold text-white p-4">Facility</div>
          <div className="font-bold text-white p-4">Action</div>
          {modifySurgeryConfigList.map((data, index) => (
            <React.Fragment key={data.id}>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {index + 1}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.surgeryType}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.surgeryName}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.bodyPart}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4">
                {data.facility}
              </div>
              <div className="text-gray-900 bg-gray-50 pt-2 px-4 flex gap-4">
                <div
                  onClick={() => {
                    setSurgeryTypeId(data.surgeryTypeId);
                    data.id && handleOpenEditModal(data);
                  }}
                  className="cursor-pointer"
                >
                  <EditIcon className="mt-2"></EditIcon>
                </div>
                <div
                  onClick={() => {
                    setSurgeryTypeId(data.surgeryTypeId);
                    data.id && handleOpenDeleteModal(data.id);
                  }}
                  className="cursor-pointer"
                >
                  <DeleteIcon className="mt-2"></DeleteIcon>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <ConfigurationAddModel />
      {isEditModalOpen && <ConfigurationEditModal />}
      <ConfigurationDeleteModal />
    </div>
  );
};

export default Dashboard;
