// import { CreateInsuranceTypeInterface } from '@packages/entities';
import Button from '@root/components/Button';
import { AddIcon } from '@root/components/Icons';
// import RequiredIndicator from '@root/components/RequiredIndicator';
import TextInput from '@root/components/TextInput';
// import { SHAPE } from 'baseui/button';
import { Checkbox } from 'baseui/checkbox';
import { SIZE } from 'baseui/input';
import { Select } from 'baseui/select';
// import { useAppDispatch } from '@root/store';
// import { addRecordAsync } from '@root/store/reducers/insuranceTypes';
// import { getPracticeId } from '@utils/index';
import React, { useState } from 'react';

const ConditionalOptions: React.FC = () => {
  //   const dispatch = useAppDispatch();
  const [errorMessage] = useState('');
  // const [insuranceType, setInsuranceType] = useState('');
  //   const practiceId = getPracticeId();

  //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     const trimmedInsuranceType = insuranceType.trim();
  //     if (practiceId && trimmedInsuranceType !== '') {
  //       const insuranceTypePayload: CreateInsuranceTypeInterface = {
  //         practiceId,
  //         name: trimmedInsuranceType,
  //       };
  //       try {
  //         dispatch(addRecordAsync(insuranceTypePayload));
  //         onClose();
  //       } catch (error) {
  //         onClose();
  //       }
  //     } else {
  //       setErrorMessage('Insurance type is required.');
  //     }
  //   };

  return (
    <div>
      {errorMessage && (
        <div className="flex justify-center text-red-500 mt-2">
          {errorMessage}
        </div>
      )}
      <div className="mt-4">
        <div className="flex">
          <div>
            <label htmlFor="options" className="text-black text-lg">
              Conditional Options
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
                  <AddIcon className="mt-[0.1rem] ml-2" size={25}></AddIcon>
                )}
                onClick={() => ''}
              />
            </div>
          </div>
        </div>
        <hr className="h-px bg-gray-100 border-1 dark:bg-gray-800"></hr>

        <div className="border 1px rounded-xl mb-2  bg-green-50">
          <div className="flex flex-col gap-5 m-2">
            <div className="space-y-2 ">
              <div className="flex justify-between">
                <div className="flex flex-row gap-5 w-full">
                  <div className="space-y-1">
                    <label htmlFor="category" className="text-black text-sm">
                      Name
                    </label>
                    <TextInput
                      size={SIZE.mini}
                      name="category"
                      value={'optionFie'}
                      onChange={() =>
                        //   handleOptionsFieldChangeInput(
                        //     index,
                        //     event,
                        //     'category',
                        //   )
                        ''
                      }
                    />
                  </div>
                  <div className="space-y-1 w-40">
                    <label htmlFor="category" className="text-black text-sm">
                      Values
                    </label>
                    <Select
                      size={SIZE.mini}
                      //   name="category"
                      value={[{ id: '', label: '' }]}
                      onChange={() =>
                        //   handleOptionsFieldChangeInput(
                        //     index,
                        //     event,
                        //     'category',
                        //   )
                        ''
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
                        ClearIcon: {
                          component: () => null,
                        },
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="count" className="text-black text-sm">
                      Count
                    </label>
                    <div className="flex gap-3.5 items-center">
                      <TextInput
                        type="number"
                        min={1}
                        max={3}
                        size={SIZE.mini}
                        name="count"
                        value={1}
                        onChange={() =>
                          // handleOptionsFieldChangeInput(
                          //   index,
                          //   event,
                          //   'count',
                          // )
                          ''
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1 flex flex-row gap-2 items-end">
                    <Checkbox
                      name="edit_admin_option"
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
                      checked //={optionField.edit_admin_option}
                      onChange={() =>
                        // handleOptionsFieldChangeInput(
                        //   index,
                        //   !optionField.edit_admin_option,
                        //   'edit_admin_option',
                        // )
                        ''
                      }
                    ></Checkbox>
                    <label>Admin permission</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-1 flex flex-row gap-2 items-end">
              <Checkbox
                name="edit_admin_option"
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
                checked //={optionField.edit_admin_option}
                onChange={() =>
                  // handleOptionsFieldChangeInput(
                  //   index,
                  //   !optionField.edit_admin_option,
                  //   'edit_admin_option',
                  // )
                  ''
                }
              ></Checkbox>
              <label>Dependent Upon</label>
            </div>
            {
              <div
                // key={inputIndex}
                className=" flex flex-row gap-5 items-center"
              >
                <div className="space-y-2 flex-1">
                  <label htmlFor="option" className="text-black text-sm">
                    Option
                  </label>
                  <Select
                    size={SIZE.mini}
                    // disabled={
                    //   optionsFields[index].category ? false : true
                    // }
                    // required={
                    //   optionsFields[index].category ? true : false
                    // }
                    value={[]}
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
                    onChange={() =>
                      //   handleOptionsFieldChangeInput(
                      //     index,
                      //     event,
                      //     'name',
                      //     inputIndex,
                      //   )
                      ''
                    }
                  />
                  <div className="space-y-2"></div>
                </div>

                <div className="flex flex-row gap-2">
                  {' '}
                  <div className="text-right text-base mt-8">
                    {/* <Button
                      type="button"
                      kind="primary"
                      title=""
                      width={30}
                      height={30}
                      startEnhancer={() => (
                        <AddIcon
                          className="mt-[0.1rem] ml-2"
                          size={25}
                        ></AddIcon>
                      )}
                      onClick={() => ''}
                    /> */}
                  </div>
                  {/* {
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
                        onClick={() => ''}
                      />
                    </div>
                  } */}
                </div>
              </div>
            }
            <div className="flex flex-row gap-5 items-center">
              <div className="space-y-1 w-1/5">
                <label htmlFor="category" className="text-black text-sm">
                  Key Values
                </label>
                {/* <TextInput
                      size={SIZE.mini}
                      name="category"
                      value={'optionFie'}
                      onChange={(event) =>
                        //   handleOptionsFieldChangeInput(
                        //     index,
                        //     event,
                        //     'category',
                        //   )
                        ''
                      }
                    /> */}
                <Select
                  size={SIZE.mini}
                  //   name="category"
                  value={[{ id: '', label: '' }]}
                  onChange={() =>
                    //   handleOptionsFieldChangeInput(
                    //     index,
                    //     event,
                    //     'category',
                    //   )
                    ''
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
                    ClearIcon: {
                      component: () => null,
                    },
                  }}
                />
              </div>
              <div className="space-y-1 w-1/5">
                <label htmlFor="category" className="text-black text-sm">
                  Dependent Values
                </label>
                <Select
                  size={SIZE.mini}
                  //   name="category"
                  value={[{ id: '', label: '' }]}
                  onChange={() =>
                    //   handleOptionsFieldChangeInput(
                    //     index,
                    //     event,
                    //     'category',
                    //   )
                    ''
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
                    ClearIcon: {
                      component: () => null,
                    },
                  }}
                />
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
                      <AddIcon className="mt-[0.1rem] ml-2" size={25}></AddIcon>
                    )}
                    onClick={() => ''}
                  />
                </div>
                {/* {
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
                        onClick={() => ''}
                      />
                    </div>
                  } */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionalOptions;
