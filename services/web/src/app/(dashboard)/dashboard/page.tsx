'use client';
import DataTable, { ColumnConfig } from '@components/DataTable';
import {
  IInsuranceType,
  IPracticeHomes,
  IReferrer,
  ISurgery,
} from '@packages/entities';
import { IEval, ISurgeryType } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import { AddIcon } from '@root/components/Icons';
import Form from '@root/components/dashboard/addSurgery.module';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearSuccessMessage as clearEvalSuccessMessage,
  fetchListings as fetchEvalsList,
} from '@root/store/reducers/evals';
import { fetchListings as fetchInsuranceTypesList } from '@root/store/reducers/insuranceTypes';
import { fetchListings as fetchPracticeHomesListing } from '@root/store/reducers/practiceHomes';
import { fetchListings as fetchReferrerList } from '@root/store/reducers/referrer';
import {
  clearSuccessMessage as clearSurgerySuccessMessage,
  fetchListings as fetchSurgeryList,
} from '@root/store/reducers/surgery';
import { fetchListings as fetchSurgeryTypesListing } from '@root/store/reducers/surgeryTypes';
import { fetchListings as fetchUsersList } from '@root/store/reducers/users';
import { SanitizedUser } from '@root/store/types';
import { getPracticeId, usDateFormatter } from '@root/utils';
import { Modal, ModalBody, ROLE, SIZE } from 'baseui/modal';

import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const { successMessage: addSurgerySuccessMessage } = useAppSelector(
    (state) => ({
      successMessage: state.surgeries.successMessage,
      errorMessage: state.surgeries.errorMessage,
    }),
  );
  const { successMessage: addEvalSuccessMessage } = useAppSelector((state) => ({
    successMessage: state.evals.successMessage,
    errorMessage: state.evals.errorMessage,
  }));
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (practiceId) {
      dispatch(fetchEvalsList({ practiceId }));
      dispatch(fetchSurgeryList({ practiceId }));
      dispatch(fetchInsuranceTypesList({ practiceId }));
      dispatch(fetchPracticeHomesListing({ practiceId }));
      dispatch(fetchSurgeryTypesListing({ practiceId }));
      dispatch(fetchReferrerList({ practiceId }));
      dispatch(fetchUsersList({ practiceId }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    if (addSurgerySuccessMessage || addEvalSuccessMessage) {
      if (practiceId) {
        dispatch(fetchEvalsList({ practiceId }));
        dispatch(fetchSurgeryList({ practiceId }));
        dispatch(clearSurgerySuccessMessage());
        dispatch(clearEvalSuccessMessage());
      }
    }
  }, [addSurgerySuccessMessage, addEvalSuccessMessage, dispatch]);

  useEffect(() => {
    let timer;
    if (addSurgerySuccessMessage || addEvalSuccessMessage) {
      setShowModal(true);
      timer = setTimeout(() => {
        setShowModal(false);
        dispatch(clearSurgerySuccessMessage());
        dispatch(clearEvalSuccessMessage());
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [addSurgerySuccessMessage, addEvalSuccessMessage, dispatch]);

  const practiceHomesList: IPracticeHomes[] = useAppSelector((state) =>
    Object.values(state.practiceHomes.entities),
  );

  const surgeryTypesList: ISurgeryType[] = useAppSelector((state) =>
    Object.values(state.surgeryTypes.entities),
  );

  const insuranceTypesList: IInsuranceType[] = useAppSelector((state) =>
    Object.values(state.insuranceTypes.entities),
  );

  const referrersList: IReferrer[] = useAppSelector((state) =>
    Object.values(state.referrers.entities),
  );

  const usersList: SanitizedUser[] = useAppSelector((state) =>
    Object.values(state.users.entities),
  );

  const evalsList: IEval[] = useAppSelector((state) =>
    Object.values(state.evals.entities),
  );

  const surgeryList: ISurgery[] = useAppSelector((state) =>
    Object.values(state.surgeries.entities),
  );

  const mergedList = [...evalsList, ...surgeryList];
  const modifyEvalList = mergedList
    .map((ele, index) => {
      const viewData = {
        firstName: ele.patient.firstName,
        lastName: ele.patient.lastName,
        mrn: ele.patient.mrn,
        email: ele.patient.email,
        phoneNumber: ele.patient.phoneNumber,
        date: usDateFormatter(ele.date),
        surgeryTypeName: ele.surgeryType.name,
        practiceHomeName: ele.practiceHome.name,
        insuranceDetails: ele.insuranceDetails,
        insuranceTypeName: ele.insuranceType ? ele.insuranceType?.name : '',
        pcp: '',
        referrer: ele.patient.referrer ? ele.patient.referrer.email : '',
        details: ele.patient.details ? ele.patient.details : '',
        eye: ele.eye,
        index: index + 1,
      };

      return viewData;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
              zIndex: 100,
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
              usersList,
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
    date: string;
    practiceHomeName: string;
    surgeryTypeName: string;
    insuranceDetails: string;
    insuranceTypeName: string;
    details: string;
    pcp: string;
    referrer: string;
    index: number;
    eye: string;
  }>[] = [
    { title: 'S. No.', accessor: 'index', id: 'index' },
    { title: 'First Name', accessor: 'firstName', id: 'firstName' },
    { title: 'Last Name', accessor: 'lastName', id: 'lastName' },
    { title: 'MRN', accessor: 'mrn', id: 'mrn' },
    { title: 'Email', accessor: 'email', id: 'email' },
    { title: 'Phone Number', accessor: 'phoneNumber', id: 'phoneNumber' },
    { title: 'Eye', accessor: 'eye', id: 'eye' },
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
          {showModal && (
            <div className="text-green-700">
              {addSurgerySuccessMessage
                ? addSurgerySuccessMessage
                : addEvalSuccessMessage}
            </div>
          )}
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
