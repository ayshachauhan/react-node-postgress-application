'use client';
import DataTable, { ColumnConfig } from '@components/DataTable';
import { IInsuranceType, IPracticeHomes, IReferrer } from '@packages/entities';
import { IEval, ISurgeryType } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import { AddIcon } from '@root/components/Icons';
import Form from '@root/components/dashboard/addSurgery.module';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchListings } from '@root/store/reducers/evals';
import { fetchListings as fetchInsuranceTypesList } from '@root/store/reducers/insuranceTypes';
import { fetchListings as fetchPracticeHomesListing } from '@root/store/reducers/practiceHomes';
import { fetchListings as fetchReferrerList } from '@root/store/reducers/referrer';
import { fetchListings as fetchSurgeryTypesListing } from '@root/store/reducers/surgeryTypes';
import { getPracticeId } from '@root/utils';
import { Modal, ModalBody, ROLE, SIZE } from 'baseui/modal';
import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();

  useEffect(() => {
    if (practiceId) {
      dispatch(fetchListings({ practiceId }));
      dispatch(fetchInsuranceTypesList({ practiceId }));
      dispatch(fetchPracticeHomesListing({ practiceId }));
      dispatch(fetchSurgeryTypesListing({ practiceId }));
      dispatch(fetchReferrerList({ practiceId }));
    }
  }, [practiceId, dispatch]);

  const practiceHomesList: IPracticeHomes[] = useAppSelector((state) =>
    Object.values(state.practiceHomes.entities),
  );

  const surgeryTypesList: ISurgeryType[] = useAppSelector((state) =>
    Object.values(state.surgeryTypes.entities),
  );

  const insuranceTypesList: IInsuranceType[] = useAppSelector((state) =>
    Object.values(state.insuranceTypes.entities),
  );

  const evalsList: IEval[] = useAppSelector((state) =>
    Object.values(state.evals.entities),
  );

  const referrersList: IReferrer[] = useAppSelector((state) =>
    Object.values(state.referrers.entities),
  );

  const modifyEvalList = evalsList.map((ele) => ({
    firstName: ele.patient.firstName,
    lastName: ele.patient.lastName,
    mrn: ele.patient.mrn,
    email: ele.patient.email,
    phoneNumber: ele.patient.phoneNumber,
    date: ele.date,
    surgeryTypeName: ele.surgeryType.name,
    practiceHomeName: ele.practiceHome.name,
    insuranceDetails: ele.insuranceDetails,
    insuranceTypeName: ele.insuranceType ? ele.insuranceType?.name : '',
    pcp: '',
    referrer: '',
    details: ele.patient.details ? ele.patient.details : '',
  }));

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
          <Form
            onClose={handleCloseAddModal}
            items={{
              practiceHomesList,
              surgeryTypesList,
              insuranceTypesList,
              referrersList,
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
    mrn: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    date: Date;
    practiceHomeName: string;
    surgeryTypeName: string;
    insuranceDetails: string;
    insuranceTypeName: string;
    details: string;
    pcp: string;
    referrer: string;
  }>[] = [
    { title: 'First Name', accessor: 'firstName', id: 'firstName' },
    { title: 'Last Name', accessor: 'lastName', id: 'lastName' },
    { title: 'MRN', accessor: 'mrn', id: 'mrn' },
    { title: 'Email', accessor: 'email', id: 'email' },
    { title: 'Phone Number', accessor: 'phoneNumber', id: 'phoneNumber' },
    { title: 'Date', accessor: 'date', id: 'date' },
    { title: 'Home', accessor: 'practiceHomeName', id: 'practiceHomeName' },
    {
      title: 'Surgery Type',
      accessor: 'surgeryTypeName',
      id: 'surgeryTypeName',
    },
    {
      title: 'Insurance Type',
      accessor: 'insuranceTypeName',
      id: 'insuranceTypeName',
    },
    {
      title: 'Insurance Details',
      accessor: 'insuranceDetails',
      id: 'insuranceDetails',
    },

    { title: 'Pcp', accessor: 'pcp', id: 'pcp' },
    { title: 'Referrer', accessor: 'referrer', id: 'referrer' },
    { title: 'Notes', accessor: 'details', id: 'details' },
  ];

  return (
    <div id="__next" className="mt-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Dashboard </span>
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
