import {
  ISurgery,
  ISurgeryConfiguration,
  MonthOption,
} from '@packages/entities';
import { IWaitlist, ReviewStatus } from '@packages/entities/index.browser';
import { USER_PERMISSIONS } from '@packages/entities/permission';
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
  createTierOrder,
  getColorForSurgeryStatus,
  sortSurgeryData,
  toFullName,
  toPascalCase,
  usDateFormatter,
} from '@root/utils';
import { monthOptions } from '@root/utils/constants';
import { Checkbox } from 'baseui/checkbox';
import { Select } from 'baseui/select';
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
  const { selectedMonth, searchMRNName, selectedValue } = useAppSelector(
    (state) => state.surgeries.surgeryFilters,
  );
  const { successMessage: addSurgerySuccessMessage } = useAppSelector(
    (state) => ({
      successMessage: state.surgeries.successMessage,
    }),
  );
  const reviews = useAppSelector((state) =>
    Object.values(state.reviews.entities),
  );
  const {
    isLoading: reviewSendingIsLoading,
    withLoader: reviewSenderWithLoader,
  } = useLoader();

  const [reviewErrorMessage, setReviewErrorMessage] = useState<string>('');
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isWailistViewActive, setIsWailistViewActive] = useState(false);
  const [isIolViewActive, setIsIolViewActive] = useState(false);
  const [isUpdateCase, setIsUpdateCase] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedSurgery, setSelectedSurgery] = useState({});
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [editableRows, setEditableRows] = useState<string[]>([]);
  const userInfo = useAppSelector((state) => state.auth.user);
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

  const surgeryOptionsHeadersObj: {
    [key: string]: {
      surgeryOptionsHeaders: string[];
      checkListHeaders: string[];
    };
  } = {};
  const { errorMessage } = useAppSelector((state) => state.surgeries);
  const surgeryList: ISurgery[] = useAppSelector((state) =>
    Object.values(state.surgeries.entities),
  );

  const surgeryConfigList: ISurgeryConfiguration[] = useAppSelector((state) =>
    Object.values(state.surgeryConfigurations.entities),
  );

  if (surgeryConfigList.length) {
    surgeryConfigList.forEach((ele) => {
      surgeryOptionsHeadersObj[ele.name] = {
        surgeryOptionsHeaders: Object.keys(ele.options),
        checkListHeaders: Object.keys(ele.checkList),
      };
    });
  }

  const actionIcons = (row) => (
    <div style={{ display: 'flex' }}>
      <StarIcon
        style={{ marginRight: '4px', cursor: 'pointer' }}
        onClick={() => handleSendReviewRequest(row)}
      />
      <CopyIcon
        style={{ marginRight: '4px', cursor: 'pointer' }}
        onClick={() => handleCloneClick(row.id)}
      />
      <DisplayIcon style={{ marginRight: '4px', cursor: 'pointer' }} />
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
      details: ele.patient.details ? ele.patient.details : '',
      bodyPart: ele.bodyPart,
      index: index + 1,
      hospital: ele.totalHospitalPricing,
      prof: ele.totalProfessionalPricing,
      action: actionIcons,
      surgeryOrder: ele.surgeryOrder,
      surgeryStatus: ele.surgeryStatus,
      selectedSurgeryOptions: ele.selectedSurgeryOptions,
      selectedChecklistOptions: ele.selectedCheckListOptions,
      waitlist: ele?.waitlist?.name,
      referrerVerified:
        ele.patient.referrer && ele.patient.referrer.verified ? true : false,
    };

    const optionArr = Object.keys(ele.surgeryConfiguration.options);

    optionArr.forEach((option) => {
      viewData[`${option}-count`] =
        ele.surgeryConfiguration.options[option]?.count;
    });

    Object.keys(ele.selectedSurgeryOptions).forEach((data) => {
      viewData[data] = ele.selectedSurgeryOptions[data].value;
    });

    ele.selectedCheckListOptions &&
      Object.keys(ele.selectedCheckListOptions).forEach((data) => {
        viewData[data] = ele.selectedCheckListOptions[data].value;
      });

    const modifiedObjKey: string = ele.surgeryConfiguration.name;

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

  const handleChangeValue = ({ value }) => {
    dispatch(setSelectedValue(value[0] ? value[0].label : null));
    const selectedLabel = value.length > 0 ? value[0].label.toLowerCase() : '';

    if (selectedLabel === 'past view' || selectedLabel === 'upcoming view') {
      dispatch(setSelectedMonth([]));
    }
    if (selectedLabel === 'waitlist view') {
      setIsWailistViewActive(true);
    }
    if (selectedLabel === 'iol view') {
      setIsIolViewActive(true);
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
          await dispatch(sendReviewRequestAsyncThunk({ practiceId, id }));
        });
        setReviewSuccessMessage(`Review request sent to ${patientEmail}`);
        onReviewClickSuccess(reviewSuccessMessage);
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
      errorMessage = `This surgery is still in ${row.surgeryStatus}. So review request can’t be sent to the patient.`;
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

    if (practiceId && loggedInUserId !== null) {
      dispatch(
        fetchListings({
          loggedInUserId,
          practiceId,
          month: month,
          searchMRNName,
          option: selectedOption,
        }),
      );
    }
  };
  const isDisabled =
    selectedValue &&
    (selectedValue.toLowerCase() === 'past' ||
      selectedValue.toLowerCase() === 'upcoming');

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
    if (
      addSurgerySuccessMessage &&
      addSurgerySuccessMessage === 'Surgery updated successfully.'
    ) {
      setIsUpdateCase(true);
      if (practiceId && loggedInUserId !== null) {
        dispatchFetchFilteredSurgeryList(
          selectedMonth,
          searchMRNNameStr,
          selectedValueStr,
        );
      }
    }
  }, [addSurgerySuccessMessage, dispatch, practiceId]);

  useEffect(() => {
    if (practiceId && loggedInUserId !== null) {
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
  ]);
  const waitlist: IWaitlist[] = useAppSelector((state) =>
    Object.values(state.waitlist.entities),
  );

  const tierOrder = createTierOrder(waitlist);
  const waitlistShowFlag =
    isWailistViewActive ||
    selectedValueStr.trim().toLowerCase() === 'waitlist view';
  const iolListShowFlag =
    isIolViewActive || selectedValueStr.trim().toLowerCase() === 'iol view';

  return (
    <div>
      {reviewSendingIsLoading && <Loader />}
      {(isUpdateCase || (!isLoading && !isUpdateCase)) && (
        <div>
          <div className="flex w-full bg-purple-50 p-2 border-t border-b border-gray-200 items-center">
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

          <div className="overflow-x-auto">
            {surgeryConfigList.length > 0 &&
            Object.keys(modifiedObj).length > 0 ? (
              <div className="w-full overflow-x-auto mt-2 border rounded-t-lg rounded-b-lg border-gray-200">
                {Object.keys(modifiedObj).map((key, index) => {
                  const ele = modifiedObj[key];
                  const customOptionsHeaders: string[] =
                    surgeryOptionsHeadersObj[key].surgeryOptionsHeaders;
                  const customCheckListHeaders: string[] =
                    surgeryOptionsHeadersObj[key].checkListHeaders;

                  return (
                    <table key={index} className="w-full">
                      <tbody>
                        <tr>
                          <td
                            colSpan={20}
                            className={`border-solid px-2.5 py-0.5 text-white text-base font-normal   ${
                              index == 0 ? 'rounded-t-lg' : ''
                            }`}
                            style={{ backgroundColor: 'rgba(53, 165, 118, 1)' }}
                          >
                            {key}
                          </td>
                        </tr>

                        {Object.keys(ele).map((date, dateIndex) => {
                          if (waitlistShowFlag) {
                            const sortedData = sortSurgeryData(
                              ele[date],
                              tierOrder,
                            );
                            ele[date] = sortedData;
                          }
                          return (
                            <>
                              <React.Fragment key={dateIndex}>
                                <tr>
                                  <th>Date</th>
                                  <th>
                                    <HomeIcon></HomeIcon>
                                  </th>
                                  <th className="w-24">Status</th>
                                  <th className="w-24">Last Name</th>
                                  <th className="w-24">First Name</th>
                                  <th className="w-24">MRN</th>
                                  <th className="w-20">Surgery</th>
                                  <th className="w-20">Body Part</th>

                                  {customOptionsHeaders &&
                                    customOptionsHeaders.map(
                                      (optionsHeader, optionsHeaderIndex) => (
                                        <th
                                          className="w-12"
                                          key={optionsHeaderIndex}
                                        >
                                          {optionsHeader}
                                        </th>
                                      ),
                                    )}

                                  <th className="min-w-20">#</th>

                                  {customCheckListHeaders &&
                                    customCheckListHeaders.map(
                                      (
                                        checkListHeader,
                                        checkListHeaderIndex,
                                      ) => (
                                        <th
                                          className="min-w-20"
                                          key={checkListHeaderIndex}
                                        >
                                          {checkListHeader}
                                        </th>
                                      ),
                                    )}

                                  {viewBillingColumn && viewBillingColumn && (
                                    <th className="min-w-20">Prof</th>
                                  )}

                                  {viewBillingColumn && (
                                    <th className="">Hospital</th>
                                  )}
                                  {!iolListShowFlag && (
                                    <th className="w-20">Insurance</th>
                                  )}
                                  <th className="w-40">Contact Info</th>
                                  {!iolListShowFlag && <th>Action</th>}
                                </tr>
                                {ele[date].map((row, index) => {
                                  const isEditable =
                                    editableRows.includes(row.id) &&
                                    selectedAction === 'edit';
                                  const surgeryInfo = surgeryList.find(
                                    (ele) => ele.id === row.id,
                                  );
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
                                      withLoader={withLoader}
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
                                        <td rowSpan={2} className="">
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
                                        <td rowSpan={2} className="">
                                          {row.home[0]}
                                        </td>
                                        <td rowSpan={2} className="">
                                          <div
                                            className={`rounded-md inline-block text-white p-1 ${getColorForSurgeryStatus(
                                              row.surgeryStatus.toUpperCase(),
                                            )} text-xs`}
                                          >
                                            {toPascalCase(row.surgeryStatus)}
                                          </div>
                                        </td>
                                        <td rowSpan={1} className="">
                                          {row.lastName}
                                        </td>
                                        <td rowSpan={1} className="">
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
                                        <td rowSpan={1} className="">
                                          {row.surgery}
                                        </td>
                                        <td rowSpan={1} className="">
                                          {row.bodyPart}
                                        </td>
                                        {customOptionsHeaders.map(
                                          (
                                            optionsHeader,
                                            optionsHeaderIndex,
                                          ) => {
                                            const elements: JSX.Element[] = [];
                                            if (row[`${optionsHeader}-count`]) {
                                              for (
                                                let index = 0;
                                                index <
                                                row[`${optionsHeader}-count`];
                                                index++
                                              ) {
                                                elements.push(
                                                  <div className="" key={index}>
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
                                                rowSpan={2}
                                                className=""
                                                key={optionsHeaderIndex}
                                              >
                                                {elements}
                                              </td>
                                            );
                                          },
                                        )}

                                        <td rowSpan={2} className="">
                                          {row.surgeryOrder}
                                        </td>

                                        {customCheckListHeaders.map(
                                          (
                                            checkListHeader,
                                            checkListHeaderIndex,
                                          ) => (
                                            <td
                                              className=""
                                              rowSpan={2}
                                              key={checkListHeaderIndex}
                                            >
                                              {row[checkListHeader]}
                                            </td>
                                          ),
                                        )}

                                        {viewBillingColumn && (
                                          <td rowSpan={2} className="">
                                            {row.prof}
                                          </td>
                                        )}

                                        {viewBillingColumn && (
                                          <td rowSpan={2} className="">
                                            {row.hospital}
                                          </td>
                                        )}
                                        {!iolListShowFlag && (
                                          <td rowSpan={2} className="">
                                            {row.insurance}
                                          </td>
                                        )}
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
                                        </td>
                                        {!iolListShowFlag && (
                                          <td rowSpan={2} className="">
                                            {actionIcons(row)}
                                          </td>
                                        )}
                                      </tr>
                                      <tr>
                                        {!iolListShowFlag && (
                                          <td colSpan={5} className="bg-white">
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
                                                {row.details}
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
                          );
                        })}
                      </tbody>
                    </table>
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
              </div>
            ) : (
              <div className="text-center py-3 px-2.5">{errorMessage}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersSection;
