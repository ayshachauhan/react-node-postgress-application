import { UpdateSurgeryPayload } from '@packages/entities';
import { SurgeryStatus } from '@packages/entities/index.browser';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useUserPermission } from '@root/hooks/userHasPermission';
import { useAppDispatch, useAppSelector } from '@root/store';
import { updateRecordAsync } from '@root/store/reducers/surgery';
import { getPracticeId, toFullName } from '@root/utils';
import { DatePicker } from 'baseui/datepicker';
import { SIZE, Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';

function EditableRow({
  rowId,
  handleCancelClick,
  customHeaders,
  surgeryInfo,
  handleUpdateClick,
  withLoader,
}) {
  const practiceId = getPracticeId();
  const surgeryStatusOptions = Object.keys(SurgeryStatus).map((key) => ({
    label: SurgeryStatus[key as keyof typeof SurgeryStatus],
    id: key,
  }));

  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.auth.user);
  const userPermissions = userInfo?.permissions;
  const viewBillingColumn = useUserPermission(userPermissions, [
    USER_PERMISSIONS.VIEW_BILLING,
  ]);
  const [obj, setObj] = useState<Partial<UpdateSurgeryPayload>>({});
  const [insuranceTypeId, setInsuranceTypeId] = useState<string>('');
  const [referrerId, setReferrerId] = useState<string>('');
  const [waitlistId, setWaitlistId] = useState<string>('');

  useEffect(() => {
    if (surgeryInfo.id && surgeryInfo) {
      setObj({
        insuranceTypeId: surgeryInfo?.insuranceType?.name,
        surgeryStatus: surgeryInfo?.surgeryStatus,
        date: new Date(surgeryInfo.date),
        firstName: surgeryInfo.patient.firstName,
        lastName: surgeryInfo.patient.lastName,
        details: surgeryInfo.patient.details,
        bodyPart: surgeryInfo.bodyPart,
        mrn: surgeryInfo.patient.mrn,
        selectedSurgeryOptions: surgeryInfo.selectedSurgeryOptions,
        selectedCheckListOptions: surgeryInfo.selectedCheckListOptions,
        totalHospitalPricing: surgeryInfo.totalHospitalPricing,
        totalProfessionalPricing: surgeryInfo.totalProfessionalPricing,
        surgeryOrder: surgeryInfo.surgeryOrder,
        referrerId: surgeryInfo.patient.referrer
          ? toFullName(surgeryInfo.patient.referrer)
          : '',
        practiceHomeId: surgeryInfo.practiceHome.id,
      });
      setInsuranceTypeId(surgeryInfo?.insuranceType?.id);
      setReferrerId(surgeryInfo.patient?.referrer?.id);
      setWaitlistId(surgeryInfo?.waitlist?.id);
    }
  }, [surgeryInfo.id, surgeryInfo]);

  const { insuranceTypesList, referrersList, practiceHomesList, waitlist } =
    useAppSelector((state) => ({
      insuranceTypesList: Object.values(state.insuranceTypes.entities),
      referrersList: Object.values(state.referrers.entities),
      practiceHomesList: Object.values(state.practiceHomes.entities),
      waitlist: Object.values(state.waitlist.entities),
    }));

  const waitlistOptions = Object.keys(waitlist).map((key) => ({
    label: waitlist[key].name,
    id: waitlist[key].id,
  }));

  const practiceHomesOptions = Object.keys(practiceHomesList).map((key) => ({
    label: practiceHomesList[key].name[0],
    id: practiceHomesList[key].id,
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
    setReferrerId(value[0] ? value[0].id : null);
  };

  const handleWaitlistChange = ({ value }) => {
    setWaitlistId(value[0] ? value[0].id : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (practiceId) {
      const payload: Partial<UpdateSurgeryPayload> = {
        practiceId,
        ...obj,
        insuranceTypeId,
        referrerId,
        waitlistId,
      };
      await withLoader(async () => {
        await dispatch(updateRecordAsync({ payload, id: surgeryInfo.id }));
      });

      setInsuranceTypeId('');
      setReferrerId('');
      setWaitlistId('');
      setObj({
        insuranceTypeId: '',
        date: new Date(),
        firstName: '',
        lastName: '',
        details: '',
        bodyPart: '',
        surgeryStatus: SurgeryStatus.PENDING,
        mrn: 0,
        selectedSurgeryOptions: {},
        selectedCheckListOptions: {},
        totalHospitalPricing: '0',
        totalProfessionalPricing: '0',
        referrerId: '',
      });
    }
    handleUpdateClick(rowId); // Close the specific row after updating
  };

  if (surgeryInfo) {
    const { surgeryConfiguration } = surgeryInfo;
    const surgeryName: string = surgeryConfiguration.name;
    const customOptionsHeaders: string[] =
      customHeaders[surgeryName].surgeryOptionsHeaders;
    const customCheckListHeaders: string[] =
      customHeaders[surgeryName].checkListHeaders;

    return (
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 px-2.5 items-start text-xs">
          <div className="py-2 w-20">
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
              }}
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
                  },
                },
                ClearIcon: {
                  component: () => null,
                },
              }}
            />
          </div>
          <div className="py-2 w-40">
            <Select
              options={surgeryStatusOptions}
              overrides={{
                ControlContainer: {
                  style: {
                    backgroundColor: 'rgba(250, 250, 250, 1)',
                    border: 'none',
                    color: 'rgba(82, 82, 91, 1)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
              size={SIZE.mini}
              onChange={({ value }) =>
                handleObjChange('surgeryStatus', value[0].label)
              }
            />
          </div>
          <div>
            <div className="py-2 w-20">
              <TextInput
                size={SIZE.mini}
                name="lastName"
                value={obj.lastName}
                onChange={(value) => handleObjChange('lastName', value)}
              />
            </div>
            <div>
              <div className="flex flex-center gap-4 items-center">
                <div className="text-black text-center font-semibold w-20 pt-2">
                  Waitlist:{' '}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="py-2 w-20">
              <TextInput
                size={SIZE.mini}
                name="firstName"
                value={obj.firstName}
                onChange={(value) => handleObjChange('firstName', value)}
              />
            </div>
            <div className=" w-20 pt-2">
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
          </div>
          <div className="w-20 py-2">
            <TextInput
              name="mrn"
              type="number"
              value={obj.mrn}
              onChange={(value) => handleObjChange('mrn', value)}
              size={SIZE.mini}
            />
          </div>
          <div className="py-2 w-20">
            <Select
              backspaceRemoves={false}
              escapeClearsValue={false}
              disabled
              options={surgeryConfigurationsOptions}
              value={
                surgeryInfo.surgeryConfiguration.id
                  ? [
                      {
                        id: surgeryInfo.surgeryConfiguration.id,
                        label:
                          surgeryConfigurationsList[
                            surgeryInfo.surgeryConfiguration.id
                          ].name,
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
          </div>
          <div className="py-2 w-20">
            <Select
              backspaceRemoves={false}
              options={surgeryConfiguration.bodyPart.map((ele) => ({
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
          </div>

          {customOptionsHeaders.map((optionsHeader, optionsHeaderIndex) => {
            const count = surgeryConfiguration.options[optionsHeader]?.count;

            const optionCountSelect: JSX.Element[] = [];

            for (let index = 0; index < count; index++) {
              const selectOptionObj = obj.selectedSurgeryOptions
                ? obj.selectedSurgeryOptions[`${optionsHeader}-${index}`]
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
                    options={surgeryInfo.surgeryConfiguration.options[
                      optionsHeader
                    ]?.allowedValues?.map((ele) => {
                      return {
                        id: ele.name,
                        label: ele.name,
                        hospitalPricing: ele.hospitalPricing,
                        professionalPricing: ele.professionalPricing,
                      };
                    })}
                    value={
                      selectOptionObj
                        ? [
                            {
                              id: selectOptionObj.value,
                              value: selectOptionObj.value,
                              hospitalPricing: selectOptionObj.hospitalPricing,
                              professionalPricing:
                                selectOptionObj.professionalPricing,
                            },
                          ]
                        : []
                    }
                    onChange={({ value }) =>
                      handleObjChange('selectedSurgeryOptions', {
                        ...obj.selectedSurgeryOptions,
                        [`${optionsHeader}-${index}`]: {
                          value: value[0].label,
                        },
                      })
                    }
                    disabled={
                      !surgeryInfo.surgeryConfiguration.options[optionsHeader]
                        ?.edit_admin_option
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
                </div>,
              );
            }
            return (
              <div
                className="py-2 w-20 flex flex-col gap-2 justify-center"
                key={optionsHeaderIndex}
              >
                {optionCountSelect}
              </div>
            );
          })}
          <div className="py-2 w-20">
            <TextInput
              size={SIZE.mini}
              name="details"
              value={obj.details}
              onChange={(value) => handleObjChange('details', value)}
            />
          </div>
          <div className="py-2 w-20">
            <TextInput
              type="number"
              name="hash"
              value={obj.surgeryOrder}
              onChange={(value) => handleObjChange('surgeryOrder', value)}
              size={SIZE.mini}
            />
          </div>
          {customCheckListHeaders.map(
            (checkListHeader, checkListHeaderIndex) => {
              const selectedChecklistOption = obj.selectedCheckListOptions
                ? obj.selectedCheckListOptions[checkListHeader]
                : '';

              return (
                <div className="py-2 px-1.5 w-20" key={checkListHeaderIndex}>
                  <TextInput
                    size={SIZE.mini}
                    value={
                      selectedChecklistOption
                        ? selectedChecklistOption.value
                        : ''
                    }
                    onChange={(value) =>
                      handleObjChange('selectedCheckListOptions', {
                        ...obj.selectedCheckListOptions,
                        [checkListHeader]: { value },
                      })
                    }
                  />
                </div>
              );
            },
          )}
          {viewBillingColumn && (
            <div className="py-2 w-20">
              <TextInput
                size={SIZE.mini}
                name="prof"
                value={obj.totalProfessionalPricing}
                onChange={(value) =>
                  handleObjChange('totalProfessionalPricing', value)
                }
                backgroundColor="rgba(220, 220, 220, 1)"
              />
            </div>
          )}
          {viewBillingColumn && (
            <div className="py-2 w-20">
              <TextInput
                size={SIZE.mini}
                name="hospital"
                value={obj.totalHospitalPricing}
                onChange={(value) =>
                  handleObjChange('totalHospitalPricing', value)
                }
                backgroundColor="rgba(220, 220, 220, 1)"
              />
            </div>
          )}
          <div className="py-2 w-20">
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
          </div>
          <div className="flex flex-col text-black py-0.5 px-1 w-40 items-center">
            <div className="text-black py-0.5 px-1 w-40 text-center">
              <TextInput
                name="hash"
                value={surgeryInfo.patient.email}
                disabled
                onChange={() => ''}
                size={SIZE.mini}
              />
            </div>
            <div className="text-black py-0.5 px-1 w-40 text-center">
              <TextInput
                name="hash"
                value={surgeryInfo.patient.phoneNumber}
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
            <Button
              kind="primary"
              title="Update"
              width={60}
              height={10}
              type="submit"
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
        </div>
      </form>
    );
  } else return null;
}
export default EditableRow;
