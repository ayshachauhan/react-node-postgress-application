'use client';

import Button from '@root/components/Button';
import { AddIcon } from '@root/components/Icons';
import Form from '@root/components/dashboard/AddSurgery';
import FiltersSection from '@root/components/dashboard/FiltersSection';
import SurgeryPercentage from '@root/components/dashboard/SurgeryPercentage';
import UpcomingSection from '@root/components/dashboard/UpcomingSection';
import UsersListing from '@root/components/dashboard/UsersListing';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchCalendars } from '@root/store/reducers/calendar';
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
import { fetchListings as fetchSurgeryConfigurationsListing } from '@root/store/reducers/surgeryConfigurations';
import { fetchListings as fetchSurgeryTypesListing } from '@root/store/reducers/surgeryTypes';
import { fetchListings as fetchUsersList } from '@root/store/reducers/users';

import { getPracticeId, getUserId } from '@root/utils';
import { Modal, ModalBody, ROLE, SIZE } from 'baseui/modal';

import React, { useEffect, useState } from 'react';
const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const userId = getUserId();
  const { successMessage: addSurgerySuccessMessage, calendarSuccessMessage } =
    useAppSelector((state) => ({
      successMessage: state.surgeries.successMessage,
      errorMessage: state.surgeries.errorMessage,
      calendarSuccessMessage: state.calendars.successMessage,
    }));
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
      dispatch(fetchSurgeryConfigurationsListing({ practiceId }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    if (addSurgerySuccessMessage || addEvalSuccessMessage) {
      if (practiceId) {
        dispatch(fetchEvalsList({ practiceId }));
        dispatch(fetchSurgeryList({ practiceId }));
        dispatch(clearSurgerySuccessMessage());
        dispatch(clearEvalSuccessMessage());
        dispatch(fetchSurgeryConfigurationsListing({ practiceId }));
        if (userId) dispatch(fetchCalendars({ practiceId, userId }));
      }
    }
  }, [
    addSurgerySuccessMessage,
    addEvalSuccessMessage,
    calendarSuccessMessage,
    dispatch,
  ]);

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

  const {
    practiceHomesList,
    surgeryTypesList,
    insuranceTypesList,
    referrersList,
    usersList,
    calendars,
  } = useAppSelector((state) => ({
    practiceHomesList: Object.values(state.practiceHomes.entities),
    surgeryTypesList: Object.values(state.surgeryTypes.entities),
    insuranceTypesList: Object.values(state.insuranceTypes.entities),
    referrersList: Object.values(state.referrers.entities),
    usersList: Object.values(state.users.entities),
    calendars: Object.values(state.calendars.entities),
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
              usersList,
              calendars,
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

  return (
    <div id="__next" className="mt-4">
      <div className="flex justify-between border-gray-400 items-center">
        <span className="text-xl font-bold">Dashboard </span>
        <div className="flex w-2/6 justify-between">
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
            title="Add"
            onClick={handleOpenAddModal}
            startEnhancer={() => <AddIcon className="mt-2" size={25}></AddIcon>}
          />{' '}
        </div>
      </div>
      <hr className="h-px my-2.5 px-0 mx-0 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="mt-1">
        <div className="flex justify-between gap-4">
          <div className="w-7/12 border border-solid rounded-lg px-2.5 py-2">
            <UpcomingSection />
          </div>
          <div className="w-2/12 border border-solid rounded-lg px-2.5 py-2 text-lg">
            <UsersListing />
          </div>
          <div className="w-3/12 border border-solid rounded-lg px-2.5 py-2 text-lg">
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

export default DashboardPage;
