import Button from '@root/components/Button';
import RequiredIndicator from '@root/components/RequiredIndicator';
import TextInput from '@root/components/TextInput';
import { EVAL_STATUS } from '@root/enums/evalStatus.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import { addRecordAsync as addEvalRecord } from '@root/store/reducers/evals';
import { getPracticeId, toFullName } from '@utils/index';
import { Checkbox } from 'baseui/checkbox';
import { DatePicker } from 'baseui/datepicker';
import { SIZE, Select } from 'baseui/select';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface SurgeryPageProps {
  onClose: () => void;
  withLoader: (func: () => Promise<void>) => Promise<void>;
}

const SurgeryPage: React.FC<SurgeryPageProps> = ({ onClose, withLoader }) => {
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
    calendars: Object.values(state.calendars.entities),
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

  const dispatch = useAppDispatch();
  const surgeryConfigurationsList = useAppSelector(
    (state) => state.surgeryConfigurations.entities,
  );
  const surgeryConfigurations = Object.values(surgeryConfigurationsList);
  const practiceId = getPracticeId();
  const router = useRouter();
  const defaultUser = usersList.find((ele) => ele.id === getSelectedUserId);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
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

  useEffect(() => {
    if (mrn) {
      const patientCheck = patientsList.find((ele) => String(ele.mrn) === mrn);

      if (patientCheck) {
        setFirstName(patientCheck.firstName);
        setLastName(patientCheck.lastName);
        setEmail(patientCheck.email);
        setPhoneNumber(patientCheck.phoneNumber);
        setReferrerId(patientCheck.referrer ? patientCheck?.referrer.id : '');
      } else {
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

      setBodyPartOptions(
        selectedSurgeryConfiguration.bodyPart.map((ele) => ({
          id: ele,
          label: ele,
        })),
      );
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

  const waitlistOptions = Object.keys(waitlist).map((key) => ({
    label: waitlist[key].name,
    id: waitlist[key].id,
  }));

  const evalStatusOption = [
    {
      id: EVAL_STATUS['Future Evaluation'],
      label: EVAL_STATUS['Future Evaluation'],
    },
  ];

  const referrersOptions = Object.keys(referrersList).map((key) => ({
    label: referrersList[key].email
      ? `${toFullName(referrersList[key])} (${referrersList[key].email})`
      : `${toFullName(referrersList[key])}`,
    id: referrersList[key].id,
  }));

  const usersOptions = usersList.map((key) => ({
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
    setMrn(value[0] ? value[0].id : null);
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
    if (practiceId && doctorId) {
      await withLoader(async () => {
        await dispatch(
          addEvalRecord({
            firstName,
            lastName,
            email,
            date,
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
        setEmail('');
        setPracticeHomeId('');
        setInsuranceDetails('');
        setInsuranceTypeId('');
        setPcp('');
        setReferrerId('');
        setNotes('');
        setEvalStatus('');
        setWaitlistId('');
        onClose();
      } catch (error) {
        onClose();
      }
    }

    router.refresh();
    onClose();
  };

  return (
    <div>
      <div className="border-border-l border-b border-gray-100">
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
                creatable
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
                name="name"
                size={SIZE.mini}
                value={firstName}
                onChange={(value) => {
                  setFirstName(value);
                }}
                required
              />
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
              <div className="space-y-1"></div>
            </div>
          </div>
          <div className="flex gap-5">
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
              <div className="space-y-1"></div>
            </div>
            <div className="space-y-1 flex-1">
              <label htmlFor="phoneNumber" className="text-black text-xs">
                <RequiredIndicator />
                &nbsp;Phone Number
              </label>
              <TextInput
                size={SIZE.mini}
                name="phoneNumber"
                value={phoneNumber}
                onChange={(value) => {
                  setPhoneNumber(value);
                }}
                required
              />
              <div className="space-y-1"></div>
            </div>
            <div className="space-y-1 flex-1">
              <label htmlFor="practiceHome" className="text-black text-xs">
                <RequiredIndicator />
                &nbsp;Home
              </label>
              <Select
                placeholder="Select Practice Home"
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
          <div className="flex gap-5">
            <div className="space-y-1 flex-1">
              <label htmlFor="referrer" className="text-black text-xs">
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
              <div className="space-y-1"></div>
            </div>
            <div className="space-y-1 flex-1">
              <label htmlFor="urlEmbed" className="text-black text-xs">
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
              <div className="space-y-1"></div>
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
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setCheckboxes([target.checked, checkboxes[1]]);
                }}
              >
                <label htmlFor="pcp" className="text-black text-xs">
                  PCP (Check box if same)
                </label>
              </Checkbox>
              <TextInput
                size={SIZE.mini}
                name="pcp"
                disabled
                value={pcp}
                onChange={(value) => {
                  setPcp(value);
                }}
              />
            </div>
          </div>
          <div className="flex gap-5">
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
              <div className="space-y-1"></div>
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
              <div className="space-y-1"></div>
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
                // required
              />
              <div className="space-y-1"></div>
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="text-black text-xs">
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
            <div className="space-y-1"></div>
          </div>
          <div className="mt-2 flex">
            <div className="px-6 border border-gray-100 pb-6 rounded-xl flex-1 w-4/12">
              <div className="mt-2 text-xl font-bold border-b border-gray-100 text-black w-full">
                Add Eval
              </div>
              <div className="flex gap-5 mt-2">
                <div className="space-y-1 flex-1">
                  <label htmlFor="notes" className="text-black text-xs">
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
                  <div className="space-y-1"></div>
                </div>
                <div className="space-y-1 flex-1">
                  <label htmlFor="notes" className="text-black text-xs">
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
                    value={bodyPart ? [{ label: bodyPart, id: bodyPart }] : []}
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
                  <div className="space-y-1"></div>
                </div>

                <div className="space-y-1 flex-1">
                  <label htmlFor="notes" className="text-black text-xs">
                    <RequiredIndicator />
                    &nbsp;Surgery Date
                  </label>
                  <DatePicker
                    size={SIZE.mini}
                    value={date}
                    onChange={({ date }) => setDate(date)}
                    placeholder="Eval Date"
                    required
                  />
                  <div className="space-y-1"></div>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex gap-5 mt-4 items-center w-2/3">
                  <label htmlFor="title" className="text-black text-xs">
                    Eval Status:
                  </label>
                  <div className="space-y-1 flex-1">
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
                    <div className="space-y-1"></div>
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
          <div className="flex flex-row gap-3 justify-end">
            {' '}
            <div className="text-left text-xs mt-2">
              <Button kind="primary" title="Add Eval" width={90} />
            </div>
            <div className="text-right text-xs mt-2">
              <Button
                type="button"
                kind="tertiary"
                title="Cancel"
                width={90}
                style={{
                  backgroundColor: 'rgba(212, 212, 216, 1)',
                  color: 'black',
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
