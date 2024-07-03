// import { CreateInsuranceTypeInterface } from '@packages/entities';
import Button from '@root/components/Button';
import { AddIcon, CloseIcon } from '@root/components/Icons';
// import RequiredIndicator from '@root/components/RequiredIndicator';
import TextInput from '@root/components/TextInput';
import { SIZE } from 'baseui/input';
import React, { useState } from 'react';

const Checklist: React.FC<{ props }> = ({ props }) => {
  const { checkListInputFields, setCheckListInputFields } = props;
  const [errorMessage] = useState('');

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
                startEnhancer={() => <AddIcon className="mr-0"></AddIcon>}
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
