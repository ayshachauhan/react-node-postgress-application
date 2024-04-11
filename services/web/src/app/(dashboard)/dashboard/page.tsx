'use client';
import DataTable, { ColumnConfig } from '@components/DataTable';
import Button from '@root/components/Button';
import { AddIcon } from '@root/components/Icons';
import Form from '@root/components/dashboard/addSurgery.module';
import { Modal, ModalBody, ModalHeader, ROLE, SIZE } from 'baseui/modal';
import React, { useState } from 'react';

const DUMMY_DATA = [
  { name: 'Marlyn', age: 10 },
  { name: 'Luther', age: 15 },
  { name: 'Kiera', age: 13 },
  { name: 'Edna', age: 20 },
  { name: 'Soraya', age: 18 },
  { name: 'Dorris', age: 32 },
  { name: 'Astrid', age: 26 },
  { name: 'Wendie', age: 17 },
  { name: 'Marna', age: 11 },
  { name: 'Malka', age: 14 },
  { name: 'Jospeh', age: 10 },
  { name: 'Roselee', age: 12 },
  { name: 'Justine', age: 35 },
  { name: 'Marlon', age: 30 },
  { name: 'Mellissa', age: 32 },
  { name: 'Fausto', age: 21 },
  { name: 'Alfredia', age: 22 },
  { name: 'Abel', age: 18 },
  { name: 'Winford', age: 19 },
  { name: 'Neil', age: 27 },
];

const Dashboard: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  console.log(isAddModalOpen, 2);
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
  const columnConfig: ColumnConfig<{ name: string; age: number }>[] = [
    { title: 'Name', accessor: 'name', id: 'name' },
    { title: 'Age', accessor: 'age', id: 'age' },
  ];

  return (
    <div id="__next" className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Dashboard </span>
        <div className="flex w-2/6 justify-between">
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
      <div style={{ height: '500px', width: '400px' }}>
        <DataTable data={DUMMY_DATA} columns={columnConfig} />
      </div>
      <FormModal />
    </div>
  );
};

export default Dashboard;
