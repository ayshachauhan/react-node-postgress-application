import {
  ICalendar,
  SelectedSurgeryOption,
  UserType,
} from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { EVAL_STATUS } from '@root/enums/evalStatus.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchFilteredCalendars } from '@root/store/reducers/calendar';
import { updateRecordAsync as updateEval } from '@root/store/reducers/evals';
import { addRecordAsync as addSurgeryRecord } from '@root/store/reducers/surgery';
import { DEFAULT_SURGERYLOCATION_COLOR } from '@root/utils/constants';
import { getPracticeId, getSelectedMonths, toFullName } from '@utils/index';
import { Checkbox } from 'baseui/checkbox';
import { DatePicker } from 'baseui/datepicker';
import { SIZE, Select } from 'baseui/select';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import RequiredIndicator from '../RequiredIndicator';

interface SurgeryPageProps {
  onClose: () => void;
  autoFillFromEval?: boolean;
  autoFillFromSurgery?: boolean;
  withLoader: (func: () => Promise<void>) => Promise<void>;
}

const SurgeryPage: React.FC<SurgeryPageProps> = ({
  onClose,
  autoFillFromEval = false,
  autoFillFromSurgery = false,
  withLoader,
}) => {
  const dispatch = useAppDispatch();
  const {
    practiceHomesList,
    insuranceTypesList,
    referrersList,
    usersList,
    calendars,
    waitlist,
    surgeryConfigurationsList,
    patientsList,
    evalAutoFillInfo,
    surgeryAutoFillInfo,
  } = useAppSelector((state) => ({
    practiceHomesList: Object.values(state.practiceHomes.entities),
    surgeryTypesList: Object.values(state.surgeryTypes.entities),
    insuranceTypesList: Object.values(state.insuranceTypes.entities),
    referrersList: Object.values(state.referrers.entities),
    usersList: Object.values(state.users.entities).filter(
      (user) => user.type == UserType.DOCTOR,
    ),
    calendars: Object.values(state.calendars.entities),
    waitlist: Object.values(state.waitlist.entities),
    surgeryConfigurationsList: state.surgeryConfigurations.entities,
    patientsList: Object.values(state.patients.entities),
    surgeryAutoFillInfo: state.surgeries.surgeryInfo,
    evalAutoFillInfo: state.evals.evalInfo,
  }));

  const SELECTED_DOCTOR_KEY: string = 'SELECTED_DOCTOR';
  const userInfo = useAppSelector((state) => state.auth.user);
  const loggedInUserId = userInfo?.id;
  const { selectedMonth, selectedValue } = useAppSelector(
    (state) => state.surgeries.surgeryFilters,
  );
  const selectedValueStr = selectedValue || '';

  const month = getSelectedMonths(selectedMonth);
  const getSelectedUserId: string | null =
    localStorage.getItem(SELECTED_DOCTOR_KEY);

  const surgeryConfigurations = Object.values(surgeryConfigurationsList);
  const practiceId = getPracticeId();
  const router = useRouter();
  const defaultUser = usersList.find((ele) => ele.id === getSelectedUserId);
  const [selectedUser, setSelectedUser] = useState(
    defaultUser ? [{ label: toFullName(defaultUser), id: defaultUser.id }] : [],
  );
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [mrn, setMrn] = useState('');
  const [insuranceDetails, setInsuranceDetails] = useState('');
  const [insuranceTypeId, setInsuranceTypeId] = useState<string>('');
  const [waitlistId, setWaitlistId] = useState<string>('');
  const [practiceHomeId, setPracticeHomeId] = useState<string>('');
  const [bodyPart, setBodyPart] = useState<string>('');
  const [referrerId, setReferrerId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string | null>(getSelectedUserId);
  const [surgeryDate, SetSurgeryDate] = useState<Date | null>(new Date());
  const [pcp, setPcp] = useState('');
  const [notes, setNotes] = useState('');
  const [surgeryNameId, setSurgeryNameId] = useState<string>('');
  const [isMrnExists, setIsMrnExists] = useState<boolean>(false);
  const [isNewReferrer, setIsNewReferrer] = useState<boolean>(false);
  const [surgeryDropdownOptions, setSurgeryDropdownOptions] = useState([
    {
      id: 0,
      label: '',
      checked: false,
      allowedValues: [
        {
          id: 0,
          label: '',
          selected: false,
          hospitalPricing: 0,
          professionalPricing: 0,
        },
      ],
    },
  ]);

  const handleCheckboxChange = (index: number) => {
    surgeryDropdownOptions[index].checked =
      !surgeryDropdownOptions[index].checked;

    setSurgeryDropdownOptions([...surgeryDropdownOptions]);
  };

  const handleAllowedValueChange = (
    optionsIndex: number,
    allowedValueIndex,
  ) => {
    surgeryDropdownOptions[optionsIndex].allowedValues.forEach((ele, i) => {
      if (i === allowedValueIndex) ele.selected = true;
      else ele.selected = false;
    });

    setSurgeryDropdownOptions([...surgeryDropdownOptions]);
  };

  useEffect(() => {
    if (autoFillFromEval || autoFillFromSurgery) {
      const row = autoFillFromEval ? evalAutoFillInfo : surgeryAutoFillInfo;

      if (row) {
        setFirstName(row.patient.firstName);
        setLastName(row.patient.lastName);
        setEmail(row.patient.email);
        setPhoneNumber(row.patient.phoneNumber);
        setMrn(String(row.patient.mrn));
        setPracticeHomeId(row.practiceHome.id);
        setBodyPart(row.bodyPart);
        setSurgeryNameId(row.surgeryConfiguration.id);
        if (row.waitlist) setWaitlistId(row.waitlist.id);
        if (row.patient.referrer) setReferrerId(row.patient.referrer.id);
        if (row.insuranceType) setInsuranceTypeId(row.insuranceType.id);
        if (row.insuranceDetails) setInsuranceDetails(row.insuranceDetails);
      }
    }
  }, [
    autoFillFromEval,
    autoFillFromSurgery,
    evalAutoFillInfo,
    surgeryAutoFillInfo,
  ]);

  useEffect(() => {
    if (mrn) {
      const patientCheck = patientsList.find((ele) => String(ele.mrn) === mrn);

      if (patientCheck) {
        setIsMrnExists(true);
        setFirstName(patientCheck.firstName);
        setLastName(patientCheck.lastName);
        setEmail(patientCheck.email);
        setPhoneNumber(patientCheck.phoneNumber);
        setReferrerId(patientCheck.referrer ? patientCheck?.referrer.id : '');
      } else {
        setIsMrnExists(false);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setReferrerId('');
      }
    }
  }, [mrn]);

  useEffect(() => {
    if (surgeryNameId) {
      const selectedSurgeryConfiguration =
        surgeryConfigurationsList[surgeryNameId];

      setBodyPart(selectedSurgeryConfiguration.bodyPart[0]);

      const selectedSurgeryOptions = Object.values(
        selectedSurgeryConfiguration.options,
      ).map((ele, i) => {
        const allowedValues = ele.allowedValues.map(
          (allowedValue, allowedValueIndex) => ({
            id: allowedValueIndex,
            label: allowedValue.name,
            selected: allowedValueIndex === 0 ? true : false,
            hospitalPricing: allowedValue.hospitalPricing,
            professionalPricing: allowedValue.professionalPricing,
          }),
        );

        return { id: i, label: ele.label, checked: true, allowedValues };
      });

      setSurgeryDropdownOptions([...selectedSurgeryOptions]);
    }
  }, [surgeryNameId]);

  const surgeryConfigurationsOptions = surgeryConfigurations.map((key) => ({
    label: key.name,
    id: key.id,
  }));

  const practiceHomesOptions = Object.keys(practiceHomesList).map((key) => ({
    label: practiceHomesList[key].name,
    id: practiceHomesList[key].id,
  }));

  const insuranceTypesOptions = Object.keys(insuranceTypesList).map((key) => ({
    label: insuranceTypesList[key].name,
    id: insuranceTypesList[key].id,
  }));

  const referrersOptions = Object.keys(referrersList).map((key) => ({
    label: referrersList[key].email
      ? `${toFullName(referrersList[key])} (${referrersList[key].email})`
      : `${toFullName(referrersList[key])}`,
    id: referrersList[key].id,
  }));

  const waitlistOptions = Object.keys(waitlist).map((key) => ({
    label: waitlist[key].name,
    id: waitlist[key].id,
  }));

  const usersOptions = usersList
    .filter((ele) => ele.type === 'doctor')
    .map((key) => ({
      label: key ? toFullName(key) : '',
      id: key.id,
    }));

  const handleSurgeryNameChange = ({ value }) => {
    setSurgeryNameId(value[0] ? value[0].id : null);
  };

  const handlePracticeHomeChange = ({ value }) => {
    setPracticeHomeId(value[0] ? value[0].id : null);
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

  const handleBodyPartTypeChange = ({ value }) => {
    setBodyPart(value[0] ? value[0].id : null);
  };

  const handleDoctorChange = ({ value }) => {
    const newDoctorId = value[0] ? value[0].id : null;
    setDoctorId(newDoctorId);
    setSelectedUser(value);
  };

  const handleMrnChange = ({ value }) => {
    setMrn(value[0] ? value[0].id : null);
  };

  const handleMrnBlur = ({ target }) => {
    if (target.value) {
      const newValue: string = target.value;
      setMrn(newValue);
    }
  };

  const handleReferrerBlur = ({ target }) => {
    if (target.value) {
      const newValue: string = target.value;
      setReferrerId(newValue);
      setIsNewReferrer(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const surgeryOptionObj: SelectedSurgeryOption = {};
    surgeryDropdownOptions.forEach((ele) => {
      const allowedValue = ele.allowedValues.find((ele) => ele.selected);
      if (ele.checked && allowedValue) {
        surgeryOptionObj[`${ele.label}-0`] = {
          professionalPricing: allowedValue.professionalPricing,
          hospitalPricing: allowedValue.hospitalPricing,
          value: allowedValue.label,
        };
      }
    });
    await withLoader(async () => {
      if (practiceId && doctorId) {
        await dispatch(
          addSurgeryRecord({
            firstName,
            lastName,
            email,
            date: surgeryDate ?? new Date(),
            phoneNumber,
            mrn: mrn ? Number(mrn) : 0,
            practiceHomeId,
            surgeryConfigurationId: surgeryNameId,
            insuranceDetails,
            insuranceTypeId,
            practiceId,
            doctorId,
            pcp,
            referrerId,
            details: notes,
            selectedSurgeryOptions: surgeryOptionObj,
            bodyPart,
            totalHospitalPricing: '0',
            totalProfessionalPricing: '0',
            waitlistId,
          }),
        );

        if (autoFillFromEval && evalAutoFillInfo) {
          const {
            id,
            date,
            patient: { firstName, mrn, phoneNumber, email },
            bodyPart,
          } = evalAutoFillInfo;
          await dispatch(
            updateEval({
              payloadData: {
                status: EVAL_STATUS.Book,
                practiceId,
                date,
                email,
                bodyPart,
                phoneNumber,
                firstName,
                mrn,
              },
              id,
            }),
          );
        }

        await dispatch(
          fetchFilteredCalendars({
            practiceId,
            userId: doctorId,
            month,
            option: selectedValueStr,
            loggedInUserId,
          }),
        );

        try {
          setFirstName('');
          setLastName('');
          setMrn('');
          setPhoneNumber('');
          setEmail('');
          setPracticeHomeId('');
          setInsuranceDetails('');
          setInsuranceTypeId('');
          setPcp('');
          setReferrerId('');
          setNotes('');
          setBodyPart('');
          setWaitlistId('');
          onClose();
        } catch (error) {
          onClose();
        }
      }
    });

    router.refresh();
    onClose();
  };

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  const handleMonthChange = ({ date }) => {
    setCurrentMonth(date.getMonth() + 1);
  };

  const isCalendarDates = (date: Date): boolean => {
    const formattedDate = moment(date).format('YYYY-MM-DD'); // Get date part only

    const dates = (calendars as ICalendar[])
      .filter((calendar: ICalendar) =>
        moment(calendar.date).format('YYYY-MM-DD'),
      )
      .map((calendar) => moment(calendar.date).format('YYYY-MM-DD'));

    return Boolean(dates.find((date) => date === formattedDate));
  };

  const isSlotsAvailable = (date: Date): Record<string, unknown> => {
    const formattedDate = moment(date).format('YYYY-MM-DD'); // Get date part only

    const calendar = (calendars as ICalendar[]).find(
      (calendar: ICalendar) =>
        moment(calendar.date).format('YYYY-MM-DD') === formattedDate,
    ) as ICalendar;

    const surgeryTypeColor =
      calendar.surgeryType.color ?? DEFAULT_SURGERYLOCATION_COLOR;

    return calendar.maxSlots > calendar.bookedSlots
      ? {
          backgroundColor: surgeryTypeColor,
          borderTopColor: surgeryTypeColor,
          borderBottomColor: surgeryTypeColor,
          borderRightColor: surgeryTypeColor,
          borderLeftColor: surgeryTypeColor,
        }
      : {
          backgroundColor: 'transparent',
          border: `${surgeryTypeColor} solid 3px`,
          borderTopColor: surgeryTypeColor,
          borderBottomColor: surgeryTypeColor,
          borderRightColor: surgeryTypeColor,
          borderLeftColor: surgeryTypeColor,
        };
  };

  const getBackGroundColorCss = (date: Date): Record<string, unknown> => {
    // checking selected month here because sometimes bg colors are reflecting in next month

    // console.log(date, date.getMonth() + 1, 'datebg', currentMonth);

    return date.getMonth() + 1 == currentMonth
      ? isCalendarDates(date)
        ? isSlotsAvailable(date)
        : { backgroundColor: 'transparent' }
      : {};
  };

  return (
    <div>
      <div className="px-4">
        <form onSubmit={handleSubmit} className="flex flex-col flex-wrap">
          <div className="flex mt-4 pb-2 border-b border-gray-100 items-center">
            <div className="text-xl font-bold text-black w-full">
              Add Surgery
            </div>
            <div>
              <Select
                backspaceClearsInputValue
                size={SIZE.mini}
                required
                options={usersOptions}
                onChange={handleDoctorChange}
                value={selectedUser}
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
          </div>
          <div className="flex gap-5 mt-4">
            <div className="space-y-1 flex-1">
              <label htmlFor="mrn" className="text-black text-xs">
                <RequiredIndicator />
                &nbsp;MRN
              </label>
              <Select
                size={SIZE.mini}
                options={patientsList.map((ele) => ({
                  id: String(ele.mrn),
                  label: String(ele.mrn),
                }))}
                value={
                  mrn ? [{ id: String(mrn), label: String(String(mrn)) }] : []
                }
                placeholder="Enter MRN"
                onBlurResetsInput={false}
                onBlur={handleMrnBlur}
                onChange={(value) => {
                  handleMrnChange(value);
                }}
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
                required
              />
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-1 flex-1">
              <label htmlFor="firstName" className="text-black text-xs">
                <RequiredIndicator />
                &nbsp;First Name
              </label>
              <TextInput
                size={SIZE.mini}
                disabled={isMrnExists}
                name="name"
                value={firstName}
                onChange={(value) => {
                  setFirstName(value);
                }}
                required
              />
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-1 flex-1">
              <label htmlFor="lastName" className="text-black text-xs">
                <RequiredIndicator />
                &nbsp;Last Name
              </label>
              <TextInput
                size={SIZE.mini}
                disabled={isMrnExists}
                name="lastName"
                value={lastName}
                onChange={(value) => {
                  setLastName(value);
                }}
                required
              />
              <div className="space-y-4"></div>
            </div>
          </div>
          <div className="flex gap-5 mt-2">
            <div className="space-y-1 flex-1">
              <label htmlFor="email" className="text-black text-xs">
                <RequiredIndicator />
                &nbsp;Email
              </label>
              <TextInput
                size={SIZE.mini}
                disabled={isMrnExists}
                name="email"
                value={email}
                onChange={(value) => {
                  setEmail(value);
                }}
                required
              />
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-1 flex-1">
              <label htmlFor="phoneNumber" className="text-black text-xs">
                <RequiredIndicator />
                &nbsp;Phone Number
              </label>
              <TextInput
                size={SIZE.mini}
                name="phoneNumber"
                disabled={isMrnExists}
                value={phoneNumber}
                onChange={(value) => {
                  setPhoneNumber(value);
                }}
                required
              />
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-1 flex-1">
              <label htmlFor="practiceHome" className="text-black text-xs">
                <RequiredIndicator />
                &nbsp;Home
              </label>
              <Select
                placeholder="Select patient home location"
                backspaceClearsInputValue
                size={SIZE.mini}
                options={practiceHomesOptions}
                onChange={handlePracticeHomeChange}
                value={
                  practiceHomeId
                    ? [{ label: practiceHomeId, id: practiceHomeId }]
                    : []
                }
                required
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
          <div className="flex gap-5 mt-2">
            <div className="space-y-1 flex-1">
              <label htmlFor="referrer" className="text-black text-xs">
                Referrer
              </label>
              <Select
                placeholder="Select Referrer"
                backspaceClearsInputValue={true}
                size={SIZE.mini}
                onBlurResetsInput={false}
                onBlur={handleReferrerBlur}
                onChange={handleReferrerChange}
                value={
                  referrerId ? [{ label: referrerId, id: referrerId }] : []
                }
                options={referrersOptions}
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
            <div className="space-y-1 flex-1">
              <label htmlFor="urlEmbed" className="text-black text-xs">
                No Wait list
              </label>
              <Select
                placeholder="Select Waitlist"
                backspaceClearsInputValue
                size={SIZE.mini}
                options={waitlistOptions}
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
                onChange={handleWaitlistChange}
                value={
                  waitlistId ? [{ label: waitlistId, id: waitlistId }] : []
                }
              />
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-1 flex-1">
              <Checkbox
                overrides={{
                  Checkmark: {
                    style: ({ $checked }) => ({
                      backgroundColor: $checked
                        ? 'rgba(59, 130, 246, 1)'
                        : 'white',
                      borderColor: $checked
                        ? 'rgba(59, 130, 246, 1)'
                        : 'rgba(161, 161, 170, 1)',
                      borderRadius: '4px',
                    }),
                  },
                }}
                checked={false}
              >
                <label htmlFor="pcp" className="text-black text-xs">
                  PCP (Check box if same)
                </label>
              </Checkbox>
              <TextInput
                disabled
                size={SIZE.mini}
                name="pcp"
                value={pcp}
                onChange={(value) => {
                  setPcp(value);
                }}
              />
            </div>
          </div>
          <div className="flex gap-5 pt-2">
            <div className="space-y-1 flex-1 text-xs">
              <Checkbox
                overrides={{
                  Checkmark: {
                    style: ({ $checked }) => ({
                      backgroundColor: $checked
                        ? 'rgba(59, 130, 246, 1)'
                        : 'white',
                      borderColor: $checked
                        ? 'rgba(59, 130, 246, 1)'
                        : 'rgba(161, 161, 170, 1)',
                      borderRadius: '4px',
                    }),
                  },
                }}
                checked={email ? true : false}
              >
                Notify patient
              </Checkbox>
              <Checkbox
                overrides={{
                  Checkmark: {
                    style: ({ $checked }) => ({
                      backgroundColor: $checked
                        ? 'rgba(59, 130, 246, 1)'
                        : 'white',
                      borderColor: $checked
                        ? 'rgba(59, 130, 246, 1)'
                        : 'rgba(161, 161, 170, 1)',
                      borderRadius: '4px',
                    }),
                  },
                }}
                checked={referrerId || isNewReferrer ? true : false}
              >
                Notify referrer
              </Checkbox>
            </div>
            <div className="space-y-1 flex-1">
              <label htmlFor="insuranceType" className="text-black text-xs">
                Insurance Type
              </label>
              <Select
                placeholder="Select Insurance Type"
                backspaceClearsInputValue
                size={SIZE.mini}
                options={insuranceTypesOptions}
                onChange={handleInsuranceTypeChange}
                value={
                  insuranceTypeId
                    ? [{ label: insuranceTypeId, id: insuranceTypeId }]
                    : []
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
            <div className="space-y-1 flex-1">
              <label htmlFor="insuranceDetails" className="text-black text-xs">
                Insurance Details
              </label>
              <TextInput
                size={SIZE.mini}
                name="insuranceDetails"
                value={insuranceDetails}
                onChange={(value) => {
                  setInsuranceDetails(value);
                }}
              />
            </div>
          </div>
          <div className="space-y-1 mt-1">
            <label htmlFor="notes" className="text-black text-sm">
              Notes
            </label>
            <TextInput
              size={SIZE.mini}
              name="notes"
              value={notes}
              onChange={(value) => {
                setNotes(value);
              }}
            />
          </div>
          <div className="mt-2 flex gap-5">
            <div className="px-6 border border-gray-100 pb-6 rounded-xl flex-1 w-4/12">
              <div className="mt-2 text-lg pb-2 font-bold border-b border-gray-100 text-black w-full">
                Add Surgery
              </div>
              <div className="flex gap-5 mt-2">
                <div className="space-y-1 flex-1">
                  <label htmlFor="surgeryType" className="text-black text-xs">
                    <RequiredIndicator />
                    &nbsp;Surgery
                  </label>
                  <Select
                    placeholder="Select Surgery"
                    backspaceClearsInputValue
                    required
                    size={SIZE.mini}
                    options={surgeryConfigurationsOptions}
                    onChange={handleSurgeryNameChange}
                    value={
                      surgeryNameId
                        ? [{ label: surgeryNameId, id: surgeryNameId }]
                        : []
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
                <div className="space-y-1 flex-1 w-1/3">
                  <label htmlFor="bodypart" className="text-black text-xs">
                    <RequiredIndicator />
                    &nbsp;Body Part
                  </label>
                  <Select
                    placeholder="Select Body Part"
                    backspaceClearsInputValue
                    size={SIZE.mini}
                    required
                    options={
                      surgeryNameId
                        ? surgeryConfigurationsList[surgeryNameId].bodyPart.map(
                            (ele) => ({ id: ele, label: ele }),
                          )
                        : []
                    }
                    onChange={handleBodyPartTypeChange}
                    value={bodyPart ? [{ label: bodyPart, id: bodyPart }] : []}
                    disabled={surgeryNameId ? false : true}
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
                <div className="space-y-1 flex-1 w-1/3">
                  <label htmlFor="surgeryDate" className="text-black text-xs">
                    <RequiredIndicator />
                    &nbsp;Surgery Date
                  </label>
                  <DatePicker
                    size={SIZE.mini}
                    value={surgeryDate}
                    onChange={({ date }) => SetSurgeryDate(date)}
                    placeholder="Surgery Date"
                    required
                    onMonthChange={handleMonthChange}
                    onOpen={() => {
                      handleMonthChange({ date: surgeryDate });
                    }}
                    overrides={{
                      Day: {
                        style: ({ $date, $selected }) => {
                          return {
                            height: '53px',
                            width: '53px',
                            borderRadius: '50%',
                            boxSizing: 'border-box',
                            paddingTop: '6px',
                            paddingBottom: '6px',
                            margin: '2px',
                            ...getBackGroundColorCss($date),
                            ':after': '',
                            ...($selected
                              ? {
                                  color: '#ffffff',
                                  ...($date.getMonth() + 1 == currentMonth
                                    ? { backgroundColor: '#000000' }
                                    : {}),
                                }
                              : {}),
                          };
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5 mt-2">
                {surgeryNameId &&
                  surgeryDropdownOptions.map((option, index) => (
                    <div
                      className="flex flex-row items-center w-1/3"
                      key={index}
                    >
                      <div key={index} className="w-1/2 text-xs">
                        <Checkbox
                          overrides={{
                            Checkmark: {
                              style: ({ $checked }) => ({
                                backgroundColor: $checked
                                  ? 'rgba(59, 130, 246, 1)'
                                  : 'white',
                                borderColor: $checked
                                  ? 'rgba(59, 130, 246, 1)'
                                  : 'rgba(161, 161, 170, 1)',
                                borderRadius: '4px',
                              }),
                            },
                          }}
                          checked={option.checked}
                          onChange={() => {
                            handleCheckboxChange(index);
                          }}
                        >
                          {option.label}
                        </Checkbox>
                      </div>
                      <div className="w-1/2">
                        <Select
                          size={SIZE.mini}
                          options={option.allowedValues}
                          value={option.allowedValues.filter(
                            (ele) => ele.selected === true,
                          )}
                          onChange={({ value }) =>
                            handleAllowedValueChange(index, value[0].id)
                          }
                          disabled={!option.checked}
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
                  ))}
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex justify-end gap-3">
            <div className="">
              <Button padding="12px 16px" kind="primary" title="Add Surgery" />
            </div>
            <div className="">
              <Button
                type="button"
                kind="tertiary"
                title="Cancel"
                style={{
                  backgroundColor: 'rgba(212, 212, 216, 1)',
                  color: 'black',
                  padding: '12px 16px',
                  fontSize: '14px',
                }}
                onClick={onClose}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurgeryPage;
