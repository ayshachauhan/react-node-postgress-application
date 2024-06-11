'use client';

import { USER_PERMISSIONS } from '@packages/entities/permission';
import Button from '@root/components/Button';
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  HomeIcon,
} from '@root/components/Icons';
import Form from '@root/components/eval/addEval/addEval';
import { useUserPermission } from '@root/hooks/userHasPermission';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { fetchCalendars } from '@root/store/reducers/calendar';
import {
  clearSuccessMessage as clearEvalSuccessMessage,
  deleteRecordAsync,
  fetchEvalInfo,
  fetchListings as fetchEvalsList,
} from '@root/store/reducers/evals';
import { fetchListings as fetchInsuranceTypesList } from '@root/store/reducers/insuranceTypes';
import { fetchListings as fetchPatients } from '@root/store/reducers/patient';
import { fetchListings as fetchPracticeHomesListing } from '@root/store/reducers/practiceHomes';
import { fetchListings as fetchReferrerList } from '@root/store/reducers/referrer';
import { fetchListings as fetchSurgeryConfigurationsListing } from '@root/store/reducers/surgeryConfigurations';
import { fetchListings as fetchSurgeryTypesListing } from '@root/store/reducers/surgeryTypes';
import { fetchListings as fetchUsersList } from '@root/store/reducers/users';
import { fetchListings as fetchWaitlist } from '@root/store/reducers/waitlist';
import {
  getDifferenceInDays,
  getPracticeId,
  getUserId,
  toFullName,
  usDateFormatter,
} from '@root/utils';
import { Modal, ModalBody, ROLE } from 'baseui/modal';
import { SIZE } from 'baseui/select';
import React, { useEffect, useState } from 'react';
import EditableRow from 'src/components/eval/editEval/editableRow';
import DeleteEvalModal from './DeleteEvalModal';

const EvalPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const userId = getUserId();
  const userInfo = useAppSelector((state) => state.auth.user);
  const userPermissions = userInfo?.permissions;
  const { calendarSuccessMessage } = useAppSelector((state) => ({
    calendarSuccessMessage: state.calendars.successMessage,
  }));

  const { successMessage: addEvalSuccessMessage, evalInfo } = useAppSelector(
    (state) => ({
      successMessage: state.evals.successMessage,
      errorMessage: state.evals.errorMessage,
      evalInfo: state.evals.evalInfo,
    }),
  );

  const [showModal, setShowModal] = useState(false);
  const editCaseAllowed = useUserPermission(userPermissions, [
    USER_PERMISSIONS.EDIT_CASE,
  ]);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const addCaseAllowed = useUserPermission(userPermissions, [
    USER_PERMISSIONS.ADD_CASE,
  ]);
  const deleteCaseAllowed = useUserPermission(userPermissions, [
    USER_PERMISSIONS.DELETE_CASE,
  ]);

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

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
      dispatch(fetchWaitlist({ practiceId }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    if (addEvalSuccessMessage) {
      if (practiceId) {
        dispatch(fetchEvalsList({ practiceId }));
        dispatch(clearEvalSuccessMessage());
        dispatch(fetchSurgeryConfigurationsListing({ practiceId }));
        dispatch(fetchPatients({ practiceId }));
        dispatch(fetchWaitlist({ practiceId }));
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

  const modifyEvalList = evalsList
    .map((ele, index) => {
      // console.log(ele.);

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
        referrer: ele.patient.referrer ? toFullName(ele.patient.referrer) : '',
        details: ele.patient.details ? ele.patient.details : '',
        index: index + 1,
        id: ele.id,
        bodyPart: ele.bodyPart,
        home: ele.practiceHome.name,
        status: ele.status,
        notes: ele.patient.details ?? '',
        waitlist: ele.waitlist ? ele.waitlist.name : '',
        actionDate:
          usDateFormatter(ele.date) +
          ` (${getDifferenceInDays(new Date(ele.date), new Date())})`,
      };

      return viewData;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  console.log(modifyEvalList);

  const handleEditClick = (rowId: string) => {
    if (practiceId) {
      setSelectedAction('edit');
      dispatch(fetchEvalInfo({ practiceId, id: rowId }));
      setSelectedRow(selectedRow === rowId ? null : rowId);
    }
  };

  const handleCancelClick = () => {
    setSelectedAction('cancel');
    setSelectedRow(null);
  };
  const handleCloseAddModal = (): void => {
    setIsAddModalOpen(false);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setSelectedRow(null);
  };

  const onConfirmDelete = (): void => {
    if (practiceId && selectedRow) {
      try {
        const id = selectedRow;
        dispatch(deleteRecordAsync({ practiceId, id }));
        setIsDeleteModalOpen(false);
        setSelectedRow(null);
      } catch (error) {
        console.log(error);
      }
    }
    setSelectedRow(null);
  };

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

  const handleOpenAddModal = (): void => {
    setSelectedAction('cancel');
    setSelectedRow(null);
    setIsAddModalOpen(true);
  };

  const handleOpenDeleteModal = (Id: string): void => {
    setIsDeleteModalOpen(true);
    setSelectedRow(Id);
  };

  return (
    <div id="__next" className="w-max text-center">
      <div className="flex justify-between border-gray-400 items-center ">
        <span className="text-xl font-bold">Evals </span>
        <div className="flex  justify-between">
          {showModal && (
            <div className="text-green-700">{addEvalSuccessMessage}</div>
          )}
          <div className="flex">
            {addCaseAllowed && (
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
            )}
          </div>
        </div>
      </div>
      <hr className="h-px my-1 px-0 mx-0 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="text-gray-50  items-center bg-gray-50 border-l border rounded-t-lg rounded-b-lg border-gray-200 text-sm overflow-x-auto mt-2">
        <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex flex-row gap-4 p-2">
          <div className="font-bold text-white py-1 px-1 w-28">Date</div>
          <div className="font-bold text-white py-1 px-1 w-28">Action Date</div>
          <div className="font-bold text-white py-1 px-1 w-10">
            <HomeIcon></HomeIcon>
          </div>
          <div className="font-bold text-white text-center py-1 px-1 w-40">
            Status
          </div>
          <div className="font-bold text-white py-1 px-1 w-20">Last Name</div>
          <div className="font-bold text-white py-1 px-1 w-20">First Name</div>
          <div className="font-bold text-white py-1 px-1 w-20">MRN</div>
          <div className="font-bold text-white py-1 px-1 w-40">Email</div>
          <div className="font-bold text-white py-1 px-1 w-20">Surgery</div>
          <div className="font-bold text-white py-1 px-1 w-20">Body Part</div>
          <div className="font-bold text-white py-1 px-1 w-40">Insurance</div>
          <div className="font-bold text-white py-1 px-1 w-40">
            Contact Info.
          </div>
          <div className="font-bold text-white">Action</div>
        </div>
        {modifyEvalList.map((data) =>
          selectedRow === data.id && selectedAction == 'edit' && evalInfo ? (
            <EditableRow
              key={data.id}
              handleCancelClick={handleCancelClick}
              evalInfo={evalInfo}
              setSelectedAction={setSelectedAction}
            />
          ) : (
            <React.Fragment key={data.id}>
              <div className="flex flex-row gap-4 bg-gray-50 px-2 py-0.5 text-center">
                <div
                  className={`text-black  py-0.5 px-1 w-28  flex justify-around items-center`}
                >
                  <div>{data.date}</div>
                </div>
                <div className="text-black  py-0.5 px-1 w-28  flex justify-around items-center">
                  <div>{data.actionDate}</div>
                </div>
                <div className="text-black py-0.5 px-1 w-10 flex items-center justify-around">
                  <div> {data.home[0]}</div>
                </div>
                <div className="text-gray-900 py-0.5 px-0.5 text-center flex justify-around items-center w-40">
                  <div className="rounded-md text-white text-center px-1 bg-indigo-500">
                    {data.status}
                  </div>
                </div>
                <div className="flex flex-col w-max gap-4">
                  <div className="flex flex-row gap-4 text-center">
                    <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                      {data.lastName}
                    </div>
                    <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                      {data.firstName}
                    </div>
                    <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20 pl-5">
                      {data.mrn}
                    </div>
                    <div className="text-black py-0.5 px-1 w-40 overflow-hidden whitespace-nowrap" style={{ textOverflow: 'ellipsis' }}>
                      {data.email}
                    </div>
                    <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                      {data.surgeryConfigName}
                    </div>
                    <div className="text-black py-0.5 px-1 w-20">
                      {data.bodyPart}
                    </div>
                    <div className="text-black py-0.5 px-1 w-40">
                      {data.insuranceTypeName}
                    </div>
                  </div>
                  <div className="flex flex-center gap-4 pl-5">
                    <div className="text-black text-center font-semibold">
                      Waitlist:{' '}
                    </div>
                    <div className="text-black">{data.waitlist}</div>
                    <div className="text-black text-center font-semibold pl-12">
                      Notes:{' '}
                    </div>
                    <div className="text-black">{data.notes}</div>
                  </div>
                </div>
                <div className="flex flex-col text-black py-0.5 px-1 w-40 items-center">
                  <div className="text-black py-0.5 px-1 w-40 text-center overflow-hidden whitespace-nowrap" style={{ textOverflow: 'ellipsis' }}>
                    {data.email}
                  </div>
                  <div className="text-black py-0.5 px-1 w-20 text-center">
                    {data.phoneNumber}
                  </div>
                  <div className="text-black py-0.5 px-1 w-20 text-center">
                    referrer: {data.referrer}
                  </div>
                </div>
                <div className="text-gray-900 flex gap-4">
                  {editCaseAllowed && (
                    <div className="cursor-pointer">
                      <EditIcon
                        style={{ marginRight: '8px', cursor: 'pointer' }}
                        onClick={() => handleEditClick(data.id)}
                      ></EditIcon>
                    </div>
                  )}
                  <div className="cursor-pointer">
                    {deleteCaseAllowed && (
                      <DeleteIcon
                        onClick={() => {
                          setSelectedRow(data.id);
                          handleOpenDeleteModal(data.id);
                        }}
                      ></DeleteIcon>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          ),
        )}
      </div>
      <AddFormModal />
      <DeleteEvalModal
        onConfirmDelete={onConfirmDelete}
        isDeleteModalOpen={isDeleteModalOpen}
        handleCloseDeleteModal={handleCloseDeleteModal}
      />
    </div>
  );
};

export default EvalPage;
