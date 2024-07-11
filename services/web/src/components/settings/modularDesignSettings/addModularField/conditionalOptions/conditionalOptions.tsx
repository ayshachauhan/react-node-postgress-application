import { DependantOption } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import { AddIcon, CloseIcon } from '@root/components/Icons';
import TextInput from '@root/components/TextInput';
import { SHAPE } from 'baseui/button';
import { Checkbox } from 'baseui/checkbox';
import { SIZE } from 'baseui/input';
import { Select } from 'baseui/select';
import React from 'react';

export type CustomConditionalOption = {
  label: string;
  dependsUpon: string | null;
  dependencies: DependantOption[];
  count: number;
  values: string[];
  editAdminOption: boolean;
  isDependant?: boolean;
};

const ConditionalOptions: React.FC<{ props }> = ({ props }) => {
  const { conditionalOptions, setConditionalOptions } = props;
  const handleDependantUponCheckbox = (index: number) => {
    const updatedValue: boolean = !conditionalOptions[index].isDependant;
    handleConditionalOptionChange(index, 'isDependant', updatedValue);
  };

  const handleAddOptionsValues = (index: number, event) => {
    const value: string = event.option.id;
    let updatedValues: string[] = conditionalOptions[index].values;

    if (event.type == 'remove') {
      updatedValues = updatedValues.filter((ele) => value !== ele);
    } else {
      updatedValues = [...updatedValues, value];
    }

    handleConditionalOptionChange(index, 'values', updatedValues);
  };

  const handleAddConditionalOption = () => {
    const newConditionalOptions = [
      ...conditionalOptions,
      {
        label: '',
        dependsUpon: null,
        dependencies: [{ key: '', values: [] }],
        count: 1,
        values: [],
        editAdminOption: false,
        isDependant: false,
      },
    ];

    setConditionalOptions([...newConditionalOptions]);
  };

  const handleRemoveConditionalOptions = (index: number) => {
    const values = [...conditionalOptions];
    values.splice(index, 1);
    setConditionalOptions(values);
  };

  const handleConditionalOptionChange = (index: number, key: string, value) => {
    const values = [...conditionalOptions];
    values[index][key] = value;

    setConditionalOptions(values);
  };

  const handleDependantOptionKeyChange = (
    conditionalOptionIndex: number,
    dependencyIndex: number,
    value,
  ) => {
    const values = [...conditionalOptions[conditionalOptionIndex].dependencies];
    values[dependencyIndex] = { ...values[dependencyIndex], key: value };

    handleConditionalOptionChange(
      conditionalOptionIndex,
      'dependencies',
      values,
    );
  };

  const handleAddDependencies = (index: number) => {
    const newDependencies = [
      ...conditionalOptions[index].dependencies,
      { key: '', values: [] },
    ];
    handleConditionalOptionChange(index, 'dependencies', newDependencies);
  };

  const handleRemoveDependencies = (
    conditionalOptionIndex: number,
    dependencyIndex: number,
  ) => {
    const values = [...conditionalOptions[conditionalOptionIndex].dependencies];
    values.splice(dependencyIndex, 1);
    handleConditionalOptionChange(
      conditionalOptionIndex,
      'dependencies',
      values,
    );
  };

  const handleDependantValueChange = (
    conditionalOptionIndex: number,
    dependencyIndex: number,
    event,
  ) => {
    const value: string = event.option.id;
    const allDependencies = [
      ...conditionalOptions[conditionalOptionIndex].dependencies,
    ];
    let dependencyValuesToUpdate = allDependencies[dependencyIndex].values;

    if (event.type == 'remove') {
      dependencyValuesToUpdate = dependencyValuesToUpdate.filter(
        (ele) => value !== ele,
      );
    } else {
      dependencyValuesToUpdate = [...dependencyValuesToUpdate, value];
    }

    allDependencies[dependencyIndex] = {
      ...allDependencies[dependencyIndex],
      values: dependencyValuesToUpdate,
    };

    handleConditionalOptionChange(
      conditionalOptionIndex,
      'dependencies',
      allDependencies,
    );
  };

  return (
    <div>
      <div className="mt-4">
        <div className="flex">
          <div>
            <label htmlFor="options" className="text-black text-lg">
              Conditional Options
            </label>
          </div>
          {conditionalOptions.length == 1 && (
            <div className="pl-3">
              <Button
                type="button"
                kind="primary"
                title=""
                width={25}
                height={25}
                startEnhancer={() => <AddIcon className="ml-[7.5px]"></AddIcon>}
                onClick={handleAddConditionalOption}
              />
            </div>
          )}
        </div>
        <hr className="h-px bg-gray-100 border-1 dark:bg-gray-800 my-2"></hr>
        {conditionalOptions.map(
          (
            conditionalOption: CustomConditionalOption,
            conditionalOptionIndex: number,
          ) => {
            const {
              values,
              label: name,
              count,
              editAdminOption: adminPermission,
              dependsUpon,
              isDependant,
              dependencies,
            } = conditionalOption;

            const dependantConditionOption: CustomConditionalOption | null =
              dependsUpon
                ? conditionalOptions.find((ele) => ele.label == dependsUpon)
                : null;

            const showDependencyAddButton: boolean | null =
              dependantConditionOption &&
              dependencies.length < dependantConditionOption.values.length
                ? true
                : false;

            return (
              <div
                className="border 1px rounded-xl mb-2  bg-green-50"
                key={conditionalOptionIndex}
              >
                <div className="flex flex-col gap-5 m-2">
                  <div className="space-y-2 ">
                    <div className="flex justify-between">
                      <div className="flex flex-row gap-4 items-end w-max">
                        <div className="space-y-1">
                          <label htmlFor="category" className="">
                            Name
                          </label>
                          <TextInput
                            size={SIZE.mini}
                            name="name"
                            value={name}
                            onChange={(event) =>
                              handleConditionalOptionChange(
                                conditionalOptionIndex,
                                'label',
                                event,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-1 min-w-40 max-w-1/2">
                          <label htmlFor="category" className="">
                            Values
                          </label>
                          <Select
                            required={name ? true : false}
                            creatable
                            clearable
                            multi
                            size={SIZE.mini}
                            value={values.map((ele) => ({
                              id: ele,
                              label: ele,
                            }))}
                            onChange={(event) =>
                              handleAddOptionsValues(
                                conditionalOptionIndex,
                                event,
                              )
                            }
                            placeholder="Select Value"
                            overrides={{
                              ControlContainer: {
                                style: {
                                  backgroundColor: 'rgba(250, 250, 250, 1)',
                                  border: 'none',
                                  color: 'rgba(82, 82, 91, 1)',
                                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                },
                              },
                              Tag: {
                                props: {
                                  overrides: {
                                    Root: {
                                      style: {
                                        borderRadius: '8px',
                                        backgroundColor: 'teal',
                                      },
                                    },
                                  },
                                },
                              },
                              Placeholder: {
                                style: { color: '#666' },
                              },
                              ClearIcon: {
                                component: () => null,
                              },
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="count" className="">
                            Count
                          </label>
                          <div className="flex gap-3.5 items-center">
                            <TextInput
                              type="number"
                              min={1}
                              max={3}
                              size={SIZE.mini}
                              name="count"
                              value={count}
                              onChange={(event) =>
                                handleConditionalOptionChange(
                                  conditionalOptionIndex,
                                  'count',
                                  event,
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-1 flex flex-row  gap-2">
                          <Checkbox
                            name="editAdminOption"
                            //   key={index}
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
                            checked={adminPermission}
                            onChange={() =>
                              handleConditionalOptionChange(
                                conditionalOptionIndex,
                                'editAdminOption',
                                !adminPermission,
                              )
                            }
                          ></Checkbox>
                          <label>Admin permission</label>
                        </div>
                      </div>
                      <div>
                        {conditionalOptions.length > 1 && (
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
                                handleRemoveConditionalOptions(
                                  conditionalOptionIndex,
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 flex flex-row gap-2 items-center">
                    <Checkbox
                      name="dependantUpon"
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
                      checked={isDependant}
                      onChange={() =>
                        handleDependantUponCheckbox(conditionalOptionIndex)
                      }
                    ></Checkbox>
                    <label>Dependent Upon</label>
                  </div>
                  {isDependant && (
                    <>
                      <div className=" flex flex-row gap-5 items-center">
                        <div className="space-y-2 flex-1">
                          <label htmlFor="option" className="">
                            Option
                          </label>
                          <Select
                            required
                            size={SIZE.mini}
                            value={
                              dependsUpon
                                ? [{ id: dependsUpon, label: dependsUpon }]
                                : []
                            }
                            options={conditionalOptions
                              .filter(
                                (ele: CustomConditionalOption) =>
                                  ele.label != name,
                              )
                              .map((ele: CustomConditionalOption) => ({
                                id: ele.label,
                                label: ele.label,
                              }))}
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
                            onChange={({ option }) =>
                              handleConditionalOptionChange(
                                conditionalOptionIndex,
                                'dependsUpon',
                                option?.id,
                              )
                            }
                          />
                        </div>
                      </div>
                      {dependsUpon && (
                        <div>
                          <div className="flex flex-row gap-5 items-center">
                            <div className="space-y-1 w-1/5">
                              <label htmlFor="category" className="">
                                Key Values
                              </label>
                            </div>
                            <div className="space-y-1 w-1/5">
                              <label htmlFor="category" className="">
                                Dependent Values
                              </label>
                            </div>
                            {showDependencyAddButton && (
                              <div className="text-right text-base">
                                <Button
                                  type="button"
                                  kind="primary"
                                  title=""
                                  width={20}
                                  height={20}
                                  startEnhancer={() => (
                                    <AddIcon className="ml-[6px]"></AddIcon>
                                  )}
                                  onClick={() =>
                                    handleAddDependencies(
                                      conditionalOptionIndex,
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>
                          {dependencies.length
                            ? dependencies.map(
                                (dependency, dependencyIndex) => {
                                  return (
                                    <div
                                      className="flex flex-row gap-5 mb-2"
                                      key={dependencyIndex}
                                    >
                                      <div className="w-1/5 flex-none">
                                        <Select
                                          required
                                          backspaceClearsInputValue
                                          size={SIZE.mini}
                                          value={
                                            dependency.key
                                              ? [
                                                  {
                                                    id: dependency.key,
                                                    label: dependency.key,
                                                  },
                                                ]
                                              : []
                                          }
                                          options={
                                            dependantConditionOption
                                              ? dependantConditionOption.values.map(
                                                  (ele) => ({
                                                    id: ele,
                                                    label: ele,
                                                  }),
                                                )
                                              : []
                                          }
                                          onChange={({ option }) =>
                                            handleDependantOptionKeyChange(
                                              conditionalOptionIndex,
                                              dependencyIndex,
                                              option?.id,
                                            )
                                          }
                                          placeholder="Keys Value"
                                          overrides={{
                                            ControlContainer: {
                                              style: {
                                                backgroundColor:
                                                  'rgba(250, 250, 250, 1)',
                                                border: 'none',
                                                color: 'rgba(82, 82, 91, 1)',
                                                boxShadow:
                                                  '0 2px 4px rgba(0, 0, 0, 0.1)',
                                              },
                                            },
                                            ClearIcon: {
                                              component: () => null,
                                            },
                                          }}
                                        />
                                      </div>
                                      <div className="flex gap-3 min-w-1/5 max-w-4/5">
                                        <div>
                                          <Select
                                            required
                                            size={SIZE.mini}
                                            value={
                                              dependency?.values?.length
                                                ? dependency.values.map(
                                                    (ele) => ({
                                                      id: ele,
                                                      label: ele,
                                                    }),
                                                  )
                                                : []
                                            }
                                            options={values.map((ele) => ({
                                              id: ele,
                                              label: ele,
                                            }))}
                                            onChange={(event) =>
                                              handleDependantValueChange(
                                                conditionalOptionIndex,
                                                dependencyIndex,
                                                event,
                                              )
                                            }
                                            multi
                                            placeholder="Dependant Value"
                                            overrides={{
                                              ControlContainer: {
                                                style: {
                                                  backgroundColor:
                                                    'rgba(250, 250, 250, 1)',
                                                  border: 'none',
                                                  color: 'rgba(82, 82, 91, 1)',
                                                  boxShadow:
                                                    '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                },
                                              },
                                              Tag: {
                                                props: {
                                                  overrides: {
                                                    Root: {
                                                      style: {
                                                        borderRadius: '8px',
                                                        backgroundColor: 'teal',
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                              ClearIcon: {
                                                component: () => null,
                                              },
                                            }}
                                          />
                                        </div>
                                        {dependencies.length > 1 && (
                                          <div className="text-right text-sm">
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
                                                handleRemoveDependencies(
                                                  conditionalOptionIndex,
                                                  dependencyIndex,
                                                )
                                              }
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                },
                              )
                            : ''}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};

export default ConditionalOptions;
