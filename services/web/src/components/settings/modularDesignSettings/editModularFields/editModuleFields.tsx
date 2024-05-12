import {
  CreateSurgeryConfigurationPayload,
  ISurgeryConfiguration,
} from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import { AddIcon, CloseIcon } from '@root/components/Icons';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import { editRecordAsync } from '@root/store/reducers/surgeryConfigurations';
import { DEFAULT_SURGERYNAME_COLOR } from '@root/utils/constants';
import { getPracticeId } from '@utils/index';
import { Select } from 'baseui/select';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const EditModularField: React.FC<{ onClose: () => void; data }> = ({
  onClose,
  data,
}) => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const surgeryConfigInfo: ISurgeryConfiguration | undefined = Object.values(
    useAppSelector((state) => state.surgeryConfigurations.entities),
  ).find((ele) => ele.id === data.configurationId);
  const [surgeryName, setSurgeryName] = useState<string>('');
  const [surgeryTypeId, setSurgeryTypeId] = useState<string>(
    surgeryConfigInfo?.surgeryType.id || '',
  );

  const [surgeryNameColor, setSurgeryNameColor] = useState<string>('');

  const [bodyPartInputFields, setBodyPartInputFields] = useState([
    { value: '' },
  ]);
  const [facilityInputFields, setFacilityInputFields] = useState([
    { value: '' },
  ]);

  const [optionsFields, setOptionsFields] = useState([
    {
      category: '',
      billingType: '',
      hospitalPricing: 0,
      professionalPricing: 0,
      option: [''],
    },
  ]);
  const [checkListInputFields, setCheckListInputFields] = useState([
    { value: '' },
  ]);

  useEffect(() => {
    if (surgeryConfigInfo) {
      const defaultChecklist = Object.values(surgeryConfigInfo?.checkList);
      const defaultOptions = Object.values(surgeryConfigInfo?.options);

      setSurgeryName(surgeryConfigInfo.name);
      setSurgeryTypeId(surgeryConfigInfo.surgeryType.id);
      setSurgeryNameColor(
        surgeryConfigInfo?.color ?? DEFAULT_SURGERYNAME_COLOR,
      );
      setBodyPartInputFields(
        surgeryConfigInfo?.bodyPart.map((ele) => ({ value: ele })),
      );
      setFacilityInputFields(
        surgeryConfigInfo?.facility.map((ele) => ({ value: ele })),
      );
      setCheckListInputFields(
        defaultChecklist.map((ele) => ({ value: ele.label })),
      );
      setOptionsFields(
        defaultOptions.map((ele) => ({
          category: ele.label,
          billingType: ele.billingType,
          hospitalPricing: ele.allowedValues[0].hospitalPricing,
          professionalPricing: ele.allowedValues[0].professionalPricing,
          option: ele.allowedValues.map((ele) => ele.name),
        })),
      );
    }
  }, [surgeryConfigInfo]);

  const router = useRouter();

  const { surgeryTypesList } = data;

  const surgeryTypeOptions = Object.keys(surgeryTypesList).map((key) => ({
    label: surgeryTypesList[key].name,
    id: surgeryTypesList[key].id,
  }));

  const handleChangeInput = (index: number, event: string) => {
    const values = [...bodyPartInputFields];
    values[index].value = event;
    setBodyPartInputFields(values);
  };
  const handleAddFields = () => {
    setBodyPartInputFields([...bodyPartInputFields, { value: '' }]);
  };
  const handleRemoveFields = (index) => {
    const values = [...bodyPartInputFields];
    values.splice(index, 1);
    setBodyPartInputFields(values);
  };

  const handleFacilityChangeInput = (index: number, event: string) => {
    const values = [...facilityInputFields];
    values[index].value = event;
    setFacilityInputFields(values);
  };
  const handleFacilityAddFields = () => {
    setFacilityInputFields([...facilityInputFields, { value: '' }]);
  };

  const handleFacilityRemoveField = (index) => {
    const values = [...facilityInputFields];
    values.splice(index, 1);
    setFacilityInputFields(values);
  };

  const handleOptionsFieldChangeInput = (index: number, event, key: string) => {
    const values = [...optionsFields];
    if (Array.isArray(event)) {
      values[index][key] = event.map((ele) => ele.label);
    } else {
      values[index][key] = event;
    }
    setOptionsFields(values);
  };
  const handleOptionsAddField = () => {
    setOptionsFields([
      ...optionsFields,
      {
        category: '',
        billingType: '',
        hospitalPricing: 0,
        professionalPricing: 0,
        option: [],
      },
    ]);
  };
  const handleOptionsFields = (index) => {
    const values = [...optionsFields];
    values.splice(index, 1);
    setOptionsFields(values);
  };

  const handleChecklistChangeInput = (index: number, event: string) => {
    const values = [...checkListInputFields];
    values[index].value = event;
    setCheckListInputFields(values);
  };

  const handleChecklistAddFields = () => {
    setCheckListInputFields([...checkListInputFields, { value: '' }]);
  };

  const handleChecklistRemoveFields = (index) => {
    const values = [...checkListInputFields];
    values.splice(index, 1);
    setCheckListInputFields(values);
  };

  const handleSurgeryTypeChange = ({ value }) => {
    setSurgeryTypeId(value[0] ? value[0].id : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const surgeryOptionObj = {};
    const checkListObj = {};

    optionsFields.forEach((optionField) => {
      const optionResult = optionField.option.map((element) => {
        return {
          name: element,
          professionalPricing: optionField.professionalPricing,
          hospitalPricing: optionField.hospitalPricing,
        };
      });
      surgeryOptionObj[optionField.category] = {
        type: 'string',
        label: optionField.category,
        default: '',
        required: true,
        allowedValues: optionResult,
        count: 1,
        billingType: optionField.billingType,
      };
    });

    checkListInputFields.forEach((ele) => {
      checkListObj[ele.value] = {
        type: 'string',
        label: ele.value,
        default: '',
        required: true,
      };
    });
    if (practiceId) {
      const payloadData: CreateSurgeryConfigurationPayload = {
        surgeryTypeId,
        name: surgeryName,
        bodyPart: bodyPartInputFields.map((ele) => ele.value),
        facility: facilityInputFields.map((ele) => ele.value),
        options: surgeryOptionObj,
        checkList: checkListObj,
        color: surgeryNameColor,
      };

      dispatch(
        editRecordAsync({ payloadData, practiceId, id: data.configurationId }),
      );
    }

    try {
      setSurgeryName('');
      onClose();
    } catch (error) {
      onClose();
    }

    router.refresh();
    onClose();
  };

  return (
    <div>
      <div className="px-6 border-border-l border-b border-gray-100 pb-6">
        <form onSubmit={handleSubmit}>
          <div className="flex mt-8 pb-5 border-b border-gray-100">
            <div className="text-xl font-bold text-black w-full">
              Edit Modular Field
            </div>
          </div>
          <div className="flex gap-5 mt-4">
            <div className="space-y-4 flex-1">
              <label htmlFor="surgeryName" className="text-black text-sm">
                Surgery Type
              </label>
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
                      color: 'rgba(82, 82, 91, 1)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
              <label htmlFor="surgeryName" className="text-black text-sm">
                Surgery Name
              </label>
              <TextInput
                name="surgeryName"
                value={surgeryName}
                onChange={(value) => {
                  setSurgeryName(value);
                }}
                required
              />
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-4 flex-2">
              <label htmlFor="surgeryName" className="text-black text-sm">
                Surgery Name Color
              </label>
              <div className="d-block">
                <input
                  type="color"
                  id="primary_color"
                  required={true}
                  value={surgeryNameColor}
                  onChange={(e) => setSurgeryNameColor(e.target.value)}
                  style={{
                    height: '50px',
                    width: '50px',
                    border: 'none',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 mt-4">
            <div className="space-y-4 flex-1">
              <label htmlFor="bodyPart" className="text-black text-sm">
                Body Part
              </label>
              <div className="flex flex-row gap-3">
                {bodyPartInputFields.map((inputField, index, bodyPartsArr) => (
                  <div key={index}>
                    <TextInput
                      type="text"
                      value={inputField.value}
                      onChange={(event) => handleChangeInput(index, event)}
                      endEnhancer={
                        bodyPartsArr.length > 1 ? (
                          <div
                            className="rounded-md cursor-pointer items-center pl-3"
                            onClick={() => handleRemoveFields(index)}
                          >
                            <CloseIcon className="" size={10} />
                          </div>
                        ) : null
                      }
                    />
                  </div>
                ))}
                <div className="">
                  <Button
                    type="button"
                    kind="primary"
                    title=""
                    width={50}
                    height={50}
                    startEnhancer={() => (
                      <AddIcon className="mt-2 ml-2" size={25}></AddIcon>
                    )}
                    onClick={handleAddFields}
                  />
                </div>
                <div className="space-y-4"></div>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <label htmlFor="facility" className="text-black text-sm">
                Facility
              </label>
              <div className="flex flex-row">
                {facilityInputFields.map((inputField, index, facilityArr) => (
                  <div key={index}>
                    <TextInput
                      type="text"
                      value={inputField.value}
                      onChange={(event) =>
                        handleFacilityChangeInput(index, event)
                      }
                      endEnhancer={
                        facilityArr.length > 1 ? (
                          <div
                            className="rounded-md cursor-pointer items-center pl-3"
                            onClick={() => handleFacilityRemoveField(index)}
                          >
                            <CloseIcon className="" size={10} />
                          </div>
                        ) : null
                      }
                    />
                    <div className="pl-3"></div>
                  </div>
                ))}
                <div className="pl-3">
                  <Button
                    type="button"
                    kind="primary"
                    title=""
                    width={50}
                    height={50}
                    startEnhancer={() => (
                      <AddIcon className="mt-2 ml-2" size={25}></AddIcon>
                    )}
                    onClick={handleFacilityAddFields}
                  />
                </div>
              </div>
              <div className="space-y-4"></div>
            </div>
          </div>
          <div className="pt-6">
            <div className="flex">
              <div>
                <label htmlFor="lastName" className="text-black text-xl">
                  Options
                </label>
              </div>
              <div>
                <div className="pl-3">
                  <Button
                    type="button"
                    kind="primary"
                    title=""
                    width={25}
                    height={25}
                    startEnhancer={() => (
                      <AddIcon className="mt-2 ml-2" size={25}></AddIcon>
                    )}
                    onClick={handleOptionsAddField}
                  />
                </div>
              </div>
            </div>
            <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-800"></hr>
            {optionsFields.map((inputField, index, optionsArr) => (
              <div key={index}>
                <div className="flex gap-5">
                  <div className="space-y-4 flex-1">
                    <label htmlFor="category" className="text-black text-sm">
                      Category
                    </label>
                    <TextInput
                      name="category"
                      value={inputField.category}
                      onChange={(event) =>
                        handleOptionsFieldChangeInput(index, event, 'category')
                      }
                    />
                    <div className="space-y-4"></div>
                  </div>
                  <div className="space-y-4 flex-1">
                    <label htmlFor="billingType" className="text-black text-sm">
                      Billing Type
                    </label>
                    <TextInput
                      name="billingType"
                      value={inputField.billingType}
                      onChange={(event) =>
                        handleOptionsFieldChangeInput(
                          index,
                          event,
                          'billingType',
                        )
                      }
                    />
                    <div className="space-y-4"></div>
                  </div>
                  <div className="space-y-4 flex-1">
                    <label
                      htmlFor="hospitalPricing"
                      className="text-black text-sm"
                    >
                      Hospital Pricing
                    </label>
                    <TextInput
                      name="hospitalPricing"
                      value={inputField.hospitalPricing}
                      onChange={(event) =>
                        handleOptionsFieldChangeInput(
                          index,
                          event,
                          'hospitalPricing',
                        )
                      }
                      required
                    />
                    <div className="space-y-4"></div>
                  </div>
                  <div className="space-y-4 flex-1">
                    <label
                      htmlFor="professionalPricing"
                      className="text-black text-sm"
                    >
                      Professional Pricing
                    </label>
                    <TextInput
                      name="professionalPricing"
                      value={inputField.professionalPricing}
                      onChange={(event) =>
                        handleOptionsFieldChangeInput(
                          index,
                          event,
                          'professionalPricing',
                        )
                      }
                      required
                    />
                    <div className="space-y-4"></div>
                  </div>
                  <div className="space-y-4 flex-1">
                    <label htmlFor="urlEmbed" className="text-black text-sm">
                      Options
                    </label>
                    <Select
                      required
                      creatable
                      multi
                      value={inputField.option.map((ele) => ({
                        id: ele,
                        label: ele,
                      }))}
                      onChange={(event) =>
                        handleOptionsFieldChangeInput(
                          index,
                          event.value,
                          'option',
                        )
                      }
                      placeholder=""
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
                  {optionsArr.length > 1 && (
                    <div className="text-right text-base mt-10">
                      <Button
                        type="button"
                        kind="tertiary"
                        title="Remove"
                        width={100}
                        style={{
                          backgroundColor: 'red',
                          color: 'white',
                        }}
                        onClick={() => handleOptionsFields(index)}
                      />
                    </div>
                  )}
                </div>
                <div className="pl-3"></div>
              </div>
            ))}
          </div>
          <div className="pt-6">
            <div className="flex">
              <div>
                <label htmlFor="lastName" className="text-black text-xl">
                  Checklist
                </label>
              </div>
              <div>
                <div className="pl-3">
                  <Button
                    type="button"
                    kind="primary"
                    title=""
                    width={25}
                    height={25}
                    startEnhancer={() => (
                      <AddIcon className="mt-2 ml-2" size={25}></AddIcon>
                    )}
                    onClick={handleChecklistAddFields}
                  />
                </div>
              </div>
            </div>
            <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-800"></hr>
            <div className="flex gap-5">
              <div className="space-y-4 flex-1">
                <label htmlFor="email" className="text-black text-sm">
                  Name
                </label>
                <div className="flex flex-row">
                  {checkListInputFields.map(
                    (inputField, index, checkListArr) => (
                      <div key={index}>
                        <TextInput
                          type="text"
                          value={inputField.value}
                          onChange={(event) =>
                            handleChecklistChangeInput(index, event)
                          }
                          endEnhancer={
                            checkListArr.length > 1 ? (
                              <div
                                className="rounded-md cursor-pointer items-center pl-3"
                                onClick={() =>
                                  handleChecklistRemoveFields(index)
                                }
                              >
                                <CloseIcon className="" size={10} />
                              </div>
                            ) : null
                          }
                        />
                        <div className="pl-3"></div>
                      </div>
                    ),
                  )}
                </div>
                <div className="space-y-4"></div>
              </div>
            </div>
          </div>
          <div className="text-right text-base mt-6 flex justify-end pr-5">
            <div>
              <Button
                type="button"
                kind="tertiary"
                title="Cancel"
                onClick={onClose}
                width={189}
                style={{
                  backgroundColor: 'rgba(212, 212, 216, 1)',
                  color: 'black',
                }}
              />
            </div>
            <div className="pl-3">
              <Button type="submit" kind="primary" title="Save" width={189} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModularField;
