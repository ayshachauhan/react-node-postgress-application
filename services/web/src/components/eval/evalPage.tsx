'use client';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import Button from '@root/components/Button';
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  HomeIcon,
} from '@root/components/Icons';
import Loader from '@root/components/loader';
import { EVAL_STATUS } from '@root/enums/evalStatus.enum';
import { useLoader } from '@root/hooks/useLoader';
import { useUserPermission } from '@root/hooks/userHasPermission';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { fetchFilteredCalendars } from '@root/store/reducers/calendar';
import {
  clearData,
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
  getSelectedMonths,
  getUserId,
  toFullName,
  usDateFormatter,
} from '@root/utils';
import { Checkbox } from 'baseui/checkbox';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import EditableRow from 'src/components/eval/editEval/editableRow';
import AddSurgeryModal from '../dashboard/addSurgeryModal';
import DeleteEvalModal from './DeleteEvalModal';
import AddEvalModal from './addEval/addEvalModal';

const EvalPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { isLoading, withLoader } = useLoader();
  const {
    evalsList,
    calendarSuccessMessage,
    addEvalSuccessMessage,
    evalInfo,
    userInfo,
  } = useAppSelector((state) => ({
    evalsList: Object.values(state.evals.entities),
    calendarSuccessMessage: state.calendars.successMessage,
    addEvalSuccessMessage: state.evals.successMessage,
    errorMessage: state.evals.errorMessage,
    evalInfo: state.evals.evalInfo,
    userInfo: state.auth.user,
  }));
  const loggedInUserId = userInfo?.id ?? null;
  const handleViewHistory = (id: string): void => {
    const query = { id };
    const queryString = new URLSearchParams(query).toString();
    const url = `/history/?${queryString}`;
    router.push(url);
  };

  const practiceId = getPracticeId();
  const userId = getUserId();
  const userPermissions = userInfo?.permissions;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBookSurgeryOpenModal, setIsBookSurgeryOpenModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const editCaseAllowed = useUserPermission(userPermissions, [
    USER_PERMISSIONS.EDIT_CASE,
  ]);

  const addCaseAllowed = useUserPermission(userPermissions, [
    USER_PERMISSIONS.ADD_CASE,
  ]);
  const deleteCaseAllowed = useUserPermission(userPermissions, [
    USER_PERMISSIONS.DELETE_CASE,
  ]);

  const viewHistory = useUserPermission(userPermissions, [
    USER_PERMISSIONS.VIEW_HX,
  ]);
  useEffect(() => {
    dispatch(clearData());
  }, [dispatch, practiceId]);
  const { selectedMonth, selectedValue } = useAppSelector(
    (state) => state.surgeries.surgeryFilters,
  );
  const selectedValueStr = selectedValue || '';

  const month = getSelectedMonths(selectedMonth);

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  useEffect(() => {
    if (practiceId) {
      const loadData = async () => {
        await withLoader(async () => {
          await dispatch(fetchEvalsList({ practiceId }));
        });
      };

      loadData();
      dispatch(fetchInsuranceTypesList({ practiceId }));
      dispatch(fetchPracticeHomesListing({ practiceId }));
      dispatch(fetchSurgeryTypesListing({ practiceId }));
      dispatch(fetchReferrerList({ practiceId }));
      dispatch(fetchUsersList({ practiceId }));
      dispatch(fetchSurgeryConfigurationsListing({ practiceId }));
      dispatch(fetchPatients({ practiceId }));
      dispatch(fetchWaitlist({ practiceId }));
    }
  }, [practiceId, dispatch, withLoader]);

  useEffect(() => {
    if (addEvalSuccessMessage) {
      if (practiceId) {
        const loadData = async () => {
          await withLoader(async () => {
            dispatch(fetchEvalsList({ practiceId }));
          });
        };

        loadData();
        dispatch(clearEvalSuccessMessage());
        dispatch(fetchSurgeryConfigurationsListing({ practiceId }));
        dispatch(fetchPatients({ practiceId }));
        dispatch(fetchWaitlist({ practiceId }));
        if (userId && loggedInUserId !== null) {
          dispatch(
            fetchFilteredCalendars({
              practiceId,
              userId,
              month,
              option: selectedValueStr,
              loggedInUserId,
            }),
          );
        }
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

  const modifyEvalList = evalsList
    .map((ele, index) => {
      const viewData = {
        firstName: ele.patient.firstName,
        lastName: ele.patient.lastName,
        patientId: ele.patient.id,
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
        referrerVerified:
          ele.patient.referrer && ele.patient.referrer.verified ? true : false,
      };

      return viewData;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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

  const handleOpenAddModal = (): void => {
    setSelectedAction('cancel');
    setSelectedRow(null);
    setIsAddModalOpen(true);
  };

  const handleOpenDeleteModal = (Id: string): void => {
    setIsDeleteModalOpen(true);
    setSelectedRow(Id);
  };

  const handleCloseBookSurgeryModal = (): void => {
    setIsBookSurgeryOpenModal(false);
  };

  const handleOpenBookSurgeryModal = (id: string): void => {
    if (practiceId) dispatch(fetchEvalInfo({ practiceId, id }));

    setIsBookSurgeryOpenModal(true);
  };

  return (
    <div id="__next" className="text-center">
      {isLoading && <Loader />}
      <div className="flex justify-between border-gray-400 items-center ">
        <span className="text-xl font-bold">Evals</span>
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
                startEnhancer={() => <AddIcon></AddIcon>}
              />
            )}
          </div>
        </div>
      </div>
      <hr className="h-px my-1 px-0 mx-0 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="text-gray-50  items-center bg-gray-50 border-l border rounded-t-lg rounded-b-lg border-gray-200 text-sm overflow-x-auto w-max mt-2">
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
        {!isLoading &&
          modifyEvalList.map((data) =>
            selectedRow === data.id && selectedAction == 'edit' && evalInfo ? (
              <EditableRow
                key={data.id}
                handleCancelClick={handleCancelClick}
                evalInfo={evalInfo}
                setSelectedAction={setSelectedAction}
                withLoader={withLoader}
              />
            ) : (
              <React.Fragment key={data.id}>
                <div className="flex flex-row gap-4 bg-gray-50 px-2 py-0.5 text-center border-b-2">
                  <div
                    className={`text-black  py-0.5 px-1 w-28  flex justify-around items-center`}
                  >
                    <div>
                      {viewHistory ? (
                        <div
                          onClick={() => handleViewHistory(data.patientId)}
                          className="cursor-pointer underline"
                        >
                          {data.date}
                        </div>
                      ) : (
                        <div>{data.date}</div>
                      )}
                    </div>
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
                      <div
                        className="text-black py-0.5 px-1 w-40 overflow-hidden whitespace-nowrap"
                        style={{ textOverflow: 'ellipsis' }}
                      >
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
                    <div
                      className="text-black py-0.5 px-1 w-40 text-center overflow-hidden whitespace-nowrap"
                      style={{ textOverflow: 'ellipsis' }}
                    >
                      {data.email}
                    </div>
                    <div className="text-black py-0.5 px-1 w-20 text-center">
                      {data.phoneNumber}
                    </div>
                    <div className="flex justify-center items-center  w-40 ">
                      <div className="text-black py-0.5 px-1 text-center">
                        referrer: {data.referrer}
                      </div>
                      <div>
                        {data.referrerVerified && (
                          <Checkbox
                            checked={true}
                            overrides={{
                              Checkmark: {
                                style: ({ $checked }) => ({
                                  backgroundColor: $checked
                                    ? 'rgba(34, 197, 94, 1)'
                                    : 'white',
                                  borderColor: $checked
                                    ? 'rgba(34, 197, 94, 1)'
                                    : 'rgba(113, 113, 122, 1)',
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '2px',
                                  borderWidth: '2px',
                                }),
                              },
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-900 flex flex-col gap-1">
                    <div className="flex flex-row gap-1">
                      {editCaseAllowed && (
                        <div className="cursor-pointer ">
                          <EditIcon
                            style={{ cursor: 'pointer' }}
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
                          />
                        )}
                      </div>
                    </div>
                    {addCaseAllowed && (
                      <Button
                        disabled={data.status === EVAL_STATUS.Book}
                        kind="secondary"
                        title={
                          data.status === EVAL_STATUS.Book
                            ? 'Nurtured'
                            : 'Nurture'
                        }
                        fontSize="10px"
                        height={24}
                        width={50}
                        onClick={() => handleOpenBookSurgeryModal(data.id)}
                      />
                    )}
                  </div>
                </div>
              </React.Fragment>
            ),
          )}
      </div>
      <AddEvalModal
        isSecondModalOpen={isAddModalOpen}
        handleCloseSecondModal={handleCloseAddModal}
        withLoader={withLoader}
      />
      <DeleteEvalModal
        onConfirmDelete={onConfirmDelete}
        isDeleteModalOpen={isDeleteModalOpen}
        handleCloseDeleteModal={handleCloseDeleteModal}
      />

      <AddSurgeryModal
        isModalOpen={isBookSurgeryOpenModal}
        handleCloseModal={handleCloseBookSurgeryModal}
        autoFillFromEval={true}
        withLoader={withLoader}
      />
    </div>
  );
};

export default EvalPage;
