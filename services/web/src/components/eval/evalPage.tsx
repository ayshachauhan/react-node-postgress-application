'use client';
import { EvalEntity } from '@packages/entities/eval';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import Button from '@root/components/Button';
import {
  AddIcon,
  CopyIcon,
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
import {
  fetchCalendars,
  fetchFilteredCalendars,
} from '@root/store/reducers/calendar';
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
  SELECTED_DOCTOR_KEY,
  abbreviatePracticeHome,
  getDifferenceInDays,
  getPracticeId,
  getSelectedMonths,
  getUserId,
  toFullName,
  usDateFormatter,
} from '@root/utils';
import { PAGINATION_LIMIT } from '@root/utils/constants';
import { Checkbox } from 'baseui/checkbox';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import EditableRow from 'src/components/eval/editEval/editableRow';
import AddSurgeryModal from '../dashboard/addSurgeryModal';
import DeleteEvalModal from './DeleteEvalModal';
import AddEvalModal from './addEval/addEvalModal';

const EvalPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();
  const { isLoading, withLoader } = useLoader();
  const { calendarSuccessMessage, addEvalSuccessMessage, evalInfo, userInfo } =
    useAppSelector((state) => ({
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
  const [records, setRecords] = useState<EvalEntity[]>([]);
  const practiceId = getPracticeId();
  let userId = getUserId();
  const userPermissions = userInfo?.permissions;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBookSurgeryOpenModal, setIsBookSurgeryOpenModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEvalsLoading, setIsLoading] = useState(false);
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

  const fetchedPages = useRef(new Set<number>());

  const getEvalsList = async (currentPage: number) => {
    if (
      isEvalsLoading ||
      !hasMore ||
      !practiceId ||
      !userId ||
      fetchedPages.current.has(currentPage)
    )
      return;

    setIsLoading(true);
    fetchedPages.current.add(currentPage);
    try {
      const resultAction = await dispatch(
        fetchEvalsList({
          practiceId,
          doctorId: userId || '',
          page: currentPage,
          limit: PAGINATION_LIMIT,
        }),
      );

      if (fetchEvalsList.fulfilled.match(resultAction)) {
        const data = resultAction.payload;

        if (Array.isArray(data)) {
          setRecords((prevRecords) => {
            const newRecords = data.filter(
              (record) => !prevRecords.some((prev) => prev.id === record.id),
            );

            if (newRecords.length > 0) {
              const newDoctorId = newRecords[0]?.doctor.id;
              const matchingRecords = prevRecords.some(
                (prev) => prev.doctor.id === newDoctorId,
              );

              return matchingRecords
                ? [...prevRecords, ...newRecords]
                : [...newRecords];
            } else {
              return prevRecords;
            }
          });
          if (data.length > PAGINATION_LIMIT) {
            setHasMore(data.length === PAGINATION_LIMIT);
          }
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
    dispatch(fetchInsuranceTypesList({ practiceId }));
    dispatch(fetchPracticeHomesListing({ practiceId }));
    dispatch(fetchSurgeryTypesListing({ practiceId }));
    dispatch(fetchReferrerList({ practiceId }));
    dispatch(fetchUsersList({ practiceId }));
    dispatch(fetchSurgeryConfigurationsListing({ practiceId }));
    dispatch(fetchPatients({ practiceId }));
    dispatch(fetchWaitlist({ practiceId }));
  };

  const resetPagination = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setRecords([]);
    fetchedPages.current.clear();
  }, []);

  const handleRecordAdded = async () => {
    resetPagination();
    await getEvalsList(1);
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Reset copied status after 3 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const loadMore = useCallback(() => {
    if (!isEvalsLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isEvalsLoading, hasMore]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isEvalsLoading
    )
      return;

    loadMore();
  }, [isEvalsLoading, loadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    resetPagination();
  }, [practiceId]);

  useEffect(() => {
    getEvalsList(page);
  }, [page]);

  useEffect(() => {
    const fetchAndReset = async () => {
      if (practiceId) {
        resetPagination();
        await getEvalsList(1);
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
        if (userId) dispatch(fetchCalendars({ practiceId, userId }));
      }
    };

    if (addEvalSuccessMessage) {
      fetchAndReset();
    }
  }, [
    addEvalSuccessMessage,
    calendarSuccessMessage,
    dispatch,
    practiceId,
    userId,
    loggedInUserId,
    month,
    selectedValueStr,
  ]);

  useEffect(() => {
    if (userId) {
      resetPagination();
    }
  }, [userId]);

  useEffect(() => {
    userId = userId || localStorage.getItem(SELECTED_DOCTOR_KEY);
    if (userId) {
      const fetchData = async () => {
        try {
          await getEvalsList(page); // Fetch data with current page
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [page, getEvalsList, userId]);

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

  const modifyEvalList = records.map((ele, index) => {
    const viewData = {
      firstName: ele.patient.firstName,
      lastName: ele.patient.lastName,
      patientId: ele.patient.id,
      fullName: toFullName(ele?.patient),
      mrn: ele.patient.mrn,
      email: ele.patient.email,
      phoneNumber: ele.patient.phoneNumber,
      date: usDateFormatter(ele.date),
      surgeryConfigName: ele.surgeryConfiguration?.name,
      practiceHomeName: ele?.practiceHome?.name,
      insuranceDetails: ele.insuranceDetails,
      insuranceTypeName: ele.insuranceType ? ele.insuranceType?.name : '',
      pcp: '',
      referrer: ele.referrer ? toFullName(ele.referrer) : '',
      pcpInfo: ele.pcp ? toFullName(ele.pcp) : '',
      notes: ele.notes ? ele.notes : '',
      index: index + 1,
      id: ele.id,
      bodyPart: ele.bodyPart,
      home: ele?.practiceHome?.name,
      status: ele.status,
      waitlist: ele.waitlist ? ele.waitlist.name : '',
      actionDate:
        usDateFormatter(ele.date) +
        ` (${getDifferenceInDays(new Date(ele.date), new Date())})`,
      referrerVerified: ele.referrer && ele.referrer.verified ? true : false,
      pcpVerified: ele.pcp && ele.pcp.verified ? true : false,
    };

    return viewData;
  });
  // Commented this line because we are sorting records on the backend by status first & then action date.
  //.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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

  const onConfirmDelete = async () => {
    if (practiceId && selectedRow) {
      try {
        const id = selectedRow;
        await dispatch(deleteRecordAsync({ practiceId, id }));
        setIsDeleteModalOpen(false);
        setSelectedRow(null);
        resetPagination();
        await getEvalsList(1);
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
    <div id="__next" className="">
      {isEvalsLoading && page == 1 && <Loader />}
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
                padding="5px 8px"
                onClick={handleOpenAddModal}
                startEnhancer={() => <AddIcon></AddIcon>}
              />
            )}
          </div>
        </div>
      </div>
      <hr className="h-px my-1 px-0 mx-0 bg-gray-100 border-1 border-gray-100" />
      <div className="table-responsive overflow-x-auto rounded-lg">
        <table className=" rounded-lg">
          <tbody>
            <tr className="">
              <th className="">Date</th>
              <th className="">Action Date</th>
              <th className="">
                <HomeIcon></HomeIcon>
              </th>
              <th className="">Status</th>
              <th className="">Last Name</th>
              <th className="">First Name</th>
              <th className="">MRN</th>
              <th className="">Email</th>
              <th className="">Surgery</th>
              <th className="">Body Part</th>
              <th className="">Insurance</th>
              <th className="">Contact Info.</th>
              <th className="">Action</th>
            </tr>
            {!isLoading &&
              modifyEvalList.map((data) =>
                selectedRow === data.id &&
                selectedAction == 'edit' &&
                evalInfo ? (
                  <EditableRow
                    key={data.id}
                    handleCancelClick={handleCancelClick}
                    evalInfo={evalInfo}
                    setSelectedAction={setSelectedAction}
                    withLoader={withLoader}
                    onRecordEdited={handleRecordAdded}
                  />
                ) : (
                  <React.Fragment key={data.id}>
                    <tr className="border-t border-gray-300">
                      <td rowSpan={2}>
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
                      </td>

                      <td rowSpan={2} className="">
                        <div>{data.actionDate}</div>
                      </td>
                      <td
                        rowSpan={2}
                        className="cursor-pointer text-center"
                        title={data.home}
                      >
                        <div> {abbreviatePracticeHome(data.home)}</div>
                      </td>
                      <td rowSpan={2} className="">
                        <div className="rounded-md text-white text-center py-1 px-2 bg-indigo-500">
                          {data.status}
                        </div>
                      </td>
                      <td rowSpan={1} className="">
                        {data.lastName}
                      </td>
                      <td rowSpan={1} className="">
                        {data.firstName}
                      </td>
                      <td rowSpan={1} className="">
                        <div>
                          <div className="flex">
                            <div>{data.mrn}</div>
                            <div>
                              <CopyIcon
                                style={{
                                  marginRight: '4px',
                                  cursor: 'pointer',
                                }}
                                onClick={() => handleCopy(String(data.mrn))}
                                size={13}
                                title={copied ? 'Copied!' : 'Copy'}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        rowSpan={1}
                        className=""
                        style={{ textOverflow: 'ellipsis' }}
                      >
                        {data.email}
                      </td>
                      <td rowSpan={1} className="">
                        {data.surgeryConfigName}
                      </td>
                      <td rowSpan={1} className="">
                        {data.bodyPart}
                      </td>
                      <td rowSpan={2} className="">
                        {data.insuranceTypeName}
                      </td>

                      <td rowSpan={2} className="">
                        <div
                          className="whitespace-nowrap"
                          style={{ textOverflow: 'ellipsis' }}
                        >
                          {data.email}
                        </div>
                        <div className="">{data.phoneNumber}</div>
                        <span
                          style={{
                            display: 'flex',
                          }}
                        >
                          Referrer: {data.referrer}&nbsp;
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'start',
                            }}
                          >
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
                          </span>
                        </span>
                        <span
                          style={{
                            display: 'flex',
                          }}
                        >
                          PCP: {data.pcpInfo}&nbsp;
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'start',
                            }}
                          >
                            {data.pcpVerified && (
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
                          </span>
                        </span>
                      </td>
                      <td rowSpan={2} className="">
                        <div className="flex items-center gap-1">
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
                              padding="3px 8px"
                              onClick={() =>
                                handleOpenBookSurgeryModal(data.id)
                              }
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6} className="bg-white">
                        <span className="font-semibold">Waitlist: </span>

                        {data.waitlist}
                        <br />
                        <span className="font-semibold">Notes: </span>
                        <br />
                        {data?.notes}
                      </td>
                    </tr>
                  </React.Fragment>
                ),
              )}
          </tbody>
        </table>
      </div>
      <AddEvalModal
        isSecondModalOpen={isAddModalOpen}
        handleCloseSecondModal={handleCloseAddModal}
        withLoader={withLoader}
        onRecordAdded={handleRecordAdded}
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
        onRecordAdded={handleRecordAdded}
      />
    </div>
  );
};

export default EvalPage;
