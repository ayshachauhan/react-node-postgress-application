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
import RequiredIndicator from '../RequiredIndicator';

const AddTemplateForm: React.FC<{
  onClose: () => void;
  withLoader: (func: () => Promise<void>) => Promise<void>;
  showDateOffsetControl: (v: string) => boolean;
}> = ({ onClose, withLoader, showDateOffsetControl }) => {
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
  const [showDateOffsetField, setShowDateOffsetField] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const templates = useAppSelector(
    (state) => Object.values(state.templates.entities) || [],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const surgeryName = surgeryConfigurationOptions?.find(
      (s) => s?.id === surgeryConfigurationId,
    )?.label;
    const isBookingTemplateExist = templates.find(
      (t) => t?.surgeryConfigurationName === surgeryName,
    )?.booking?.length;
    if (
      isBookingTemplateExist &&
      messageType === TemplateMessageType.BOOKING.toUpperCase()
    ) {
      setErrorMessage('Booking template already created for this surgery');
      return;
    }
    console.log({ surgeryName });
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
        await withLoader(async () => {
          await dispatch(addRecordAsync(data));
        });
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
    setShowDateOffsetField(showDateOffsetControl(value[0].label));
    setMsgType(value[0] ? value[0].label : null);
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchSurgeryConfigurations({ practiceId }));
    }
  }, [practiceId, dispatch]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {errorMessage && (
            <div className="flex justify-center text-red-700">
              {errorMessage}
            </div>
          )}
          <label htmlFor="title" className="text-black text-sm font-normal">
            <RequiredIndicator />
            &nbsp;Surgery
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
            <RequiredIndicator />
            &nbsp;Message Type
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
        {showDateOffsetField ? (
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
        ) : null}
        <div className="text-right text-base mt-4">
          <Button kind="primary" title="Add New Template" width={189} />
        </div>
      </form>
    </div>
  );
};

export default AddTemplateForm;
