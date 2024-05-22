import { IInsuranceType, UpdateSurgeryPayload } from '@packages/entities';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { USER_PERMISSIONS } from '@root/enums/userPermissions.enums';
import { useUserPermission } from '@root/hooks/userHasPermission';
import { useAppDispatch, useAppSelector } from '@root/store';
import { updateRecordAsync } from '@root/store/reducers/surgery';
import { getPracticeId } from '@root/utils';
import { DatePicker } from 'baseui/datepicker';
import { SIZE, Select } from 'baseui/select';
import React, { useMemo, useState } from 'react';

function EditableRow({
  handleCancelClick,
  customHeaders,
  surgeryInfo,
  setSelectedAction,
}) {
  const practiceId = getPracticeId();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.auth.user);
  const userPermissions = userInfo?.permissions;
  const viewBillingColumn = useUserPermission(userPermissions, [
    USER_PERMISSIONS.VIEW_BILLING,
  ]);
  const editDatesCaseAllowed = useUserPermission(userPermissions, [
    USER_PERMISSIONS.EDIT_DATES,
  ]);
  const isDisabled = useMemo(() => {
    return !editDatesCaseAllowed;
  }, [editDatesCaseAllowed]);

  const insuranceTypesList: IInsuranceType[] = useAppSelector((state) =>
    Object.values(state.insuranceTypes.entities),
  );

  const surgeryConfigurationsList = useAppSelector(
    (state) => state.surgeryConfigurations.entities,
  );

  const surgeryConfigurationsOptions = Object.values(
    surgeryConfigurationsList,
  ).map((key) => ({
    label: key.name,
    id: key.id,
  }));

  const [obj, setObj] = useState({
    surgeryConfigurationId: surgeryInfo.surgeryConfiguration.id,
    insuranceTypeId: surgeryInfo.insuranceType?.id,
    insuranceDetails: '',
    date: new Date(surgeryInfo.date),
    firstName: surgeryInfo.patient.firstName,
    lastName: surgeryInfo.patient.lastName,
    email: surgeryInfo.patient.email,
    phoneNumber: surgeryInfo.patient.phoneNumber,
    details: surgeryInfo.patient.details,
    bodyPart: surgeryInfo.bodyPart,
    selectedSurgeryOptions: surgeryInfo.selectedSurgeryOptions,
    selectedCheckListOption: surgeryInfo.selectedCheckListOptions
      ? surgeryInfo.selectedCheckListOptions
      : {},
    totalHospitalPricing: surgeryInfo.totalHospitalPricing,
    totalProfessionalPricing: surgeryInfo.totalProfessionalPricing,
    home: surgeryInfo.practiceHome.name[0],
    mrn: surgeryInfo.patient.mrn,
  });

  const handleObjChange = (keyToUpdate: string, newValue) => {
    setObj((prevState) => ({
      ...prevState,
      [keyToUpdate]: newValue,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (practiceId) {
      delete obj.surgeryConfigurationId;
      const payload: UpdateSurgeryPayload = {
        practiceId,
        ...obj,
      };

      await dispatch(updateRecordAsync({ payload, id: surgeryInfo.id }));

      setSelectedAction(null);
    }
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
        <div className="flex gap-2 px-2.5 items-center text-xs">
          <div className="py-2 w-20">
            <DatePicker
              value={obj.date}
              disabled={isDisabled}
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
          <div className="w-10">
            <TextInput
              size={SIZE.mini}
              disabled
              name="home"
              value={obj.home}
              onChange={(value) => handleObjChange('home', value)}
            />
          </div>
          <div className=" w-20">
            <TextInput
              size={SIZE.mini}
              disabled
              name="status"
              value="booked"
              onChange={() => handleObjChange('status', 'booked')}
            />
          </div>
          <div className="py-2 w-20">
            <TextInput
              size={SIZE.mini}
              name="lastName"
              value={obj.lastName}
              onChange={(value) => handleObjChange('lastName', value)}
            />
          </div>
          <div className="py-2 w-20">
            <TextInput
              size={SIZE.mini}
              name="firstName"
              value={obj.firstName}
              onChange={(value) => handleObjChange('firstName', value)}
            />
          </div>
          <div className="w-20">
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
                obj.surgeryConfigurationId
                  ? [
                      {
                        id: obj.surgeryConfigurationId,
                        label:
                          surgeryConfigurationsList[obj.surgeryConfigurationId]
                            .name,
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
            const selectOptionObj = obj.selectedSurgeryOptions[optionsHeader];
            return (
              <div className="py-2 w-20" key={optionsHeaderIndex}>
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
                      hospitalPrice: ele.hospitalPrice,
                      professionalPrice: ele.professionalPrice,
                    };
                  })}
                  value={
                    selectOptionObj
                      ? [
                          {
                            id: selectOptionObj.value,
                            value: selectOptionObj.value,
                            hospitalPrice: selectOptionObj.hospitalPrice,
                            professionalPrice:
                              selectOptionObj.professionalPrice,
                          },
                        ]
                      : []
                  }
                  onChange={({ value }) =>
                    handleObjChange('selectedSurgeryOptions', {
                      ...obj.selectedSurgeryOptions,
                      [optionsHeader]: { value: value[0].label },
                    })
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
              name="hash"
              value="10"
              disabled
              onChange={() => ''}
              size={SIZE.mini}
            />
          </div>
          {customCheckListHeaders.map(
            (checkListHeader, checkListHeaderIndex) => {
              const selectedChecklistOption =
                obj.selectedCheckListOption[checkListHeader];

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
                      handleObjChange('selectedCheckListOption', {
                        ...obj.selectedCheckListOption,
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
                type="number"
                min={0}
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
                type="number"
                min={0}
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
                obj.insuranceTypeId
                  ? insuranceTypesList.filter(
                      (ele) => ele.id === obj.insuranceTypeId,
                    )
                  : []
              }
              onChange={({ value }) =>
                handleObjChange('insuranceTypeId', value[0].id)
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
          <div className="flex items-center gap-2 py-2 w-40">
            <Button kind="primary" title="Update" width={60} height={10} />
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
