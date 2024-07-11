import { MonthOption, UpdateSurgeryPayload } from '@packages/entities';
import { SurgeryStatus } from '@packages/entities/index.browser';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useUserPermission } from '@root/hooks/userHasPermission';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchFilteredCalendars } from '@root/store/reducers/calendar';
import { fetchListings as fetchReviews } from '@root/store/reducers/review';
import { fetchListings, updateRecordAsync } from '@root/store/reducers/surgery';
import {
  getPracticeId,
  getSelectedMonths,
  getUserId,
  toFullName,
} from '@root/utils';
import { DatePicker } from 'baseui/datepicker';
import { SIZE, Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';

function EditableRow({
  rowId,
  handleCancelClick,
  customHeaders,
  surgeryInfo,
  handleUpdateClick,
  setIsUpdateLoading,
}) {
  const practiceId = getPracticeId();
  const surgeryStatusOptions = Object.keys(SurgeryStatus).map((key) => ({
    label: SurgeryStatus[key as keyof typeof SurgeryStatus],
    id: key,
  }));

  const dispatch = useAppDispatch();
  const {
    selectedMonth,
    searchMRNName,
    selectedValue,
    surgeryConfigurationsList,
    waitlist,
    userInfo,
    insuranceTypesList,
    referrersList,
    practiceHomesList,
  } = useAppSelector((state) => ({
    selectedMonth: state.surgeries.surgeryFilters.selectedMonth,
    searchMRNName: state.surgeries.surgeryFilters.searchMRNName,
    selectedValue: state.surgeries.surgeryFilters.selectedValue,
    surgeryConfigurationsList: Object.values(
      state.surgeryConfigurations.entities,
    ),
    waitlist: Object.values(state.waitlist.entities),
    userInfo: state.auth.user,
    insuranceTypesList: Object.values(state.insuranceTypes.entities),
    referrersList: Object.values(state.referrers.entities),
    practiceHomesList: Object.values(state.practiceHomes.entities),
  }));

  const month = getSelectedMonths(selectedMonth);

  const userPermissions = userInfo?.permissions;
  const loggedInUserId = userInfo?.id ?? null;
  const viewBillingColumn = useUserPermission(userPermissions, [
    USER_PERMISSIONS.VIEW_BILLING,
  ]);
  const adminPermission = useUserPermission(userPermissions, [
    USER_PERMISSIONS.ADMIN_PERMISSION,
  ]);
  const [obj, setObj] = useState<Partial<UpdateSurgeryPayload>>({});
  const [insuranceTypeId, setInsuranceTypeId] = useState<string>('');
  const [referrerId, setReferrerId] = useState<string>('');
  const [waitlistId, setWaitlistId] = useState<string>('');

  const doctorId = getUserId();

  useEffect(() => {
    if (surgeryInfo.id && surgeryInfo) {
      setObj({
        insuranceTypeId: surgeryInfo?.insuranceType?.name,
        surgeryStatus: surgeryInfo?.surgeryStatus,
        date: new Date(surgeryInfo.date),
        firstName: surgeryInfo.patient.firstName,
        lastName: surgeryInfo.patient.lastName,
        email: surgeryInfo.patient.email,
        phoneNumber: surgeryInfo.patient.phoneNumber,
        notes: surgeryInfo.notes ? surgeryInfo.notes : '',
        bodyPart: surgeryInfo.bodyPart,
        mrn: surgeryInfo.patient.mrn,
        selectedSurgeryOptions: surgeryInfo.selectedSurgeryOptions,
        selectedCheckListOptions: surgeryInfo.selectedCheckListOptions,
        totalHospitalPricing: surgeryInfo.totalHospitalPricing,
        totalProfessionalPricing: surgeryInfo.totalProfessionalPricing,
        surgeryOrder: surgeryInfo.surgeryOrder,
        referrerId: surgeryInfo.patient.referrer
          ? toFullName(surgeryInfo.patient.referrer)
          : '',
        practiceHomeId: surgeryInfo.practiceHome.id,
        selectedConditionalOptions: surgeryInfo.selectedConditionalOptions,
      });
      setInsuranceTypeId(surgeryInfo?.insuranceType?.id);
      setReferrerId(surgeryInfo.patient?.referrer?.id);
      setWaitlistId(surgeryInfo?.waitlist?.id);
    }
  }, [surgeryInfo.id, surgeryInfo]);

  const waitlistOptions = Object.keys(waitlist).map((key) => ({
    label: waitlist[key].name,
    id: waitlist[key].id,
  }));

  const practiceHomesOptions = Object.keys(practiceHomesList).map((key) => ({
    label: practiceHomesList[key].name[0],
    id: practiceHomesList[key].id,
  }));

  const surgeryConfigurationsOptions = Object.values(
    surgeryConfigurationsList,
  ).map((key) => ({
    label: key.name,
    id: key.id,
  }));

  const handleObjChange = (keyToUpdate: string, newValue) => {
    setObj((prevState) => ({
      ...prevState,
      [keyToUpdate]: newValue,
    }));
  };

  const handleInsuranceTypeChange = ({ value }) => {
    setInsuranceTypeId(value[0] ? value[0].id : null);
  };

  const handleReferrerChange = ({ value }) => {
    setReferrerId(value[0] ? value[0].id : null);
  };

  const handleWaitlistChange = ({ value }) => {
    setWaitlistId(value[0] ? value[0].id : null);
  };

  const dispatchFetchFilteredSurgeryList = async (
    selectedMonth: MonthOption[],
    searchMRNName: string,
    selectedValue: string,
  ) => {
    const monthLabels = selectedMonth.map((month) => month.label);
    const month = monthLabels.join(',');
    const selectedOption = selectedValue;

    if (practiceId && loggedInUserId !== null && doctorId) {
      await dispatch(
        fetchListings({
          loggedInUserId,
          practiceId,
          month: month,
          searchMRNName,
          option: selectedOption,
          doctorId,
        }),
      );
    }
  };
  const searchMRNNameStr = searchMRNName || '';
  const selectedValueStr = selectedValue || '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (practiceId) {
      const payload: Partial<UpdateSurgeryPayload> = {
        practiceId,
        ...obj,
        insuranceTypeId,
        referrerId,
        waitlistId,
      };
      try {
        setIsUpdateLoading(true);

        await dispatch(updateRecordAsync({ payload, id: surgeryInfo.id }));

        await dispatchFetchFilteredSurgeryList(
          selectedMonth,
          searchMRNNameStr,
          selectedValueStr,
        );
        await dispatch(
          fetchFilteredCalendars({
            practiceId,
            userId: doctorId || '',
            month,
            option: selectedValueStr,
            loggedInUserId: userInfo?.id,
          }),
        );
        if (payload?.surgeryStatus === SurgeryStatus.COMPLETED) {
          await dispatch(fetchReviews({ practiceId: practiceId }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsUpdateLoading(false);
      }

      setInsuranceTypeId('');
      setReferrerId('');
      setWaitlistId('');
      setObj({
        insuranceTypeId: '',
        date: new Date(),
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        notes: '',
        bodyPart: '',
        surgeryStatus: SurgeryStatus.PENDING,
        mrn: 0,
        selectedSurgeryOptions: {},
        selectedCheckListOptions: {},
        totalHospitalPricing: '0',
        totalProfessionalPricing: '0',
        referrerId: '',
      });
    }
    handleUpdateClick(rowId); // Close the specific row after updating
  };

  if (surgeryInfo) {
    const { surgeryConfiguration } = surgeryInfo;
    const surgeryName: string = surgeryConfiguration.name;
    const customOptionsHeaders: string[] =
      customHeaders[surgeryName].surgeryOptionsHeaders;
    const customCheckListHeaders: string[] =
      customHeaders[surgeryName].checkListHeaders;

    const customConditionalHeaders: string[] =
      customHeaders[surgeryName].conditionalHeaders;

    return (
      <>
        <tr className="border-t border-gray-300">
          <td rowSpan={2} className="min-w-28">
            <DatePicker
              value={obj.date}
              onChange={({ date }) => handleObjChange('date', date)}
              size={SIZE.mini}
              overrides={{
                Root: {
                  style: {
                    heightOverride: '40px',
                  },
                },
              }}
            />
          </td>
          <td rowSpan={2} className="">
            <Select
              size={SIZE.mini}
              required
              backspaceRemoves={false}
              options={practiceHomesOptions}
              value={
                obj.practiceHomeId
                  ? [{ id: obj.practiceHomeId, label: obj.practiceHomeId }]
                  : []
              }
              onChange={({ value }) =>
                handleObjChange('practiceHomeId', value[0].id)
              }
              overrides={{
                ControlContainer: {
                  style: {
                    backgroundColor: 'rgba(250, 250, 250, 1)',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    color: '#52525B',
                  },
                },
                ClearIcon: {
                  component: () => null,
                },
              }}
            />
          </td>
          <td rowSpan={2} className="">
            <Select
              options={surgeryStatusOptions}
              overrides={{
                ControlContainer: {
                  style: {
                    backgroundColor: 'rgba(250, 250, 250, 1)',
                    border: 'none',
                    color: 'rgba(82, 82, 91, 1)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    width: '130px',
                  },
                },
                ClearIcon: {
                  component: () => null,
                },
              }}
              value={
                obj?.surgeryStatus
                  ? [
                      {
                        label: obj.surgeryStatus,
                        id: obj.surgeryStatus,
                      },
                    ]
                  : []
              }
              disabled={obj?.surgeryStatus === SurgeryStatus.COMPLETED}
              size={SIZE.mini}
              onChange={({ value }) =>
                handleObjChange('surgeryStatus', value[0].label)
              }
            />
          </td>
          <td rowSpan={1} className="min-w-24">
            <div className="">
              <TextInput
                size={SIZE.mini}
                name="lastName"
                value={obj.lastName}
                onChange={(value) => handleObjChange('lastName', value)}
              />
            </div>
          </td>
          <td rowSpan={1} className="min-w-24">
            <div className="">
              <TextInput
                size={SIZE.mini}
                name="firstName"
                value={obj.firstName}
                onChange={(value) => handleObjChange('firstName', value)}
              />
            </div>
          </td>
          <td rowSpan={1} className="min-w-24">
            <TextInput
              name="mrn"
              type="number"
              value={obj.mrn}
              onChange={(value) => handleObjChange('mrn', value)}
              size={SIZE.mini}
            />
          </td>
          <td rowSpan={1} className="">
            <Select
              backspaceRemoves={false}
              escapeClearsValue={false}
              disabled
              options={surgeryConfigurationsOptions}
              value={
                surgeryName
                  ? [
                      {
                        id: surgeryName,
                        label: surgeryName,
                      },
                    ]
                  : []
              }
              onChange={({ value }) =>
                handleObjChange('surgeryConfigurationId', value[0].id)
              }
              size={SIZE.mini}
              overrides={{
                ControlContainer: {
                  style: {
                    backgroundColor: 'rgba(250, 250, 250, 1)',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    color: '#52525B',
                  },
                },

                ClearIcon: {
                  component: () => null,
                },
              }}
            />
          </td>
          <td rowSpan={1} className="">
            <Select
              backspaceRemoves={false}
              options={surgeryConfiguration.bodyPart.map((ele) => ({
                id: ele,
                label: ele,
              }))}
              value={
                obj.bodyPart
                  ? [{ id: obj.bodyPart, label: obj.bodyPart }]
                  : [{ id: 'd', label: 'r' }]
              }
              onChange={({ value }) => handleObjChange('bodyPart', value[0].id)}
              size={SIZE.mini}
              overrides={{
                ControlContainer: {
                  style: {
                    backgroundColor: 'rgba(250, 250, 250, 1)',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    color: '#52525B',
                  },
                },

                ClearIcon: {
                  component: () => null,
                },
              }}
            />
          </td>
          <td rowSpan={2}>
            <table className="w-full">
              <tbody>
                <tr>
                  {customOptionsHeaders.map(
                    (optionsHeader, optionsHeaderIndex) => {
                      const count =
                        surgeryConfiguration.options[optionsHeader]?.count;

                      const optionCountSelect: JSX.Element[] = [];

                      for (let index = 0; index < count; index++) {
                        const selectOptionObj = obj.selectedSurgeryOptions
                          ? obj.selectedSurgeryOptions[
                              `${optionsHeader}-${index}`
                            ]
                          : {
                              id: '',
                              value: '',
                              hospitalPricing: 0,
                              professionalPricing: 0,
                            };

                        optionCountSelect.push(
                          <div key={index} className="">
                            <Select
                              backspaceRemoves={false}
                              escapeClearsValue={false}
                              key={optionsHeaderIndex}
                              options={surgeryConfiguration.options[
                                optionsHeader
                              ]?.allowedValues?.map((ele) => {
                                return {
                                  id: ele.name,
                                  label: ele.name,
                                  hospitalPricing: ele.hospitalPricing,
                                  professionalPricing: ele.professionalPricing,
                                };
                              })}
                              value={
                                selectOptionObj
                                  ? [
                                      {
                                        id: selectOptionObj.value,
                                        value: selectOptionObj.value,
                                        hospitalPricing:
                                          selectOptionObj.hospitalPricing,
                                        professionalPricing:
                                          selectOptionObj.professionalPricing,
                                      },
                                    ]
                                  : []
                              }
                              onChange={({ value }) =>
                                handleObjChange('selectedSurgeryOptions', {
                                  ...obj.selectedSurgeryOptions,
                                  [`${optionsHeader}-${index}`]: {
                                    value: value[0].label,
                                  },
                                })
                              }
                              disabled={
                                surgeryConfiguration.options[optionsHeader]
                                  ?.edit_admin_option === true &&
                                !adminPermission
                              }
                              size={SIZE.mini}
                              overrides={{
                                ControlContainer: {
                                  style: {
                                    backgroundColor: 'rgba(250, 250, 250, 1)',
                                    border: 'none',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    color: '#52525B',
                                  },
                                },

                                ClearIcon: {
                                  component: () => null,
                                },
                              }}
                            />
                          </div>,
                        );
                      }
                      return (
                        <td className="min-w-10 w-1/2" key={optionsHeaderIndex}>
                          {optionCountSelect}
                        </td>
                      );
                    },
                  )}
                </tr>
              </tbody>
            </table>
          </td>
          <td className="p-0" rowSpan={2}>
            <tr>
              {customConditionalHeaders && customConditionalHeaders.length
                ? customConditionalHeaders.map(
                    (conditionalHeader, conditionalHeaderIndex) => {
                      const currentConditionalOption =
                        surgeryConfiguration.conditionalOptions[
                          conditionalHeader
                        ];
                      const count: number = currentConditionalOption.count;

                      const isDependant: boolean =
                        currentConditionalOption.dependsUpon;

                      const conditionalCountSelect: JSX.Element[] = [];

                      for (let index = 0; index < count; index++) {
                        const selectOptionObj = obj.selectedConditionalOptions
                          ? obj.selectedConditionalOptions[
                              `${conditionalHeader}-${index}`
                            ]
                          : {
                              id: '',
                              value: '',
                            };
                        let options = currentConditionalOption.values;
                        if (isDependant) {
                          // creating same index address for fetching corresponding parent
                          const parentAddress: string = `${
                            customConditionalHeaders[0] + '-' + index
                          }`;

                          // null check to verify selected conditional options
                          const selectedConditions =
                            obj.selectedConditionalOptions ?? null;

                          // key value of dependency fetched.
                          const correspondingParent =
                            selectedConditions &&
                            selectedConditions[parentAddress]
                              ? selectedConditions[parentAddress].value
                              : '';

                          // checking if dependencies exists for the parent
                          const searchDependency =
                            currentConditionalOption.dependencies.find(
                              (ele) => ele.key == correspondingParent,
                            );

                          // creating options for select
                          options = searchDependency
                            ? searchDependency.values
                            : currentConditionalOption.values;
                        }

                        conditionalCountSelect.push(
                          <div key={index} className="mb-2">
                            <Select
                              backspaceRemoves={false}
                              escapeClearsValue={false}
                              key={conditionalHeaderIndex}
                              options={options.map((ele) => {
                                return {
                                  id: ele,
                                  label: ele,
                                };
                              })}
                              value={
                                selectOptionObj
                                  ? [
                                      {
                                        id: selectOptionObj.value,
                                        value: selectOptionObj.value,
                                      },
                                    ]
                                  : []
                              }
                              onChange={({ value }) =>
                                handleObjChange('selectedConditionalOptions', {
                                  ...obj.selectedConditionalOptions,
                                  [`${conditionalHeader}-${index}`]: {
                                    value: value[0].label,
                                  },
                                })
                              }
                              disabled={
                                surgeryConfiguration?.conditionalOptions[
                                  conditionalHeader
                                ]?.editAdminOption === true && !adminPermission
                              }
                              size={SIZE.mini}
                              overrides={{
                                ControlContainer: {
                                  style: {
                                    backgroundColor: 'rgba(250, 250, 250, 1)',
                                    border: 'none',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    color: '#52525B',
                                  },
                                },

                                ClearIcon: {
                                  component: () => null,
                                },
                              }}
                            />
                          </div>,
                        );
                      }
                      return (
                        <td className="min-w-10" key={conditionalHeaderIndex}>
                          {conditionalCountSelect}
                        </td>
                      );
                    },
                  )
                : ''}
            </tr>
          </td>
          <td rowSpan={2} className="min-w-12">
            <TextInput
              type="number"
              name="hash"
              value={obj.surgeryOrder}
              onChange={(value) => handleObjChange('surgeryOrder', value)}
              size={SIZE.mini}
            />
          </td>
          <td rowSpan={2}>
            <table className="w-full">
              <tbody>
                <tr>
                  {customCheckListHeaders.map(
                    (checkListHeader, checkListHeaderIndex) => {
                      const selectedChecklistOption =
                        obj.selectedCheckListOptions
                          ? obj.selectedCheckListOptions[checkListHeader]
                          : '';

                      return (
                        <td
                          className="w-full min-w-10"
                          key={checkListHeaderIndex}
                        >
                          <TextInput
                            size={SIZE.mini}
                            value={
                              selectedChecklistOption
                                ? selectedChecklistOption.value
                                : ''
                            }
                            onChange={(value) =>
                              handleObjChange('selectedCheckListOptions', {
                                ...obj.selectedCheckListOptions,
                                [checkListHeader]: { value },
                              })
                            }
                          />
                        </td>
                      );
                    },
                  )}
                </tr>
              </tbody>
            </table>
          </td>
          {viewBillingColumn && (
            <td rowSpan={2} className="min-w-12">
              <TextInput
                size={SIZE.mini}
                name="prof"
                value={obj.totalProfessionalPricing}
                onChange={(value) =>
                  handleObjChange('totalProfessionalPricing', value)
                }
                backgroundColor="rgba(220, 220, 220, 1)"
              />
            </td>
          )}
          {viewBillingColumn && (
            <td rowSpan={2} className="min-w-12">
              <TextInput
                size={SIZE.mini}
                name="hospital"
                value={obj.totalHospitalPricing}
                onChange={(value) =>
                  handleObjChange('totalHospitalPricing', value)
                }
                backgroundColor="rgba(220, 220, 220, 1)"
              />
            </td>
          )}
          <td rowSpan={2} className="">
            <Select
              backspaceRemoves={false}
              escapeClearsValue={false}
              options={insuranceTypesList.map((ele) => ({
                id: ele.id,
                label: ele.name,
              }))}
              value={
                insuranceTypeId
                  ? [{ label: insuranceTypeId, id: insuranceTypeId }]
                  : []
              }
              onChange={handleInsuranceTypeChange}
              size={SIZE.mini}
              overrides={{
                ControlContainer: {
                  style: {
                    backgroundColor: 'rgba(250, 250, 250, 1)',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    color: '#52525B',
                  },
                },

                ClearIcon: {
                  component: () => null,
                },
              }}
            />
          </td>
          <td rowSpan={2} className="">
            <div className="text-black py-0.5 px-1 w-40 text-center">
              <TextInput
                name="hash"
                value={obj.email}
                onChange={(value) => handleObjChange('email', value)}
                size={SIZE.mini}
              />
            </div>
            <div className="text-black py-0.5 px-1 w-40 text-center">
              <TextInput
                name="hash"
                value={obj.phoneNumber}
                onChange={(value) => handleObjChange('phoneNumber', value)}
                size={SIZE.mini}
              />
            </div>
            <div className="text-black py-0.5 px-1 w-40 text-center">
              <Select
                backspaceClearsInputValue={true}
                escapeClearsValue={false}
                options={referrersList.map((ele) => ({
                  id: ele.id,
                  label: toFullName(ele),
                }))}
                value={
                  referrerId && surgeryInfo?.patient?.referrer
                    ? [
                        {
                          label: toFullName(surgeryInfo.patient.referrer),
                          id: referrerId,
                        },
                      ]
                    : []
                }
                onChange={handleReferrerChange}
                size={SIZE.mini}
                overrides={{
                  ControlContainer: {
                    style: {
                      backgroundColor: 'rgba(250, 250, 250, 1)',
                      border: 'none',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      color: '#52525B',
                    },
                  },

                  ClearIcon: {
                    component: () => null,
                  },
                }}
              />
            </div>
          </td>
          <td rowSpan={2} className=" ">
            <div className="flex gap-2">
              <Button
                kind="primary"
                title="Update"
                width={60}
                height={10}
                type="submit"
                onClick={handleSubmit}
              />
              <Button
                onClick={handleCancelClick}
                type="button"
                kind="tertiary"
                title="Cancel"
                width={60}
                height={10}
                style={{
                  backgroundColor: 'rgba(212, 212, 216, 1)',
                  color: 'black',
                }}
              />
            </div>
          </td>
        </tr>

        <tr>
          <td className="bg-white" colSpan={5}>
            <div className="">
              <div className="flex items-center gap-2">
                <span className="font-bold">Waitlist: </span>
                <div className="">
                  <Select
                    options={waitlistOptions}
                    size={SIZE.mini}
                    onChange={handleWaitlistChange}
                    value={
                      waitlistId ? [{ label: waitlistId, id: waitlistId }] : []
                    }
                    overrides={{
                      ControlContainer: {
                        style: {
                          backgroundColor: 'rgba(250, 250, 250, 1)',
                          border: 'none',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          color: '#52525B',
                        },
                      },
                      ClearIcon: {
                        component: () => null,
                      },
                    }}
                  />
                </div>
              </div>
              <div>
                <span className="font-bold">Notes:</span>
                <TextInput
                  size={SIZE.mini}
                  name="notes"
                  value={obj?.notes}
                  onChange={(value) => handleObjChange('notes', value)}
                />
              </div>
            </div>
          </td>
        </tr>
      </>
    );
  } else return null;
}
export default EditableRow;
