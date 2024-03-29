import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { SurgeryType } from '@root/enums/surgeryType.enum';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectPractice, selectRecords } from '@root/store/reducers/auth';
import {
  deleteRecordAsync,
  updateRecordAsync,
} from '@root/store/reducers/templates';
import { EditTemplate } from '@root/store/requests/templates';
import { Checkbox, STYLE_TYPE } from 'baseui/checkbox';
import { Select } from 'baseui/select';
import { Textarea } from 'baseui/textarea';
import React, { useEffect, useState } from 'react';
interface Data {
  id: string;
}
interface ChildProps {
  data: Data;
  onClose: () => void;
}

const TemplateUpdatePage: React.FC<ChildProps> = ({ data, onClose }) => {
  const handleSurgeryTypeChange = ({ value }) => {
    setTemplateInfo({
      ...updatedTemplateInfo,
      surgeryType: value[0] ? value[0].label : null,
    });
  };
  const userInfo = useAppSelector(selectRecords);
  const userId = userInfo?.id;
  const dispatch = useAppDispatch();
  const practiceId = useAppSelector(selectPractice); // Select user practice id
  const templateInfo = useAppSelector((state) =>
    data.id
      ? state.templates.templates.find(({ id }) => id === data.id)
      : undefined,
  );

  const templateId = data.id;

  const [updatedTemplateInfo, setTemplateInfo] = useState<
    Partial<EditTemplate>
  >({});

  const handleFileChange = (event) => {
    // setTemplateInfo({ ...updatedTemplateInfo, emailAttachment: event.target.files[0] });
    setTemplateInfo({
      ...updatedTemplateInfo,
      emailAttachment: event.target.files[0].name,
    });
  };
  const handleHtmlChange = (event) => {
    setTemplateInfo({ ...updatedTemplateInfo, emailBody: event.target.value });
  };
  const handleMessageTextChange = (event) => {
    setTemplateInfo({
      ...updatedTemplateInfo,
      messageText: event.target.value,
    });
  };
  const onConfirmDelete = (): void => {
    if (practiceId && templateId && userId) {
      try {
        const id = templateId;
        dispatch(deleteRecordAsync({ practiceId, id, userId }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (templateId && practiceId && userId) {
      const userPayloadData = {
        ...updatedTemplateInfo,
        active: updatedTemplateInfo.active ?? false,
        emailSubject: updatedTemplateInfo.emailSubject ?? '',
        emailAttachment: updatedTemplateInfo.emailAttachment ?? '',
        emailBody: updatedTemplateInfo.emailBody ?? '',
        messageText: updatedTemplateInfo.messageText ?? '',
        surgeryType: updatedTemplateInfo.surgeryType ?? SurgeryType.YAG,
        practiceId: practiceId,
        userId: userId,
        id: templateId,
      };
      try {
        dispatch(updateRecordAsync(userPayloadData));
        onClose();
      } catch (error) {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (data.id && templateInfo) {
      setTemplateInfo(templateInfo);
    }
  }, [data.id, templateInfo]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mt-10 items-center text-xl font-bold border-b border-gray-100 pb-2 text-black">
          <p>Write New Template</p>
          <div className="flex items-center gap-5">
            <div className="flex flex-row items-center gap-2">
              <label
                htmlFor="surgeryType"
                className="text-black text-sm font-normal"
              >
                Surgery:
              </label>
              <div
                style={{ fontSize: '14px', fontWeight: 400, width: '180px' }}
              >
                <Select
                  options={[
                    { label: 'CATARACT', id: '1' },
                    { label: 'YAG', id: '2' },
                    { label: 'LASIK', id: '3' },
                  ]}
                  onChange={handleSurgeryTypeChange}
                  value={
                    updatedTemplateInfo?.surgeryType
                      ? [
                          {
                            label: updatedTemplateInfo.surgeryType,
                            id: updatedTemplateInfo.surgeryType,
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
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        color: '#52525B',
                      },
                    },
                    ClearIcon: {
                      component: () => null,
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-5 mt-6">
          <div className="w-1/2 pr-8 border-r border-dotted border-gray-300">
            <div className="h-4/6">
              <div className="flex justify-between">
                <div className="border-b border-gray-100 text-xl font-bold pb-2 text-black">
                  Email Message
                </div>
                <div>
                  {updatedTemplateInfo?.active}
                  <Checkbox
                    checked={updatedTemplateInfo?.active}
                    onChange={(e) => {
                      setTemplateInfo({
                        ...updatedTemplateInfo,
                        active: e.currentTarget.checked,
                      });
                    }}
                    checkmarkType={STYLE_TYPE.toggle_round}
                    overrides={{
                      ToggleTrack: {
                        style: () => ({
                          backgroundColor: updatedTemplateInfo?.active
                            ? '#BBF7D0'
                            : '#E2E2E2',
                        }),
                      },
                      Toggle: {
                        style: () => ({
                          backgroundColor: updatedTemplateInfo?.active
                            ? '#16A34A'
                            : '#FFFFFF',
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
                      value={updatedTemplateInfo?.emailSubject || ''}
                      onChange={(value) => {
                        setTemplateInfo({
                          ...updatedTemplateInfo,
                          emailSubject: value,
                        });
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
                  <label htmlFor="emailBody" className="text-black text-sm">
                    Message
                  </label>

                  <Textarea
                    rows={8}
                    value={updatedTemplateInfo?.emailBody}
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
              </div>
            </div>
            <div>
              <div className="space-y-4 border-b border-gray-100 mt-5 text-black font-bold text-xl pb-2">
                Text Message
              </div>
              <div className="mt-3">
                <Textarea
                  rows={4}
                  value={updatedTemplateInfo?.messageText}
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
          </div>
          <div className="w-1/2 pl-8">
            <div className="h-4/6">
              <div className="border-b border-gray-100 text-xl font-bold pb-2 text-black">
                Email Message Preview
              </div>
              <div className="text-black text-sm">
                <p className="font-bold my-1">
                  {updatedTemplateInfo?.emailSubject}{' '}
                </p>
                {updatedTemplateInfo?.emailAttachment && (
                  <div>
                    <p className="my-1">
                      Attachment Found |{' '}
                      <a
                        target="_blank"
                        // href={URL.createObjectURL(updatedTemplateInfo?.emailAttachment)}
                        href={updatedTemplateInfo?.emailAttachment}
                        className="text-blue-700"
                      >
                        File
                      </a>
                    </p>
                  </div>
                )}
                <div
                  className="mt-2.5 py-1.5 pr-1.5 overflow-hidden break-all"
                  dangerouslySetInnerHTML={{
                    __html: updatedTemplateInfo?.emailBody || '',
                  }}
                />
              </div>
            </div>
            <div className="space-y-4 border-b border-gray-100 mt-5 text-black font-bold text-xl pb-2">
              Text Message Preview
            </div>
            <div className="text-black text-sm">
              <div
                className="mt-2.5 py-1.5 pr-1.5 overflow-hidden break-all"
                dangerouslySetInnerHTML={{
                  __html: updatedTemplateInfo?.messageText || '',
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-5 mt-4">
          <Button
            kind="tertiary"
            title="Delete"
            width={136}
            onClick={onConfirmDelete}
            style={{
              backgroundColor: '#DC2626',
            }}
          />
          <Button kind="primary" title="Update" width={136} />
        </div>
      </form>
    </div>
  );
};
export default TemplateUpdatePage;
