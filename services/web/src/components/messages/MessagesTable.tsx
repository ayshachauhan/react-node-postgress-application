'use client';
import { IEmailLog } from '@packages/entities';
import Button from '@root/components/Button';
import { SearchIcon } from '@root/components/Icons';
import TextInput from '@root/components/TextInput';
import MessageWithReadMore from '@root/components/messages/MessageWithReadMore';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  fetchListings,
  setSearchMRNName,
} from '@root/store/reducers/messages';
import {
  formatColumnDate,
  formatHeaderDate,
  generateFullName,
  getPracticeId,
} from '@utils/index';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export default function MessagesTable() {
  const [activeButton, setActiveButton] = useState<string | null>('All');
  const toggleActive = (id: string) => {
    setActiveButton(id);
    filterData();
  };
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.referrers.successMessage,
    errorMessage: state.referrers.errorMessage,
  }));
  const [groupedData, setGroupedData] = useState<{
    [date: string]: IEmailLog[];
  }>({});
  const resetFilters = (): void => {
    dispatch(setSearchMRNName(null));
  };
  const practiceId = getPracticeId();
  const [showModal, setShowModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const dispatch = useAppDispatch();
  const { searchMRNName } = useAppSelector(
    (state) => state.messages.messageFilters,
  );
  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId: practiceId }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    let timer;
    if (successMessage) {
      setShowModal(true);
      timer = setTimeout(() => {
        setShowModal(false);
        dispatch(clearSuccessMessage());
      }, 2000);
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

  const messagesData = useAppSelector((state) =>
    Object.values(state.messages.entities),
  );
  console.log(messagesData);

  const [filteredData, setFilteredData] = useState<IEmailLog[]>([]);
  const filterData = useCallback(() => {
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
  }, [messagesData, searchMRNName, activeButton]);

  const handleSearchMRNNameChange = (value: string) => {
    const mrn = value.toLowerCase();
    dispatch(setSearchMRNName(mrn));
  };

  const filteredDataRef = useRef<IEmailLog[]>([]);
  useEffect(() => {
    const filteredData = filterData();
    if (
      JSON.stringify(filteredData) !== JSON.stringify(filteredDataRef.current)
    ) {
      setFilteredData(filteredData);
      filteredDataRef.current = filteredData;
    }
  }, [messagesData, searchMRNName, filterData]);

  const generateGroupedData = (data: IEmailLog[]) => {
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
    const newGroupedData = generateGroupedData(filteredData);
    setGroupedData(newGroupedData);
  }, [filteredData]);

  return (
    <div className="mt-4 mb-8">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">
          All Messages({messagesData.length})
        </span>
        {showModal && <div className="text-green-700">{successMessage}</div>}
        {showErrorMessage && <div className="text-red-700">{errorMessage}</div>}
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
      {Object.keys(groupedData).length !== 0 && (
        <div className="w-full overflow-x-auto mt-2 border rounded-t-lg rounded-b-lg border-gray-200">
          {Object.entries(groupedData).map(([date, records], index) => (
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
                <div className="font-bold text-white py-2 px-1 min-w-[20rem] max-w-[20rem]">
                  Email
                </div>
                <div className="font-bold text-white py-2 px-1 min-w-[20rem] max-w-[20rem]">
                  Text
                </div>
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
                    {row?.data?.surgery_type}
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
                    <p>Cell: {row?.data?.phone}</p>
                    <p>Email: {row?.data?.pt_email_address}</p>
                  </div>
                  <MessageWithReadMore message={row?.data?.body ?? ''} />
                  <MessageWithReadMore message={row?.data?.text ?? ''} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
