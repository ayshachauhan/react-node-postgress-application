import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { EVAL_EYE_TYPE } from '@root/enums/evalEyeType.enum';
import { EVAL_STATUS } from '@root/enums/evalStatus.enum';
import { SURGERY_EYE_TYPE } from '@root/enums/surgeryEyeType.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import { addRecordAsync as addEvalRecord } from '@root/store/reducers/evals';
import { addRecordAsync as addSurgeryRecord } from '@root/store/reducers/surgery';
import { getPracticeId, toFullName } from '@utils/index';
import { Checkbox } from 'baseui/checkbox';
import { DatePicker } from 'baseui/datepicker';
import { Select } from 'baseui/select';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SurgeryPage: React.FC<{ onClose: () => void; items }> = ({
  onClose,
  items,
}) => {
  const {
    practiceHomesList,
    surgeryTypesList,
    insuranceTypesList,
    referrersList,
    usersList,
  } = items;

  const SELECTED_DOCTOR_KEY: string = 'SELECTED_DOCTOR';
  const getSelectedUserId: string | null =
    localStorage.getItem(SELECTED_DOCTOR_KEY);

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
  const [evalSurgeryTypeId, setEvalSurgeryTypeId] = useState('');
  const [insuranceDetails, setInsuranceDetails] = useState('');
  const [insuranceTypeId, setInsuranceTypeId] = useState<string>('');
  const [practiceHomeId, setPracticeHomeId] = useState<string>('');
  const [evalEyeType, setEvalEyeType] = useState<string>('');
  const [evalStatus, setEvalStatus] = useState<string>('');
  const [surgeryEyeType, setSurgeryEyeType] = useState<string>('');
  const [referrerId, setReferrerId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string | null>(getSelectedUserId);
  const [date, setDate] = useState<Date>(new Date());
  const [surgeryDate, SetSurgeryDate] = useState<Date>(new Date());
  const [pcp, setPcp] = useState('');
  const [notes, setNotes] = useState('');
  const [checkboxes, setCheckboxes] = React.useState([true, false]);
  const [url, setUrl] = useState('');
  const [isAddEval, setIsEval] = useState<boolean>(false);
  const [surgeryNameId, setSurgeryNameId] = useState<string>('');
  const [surgeryDropdownOptions, setSurgeryDropdownOptions] = useState([
    { id: '', label: '', checked: false },
  ]);

  const handleCheckboxChange = (index: number) => {
    surgeryDropdownOptions[index].checked =
      !surgeryDropdownOptions[index].checked;
    setSurgeryDropdownOptions([...surgeryDropdownOptions]);
  };

  useEffect(() => {
    if (surgeryNameId) {
      const selectedSurgeryConfiguration =
        surgeryConfigurationsList[surgeryNameId];
      const selectedSurgeryOptions = Object.keys(
        selectedSurgeryConfiguration.options,
      ).map((ele, i) => ({ id: i + '', label: ele, checked: true }));

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

  const surgeryTypeOptions = Object.keys(surgeryTypesList).map((key) => ({
    label: surgeryTypesList[key].name,
    id: surgeryTypesList[key].id,
  }));

  const insuranceTypesOptions = Object.keys(insuranceTypesList).map((key) => ({
    label: insuranceTypesList[key].name,
    id: insuranceTypesList[key].id,
  }));

  const evalEyeTypeOptions = Object.keys(EVAL_EYE_TYPE).map((key) => ({
    label: key,
    id: key,
  }));

  const surgeryEyeTypeOptions = Object.keys(SURGERY_EYE_TYPE).map((key) => ({
    label: key,
    id: key,
  }));

  const evalStatusOption = Object.keys(EVAL_STATUS).map((key) => ({
    label: key,
    id: key,
  }));

  const referrersOptions = Object.keys(referrersList).map((key) => ({
    label:
      referrersList[key].email +
      (referrersList[key].firstName
        ? ` (${toFullName(referrersList[key])})`
        : ''),
    id: referrersList[key].id,
  }));

  const usersOptions = usersList.map((key) => ({
    label: key ? toFullName(key) : '',
    id: key.id,
  }));

  const handleSurgeryNameChange = ({ value }) => {
    setSurgeryNameId(value[0] ? value[0].id : null);
  };
  const handleEvalSurgeryTypeChange = ({ value }) => {
    setEvalSurgeryTypeId(value[0] ? value[0].id : null);
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

  const handleEvalEyeTypeChange = ({ value }) => {
    setEvalEyeType(value[0] ? value[0].id : null);
  };

  const handleSurgeryEyeTypeChange = ({ value }) => {
    setSurgeryEyeType(value[0] ? value[0].id : null);
  };

  const handleDoctorChange = ({ value }) => {
    setDoctorId(value[0] ? value[0].id : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId && doctorId) {
      if (isAddEval) {
        dispatch(
          addEvalRecord({
            firstName,
            lastName,
            email,
            date,
            phoneNumber,
            mrn,
            practiceHomeId,
            surgeryTypeId: evalSurgeryTypeId,
            insuranceDetails,
            insuranceTypeId,
            practiceId,
            doctorId,
            pcp,
            referrerId,
            details: notes,
            status: evalStatus,
            eye: evalEyeType,
          }),
        );
      } else {
        dispatch(
          addSurgeryRecord({
            firstName,
            lastName,
            email,
            date: surgeryDate,
            phoneNumber,
            mrn,
            practiceHomeId,
            surgeryConfigurationId: surgeryNameId,
            insuranceDetails,
            insuranceTypeId,
            practiceId,
            doctorId,
            pcp,
            referrerId,
            details: notes,
            surgeryOption: surgeryDropdownOptions
              .filter((ele) => ele.checked)
              .map((ele) => ele.label),
            eye: surgeryEyeType,
          }),
        );
      }

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
        setEvalEyeType('');
        setSurgeryEyeType('');
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
      <div className="px-6 border-rborder-l border-b border-gray-100 pb-6">
        <form onSubmit={handleSubmit}>
          <div className="flex mt-8 pb-5 border-b border-gray-100">
            <div className="text-xl font-bold text-black w-full">
              Add Surgery
            </div>
            <div>
              <Select
                required
                options={usersOptions}
                onChange={handleDoctorChange}
                value={
                  doctorId
                    ? [{ label: doctorId, id: doctorId }]
                    : [{ label: toFullName(defaultUser), id: defaultUser.id }]
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
            <div className="space-y-4 flex-1">
              <label htmlFor="firstName" className="text-black text-sm">
                First Name
              </label>
              <TextInput
                name="name"
                value={firstName}
                onChange={(value) => {
                  setFirstName(value);
                }}
                required
              />
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-4 flex-1">
              <label htmlFor="lastName" className="text-black text-sm">
                Last Name
              </label>
              <TextInput
                name="lastName"
                value={lastName}
                onChange={(value) => {
                  setLastName(value);
                }}
                required
              />
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-4 flex-1">
              <label htmlFor="mrn" className="text-black text-sm">
                MRN
              </label>
              <TextInput
                name="mrn"
                value={mrn}
                onChange={(value) => {
                  setMrn(value);
                }}
                required
              />
              <div className="space-y-4"></div>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="space-y-4 flex-1">
              <label htmlFor="email" className="text-black text-sm">
                Email
              </label>
              <TextInput
                name="email"
                value={email}
                onChange={(value) => {
                  setEmail(value);
                }}
                required
              />
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-4 flex-1">
              <label htmlFor="phoneNumber" className="text-black text-sm">
                Phone Number
              </label>
              <TextInput
                name="phoneNumber"
                value={phoneNumber}
                onChange={(value) => {
                  setPhoneNumber(value);
                }}
                required
              />
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-4 flex-1">
              <label htmlFor="urlEmbed" className="text-black text-sm">
                No Wait list
              </label>
              <Select />
              <div className="space-y-4"></div>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="space-y-4 flex-1">
              <label htmlFor="referrer" className="text-black text-sm">
                Referrer
              </label>
              <Select
                creatable
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
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-4 flex-1">
              <label htmlFor="practiceHome" className="text-black text-sm">
                Home
              </label>
              <Select
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
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-4 flex-1">
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
                checked={checkboxes[0]}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setCheckboxes([target.checked, checkboxes[1]]);
                }}
              >
                <label htmlFor="pcp" className="text-black text-sm">
                  PCP (Check box if same)
                </label>
              </Checkbox>

              <TextInput
                name="pcp"
                value={pcp}
                onChange={(value) => {
                  setPcp(value);
                }}
                // required
              />
              <div className="space-y-4"></div>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="space-y-4 flex-1">
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
                checked={checkboxes[0]}
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
                checked={checkboxes[1]}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setCheckboxes([checkboxes[0], target.checked]);
                }}
              >
                Notify referrer
              </Checkbox>
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-4 flex-1">
              <label htmlFor="insuranceType" className="text-black text-sm">
                Insurance Type
              </label>
              <Select
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
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-4 flex-1">
              <label htmlFor="insuranceDetails" className="text-black text-sm">
                Insurance Details
              </label>
              <TextInput
                name="insuranceDetails"
                value={insuranceDetails}
                onChange={(value) => {
                  setInsuranceDetails(value);
                }}
                // required
              />
              <div className="space-y-4"></div>
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="text-black text-sm">
              Notes
            </label>
            <TextInput
              name="notes"
              value={notes}
              onChange={(value) => {
                setNotes(value);
              }}
            />
            <div className="space-y-4"></div>
          </div>
          <div className="mt-6 flex gap-5">
            <div className="px-6 border border-gray-100 pb-6 rounded-xl flex-1 w-4/12">
              <div className="mt-8 text-xl pb-5 font-bold border-b border-gray-100 text-black w-full">
                Add Surgery
              </div>
              <div className="flex gap-5 mt-4">
                <div className="space-y-4 flex-1">
                  <Select
                    required
                    options={surgeryEyeTypeOptions}
                    onChange={handleSurgeryEyeTypeChange}
                    value={
                      surgeryEyeType
                        ? [{ label: surgeryEyeType, id: surgeryEyeType }]
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
                  <div className="space-y-4"></div>
                </div>
                <div className="space-y-4 flex-1">
                  <Select
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
                  <div className="space-y-4"></div>
                </div>
                <div className="space-y-4 flex-1">
                  <DatePicker
                    value={surgeryDate}
                    onChange={({ date }) => SetSurgeryDate(date)}
                    placeholder="Surgery Date"
                    required
                  />
                  <div className="space-y-4"></div>
                </div>
              </div>
              <div className="flex gap-5 mt-4">
                <div className="space-y-4 flex-1">
                  <Select disabled />
                  <div className="space-y-4"></div>
                </div>
                <div className="space-y-4 flex-1">
                  <Select disabled />
                  <div className="space-y-4"></div>
                </div>
                <div className="space-y-4 flex-1">
                  <TextInput
                    name="url"
                    value={url}
                    onChange={(value) => {
                      setUrl(value);
                    }}
                    placeholder="Date"
                    disabled
                  />
                  <div className="space-y-4"></div>
                </div>
              </div>
              <div className="flex gap-5 mt-4">
                {surgeryNameId &&
                  surgeryDropdownOptions.map((option, index) => (
                    <div key={index}>
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
                  ))}
              </div>
              <div className="text-left text-base mt-4">
                <Button kind="primary" title="Add Surgery" width={189} />
              </div>
            </div>
            <div className="px-6 border border-gray-100 pb-6 rounded-xl flex-1 w-4/12">
              <div className="mt-8 text-xl pb-5 font-bold border-b border-gray-100 text-black w-full">
                Add Eval
              </div>
              <div className="flex gap-5 mt-4">
                <div className="space-y-4 flex-1">
                  <Select
                    options={evalEyeTypeOptions}
                    onChange={handleEvalEyeTypeChange}
                    value={
                      evalEyeType
                        ? [{ label: evalEyeType, id: evalEyeType }]
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
                  <div className="space-y-4"></div>
                </div>
                <div className="space-y-4 flex-1">
                  <Select
                    options={surgeryTypeOptions}
                    onChange={handleEvalSurgeryTypeChange}
                    value={
                      evalSurgeryTypeId
                        ? [{ label: evalSurgeryTypeId, id: evalSurgeryTypeId }]
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
                  <div className="space-y-4"></div>
                </div>
                <div className="space-y-4 flex-1">
                  <DatePicker
                    value={date}
                    onChange={({ date }) => setDate(date)}
                    placeholder="Eval Date"
                    required
                  />
                  <div className="space-y-4"></div>
                </div>
              </div>
              <div className="flex gap-5 mt-4 items-center">
                <label htmlFor="title" className="text-black text-sm">
                  Eval Status:
                </label>
                <div className="space-y-4 flex-1">
                  <Select
                    options={evalStatusOption}
                    onChange={handleEvalStatusChange}
                    value={
                      evalStatus ? [{ label: evalStatus, id: evalStatus }] : []
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
                  <div className="space-y-4"></div>
                </div>
              </div>
              <div className="flex gap-5 mt-4 justify-end">
                <Button kind="secondary" title="Today" />
                <Button kind="secondary" title="+1" />
                <Button kind="secondary" title="+3" />
                <Button kind="secondary" title="+6" />
                <Button kind="secondary" title="+12" />
              </div>
              <div className="text-left text-base mt-6">
                <Button
                  kind="primary"
                  title="Add Eval"
                  width={189}
                  onClick={() => setIsEval(true)}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="text-right text-base mt-6">
        <Button
          type="button"
          kind="tertiary"
          title="Cancel"
          width={189}
          style={{
            backgroundColor: 'rgba(212, 212, 216, 1)',
            color: 'black',
          }}
        />
      </div>
    </div>
  );
};

export default SurgeryPage;
