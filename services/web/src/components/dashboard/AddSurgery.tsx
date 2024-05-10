import { SelectedSurgeryOption } from '@packages/entities';
import { ICalendar } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchCalendars } from '@root/store/reducers/calendar';
import { addRecordAsync as addSurgeryRecord } from '@root/store/reducers/surgery';
import { getPracticeId, toFullName } from '@utils/index';
import { Checkbox } from 'baseui/checkbox';
import { DatePicker } from 'baseui/datepicker';
import { Select } from 'baseui/select';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SurgeryPage: React.FC<{ onClose: () => void; items }> = ({
  onClose,
  items,
}) => {
  const {
    practiceHomesList,
    insuranceTypesList,
    referrersList,
    usersList,
    calendars,
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
  const [insuranceDetails, setInsuranceDetails] = useState('');
  const [insuranceTypeId, setInsuranceTypeId] = useState<string>('');
  const [practiceHomeId, setPracticeHomeId] = useState<string>('');
  const [bodyPart, setBodyPart] = useState<string>('');
  const [referrerId, setReferrerId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string | null>(getSelectedUserId);
  const [surgeryDate, SetSurgeryDate] = useState<Date>(new Date());
  const [pcp, setPcp] = useState('');
  const [notes, setNotes] = useState('');
  const [checkboxes, setCheckboxes] = React.useState([true, false]);
  const [surgeryNameId, setSurgeryNameId] = useState<string>('');
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

  const handlePracticeHomeChange = ({ value }) => {
    setPracticeHomeId(value[0] ? value[0].id : null);
  };

  const handleInsuranceTypeChange = ({ value }) => {
    setInsuranceTypeId(value[0] ? value[0].id : null);
  };

  const handleReferrerChange = ({ value }) => {
    setReferrerId(value[0] ? value[0].id : null);
  };

  const handleBodyPartTypeChange = ({ value }) => {
    setBodyPart(value[0] ? value[0].id : null);
  };

  const handleDoctorChange = ({ value }) => {
    setDoctorId(value[0] ? value[0].id : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const surgeryOptionObj: SelectedSurgeryOption = {};
    surgeryDropdownOptions.forEach((ele) => {
      const allowedValue = ele.allowedValues.find((ele) => ele.selected);
      if (ele.checked && allowedValue) {
        surgeryOptionObj[ele.label] = {
          professionalPricing: allowedValue.professionalPricing,
          hospitalPricing: allowedValue.hospitalPricing,
          value: allowedValue.label,
        };
      }
    });

    if (practiceId && doctorId) {
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
          selectedSurgeryOptions: surgeryOptionObj,
          bodyPart,
          totalHospitalPricing: 0,
          totalProfessionalPricing: 0,
        }),
      );

      dispatch(fetchCalendars({ practiceId, userId: doctorId }));

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
        onClose();
      } catch (error) {
        onClose();
      }
    }

    router.refresh();
    onClose();
  };

  const isCalendarDates = (date: Date): boolean => {
    const formattedDate = moment(date).format('YYYY-MM-DD'); // Get date part only

    const dates = (calendars as ICalendar[])
      .filter(
        (calendar: ICalendar) =>
          moment(calendar.date).format('YYYY-MM-DD') >
          moment(new Date()).format('YYYY-MM-DD'),
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

    console.log(calendar, date, formattedDate, 'findcal');

    return calendar.maxSlots >= calendar.bookedSlots
      ? {
          backgroundColor: calendar.surgeryConfiguration.color,
          borderTopColor: calendar.surgeryConfiguration.color,
          borderBottomColor: calendar.surgeryConfiguration.color,
          borderRightColor: calendar.surgeryConfiguration.color,
          borderLeftColor: calendar.surgeryConfiguration.color,
        }
      : {
          backgroundColor: 'transparent',
          outline: `${calendar.surgeryConfiguration.color} solid 3px`,
          borderTopColor: calendar.surgeryConfiguration.color,
          borderBottomColor: calendar.surgeryConfiguration.color,
          borderRightColor: calendar.surgeryConfiguration.color,
          borderLeftColor: calendar.surgeryConfiguration.color,
        };
  };

  const getBackGroundColorCss = (date: Date): Record<string, unknown> => {
    return isCalendarDates(date)
      ? isSlotsAvailable(date)
      : { backgroundColor: 'transparent' };
  };

  return (
    <div>
      <div className="px-6 border-border-l border-b border-gray-100 pb-6">
        <form onSubmit={handleSubmit} className="flex flex-col flex-wrap">
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
                <div className="space-y-4 flex-1 w-1/3">
                  <Select
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
                <div className="space-y-4 flex-1 w-1/3">
                  <DatePicker
                    value={surgeryDate}
                    onChange={({ date }) => SetSurgeryDate(date)}
                    placeholder="Surgery Date"
                    required
                    overrides={{
                      Day: {
                        style: ({ $date }) => ({
                          height: '53px',
                          width: '53px',
                          borderRadius: '50%',
                          boxSizing: 'border-box',
                          paddingTop: '6px',
                          paddingBottom: '6px',
                          color: '#000000',
                          ...getBackGroundColorCss($date),
                          ':after': '',
                        }),
                      },
                    }}
                    minDate={new Date()}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5 mt-4">
                {surgeryNameId &&
                  surgeryDropdownOptions.map((option, index) => (
                    <div
                      className="flex flex-row items-center w-1/3"
                      key={index}
                    >
                      <div key={index} className="w-1/2">
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
          <div className="flex items-center gap-4">
            <div className="text-right text-base mt-4">
              <Button kind="primary" title="Add Surgery" width={189} />
            </div>
            <div className="text-right text-base mt-4">
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
        </form>
      </div>
    </div>
  );
};

export default SurgeryPage;
