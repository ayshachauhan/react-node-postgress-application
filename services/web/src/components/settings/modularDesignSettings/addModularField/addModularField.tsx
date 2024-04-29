import Button from '@root/components/Button';
import { AddIcon } from '@root/components/Icons';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
import { addAllSurgeryTypeDetailsAsync } from '@root/store/reducers/surgeryTypes';
import { getPracticeId } from '@utils/index';
import { Select } from 'baseui/select';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const AddModularField: React.FC<{ onClose: () => void; items }> = ({
  onClose,
  items,
}) => {
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const router = useRouter();

  const { surgeryTypesList } = items;

  const surgeryTypeOptions = Object.keys(surgeryTypesList).map((key) => ({
    label: surgeryTypesList[key].type,
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
  // const handleRemoveFields = (index) => {
  //   const values = [...bodyPartInputFields];
  //   values.splice(index, 1);
  //   setBodyPartInputFields(values);
  // };

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

  // const handleFacilityField = (index) => {
  //   const values = [...facilityInputFields];
  //   values.splice(index, 1);
  //   setFacilityInputFields(values);
  // };

  const [optionsFields, setOptionsFields] = useState([
    {
      category: '',
      billingType: '',
      hospitalPricing: '',
      professionalPricing: '',
      option: [],
    },
  ]);
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
        hospitalPricing: '',
        professionalPricing: '',
        option: [],
      },
    ]);
  };
  // const handleOptionsFields = (index) => {
  //   const values = [...optionsFields];
  //   values.splice(index, 1);
  //   setOptionsFields(values);
  // };

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
  // const handleChecklistFields = (index) => {
  //   const values = [...checkListInputFields];
  //   values.splice(index, 1);
  //   setCheckListInputFields(values);
  // };

  const [surgeryName, setSurgeryName] = useState<string>('');
  const [surgeryTypeId, setSurgeryTypeId] = useState('');

  const handleSurgeryTypeChange = ({ value }) => {
    setSurgeryTypeId(value[0] ? value[0].id : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (practiceId) {
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

    const payload = {
      practiceId,
      id: surgeryTypeId,
      name: surgeryName,
      bodyPart: bodyPartInputFields.map((ele) => ele.value),
      facility: facilityInputFields.map((ele) => ele.value),
      options: surgeryOptionObj,
      checklist: checkListObj,
    };

    dispatch(addAllSurgeryTypeDetailsAsync(payload));

    try {
      setSurgeryName('');
      onClose();
    } catch (error) {
      onClose();
    }
    // }

    router.refresh();
    onClose();
  };

  return (
    <div>
      <div className="px-6 border-border-l border-b border-gray-100 pb-6">
        <form onSubmit={handleSubmit}>
          <div className="flex mt-8 pb-5 border-b border-gray-100">
            <div className="text-xl font-bold text-black w-full">
              Add Modular Field
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
          </div>

          <div className="flex flex-col gap-5 mt-4">
            <div className="space-y-4 flex-1">
              <label htmlFor="bodyPart" className="text-black text-sm">
                Body Part
              </label>
              <div className="flex flex-row">
                {bodyPartInputFields.map((inputField, index) => (
                  <div key={index}>
                    <TextInput
                      type="text"
                      value={inputField.value}
                      onChange={(event) => handleChangeInput(index, event)}
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
                {facilityInputFields.map((inputField, index) => (
                  <div key={index}>
                    <TextInput
                      type="text"
                      value={inputField.value}
                      onChange={(event) =>
                        handleFacilityChangeInput(index, event)
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
            {optionsFields.map((inputField, index) => (
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
                    />
                  </div>
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
                  {checkListInputFields.map((inputField, index) => (
                    <div key={index}>
                      <TextInput
                        type="text"
                        value={inputField.value}
                        onChange={(event) =>
                          handleChecklistChangeInput(index, event)
                        }
                      />
                      <div className="pl-3"></div>
                    </div>
                  ))}
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

export default AddModularField;
