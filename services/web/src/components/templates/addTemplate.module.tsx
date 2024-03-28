import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { Select } from 'baseui/select';
import React, { useState } from 'react';

const TemplateAddPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [surgeryType, setSurgeryType] = useState('');
  const [msgType, setMsgType] = useState('');
  const [dateOffset, setDateOffset] = useState('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose();
  };
  const handleSurgeryTypeChange = ({ value }) => {
    setSurgeryType(value[0] ? value[0].label : null);
  };

  const handleMsgTypeChange = ({ value }) => {
    setMsgType(value[0] ? value[0].label : null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <label htmlFor="title" className="text-black text-sm">
            Surgery Type
          </label>
          <Select
            options={[
              { label: 'cataract', id: '1' },
              { label: 'yag', id: '2' },
              { label: 'lasik', id: '3' },
            ]}
            onChange={handleSurgeryTypeChange}
            value={surgeryType ? [{ label: surgeryType, id: surgeryType }] : []}
            required
            overrides={{
              ControlContainer: {
                style: {
                  backgroundColor: 'rgba(250, 250, 250, 1)',
                  border: 'none',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow CSS here
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
          <label htmlFor="messageType" className="text-black text-sm">
            Message Type
          </label>
          <Select
            options={[
              { label: 'type 1', id: '1' },
              { label: 'type 2', id: '2' },
              { label: 'type 3', id: '3' },
            ]}
            onChange={handleMsgTypeChange}
            value={msgType ? [{ label: msgType, id: msgType }] : []}
            required
            overrides={{
              ControlContainer: {
                style: {
                  backgroundColor: 'rgba(250, 250, 250, 1)',
                  border: 'none',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow CSS here
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
          <label htmlFor="dateOffset" className="text-black text-sm">
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
