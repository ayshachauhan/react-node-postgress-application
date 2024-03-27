import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { Checkbox, STYLE_TYPE } from 'baseui/checkbox';
import { Textarea } from 'baseui/textarea';
import React, { useState } from 'react';

const TemplateUpdatePage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [subject, setSubject] = useState('');
  const [checkboxes, setCheckboxes] = React.useState([false, false]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <div className="flex gap-5">
        <div className="w-1/2">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <div className="border-b border-gray-100 text-xl font-bold pb-2 text-black">
                Email Message
              </div>
              <div>
                <Checkbox
                  checked={checkboxes[0]}
                  onChange={(e) => {
                    const nextCheckboxes = [...checkboxes];
                    nextCheckboxes[0] = e.currentTarget.checked;
                    setCheckboxes(nextCheckboxes);
                  }}
                  checkmarkType={STYLE_TYPE.toggle_round}
                  overrides={{
                    ToggleTrack: {
                      style: () => ({
                        backgroundColor: '#BBF7D0',
                      }),
                    },
                    Toggle: {
                      style: () => ({
                        backgroundColor: '#16A34A',
                      }),
                    },
                  }}
                ></Checkbox>
              </div>
            </div>
            <div className="flex mt-3 justify-between">
              <div>
                <div className="space-y-2">
                  <label htmlFor="title" className="text-black text-sm">
                    Email Subject
                  </label>
                  <TextInput
                    name="subject"
                    value={subject}
                    onChange={(value) => {
                      setSubject(value);
                    }}
                    required
                  />
                </div>
                <div className="space-y-4"></div>
              </div>
              <div>
                <div className="space-y-2">
                  <label htmlFor="attachment" className="text-black text-sm">
                    Email Attachment
                  </label>
                  <input type="file" onChange={handleFileChange} />
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="space-y-2">
                <label htmlFor="messageType" className="text-black text-sm">
                  Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  clearOnEscape
                  overrides={{
                    Root: {
                      style: {
                        border: 'none', // Remove border
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Apply shadow
                      },
                    },
                    Input: {
                      style: {
                        backgroundColor: '#FAFAFA', // Change background color here
                        border: 'none',
                      },
                    },
                  }}
                />
              </div>
              <div className="space-y-4 border-b border-gray-100 mt-3.5 text-black font-bold text-xl pb-2">
                Text Message
              </div>
              <div className="text-black">{message}</div>
            </div>
          </form>
        </div>
        <div className="w-1/2">
          <div className="border-b border-gray-100 text-xl font-bold pb-2 text-black">
            Email Message Preview
          </div>
          <div className="text-black text-sm">
            <p className="font-bold my-1">[Dr. Shawn Lin] {subject} </p>
            {selectedFile && (
              <div>
                <p className="my-1">
                  Attachment Found |{' '}
                  <a
                    target="_blank"
                    href={URL.createObjectURL(selectedFile)}
                    className="text-blue-700"
                  >
                    File
                  </a>
                </p>
              </div>
            )}
            <div>{message}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-5 mt-4">
        <Button
          kind="tertiary"
          title="Cancel"
          width={136}
          onClick={onClose}
          style={{
            backgroundColor: '#D4D4D8',
            color: '#000000',
          }}
        />
        <Button kind="primary" title="Update" width={136} />
      </div>
    </div>
  );
};
export default TemplateUpdatePage;
