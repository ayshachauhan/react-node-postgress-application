import { UpdateEValInterface } from '@packages/entities';
import { IReferrer } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { EVAL_STATUS } from '@root/enums/evalStatus.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import { updateRecordAsync } from '@root/store/reducers/evals';
import {
  cleanedPhoneNumber,
  getBackGroundColorCss,
  getDifferenceInDays,
  getPracticeId,
  getUserId,
  toFullName,
  usDateFormatter,
  validateMRNLength,
} from '@root/utils';
import { Checkbox } from 'baseui/checkbox';
import { DatePicker } from 'baseui/datepicker';
import { SIZE, Select } from 'baseui/select';
import React, { useEffect, useRef, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface EditableRowProps {
  handleCancelClick;
  evalInfo;
  setSelectedAction;
  withLoader: (func: () => Promise<void>) => Promise<void>;
  onRecordEdited?: () => void;
}

const EditableRow: React.FC<EditableRowProps> = ({
  handleCancelClick,
  evalInfo,
  setSelectedAction,
  withLoader,
  onRecordEdited,
}) => {
  const practiceId = getPracticeId();
  const [emailError, setEmailError] = useState('');
  const doctorId: string | null = getUserId();
  const dispatch = useAppDispatch();
  const [obj, setObj] = useState<Partial<UpdateEValInterface>>({});
  const [insuranceTypeId, setInsuranceTypeId] = useState<string>('');
  const [referrerId, setReferrerId] = useState<string>('');
  const [pcp, setPCP] = useState<string>('');
  const [waitlistId, setWaitlistId] = useState<string>('');
  const [isValidPhnNo, setIsValidPhnNo] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    insuranceTypesList,
    referrersList,
    waitlist,
    practiceHomesList,
    calendars,
    patients,
  } = useAppSelector((state) => ({
    insuranceTypesList: Object.values(state.insuranceTypes.entities),
    referrersList: Object.values(state.referrers.entities),
    waitlist: Object.values(state.waitlist.entities),
    practiceHomesList: Object.values(state.practiceHomes.entities),
    calendars: Object.values(state.calendars?.entities).filter(
      (calendar) => calendar?.user?.id === doctorId,
    ),
    patients: Object.values(state.patients.entities),
  }));

  const evalStatusOption = Object.keys(EVAL_STATUS).map((key) => ({
    label: key,
    id: key,
  }));

  const insuranceTypesOptions = Object.keys(insuranceTypesList).map((key) => ({
    label: insuranceTypesList[key].name,
    id: insuranceTypesList[key].id,
  }));

  const surgeryConfigurationsList = useAppSelector(
    (state) => state.surgeryConfigurations.entities,
  );

  const surgeryConfigurationsOptions = Object.values(
    surgeryConfigurationsList,
  ).map((key) => ({
    label: key.name,
    id: key.id,
  }));

  const waitlistOptions = Object.keys(waitlist).map((key) => ({
    label: waitlist[key].name,
    id: waitlist[key].id,
  }));

  const practiceHomesOptions = Object.keys(practiceHomesList).map((key) => ({
    label: practiceHomesList[key].name,
    id: practiceHomesList[key].id,
  }));

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [pendingMrnCheck, setPendingMrnCheck] = useState<string | null>(null);

  const [mrnError, setMrnError] = useState('');
  const handleMonthChange = ({ date }) => {
    setCurrentMonth(date.getMonth() + 1);
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };
  const validatePhoneNumber = (fullNumber: string) => {
    try {
      const parsedPhoneNumber = cleanedPhoneNumber(fullNumber);
      const isValid = parsedPhoneNumber?.isValid?.() ?? false;

      setIsValidPhnNo(isValid);
      setErrorMessage(isValid ? '' : 'Invalid phone number');
    } catch (error) {
      setIsValidPhnNo(false);
      setErrorMessage('Invalid phone number');
    }
  };

  const phoneInputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (patients.length === 0) return;

    // MRN check
    if (
      pendingMrnCheck !== null &&
      String(pendingMrnCheck) !== String(evalInfo?.patient?.mrn)
    ) {
      const isDuplicateMrn = patients.some(
        (patient) =>
          String(patient.mrn).trim() === String(pendingMrnCheck).trim() &&
          patient.id !== evalInfo?.patient?.id,
      );

      setMrnError(isDuplicateMrn ? 'MRN already exists' : '');
      setPendingMrnCheck(null);
    }
  }, [patients, pendingMrnCheck, evalInfo?.patient?.id]);

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
        buttonElement.style.color = 'rgba(82, 82, 91, 1)';
        buttonElement.style.fontSize = '0.75rem';
      }
    }
  }, []);

  useEffect(() => {
    if (evalInfo && evalInfo.id) {
      setObj({
        insuranceTypeId: evalInfo.insuranceType?.name,
        insuranceDetails: evalInfo.insuranceDetails,
        date: new Date(evalInfo.date),
        firstName: evalInfo.patient.firstName,
        lastName: evalInfo.patient.lastName,
        email: evalInfo.patient.email,
        phoneNumber: evalInfo.patient.phoneNumber,
        countryCode: evalInfo.patient.countryCode,
        notes: evalInfo.notes ? evalInfo.notes : '',
        bodyPart: evalInfo.bodyPart,
        mrn: evalInfo.patient.mrn,
        status: evalInfo.status,
        waitlistId: evalInfo.waitlistId,
        practiceHomeId: evalInfo?.practiceHome?.id,
      });

      setInsuranceTypeId(evalInfo?.insuranceType?.id);
      setReferrerId(evalInfo.referrer?.id);
      setPCP(evalInfo.pcp?.id);
      setWaitlistId(evalInfo?.waitlist?.id);
      const fullPhoneNumber =
        (evalInfo.patient.countryCode || '') +
        (evalInfo.patient.phoneNumber || '');
      validatePhoneNumber(fullPhoneNumber);
      validateEmail(evalInfo.patient.email);
    }
  }, [evalInfo.id, evalInfo]);
  if (evalInfo) {
    const handleObjChange = (keyToUpdate: string, newValue) => {
      setObj((prevState) => {
        const updatedState = {
          ...prevState,
          [keyToUpdate]: newValue,
        };

        if (keyToUpdate === 'countryCode' || keyToUpdate === 'phoneNumber') {
          const fullPhoneNumber =
            keyToUpdate === 'countryCode'
              ? newValue + prevState.phoneNumber
              : prevState.countryCode + newValue;

          validatePhoneNumber(fullPhoneNumber);
        }

        if (keyToUpdate === 'mrn') {
          const validationError = validateMRNLength(newValue);
          if (validationError) {
            setMrnError(validationError);
          } else {
            setPendingMrnCheck(newValue);
            setMrnError('');
          }
        }

        if (keyToUpdate === 'email') {
          validateEmail(newValue);
        }

        return updatedState;
      });
    };
    const handleInsuranceTypeChange = ({ value }) => {
      setInsuranceTypeId(value[0] ? value[0].id : null);
    };

    const handleReferrerChange = ({ value }) => {
      setReferrerId(value[0] ? value[0].id : null);
    };

    const handlePCPChange = ({ value }) => {
      setPCP(value[0] ? value[0].id : null);
    };

    const handleQuickDateChange = (offset: number) => {
      const date = new Date();
      const newDate = new Date(date.setMonth(date.getMonth() + offset));
      handleObjChange('date', newDate);
    };

    const handleWaitlistChange = ({ value }) => {
      setWaitlistId(value[0] ? value[0].id : null);
    };

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
        </span>
      );
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const mrnErrorMessage = validateMRNLength(String(obj.mrn));
      if (mrnErrorMessage) {
        setMrnError(mrnErrorMessage);
        return;
      } else {
        setMrnError('');
      }

      const originalMrn = evalInfo?.patient?.mrn;
      if (String(obj.mrn) !== String(originalMrn)) {
        const duplicateMrn = patients.some(
          (patient) =>
            String(patient.mrn) === String(obj.mrn) &&
            patient.id !== evalInfo?.patient?.id,
        );

        if (duplicateMrn) {
          setMrnError('MRN already exists');
          return;
        }
      }
      setMrnError('');

      if (emailError) {
        setEmailError(emailError);
        return;
      } else {
        setEmailError('');
      }

      const originalEmail = evalInfo?.patient?.email;
      if (String(obj.email) !== String(originalEmail)) {
        const duplicateEmail = patients.some(
          (patient) =>
            String(patient.email) === String(obj.email) &&
            patient.id !== evalInfo?.patient?.id,
        );

        if (duplicateEmail) {
          setEmailError('Email already exists');
          return;
        }
      }
      setEmailError('');

      if (isValidPhnNo) {
        if (practiceId) {
          const payloadData: Partial<UpdateEValInterface> = {
            practiceId,
            ...obj,
            insuranceTypeId,
            referrerId,
            pcp,
            waitlistId,
          };
          await withLoader(async () => {
            await dispatch(updateRecordAsync({ payloadData, id: evalInfo.id }));
          });

          setSelectedAction(null);
          setInsuranceTypeId('');
          setReferrerId('');
          setPCP('');
          setWaitlistId('');
          setObj({
            insuranceTypeId: '',
            insuranceDetails: '',
            date: new Date(),
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            countryCode: '',
            notes: '',
            bodyPart: '',
            mrn: 0,
            status: '',
          });
          if (onRecordEdited) {
            onRecordEdited();
          }
        }
      } else {
        setErrorMessage('Invalid phone number');
      }
    };

    return (
      <>
        <tr className="border-t border-gray-300">
          <td rowSpan={2}>
            <DatePicker
              value={obj.date}
              onChange={({ date }) => handleObjChange('date', date)}
              size={SIZE.mini}
              onMonthChange={handleMonthChange}
              onOpen={() => {
                handleMonthChange({ date: obj.date });
              }}
              overrides={{
                Root: {
                  style: {
                    heightOverride: '40px',
                  },
                },
                InputContainer: {
                  style: {
                    backgroundColor: '#000000',
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

            <div className="flex gap-2 mt-4">
              <Button
                kind="secondary"
                type="button"
                size={SIZE.mini}
                onClick={() => handleQuickDateChange(1)}
                title="+1"
                height={25}
                width={25}
              />
              <Button
                kind="secondary"
                type="button"
                size={SIZE.mini}
                onClick={() => handleQuickDateChange(3)}
                title="+3"
                height={25}
                width={25}
              />
              <Button
                kind="secondary"
                type="button"
                size={SIZE.mini}
                onClick={() => handleQuickDateChange(6)}
                title="+6"
                height={25}
                width={25}
              />
              <Button
                kind="secondary"
                type="button"
                size={SIZE.mini}
                onClick={() => handleQuickDateChange(12)}
                title="+12"
                height={25}
                width={25}
              />
            </div>
          </td>
          <td rowSpan={2} className="">
            <TextInput
              disabled
              size={SIZE.mini}
              name="lastName"
              value={
                usDateFormatter(evalInfo.date) +
                ` (${getDifferenceInDays(new Date(evalInfo.date), new Date())})`
              }
              onChange={(value) => handleObjChange('lastName', value)}
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
                    paddingRight: '0',
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
              size={SIZE.mini}
              options={evalStatusOption}
              value={obj.status ? [{ label: obj.status, id: obj.status }] : []}
              onChange={({ value }) =>
                handleObjChange('status', value[0].label)
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
          <td className="min-w-20" rowSpan={1}>
            <div className="">
              <TextInput
                size={SIZE.mini}
                name="lastName"
                value={obj.lastName}
                onChange={(value) => handleObjChange('lastName', value)}
              />
            </div>
          </td>
          <td className="min-w-20" rowSpan={1}>
            <div className="">
              <TextInput
                size={SIZE.mini}
                name="firstName"
                value={obj.firstName}
                onChange={(value) => handleObjChange('firstName', value)}
              />
            </div>
          </td>
          <td rowSpan={1} className="min-w-20">
            <div className="">
              <TextInput
                name="mrn"
                type="number"
                value={obj.mrn}
                onChange={(value) => handleObjChange('mrn', value)}
                size={SIZE.mini}
              />
              {mrnError && (
                <div className="flex justify-center text-red-500 mt-2">
                  {mrnError}
                </div>
              )}
            </div>
          </td>
          <td rowSpan={1} className="min-w-20">
            <Select
              backspaceRemoves={false}
              escapeClearsValue={false}
              disabled
              options={surgeryConfigurationsOptions}
              value={[
                {
                  id: evalInfo?.surgeryConfiguration?.name,
                  label: evalInfo?.surgeryConfiguration?.name,
                },
              ]}
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
              options={evalInfo?.surgeryConfiguration?.bodyPart.map((ele) => ({
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
          <td rowSpan={2} className="">
            <Select
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
          </td>

          <td rowSpan={2} className="min-w-60">
            <div className="mb-1">
              <TextInput
                name="hash"
                value={obj.email}
                onChange={(value) => handleObjChange('email', value)}
                size={SIZE.mini}
              />
              {emailError && (
                <div className="flex text-red-500 mt-2 mb-2">{emailError}</div>
              )}
            </div>
            <div className="mb-1">
              <div className="flex gap-2 items-center">
                <div ref={phoneInputRef}>
                  <PhoneInput
                    className="shadow-md"
                    defaultCountry="us"
                    value={obj.countryCode}
                    onChange={(value) => handleObjChange('countryCode', value)}
                    preferredCountries={['us', 'in']} // Set preferred countries to US and India
                    inputProps={{
                      disabled: true,
                      className: 'react-international-phone-input',
                      style: {
                        width: '40px',
                        height: '24px',
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
              {!isValidPhnNo && (
                <div className="text-red-500 mt-2">{errorMessage}</div>
              )}
            </div>
            <div className="">
              <Select
                backspaceClearsInputValue={true}
                escapeClearsValue={false}
                options={referrersList.map((ele) => ({
                  id: ele.id,
                  label: CustomOptionWithTick(ele),
                }))}
                value={
                  referrerId ? [{ label: referrerId, id: referrerId }] : []
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
            <div className="">
              <Select
                backspaceClearsInputValue={true}
                escapeClearsValue={false}
                options={referrersList.map((ele) => ({
                  id: ele.id,
                  label: CustomOptionWithTick(ele),
                }))}
                value={pcp ? [{ label: pcp, id: pcp }] : []}
                onChange={handlePCPChange}
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
          <td rowSpan={2} className="">
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                kind="primary"
                title="Update"
                width={60}
                height={28}
              />
              <Button
                onClick={handleCancelClick}
                type="button"
                kind="tertiary"
                title="Cancel"
                width={60}
                height={28}
                style={{
                  backgroundColor: 'rgba(212, 212, 216, 1)',
                  color: 'black',
                }}
              />
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan={6} className="bg-white">
            <div className="flex items-center">
              <span className="font-semibold mr-2">Waitlist: </span>
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
            <span className="font-semibold">Notes: </span>
            <br />
            <TextInput
              size={SIZE.mini}
              onChange={(value) => handleObjChange('notes', value)}
              value={obj?.notes}
            />
          </td>
        </tr>
      </>
    );
  } else return null;
};
export default EditableRow;
