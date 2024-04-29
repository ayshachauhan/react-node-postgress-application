import { ITemplateUpdate } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import { selectRecords } from '@root/store/reducers/auth';
import { fetchListings as fetchSurgeryTypes } from '@root/store/reducers/surgeryTypes';
import {
  deleteRecordAsync,
  fetchListings,
  updateRecordAsync,
} from '@root/store/reducers/templates';
import { getPracticeId } from '@utils/index';
import { Checkbox, STYLE_TYPE } from 'baseui/checkbox';
import { Select } from 'baseui/select';
import { Textarea } from 'baseui/textarea';
import React, { useEffect, useState } from 'react';
interface Data {
  id: string;
  messageType: string;
  versionOffset: string;
}
interface ChildProps {
  data: Data;
  onClose: () => void;
}

const TemplateUpdatePage: React.FC<ChildProps> = ({ data, onClose }) => {
  const handleSurgeryTypeChange = ({ value }) => {
    const selectedSurgeryType = value[0];
    setTemplateInfo({
      ...updatedTemplateInfo,
      surgeryType: selectedSurgeryType,
    });
  };
  const userInfo = useAppSelector(selectRecords);
  const userId = userInfo?.id;
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const templateId = data.id;
  const messageType = data.messageType;
  const templateInfo = useAppSelector((state) => {
    const templates = Object.values(state.templates.entities);
    if (templateId && templates) {
      for (const template of templates) {
        for (const key in template) {
          if (Array.isArray(template[key])) {
            const foundItem = template[key].find(
              (item) => item.id === templateId,
            );
            if (foundItem) {
              return foundItem;
            }
          }
        }
      }
    }
    return undefined;
  });

  const versionOffset = data.versionOffset;

  const [updatedTemplateInfo, setTemplateInfo] = useState<
    Partial<ITemplateUpdate>
  >({});
  const [showTooltip, setShowTooltip] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setTemplateInfo((prevTemplateInfo) => ({
        ...prevTemplateInfo,
        emailAttachment: file.name,
      }));
    }
  };
  const handleHtmlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplateInfo({ ...updatedTemplateInfo, emailBody: event.target.value });
  };
  const handleMessageTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
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
        onClose();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (practiceId && userId) {
      const formattedPracticeId = practiceId ?? '';
      const formattedUserId = userId ?? '';
      dispatch(
        fetchListings({
          practiceId: formattedPracticeId,
          userId: formattedUserId,
        }),
      );
    }
  }, [practiceId, userId, dispatch]);

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchSurgeryTypes({ practiceId: practiceId }));
    }
  }, [practiceId, dispatch]);

  const surgeryTypes = useAppSelector((state) => state.surgeryTypes.entities);
  const surgeryTypeOptions = Object.keys(surgeryTypes).map((key) => ({
    label: surgeryTypes[key].type,
    id: surgeryTypes[key].id,
  }));

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
        surgeryTypeId: updatedTemplateInfo.surgeryType
          ? updatedTemplateInfo.surgeryType.id
          : surgeryTypeOptions[0].id,
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
    if (templateId && templateInfo) {
      setTemplateInfo(templateInfo);
    }
  }, [templateId, templateInfo]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mt-10 items-center text-xl font-bold border-b border-gray-100 pb-2 text-black">
          <p>Write New Template</p>
          <div className="flex items-center gap-7">
            <div className="flex flex-row items-center gap-1">
              <label className="text-black text-sm font-normal">
                Message Type:
              </label>
              <span className="text-black text-sm font-normal">
                {messageType}({versionOffset})
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <label
                htmlFor="surgeryType"
                className="text-black text-sm font-normal"
              >
                Surgery:
              </label>
              <div className="w-56 text-sm text-sm text-gray-600">
                <Select
                  options={surgeryTypeOptions}
                  onChange={handleSurgeryTypeChange}
                  value={
                    updatedTemplateInfo?.surgeryType
                      ? [
                          {
                            label: updatedTemplateInfo.surgeryType?.name,
                            id: updatedTemplateInfo.surgeryType?.id,
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
            <div className="h-4/6 overflow-auto">
              <div className="flex justify-between">
                <div className="border-b border-gray-100 text-xl font-bold pb-2 text-black">
                  Email Message
                </div>
                <div>
                  {updatedTemplateInfo?.active}
                  <div className="relative">
                    <Checkbox
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
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
                    {showTooltip && (
                      <div className="absolute top-full left-1/4 transform -translate-x-1/2 bg-black bg-opacity-70 text-white p-2 rounded z-50">
                        {updatedTemplateInfo?.active ? 'Enabled' : 'Disabled'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex mt-5 justify-between gap-5">
                <div className="w-1/2">
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="text-black text-sm font-normal"
                    >
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
                    <label
                      htmlFor="attachment"
                      className="text-black text-sm font-normal"
                    >
                      Email Attachment
                    </label>
                    <input type="file" onChange={handleFileChange} />
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <div className="space-y-2">
                  <label
                    htmlFor="emailBody"
                    className="text-black text-sm font-normal"
                  >
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
            <div className="h-4/6 overflow-auto">
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
            type="button"
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
