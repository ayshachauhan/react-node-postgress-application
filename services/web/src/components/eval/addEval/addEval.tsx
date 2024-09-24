import Button from '@root/components/Button';
import RequiredIndicator from '@root/components/RequiredIndicator';
import TextInput from '@root/components/TextInput';
import { EVAL_STATUS } from '@root/enums/evalStatus.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import { addRecordAsync as addEvalRecord } from '@root/store/reducers/evals';
import {
  getBackGroundColorCss,
  getPracticeId,
  toFullName,
  validateMRNLength,
} from '@utils/index';
import { Checkbox } from 'baseui/checkbox';
import { DatePicker } from 'baseui/datepicker';
import { SIZE, Select } from 'baseui/select';
import { parsePhoneNumber } from 'libphonenumber-js';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface SurgeryPageProps {
  onClose: () => void;
  withLoader: (func: () => Promise<void>) => Promise<void>;
  onRecordAdded?: () => void;
}

const SurgeryPage: React.FC<SurgeryPageProps> = ({
  onClose,
  withLoader,
  onRecordAdded,
}) => {
  const {
    practiceHomesList,
    insuranceTypesList,
    referrersList,
    usersList,
    patientsList,
    waitlist,
  } = useAppSelector((state) => ({
    practiceHomesList: Object.values(state.practiceHomes.entities),
    surgeryTypesList: Object.values(state.surgeryTypes.entities),
    insuranceTypesList: Object.values(state.insuranceTypes.entities),
    referrersList: Object.values(state.referrers.entities),
    usersList: Object.values(state.users.entities),
    patientsList: Object.values(state.patients.entities),
    surgeryConfigurationsList: Object.values(
      state.surgeryConfigurations.entities,
    ),
    waitlist: Object.values(state.waitlist.entities),
  }));

  const SELECTED_DOCTOR_KEY: string = 'SELECTED_DOCTOR';
  const selectedDoctorKey = localStorage.getItem(SELECTED_DOCTOR_KEY);
  const selectedDoctorId = usersList.some(
    (user) => user?.id === selectedDoctorKey,
  )
    ? selectedDoctorKey
    : null;

  const getSelectedUserId: string | null = selectedDoctorId;
  const [isValidPhnNo, setIsValidPhnNo] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useAppDispatch();
  const surgeryConfigurationsList = useAppSelector(
    (state) => state.surgeryConfigurations.entities,
  );
  const surgeryConfigurations = Object.values(surgeryConfigurationsList);
  const practiceId = getPracticeId();
  const router = useRouter();
  const [mrnError, setMrnError] = useState('');
  const defaultUser = usersList.find((ele) => ele.id === getSelectedUserId);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1'); // Default to 'us'
  const [email, setEmail] = useState('');
  const [mrn, setMrn] = useState('');
  const [insuranceDetails, setInsuranceDetails] = useState('');
  const [insuranceTypeId, setInsuranceTypeId] = useState<string>('');
  const [practiceHomeId, setPracticeHomeId] = useState<string>('');
  const [evalStatus, setEvalStatus] = useState<string>(
    EVAL_STATUS['Future Evaluation'],
  );
  const [referrerId, setReferrerId] = useState<string>('');
  const [isNewReferrer, setIsNewReferrer] = useState<boolean>(false);
  const [doctorId, setDoctorId] = useState<string | null>(getSelectedUserId);
  const [date, setDate] = useState<Date>(new Date());
  const [pcp, setPcp] = useState('');
  const [notes, setNotes] = useState('');
  const [checkboxes, setCheckboxes] = React.useState([true, false]);
  const [surgeryNameId, setSurgeryNameId] = useState<string>('');
  const [bodyPart, setBodyPart] = useState<string>('');
  const [waitlistId, setWaitlistId] = useState<string>('');
  const [bodyPartOptions, setBodyPartOptions] = useState([
    { id: '', label: '' },
  ]);

  const { calendars } = useAppSelector((state) => ({
    calendars: Object.values(state.calendars?.entities).filter(
      (calendar) => calendar?.user?.id === doctorId,
    ),
  }));

  const phoneInputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (phoneInputRef.current) {
      const button = phoneInputRef.current.querySelector(
        '.react-international-phone-country-selector-button',
      );
      if (button) {
        const buttonElement = button as HTMLElement;
        buttonElement.style.height = '24px';
        buttonElement.style.borderTopRightRadius = '0';
        buttonElement.style.borderBottomRightRadius = '0';
        buttonElement.style.borderRight = '0';
        buttonElement.style.border = '0';
        buttonElement.style.backgroundColor = 'rgb(250, 250, 250)';
      }
    }
  }, []);

  useEffect(() => {
    setCheckboxChecked(false);
  }, []);

  useEffect(() => {
    if (mrn) {
      const patientCheck = patientsList.find((ele) => String(ele.mrn) === mrn);

      if (patientCheck) {
        setFirstName(patientCheck.firstName);
        setLastName(patientCheck.lastName);
        setEmail(patientCheck.email);
        setPhoneNumber(patientCheck.phoneNumber);
        setCountryCode(patientCheck.countryCode);
        //setReferrerId(patientCheck.referrer ? patientCheck?.referrer.id : '');
        const fullPhoneNumber =
          (patientCheck.countryCode ? patientCheck.countryCode : '') +
          (patientCheck.phoneNumber ? patientCheck.phoneNumber : '');
        validatePhoneNumber(fullPhoneNumber);
      } else {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setCountryCode('+1');
        setReferrerId('');
      }
    }
  }, [mrn]);

  useEffect(() => {
    if (surgeryNameId) {
      const selectedSurgeryConfiguration =
        surgeryConfigurationsList[surgeryNameId];

      setBodyPartOptions(
        selectedSurgeryConfiguration?.bodyPart.map((ele) => ({
          id: ele,
          label: ele,
        })),
      );
    }
  }, [surgeryNameId]);

  const [checkboxChecked, setCheckboxChecked] = useState(false);

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

  const waitlistOptions = Object.keys(waitlist).map((key) => ({
    label: waitlist[key].name,
    id: waitlist[key].id,
  }));

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
    const fullPhoneNumber = value + phoneNumber;
    validatePhoneNumber(fullPhoneNumber);
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    const fullPhoneNumber = countryCode + value;
    validatePhoneNumber(fullPhoneNumber);
  };

  const validatePhoneNumber = (fullNumber: string) => {
    try {
      const parsedPhoneNumber = parsePhoneNumber(fullNumber);

      if (parsedPhoneNumber.isValid()) {
        setIsValidPhnNo(true);
        setErrorMessage('');
      } else {
        setIsValidPhnNo(false);
        setErrorMessage('Invalid phone number');
      }
    } catch (error) {
      setIsValidPhnNo(false);
      setErrorMessage('Invalid phone number');
    }
  };

  const evalStatusOption = [
    {
      id: EVAL_STATUS['Future Evaluation'],
      label: EVAL_STATUS['Future Evaluation'],
    },
  ];

  const handleCheckboxChange = (e) => {
    const target = e.target as HTMLInputElement;
    setCheckboxChecked(target.checked);

    if (target.checked && referrerId) {
      setPcp(referrerId);
    } else {
      setPcp('');
    }
  };

  const referrersOptions = Object.keys(referrersList).map((key) => ({
    label: referrersList[key].email
      ? `${toFullName(referrersList[key])} (${referrersList[key].email})`
      : `${toFullName(referrersList[key])}`,
    id: referrersList[key].id,
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
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const handleMonthChange = ({ date }) => {
    setCurrentMonth(date.getMonth() + 1);
  };

  const handlePracticeHomeChange = ({ value }) => {
    setPracticeHomeId(value[0] ? value[0].id : null);
  };
  const handleInsuranceTypeChange = ({ value }) => {
    setInsuranceTypeId(value[0] ? value[0].id : null);
  };
  const handleReferrerChange = ({ value }) => {
    setReferrerId(value[0] ? value[0].id : null);
    if (checkboxChecked) {
      setPcp(value[0] ? value[0].id : '');
    }
  };

  const handlePCPReferrerChange = ({ value }) => {
    setPcp(value[0] ? value[0].id : null);
  };

  const handleEvalStatusChange = ({ value }) => {
    setEvalStatus(value[0] ? value[0].id : null);
  };

  const handleBodyPartChange = ({ value }) => {
    setBodyPart(value[0] ? value[0].id : null);
  };

  const handleDoctorChange = ({ value }) => {
    setDoctorId(value[0] ? value[0].id : null);
  };

  const handleMrnChange = ({ value }) => {
    const newMrn = value[0] ? value[0].id : '';
    setMrn(newMrn);
    const error = validateMRNLength(newMrn);
    if (error) {
      setMrnError(error);
    } else {
      setMrnError('');
    }
  };

  const handleWaitlistChange = ({ value }) => {
    setWaitlistId(value[0] ? value[0].id : null);
  };

  const handleQuickDateChange = (offset: number) => {
    const date = new Date();
    const newDate = new Date(date.setMonth(date.getMonth() + offset));
    setDate(newDate);
  };

  const handleMrnBlur = ({ target }) => {
    if (target.value) {
      const newValue: string = target.value;
      const error = validateMRNLength(newValue);

      if (error) {
        setMrnError(error);
        setMrn('');
      } else {
        setMrnError('');
        setMrn(newValue);
      }
    }
  };

  const handleReferrerBlur = ({ target }) => {
    if (target.value) {
      const newValue: string = target.value;
      setReferrerId(newValue);
      if (checkboxChecked) {
        setPcp(newValue);
      }
      setIsNewReferrer(true);
    }
  };

  const handlePCPReferrerBlur = ({ target }) => {
    if (target.value) {
      const newValue: string = target.value;
      setPcp(newValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mrnErrorMessage = validateMRNLength(mrn);
    if (mrnErrorMessage) {
      setMrnError(mrnErrorMessage);
      return;
    } else {
      setMrnError('');
    }
    if (isValidPhnNo) {
      if (practiceId && doctorId) {
        await withLoader(async () => {
          await dispatch(
            addEvalRecord({
              firstName,
              lastName,
              email,
              date,
              phoneNumber,
              countryCode,
              mrn: mrn ? Number(mrn) : 0,
              practiceHomeId,
              surgeryConfigurationId: surgeryNameId,
              insuranceDetails,
              insuranceTypeId,
              practiceId,
              doctorId,
              pcp,
              referrerId,
              notes,
              status: evalStatus,
              bodyPart,
              waitlistId,
            }),
          );
        });
        try {
          setFirstName('');
          setLastName('');
          setMrn('');
          setPhoneNumber('');
          setCountryCode('+1');
          setEmail('');
          setPracticeHomeId('');
          setInsuranceDetails('');
          setInsuranceTypeId('');
          setPcp('');
          setReferrerId('');
          setNotes('');
          setEvalStatus('');
          setWaitlistId('');
          if (onRecordAdded) {
            onRecordAdded();
          }
          onClose();
        } catch (error) {
          onClose();
        }
      }

      router.refresh();
      onClose();
    } else {
      setErrorMessage('Invalid phone number');
    }
  };

  return (
    <div>
      <div className="px-4">
        <form onSubmit={handleSubmit} className="flex flex-col flex-wrap">
          <div className="flex mt-4 pb-2 border-b border-gray-100 items-center">
            <div className="text-xl font-bold text-black w-full">Add Eval</div>
            <div>
              <Select
                backspaceClearsInputValue
                required
                size={SIZE.mini}
                options={usersOptions}
                onChange={handleDoctorChange}
                value={
                  doctorId
                    ? [{ label: doctorId, id: doctorId }]
                    : defaultUser
                      ? [{ label: toFullName(defaultUser), id: defaultUser.id }]
                      : []
                }
                overrides={{
                  ControlContainer: {
                    style: {
                      backgroundColor: 'rgba(250, 250, 250, 1)',
                      border: 'none',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      color: '#52525B',
                      width: '250px', // Adjust the width as needed
                    },
                  },
                  ClearIcon: {
                    component: () => null,
                  },
                }}
              />
            </div>
          </div>
          {!isValidPhnNo && (
            <div className="flex justify-center text-red-500 mt-2">
              {errorMessage}
            </div>
          )}
          {mrnError && (
            <div className="flex justify-center text-red-500 mt-2">
              {mrnError}
            </div>
          )}
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <label htmlFor="mrn" className="">
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
                  creatable
                  placeholder="Enter MRN"
                  onBlurResetsInput={false}
                  onBlur={handleMrnBlur}
                  onChange={handleMrnChange}
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
              </div>
              <div className="space-y-2 flex-1">
                <label htmlFor="firstName" className="">
                  <RequiredIndicator />
                  &nbsp;First Name
                </label>
                <TextInput
                  name="name"
                  size={SIZE.mini}
                  value={firstName}
                  onChange={(value) => {
                    setFirstName(value);
                  }}
                  required
                />
              </div>
              <div className="space-y-2 flex-1">
                <label htmlFor="lastName" className="">
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
              </div>
            </div>
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <label htmlFor="email" className="">
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
              </div>
              <div className="space-y-2 flex-1">
                <label htmlFor="phoneNumber" className="">
                  <RequiredIndicator />
                  &nbsp;Phone Number
                </label>
                <div className="flex gap-3 items-center">
                  <div ref={phoneInputRef}>
                    <PhoneInput
                      className="shadow-md"
                      defaultCountry="us"
                      value={countryCode}
                      onChange={(value) => {
                        handleCountryCodeChange(value);
                      }}
                      preferredCountries={['us', 'in']} // Set preferred countries to US and India
                      inputProps={{
                        disabled: true,
                        className: 'react-international-phone-input',
                        style: {
                          width: '60px',
                          height: '24px',
                          borderTopRightRadius: '0',
                          borderBottomRightRadius: '0',
                          borderRight: '0',
                          border: '0',
                          backgroundColor: 'rgb(250, 250, 250)',
                        },
                      }}
                    />
                  </div>
                  <div className="flex-grow">
                    <TextInput
                      size={SIZE.mini}
                      name="phoneNumber"
                      value={phoneNumber}
                      onChange={(value) => {
                        handlePhoneNumberChange(value);
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <label htmlFor="practiceHome" className="">
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
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <label htmlFor="referrer" className="">
                  Referrer
                </label>
                <Select
                  size={SIZE.mini}
                  creatable
                  placeholder="Select Referrer"
                  backspaceClearsInputValue={true}
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
              <div className="space-y-2 flex-1">
                <label htmlFor="urlEmbed" className="">
                  No Wait list
                </label>
                <Select
                  backspaceClearsInputValue
                  size={SIZE.mini}
                  placeholder="Select Waitlist"
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
              </div>
              <div className="space-y-2 flex-1">
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
                  checked={checkboxChecked}
                  onChange={handleCheckboxChange}
                >
                  <label htmlFor="pcp" className="">
                    PCP (Check box if same)
                  </label>
                </Checkbox>
                <Select
                  size={SIZE.mini}
                  creatable
                  placeholder="Select PCP"
                  backspaceClearsInputValue={true}
                  onBlurResetsInput={false}
                  onBlur={handlePCPReferrerBlur}
                  onChange={handlePCPReferrerChange}
                  value={pcp ? [{ label: pcp, id: pcp }] : []}
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
            </div>
            <div className="flex gap-4">
              <div className="space-y-2 flex-1 text-xs">
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
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setCheckboxes([target.checked, checkboxes[1]]);
                  }}
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
                  checked={referrerId && !isNewReferrer ? true : false}
                >
                  Notify referrer
                </Checkbox>
              </div>
              <div className="space-y-2 flex-1">
                <label htmlFor="insuranceType" className="">
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
                  // required
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
              <div className="space-y-2 flex-1">
                <label htmlFor="insuranceDetails" className="">
                  Insurance Details
                </label>
                <TextInput
                  size={SIZE.mini}
                  name="insuranceDetails"
                  value={insuranceDetails}
                  onChange={(value) => {
                    setInsuranceDetails(value);
                  }}
                  // required
                />
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="">
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
            <div className="mt-2 flex">
              <div className="px-6 border border-gray-100 pb-6 rounded-xl flex-1 w-4/12">
                <div className="mt-2 text-xl font-bold border-b border-gray-100 text-black w-full">
                  Add Eval
                </div>
                <div className="flex gap-5 mt-2">
                  <div className="space-y-2 flex-1">
                    <label htmlFor="notes" className="">
                      <RequiredIndicator />
                      &nbsp;Surgery
                    </label>
                    <Select
                      required
                      placeholder="Select Surgery"
                      backspaceClearsInputValue
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
                  <div className="space-y-2 flex-1">
                    <label htmlFor="notes" className="">
                      <RequiredIndicator />
                      &nbsp;Body Part
                    </label>
                    <Select
                      required
                      placeholder="Select Body Part"
                      backspaceClearsInputValue
                      disabled={surgeryNameId ? false : true}
                      size={SIZE.mini}
                      options={bodyPartOptions}
                      onChange={(value) => handleBodyPartChange(value)}
                      value={
                        bodyPart ? [{ label: bodyPart, id: bodyPart }] : []
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

                  <div className="space-y-2 flex-1">
                    <label htmlFor="notes" className="">
                      <RequiredIndicator />
                      &nbsp;Surgery Date
                    </label>
                    <DatePicker
                      size={SIZE.mini}
                      value={date}
                      onChange={({ date }) => setDate(date)}
                      placeholder="Eval Date"
                      required
                      onMonthChange={handleMonthChange}
                      onOpen={() => {
                        handleMonthChange({ date: date });
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
                <div className="flex flex-row justify-between">
                  <div className="flex gap-5 mt-4 items-center w-2/3">
                    <label htmlFor="title" className="">
                      Eval Status:
                    </label>
                    <div className="space-y-2 flex-1">
                      <Select
                        backspaceClearsInputValue
                        required
                        disabled
                        size={SIZE.mini}
                        options={evalStatusOption}
                        onChange={handleEvalStatusChange}
                        value={
                          evalStatus
                            ? [{ label: evalStatus, id: evalStatus }]
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
                  </div>
                  <div className="flex gap-2 mt-4 justify-end">
                    <Button
                      kind="secondary"
                      type="button"
                      size={SIZE.mini}
                      onClick={() => handleQuickDateChange(0)}
                      title="Today"
                    />
                    <Button
                      kind="secondary"
                      type="button"
                      size={SIZE.mini}
                      onClick={() => handleQuickDateChange(1)}
                      title="+1"
                    />
                    <Button
                      kind="secondary"
                      type="button"
                      size={SIZE.mini}
                      onClick={() => handleQuickDateChange(3)}
                      title="+3"
                    />
                    <Button
                      kind="secondary"
                      type="button"
                      size={SIZE.mini}
                      onClick={() => handleQuickDateChange(6)}
                      title="+6"
                    />
                    <Button
                      kind="secondary"
                      type="button"
                      size={SIZE.mini}
                      onClick={() => handleQuickDateChange(12)}
                      title="+12"
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr className="" />
            <div className="flex flex-row gap-3 justify-end">
              <div className="text-sm">
                <Button padding="12px 16px" kind="primary" title="Add Eval" />
              </div>
              <div className="text-sm">
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurgeryPage;
