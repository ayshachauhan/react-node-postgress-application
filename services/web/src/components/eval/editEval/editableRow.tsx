import { IInsuranceType, UpdateEValInterface } from '@packages/entities';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { EVAL_STATUS } from '@root/enums/evalStatus.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import { updateRecordAsync } from '@root/store/reducers/evals';
import { getPracticeId } from '@root/utils';
import { DatePicker } from 'baseui/datepicker';
import { SIZE, Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';

function EditableRow({ handleCancelClick, evalInfo, setSelectedAction }) {
  const practiceId = getPracticeId();
  const dispatch = useAppDispatch();
  const [obj, setObj] = useState<Partial<UpdateEValInterface>>({});
  const [insuranceTypeId, setInsuranceTypeId] = useState<string>('');

  const insuranceTypesList: IInsuranceType[] = useAppSelector((state) =>
    Object.values(state.insuranceTypes.entities),
  );

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
      });
      setInsuranceTypeId(evalInfo?.insuranceType?.id);
    }
  }, [evalInfo.id, evalInfo]);
  if (evalInfo) {
    const handleObjChange = (keyToUpdate: string, newValue) => {
      setObj((prevState) => ({
        ...prevState,
        [keyToUpdate]: newValue,
      }));
    };
    const handleInsuranceTypeChange = ({ value }) => {
      setInsuranceTypeId(value[0] ? value[0].id : null);
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (practiceId) {
        const payloadData: Partial<UpdateEValInterface> = {
          practiceId,
          ...obj,
          insuranceTypeId,
        };

        await dispatch(updateRecordAsync({ payloadData, id: evalInfo.id }));

        setSelectedAction(null);
        setInsuranceTypeId('');
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
        <div className="flex flex-row gap-4 px-2 items-center text-xs">
          <div className="py-2 px-1 w-20">
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
          <div className="w-10">
            <TextInput
              size={SIZE.mini}
              disabled
              name="home"
              value={evalInfo.practiceHome.name[0]}
              onChange={(value) => handleObjChange('home', value)}
            />
          </div>
          <div className="px-1 w-40">
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
          <div className="py-2 w-20">
            <TextInput
              size={SIZE.mini}
              name="lastName"
              value={obj.lastName}
              onChange={(value) => handleObjChange('lastName', value)}
            />
          </div>
          <div className="py-2 px-1 w-20">
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
          <div className="py-2 w-40">
            <TextInput
              size={SIZE.mini}
              name="lastName"
              value={obj.email}
              onChange={(value) => handleObjChange('lastName', value)}
            />
          </div>
          <div className="py-2 px-1 w-20">
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

          <div className="py-2 w-20">
            <Select
              backspaceRemoves={false}
              options={evalInfo.surgeryConfiguration.bodyPart.map((ele) => ({
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
          <div className="w-40">
            <Select
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
