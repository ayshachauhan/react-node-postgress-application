import { UpdateSurgeryPayload } from '@packages/entities';
import { IReferrer, SurgeryStatus } from '@packages/entities/index.browser';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useUserPermission } from '@root/hooks/userHasPermission';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchFilteredCalendars } from '@root/store/reducers/calendar';
import { fetchListings as fetchReviews } from '@root/store/reducers/review';
import { updateRecordAsync } from '@root/store/reducers/surgery';
import {
  getBackGroundColorCss,
  getPracticeId,
  getSelectedMonths,
  getUserId,
  isZeroPricing,
  toFullName,
} from '@root/utils';
import { Checkbox } from 'baseui/checkbox';
import { DatePicker } from 'baseui/datepicker';
import { SIZE, Select } from 'baseui/select';
import React, { useEffect, useRef, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface EditableRowProps {
  rowId: string;
  handleCancelClick: () => void;
  customHeaders;
  surgeryInfo;
  handleUpdateClick;
  setIsUpdateLoading;
  onRecordEdited?: () => void;
}

const EditableRow: React.FC<EditableRowProps> = ({
  rowId,
  handleCancelClick,
  customHeaders,
  surgeryInfo,
  handleUpdateClick,
  setIsUpdateLoading,
  onRecordEdited,
}) => {
  const practiceId = getPracticeId();
  const surgeryStatusOptions = Object.keys(SurgeryStatus).map((key) => ({
    label: SurgeryStatus[key as keyof typeof SurgeryStatus],
    id: key,
  }));

  const dispatch = useAppDispatch();
  const handleMonthChange = ({ date }) => {
    setCurrentMonth(date.getMonth() + 1);
  };
  const {
    selectedMonth,
    selectedValue,
    surgeryConfigurationsList,
    waitlist,
    userInfo,
    insuranceTypesList,
    referrersList,
    pcpList,
    practiceHomesList,
  } = useAppSelector((state) => ({
    selectedMonth: state.surgeries.surgeryFilters.selectedMonth,
    selectedValue: state.surgeries.surgeryFilters.selectedValue,
    surgeryConfigurationsList: Object.values(
      state.surgeryConfigurations.entities,
    ),
    waitlist: Object.values(state.waitlist.entities),
    userInfo: state.auth.user,
    insuranceTypesList: Object.values(state.insuranceTypes.entities),
    referrersList: Object.values(state.referrers.entities),
    pcpList: Object.values(state.referrers.entities),
    practiceHomesList: Object.values(state.practiceHomes.entities),
  }));

  const month = getSelectedMonths(selectedMonth);

  const userPermissions = userInfo?.permissions;
  const viewBillingColumn = useUserPermission(userPermissions, [
    USER_PERMISSIONS.VIEW_BILLING,
  ]);
  const adminPermission = useUserPermission(userPermissions, [
    USER_PERMISSIONS.ADMIN_PERMISSION,
  ]);
  const [obj, setObj] = useState<Partial<UpdateSurgeryPayload>>({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [insuranceTypeId, setInsuranceTypeId] = useState<string>('');
  const [referrerId, setReferrerId] = useState<string>('');
  const [pcp, setPcp] = useState<string>('');
  const [waitlistId, setWaitlistId] = useState<string>('');

  const doctorId: string | null = getUserId();

  const phoneInputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (phoneInputRef.current) {
      const button = phoneInputRef.current.querySelector(
        '.react-international-phone-country-selector-button',
      );
      if (button) {
        const buttonElement = button as HTMLElement;
        buttonElement.style.height = '20px';
        buttonElement.style.borderTopRightRadius = '0';
        buttonElement.style.borderBottomRightRadius = '0';
        buttonElement.style.borderRight = '0';
        buttonElement.style.border = '0';
        buttonElement.style.backgroundColor = 'rgb(250, 250, 250)';
        buttonElement.style.color = 'rgba(82, 82, 91, 1)';
        buttonElement.style.fontSize = '0.75rem';
      }
    }
  }, []);

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
        countryCode: surgeryInfo.patient.countryCode,
        notes: surgeryInfo.notes ? surgeryInfo.notes : '',
        bodyPart: surgeryInfo.bodyPart,
        mrn: surgeryInfo.patient.mrn,
        selectedSurgeryOptions: surgeryInfo.selectedSurgeryOptions,
        selectedCheckListOptions: surgeryInfo.selectedCheckListOptions,
        totalHospitalPricing: surgeryInfo.totalHospitalPricing,
        totalProfessionalPricing: surgeryInfo.totalProfessionalPricing,
        initialProfPrice: surgeryInfo.initialProfPrice,
        initialHospitalPrice: surgeryInfo.initialHospitalPrice,
        surgeryOrder: surgeryInfo.surgeryOrder,
        referrerId: surgeryInfo.referrer
          ? toFullName(surgeryInfo.referrer)
          : '',
        pcp: surgeryInfo.pcp ? toFullName(surgeryInfo.pcp) : '',
        practiceHomeId: surgeryInfo?.practiceHome?.id,
        selectedConditionalOptions: surgeryInfo.selectedConditionalOptions,
      });
      setInsuranceTypeId(surgeryInfo?.insuranceType?.id);
      setReferrerId(surgeryInfo.referrer?.id);
      setPcp(surgeryInfo.pcp?.id);
      setWaitlistId(surgeryInfo?.waitlist?.id);
    }
  }, [surgeryInfo.id, surgeryInfo]);

  const waitlistOptions = Object.keys(waitlist).map((key) => ({
    label: waitlist[key].name,
    id: waitlist[key].id,
  }));

  const practiceHomesOptions = Object.keys(practiceHomesList).map((key) => ({
    label: practiceHomesList[key].name,
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
    if (value.length > 0) {
      setReferrerId(value[0] ? value[0].id : null);
    }
  };

  const handlePcpChange = ({ value }) => {
    if (value.length > 0) {
      setPcp(value[0] ? value[0].id : null);
    }
  };

  const handleWaitlistChange = ({ value }) => {
    setWaitlistId(value[0] ? value[0].id : null);
  };

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
        pcp,
      };
      try {
        setIsUpdateLoading(true);

        await dispatch(updateRecordAsync({ payload, id: surgeryInfo.id }));

        if (onRecordEdited) {
          onRecordEdited();
        }
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
        countryCode: '',
        notes: '',
        bodyPart: '',
        surgeryStatus: SurgeryStatus.PENDING,
        mrn: 0,
        selectedSurgeryOptions: {},
        selectedCheckListOptions: {},
        totalHospitalPricing: '0',
        totalProfessionalPricing: '0',
        referrerId: '',
        pcp: '',
      });
    }
    handleUpdateClick(rowId); // Close the specific row after updating
  };
  const { calendars } = useAppSelector((state) => ({
    calendars: Object.values(state.calendars?.entities).filter(
      (calendar) => calendar?.user?.id === doctorId,
    ),
  }));

  const CustomOptionWithTick = (option: IReferrer) => {
    return (
      <span style={{ display: 'flex', alignItems: 'start', padding: '2px' }}>
        {toFullName(option)} &nbsp;
        {option?.verified && (
          <Checkbox
            checked={option?.verified}
            overrides={{
              Checkmark: {
                style: ({ $checked }) => ({
                  backgroundColor: $checked ? 'rgba(34, 197, 94, 1)' : 'white',
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
    );
  };

  if (surgeryInfo) {
    const { surgeryConfiguration } = surgeryInfo;
    const surgeryName: string = surgeryConfiguration?.name || '';
    const customOptionsHeaders: string[] =
      customHeaders[surgeryName]?.surgeryOptionsHeaders || [];
    const customCheckListHeaders: string[] =
      customHeaders[surgeryName]?.checkListHeaders || [];

    const customConditionalHeaders: string[] =
      customHeaders[surgeryName]?.conditionalHeaders || [];

    const selectedReferrer = referrerId
      ? referrersList.find((ele) => ele.id === referrerId)
      : null;

    const selectedPcp = pcp ? pcpList.find((ele) => ele.id === pcp) : null;

    return (
      <>
        <tr className="border-t border-gray-300">
          <td rowSpan={2} className="min-w-[85px]">
            <DatePicker
              value={obj.date}
              onChange={({ date }) => handleObjChange('date', date)}
              onMonthChange={handleMonthChange}
              size={SIZE.mini}
              onOpen={() => {
                handleMonthChange({ date: obj.date });
              }}
              overrides={{
                Root: {
                  style: {
                    heightOverride: '40px',
                  },
                },
                Day: {
                  style: ({ $date }) => {
                    return {
                      height: '53px',
                      width: '53px',
                      borderRadius: '50%',
                      boxSizing: 'border-box',
                      paddingTop: '6px',
                      paddingBottom: '6px',
                      margin: '2px',
                      ...getBackGroundColorCss($date, currentMonth, calendars),
                      ':after': '',
                    };
                  },
                },
              }}
            />
          </td>
          <td rowSpan={2} className="min-w-[45px]">
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
                    width: '70px',
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
          <td rowSpan={1} className="min-w-20">
            <div className="">
              <TextInput
                size={SIZE.mini}
                name="lastName"
                value={obj.lastName}
                onChange={(value) => handleObjChange('lastName', value)}
              />
            </div>
          </td>
          <td rowSpan={1} className="min-w-20">
            <div className="">
              <TextInput
                size={SIZE.mini}
                name="firstName"
                value={obj.firstName}
                onChange={(value) => handleObjChange('firstName', value)}
              />
            </div>
          </td>
          <td rowSpan={1} className="max-w-16">
            <TextInput
              name="mrn"
              type="number"
              value={obj.mrn}
              onChange={(value) => handleObjChange('mrn', value)}
              size={SIZE.mini}
            />
          </td>
          <td rowSpan={1} className="min-w-20">
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
          <td rowSpan={1} className="min-w-20">
            <Select
              backspaceRemoves={false}
              options={
                surgeryConfiguration?.bodyPart
                  ? surgeryConfiguration.bodyPart.map((ele) => ({
                      id: ele,
                      label: ele,
                    }))
                  : []
              }
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
          <td rowSpan={2} className="min-w-10">
            <TextInput
              type="number"
              name="hash"
              value={obj.surgeryOrder}
              onChange={(value) => handleObjChange('surgeryOrder', value)}
              size={SIZE.mini}
            />
          </td>
          <td rowSpan={2} className="p-0 align-top">
            <table className="w-full">
              <tbody>
                <tr>
                  {customOptionsHeaders &&
                    customOptionsHeaders.length > 0 &&
                    Array.from({
                      length: Math.ceil(customOptionsHeaders.length / 3),
                    }).map((_, rowIndex) => (
                      <React.Fragment key={rowIndex}>
                        <tr>
                          {customOptionsHeaders
                            .slice(rowIndex * 3, rowIndex * 3 + 3)
                            .map((optionsHeader, optionsHeaderIndex) => (
                              <th
                                className="bg-[#1B7F7D]"
                                key={optionsHeaderIndex}
                              >
                                {optionsHeader}
                              </th>
                            ))}
                        </tr>
                        <tr>
                          {customOptionsHeaders
                            .slice(rowIndex * 3, rowIndex * 3 + 3)
                            .map((optionsHeader, optionsHeaderIndex) => {
                              const count =
                                surgeryConfiguration.options[optionsHeader]
                                  ?.count;

                              const optionCountSelect: JSX.Element[] = [];

                              for (let index = 0; index < count; index++) {
                                const selectOptionObj =
                                  obj.selectedSurgeryOptions
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
                                      options={[
                                        { id: '', label: '' }, // Add a blank option
                                        ...(surgeryConfiguration.options[
                                          optionsHeader
                                        ] &&
                                        surgeryConfiguration.options[
                                          optionsHeader
                                        ].allowedValues
                                          ? surgeryConfiguration.options[
                                              optionsHeader
                                            ].allowedValues.map((ele) => ({
                                              id: ele.name,
                                              label: ele.name,
                                              hospitalPricing:
                                                ele.hospitalPricing,
                                              professionalPricing:
                                                ele.professionalPricing,
                                            }))
                                          : []),
                                      ]}
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
                                      onChange={({ value }) => {
                                        const selectedValues = {
                                          ...obj.selectedSurgeryOptions,
                                          [`${optionsHeader}-${index}`]: {
                                            value: value[0].label,
                                          },
                                        };

                                        let //startHospPrice = 0,
                                          //startProfPrice = 0,
                                          hospitalTotal = 0,
                                          profTotal = 0;
                                        if (
                                          selectedValues &&
                                          Object.keys(selectedValues).length > 0
                                        ) {
                                          Object.keys(selectedValues)?.map(
                                            (s) => {
                                              const optionName = s.slice(
                                                0,
                                                s.lastIndexOf('-'),
                                              );
                                              const objValue =
                                                surgeryConfiguration.options[
                                                  `${optionName}`
                                                ]?.allowedValues?.find(
                                                  (c) =>
                                                    c.name ==
                                                    selectedValues[s]?.value,
                                                );

                                              if (objValue) {
                                                // startHospPrice += Number(
                                                //   objValue.hospitalPricing,
                                                // );
                                                // startProfPrice += Number(
                                                //   objValue.professionalPricing,
                                                // );
                                                hospitalTotal += Number(
                                                  objValue.hospitalPricing,
                                                );
                                                profTotal += Number(
                                                  objValue.professionalPricing,
                                                );
                                              }
                                            },
                                          );
                                        }

                                        setObj((prevState) => ({
                                          ...prevState,
                                          //initialHospitalPrice: `${startHospPrice}`,
                                          //initialProfPrice: `${startProfPrice}`,
                                          totalHospitalPricing: `${hospitalTotal}`,
                                          totalProfessionalPricing: `${profTotal}`,
                                        }));

                                        handleObjChange(
                                          'selectedSurgeryOptions',
                                          selectedValues,
                                        );
                                      }}
                                      disabled={
                                        surgeryConfiguration.options[
                                          optionsHeader
                                        ]?.edit_admin_option === true &&
                                        !adminPermission
                                      }
                                      size={SIZE.mini}
                                      overrides={{
                                        ControlContainer: {
                                          style: {
                                            backgroundColor:
                                              'rgba(250, 250, 250, 1)',
                                            border: 'none',
                                            boxShadow:
                                              '0 2px 4px rgba(0, 0, 0, 0.1)',
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
                                <td
                                  className="min-w-10 w-1/2"
                                  key={optionsHeaderIndex}
                                >
                                  {optionCountSelect}
                                </td>
                              );
                            })}
                        </tr>
                      </React.Fragment>
                    ))}
                </tr>
              </tbody>
            </table>
          </td>
          <td rowSpan={2} className="p-0 align-top">
            <table>
              <tbody>
                <tr>
                  {customConditionalHeaders &&
                    customConditionalHeaders.length > 0 &&
                    customConditionalHeaders.map(
                      (
                        customConditionalHeader,
                        customConditionalHeaderIndex,
                      ) => (
                        <th
                          className="bg-[#1B7F7D]"
                          key={customConditionalHeaderIndex}
                        >
                          {customConditionalHeader}
                        </th>
                      ),
                    )}
                </tr>
                <tr>
                  {customConditionalHeaders &&
                  customConditionalHeaders.length > 0
                    ? customConditionalHeaders.map(
                        (conditionalHeader, conditionalHeaderIndex) => {
                          const currentConditionalOption =
                            surgeryConfiguration.conditionalOptions[
                              conditionalHeader
                            ];
                          const count: number = currentConditionalOption?.count;

                          const isDependant: boolean =
                            currentConditionalOption?.dependsUpon;

                          const conditionalCountSelect: JSX.Element[] = [];

                          for (let index = 0; index < count; index++) {
                            const selectOptionObj =
                              obj.selectedConditionalOptions
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
                              <div key={index}>
                                <Select
                                  backspaceRemoves={false}
                                  escapeClearsValue={false}
                                  key={conditionalHeaderIndex}
                                  options={[
                                    { id: '', label: '' }, // Add a blank option
                                    ...options.map((ele) => ({
                                      id: ele,
                                      label: ele,
                                    })),
                                  ]}
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
                                    handleObjChange(
                                      'selectedConditionalOptions',
                                      {
                                        ...obj.selectedConditionalOptions,
                                        [`${conditionalHeader}-${index}`]: {
                                          value: value[0].label,
                                        },
                                      },
                                    )
                                  }
                                  disabled={
                                    surgeryConfiguration?.conditionalOptions[
                                      conditionalHeader
                                    ]?.editAdminOption === true &&
                                    !adminPermission
                                  }
                                  size={SIZE.mini}
                                  overrides={{
                                    ControlContainer: {
                                      style: {
                                        backgroundColor:
                                          'rgba(250, 250, 250, 1)',
                                        border: 'none',
                                        boxShadow:
                                          '0 2px 4px rgba(0, 0, 0, 0.1)',
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
                            <td
                              className="min-w-10"
                              key={conditionalHeaderIndex}
                            >
                              {conditionalCountSelect}
                            </td>
                          );
                        },
                      )
                    : ''}
                </tr>
              </tbody>
            </table>
          </td>
          <td rowSpan={2} className="p-0 align-top">
            <table className="w-full">
              <tbody>
                {customCheckListHeaders &&
                  customCheckListHeaders.length > 0 &&
                  Array.from({
                    length: Math.ceil(customCheckListHeaders.length / 3),
                  }).map((_, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      <tr>
                        {customCheckListHeaders
                          .slice(rowIndex * 3, rowIndex * 3 + 3)
                          .map((checkListHeader, checkListHeaderIndex) => (
                            <th
                              className="bg-[#1B7F7D]"
                              key={checkListHeaderIndex}
                            >
                              {checkListHeader}
                            </th>
                          ))}
                      </tr>
                      <tr>
                        {customCheckListHeaders
                          .slice(rowIndex * 3, rowIndex * 3 + 3)
                          .map((checkListHeader, checkListHeaderIndex) => {
                            const selectedChecklistOption =
                              obj.selectedCheckListOptions
                                ? obj.selectedCheckListOptions[checkListHeader]
                                : '';

                            return (
                              <td
                                className={`w-1/4 min-w-10 ${
                                  selectedChecklistOption &&
                                  selectedChecklistOption?.value != ''
                                    ? 'bg-customGreen'
                                    : 'bg-customPink'
                                }`}
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
                                    handleObjChange(
                                      'selectedCheckListOptions',
                                      {
                                        ...obj.selectedCheckListOptions,
                                        [checkListHeader]: { value },
                                      },
                                    )
                                  }
                                />
                              </td>
                            );
                          })}
                      </tr>
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </td>
          {viewBillingColumn && (
            <td
              rowSpan={2}
              className={`min-w-10 ${
                !isZeroPricing(obj?.totalProfessionalPricing)
                  ? 'bg-customGreen'
                  : 'bg-customPink'
              }`}
            >
              <TextInput
                size={SIZE.mini}
                placeholder={obj?.initialProfPrice}
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
            <td
              rowSpan={2}
              className={`min-w-10 ${
                !isZeroPricing(obj?.totalHospitalPricing)
                  ? 'bg-customGreen'
                  : 'bg-customPink'
              }`}
            >
              <TextInput
                size={SIZE.mini}
                placeholder={obj?.initialHospitalPrice}
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
            <div className="text-black py-0.5 px-1 w-60 text-center">
              <div className="flex gap-2 items-center">
                <div ref={phoneInputRef}>
                  <PhoneInput
                    className="shadow-md"
                    defaultCountry="us"
                    value={obj.countryCode}
                    onChange={(value) => {
                      handleObjChange('countryCode', value);
                    }}
                    preferredCountries={['us', 'in']} // Set preferred countries to US and India
                    inputProps={{
                      disabled: true, // Disable the input
                      className: 'react-international-phone-input',
                      style: {
                        width: '40px',
                        height: '20px',
                        borderTopRightRadius: '0',
                        borderBottomRightRadius: '0',
                        borderRight: '0',
                        border: '0',
                        backgroundColor: 'rgb(250, 250, 250)',
                        color: 'rgba(82, 82, 91, 1)',
                        fontSize: '0.75rem',
                      },
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <TextInput
                    name="hash"
                    value={obj.phoneNumber}
                    onChange={(value) => handleObjChange('phoneNumber', value)}
                    size={SIZE.mini}
                  />
                </div>
              </div>
            </div>
            <div className="text-black py-0.5 px-1 w-40 text-center">
              <Select
                backspaceClearsInputValue={true}
                escapeClearsValue={false}
                options={referrersList.map((ele) => ({
                  id: ele.id,
                  label: CustomOptionWithTick(ele),
                }))}
                value={
                  selectedReferrer
                    ? [
                        {
                          label: toFullName(selectedReferrer),
                          id: selectedReferrer.id,
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
            <div className="text-black py-0.5 px-1 w-40 text-center">
              <Select
                backspaceClearsInputValue={true}
                escapeClearsValue={false}
                options={pcpList.map((ele) => ({
                  id: ele.id,
                  label: CustomOptionWithTick(ele),
                }))}
                value={
                  selectedPcp
                    ? [
                        {
                          label: toFullName(selectedPcp),
                          id: selectedPcp.id,
                        },
                      ]
                    : []
                }
                onChange={handlePcpChange}
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
            <div className="flex flex-col gap-2">
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
                    backspaceClearsInputValue={true}
                    escapeClearsValue={false}
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
};
export default EditableRow;
