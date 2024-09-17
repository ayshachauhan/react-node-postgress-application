import {
  SelectedSurgeryOption,
  UserType,
} from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { EVAL_STATUS } from '@root/enums/evalStatus.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  fetchCalendars,
  fetchFilteredCalendars,
} from '@root/store/reducers/calendar';
import { updateRecordAsync as updateEval } from '@root/store/reducers/evals';
import { fetchListings as fetchReferrersList } from '@root/store/reducers/referrer';
import {
  addRecordAsync as addSurgeryRecord,
  fetchAllSurgeries,
} from '@root/store/reducers/surgery';
import { fetchListings as fetchUsersList } from '@root/store/reducers/users';
import { CountryData, PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

import {
  getBackGroundColorCss,
  getPracticeId,
  getSelectedMonths,
  toFullName,
} from '@utils/index';
import { Checkbox } from 'baseui/checkbox';
import { DatePicker } from 'baseui/datepicker';
import { SIZE, Select } from 'baseui/select';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AddIcon } from '../Icons';
import RequiredIndicator from '../RequiredIndicator';

interface SurgeryPageProps {
  onClose: () => void;
  autoFillFromEval?: boolean;
  autoFillFromSurgery?: boolean;
  withLoader: (func: () => Promise<void>) => Promise<void>;
  surgeryTypeSelected?: string;
  onRecordAdded?: () => void;
}

const SurgeryPage: React.FC<SurgeryPageProps> = ({
  onClose,
  autoFillFromEval = false,
  autoFillFromSurgery = false,
  withLoader,
  surgeryTypeSelected,
  onRecordAdded,
}) => {
  const dispatch = useAppDispatch();
  const {
    practiceHomesList,
    insuranceTypesList,
    referrersList,
    pcpList,
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
    pcpList: Object.values(state.referrers.entities),
    referrersList: Object.values(state.referrers.entities),
    usersList: Object.values(state.users.entities).filter(
      (user) => user.type == UserType.DOCTOR,
    ),
    calendars: Object.values(state.calendars.entities)?.filter(
      (calender) => calender?.surgeryType,
    ),
    waitlist: Object.values(state.waitlist.entities),
    surgeryConfigurationsList: state.surgeryConfigurations.entities,
    patientsList: Object.values(state.patients.entities),
    surgeryAutoFillInfo: state.surgeries.surgeryInfo,
    evalAutoFillInfo: state.evals.evalInfo,
  }));

  const SELECTED_DOCTOR_KEY: string = 'SELECTED_DOCTOR';
  const countries: CountryData[] = [
    ['United States', 'us', '+1'],
    ['India', 'in', '+91'],
  ];

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
  const [countryCode, setCountryCode] = useState('+1'); // Default to +1 for US
  const [email, setEmail] = useState('');
  const [mrn, setMrn] = useState('');
  const [insuranceDetails, setInsuranceDetails] = useState('');
  const [insuranceTypeId, setInsuranceTypeId] = useState<string>('');
  const [waitlistId, setWaitlistId] = useState<string>('');
  const [practiceHomeId, setPracticeHomeId] = useState<string>('');
  const [bodyPart, setBodyPart] = useState<string>('');
  const [cataractBodyPart, setCataractBodyPart] = useState<string>('');
  const [referrerId, setReferrerId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string | null>(getSelectedUserId);
  const [surgeryDate, SetSurgeryDate] = useState<Date | null>(new Date());
  const [surgeryCataractDate, SetCataractSurgeryDate] = useState<Date | null>(
    new Date(),
  );
  const [pcp, setPcp] = useState('');
  const [isPCPSameAsReferer, setIsPCPSameAsReferer] = useState<boolean>(false);
  const [notes, setNotes] = useState('');
  const [surgeryNameId, setSurgeryNameId] = useState<string>('');
  const [surgeryCataractNameId, setSurgeryCataractNameId] =
    useState<string>('');
  const [errorMsgForCataract, setErrorMessageForCataract] = useState('');
  const [isNewReferrer, setIsNewReferrer] = useState<boolean>(false);
  const [isCataractSelected, setCataractSelected] = useState<boolean>(false);
  const [addNewCataractSurgery, setAddNewCataractSurgery] =
    useState<boolean>(false);
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
    setCataractSelected(surgeryTypeSelected?.toLowerCase() === 'cataract');
  }, [surgeryTypeSelected]);

  useEffect(() => {
    if (autoFillFromEval || autoFillFromSurgery) {
      const row = autoFillFromEval ? evalAutoFillInfo : surgeryAutoFillInfo;

      if (row) {
        SetSurgeryDate(new Date(row.date));
        setFirstName(row.patient.firstName);
        setLastName(row.patient.lastName);
        setEmail(row.patient.email);
        setPhoneNumber(row.patient.phoneNumber);
        setCountryCode(row.patient.countryCode);
        setMrn(String(row.patient.mrn));
        setPracticeHomeId(row?.practiceHome?.id);
        setBodyPart(row.bodyPart);
        setSurgeryNameId(row.surgeryConfiguration.id);
        if (row.waitlist) setWaitlistId(row.waitlist.id);
        if (row.referrer) setReferrerId(row.referrer.id);
        if (row.pcp) setPcp(row.pcp.id);
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
        setFirstName(patientCheck.firstName);
        setLastName(patientCheck.lastName);
        setEmail(patientCheck.email);
        setPhoneNumber(patientCheck.phoneNumber);
        setCountryCode(patientCheck.countryCode);
      } else {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setCountryCode('+1');
      }
    }
  }, [mrn]);

  useEffect(() => {
    if (surgeryNameId) {
      const selectedSurgeryConfiguration =
        surgeryConfigurationsList[surgeryNameId];
      const selectedCataractSurgeryConfiguration =
        surgeryConfigurationsList[surgeryCataractNameId];

      setBodyPart(selectedSurgeryConfiguration?.bodyPart[0]);
      setCataractBodyPart(selectedCataractSurgeryConfiguration?.bodyPart[0]);

      const selectedSurgeryOptions = selectedSurgeryConfiguration?.options
        ? Object.values(selectedSurgeryConfiguration.options).map((ele, i) => {
            const allowedValues = ele.allowedValues.map(
              (allowedValue, allowedValueIndex) => ({
                id: allowedValueIndex,
                label: allowedValue.name,
                selected: allowedValueIndex === 0 ? true : false,
                hospitalPricing: allowedValue.hospitalPricing,
                professionalPricing: allowedValue.professionalPricing,
              }),
            );

            return { id: i, label: ele.label, checked: false, allowedValues };
          })
        : [];

      setSurgeryDropdownOptions([...selectedSurgeryOptions]);
    }
  }, [surgeryNameId, surgeryCataractNameId]);

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

  const pcpOptions = Object.keys(pcpList).map((key) => ({
    label: pcpList[key].email
      ? `${toFullName(pcpList[key])} (${pcpList[key].email})`
      : `${toFullName(pcpList[key])}`,
    id: pcpList[key].id,
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
    if (value[0]?.label.toLowerCase() === 'cataract') {
      setCataractSelected(true);
    } else {
      setCataractSelected(false);
      setAddNewCataractSurgery(false);
    }
  };

  const handleCatractSurgeryNameChange = ({ value }) => {
    setSurgeryCataractNameId(value[0] ? value[0].id : null);
    if (value[0] && value[0]?.label.toLowerCase() !== 'cataract') {
      setErrorMessageForCataract(
        'Only Cataract surgery needs to be selected as second surgery.',
      );
    } else {
      setErrorMessageForCataract('');
    }
  };

  const handlePracticeHomeChange = ({ value }) => {
    setPracticeHomeId(value[0] ? value[0].id : null);
  };

  const handleInsuranceTypeChange = ({ value }) => {
    setInsuranceTypeId(value[0] ? value[0].id : null);
  };

  const handleReferrerChange = ({ value }) => {
    setReferrerId(value[0] ? value[0].id : null);
    if (isPCPSameAsReferer) {
      setPcp(value[0] ? value[0].id : null);
    }
  };

  const handlePCPChange = ({ value }) => {
    setPcp(value[0] ? value[0].id : null);
  };

  const handlePCPCheckChange = (event) => {
    setIsPCPSameAsReferer(event?.target?.checked || null);
    if (event?.target?.checked) {
      setPcp(referrerId ? referrerId : '');
    } else {
      setPcp('');
    }
  };

  const handleWaitlistChange = ({ value }) => {
    setWaitlistId(value[0] ? value[0].id : null);
  };

  const handleBodyPartTypeChange = ({ value }) => {
    setBodyPart(value[0] ? value[0].id : null);
  };

  const handleCataractBodyPartTypeChange = ({ value }) => {
    setCataractBodyPart(value[0] ? value[0].id : null);
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
      if (isPCPSameAsReferer) {
        setPcp(newValue ? newValue : '');
      }
    }
  };

  const handlePCPBlur = ({ target }) => {
    if (target.value) {
      const newValue: string = target.value;
      setPcp(newValue);
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
    const surgeryData = {
      identifier: String(Date.now()),
      firstName,
      lastName,
      email,
      phoneNumber,
      countryCode,
      mrn: mrn ? Number(mrn) : 0,
      practiceHomeId,
      insuranceDetails,
      insuranceTypeId,
      practiceId: practiceId ?? '',
      doctorId: doctorId ?? '',
      pcp,
      referrerId,
      notes: notes,
      selectedSurgeryOptions: surgeryOptionObj,
      totalHospitalPricing: '0',
      totalProfessionalPricing: '0',
      waitlistId,
    };

    console.log(surgeryData);
    const surgeryName = surgeryConfigurationsOptions.find(
      (s) => s?.id === surgeryCataractNameId,
    )?.label;
    if (surgeryName && surgeryName.toLowerCase() !== 'cataract') {
      setErrorMessageForCataract(
        'Only Cataract surgery needs to be selected as second surgery.',
      );
      return;
    }
    await withLoader(async () => {
      if (practiceId && doctorId) {
        await dispatch(
          addSurgeryRecord({
            ...surgeryData,
            date: surgeryDate ?? new Date(),
            surgeryConfigurationId: surgeryNameId,
            bodyPart,
            count: 1,
          }),
        );

        if (surgeryCataractDate && surgeryCataractNameId && cataractBodyPart) {
          await dispatch(
            addSurgeryRecord({
              ...surgeryData,
              date: surgeryCataractDate ?? new Date(),
              surgeryConfigurationId: surgeryCataractNameId,
              bodyPart: cataractBodyPart,
              count: 2,
            }),
          );
        }

        if (autoFillFromEval && evalAutoFillInfo) {
          const {
            id,
            date,
            patient: { firstName, mrn, phoneNumber, countryCode, email },
            bodyPart,
            pcp,
            referrer,
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
                countryCode,
                firstName,
                mrn,
                pcp: pcp?.id,
                referrerId: referrer?.id,
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

        await dispatch(fetchCalendars({ practiceId, userId: doctorId }));
        await dispatch(fetchReferrersList({ practiceId: practiceId }));
        dispatch(fetchUsersList({ practiceId }));
        dispatch(fetchAllSurgeries({ practiceId }));

        try {
          setFirstName('');
          setLastName('');
          setMrn('');
          setCountryCode('+1');
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
          if (onRecordAdded) {
            onRecordAdded();
          }
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

  const handleMonthChangeForCataract = ({ date }) => {
    setCurrentMonth(date.getMonth() + 1);
  };

  useEffect(() => {
    if (errorMsgForCataract) {
      const timer = setTimeout(() => {
        setErrorMessageForCataract('');
      }, 3000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [errorMsgForCataract]);

  return (
    <div>
      <div className="px-4">
        {errorMsgForCataract && (
          <div className="flex justify-center text-red-700">
            {errorMsgForCataract}
          </div>
        )}
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
              <div className="flex gap-3 items-center">
                <PhoneInput
                  defaultCountry="us"
                  value={countryCode}
                  onChange={(value) => {
                    setCountryCode(value);
                  }}
                  countries={countries}
                  preferredCountries={['us', 'in']} // Set preferred countries to US and India
                  inputProps={{
                    disabled: true, // Disable the input
                    className: 'react-international-phone-input h-10',
                    style: { width: '40px' }, // Set a smaller width
                  }}
                />
                <div className="flex-grow">
                  <TextInput
                    size={SIZE.mini}
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={(value) => {
                      setPhoneNumber(value);
                    }}
                    required
                  />
                </div>
              </div>
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
                checked={isPCPSameAsReferer}
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
                onChange={handlePCPCheckChange}
              >
                <label htmlFor="pcp" className="text-black text-xs">
                  PCP (Check if same as referrer)
                </label>
              </Checkbox>
              <Select
                placeholder="Select PCP"
                backspaceClearsInputValue={true}
                size={SIZE.mini}
                onBlurResetsInput={false}
                onBlur={handlePCPBlur}
                onChange={handlePCPChange}
                value={pcp ? [{ label: pcp, id: pcp }] : []}
                options={pcpOptions}
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
              <div className="flex mt-2 text-lg pb-2 font-bold border-b border-gray-100 text-black w-full">
                Add Surgery
                {(addNewCataractSurgery || isCataractSelected) && (
                  <div className="pl-3">
                    <Button
                      type="button"
                      kind="primary"
                      title=""
                      width={25}
                      height={25}
                      startEnhancer={() => <AddIcon className="mr-[-7px]" />}
                      onClick={() => {
                        setAddNewCataractSurgery(true);
                      }}
                    />
                  </div>
                )}
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
                        ? surgeryConfigurationsList[
                            surgeryNameId
                          ]?.bodyPart.map((ele) => ({ id: ele, label: ele }))
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
                        style: ({ $date }) => {
                          return {
                            height: '53px',
                            width: '53px',
                            borderRadius: '50%',
                            boxSizing: 'border-box',
                            paddingTop: '6px',
                            paddingBottom: '6px',
                            margin: '2px',
                            ...getBackGroundColorCss(
                              $date,
                              currentMonth,
                              calendars,
                            ),
                            ':after': '',
                          };
                        },
                      },
                    }}
                  />
                </div>
              </div>
              {addNewCataractSurgery && (
                <div className="flex gap-5 mt-2">
                  <div className="space-y-1 flex-1">
                    <label htmlFor="surgeryType" className="text-black text-xs">
                      <RequiredIndicator />
                      &nbsp;Surgery
                    </label>
                    <Select
                      placeholder="Select Surgery"
                      backspaceClearsInputValue
                      size={SIZE.mini}
                      options={surgeryConfigurationsOptions}
                      onChange={handleCatractSurgeryNameChange}
                      value={
                        surgeryCataractNameId
                          ? [
                              {
                                label: surgeryCataractNameId,
                                id: surgeryCataractNameId,
                              },
                            ]
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
                      options={
                        surgeryCataractNameId
                          ? surgeryConfigurationsList[
                              surgeryCataractNameId
                            ]?.bodyPart.map((ele) => ({ id: ele, label: ele }))
                          : []
                      }
                      onChange={handleCataractBodyPartTypeChange}
                      value={
                        cataractBodyPart
                          ? [{ label: cataractBodyPart, id: cataractBodyPart }]
                          : []
                      }
                      disabled={surgeryCataractNameId ? false : true}
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
                      value={surgeryCataractDate}
                      onChange={({ date }) => SetCataractSurgeryDate(date)}
                      placeholder="Surgery Date"
                      required
                      onMonthChange={handleMonthChangeForCataract}
                      onOpen={() => {
                        handleMonthChangeForCataract({
                          date: surgeryCataractDate,
                        });
                      }}
                      overrides={{
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
                              ...getBackGroundColorCss(
                                $date,
                                currentMonth,
                                calendars,
                              ),
                              ':after': '',
                            };
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}
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
