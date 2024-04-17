import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/evals';
import { CreateEvalInterface } from '@root/store/requests/evals';
import { getPracticeId } from '@utils/methods';
import { Checkbox } from 'baseui/checkbox';
import { Select } from 'baseui/select';
import React, { useState } from 'react';

const SurgeryPage: React.FC<{ onClose: () => void; items }> = ({
  onClose,
  items,
}) => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const { practiceHomesList, surgeryTypesList, insuranceTypesList } = items;

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

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [mrn, setMrn] = useState('');
  const [surgeryTypeId, setSurgeryTypeId] = useState('');
  const [insuranceDetails, setInsuranceDetails] = useState('');
  const [insuranceTypeId, setInsuranceTypeId] = useState<string>('');
  const [practiceHomeId, setPracticeHomeId] = useState<string>('');
  const [date, setDate] = useState('');
  const [pcp, setPcp] = useState('');
  const [referrer, setReferrer] = useState('');
  const [notes, setNotes] = useState('');

  const [checkboxes, setCheckboxes] = React.useState([true, false]);

  const handleSurgeryTypeChange = ({ value }) => {
    setSurgeryTypeId(value[0] ? value[0].id : null);
  };
  const handlePracticeHomeChange = ({ value }) => {
    setPracticeHomeId(value[0] ? value[0].id : null);
  };
  const handleInsuranceTypeChange = ({ value }) => {
    setInsuranceTypeId(value[0] ? value[0].id : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId) {
      const payload: CreateEvalInterface = {
        firstName,
        lastName,
        email,
        date,
        phoneNumber,
        mrn,
        practiceHomeId,
        surgeryTypeId,
        insuranceDetails,
        insuranceTypeId,
        practiceId,
        pcp,
        referrer,
      };
      try {
        dispatch(addRecordAsync(payload));
        setFirstName('');
        setLastName('');
        setMrn('');
        setPhoneNumber('');
        setEmail('');
        setSurgeryTypeId('');
        setPracticeHomeId('');
        setInsuranceDetails('');
        setInsuranceTypeId('');
        setDate('');
        setPcp('');
        setReferrer('');
        setNotes('');
        onClose();
      } catch (error) {
        onClose();
      }
    }
    onClose();
  };

  return (
    <div>
      <div className="px-6 border-r border-l border-b border-gray-100 pb-6 rounded-xl">
        <form onSubmit={handleSubmit}>
          <div className="flex mt-8 pb-5 border-b border-gray-100">
            <div className="text-xl font-bold text-black w-full">
              Add Surgery
            </div>
            <div>
              <Select
                // required
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
              <Select
              // required
              // overrides={{
              //   ControlContainer: {
              //     style: {
              //       backgroundColor: 'rgba(250, 250, 250, 1)',
              //       border: 'none',
              //       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              //       color: '#52525B',
              //     },
              //   },
              //   ClearIcon: {
              //     component: () => null,
              //   },
              // }}
              />
              <div className="space-y-4"></div>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="space-y-4 flex-1">
              <label htmlFor="referrer" className="text-black text-sm">
                Referrer
              </label>
              <TextInput
                name="referrer"
                value={referrer}
                onChange={(value) => {
                  setReferrer(value);
                }}
                // required
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
              <label htmlFor="url" className="text-black text-sm">
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
            {/* <div className="px-6 border border-gray-100 pb-6 rounded-xl flex-1 w-4/12">
          <div className="mt-8 text-xl pb-5 font-bold border-b border-gray-100 text-black w-full">
            Add Surgery
          </div>
          <div className="flex gap-5 mt-4">
            <div className="space-y-4 flex-1">
              <Select
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
              <Select
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
              <TextInput
                name="url"
                value={url}
                onChange={(value) => {
                  setUrl(value);
                }}
                required
                placeholder="Date"
              />
              <div className="space-y-4"></div>
            </div>
          </div>
          <div className="flex gap-5 mt-4">
            <div className="space-y-4 flex-1">
              <Select
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
              <Select
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
              <TextInput
                name="url"
                value={url}
                onChange={(value) => {
                  setUrl(value);
                }}
                required
                placeholder="Date"
              />
              <div className="space-y-4"></div>
            </div>
          </div>
          <div className="flex gap-5 mt-4">
            <div className="space-y-4 w-6/12">
              <Select
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
            <div className="space-y-4 w-4/12">
              <div className="flex gap-5">
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
                  AM
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
                  Femto
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
                  ORA
                </Checkbox>
              </div>
              <div className="space-y-4"></div>
            </div>
          </div>
          <div className="text-left text-base mt-4">
            <Button kind="primary" title="Add Surgery" width={189} />
          </div>
        </div> */}
            <div className="px-6 border border-gray-100 pb-6 rounded-xl flex-1 w-4/12">
              <div className="mt-8 text-xl pb-5 font-bold border-b border-gray-100 text-black w-full">
                Add Eval
              </div>
              <div className="flex gap-5 mt-4">
                <div className="space-y-4 flex-1">
                  <Select
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
                  {/* <label htmlFor="practiceHome" className="text-black text-sm">
                Home
              </label> */}
                  <Select
                    options={surgeryTypeOptions}
                    onChange={handleSurgeryTypeChange}
                    value={
                      surgeryTypeId
                        ? [{ label: surgeryTypeId, id: surgeryTypeId }]
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
                  <TextInput
                    name="url"
                    value={date}
                    onChange={(value) => {
                      setDate(value);
                    }}
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
              </div>
              <div className="flex gap-5 mt-4 justify-end">
                <Button kind="secondary" title="Today" />
                <Button kind="secondary" title="+1" />
                <Button kind="secondary" title="+3" />
                <Button kind="secondary" title="+6" />
                <Button kind="secondary" title="+12" />
              </div>
              <div className="text-left text-base mt-6">
                <Button kind="primary" title="Add Eval" width={189} />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="text-right text-base mt-6">
        <Button
          kind="tertiary"
          title="Cancel"
          width={189}
          backgroundColor="rgba(212, 212, 216, 1)"
          color="black"
        />
      </div>
    </div>
  );
};

export default SurgeryPage;
