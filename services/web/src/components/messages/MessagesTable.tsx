'use client';
import { IMessage } from '@packages/entities';
import Button from '@root/components/Button';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  fetchListings,
} from '@root/store/reducers/messages';
import {
  formatColumnDate,
  formatHeaderDate,
  generateFullName,
  getPracticeId,
} from '@utils/index';
import { Input } from 'baseui/input';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SearchIcon } from '../Icons';
import MessageWithReadMore from './MessageWithReadMore';

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
  const [searchMRN, setSearchMRN] = useState('');
  const [groupedData, setGroupedData] = useState<{
    [date: string]: IMessage[];
  }>({});
  const handleClearClick = () => {};
  const practiceId = getPracticeId();
  const [showModal, setShowModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const dispatch = useAppDispatch();

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

  const [filteredData, setFilteredData] = useState<IMessage[]>([]);
  const filterData = useCallback(() => {
    if (!messagesData) return [];

    let filtered = [...messagesData];

    if (searchMRN) {
      const searchValue = searchMRN.toLowerCase();
      filtered = filtered.filter(
        (row) =>
          row.mrn.toLowerCase().includes(searchValue) ||
          row.firstName.toLowerCase().includes(searchValue) ||
          row.lastName.toLowerCase().includes(searchValue),
      );
    }

    if (activeButton === 'Referrers') {
      filtered = filtered.filter((row) =>
        row.emailType.toLowerCase().includes('referrer'),
      );
    }

    if (activeButton === 'Emails') {
      filtered = filtered.filter(
        (row) =>
          row.emailType.toLowerCase().includes('timed') ||
          row.emailType.toLowerCase().includes('eval'),
      );
    }

    if (activeButton === 'Texts') {
      filtered = filtered.filter((row) =>
        row.emailType.toLowerCase().includes('immediate'),
      );
    }

    return filtered;
  }, [messagesData, searchMRN, activeButton]);

  const handleSearchMRNChange = (event) => {
    const mrn = event.target.value.toLowerCase();
    setSearchMRN(mrn);
    filterData();
  };

  const filteredDataRef = useRef<IMessage[]>([]);
  useEffect(() => {
    const filteredData = filterData();
    if (
      JSON.stringify(filteredData) !== JSON.stringify(filteredDataRef.current)
    ) {
      setFilteredData(filteredData);
      filteredDataRef.current = filteredData;
    }
  }, [messagesData, searchMRN, filterData]);

  const generateGroupedData = (data: IMessage[]) => {
    return data.reduce(
      (acc: { [date: string]: IMessage[] }, curr: IMessage) => {
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
        <div className="flex justify-between">
          <Input
            name="search"
            value={searchMRN}
            onChange={handleSearchMRNChange}
            placeholder="Search MRN or Name"
            overrides={{
              Root: {
                style: {
                  width: '300px',
                  borderTopRightRadius: '0',
                  borderBottomRightRadius: '0',
                  borderRight: '0',
                },
              },
              Input: {
                style: {
                  border: 'rgba(212, 212, 216, 1)',
                  backgroundColor: 'rgba(250, 250, 250, 1)',
                },
              },
            }}
          />
          <div className="bg-gradient-to-br from-teal-600 to-green-500 text-white p-2 items-center rounded-r-lg border-r border-gray-300">
            <SearchIcon className="mt-2" size={25}></SearchIcon>
          </div>
          <Button
            onClick={handleClearClick}
            type="button"
            kind="tertiary"
            title="Clear"
            style={{
              backgroundColor: 'rgba(212, 212, 216, 1)',
              color: 'black',
              marginLeft: '20px',
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
              <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex gap-2 py-2 px-2.5 text-sm">
                <div className="font-bold text-white py-2 px-1 w-20">
                  Date | Time
                </div>
                <div className="font-bold text-white py-2 px-1 w-40">
                  Surgery
                </div>
                <div className="font-bold text-white py-2 px-1 w-40">
                  Patient
                </div>
                <div className="font-bold text-white py-2 px-1 w-20">MRN</div>
                <div className="font-bold text-white py-2 px-1 w-40">
                  Contact Details
                </div>
                <div className="font-bold text-white py-2 px-1 w-80">Email</div>
                <div className="font-bold text-white py-2 px-1 w-80">Text</div>
              </div>
              {records.map((row, index) => (
                <div
                  key={row.id}
                  id={row.id}
                  className={`div-clone flex gap-2 px-2.5 text-xs ${
                    index !== records.length - 1
                      ? 'border-b border-gray-300'
                      : ''
                  }`}
                >
                  <div className="text-black  pt-2 pb-2 px-1 w-20">
                    {formatColumnDate(row.dateCreated)}
                  </div>
                  <div className="text-black  pt-2 pb-2 px-1 w-40">
                    {row.emailDetail}
                  </div>
                  <div className="text-black  pt-2 pb-2 px-1 w-40">
                    {row ? generateFullName(row.firstName, row.lastName) : null}
                  </div>
                  <div className="text-black  pt-2 pb-2 px-1 w-20">
                    {row.mrn}
                  </div>
                  <div className="text-black  pt-2 pb-2 px-1 overflow-hidden w-40">
                    <p>Cell: {row.phone}</p>
                    <p>Email: {row.email}</p>
                  </div>
                  <MessageWithReadMore key={index} message={row.message} />
                  <MessageWithReadMore key={index} message={row.textBody} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
