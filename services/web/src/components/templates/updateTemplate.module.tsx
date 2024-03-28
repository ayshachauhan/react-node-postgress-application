import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { Checkbox, STYLE_TYPE } from 'baseui/checkbox';
import { Textarea } from 'baseui/textarea';
import React, { useState } from 'react';

const TemplateUpdatePage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [emailSubject, setEmailSubject] = useState('');
  const [active, setActive] = React.useState([false, false]);
  const [emailAttachment, setEmailAttachment] = useState(null);
  const [emailBody, setEmailBody] = useState('');
  const [messageText, setMessageText] = useState('');
  const handleFileChange = (event) => {
    setEmailAttachment(event.target.files[0]);
  };
  const handleHtmlChange = (event) => {
    setEmailBody(event.target.value);
  };
  const handleMessageTextChange = (event) => {
    setMessageText(event.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <div className="flex gap-5 mt-6">
        <div className="w-1/2 pr-8 border-r border-dotted border-gray-300">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <div className="border-b border-gray-100 text-xl font-bold pb-2 text-black">
                Email Message
              </div>
              <div>
                <Checkbox
                  checked={active[0]}
                  onChange={(e) => {
                    const nextCheckboxes = [...active];
                    nextCheckboxes[0] = e.currentTarget.checked;
                    setActive(nextCheckboxes);
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
            <div className="flex mt-5 justify-between gap-5">
              <div className="w-1/2">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-black text-sm">
                    Email Subject
                  </label>
                  <TextInput
                    name="emailSubject"
                    value={emailSubject}
                    onChange={(value) => {
                      setEmailSubject(value);
                    }}
                    required
                  />
                </div>
                <div className="space-y-4"></div>
              </div>
              <div className="w-1/2">
                <div className="space-y-2">
                  <label htmlFor="attachment" className="text-black text-sm">
                    Email Attachment
                  </label>
                  <input type="file" onChange={handleFileChange} />
                </div>
              </div>
            </div>
            <div className="mt-5">
              <div className="space-y-2">
                <label htmlFor="messageType" className="text-black text-sm">
                  Message
                </label>

                <Textarea
                  rows={8}
                  value={emailBody}
                  onChange={handleHtmlChange}
                  clearOnEscape
                  overrides={{
                    Root: {
                      style: {
                        border: 'none',
                        boxShadow:
                          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                        fontSize: '0.875rem',
                      },
                    },
                    Input: {
                      style: {
                        backgroundColor: '#FAFAFA',
                        border: 'none',
                      },
                    },
                  }}
                />
              </div>
              <div className="space-y-4 border-b border-gray-100 mt-5 text-black font-bold text-xl pb-2">
                Text Message
              </div>
              <div className="mt-3">
                <Textarea
                  rows={4}
                  value={messageText}
                  onChange={handleMessageTextChange}
                  clearOnEscape
                  overrides={{
                    Root: {
                      style: {
                        border: 'none',
                        boxShadow:
                          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                        fontSize: '0.875rem',
                      },
                    },
                    Input: {
                      style: {
                        backgroundColor: '#FAFAFA',
                        border: 'none',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="w-1/2 pl-8">
          <div className="border-b border-gray-100 text-xl font-bold pb-2 text-black">
            Email Message Preview
          </div>
          <div className="text-black text-sm">
            <p className="font-bold my-1">{emailSubject} </p>
            {emailAttachment && (
              <div>
                <p className="my-1">
                  Attachment Found |{' '}
                  <a
                    target="_blank"
                    href={URL.createObjectURL(emailAttachment)}
                    className="text-blue-700"
                  >
                    File
                  </a>
                </p>
              </div>
            )}
            <div
              className="mt-2.5 py-1.5 pr-1.5 overflow-hidden break-all"
              dangerouslySetInnerHTML={{ __html: emailBody }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-5 mt-4">
        <Button
          kind="tertiary"
          title="Delete"
          width={136}
          onClick={onClose}
          style={{
            backgroundColor: 'red',
          }}
        />
        <Button kind="primary" title="Update" width={136} />
      </div>
    </div>
  );
};
export default TemplateUpdatePage;
