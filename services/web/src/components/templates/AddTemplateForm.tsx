import {
  ITemplateRequest,
  TemplateMessageType,
} from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchListings as fetchSurgeryConfigurations } from '@root/store/reducers/surgeryConfigurations';
import { addRecordAsync } from '@root/store/reducers/templates';
import { getPracticeId } from '@utils/index';
import { Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';

const AddTemplateForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const templateMessageTypeOptions = Object.keys(TemplateMessageType).map(
    (key) => ({
      label: key,
      id: TemplateMessageType[key as keyof typeof TemplateMessageType],
    }),
  );
  const practiceId = getPracticeId();
  const userInfo = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const surgeryConfigurations = useAppSelector(
    (state) => state.surgeryConfigurations.entities,
  );

  const surgeryConfigurationOptions = Object.keys(surgeryConfigurations).map(
    (key) => ({
      label: surgeryConfigurations[key].name,
      id: surgeryConfigurations[key].id,
    }),
  );
  const [surgeryConfigurationId, setSurgeryConfigurationId] = useState('');
  const [messageType, setMsgType] = useState('');
  const [dateOffset, setDateOffset] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId && userInfo) {
      const data: ITemplateRequest = {
        practiceId,
        userId: userInfo.id,
        active: true,
        dateOffset,
        messageType,
        surgeryConfigurationId,
      };
      try {
        dispatch(addRecordAsync(data));
        setDateOffset(0);
        setMsgType('');
        setSurgeryConfigurationId('');
        onClose();
      } catch (error) {
        onClose();
      }
    }
  };
  const handleSurgeryConfigurationChange = ({ value }) => {
    setSurgeryConfigurationId(value[0] ? value[0].id : null);
  };

  const handleInputChange = (value: string) => {
    const inputValue = Number(value);
    setDateOffset(inputValue);
  };

  const handleMsgTypeChange = ({ value }) => {
    setMsgType(value[0] ? value[0].label : null);
  };

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchSurgeryConfigurations({ practiceId }));
    }
  }, [practiceId, dispatch]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <label htmlFor="title" className="text-black text-sm font-normal">
            Surgery
          </label>
          <Select
            options={surgeryConfigurationOptions}
            onChange={handleSurgeryConfigurationChange}
            value={
              surgeryConfigurationId
                ? [
                    {
                      label: surgeryConfigurationId,
                      id: surgeryConfigurationId,
                    },
                  ]
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
        <div className="space-y-4">
          <label
            htmlFor="messageType"
            className="text-black text-sm font-normal"
          >
            Message Type
          </label>
          <Select
            options={templateMessageTypeOptions}
            onChange={handleMsgTypeChange}
            value={messageType ? [{ label: messageType, id: messageType }] : []}
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
        <div className="space-y-4">
          <label
            htmlFor="dateOffset"
            className="text-black text-sm font-normal"
          >
            Date Offset
          </label>
          <TextInput
            name="dateOffset"
            type="number"
            value={dateOffset.toString()}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="text-right text-base mt-4">
          <Button kind="primary" title="Add New Template" width={189} />
        </div>
      </form>
    </div>
  );
};

export default AddTemplateForm;
