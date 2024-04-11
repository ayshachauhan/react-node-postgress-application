import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { TemplateMessageType } from '@root/enums/templateMessageType.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectPractice, selectRecords } from '@root/store/reducers/auth';
import { fetchSurgeryTypes } from '@root/store/reducers/surgeryTypes';
import { addRecordAsync } from '@root/store/reducers/templates';
import { CreateTemplateResponse } from '@root/store/requests/templates';
import { Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';

const TemplateAddPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const templateMessageTypeOptions = Object.keys(TemplateMessageType).map(
    (key) => ({
      label: key,
      id: TemplateMessageType[key as keyof typeof TemplateMessageType],
    }),
  );
  const practiceId = useAppSelector(selectPractice);
  const userInfo = useAppSelector(selectRecords);
  const dispatch = useAppDispatch();
  const surgeryTypes = useAppSelector(
    (state) => state.surgeryTypes.surgeryTypes,
  );
  const surgeryTypeOptions = Object.keys(surgeryTypes).map((key) => ({
    label: surgeryTypes[key].name,
    id: surgeryTypes[key].id,
  }));
  const [surgeryType, setSurgeryType] = useState('');
  const [messageType, setMsgType] = useState('');
  const [dateOffset, setDateOffset] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId && userInfo) {
      const data: CreateTemplateResponse = {
        practiceId,
        userId: userInfo.id,
        active: true,
        dateOffset,
        messageType,
        surgeryType,
      };
      try {
        dispatch(addRecordAsync(data));
        setDateOffset('0');
        setMsgType('');
        setSurgeryType('');
        onClose();
      } catch (error) {
        onClose();
      }
    }
  };
  const handleSurgeryTypeChange = ({ value }) => {
    setSurgeryType(value[0] ? value[0].id : null);
  };

  const handleMsgTypeChange = ({ value }) => {
    setMsgType(value[0] ? value[0].label : null);
  };

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchSurgeryTypes({ practiceId: practiceId })); // Fetch listings from PostgreSQL database
    }
  }, [practiceId, dispatch]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <label htmlFor="title" className="text-black text-sm font-normal">
            Surgery Type
          </label>
          <Select
            options={surgeryTypeOptions}
            onChange={handleSurgeryTypeChange}
            value={surgeryType ? [{ label: surgeryType, id: surgeryType }] : []}
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
            value={dateOffset}
            onChange={(value) => {
              setDateOffset(value);
            }}
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

export default TemplateAddPage;
