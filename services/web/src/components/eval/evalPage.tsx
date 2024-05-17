'use client';

import Button from '@root/components/Button';
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  HomeIcon,
} from '@root/components/Icons';
import Form from '@root/components/eval/addEval/addEval';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchCalendars } from '@root/store/reducers/calendar';
import {
  clearSuccessMessage as clearEvalSuccessMessage,
  fetchListings as fetchEvalsList,
} from '@root/store/reducers/evals';
import { fetchListings as fetchInsuranceTypesList } from '@root/store/reducers/insuranceTypes';
import { fetchListings as fetchPatients } from '@root/store/reducers/patient';
import { fetchListings as fetchPracticeHomesListing } from '@root/store/reducers/practiceHomes';
import { fetchListings as fetchReferrerList } from '@root/store/reducers/referrer';
import { fetchListings as fetchSurgeryConfigurationsListing } from '@root/store/reducers/surgeryConfigurations';
import { fetchListings as fetchSurgeryTypesListing } from '@root/store/reducers/surgeryTypes';
import { fetchListings as fetchUsersList } from '@root/store/reducers/users';
import {
  getPracticeId,
  getUserId,
  toFullName,
  usDateFormatter,
} from '@root/utils';
import { Modal, ModalBody, ROLE, SIZE } from 'baseui/modal';

import React, { useEffect, useState } from 'react';
const EvalPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const userId = getUserId();
  const { calendarSuccessMessage } = useAppSelector((state) => ({
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
      dispatch(fetchInsuranceTypesList({ practiceId }));
      dispatch(fetchPracticeHomesListing({ practiceId }));
      dispatch(fetchSurgeryTypesListing({ practiceId }));
      dispatch(fetchReferrerList({ practiceId }));
      dispatch(fetchUsersList({ practiceId }));
      dispatch(fetchSurgeryConfigurationsListing({ practiceId }));
      dispatch(fetchPatients({ practiceId }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    if (addEvalSuccessMessage) {
      if (practiceId) {
        dispatch(fetchEvalsList({ practiceId }));
        dispatch(clearEvalSuccessMessage());
        dispatch(fetchSurgeryConfigurationsListing({ practiceId }));
        dispatch(fetchPatients({ practiceId }));
        if (userId) dispatch(fetchCalendars({ practiceId, userId }));
      }
    }
  }, [addEvalSuccessMessage, calendarSuccessMessage, dispatch]);

  useEffect(() => {
    let timer;
    if (addEvalSuccessMessage) {
      setShowModal(true);
      timer = setTimeout(() => {
        setShowModal(false);
        dispatch(clearEvalSuccessMessage());
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [addEvalSuccessMessage, dispatch]);

  const { evalsList } = useAppSelector((state) => ({
    evalsList: Object.values(state.evals.entities),
  }));
  console.log(evalsList);
  const modifyEvalList = evalsList
    .map((ele, index) => {
      const viewData = {
        firstName: ele.patient.firstName,
        lastName: ele.patient.lastName,
        fullName: toFullName(ele?.patient),
        mrn: ele.patient.mrn,
        email: ele.patient.email,
        phoneNumber: ele.patient.phoneNumber,
        date: usDateFormatter(ele.date),
        surgeryConfigName: ele.surgeryConfiguration.name,
        practiceHomeName: ele.practiceHome.name,
        insuranceDetails: ele.insuranceDetails,
        insuranceTypeName: ele.insuranceType ? ele.insuranceType?.name : '',
        pcp: '',
        referrer: ele.patient.referrer ? ele.patient.referrer.email : '',
        details: ele.patient.details ? ele.patient.details : '',
        index: index + 1,
        id: ele.id,
        bodyPart: ele.bodyPart,
        home: ele.practiceHome.name,
        status: ele.status,
      };

      return viewData;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const AddFormModal = () => {
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
              width: '900px',
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
    <div id="__next" className="">
      <div className="flex justify-between border-gray-400 items-center">
        <span className="text-xl font-bold">Evals </span>
        <div className="flex  justify-between">
          {showModal && (
            <div className="text-green-700">{addEvalSuccessMessage}</div>
          )}
          <div className="flex">
            <Button
              kind="secondary"
              title="Add"
              height={40}
              width={80}
              onClick={handleOpenAddModal}
              startEnhancer={() => (
                <AddIcon className="mt-2" size={25}></AddIcon>
              )}
            />
          </div>
        </div>
      </div>
      <hr className="h-px my-1 px-0 mx-0 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="text-gray-50 w-full items-center bg-gray-50 border-l border rounded-t-lg rounded-b-lg border-gray-200 text-sm overflow-x-auto mt-2">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex flex-row gap-4 p-2">
          <div className="font-bold text-white py-1 px-1 w-20">Date</div>
          <div className="font-bold text-white py-1 px-1 w-10">
            <HomeIcon></HomeIcon>
          </div>
          <div className="font-bold text-white text-center py-1 px-1 w-40">
            Status
          </div>
          <div className="font-bold text-white py-1 px-1 w-20">Last Name</div>
          <div className="font-bold text-white py-1 px-1 w-20">First Name</div>
          <div className="font-bold text-white py-1 px-1 w-20">MRN</div>

          <div className="font-bold text-white py-1 px-1 w-20">Surgery</div>
          <div className="font-bold text-white py-1 px-1 w-20">Body Part</div>
          <div className="font-bold text-white">Action</div>
        </div>
        {modifyEvalList.map((data) => (
          <React.Fragment key={data.id}>
            <div className="flex flex-row gap-4 bg-gray-50 px-4 py-2">
              <div className="text-black  py-0.5 px-1 w-20">{data.date}</div>
              <div className="text-black py-0.5 px-1 w-10">{data.home[0]}</div>
              <div className="text-gray-900 py-2 px-0.5 flex text-center flex justify-around items-center w-40">
                <div className="rounded-md text-white text-center p-1 bg-indigo-500">
                  {data.status}
                </div>
              </div>
              <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                {data.lastName}
              </div>
              <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                {data.firstName}
              </div>
              <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                {data.mrn}
              </div>
              <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                {data.surgeryConfigName}
              </div>
              <div className="text-black py-0.5 px-1 w-20">{data.bodyPart}</div>
              <div className="text-gray-900 flex gap-4">
                <div
                  // onClick={() => data.id && handleOpenEditModal(data.id)}
                  className="cursor-pointer"
                >
                  <EditIcon></EditIcon>
                </div>
                <div
                  // onClick={() => data.id && handleOpenDeleteModal(data.id)}
                  className="cursor-pointer"
                >
                  <DeleteIcon></DeleteIcon>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <AddFormModal
      // isModalOpen={isModalOpen}
      // handleCloseModal={handleCloseModal}
      />
      {/* <EditUserModal
        isEditModalOpen={isEditModalOpen}
        handleCloseEditModal={handleCloseEditModal}
        userId={userId}
      />*/}
      {/* <UserDeleteModal />  */}
    </div>
  );
};

export default EvalPage;
