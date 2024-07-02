// import { CreateInsuranceTypeInterface } from '@packages/entities';
import Button from '@root/components/Button';
import { AddIcon, CloseIcon } from '@root/components/Icons';
// import RequiredIndicator from '@root/components/RequiredIndicator';
import TextInput from '@root/components/TextInput';
// import { SHAPE } from 'baseui/button';
// import { Checkbox } from 'baseui/checkbox';
import { SIZE } from 'baseui/input';
// import { Select } from 'baseui/select';
// import { useAppDispatch } from '@root/store';
// import { addRecordAsync } from '@root/store/reducers/insuranceTypes';
// import { getPracticeId } from '@utils/index';
import React, { useState } from 'react';

const Checklist: React.FC<{ props }> = ({ props }) => {
  const { checkListInputFields, setCheckListInputFields } = props;
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

  return (
    <div>
      {errorMessage && (
        <div className="flex justify-center text-red-500 mt-2">
          {errorMessage}
        </div>
      )}
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
                  <AddIcon className="mt-[0.1rem] ml-2" size={25}></AddIcon>
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
    </div>
  );
};

export default Checklist;
