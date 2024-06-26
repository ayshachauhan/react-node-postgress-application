import { ITemplate } from '@packages/entities';
import { ITemplateUpdate } from '@packages/entities/index.browser';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useUserPermission } from '@root/hooks/userHasPermission';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchListings as fetchSurgeryConfigurations } from '@root/store/reducers/surgeryConfigurations';
import {
  deleteRecordAsync,
  fetchListings,
  updateRecordAsync,
} from '@root/store/reducers/templates';
import { TEMPLATE_VARIABLES } from '@root/utils/enums';
import { getPracticeId } from '@utils/index';
import { Checkbox, STYLE_TYPE } from 'baseui/checkbox';
import { SIZE, Select } from 'baseui/select';
import { Textarea } from 'baseui/textarea';
import React, { useEffect, useState } from 'react';
import RequiredIndicator from '../RequiredIndicator';

interface Data {
  id: string;
  messageType: string;
  versionOffset: string;
}
interface ChildProps {
  data: Data;
  onClose: () => void;
  withLoader: (func: () => Promise<void>) => Promise<void>;
  showDateOffsetControl: (v) => boolean;
}

const TemplateUpdatePage: React.FC<ChildProps> = ({
  data,
  onClose,
  withLoader,
  showDateOffsetControl,
}) => {
  const userInfo = useAppSelector((state) => state.auth.user);
  const userId = userInfo?.id;
  const userPermissions = userInfo?.permissions;
  const editCaseAllowed = useUserPermission(userPermissions, [
    USER_PERMISSIONS.EDIT_TEMPLATES,
  ]);
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const templateId = data.id;
  const messageType = data.messageType;
  const versionOffset = data.versionOffset;

  const [attachment, setAttachment] = useState<File | null>(null);

  const templateInfo: ITemplate = useAppSelector((state) => {
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

  const surgeryConfigurations = useAppSelector(
    (state) => state.surgeryConfigurations.entities,
  );
  const surgeryConfigurationOptions = Object.values(surgeryConfigurations).map(
    (surgeryConfiguration) => ({
      label: surgeryConfiguration.name,
      id: surgeryConfiguration.id,
    }),
  );

  const [showTooltip, setShowTooltip] = useState(false);
  const [showDateOffsetField, setShowDateOffsetField] = useState(false);
  const [updatedTemplateInfo, setTemplateInfo] = useState<
    Partial<ITemplateUpdate>
  >({});

  useEffect(() => {
    if (practiceId && userId) {
      const formattedPracticeId = practiceId ?? '';
      const formattedUserId = userId ?? '';
      const loadData = async () => {
        await withLoader(async () => {
          await dispatch(
            fetchListings({
              practiceId: formattedPracticeId,
              userId: formattedUserId,
            }),
          );
        });
      };

      loadData();
      setShowDateOffsetField(showDateOffsetControl(messageType));
    }
  }, [practiceId, userId, dispatch, withLoader]);

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchSurgeryConfigurations({ practiceId: practiceId }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    if (templateId && templateInfo) {
      setTemplateInfo(templateInfo);
    }
  }, [templateId, templateInfo]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setAttachment(file);
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

  const handleSurgeryConfiguration = ({ value }) => {
    const selectedSurgeryConfiguration = value[0];
    setTemplateInfo({
      ...updatedTemplateInfo,
      surgeryConfiguration: selectedSurgeryConfiguration,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (templateId && practiceId && userId) {
      const userPayloadData = {
        ...updatedTemplateInfo,
        active: updatedTemplateInfo.active ?? false,
        emailSubject: updatedTemplateInfo.emailSubject ?? '',
        dateOffset: updatedTemplateInfo.dateOffset ?? 0,
        emailAttachment: updatedTemplateInfo.emailAttachment,
        emailBody: updatedTemplateInfo.emailBody ?? '',
        messageText: updatedTemplateInfo.messageText ?? '',
        surgeryConfigurationId: updatedTemplateInfo.surgeryConfiguration
          ? updatedTemplateInfo.surgeryConfiguration.id
          : surgeryConfigurationOptions[0].id,
        practiceId: practiceId,
        userId: userId,
        id: templateId,
      };
      try {
        await withLoader(async () => {
          await dispatch(
            updateRecordAsync({ ...userPayloadData, file: attachment }),
          );
        });
        onClose();
      } catch (error) {
        onClose();
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mt-1 items-center text-xl font-bold border-b border-gray-100 pb-2 text-black">
          <p>Write New Template</p>
          <div className="flex items-center gap-7 mr-5">
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
                htmlFor="surgeryConfiguration"
                className="text-black text-sm font-normal"
              >
                Surgery:
              </label>
              <div className="w-56 text-sm text-gray-600">
                <Select
                  size={SIZE.mini}
                  options={surgeryConfigurationOptions}
                  onChange={handleSurgeryConfiguration}
                  value={
                    updatedTemplateInfo?.surgeryConfiguration
                      ? [
                          {
                            label:
                              updatedTemplateInfo.surgeryConfiguration?.name,
                            id: updatedTemplateInfo.surgeryConfiguration?.id,
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
            {showDateOffsetField ? (
              <div className="flex flex-row items-center gap-2">
                <label
                  htmlFor="surgeryConfiguration"
                  className="text-black text-sm font-normal"
                >
                  Date Offset:
                </label>
                <div className="w-56 text-sm text-gray-600">
                  <TextInput
                    name="dateOffset"
                    type="number"
                    value={updatedTemplateInfo?.dateOffset}
                    onChange={(value) => {
                      setTemplateInfo({
                        ...updatedTemplateInfo,
                        dateOffset: Number(value),
                      });
                      setShowDateOffsetField(showDateOffsetControl(value));
                    }}
                    required
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex gap-5 mt-2">
          <div className="w-1/2 pr-3 border-r border-dotted border-gray-300 text-xs">
            <div className="h-4/6 overflow-auto">
              <div className="flex justify-between border-b border-gray-100">
                <div className="text-base font-bold pb-2 text-black">
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
              <div className="flex items-center mt-2 justify-between gap-5">
                <div className="w-1/2">
                  <div className="space-y-1">
                    <label
                      htmlFor="title"
                      className="text-black text-sm font-normal"
                    >
                      <RequiredIndicator />
                      &nbsp;Subject
                    </label>
                    <TextInput
                      size={SIZE.mini}
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
                </div>
                <div className="w-1/2">
                  <div className="space-y-2">
                    <label
                      htmlFor="attachment"
                      className="text-black text-sm font-normal"
                    >
                      Attachment
                    </label>
                    <input type="file" onChange={handleFileChange} />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="space-y-2">
                  <label
                    htmlFor="emailBody"
                    className="text-black text-sm font-normal"
                  >
                    Message
                  </label>

                  <Textarea
                    rows={8}
                    value={updatedTemplateInfo?.emailBody || ''}
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
              <div className=" border-b border-gray-100 mt-3 text-black font-bold text-base pb-1">
                Text Message
              </div>
              <div className="mt-1">
                <Textarea
                  rows={4}
                  value={updatedTemplateInfo?.messageText || ''}
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
            <div className="mt-5 flex flex-row">
              <label className="space-y-2 font-bold w-36"> Email Body:</label>
              <div className="text-sm">
                {Object.keys(TEMPLATE_VARIABLES).map((ele) => `[${ele}], `)}
              </div>
            </div>
          </div>
          <div className="w-1/2">
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
                      Attachment Found |
                      <a
                        target="_blank"
                        // href={URL.createObjectURL(updatedTemplateInfo?.emailAttachment)}
                        href={templateInfo.emailAttachment}
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
            <div className="space-y-4 border-b border-gray-100 text-black font-bold text-xl pb-2">
              Text Message Preview
            </div>
            <div className="text-black text-sm">
              <div
                className="mt-2.5 py-1.5 pr-1.5 max-h-20 overflow-auto break-all"
                dangerouslySetInnerHTML={{
                  __html: updatedTemplateInfo?.messageText || '',
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-10">
          <Button
            type="button"
            kind="tertiary"
            title="Delete"
            width={136}
            height={40}
            onClick={onConfirmDelete}
            style={{
              backgroundColor: '#DC2626',
            }}
          />
          {editCaseAllowed && (
            <Button kind="primary" title="Update" width={136} height={40} />
          )}
        </div>
      </form>
    </div>
  );
};
export default TemplateUpdatePage;
