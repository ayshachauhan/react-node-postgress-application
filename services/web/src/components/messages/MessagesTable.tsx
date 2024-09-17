'use client';
import {
  EmailData,
  IEmailLog,
  IMediaConfig,
  IPatient,
  MediaType,
} from '@packages/entities';
import Button from '@root/components/Button';
import { SearchIcon } from '@root/components/Icons';
import Loader from '@root/components/loader';
import MessageWithReadMore from '@root/components/messages/MessageWithReadMore';
import { useLoader } from '@root/hooks/useLoader';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { fetchListings as fetchMedia } from '@root/store/reducers/media';
import {
  clearData,
  clearErrorMessage,
  clearSuccessMessage,
  fetchListings,
  sendMediaToPatientAsync,
  setSearchMRNName,
} from '@root/store/reducers/messages';
import { fetchListings as fetchPatients } from '@root/store/reducers/patient';
import {
  formatColumnDate,
  formatHeaderDate,
  generateFullName,
  getImageUrl,
  getPracticeId,
  toFullName,
} from '@utils/index';
import { Checkbox } from 'baseui/checkbox';
import { Select } from 'baseui/select';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface customerMediaConfig extends IMediaConfig {
  isChecked?: boolean;
}

export default function MessagesTable() {
  const [activeButton, setActiveButton] = useState<string | null>('All');
  const toggleActive = async (id: string) => {
    setActiveButton(id);
    await withLoader(async () => {
      const filteredData = await filterMessagesByType();
      setFilteredData(filteredData);
    });
  };
  const dispatch = useAppDispatch();
  const practiceId = getPracticeId();
  const [mrn, setMrn] = useState<string>('');
  const [patientInfo, setPatientInfo] = useState<IPatient>();
  const [sendVideoDisable, setSendVideoDisable] = useState<boolean>(true);
  const [mediaConfigList, setMediaConfigList] = useState<customerMediaConfig[]>(
    [],
  );

  const [selectedPreviewMediaConfig, setSelectedPreviewMediaConfig] =
    useState<IMediaConfig>();
  const {
    filteredMrn: { searchMRNName },
    patientsList,
    messagesData,
    mediaList,
  } = useAppSelector((state) => ({
    filteredMrn: state.messages.messageFilters,
    patientsList: Object.values(state.patients.entities),
    messagesData: Object.values(state.messages.entities).filter(
      (ele) => ele.status === 'completed',
    ),
    mediaList: Object.values(state.media.entities).filter(
      (ele) => ele.mediaType == MediaType.PRACTICE && ele.mediaConfigs.length,
    ),
  }));
  const searchParamsValue = useSearchParams();
  const ifRedirectedFromDashboard = searchParamsValue.get(
    'redirectedFromDashboard',
  );

  useEffect(() => {
    dispatch(clearData());
    if (
      !ifRedirectedFromDashboard ||
      ifRedirectedFromDashboard === 'undefined'
    ) {
      handleSearchMRNNameChange('');
      searchMRNNameStr = '';
    }
  }, [dispatch, practiceId]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const patientMrn = searchParams.get('patientMrn');
    if (patientMrn) {
      handleSearchMRNNameChange(String(patientMrn));
      searchMRNNameStr = String(patientMrn);
    } else {
      searchMRNNameStr = '';
    }
  }, [location.search]);

  useEffect(() => {
    if (practiceId !== null) {
      dispatchFetchMessages(searchMRNNameStr);
      dispatch(fetchPatients({ practiceId }));
      dispatch(fetchMedia({ practiceId }));
    }
  }, [practiceId, dispatch]);

  const [filteredData, setFilteredData] = useState<IEmailLog[]>([]);
  const { isLoading, withLoader } = useLoader();
  const filterMessagesByType = useCallback(async () => {
    if (!messagesData) return [];

    let filtered = [...messagesData];

    if (activeButton === 'Referrers') {
      filtered = filtered.filter(
        (row) => row.data?.to === row.data?.referrerEmail,
      );
    } else if (activeButton === 'Emails') {
      filtered = filtered.filter(
        (row) => row.data?.body && row.data.body.trim() !== '',
      );
    } else if (activeButton === 'Texts') {
      filtered = filtered.filter(
        (row) => row.data?.text && row.data.text.trim() !== '',
      );
    }

    return filtered;
  }, [messagesData, activeButton]);

  const filteredDataRef = useRef<IEmailLog[]>([]);

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  useEffect(() => {
    const updateFilteredData = async () => {
      const filteredData = await filterMessagesByType();
      if (
        JSON.stringify(filteredData) !== JSON.stringify(filteredDataRef.current)
      ) {
        setFilteredData(filteredData);
        filteredDataRef.current = filteredData;
      }
    };

    updateFilteredData();
  }, [messagesData, filterMessagesByType, filteredDataRef]);

  const [groupedMessagesByDate, setGroupedMessagesByDate] = useState<{
    [date: string]: IEmailLog[];
  }>({});

  const generateMessageDataByDate = (data: IEmailLog[]) => {
    return data.reduce(
      (acc: { [date: string]: IEmailLog[] }, curr: IEmailLog) => {
        const currentDate = new Date(curr.dateCreated)
          .toISOString()
          .split('T')[0];

        if (!acc[currentDate]) {
          acc[currentDate] = [curr];
        } else {
          acc[currentDate].push(curr);
        }
        return acc;
      },
      {},
    );
  };
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  useEffect(() => {
    const newMessageDataByDate = generateMessageDataByDate(filteredData);
    setGroupedMessagesByDate(newMessageDataByDate);
  }, [filteredData]);

  const messagesArray = Object.entries(groupedMessagesByDate);

  // Sort the messages array by the date keys
  messagesArray.sort(([dateA], [dateB]) => {
    const dateObjA = new Date(dateA);
    const dateObjB = new Date(dateB);

    return dateObjB.getTime() - dateObjA.getTime();
  });
  const sortedMessagesByDate = Object.fromEntries(messagesArray);

  const resetFilters = (): void => {
    dispatch(setSearchMRNName(null));
    setMrn('');
    setSendVideoDisable(true);
  };

  const handleSearchMRNNameChange = (value) => {
    const searchParams = new URLSearchParams(location.search);
    const patientMrn = searchParams.get('patientMrn');
    if (patientMrn) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (value) {
      const selectedMrn = value;
      setMrn(selectedMrn);
      const selectedPatient = patientsList.find(
        (patient) => patient.mrn == selectedMrn,
      );
      if (selectedPatient) {
        setPatientInfo(selectedPatient);
      }
      const updatedMediaConfigList: IMediaConfig[] = [];
      mediaList.forEach((ele) => {
        updatedMediaConfigList.push(...ele.mediaConfigs);
      });
      setMediaConfigList([...updatedMediaConfigList]);
      setSelectedPreviewMediaConfig(updatedMediaConfigList[0]);

      dispatch(setSearchMRNName(selectedMrn));
    } else {
      setMrn('');
      resetFilters();
    }
  };

  const convertVariables = (
    emailBody: string,
    emailInfo: EmailData | undefined,
  ): string => {
    let convertedBody = emailBody;
    if (emailInfo) {
      // Replace each placeholder with the corresponding value from emailInfo
      Object.keys(emailInfo).forEach((key) => {
        let value = emailInfo[key as keyof EmailData] ?? '';
        if (key === 'surgery_date') {
          value = formatHeaderDate(value);
        }
        const regex = new RegExp(`{{${key}}}`, 'g');
        convertedBody = convertedBody.replace(regex, value);
      });
    }
    return convertedBody;
  };

  let searchMRNNameStr = searchMRNName || '';
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.messages.successMessage,
    errorMessage: state.messages.errorMessage,
  }));
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (practiceId != null) {
      dispatchFetchMessages(searchMRNNameStr);
    }
  }, [dispatch, practiceId, searchMRNNameStr]);

  const dispatchFetchMessages = (searchMRNName: string) => {
    if (practiceId != null) {
      const loadData = async () => {
        await withLoader(async () => {
          await dispatch(
            fetchListings({
              practiceId,
              searchMRNName,
            }),
          );
        });
      };
      loadData();
    }
  };

  const handleSelectedVideoCheckBox = (index: number) => {
    mediaConfigList[index] = {
      ...mediaConfigList[index],
      isChecked: !mediaConfigList[index].isChecked,
    };

    const selectedVideo = mediaConfigList.find((ele) => ele.isChecked);
    if (selectedVideo) setSendVideoDisable(false);
    else setSendVideoDisable(true);

    setMediaConfigList([...mediaConfigList]);
  };

  const handleSendVideoButton = () => {
    if (practiceId && mrn) {
      const selectedMediaConfigList: string[] = mediaConfigList
        .filter((ele) => ele.isChecked)
        .map((ele) => ele.url);
      dispatch(
        sendMediaToPatientAsync({
          practiceId,
          data: {
            mrn,
            links: selectedMediaConfigList,
          },
        }),
      );
      dispatchFetchMessages('');
      dispatch(fetchPatients({ practiceId }));
      setSendVideoDisable(true);
      resetFilters();
      setMrn('');
    }
  };

  const handlePreviewMediaConfig = (id: string) => {
    const selectedConfig = mediaConfigList.find((ele) => ele.id === id);
    if (selectedConfig) setSelectedPreviewMediaConfig(selectedConfig);
  };
  useEffect(() => {
    let timer;
    if (successMessage) {
      setShowModal(true);
      timer = setTimeout(() => {
        setShowModal(false);
        dispatch(clearSuccessMessage());
      }, 3500);
    }
    if (errorMessage) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
        dispatch(clearErrorMessage());
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className="mt-4 mb-8">
      {isLoading && <Loader />}
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">
          All Messages({messagesData.length})
        </span>
        {showModal && <div className="text-green-700">{successMessage}</div>}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
        <div className="flex items-center min-w-96">
          <Select
            backspaceClearsInputValue
            backspaceRemoves
            value={mrn ? [{ id: mrn, label: mrn }] : [{ id: '', label: '' }]}
            onChange={({ value }) => handleSearchMRNNameChange(value[0]?.id)}
            options={patientsList.map((patient) => ({
              id: patient.mrn,
              label: `${patient.lastName}, ${patient.firstName} | ${patient.mrn}`,
            }))}
            placeholder="Search MRN or Name"
            overrides={{
              ControlContainer: {
                style: {
                  backgroundColor: 'rgba(250, 250, 250, 1)',
                  border: 'none',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  color: '#52525B',
                  borderTopRightRadius: '0',
                  borderBottomRightRadius: '0',
                },
              },
              ClearIcon: {
                component: () => null,
              },
            }}
          />
          <div className="bg-gradient-to-br from-teal-600 to-green-500 text-white px-5 h-full items-center rounded-r-lg border-r border-gray-300 flex items-center">
            <SearchIcon></SearchIcon>
          </div>
          <Button
            onClick={resetFilters}
            type="button"
            kind="tertiary"
            title="Clear"
            style={{
              backgroundColor: 'rgba(212, 212, 216, 1)',
              color: 'black',
              marginLeft: '20px',
              padding: '10px 15px 10px 15px',
            }}
          />
        </div>
      </div>
      {mrn && patientInfo ? (
        <div>
          <div className="bg-green-50 border-b border-green-200 ">
            <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
            <div className="bg-green-50">
              <div className="flex w-full bg-green-50 pr-2 items-center justify-around p-2 flex-col">
                <div className="text-xl font-bold">
                  {toFullName(patientInfo)}
                </div>
                <div className="text-lg">Cell: {patientInfo.phoneNumber}</div>
                <div className="text-lg">Email: {patientInfo.email}</div>
              </div>
            </div>
            <div className="p-2">
              {mediaConfigList.map((ele, configIndex) => {
                return (
                  <div className="flex flex-col" key={configIndex}>
                    <div className="flex flex-row items-center">
                      <div>
                        <Checkbox
                          checked={ele.isChecked}
                          onChange={() =>
                            handleSelectedVideoCheckBox(configIndex)
                          }
                        />
                      </div>
                      <div className="p-2">{ele.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pb-2 flex items-center justify-around">
              <Button
                onClick={handleSendVideoButton}
                disabled={sendVideoDisable}
                type="button"
                kind="tertiary"
                title="Send Video"
                height={30}
                style={{
                  backgroundColor: 'rgba(212, 212, 216, 1)',
                  color: 'black',
                  marginLeft: '20px',
                  padding: '10px 15px 10px 15px',
                }}
              />
            </div>
          </div>
          <div className="mt-2 pl-3 bg-gray-100 border-1 flex flex-row ">
            <div className="w-1/2 border-2 rounded-xl border-gray-700  mt-2 ">
              {mediaConfigList.map((ele, i) => {
                return (
                  <div
                    className="flex flex-col items-center justify-around border-b-2 border-gray-300 mx-2"
                    key={i}
                  >
                    <div
                      className="p-0.5 flex justify-around"
                      onClick={() => handlePreviewMediaConfig(ele.id)}
                    >
                      {ele.title}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pl-2 w-1/2 justify-around h-fit">
              {selectedPreviewMediaConfig ? (
                <div className="flex justify-around">
                  <React.Fragment key={selectedPreviewMediaConfig.id}>
                    <div className="rounded-lg shadow-sm p-1 h-190x` relative">
                      <div style={{ cursor: 'pointer' }}>
                        <Image
                          src={getImageUrl(selectedPreviewMediaConfig?.url)}
                          className="rounded-lg"
                          alt="External image description"
                          width={420}
                          height={190}
                        />
                        <div className="text-gray-900 pt-2 flex justify-around">
                          <div>{selectedPreviewMediaConfig.title}</div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
      <hr className="h-px my-1.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      {!isLoading && (
        <div>
          <div className="flex w-full bg-green-50 pr-2 border-b border-green-200 items-center">
            <div className="flex items-center">
              {['All', 'Emails', 'Texts', 'Referrers'].map((item) => (
                <div className="mr-1" key={item}>
                  <button
                    className="py-2 px-4 text-xs text-black text-normal border-b-2 border-transparent hover:text-white hover:bg-gradient-to-r from-primary-light to-primary-dark hover:rounded-t-lg"
                    style={{
                      ...(activeButton === item && {
                        backgroundImage:
                          'linear-gradient(to right, rgba(53, 165, 118, 1), rgba(17, 113, 128, 1))',
                        color: 'white',
                        borderTopLeftRadius: '0.5rem',
                        borderTopRightRadius: '0.5rem',
                      }),
                    }}
                    onClick={() => toggleActive(item)}
                  >
                    {item}
                  </button>
                </div>
              ))}
            </div>
          </div>
          {Object.keys(sortedMessagesByDate).length !== 0 && (
            <div className="table-responsive overflow-x-auto rounded-lg mt-2">
              <table className="">
                <tbody>
                  {Object.entries(sortedMessagesByDate).length > 0 &&
                    Object.entries(sortedMessagesByDate).map(
                      ([date, records], index) => (
                        <React.Fragment key={date}>
                          <tr
                            className={` ${index == 0 ? 'rounded-t-lg' : ''}`}
                          >
                            <td
                              className="text-white"
                              colSpan={10}
                              style={{
                                backgroundColor: 'rgba(53, 165, 118, 1)',
                              }}
                            >
                              {formatHeaderDate(date)}
                            </td>
                          </tr>
                          <tr className="">
                            <th className="">Date | Time</th>
                            <th className="">Surgery</th>
                            <th className="">Patient</th>
                            <th className="">MRN</th>
                            <th className="">Contact Details</th>
                            {activeButton !== 'Texts' && (
                              <th className="">Email</th>
                            )}
                            {activeButton !== 'Emails' && (
                              <th className="">Text</th>
                            )}
                            {activeButton !== 'Texts' && (
                              <th className="">Email Status</th>
                            )}
                            <th className="">Message Type</th>
                          </tr>
                          {records.map((row, index) => (
                            <tr
                              key={row.id}
                              id={row.id}
                              className={` ${
                                index !== records.length - 1
                                  ? 'border-t border-gray-300'
                                  : ''
                              }`}
                            >
                              <td className="">
                                {formatColumnDate(row.dateCreated)}
                              </td>
                              <td className="">
                                {row?.data?.Laterality}{' '}
                                {row?.data?.surgery_type}
                              </td>
                              <td className="">
                                {row
                                  ? generateFullName(
                                      row?.data?.fname ?? '',
                                      row?.data?.lname ?? '',
                                    )
                                  : null}
                              </td>
                              <td className="">{row?.data?.mrn}</td>
                              <td className="">
                                <p>Email: {row?.data?.to}</p>
                                {row?.data?.to ===
                                  row?.data?.pt_email_address && (
                                  <p>Cell: {row?.data?.phoneNumber}</p>
                                )}
                                {row?.data?.to ===
                                  row?.data?.doc_email_address && (
                                  <p>Cell: {row?.data?.doctorPhoneNumber}</p>
                                )}
                                {!(
                                  row?.data?.to ===
                                    row?.data?.pt_email_address ||
                                  row?.data?.to === row?.data?.doc_email_address
                                ) && <p>Cell: </p>}
                              </td>
                              {activeButton !== 'Texts' && (
                                <MessageWithReadMore
                                  message={convertVariables(
                                    row?.data?.body ?? '',
                                    row?.data,
                                  )}
                                />
                              )}
                              {activeButton !== 'Emails' && (
                                <MessageWithReadMore
                                  message={convertVariables(
                                    row?.data?.text ?? '',
                                    row?.data,
                                  )}
                                />
                              )}
                              {activeButton !== 'Texts' && (
                                <td className="">
                                  {row?.status.toLowerCase() === 'rejected' ? (
                                    <span>Error; message not sent</span>
                                  ) : row?.status.toLowerCase() ===
                                    'completed' ? (
                                    row?.isRead ? (
                                      <span>Message Read</span>
                                    ) : (
                                      <span>Message sent</span>
                                    )
                                  ) : (
                                    <span>
                                      {row?.status.charAt(0).toUpperCase() +
                                        row?.status.slice(1).toLowerCase()}
                                    </span>
                                  )}
                                </td>
                              )}
                              <td className="">{row?.data?.messageType}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ),
                    )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
