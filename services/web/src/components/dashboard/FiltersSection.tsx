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
import { usDateFormatter } from '@root/utils';
import { monthOptions } from '@root/utils/constants';
import { Select } from 'baseui/select';
import React, { useEffect, useMemo, useState } from 'react';
import DeleteFilterModal from './DeleteFilterModal';
import EditableRow from './EditableRow';

const FiltersSection: React.FC<{ practiceId: string }> = ({ practiceId }) => {
  const dispatch = useAppDispatch();
  const { selectedMonth, searchMRNName, selectedValue } = useAppSelector(
    (state) => state.surgeries.surgeryFilters,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clonedDivs, setClonedDivs] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const userInfo = useAppSelector((state) => state.auth.user);
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
  const surgeryInfo = useAppSelector((state) => state.surgeries.surgeryInfo);
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

  const actionIcons = (id: string) => (
    <div style={{ display: 'flex' }}>
      <StarIcon style={{ marginRight: '8px', cursor: 'pointer' }} />
      <CopyIcon
        style={{ marginRight: '8px', cursor: 'pointer' }}
        onClick={() => handleCloneClick(id)}
      />
      <DisplayIcon style={{ marginRight: '8px', cursor: 'pointer' }} />
      <ViewIcon
        style={{ marginRight: '8px', cursor: 'pointer' }}
        onClick={() => handleViewClick(id)}
      />
      {editCaseAllowed && (
        <EditIcon
          style={{ marginRight: '8px', cursor: 'pointer' }}
          onClick={() => handleEditClick(id)}
        />
      )}
      {deleteCaseAllowed && (
        <DeleteIcon
          style={{ cursor: 'pointer' }}
          onClick={() => handleOpenDeleteModal(id)}
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
  const modifyEvalList = surgeryList
    .map((ele, index) => {
      const modifiedDate: string = usDateFormatter(ele.date);
      const viewData = {
        id: ele.id,
        firstName: ele.patient.firstName,
        lastName: ele.patient.lastName,
        mrn: ele.patient.mrn,
        email: ele.patient.email,
        phoneNumber: ele.patient.phoneNumber,
        date: modifiedDate,
        surgery: ele.surgeryConfiguration.name,
        home: ele.practiceHome.name,
        insuranceDetails: ele.insuranceDetails,
        insurance: ele.insuranceType ? ele.insuranceType?.name : '',
        pcp: '',
        referrer: ele.patient.referrer ? ele.patient.referrer.email : '',
        details: ele.patient.details ? ele.patient.details : '',
        bodyPart: ele.bodyPart,
        index: index + 1,
        hospital: ele.totalHospitalPricing,
        prof: ele.totalProfessionalPricing,
        action: actionIcons,
        hash: 10,
        status: 'booked',
        am: 'am',
        femto: 'Femto',
        ora: 'ORA',
        lens: 'Standard',
        implant: 'D1234',
        calcs: '5/6PC',
        auth: '5/6PC',
        hp: '5/6PC',
        consent: '5/6PC',
      };

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
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const selectedSurgery = modifyEvalList.find(
    (surgery) => surgery.id === selectedRow,
  );

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
    setSelectedAction('clone');
    setSelectedRow(selectedRow === rowId ? null : rowId);
    const clonedDiv = document.getElementById(rowId);
    if (clonedDiv) {
      const clonedDivHTML = clonedDiv.outerHTML;
      setClonedDivs([clonedDivHTML]);
    }
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

  const handleEditClick = (rowId: string) => {
    setSelectedAction('edit');
    dispatch(fetchSurgeryInfo({ practiceId, id: rowId }));
    setSelectedRow(selectedRow === rowId ? null : rowId);
  };

  const handleCancelClick = () => {
    setSelectedAction('cancel');
    setSelectedRow(null);
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

    dispatch(
      fetchListings({
        practiceId,
        month: month,
        searchMRNName,
        option: selectedOption,
      }),
    );
  };
  const isDisabled = selectedValue && selectedValue.toLowerCase() === 'past';

  useEffect(() => {
    dispatchFetchFilteredSurgeryList(
      selectedMonth,
      searchMRNNameStr,
      selectedValueStr,
    );
  }, [dispatch, selectedMonth, searchMRNName, selectedValue]);

  useEffect(() => {
    dispatchFetchFilteredSurgeryList(
      selectedMonth,
      searchMRNNameStr,
      selectedValueStr,
    );
  }, [dispatch]);

  return (
    <div className="overflow-x-auto">
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
      {surgeryConfigList.length && Object.keys(modifiedObj).length && (
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
                        style={{ backgroundColor: 'rgba(53, 165, 118, 1)' }}
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
                        <div className="font-bold text-white py-1 px-1 w-40">
                          Action
                        </div>
                      </div>
                      {ele[date].map((row, index) =>
                        selectedRow === row.id &&
                        selectedAction == 'edit' &&
                        surgeryInfo ? (
                          <EditableRow
                            key={row.id}
                            handleCancelClick={handleCancelClick}
                            customHeaders={surgeryOptionsHeadersObj}
                            surgeryInfo={surgeryInfo}
                            setSelectedAction={setSelectedAction}
                          />
                        ) : (
                          <>
                            <div
                              key={row.id}
                              id={row.id}
                              className={`div-clone flex gap-2 px-2.5 text-xs items-center ${
                                index !== ele.length - 1
                                  ? 'border-b border-gray-300'
                                  : ''
                              }`}
                            >
                              <div className="text-black  py-0.5 px-1 w-20">
                                {row.date}
                              </div>
                              <div className="text-black py-0.5 px-1 w-10">
                                {row.home[0]}
                              </div>
                              <div className="text-gray-900 py-2 px-0.5 flex text-center items-center w-20">
                                <div className="rounded-md text-white p-1 bg-indigo-500">
                                  {row.status}
                                </div>
                              </div>
                              <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                                {row.lastName}
                              </div>
                              <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                                {row.firstName}
                              </div>
                              <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                                {row.mrn}
                              </div>
                              <div className="text-black py-0.5 px-1 overflow-hidden whitespace-nowrap w-20">
                                {row.surgery}
                              </div>
                              <div className="text-black py-0.5 px-1 w-20">
                                {row.bodyPart}
                              </div>

                              {customOptionsHeaders.map(
                                (optionsHeader, optionsHeaderIndex) => (
                                  <div
                                    className="text-black py-0.5 px-1 w-20"
                                    key={optionsHeaderIndex}
                                  >
                                    {row[optionsHeader]}
                                  </div>
                                ),
                              )}
                              <div className="text-black py-0.5 px-1 w-20">
                                {row.details}
                              </div>
                              <div className="text-black py-0.5 px-1 w-20">
                                {row.hash}
                              </div>
                              {customCheckListHeaders.map(
                                (checkListHeader, checkListHeaderIndex) => (
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
                              <div className="text-black py-0.5 px-1 w-40">
                                {actionIcons(row.id)}
                              </div>
                            </div>
                            {selectedRow === row.id &&
                              selectedSurgery &&
                              selectedAction == 'view' && (
                                <div className="flex gap-2 p-2.5 text-xs">
                                  <div className="flex-1">
                                    <p>
                                      <span className="font-bold">Date: </span>
                                      <span>{selectedSurgery.date}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">
                                        Home Location:{' '}
                                      </span>
                                      <span>Westwood</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">
                                        COVID Testing Status:{' '}
                                      </span>
                                      <span>Needs COVID Test </span>
                                    </p>
                                    <p>
                                      <span className="font-bold">
                                        Appointment Status:{' '}
                                      </span>
                                      <span>{selectedSurgery.status}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">Calcs: </span>
                                      <span>{selectedSurgery.calcs}</span>
                                    </p>
                                  </div>
                                  <div className="flex-1">
                                    <p>
                                      <span className="font-bold">
                                        Last Name:{' '}
                                      </span>
                                      <span>{selectedSurgery.firstName}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">
                                        First Name:{' '}
                                      </span>
                                      <span>{selectedSurgery.lastName}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">MRN: </span>
                                      <span>{selectedSurgery.mrn}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">Eye: </span>
                                      <span>{selectedSurgery.bodyPart}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">Auth: </span>
                                      <span>{selectedSurgery.auth}</span>
                                    </p>
                                  </div>
                                  <div className="flex-1">
                                    <p>
                                      <span className="font-bold">
                                        Surgery:{' '}
                                      </span>
                                      <span>{selectedSurgery.surgery}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">AM: </span>
                                      <span>{selectedSurgery.am}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">Femto: </span>
                                      <span>{selectedSurgery.femto}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">ORA: </span>
                                      <span>{selectedSurgery.ora}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">H&P: </span>
                                      <span>{selectedSurgery.hp}</span>
                                    </p>
                                  </div>
                                  <div className="flex-1">
                                    <p>
                                      <span className="font-bold">Lens: </span>
                                      <span>{selectedSurgery.lens}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">
                                        Implant:{' '}
                                      </span>
                                      <span>{selectedSurgery.implant}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">
                                        Details:{' '}
                                      </span>
                                      <span>{selectedSurgery.details}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">#: </span>
                                      <span>{selectedSurgery.hash}</span>
                                    </p>
                                  </div>
                                  <div className="flex-1">
                                    {viewBillingColumn && (
                                      <p>
                                        <span className="font-bold">
                                          Prof:{' '}
                                        </span>
                                        <span>{selectedSurgery.prof}</span>
                                      </p>
                                    )}
                                    {viewBillingColumn && (
                                      <p>
                                        <span className="font-bold">
                                          Hospital:{' '}
                                        </span>
                                        <span>{selectedSurgery.hospital}</span>
                                      </p>
                                    )}
                                    <p>
                                      <span className="font-bold">
                                        Insurance:{' '}
                                      </span>
                                      <span>{selectedSurgery.insurance}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">
                                        Consent:{' '}
                                      </span>
                                      <span>{selectedSurgery.consent}</span>
                                    </p>
                                    <p>
                                      <span className="font-bold">
                                        Contact Info:{' '}
                                      </span>
                                      <span>rfq@fantasticaltech.enigm</span>
                                    </p>
                                    <p>
                                      <span>(246) 276 9618</span>
                                    </p>
                                  </div>
                                </div>
                              )}
                            {selectedRow === row.id &&
                              clonedDivs.length > 0 &&
                              selectedAction == 'clone' && (
                                <div className="border border-red-400 w-max text-xs">
                                  {clonedDivs.map((clonedDivHTML, index) => (
                                    <div
                                      key={index}
                                      dangerouslySetInnerHTML={{
                                        __html: clonedDivHTML,
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                          </>
                        ),
                      )}
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
        </div>
      )}
    </div>
  );
};

export default FiltersSection;
