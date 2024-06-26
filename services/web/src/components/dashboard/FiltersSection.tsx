import {
  ISurgery,
  ISurgeryConfiguration,
  MonthOption,
} from '@packages/entities';
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
import { useUserPermission } from '@root/hooks/userHasPermission';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  deleteRecordAsync,
  fetchListings,
  fetchSurgeryInfo,
  setSearchMRNName,
  setSelectedMonth,
  setSelectedValue,
} from '@root/store/reducers/surgery';
import { toFullName, toPascalCase, usDateFormatter } from '@root/utils';
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
}> = ({ practiceId, withLoader, isLoading }) => {
  const dispatch = useAppDispatch();
  const { selectedMonth, searchMRNName, selectedValue } = useAppSelector(
    (state) => state.surgeries.surgeryFilters,
  );
  const { successMessage: addSurgerySuccessMessage } = useAppSelector(
    (state) => ({
      successMessage: state.surgeries.successMessage,
    }),
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
      <StarIcon style={{ marginRight: '4px', cursor: 'pointer' }} />
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

  const getUpdatedOptions = (viewPastCases: boolean) => [
    { label: 'Waitlist', value: 'waitlist' },
    { label: 'IOL', value: 'iol' },
    { label: 'Past', value: 'past', disabled: !viewPastCases },
  ];

  const updatedOptions = useMemo(
    () => getUpdatedOptions(viewPastCases),
    [viewPastCases],
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
    if (selectedLabel === 'past') {
      dispatch(setSelectedMonth([]));
    }
  };

  const handleChangeMonth = ({ value }) => {
    dispatch(setSelectedMonth(value));
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
  };

  const handleViewHistory = (id: string): void => {
    const query = { id };
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
  const isDisabled = selectedValue && selectedValue.toLowerCase() === 'past';

  useEffect(() => {
    if (
      addSurgerySuccessMessage &&
      addSurgerySuccessMessage === 'Surgery updated successfully.'
    ) {
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

  useEffect(() => {
    if (practiceId && loggedInUserId !== null) {
      dispatchFetchFilteredSurgeryList(
        selectedMonth,
        searchMRNNameStr,
        selectedValueStr,
      );
    }
  }, [dispatch, practiceId, loggedInUserId]);

  return (
    <div>
      {!isLoading && (
        <div>
          <div className="flex w-full bg-purple-50 px-2 border-t border-b border-gray-200 items-center">
            <div className="flex w-1/4 items-center">
              <div className="text-xl font-bold border-r border-gray-300 py-4 pr-4">
                Filters
              </div>
              {selectedMonth && selectedMonth.length > 0 && (
                <div className="text-base font-bold p-4">
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
                <div className="bg-gradient-to-br from-teal-600 to-green-500 px-2 py-2 text-white flex items-center rounded-r-lg border-r border-gray-300">
                  <SearchIcon size={20} />
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
              <div className="w-max overflow-x-auto mt-2 border rounded-t-lg rounded-b-lg border-gray-200">
                {Object.keys(modifiedObj).map((key, index) => {
                  const ele = modifiedObj[key];
                  const customOptionsHeaders: string[] =
                    surgeryOptionsHeadersObj[key].surgeryOptionsHeaders;
                  const customCheckListHeaders: string[] =
                    surgeryOptionsHeadersObj[key].checkListHeaders;

                  return (
                    <div key={index} className="w-full">
                      <div
                        className={`border-solid px-2.5 py-0.5 text-white text-base font-normal   ${
                          index == 0 ? 'rounded-t-lg' : ''
                        }`}
                        style={{ backgroundColor: 'rgba(53, 165, 118, 1)' }}
                      >
                        {key}
                      </div>
                      {Object.keys(ele).map((date, dateIndex) => {
                        return (
                          <div key={dateIndex}>
                            <div
                              className={`border-solid px-2.5 py-0 text-white text-sm font-normal ${
                                index == 0 ? 'rounded-t-lg' : ''
                              }`}
                              style={{
                                backgroundColor: 'rgba(53, 165, 118, 1)',
                              }}
                            ></div>
                            <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex gap-2  px-2.5 text-xs">
                              <div className="font-bold text-white py-1 px-1 w-20">
                                Date
                              </div>
                              <div className="font-bold text-white py-1 px-1 w-10">
                                <HomeIcon></HomeIcon>
                              </div>
                              <div className="font-bold text-white py-1 px-1 w-20">
                                Status
                              </div>
                              <div className="font-bold text-white py-1 px-1 w-20">
                                Last Name
                              </div>
                              <div className="font-bold text-white py-1 px-1 w-20">
                                First Name
                              </div>
                              <div className="font-bold text-white py-1 px-1 w-20">
                                MRN
                              </div>

                              <div className="font-bold text-white py-1 px-1 w-20">
                                Surgery
                              </div>
                              <div className="font-bold text-white py-1 px-1 w-20">
                                Body Part
                              </div>
                              {customOptionsHeaders.map(
                                (optionsHeader, optionsHeaderIndex) => (
                                  <div
                                    className="font-bold text-white py-1 px-1 w-20"
                                    key={optionsHeaderIndex}
                                  >
                                    {optionsHeader}
                                  </div>
                                ),
                              )}
                              <div className="font-bold text-white py-1 px-1 w-20">
                                Notes
                              </div>
                              <div className="font-bold text-white py-1 px-1 w-20">
                                #
                              </div>
                              {customCheckListHeaders.map(
                                (checkListHeader, checkListHeaderIndex) => (
                                  <div
                                    className="font-bold text-white py-1 px-1 w-20"
                                    key={checkListHeaderIndex}
                                  >
                                    {checkListHeader}
                                  </div>
                                ),
                              )}
                              {viewBillingColumn && (
                                <div className="font-bold text-white py-1 px-1 w-20">
                                  Prof
                                </div>
                              )}
                              {viewBillingColumn && (
                                <div className="font-bold text-white py-1 px-1 w-20">
                                  Hospital
                                </div>
                              )}
                              <div className="font-bold text-white py-1 px-1 w-20">
                                Insurance
                              </div>
                              <div className="font-bold text-white py-1 px-1 w-40 text-center">
                                Contact Info
                              </div>
                              <div className="font-bold text-white py-1 px-1 w-40">
                                Action
                              </div>
                            </div>
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
                                  rowId={row.id} // Pass the rowId
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
                                  <div
                                    key={row.id}
                                    id={row.id}
                                    className={`div-clone flex gap-2 px-2.5 text-xs items-start ${
                                      index !== ele.length - 1
                                        ? 'border-b border-gray-300'
                                        : ''
                                    }`}
                                  >
                                    <div className="text-black  py-0.5 px-1 w-20 flex">
                                      <div>
                                        {viewHistory ? (
                                          <div
                                            onClick={() =>
                                              handleViewHistory(row.patientId)
                                            }
                                            className="cursor-pointer underline"
                                          >
                                            {row.date}
                                          </div>
                                        ) : (
                                          <div>{row.date}</div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-black py-0.5 px-1 w-10">
                                      {row.home[0]}
                                    </div>
                                    <div className="text-gray-900 py-0.5 px-0.5 flex text-center items-center w-40">
                                      <div className="rounded-md text-white p-1 bg-indigo-500 text-xs">
                                        {toPascalCase(row.surgeryStatus)}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                                        {row.lastName}
                                      </div>
                                      <div className="font-semibold pt-4">
                                        Waitlist:{' '}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                                        {row.firstName}
                                      </div>
                                      <div className="pt-4">{row.waitlist}</div>
                                    </div>
                                    <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                                      <div>
                                        {viewHistory ? (
                                          <div
                                            onClick={() =>
                                              handleViewHistory(row.patientId)
                                            }
                                            className="cursor-pointer underline"
                                          >
                                            {row.mrn}
                                          </div>
                                        ) : (
                                          <div>{row.mrn}</div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                                      {row.surgery}
                                    </div>
                                    <div className="text-black py-0.5 px-1 w-20">
                                      {row.bodyPart}
                                    </div>

                                    {customOptionsHeaders.map(
                                      (optionsHeader, optionsHeaderIndex) => {
                                        const elements: JSX.Element[] = [];
                                        if (row[`${optionsHeader}-count`]) {
                                          for (
                                            let index = 0;
                                            index <
                                            row[`${optionsHeader}-count`];
                                            index++
                                          ) {
                                            elements.push(
                                              <div
                                                className="text-black py-0.5 px-1 w-20"
                                                key={index}
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
                                          <div
                                            className="flex flex-col gap-1 justify-center"
                                            key={optionsHeaderIndex}
                                          >
                                            {elements}
                                          </div>
                                        );
                                      },
                                    )}
                                    <div className="text-black py-0.5 px-1 w-20">
                                      {row.details}
                                    </div>
                                    <div className="text-black py-0.5 px-1 w-20">
                                      {row.surgeryOrder}
                                    </div>
                                    {customCheckListHeaders.map(
                                      (
                                        checkListHeader,
                                        checkListHeaderIndex,
                                      ) => (
                                        <div
                                          className=" text-black py-0.5px-1 w-20"
                                          key={checkListHeaderIndex}
                                        >
                                          {row[checkListHeader]}
                                        </div>
                                      ),
                                    )}
                                    {viewBillingColumn && (
                                      <div className="text-black py-0.5 px-1 w-20">
                                        {row.prof}
                                      </div>
                                    )}
                                    {viewBillingColumn && (
                                      <div className="text-black py-0.5 px-1 w-20">
                                        {row.hospital}
                                      </div>
                                    )}
                                    <div className="text-black py-0.5 px-1 w-20">
                                      {row.insurance}
                                    </div>
                                    <div className="flex flex-col text-black py-0.5 px-1 w-40 items-center">
                                      <div
                                        className="text-black py-0.5 px-1 w-full text-center overflow-hidden whitespace-nowrap"
                                        style={{ textOverflow: 'ellipsis' }}
                                      >
                                        {row.email}
                                      </div>
                                      <div className="text-black py-0.5 px-1 w-20 text-center">
                                        {row.phoneNumber}
                                      </div>
                                      <div className="text-black py-0.5 px-1 w-40 text-center flex items-center justify-center">
                                        <div className="text-black py-0.5 px-1 text-center">
                                          referrer: {row.referrer}
                                        </div>
                                        <div>
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
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-black py-0.5 px-1 w-40 text-center">
                                      {actionIcons(row)}
                                    </div>
                                  </div>
                                  {selectedRow === row.id &&
                                    selectedSurgery &&
                                    selectedAction == 'view' && (
                                      <ViewRow
                                        selectedSurgery={row}
                                        viewBillingColumn={viewBillingColumn}
                                      />
                                    )}
                                </>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
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
