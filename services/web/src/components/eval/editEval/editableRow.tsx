import { UpdateEValInterface } from '@packages/entities';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { EVAL_STATUS } from '@root/enums/evalStatus.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import { updateRecordAsync } from '@root/store/reducers/evals';
import {
  getDifferenceInDays,
  getPracticeId,
  toFullName,
  usDateFormatter,
} from '@root/utils';
import { DatePicker } from 'baseui/datepicker';
import { SIZE, Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';

function EditableRow({ handleCancelClick, evalInfo, setSelectedAction }) {
  const practiceId = getPracticeId();
  const dispatch = useAppDispatch();
  const [obj, setObj] = useState<Partial<UpdateEValInterface>>({});
  const [insuranceTypeId, setInsuranceTypeId] = useState<string>('');
  const [referrerId, setReferrerId] = useState<string>('');
  const [waitlistId, setWaitlistId] = useState<string>('');

  const { insuranceTypesList, referrersList, waitlist, practiceHomesList } =
    useAppSelector((state) => ({
      insuranceTypesList: Object.values(state.insuranceTypes.entities),
      referrersList: Object.values(state.referrers.entities),
      waitlist: Object.values(state.waitlist.entities),
      practiceHomesList: Object.values(state.practiceHomes.entities),
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
    label: practiceHomesList[key].name[0],
    id: practiceHomesList[key].id,
  }));

  useEffect(() => {
    if (evalInfo.id && evalInfo) {
      setObj({
        insuranceTypeId: evalInfo.insuranceType?.name,
        insuranceDetails: evalInfo.insuranceDetails,
        date: new Date(evalInfo.date),
        firstName: evalInfo.patient.firstName,
        lastName: evalInfo.patient.lastName,
        email: evalInfo.patient.email,
        phoneNumber: evalInfo.patient.phoneNumber,
        details: evalInfo.patient.details,
        bodyPart: evalInfo.bodyPart,
        mrn: evalInfo.patient.mrn,
        status: evalInfo.status,
        waitlistId: evalInfo.waitlistId,
        practiceHomeId: evalInfo.practiceHome.id,
      });

      setInsuranceTypeId(evalInfo?.insuranceType?.id);
      setReferrerId(evalInfo.patient?.referrer?.id);
      setWaitlistId(evalInfo?.waitlist?.id);
    }
  }, [evalInfo.id, evalInfo]);
  if (evalInfo) {
    const handleObjChange = (keyToUpdate: string, newValue) => {
      console.log(newValue);

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

    const handleQuickDateChange = (offset: number) => {
      const date = new Date();
      const newDate = new Date(date.setMonth(date.getMonth() + offset));
      handleObjChange('date', newDate);
    };

    const handleWaitlistChange = ({ value }) => {
      setWaitlistId(value[0] ? value[0].id : null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (practiceId) {
        const payloadData: Partial<UpdateEValInterface> = {
          practiceId,
          ...obj,
          insuranceTypeId,
          referrerId,
          waitlistId,
        };

        await dispatch(updateRecordAsync({ payloadData, id: evalInfo.id }));

        setSelectedAction(null);
        setInsuranceTypeId('');
        setReferrerId('');
        setWaitlistId('');
        setObj({
          insuranceTypeId: '',
          insuranceDetails: '',
          date: new Date(),
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          details: '',
          bodyPart: '',
          mrn: 0,
          status: '',
        });
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row gap-4 px-2 items-start text-xs overflow-auto">
          <div className="py-1 px-1 w-32">
            <div>
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
                  InputContainer: {
                    style: {
                      backgroundColor: '#00000',
                    },
                  },
                }}
              />
            </div>
            <div>
              <div className="flex gap-2 mt-4 justify-end">
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
            </div>
          </div>
          <div className="py-1 w-20">
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
          </div>
          <div className="w-14 py-1">
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
          </div>
          <div className="px-1 w-40 py-1">
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
          </div>
          <div className="flex flex-col w-max gap-4">
            <div className="flex flex-row gap-4 text-center">
              <div className="py-1 w-20">
                <TextInput
                  size={SIZE.mini}
                  name="lastName"
                  value={obj.lastName}
                  onChange={(value) => handleObjChange('lastName', value)}
                />
              </div>
              <div className="py-1 px-1 w-20">
                <TextInput
                  size={SIZE.mini}
                  name="firstName"
                  value={obj.firstName}
                  onChange={(value) => handleObjChange('firstName', value)}
                />
              </div>
              <div className="w-20 py-1">
                <TextInput
                  name="mrn"
                  type="number"
                  value={obj.mrn}
                  onChange={(value) => handleObjChange('mrn', value)}
                  size={SIZE.mini}
                />
              </div>
              <div className="py-1 w-40">
                <TextInput
                  size={SIZE.mini}
                  name="email"
                  value={obj.email}
                  onChange={(value) => handleObjChange('email', value)}
                />
              </div>
              <div className="py-1 px-1 w-20">
                <Select
                  backspaceRemoves={false}
                  escapeClearsValue={false}
                  disabled
                  options={surgeryConfigurationsOptions}
                  value={[
                    {
                      id: evalInfo.surgeryConfiguration.name,
                      label: evalInfo.surgeryConfiguration.name,
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
              </div>
              <div className="py-1 w-20">
                <Select
                  backspaceRemoves={false}
                  options={evalInfo.surgeryConfiguration.bodyPart.map(
                    (ele) => ({
                      id: ele,
                      label: ele,
                    }),
                  )}
                  value={
                    obj.bodyPart
                      ? [{ id: obj.bodyPart, label: obj.bodyPart }]
                      : [{ id: 'd', label: 'r' }]
                  }
                  onChange={({ value }) =>
                    handleObjChange('bodyPart', value[0].id)
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
              </div>
              <div className="w-40 py-1">
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
              </div>
            </div>
            <div className="flex flex-center gap-4 items-center">
              <div className="text-black text-center font-semibold w-20">
                Waitlist:{' '}
              </div>
              <div className=" w-20">
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
              <div className="text-black text-center font-semibold w-20">
                Notes:{' '}
              </div>
              <div className=" w-20">
                <TextInput
                  size={SIZE.mini}
                  onChange={(value) => handleObjChange('details', value)}
                  value={obj.details}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col text-black py-0.5 px-1 w-40 items-center">
            <div className="text-black py-0.5 px-1 w-40 text-center">
              <TextInput
                name="hash"
                value={evalInfo.patient.email}
                disabled
                onChange={() => ''}
                size={SIZE.mini}
              />
            </div>
            <div className="text-black py-0.5 px-1 w-40 text-center">
              <TextInput
                name="hash"
                value={evalInfo.patient.phoneNumber}
                disabled
                onChange={() => ''}
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
          </div>
          <div className="flex items-center gap-2 py-2 w-40">
            <Button kind="primary" title="Update" width={50} height={10} />
            <Button
              onClick={handleCancelClick}
              type="button"
              kind="tertiary"
              title="Cancel"
              width={50}
              height={10}
              style={{
                backgroundColor: 'rgba(212, 212, 216, 1)',
                color: 'black',
              }}
            />
          </div>
        </div>
      </form>
    );
  } else return null;
}
export default EditableRow;
