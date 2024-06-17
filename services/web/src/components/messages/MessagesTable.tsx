'use client';
import { EmailData, IEmailLog } from '@packages/entities';
import Button from '@root/components/Button';
import { SearchIcon } from '@root/components/Icons';
import TextInput from '@root/components/TextInput';
import Loader from '@root/components/loader';
import MessageWithReadMore from '@root/components/messages/MessageWithReadMore';
import { useLoader } from '@root/hooks/useLoader';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { fetchListings, setSearchMRNName } from '@root/store/reducers/messages';
import {
  formatColumnDate,
  formatHeaderDate,
  generateFullName,
  getPracticeId,
} from '@utils/index';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export default function MessagesTable() {
  const [activeButton, setActiveButton] = useState<string | null>('All');
  const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const toggleActive = async (id: string) => {
    setActiveButton(id);
    await withLoader(async () => {
      await delay(500);
      const filteredData = await filterMessagesByType();
      setFilteredData(filteredData);
    });
  };
  const dispatch = useAppDispatch();
  const messagesData: IEmailLog[] = useAppSelector((state) =>
    Object.values(state.messages.entities),
  );
  const [filteredData, setFilteredData] = useState<IEmailLog[]>([]);
  const { isLoading, withLoader } = useLoader();
  const filterMessagesByType = useCallback(async () => {
    if (!messagesData) return [];

    let filtered = [...messagesData];

    if (activeButton === 'Referrers') {
      filtered = filtered.filter(
        (row) =>
          row.data?.body &&
          row.data.body.trim() !== '' &&
          row.data.body.toLowerCase().includes('referrer'),
      );
    }

    if (activeButton === 'Emails') {
      filtered = filtered.filter(
        (row) => row.data?.body && row.data.body.trim() !== '',
      );
    }

    if (activeButton === 'Texts') {
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
  };
  const practiceId = getPracticeId();
  const { searchMRNName } = useAppSelector(
    (state) => state.messages.messageFilters,
  );

  const handleSearchMRNNameChange = (value: string) => {
    const mrn = value.toLowerCase();
    dispatch(setSearchMRNName(mrn));
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

  const searchMRNNameStr = searchMRNName || '';

  useEffect(() => {
    if (practiceId !== null) {
      dispatchFetchMessages(searchMRNNameStr);
    }
  }, [practiceId, dispatch]);

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

  return (
    <div className="mt-4 mb-8">
      {isLoading && <Loader />}
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">
          All Messages({messagesData.length})
        </span>
        <div className="flex items-center">
          <TextInput
            name="search"
            value={searchMRNName || ''}
            onChange={handleSearchMRNNameChange}
            placeholder="Search MRN or Name"
          />
          <div className="bg-gradient-to-br from-teal-600 to-green-500 text-white px-2 py-2.5 items-center rounded-r-lg border-r border-gray-300">
            <SearchIcon size={20}></SearchIcon>
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
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
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
        <div className="w-full overflow-x-auto mt-2 border rounded-t-lg rounded-b-lg border-gray-200">
          {Object.entries(sortedMessagesByDate).length > 0 &&
            Object.entries(sortedMessagesByDate).map(
              ([date, records], index) => (
                <div key={date}>
                  <div
                    className={`border-solid px-2.5 py-3 text-white text-base font-normal ${
                      index == 0 ? 'rounded-t-lg' : ''
                    }`}
                    style={{ backgroundColor: 'rgba(53, 165, 118, 1)' }}
                  >
                    {formatHeaderDate(date)}
                  </div>
                  <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex justify-between py-2 px-2.5 text-sm">
                    <div className="font-bold text-white py-2 px-1 min-w-[10rem]">
                      Date | Time
                    </div>
                    <div className="font-bold text-white py-2 px-1 min-w-[10rem]">
                      Surgery
                    </div>
                    <div className="font-bold text-white py-2 px-1 min-w-[10rem]">
                      Patient
                    </div>
                    <div className="font-bold text-white py-2 px-1 min-w-[5rem]">
                      MRN
                    </div>
                    <div className="font-bold text-white py-2 px-1 min-w-[10rem]">
                      Contact Details
                    </div>
                    {activeButton !== 'Texts' && (
                      <div className="font-bold text-white py-2 px-1 min-w-[20rem] max-w-[20rem]">
                        Email
                      </div>
                    )}
                    {activeButton !== 'Emails' && (
                      <div className="font-bold text-white py-2 px-1 min-w-[20rem] max-w-[20rem]">
                        Text
                      </div>
                    )}
                  </div>
                  {records.map((row, index) => (
                    <div
                      key={row.id}
                      id={row.id}
                      className={`div-clone flex justify-between px-2.5 text-xs ${
                        index !== records.length - 1
                          ? 'border-b border-gray-300'
                          : ''
                      }`}
                    >
                      <div className="text-black  pt-2 pb-2 px-1 min-w-[10rem]">
                        {formatColumnDate(row.dateCreated)}
                      </div>
                      <div className="text-black  pt-2 pb-2 px-1 min-w-[10rem]">
                        {row?.data?.Laterality} {row?.data?.surgery_type}
                      </div>
                      <div className="text-black  pt-2 pb-2 px-1 min-w-[10rem]">
                        {row
                          ? generateFullName(
                              row?.data?.fname ?? '',
                              row?.data?.lname ?? '',
                            )
                          : null}
                      </div>
                      <div className="text-black  pt-2 pb-2 px-1 min-w-[5rem]">
                        {row?.data?.mrn}
                      </div>
                      <div className="text-black  pt-2 pb-2 px-1 overflow-hidden min-w-[10rem]">
                        <p>Cell: {row?.data?.phoneNumber}</p>
                        <p>Email: {row?.data?.pt_email_address}</p>
                      </div>
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
                    </div>
                  ))}
                </div>
              ),
            )}
        </div>
      )}
    </div>
  );
}
