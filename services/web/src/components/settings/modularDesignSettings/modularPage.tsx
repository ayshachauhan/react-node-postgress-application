'use client';
import DataTable, { ColumnConfig } from '@components/DataTable';
import { ISurgeryType } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import { AddIcon } from '@root/components/Icons';
import Form from '@root/components/settings/modularDesignSettings/addModularField/addModularField';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchListings as fetchSurgeryTypesListing } from '@root/store/reducers/surgeryTypes';
import { getPracticeId } from '@root/utils';
import { Modal, ModalBody, ROLE, SIZE } from 'baseui/modal';
import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  useEffect(() => {
    if (practiceId) {
      dispatch(fetchSurgeryTypesListing({ practiceId }));
    }
  }, [practiceId, dispatch]);

  const surgeryTypesList: ISurgeryType[] = useAppSelector((state) =>
    Object.values(state.surgeryTypes.entities),
  );

  const modifyEvalList = surgeryTypesList
    .map((ele, index) => {
      let hospitalPricing = 0;
      let professionalPricing = 0;

      if (ele.options) {
        hospitalPricing = Object.values(ele.options)[0].allowedValues[0]
          .hospitalPricing;
        professionalPricing = Object.values(ele.options)[0].allowedValues[0]
          .professionalPricing;
      }
      return {
        surgeryName: ele.name,
        surgeryType: ele.type,
        bodyPart: ele.bodyPart ? ele.bodyPart.join(', ') : '',
        facility: ele.facility ? ele.facility.join(', ') : '',
        index: index + 1,
        hospitalPricing,
        professionalPricing,
      };
    })
    .filter((ele) => ele.surgeryName);

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
          <Form
            onClose={handleCloseAddModal}
            items={{
              surgeryTypesList,
            }}
          />
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
  const columnConfig: ColumnConfig<{
    surgeryType: string;
    surgeryName: string;
    facility: string;
    bodyPart: string;
    hospitalPricing;
    index: number;
    professionalPricing;
  }>[] = [
    { title: 'S. No.', accessor: 'index', id: 'index' },
    { title: 'Surgery Type', accessor: 'surgeryType', id: 'surgeryType' },
    { title: 'Surgery Name', accessor: 'surgeryName', id: 'surgeryName' },
    { title: 'Body Part', accessor: 'bodyPart', id: 'bodyPart' },
    { title: 'Facility', accessor: 'facility', id: 'facility' },
    {
      title: 'Hospital Pricing',
      accessor: 'hospitalPricing',
      id: 'hospitalPricing',
    },
    {
      title: 'Professional Pricing',
      accessor: 'professionalPricing',
      id: 'professionalPricing',
    },
  ];

  return (
    <div id="__next" className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Modular Fields </span>
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
      <div style={{}}>
        <DataTable data={modifyEvalList} columns={columnConfig} />
      </div>
      <FormModal />
    </div>
  );
};

export default Dashboard;
