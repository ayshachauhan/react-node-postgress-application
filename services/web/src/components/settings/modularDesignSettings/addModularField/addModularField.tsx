import { CreateSurgeryConfigurationPayload } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import { AddIcon, CloseIcon } from '@root/components/Icons';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addRecordAsync } from '@root/store/reducers/surgeryConfigurations';
import { DEFAULT_SURGERYNAME_COLOR } from '@root/utils/constants';
import { getPracticeId } from '@utils/index';
import { SHAPE } from 'baseui/button';
import { SIZE, Select } from 'baseui/select';
// import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const AddModularField: React.FC<{ onClose: () => void; items }> = ({
  onClose,
  items,
}) => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  // const router = useRouter();

  const { surgeryTypesList } = items;

  const surgeryTypeOptions = Object.keys(surgeryTypesList).map((key) => ({
    label: surgeryTypesList[key].name,
    id: surgeryTypesList[key].id,
  }));

  const [bodyPartInputFields, setBodyPartInputFields] = useState([
    { value: '' },
  ]);

  const handleChangeInput = (index: number, event: string) => {
    const values = [...bodyPartInputFields];
    values[index].value = event;
    setBodyPartInputFields(values);
  };
  const handleAddFields = () => {
    setBodyPartInputFields([...bodyPartInputFields, { value: '' }]);
  };
  const handleRemoveFields = (index: number) => {
    const values = [...bodyPartInputFields];
    values.splice(index, 1);
    setBodyPartInputFields(values);
  };

  const [facilityInputFields, setFacilityInputFields] = useState([
    { value: '' },
  ]);
  const handleFacilityChangeInput = (index: number, event: string) => {
    const values = [...facilityInputFields];
    values[index].value = event;
    setFacilityInputFields(values);
  };
  const handleFacilityAddFields = () => {
    setFacilityInputFields([...facilityInputFields, { value: '' }]);
  };

  const handleFacilityRemoveField = (index: number) => {
    const values = [...facilityInputFields];
    values.splice(index, 1);
    setFacilityInputFields(values);
  };

  const [optionsFields, setOptionsFields] = useState([
    {
      category: '',
      count: 0,
      options: [
        {
          billingType: '',
          hospitalPricing: '',
          professionalPricing: '',
          name: '',
        },
      ],
    },
  ]);
  const handleOptionsFieldChangeInput = (
    index: number,
    event: string,
    key: string,
    optionIndex?: number,
  ) => {
    const values = [...optionsFields];
    if (key === 'category') {
      values[index][key] = event;
    } else {
      if (typeof optionIndex === 'number')
        values[index].options[optionIndex][key] = event;
    }

    setOptionsFields(values);
  };

  const handleOptionsAddField = (index: number) => {
    const values = [...optionsFields];

    values[index].options.push({
      billingType: '',
      hospitalPricing: '',
      professionalPricing: '',
      name: '',
    });

    setOptionsFields(values);
  };

  const handleOptionsRemoveFields = (index: number, optionIndex: number) => {
    const values = [...optionsFields];
    values[index].options.splice(optionIndex, 1);
    setOptionsFields(values);
  };

  const handleAddOptionCategory = () => {
    setOptionsFields([
      ...optionsFields,

      {
        category: '',
        count: 0,

        options: [
          {
            billingType: '',
            hospitalPricing: '',
            professionalPricing: '',
            name: '',
          },
        ],
      },
    ]);
  };
  const handleOptionsCategoryRemoveFields = (index) => {
    const values = [...optionsFields];
    values.splice(index, 1);
    setOptionsFields(values);
  };

  const [checkListInputFields, setCheckListInputFields] = useState([
    { value: '' },
  ]);
  const handleChecklistChangeInput = (index: number, event: string) => {
    const values = [...checkListInputFields];
    values[index].value = event;
    setCheckListInputFields(values);
  };
  const handleChecklistAddFields = () => {
    setCheckListInputFields([...checkListInputFields, { value: '' }]);
  };
  const handleChecklistRemoveFields = (index: number) => {
    const values = [...checkListInputFields];
    values.splice(index, 1);
    setCheckListInputFields(values);
  };

  const [surgeryName, setSurgeryName] = useState<string>('');
  const [surgeryTypeId, setSurgeryTypeId] = useState('');
  const [surgeryNameColor, setSurgeryNameColor] = useState<string>(
    DEFAULT_SURGERYNAME_COLOR,
  );

  const handleSurgeryTypeChange = ({ value }) => {
    setSurgeryTypeId(value[0] ? value[0].id : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const surgeryOptionObj = {};
    const checkListObj = {};

    optionsFields.forEach((optionField) => {
      surgeryOptionObj[optionField.category] = {
        type: 'string',
        label: optionField.category,
        default: '',
        required: true,
        allowedValues: optionField.options,
        count: optionField.count,
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

      dispatch(addRecordAsync({ payloadData, practiceId }));
    }

    try {
      setSurgeryName('');
      onClose();
    } catch (error) {
      onClose();
    }

    onClose();
  };

  return (
    <div>
      <div className="px-6 border-border-l border-b border-gray-100 pb-6">
        <form onSubmit={handleSubmit}>
          <div className="flex mt-5  pb-3 border-b border-gray-100">
            <div className="text-xl font-bold text-black w-full">
              Add Modular Field
            </div>
          </div>
          <div className="flex gap-5 mt-4">
            <div className="space-y-2 flex-1">
              <label htmlFor="surgeryName" className="text-black text-sm">
                Surgery Type
              </label>
              <Select
                size={SIZE.mini}
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
            </div>
            <div className="space-y-2 flex-2">
              <label htmlFor="surgeryName" className="text-black text-sm">
                Surgery Name
              </label>
              <TextInput
                size={SIZE.mini}
                name="surgeryName"
                value={surgeryName}
                onChange={(value) => {
                  setSurgeryName(value);
                }}
                required
              />
            </div>
            <div className="space-y-2 flex-2">
              <label htmlFor="surgeryName" className="text-black text-sm">
                Surgery Name Color
              </label>
              <div className="d-block">
                <input
                  type="color"
                  required={true}
                  id="primary_color"
                  value={surgeryNameColor}
                  onChange={(e) => setSurgeryNameColor(e.target.value)}
                  style={{
                    height: '30px',
                    width: '30px',
                    border: 'none',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-4">
            <div className="space-y-2 flex-1">
              <label htmlFor="bodyPart" className="text-black text-sm">
                Body Part
              </label>
              <div className="flex flex-row gap-3">
                {bodyPartInputFields.map((inputField, index, arr) => (
                  <div key={index}>
                    <TextInput
                      size={SIZE.mini}
                      type="text"
                      value={inputField.value}
                      onChange={(event) => handleChangeInput(index, event)}
                      endEnhancer={
                        arr.length > 1 ? (
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
                    width={30}
                    height={30}
                    startEnhancer={() => (
                      <AddIcon className="mt-2 ml-2" size={25}></AddIcon>
                    )}
                    onClick={handleAddFields}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <label htmlFor="facility" className="text-black text-sm">
                Facility
              </label>
              <div className="flex flex-row gap-3">
                {facilityInputFields.map((inputField, index, arr) => (
                  <div key={index}>
                    <TextInput
                      size={SIZE.mini}
                      type="text"
                      value={inputField.value}
                      onChange={(event) =>
                        handleFacilityChangeInput(index, event)
                      }
                      endEnhancer={
                        arr.length > 1 ? (
                          <div
                            className="rounded-md cursor-pointer items-center pl-3"
                            onClick={() => handleFacilityRemoveField(index)}
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
                    width={30}
                    height={30}
                    startEnhancer={() => (
                      <AddIcon className="mt-2 ml-2" size={25}></AddIcon>
                    )}
                    onClick={handleFacilityAddFields}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex">
              <div>
                <label htmlFor="options" className="text-black text-lg">
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
                    onClick={handleAddOptionCategory}
                  />
                </div>
              </div>
            </div>
            <hr className="h-px bg-gray-100 border-1 dark:bg-gray-800"></hr>
            {optionsFields.map((optionField, index, arr) => (
              <div
                key={index}
                className="border 1px rounded-xl mb-2  bg-green-50"
              >
                <div className="flex flex-col gap-5 m-2">
                  <div className="space-y-2 ">
                    <div className="flex flex-row justify-between">
                      <div>
                        <label
                          htmlFor="category"
                          className="text-black text-sm"
                        >
                          Category
                        </label>
                      </div>
                      <div>
                        {arr.length > 1 && (
                          <div className="">
                            <Button
                              type="button"
                              kind="tertiary"
                              title=""
                              width={30}
                              height={30}
                              shape={SHAPE.circle}
                              style={{
                                backgroundColor: 'white',
                                color: 'black',
                                border: 'black',
                              }}
                              startEnhancer={() => (
                                <CloseIcon
                                  className="mt-2 ml-2 pb-2"
                                  size={20}
                                ></CloseIcon>
                              )}
                              onClick={() =>
                                handleOptionsCategoryRemoveFields(index)
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 w-1/4 ">
                      <TextInput
                        size={SIZE.mini}
                        name="category"
                        value={optionField.category}
                        onChange={(event) =>
                          handleOptionsFieldChangeInput(
                            index,
                            event,
                            'category',
                          )
                        }
                      />
                    </div>
                  </div>
                  {optionField.options.length
                    ? optionField.options.map((inputField, inputIndex) => {
                        return (
                          <div
                            key={inputIndex}
                            className=" flex flex-row gap-5 items-center"
                          >
                            <div className="space-y-2 flex-1">
                              <label
                                htmlFor="urlEmbed"
                                className="text-black text-sm"
                              >
                                Option
                              </label>
                              <TextInput
                                size={SIZE.mini}
                                required
                                value={inputField.name}
                                onChange={(event) =>
                                  handleOptionsFieldChangeInput(
                                    index,
                                    event,
                                    'name',
                                    inputIndex,
                                  )
                                }
                              />
                              <div className="space-y-2"></div>
                            </div>
                            <div className="space-y-2 flex-1">
                              <label
                                htmlFor="billingType"
                                className="text-black text-sm"
                              >
                                Billing Type
                              </label>
                              <TextInput
                                size={SIZE.mini}
                                name="billingType"
                                value={inputField.billingType}
                                onChange={(event) =>
                                  handleOptionsFieldChangeInput(
                                    index,
                                    event,
                                    'billingType',
                                    inputIndex,
                                  )
                                }
                              />
                              <div className="space-y-2"></div>
                            </div>
                            <div className="space-y-2 flex-1">
                              <label
                                htmlFor="hospitalPricing"
                                className="text-black text-sm"
                              >
                                Hospital Pricing
                              </label>
                              <TextInput
                                type="number"
                                size={SIZE.mini}
                                name="hospitalPricing"
                                value={inputField.hospitalPricing}
                                onChange={(event) =>
                                  handleOptionsFieldChangeInput(
                                    index,
                                    event,
                                    'hospitalPricing',
                                    inputIndex,
                                  )
                                }
                                required
                              />
                              <div className="space-y-2"></div>
                            </div>
                            <div className="space-y-2 flex-1">
                              <label
                                htmlFor="professionalPricing"
                                className="text-black text-sm"
                              >
                                Professional Pricing
                              </label>
                              <TextInput
                                size={SIZE.mini}
                                type="number"
                                name="professionalPricing"
                                value={inputField.professionalPricing}
                                onChange={(event) =>
                                  handleOptionsFieldChangeInput(
                                    index,
                                    event,
                                    'professionalPricing',
                                    inputIndex,
                                  )
                                }
                                required
                              />
                              <div className="space-y-2"></div>
                            </div>

                            <div className="flex flex-row gap-2">
                              {' '}
                              <div className="text-right text-base mt-8">
                                <Button
                                  type="button"
                                  kind="primary"
                                  title=""
                                  width={30}
                                  height={30}
                                  startEnhancer={() => (
                                    <AddIcon
                                      className="mt-2 ml-2"
                                      size={25}
                                    ></AddIcon>
                                  )}
                                  onClick={() => handleOptionsAddField(index)}
                                />
                              </div>
                              {optionField.options.length > 1 && (
                                <div className="text-right text-sm mt-8">
                                  <Button
                                    type="button"
                                    kind="tertiary"
                                    title=""
                                    width={30}
                                    height={30}
                                    shape={SHAPE.circle}
                                    style={{
                                      backgroundColor: 'white',
                                      color: 'black',
                                      border: 'black',
                                    }}
                                    startEnhancer={() => (
                                      <CloseIcon
                                        className="mt-2 ml-2 pb-2"
                                        size={20}
                                      ></CloseIcon>
                                    )}
                                    onClick={() =>
                                      handleOptionsRemoveFields(
                                        index,
                                        inputIndex,
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-6">
            <div className="flex">
              <div>
                <label htmlFor="lastName" className="text-black text-lg">
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
            <hr className="h-px bg-gray-100 border-1 dark:bg-gray-800"></hr>
            <div className="flex gap-5">
              <div className="space-y-2 flex-1">
                <label htmlFor="email" className="text-black text-sm mt-2">
                  Name
                </label>
                <div className="flex flex-row gap-3">
                  {checkListInputFields.map((inputField, index, arr) => (
                    <div key={index}>
                      <TextInput
                        size={SIZE.mini}
                        type="text"
                        value={inputField.value}
                        onChange={(event) =>
                          handleChecklistChangeInput(index, event)
                        }
                        endEnhancer={
                          arr.length > 1 ? (
                            <div
                              className="rounded-md cursor-pointer items-center pl-3"
                              onClick={() => handleChecklistRemoveFields(index)}
                            >
                              <CloseIcon className="" size={10} />
                            </div>
                          ) : null
                        }
                      />
                    </div>
                  ))}
                </div>
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

export default AddModularField;
