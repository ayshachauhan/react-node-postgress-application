import {
  MonthOption,
  ReviewStatus,
  USER_PERMISSIONS,
} from '@packages/entities';
import Button from '@root/components/Button';
import {
  CopyIcon,
  DeleteIcon,
  DisplayIcon,
  EditIcon,
  HomeIcon,
  SearchIcon,
  StarIcon,
  ViewIcon,
} from '@root/components/Icons';
import TextInput from '@root/components/TextInput';
import Loader from '@root/components/loader';
import { useLoader } from '@root/hooks/useLoader';
import { useUserPermission } from '@root/hooks/userHasPermission';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchFilteredCalendars } from '@root/store/reducers/calendar';
import { fetchListings as fetchMedia } from '@root/store/reducers/media';
import {
  fetchListings as fetchReviews,
  sendReviewRequestAsyncThunk,
} from '@root/store/reducers/review';
import {
  deleteRecordAsync,
  fetchListings,
  fetchSurgeryInfo,
  setSearchMRNName,
  setSelectedMonth,
  setSelectedValue,
} from '@root/store/reducers/surgery';
import {
  getColorForSurgeryStatus,
  getSelectedMonths,
  getUserId,
  toFullName,
  toPascalCase,
  usDateFormatter,
} from '@root/utils';
import { monthOptions } from '@root/utils/constants';
import { Checkbox } from 'baseui/checkbox';
import { Select } from 'baseui/select';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import DeleteFilterModal from './DeleteFilterModal';
import EditableRow from './EditableRow';
import ViewRow from './ViewRow';
import AddSurgeryModal from './addSurgeryModal';

const FiltersSection: React.FC<{
  practiceId: string;
  withLoader: (func: () => Promise<void>) => Promise<void>;
  isLoading: boolean;
  onReviewClickError;
  onReviewClickSuccess;
}> = ({
  practiceId,
  withLoader,
  isLoading,
  onReviewClickError,
  onReviewClickSuccess,
}) => {
  const dispatch = useAppDispatch();

  const {
    selectedMonth,
    searchMRNName,
    selectedValue,
    reviews,
    errorMessage,
    surgeryList,
    surgeryConfigList,
    userInfo,
  } = useAppSelector((state) => ({
    selectedMonth: state.surgeries.surgeryFilters.selectedMonth,
    searchMRNName: state.surgeries.surgeryFilters.searchMRNName,
    selectedValue: state.surgeries.surgeryFilters.selectedValue,
    reviews: Object.values(state.reviews.entities),
    errorMessage: state.surgeries.errorMessage,
    surgeryList: Object.values(state.surgeries.entities),
    surgeryConfigList: Object.values(state.surgeryConfigurations.entities),
    waitlist: Object.values(state.waitlist.entities),
    userInfo: state.auth.user,
  }));

  const {
    isLoading: reviewSendingIsLoading,
    withLoader: reviewSenderWithLoader,
  } = useLoader();

  const router = useRouter();

  const [reviewErrorMessage, setReviewErrorMessage] = useState<string>('');
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isWailistViewActive, setIsWailistViewActive] = useState(false);
  const [isIolViewActive, setIsIolViewActive] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedSurgery, setSelectedSurgery] = useState({});
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [editableRows, setEditableRows] = useState<string[]>([]);
  const loggedInUserId = userInfo?.id ?? null;
  const userPermissions = userInfo?.permissions;

  const viewPastCases = useUserPermission(userPermissions, [
    USER_PERMISSIONS.VIEW_PAST_CASES,
  ]);

  const viewFutureCases = useUserPermission(userPermissions, [
    USER_PERMISSIONS.VIEW_FUTURE_CASES,
  ]);

  const deleteCaseAllowed = useUserPermission(userPermissions, [
    USER_PERMISSIONS.DELETE_CASE,
  ]);

  const editCaseAllowed = useUserPermission(userPermissions, [
    USER_PERMISSIONS.EDIT_CASE,
  ]);

  const viewBillingColumn = useUserPermission(userPermissions, [
    USER_PERMISSIONS.VIEW_BILLING,
  ]);

  const viewHistory = useUserPermission(userPermissions, [
    USER_PERMISSIONS.VIEW_HX,
  ]);

  const viewReviews = useUserPermission(userPermissions, [
    USER_PERMISSIONS.VIEW_REP,
  ]);

  const getMonthOptions = (
    viewPastCases: boolean,
    viewFutureCases: boolean,
  ) => {
    const currentMonth = new Date().getMonth() + 1;
    return monthOptions.map((option) => {
      const optionMonth = parseInt(option.value, 10);
      const isPastMonth = optionMonth < currentMonth;
      const isFutureMonth = optionMonth > currentMonth;
      return {
        ...option,
        disabled:
          (!viewPastCases && isPastMonth) ||
          (!viewFutureCases && isFutureMonth),
      };
    });
  };

  const updatedMonthOptions: MonthOption[] = useMemo(
    () => getMonthOptions(viewPastCases, viewFutureCases),
    [viewPastCases, viewFutureCases],
  );
  const [isReviewRequestLoading, setIsReviewRequestLoading] = useState(false);

  const doctorId = getUserId();

  const surgeryOptionsHeadersObj: {
    [key: string]: {
      surgeryOptionsHeaders: string[];
      checkListHeaders: string[];
      conditionalHeaders: string[];
    };
  } = {};

  if (surgeryConfigList.length) {
    surgeryConfigList.forEach((ele) => {
      // logic to place parent condition always ahead of dependant condition
      let conditionalHeaders = Object.keys(ele.conditionalOptions);
      if (
        conditionalHeaders &&
        conditionalHeaders.length &&
        ele.conditionalOptions[conditionalHeaders[0]].dependsUpon
      ) {
        conditionalHeaders = conditionalHeaders.reverse();
      }
      surgeryOptionsHeadersObj[ele.name] = {
        surgeryOptionsHeaders: Object.keys(ele.options),
        checkListHeaders: Object.keys(ele.checkList),
        conditionalHeaders: conditionalHeaders,
      };
    });
  }

  const actionIcons = (row) => (
    <div style={{ display: 'flex' }}>
      {viewReviews && (
        <StarIcon
          style={{ marginRight: '4px', cursor: 'pointer' }}
          onClick={() => handleSendReviewRequest(row)}
        />
      )}
      <CopyIcon
        style={{ marginRight: '4px', cursor: 'pointer' }}
        onClick={() => handleCloneClick(row.id)}
      />
      <DisplayIcon
        style={{ marginRight: '4px', cursor: 'pointer' }}
        onClick={() => {
          handlePatientMedia(row.mrn);
        }}
      />
      <ViewIcon
        style={{ marginRight: '4px', cursor: 'pointer' }}
        onClick={() => {
          handleViewClick(row.id);
          setSelectedSurgery(row);
        }}
      />
      {editCaseAllowed && (
        <EditIcon
          style={{ marginRight: '4px', cursor: 'pointer' }}
          onClick={() => handleEditClick(row.id)}
        />
      )}
      {deleteCaseAllowed && (
        <DeleteIcon
          style={{ cursor: 'pointer' }}
          onClick={() => handleOpenDeleteModal(row.id)}
        />
      )}
    </div>
  );

  const getUpdatedOptions = (
    viewPastCases: boolean,
    viewFutureCases: boolean,
  ) => [
    { label: 'Upcoming View', value: 'upcoming', disabled: !viewFutureCases },
    { label: 'Waitlist View', value: 'waitlist' },
    { label: 'IOL View', value: 'iol' },
    { label: 'Past View', value: 'past', disabled: !viewPastCases },
  ];

  const updatedOptions = useMemo(
    () => getUpdatedOptions(viewPastCases, viewFutureCases),
    [viewPastCases, viewFutureCases],
  );

  const modifiedObj = {};
  surgeryList.forEach((ele, index) => {
    const modifiedDate: string = usDateFormatter(ele.date);
    const viewData = {
      id: ele.id,
      firstName: ele.patient.firstName,
      lastName: ele.patient.lastName,
      patientId: ele.patient.id,
      mrn: ele.patient.mrn,
      email: ele.patient.email,
      phoneNumber: ele.patient.phoneNumber,
      date: modifiedDate,
      surgery: ele.surgeryConfiguration.name,
      home: ele.practiceHome.name,
      insuranceDetails: ele.insuranceDetails,
      insurance: ele.insuranceType ? ele.insuranceType?.name : '',
      pcp: '',
      referrer: ele.patient.referrer ? toFullName(ele.patient.referrer) : '',
      notes: ele.notes ? ele.notes : '',
      bodyPart: ele.bodyPart,
      index: index + 1,
      hospital: ele.totalHospitalPricing,
      prof: ele.totalProfessionalPricing,
      count:
        ele?.surgeryConfiguration?.name.toLowerCase() === 'cataract'
          ? ele?.count
          : '',
      action: actionIcons,
      surgeryOrder: ele.surgeryOrder,
      surgeryStatus: ele.surgeryStatus,
      selectedSurgeryOptions: ele.selectedSurgeryOptions,
      selectedChecklistOptions: ele.selectedCheckListOptions,
      selectedConditionalOptions: ele.selectedConditionalOptions,
      waitlist: ele?.waitlist?.name,
      referrerVerified:
        ele.patient.referrer && ele.patient.referrer.verified ? true : false,
    };

    const optionArr = Object.keys(ele.surgeryConfiguration.options);
    const conditionalOptionsArr = Object.keys(
      ele.surgeryConfiguration.conditionalOptions,
    );

    optionArr.forEach((option) => {
      viewData[`${option}-count`] =
        ele.surgeryConfiguration.options[option]?.count;
    });

    conditionalOptionsArr.forEach((condition) => {
      viewData[`${condition}-count`] =
        ele.surgeryConfiguration.conditionalOptions[condition]?.count;
    });

    Object.keys(ele.selectedSurgeryOptions).forEach((data) => {
      viewData[data] = ele.selectedSurgeryOptions[data].value;
    });

    Object.keys(ele.selectedConditionalOptions).forEach((data) => {
      viewData[data] = ele.selectedConditionalOptions[data].value;
    });

    ele.selectedCheckListOptions &&
      Object.keys(ele.selectedCheckListOptions).forEach((data) => {
        viewData[data] = ele.selectedCheckListOptions[data].value;
      });

    const modifiedObjKey: string = modifiedDate;

    if (modifiedObj[modifiedObjKey]) {
      if (modifiedObj[modifiedObjKey][modifiedDate]) {
        modifiedObj[modifiedObjKey][modifiedDate].push(viewData);
      } else {
        modifiedObj[modifiedObjKey][modifiedDate] = [viewData];
      }
    } else {
      modifiedObj[modifiedObjKey] = {
        [modifiedDate]: [viewData],
      };
    }

    return viewData;
  });

  const onConfirmDelete = (): void => {
    try {
      if (selectedRow) {
        dispatch(deleteRecordAsync({ practiceId, id: selectedRow }));
        setSelectedRow(null);
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const calculatedBookesSlots = (date): number => {
    console.log(date, 'date');

    return 14;
  };

  const handleChangeValue = ({ value }) => {
    dispatch(setSelectedValue(value[0] ? value[0].label : null));
    const selectedLabel = value.length > 0 ? value[0].label.toLowerCase() : '';

    if (selectedLabel === 'past view' || selectedLabel === 'upcoming view') {
      dispatch(setSelectedMonth([]));
      setIsIolViewActive(false);
      setIsWailistViewActive(false);
    }
    if (selectedLabel === 'waitlist view') {
      setIsWailistViewActive(true);
      setIsIolViewActive(false);
    }
    if (selectedLabel === 'iol view') {
      setIsIolViewActive(true);
      setIsWailistViewActive(false);
    }
  };

  const handleChangeMonth = ({ value }) => {
    dispatch(setSelectedMonth(value));
  };
  const sendReqest = async (id: string, patientEmail: string) => {
    if (practiceId && id) {
      try {
        setIsReviewRequestLoading(true);
        await reviewSenderWithLoader(async () => {
          const response = await dispatch(
            sendReviewRequestAsyncThunk({ practiceId, id }),
          );
          if (response?.meta?.requestStatus === 'fulfilled') {
            setReviewSuccessMessage(`Review request sent to ${patientEmail}`);
            onReviewClickSuccess(`Review request sent to ${patientEmail}`);
          } else if (response?.meta?.requestStatus === 'rejected') {
            setReviewErrorMessage(response.payload);
            onReviewClickError(response.payload);
          }
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsReviewRequestLoading(false);
      }
    }
  };

  const handleSearchMRNNameChange = (value: string) => {
    const mrn = value.toLowerCase();
    dispatch(setSearchMRNName(mrn));
  };

  const handleCloneClick = (rowId: string) => {
    if (practiceId) dispatch(fetchSurgeryInfo({ practiceId, id: rowId }));
    handleOpenAddModal();
    setSelectedRow(selectedRow === rowId ? null : rowId);
  };

  const handleSendReviewRequest = (row) => {
    let errorMessage = '';
    if (row.surgeryStatus === 'COMPLETED') {
      if (row.id) {
        const reviewsBySurgeryId = reviews.find(
          (ele) => ele.surgeryId === row.id,
        );
        if (reviewsBySurgeryId && reviewsBySurgeryId.id) {
          if (reviewsBySurgeryId.reviewStatus === ReviewStatus.PENDING) {
            if (!isReviewRequestLoading) {
              sendReqest(reviewsBySurgeryId.id, row?.email);
            }
          } else if (reviewsBySurgeryId.reviewStatus === ReviewStatus.SENT) {
            errorMessage = 'Request already sent';
          } else if (
            reviewsBySurgeryId.reviewStatus === ReviewStatus.RECEIVED
          ) {
            errorMessage = 'Review received';
          }
        }
      }
    } else {
      errorMessage = `This surgery is still in ${row.surgeryStatus} phase. So review request can’t be sent to the patient.`;
    }
    setReviewErrorMessage(errorMessage);
    onReviewClickError(reviewErrorMessage);
  };

  const handleOpenDeleteModal = (rowId: string): void => {
    setSelectedRow(rowId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
  };

  const handleViewClick = (rowId: string) => {
    setSelectedRow(selectedRow === rowId ? null : rowId);
    setSelectedAction('view');
  };

  const createQueryString = (params): string => {
    const queryString = new URLSearchParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        queryString.append(key, params[key]);
      });
    }
    return queryString.toString();
  };

  const handlePatientMedia = (patientMrn: number): void => {
    const queryParams = {
      patientMrn: patientMrn,
      redirectedFromDashboard: true,
    };
    setSelectedAction('patientMedia');
    const queryString = createQueryString(queryParams);
    if (queryString) {
      router.push(`/messages?${queryString}`);
    }
  };

  const resetFilters = (): void => {
    dispatch(setSelectedMonth([]));
    dispatch(setSearchMRNName(null));
    dispatch(setSelectedValue(null));
    setIsWailistViewActive(false);
    setIsIolViewActive(false);
  };

  const handleViewHistory = (id: string, surgery: string): void => {
    const query = { id, surgery };
    const queryString = new URLSearchParams(query).toString();
    const url = `/history/?${queryString}`;
    window.location.href = url;
  };

  const handleEditClick = (rowId: string) => {
    setSelectedAction('edit');
    setEditableRows((prevEditableRows) => [...prevEditableRows, rowId]);
  };

  const handleCancelClick = (rowId: string) => {
    setEditableRows((prevEditableRows) =>
      prevEditableRows.filter((id) => id !== rowId),
    );
  };

  const handleUpdateClick = (rowId: string) => {
    setEditableRows((prevEditableRows) =>
      prevEditableRows.filter((id) => id !== rowId),
    );
  };

  const handleCloseAddModal = (): void => {
    setIsAddModalOpen(false);
  };

  const handleOpenAddModal = (): void => {
    setIsAddModalOpen(true);
  };

  const searchMRNNameStr = searchMRNName || '';
  const selectedValueStr = selectedValue || '';

  const dispatchFetchFilteredSurgeryList = (
    selectedMonth: MonthOption[],
    searchMRNName: string,
    selectedValue: string,
  ) => {
    const monthLabels = selectedMonth.map((month) => month.label);
    const month = monthLabels.join(',');
    const selectedOption = selectedValue;

    if (practiceId && loggedInUserId !== null && doctorId) {
      dispatch(
        fetchListings({
          loggedInUserId,
          practiceId,
          month: month,
          searchMRNName,
          option: selectedOption,
          doctorId: doctorId || '',
        }),
      );
    }
  };
  const isDisabled =
    selectedValue &&
    (selectedValue.toLowerCase() === 'past' ||
      selectedValue.toLowerCase() === 'upcoming');

  const dispatchFetchFilteredCalendars = (
    practiceId: string,
    userId: string,
    selectedMonth: MonthOption[],
    option: string,
    loggedInUserId: string,
  ) => {
    const month = getSelectedMonths(selectedMonth);
    dispatch(
      fetchFilteredCalendars({
        practiceId,
        userId,
        month,
        option,
        loggedInUserId,
      }),
    );
  };

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchMedia({ practiceId }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    onReviewClickError(reviewErrorMessage);
  }, [reviewErrorMessage]);

  useEffect(() => {
    onReviewClickSuccess(reviewSuccessMessage);
  }, [reviewSuccessMessage]);

  useEffect(() => {
    if (practiceId !== null) {
      const loadData = async () => {
        await withLoader(async () => {
          await dispatch(fetchReviews({ practiceId: practiceId }));
        });
      };

      loadData();
    }
  }, [practiceId, dispatch, withLoader]);

  useEffect(() => {
    if (practiceId !== null && doctorId !== null && loggedInUserId) {
      dispatchFetchFilteredCalendars(
        practiceId,
        doctorId,
        selectedMonth,
        selectedValueStr,
        loggedInUserId,
      );
    }
  }, [practiceId, doctorId, loggedInUserId, dispatch]);

  useEffect(() => {
    if (practiceId && loggedInUserId !== null && doctorId) {
      dispatchFetchFilteredSurgeryList(
        selectedMonth,
        searchMRNNameStr,
        selectedValueStr,
      );
    }
  }, [
    dispatch,
    practiceId,
    loggedInUserId,
    selectedMonth,
    searchMRNNameStr,
    selectedValueStr,
    doctorId,
  ]);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const { calendars } = useAppSelector((state) => ({
    calendars: Object.values(state.calendars?.entities).filter(
      (calendar) => calendar?.user?.id === doctorId,
    ),
  }));
  console.log(calendars);
  const handleSetIsUpdateLoading = (loadingState: boolean) => {
    setIsUpdateLoading(loadingState);
  };

  const waitlistShowFlag =
    isWailistViewActive ||
    selectedValueStr.trim().toLowerCase() === 'waitlist view';
  const iolListShowFlag =
    isIolViewActive || selectedValueStr.trim().toLowerCase() === 'iol view';

  const organizedObj = {};

  Object.keys(modifiedObj).forEach((date) => {
    const [month, , year] = date.split('/');
    const monthYearKey = `${month}/${year}`;

    if (!organizedObj[monthYearKey]) {
      organizedObj[monthYearKey] = {};
    }

    if (!organizedObj[monthYearKey][date]) {
      organizedObj[monthYearKey][date] = [];
    }

    organizedObj[monthYearKey][date] = modifiedObj[date][date];
  });

  return (
    <div>
      {reviewSendingIsLoading && <Loader />}
      {isUpdateLoading && <Loader />}
      {!isLoading && (
        <div>
          <div className="flex w-full bg-purple-50 p-1 border-t border-b border-gray-200 items-center mb-2">
            <div className="flex w-1/4 items-center">
              <div className="text-xl font-bold border-r border-gray-300 pr-4 mr-4">
                Filters
              </div>
              {selectedMonth && selectedMonth.length > 0 && (
                <div className="text-base font-bold">
                  {selectedMonth[0].label} 2024
                </div>
              )}
            </div>
            <div className="flex w-3/4 justify-end gap-3 items-center text-sm">
              <div className="flex">
                <div className="items-center">
                  <TextInput
                    name="search"
                    value={searchMRNName || ''}
                    onChange={handleSearchMRNNameChange}
                    placeholder="Search MRN or Name"
                  />
                </div>
                <div className="bg-gradient-to-br from-teal-600 to-green-500 px-4 py-2 text-white flex items-center rounded-r-lg border-r border-gray-300">
                  <SearchIcon />
                </div>
              </div>
              <div>
                <Select
                  required
                  placeholder="Select Month"
                  options={updatedMonthOptions}
                  value={selectedMonth}
                  onChange={handleChangeMonth}
                  disabled={isDisabled || false}
                  multi
                  overrides={{
                    ControlContainer: {
                      style: {
                        backgroundColor: 'rgba(250, 250, 250, 1)',
                        border: 'none',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        color: '#52525B',
                        width: '250px',
                      },
                    },
                    ClearIcon: {
                      component: () => null,
                    },
                  }}
                />
              </div>
              <div>
                <Select
                  required
                  options={updatedOptions}
                  value={
                    selectedValue
                      ? [
                          {
                            label: selectedValue,
                            id: selectedValue,
                          },
                        ]
                      : []
                  }
                  onChange={handleChangeValue}
                  overrides={{
                    ControlContainer: {
                      style: {
                        backgroundColor: 'rgba(250, 250, 250, 1)',
                        border: 'none',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        color: '#52525B',
                        width: '250px',
                      },
                    },
                    ClearIcon: {
                      component: () => null,
                    },
                  }}
                />
              </div>
              <div>
                <Button
                  type="button"
                  kind="tertiary"
                  title="Reset"
                  onClick={resetFilters}
                  style={{
                    padding: '10px',
                    backgroundColor: 'rgba(212, 212, 216, 1)',
                    color: 'black',
                  }}
                />
              </div>
            </div>
          </div>

          {surgeryConfigList.length > 0 &&
          Object.keys(organizedObj).length > 0 ? (
            <div className="table-responsive overflow-x-auto rounded-lg">
              <table className="w-full dashboard-table">
                <tbody>
                  {Object.keys(organizedObj).map((key, index) => {
                    const ele = organizedObj[key];
                    return (
                      <React.Fragment key={index}>
                        <tr>
                          <td
                            colSpan={20}
                            className={`bg-[#117180] border-solid px-2.5 py-0.5 text-white text-lg font-bold   ${
                              index == 0 ? 'rounded-t-lg' : ''
                            }`}
                          >
                            {new Date(
                              `${key.split('/')[1]}-${key.split('/')[0]}-01`,
                            ).toLocaleString('en-US', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </td>
                        </tr>
                        {Object.keys(ele).map((date, dateIndex) => {
                          if (waitlistShowFlag) {
                            ele[date].sort((a, b) => {
                              const waitlistA = a.waitlist ?? '';
                              const waitlistB = b.waitlist ?? '';

                              if (waitlistA === '' && waitlistB === '') {
                                return 0;
                              } else if (
                                waitlistA === '' ||
                                waitlistA === undefined
                              ) {
                                return 1;
                              } else if (
                                waitlistB === '' ||
                                waitlistB === undefined
                              ) {
                                return -1;
                              } else {
                                return waitlistA.localeCompare(waitlistB);
                              }
                            });
                          }
                          return (
                            <React.Fragment key={dateIndex}>
                              <tr>
                                <td
                                  colSpan={20}
                                  className="border-solid px-2.5 py-0.5 text-white text-base font-normal"
                                  style={{
                                    backgroundColor: 'rgba(53, 165, 118, 1)',
                                  }}
                                >
                                  {new Date(`${date}`).toLocaleDateString(
                                    'en-US',
                                    { weekday: 'long' },
                                  )}
                                  , {date} - {ele[date]?.length} case cases
                                  &nbsp; &nbsp;(
                                  {calculatedBookesSlots(ele[date])} Max)
                                </td>
                              </tr>
                              <>
                                <React.Fragment key={dateIndex}>
                                  <tr>
                                    <th className="w-[75px]">Date</th>
                                    <th className="text-center w-6">
                                      <HomeIcon></HomeIcon>
                                    </th>
                                    <th className="w-[76px] text-center">
                                      Status
                                    </th>
                                    <th className="w-[80px]">Last Name</th>
                                    <th className="w-[76px]">First Name</th>
                                    <th className="">MRN</th>
                                    <th className="w-[90px]">Surgery</th>
                                    <th className="w-[60px]">Body Part</th>
                                    {!iolListShowFlag && (
                                      <th className="w-6 text-center">#</th>
                                    )}
                                    <th className="text-center">Options</th>
                                    <th className="text-center">Implants</th>
                                    <th className="text-center">Checklist</th>
                                    {viewBillingColumn && (
                                      <th className="w-[30px]">Prof</th>
                                    )}

                                    {viewBillingColumn && (
                                      <th className="w-[30px]">Hospital</th>
                                    )}
                                    {!iolListShowFlag && (
                                      <th className="w-[30px]">Insurance</th>
                                    )}
                                    {!iolListShowFlag && (
                                      <th className="">Contact Info</th>
                                    )}
                                    {!iolListShowFlag && (
                                      <th className="w-[100px]">Action</th>
                                    )}
                                  </tr>
                                  {ele[date].map((row, index) => {
                                    const isEditable =
                                      editableRows.includes(row.id) &&
                                      selectedAction === 'edit';
                                    const surgeryInfo = surgeryList.find(
                                      (ele) => ele.id === row.id,
                                    );
                                    const customOptionsHeaders: string[] =
                                      surgeryOptionsHeadersObj[row.surgery]
                                        ?.surgeryOptionsHeaders;
                                    const customCheckListHeaders: string[] =
                                      surgeryOptionsHeadersObj[row.surgery]
                                        ?.checkListHeaders;

                                    const customConditionalHeaders: string[] =
                                      surgeryOptionsHeadersObj[row.surgery]
                                        ?.conditionalHeaders;
                                    return isEditable && surgeryInfo ? (
                                      <EditableRow
                                        key={row.id}
                                        rowId={row.id}
                                        handleCancelClick={() =>
                                          handleCancelClick(row.id)
                                        }
                                        customHeaders={surgeryOptionsHeadersObj}
                                        surgeryInfo={surgeryInfo}
                                        handleUpdateClick={handleUpdateClick}
                                        setIsUpdateLoading={
                                          handleSetIsUpdateLoading
                                        }
                                      />
                                    ) : (
                                      <>
                                        <tr
                                          key={row.id}
                                          id={row.id}
                                          className={`${
                                            index !== ele.length - 1
                                              ? 'border-t border-gray-300'
                                              : ''
                                          }`}
                                        >
                                          <td
                                            rowSpan={2}
                                            className="max-w-[70px] break-all"
                                          >
                                            {viewHistory ? (
                                              <div
                                                onClick={() =>
                                                  handleViewHistory(
                                                    row.patientId,
                                                    row.surgery,
                                                  )
                                                }
                                                className="cursor-pointer underline"
                                              >
                                                {row.date}
                                              </div>
                                            ) : (
                                              <div>{row.date}</div>
                                            )}
                                          </td>
                                          <td
                                            rowSpan={2}
                                            className="cursor-pointer text-center"
                                            title={row.home}
                                          >
                                            {row.home[0]}
                                          </td>
                                          <td
                                            rowSpan={2}
                                            className="max-w-[70px] break-all text-center"
                                          >
                                            <div
                                              className={`rounded-md inline-block text-white p-1 ${getColorForSurgeryStatus(
                                                row.surgeryStatus.toUpperCase(),
                                              )} text-xs`}
                                            >
                                              {toPascalCase(row.surgeryStatus)}
                                            </div>
                                          </td>
                                          <td
                                            rowSpan={1}
                                            className="max-w-[70px] break-all"
                                          >
                                            {row.lastName}
                                          </td>
                                          <td
                                            rowSpan={1}
                                            className="max-w-[70px] break-all"
                                          >
                                            {row.firstName}
                                          </td>
                                          <td rowSpan={1} className="">
                                            <div>
                                              {viewHistory ? (
                                                <div
                                                  onClick={() =>
                                                    handleViewHistory(
                                                      row.patientId,
                                                      row.surgery,
                                                    )
                                                  }
                                                  className="cursor-pointer underline"
                                                >
                                                  {row.mrn}
                                                </div>
                                              ) : (
                                                <div>{row.mrn}</div>
                                              )}
                                            </div>
                                          </td>
                                          <td
                                            rowSpan={1}
                                            className="max-w-[80px] break-all"
                                          >
                                            {row?.count && (
                                              <span
                                                className={`px-1 text-white rounded mr-1 ${
                                                  row.count === 1
                                                    ? 'bg-green-600'
                                                    : row.count === 2
                                                      ? 'bg-blue-600'
                                                      : ''
                                                }`}
                                              >
                                                {row.count}
                                              </span>
                                            )}
                                            {row?.surgery}
                                          </td>
                                          <td
                                            rowSpan={1}
                                            className="max-w-[70px] break-all"
                                          >
                                            {row.bodyPart}
                                          </td>
                                          {!iolListShowFlag && (
                                            <td
                                              rowSpan={2}
                                              className="text-center"
                                            >
                                              {row.surgeryOrder}
                                            </td>
                                          )}
                                          <td
                                            rowSpan={2}
                                            className="p-0 align-top"
                                          >
                                            <table>
                                              <tbody>
                                                {customOptionsHeaders &&
                                                  customOptionsHeaders.length >
                                                    0 &&
                                                  Array.from({
                                                    length: Math.ceil(
                                                      customOptionsHeaders.length /
                                                        3,
                                                    ),
                                                  }).map((_, rowIndex) => (
                                                    <React.Fragment
                                                      key={rowIndex}
                                                    >
                                                      <tr>
                                                        {customOptionsHeaders
                                                          .slice(
                                                            rowIndex * 3,
                                                            rowIndex * 3 + 3,
                                                          )
                                                          .map(
                                                            (
                                                              optionsHeader,
                                                              optionsHeaderIndex,
                                                            ) => (
                                                              <th
                                                                className="bg-[#1B7F7D]"
                                                                key={
                                                                  optionsHeaderIndex
                                                                }
                                                              >
                                                                {optionsHeader}
                                                              </th>
                                                            ),
                                                          )}
                                                      </tr>
                                                      <tr>
                                                        {customOptionsHeaders
                                                          .slice(
                                                            rowIndex * 3,
                                                            rowIndex * 3 + 3,
                                                          )
                                                          .map(
                                                            (
                                                              optionsHeader,
                                                              optionsHeaderIndex,
                                                            ) => {
                                                              const elements: JSX.Element[] =
                                                                [];
                                                              if (
                                                                row[
                                                                  `${optionsHeader}-count`
                                                                ]
                                                              ) {
                                                                for (
                                                                  let index = 0;
                                                                  index <
                                                                  row[
                                                                    `${optionsHeader}-count`
                                                                  ];
                                                                  index++
                                                                ) {
                                                                  elements.push(
                                                                    <div
                                                                      className=""
                                                                      key={
                                                                        index
                                                                      }
                                                                    >
                                                                      {
                                                                        row[
                                                                          `${optionsHeader}-${index}`
                                                                        ]
                                                                      }
                                                                    </div>,
                                                                  );
                                                                }
                                                              }
                                                              return (
                                                                <td
                                                                  className="w-1/2 min-w-12"
                                                                  key={
                                                                    optionsHeaderIndex
                                                                  }
                                                                >
                                                                  <div className="min-h-4">
                                                                    {elements}
                                                                  </div>
                                                                </td>
                                                              );
                                                            },
                                                          )}
                                                      </tr>
                                                    </React.Fragment>
                                                  ))}
                                              </tbody>
                                            </table>
                                          </td>
                                          <td
                                            rowSpan={2}
                                            className="p-0 align-top"
                                          >
                                            <table>
                                              <tbody>
                                                <tr>
                                                  {customConditionalHeaders &&
                                                    customConditionalHeaders.map(
                                                      (
                                                        customConditionalHeader,
                                                        customConditionalHeaderIndex,
                                                      ) => (
                                                        <th
                                                          className="bg-[#1B7F7D]"
                                                          key={
                                                            customConditionalHeaderIndex
                                                          }
                                                        >
                                                          {
                                                            customConditionalHeader
                                                          }
                                                        </th>
                                                      ),
                                                    )}
                                                </tr>
                                                <tr>
                                                  {customConditionalHeaders &&
                                                    customConditionalHeaders.map(
                                                      (
                                                        conditionalHeader,
                                                        conditionalHeaderIndex,
                                                      ) => {
                                                        const elements: JSX.Element[] =
                                                          [];
                                                        if (
                                                          row[
                                                            `${conditionalHeader}-count`
                                                          ]
                                                        ) {
                                                          for (
                                                            let index = 0;
                                                            index <
                                                            row[
                                                              `${conditionalHeader}-count`
                                                            ];
                                                            index++
                                                          ) {
                                                            elements.push(
                                                              <div
                                                                className=""
                                                                key={index}
                                                              >
                                                                {
                                                                  row[
                                                                    `${conditionalHeader}-${index}`
                                                                  ]
                                                                }
                                                              </div>,
                                                            );
                                                          }
                                                        }
                                                        return (
                                                          <td
                                                            className="w-1/2 min-w-10"
                                                            key={
                                                              conditionalHeaderIndex
                                                            }
                                                          >
                                                            <div className="min-h-4">
                                                              {elements}
                                                            </div>
                                                          </td>
                                                        );
                                                      },
                                                    )}
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                          <td
                                            rowSpan={2}
                                            className="p-0 align-top"
                                          >
                                            <table>
                                              <tbody>
                                                <tr>
                                                  {customCheckListHeaders &&
                                                    customCheckListHeaders.map(
                                                      (
                                                        checkListHeader,
                                                        checkListHeaderIndex,
                                                      ) => (
                                                        <th
                                                          className="bg-[#1B7F7D]"
                                                          key={
                                                            checkListHeaderIndex
                                                          }
                                                        >
                                                          {checkListHeader}
                                                        </th>
                                                      ),
                                                    )}
                                                </tr>
                                                <tr>
                                                  {customCheckListHeaders &&
                                                    customCheckListHeaders.map(
                                                      (
                                                        checkListHeader,
                                                        checkListHeaderIndex,
                                                      ) => (
                                                        <td
                                                          className={`w-1/4 ${
                                                            row[checkListHeader]
                                                              ? 'bg-customGreen'
                                                              : 'bg-customPink'
                                                          }`}
                                                          key={
                                                            checkListHeaderIndex
                                                          }
                                                        >
                                                          <div className="min-h-4">
                                                            {
                                                              row[
                                                                checkListHeader
                                                              ]
                                                            }
                                                          </div>
                                                        </td>
                                                      ),
                                                    )}
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>

                                          {viewBillingColumn && (
                                            <td
                                              rowSpan={2}
                                              className={`text-center ${
                                                Number(row?.prof)
                                                  ? 'bg-customGreen'
                                                  : 'bg-customPink'
                                              } pl-1`}
                                            >
                                              {row.prof}
                                            </td>
                                          )}

                                          {viewBillingColumn && (
                                            <td
                                              rowSpan={2}
                                              className={`text-center ${
                                                Number(row?.hospital)
                                                  ? 'bg-customGreen'
                                                  : 'bg-customPink'
                                              } pl-1`}
                                            >
                                              {row.hospital}
                                            </td>
                                          )}
                                          {!iolListShowFlag && (
                                            <td rowSpan={2} className="">
                                              {row.insurance}
                                            </td>
                                          )}
                                          {!iolListShowFlag && (
                                            <td rowSpan={2} className="">
                                              {row.email}
                                              <br />
                                              {row.phoneNumber}
                                              <br />
                                              referrer: {row.referrer}
                                              {row.referrerVerified && (
                                                <Checkbox
                                                  checked={true}
                                                  overrides={{
                                                    Checkmark: {
                                                      style: ({
                                                        $checked,
                                                      }) => ({
                                                        backgroundColor:
                                                          $checked
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
                                            </td>
                                          )}
                                          {!iolListShowFlag && (
                                            <td rowSpan={2} className="">
                                              {actionIcons(row)}
                                            </td>
                                          )}
                                        </tr>
                                        <tr>
                                          {!iolListShowFlag && (
                                            <td
                                              colSpan={5}
                                              className="bg-white"
                                            >
                                              <div className="">
                                                <div>
                                                  <span className="font-semibold">
                                                    Waitlist:{' '}
                                                  </span>
                                                  {row.waitlist}
                                                </div>
                                                <div>
                                                  <span className="font-semibold">
                                                    Notes:{' '}
                                                  </span>
                                                  {row?.notes}
                                                </div>
                                              </div>
                                            </td>
                                          )}
                                        </tr>

                                        {selectedRow === row.id &&
                                          selectedSurgery &&
                                          selectedAction == 'view' && (
                                            <ViewRow
                                              selectedSurgery={row}
                                              viewBillingColumn={
                                                viewBillingColumn
                                              }
                                            />
                                          )}
                                      </>
                                    );
                                  })}
                                </React.Fragment>
                              </>
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                  <DeleteFilterModal
                    onConfirmDelete={onConfirmDelete}
                    isDeleteModalOpen={isDeleteModalOpen}
                    handleCloseDeleteModal={handleCloseDeleteModal}
                  />
                  <AddSurgeryModal
                    isModalOpen={isAddModalOpen}
                    handleCloseModal={handleCloseAddModal}
                    autoFillFromSurgery={true}
                    withLoader={withLoader}
                  />
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-3 px-2.5">{errorMessage}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FiltersSection;
