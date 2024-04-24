'use client';
import Button from '@root/components/Button';
import { AddIcon } from '@root/components/Icons';
import FiltersSection from '@root/components/dashboard/FiltersSection';
import SurgeryPercentage from '@root/components/dashboard/SurgeryPercentage';
import UpcomingSection from '@root/components/dashboard/UpcomingSection';
import UsersListing from '@root/components/dashboard/UsersListing';
import Form from '@root/components/dashboard/addSurgery.module';
import { Modal, ModalBody, ROLE, SIZE } from 'baseui/modal';
import React, { useState } from 'react';

const IndexPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const FormModal = () => {
    return (
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        closeable
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        overrides={{
          Dialog: {
            style: () => ({
              width: '1300px',
              maxWidth: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
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
          <Form onClose={handleCloseAddModal} />
        </ModalBody>
      </Modal>
    );
  };
  const handleCloseAddModal = (): void => {
    setIsAddModalOpen(false);
  };

  const handleOpenAddModal = (): void => {
    setIsAddModalOpen(true);
  };

  return (
    <div id="__next" className="mt-4">
      <div className="flex justify-between border-gray-400 items-center">
        <span className="text-xl font-bold">Dashboard </span>
        <div className="flex w-2/6 justify-between">
          <div className="flex ml-5"></div>
          <Button
            kind="secondary"
            title="Add"
            onClick={handleOpenAddModal}
            startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
          />{' '}
        </div>
      </div>
      <hr className="h-px my-2.5 px-0 mx-0 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="mt-1">
        <div className="flex justify-between gap-4">
          <div className="w-7/12 border border-solid dark:bg-gray-700 rounded-lg px-2.5 py-2">
            <UpcomingSection />
          </div>
          <div className="w-2/12 border border-solid dark:bg-gray-700 rounded-lg px-2.5 py-2 text-lg">
            <UsersListing />
          </div>
          <div className="w-3/12 border border-solid dark:bg-gray-700 rounded-lg px-2.5 py-2 text-lg">
            <SurgeryPercentage />
          </div>
        </div>
      </div>
      <div className="mt-2 mb-12">
        <FiltersSection />
      </div>
      <FormModal />
    </div>
  );
};

export default IndexPage;
