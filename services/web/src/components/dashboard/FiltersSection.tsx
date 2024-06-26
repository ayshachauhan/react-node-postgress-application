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
                          <>
                            <div key={dateIndex}>
                              <div
                                className={`border-solid px-2.5 py-0 text-white text-sm font-normal ${
                                  index == 0 ? 'rounded-t-lg' : ''
                                }`}
                                style={{
                                  backgroundColor: 'rgba(53, 165, 118, 1)',
                                }}
                              ></div>
                              <table className="w-full">
                                <thead>
                                  <tr>
                                    <th>Date</th>
                                    <th>
                                      <HomeIcon></HomeIcon>
                                    </th>
                                    <th className="w-24">Status</th>
                                    <th>Last Name</th>
                                    <th>First Name</th>
                                    <th>MRN</th>
                                    <th>Surgery</th>
                                    <th>Body Part</th>
                                    <th>
                                      {customOptionsHeaders &&
                                        customOptionsHeaders.map(
                                          (
                                            optionsHeader,
                                            optionsHeaderIndex,
                                          ) => (
                                            <span
                                              className=""
                                              key={optionsHeaderIndex}
                                            >
                                              {optionsHeader}
                                            </span>
                                          ),
                                        )}
                                    </th>
                                    <th>Notes</th>
                                    <th>#</th>
                                    <th>
                                      {customCheckListHeaders &&
                                        customCheckListHeaders.map(
                                          (
                                            checkListHeader,
                                            checkListHeaderIndex,
                                          ) => (
                                            <span
                                              className=""
                                              key={checkListHeaderIndex}
                                            >
                                              {checkListHeader}
                                            </span>
                                          ),
                                        )}
                                    </th>

                                    {viewBillingColumn && viewBillingColumn && (
                                      <th className="">Prof</th>
                                    )}

                                    {viewBillingColumn && (
                                      <th className="">Hospital</th>
                                    )}

                                    <th>Insurance</th>
                                    <th>Contact Info</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
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
                                        <tr
                                          key={row.id}
                                          id={row.id}
                                          className={`${
                                            index !== ele.length - 1
                                              ? 'border-b border-gray-300'
                                              : ''
                                          }`}
                                        >
                                          <td className="">
                                            <div>
                                              {viewHistory ? (
                                                <div
                                                  onClick={() =>
                                                    handleViewHistory(
                                                      row.patientId,
                                                    )
                                                  }
                                                  className="cursor-pointer underline"
                                                >
                                                  {row.date}
                                                </div>
                                              ) : (
                                                <div>{row.date}</div>
                                              )}
                                            </div>
                                          </td>
                                          <td className="">{row.home[0]}</td>
                                          <td className="">
                                            <div className="rounded-md inline  text-center text-white p-1 bg-indigo-500 text-xs">
                                              {toPascalCase(row.surgeryStatus)}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="">
                                              {row.lastName}
                                            </div>
                                            <div className="font-semibold pt-4">
                                              Waitlist:{' '}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="">
                                              {row.firstName}
                                            </div>
                                            <div className="pt-4">
                                              {row.waitlist}
                                            </div>
                                          </td>
                                          <td className="">
                                            <div>
                                              {viewHistory ? (
                                                <div
                                                  onClick={() =>
                                                    handleViewHistory(
                                                      row.patientId,
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
                                          <td className="">{row.surgery}</td>
                                          <td className="">{row.bodyPart}</td>
                                          <td>
                                            {customOptionsHeaders.map(
                                              (
                                                optionsHeader,
                                                optionsHeaderIndex,
                                              ) => {
                                                const elements: JSX.Element[] =
                                                  [];
                                                if (
                                                  row[`${optionsHeader}-count`]
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
                                          </td>
                                          <td className="">{row.details}</td>
                                          <td className="">
                                            {row.surgeryOrder}
                                          </td>
                                          <td>
                                            {customCheckListHeaders.map(
                                              (
                                                checkListHeader,
                                                checkListHeaderIndex,
                                              ) => (
                                                <div
                                                  className=""
                                                  key={checkListHeaderIndex}
                                                >
                                                  {row[checkListHeader]}
                                                </div>
                                              ),
                                            )}
                                          </td>

                                          {viewBillingColumn && (
                                            <td className="">{row.prof}</td>
                                          )}

                                          {viewBillingColumn && (
                                            <td className="">{row.hospital}</td>
                                          )}

                                          <td className="">{row.insurance}</td>
                                          <td className="">
                                            <div
                                              className="whitespace-nowrap"
                                              style={{
                                                textOverflow: 'ellipsis',
                                              }}
                                            >
                                              {row.email}
                                            </div>
                                            <div className="">
                                              {row.phoneNumber}
                                            </div>
                                            <div className="">
                                              <div className="">
                                                referrer: {row.referrer}
                                              </div>
                                              <div>
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
                                              </div>
                                            </div>
                                          </td>
                                          <td className="">
                                            {actionIcons(row)}
                                          </td>
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
                                </tbody>
                              </table>
                            </div>
                          </>
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
