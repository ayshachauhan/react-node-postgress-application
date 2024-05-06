'use client';
import Button from '@root/components/Button';
import {
  formatColumnDate,
  formatHeaderDate,
  generateFullName,
} from '@utils/index';
import { Input } from 'baseui/input';
import React, { useEffect, useState } from 'react';
import { DeleteIcon, SearchIcon } from '../Icons';
import DeleteMessageModal from './DeleteMessageModal';

export default function MessagesTable() {
  const [activeButton, setActiveButton] = useState<number | null>(0);
  const toggleActive = (id: number) => {
    setActiveButton(id);
  };
  const [searchMRN, setSearchMRN] = useState('');
  const [groupedData, setGroupedData] = useState<{
    [date: string]: MessageRecord[];
  }>({});
  const handleClearClick = () => {};
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleOpenDeleteModal = (): void => {
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
  };

  const onConfirmDelete = (): void => {
    try {
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const messagesData = [
    {
      id: '1',
      date: '2024-04-20T03:43:06.686Z',
      surgery: 'Right Cataract',
      firstName: 'Victoria',
      lastName: 'Maxwell',
      mrn: '787125',
      contactNo: '243645612',
      email: 'y@mythicalmarketplace.elysium',
      emailContent:
        '<h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p>',
      text: '<h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p>',
      deleteAction: <DeleteIcon />,
    },
    {
      id: '1',
      date: '2024-04-25T03:43:06.686Z',
      surgery: 'Right Cataract',
      firstName: 'Victoria',
      lastName: 'Maxwell',
      mrn: '707135',
      contactNo: '243645612',
      email: 'y@mythicalmarketplace.elysium',
      emailContent:
        '<h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p>',
      text: '<h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p>',
      deleteAction: <DeleteIcon />,
    },
    {
      id: '1',
      date: '2024-04-15T03:43:06.686Z',
      surgery: 'Right Cataract',
      firstName: 'Victoria',
      lastName: 'Maxwell',
      mrn: '087135',
      contactNo: '243645612',
      email: 'y@mythicalmarketplace.elysium',
      emailContent:
        '<h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p>',
      text: '<h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p>',
      deleteAction: <DeleteIcon />,
    },
    {
      id: '1',
      date: '2024-04-15T03:43:06.686Z',
      surgery: 'Right Cataract',
      firstName: 'Victoria',
      lastName: 'Maxwell',
      mrn: '217135',
      contactNo: '243645612',
      email: 'y@mythicalmarketplace.elysium',
      emailContent:
        '<h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p>',
      text: '<h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p>',
      deleteAction: <DeleteIcon />,
    },
    {
      id: '2',
      date: '2024-04-15T03:43:06.686Z',
      surgery: 'Right Cataract',
      firstName: 'Victoria',
      lastName: 'Maxwell',
      mrn: '452135',
      contactNo: '43658760802',
      email: 'y@mythicalmarketplace.elysium',
      emailContent:
        '<h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p>',
      text: '<h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p><h1>Welcome to My Website</h1><p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore .</p>',
      deleteAction: <DeleteIcon />,
    },
  ];

  interface MessageRecord {
    id: string;
    date: string;
    surgery: string;
    firstName: string;
    lastName: string;
    mrn: string;
    contactNo: string;
    email: string;
    emailContent: string;
    text: string;
    deleteAction: JSX.Element;
  }

  const [filteredData, setFilteredData] = useState<MessageRecord[]>([]);
  const filterData = () => {
    let filtered = [...messagesData];
    if (searchMRN) {
      filtered = filtered.filter((row) =>
        row.mrn.toLowerCase().includes(searchMRN.toLowerCase()),
      );
    }
    setFilteredData(filtered);
  };

  const handleSearchMRNChange = (event) => {
    const mrn = event.target.value.toLowerCase();
    setSearchMRN(mrn);
    filterData();
  };

  useEffect(() => {
    filterData();
  }, [searchMRN]);

  const generateGroupedData = (data: MessageRecord[]) => {
    return data.reduce(
      (acc: { [date: string]: MessageRecord[] }, curr: MessageRecord) => {
        if (!acc[curr.date]) {
          acc[curr.date] = [curr];
        } else {
          acc[curr.date].push(curr);
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
        <span className="text-xl font-bold">All Messages(30)</span>

        <div className="flex justify-between">
          <Input
            name="search"
            value={searchMRN}
            onChange={handleSearchMRNChange}
            placeholder="Search MRN or Name"
            overrides={{
              Root: {
                style: {
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
          {['All', 'Emails', 'Texts', 'Referrers'].map((item, index) => (
            <div className="mr-1" key={index}>
              <button
                className="py-2 px-4 text-xs text-black text-normal border-b-2 border-transparent hover:text-white hover:bg-gradient-to-r from-primary-light to-primary-dark hover:rounded-t-lg"
                style={{
                  ...(activeButton === index && {
                    backgroundImage:
                      'linear-gradient(to right, rgba(53, 165, 118, 1), rgba(17, 113, 128, 1))',
                    color: 'white',
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem',
                  }),
                }}
                onClick={() => toggleActive(index)}
              >
                {item}
              </button>
            </div>
          ))}
        </div>
      </div>
      {Object.keys(groupedData).length !== 0 && (
        <div className="w-full overflow-x-auto mt-2 border-l border-r border-t rounded-t-lg border-gray-200">
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
                <div className="font-bold text-white py-2 px-1 w-10">
                  Action
                </div>
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
                    {formatColumnDate(row.date)}
                  </div>
                  <div className="text-black  pt-2 pb-2 px-1 w-40">
                    {row.surgery}
                  </div>
                  <div className="text-black  pt-2 pb-2 px-1 w-40">
                    {row ? generateFullName(row.firstName, row.lastName) : null}
                  </div>
                  <div className="text-black  pt-2 pb-2 px-1 w-20">
                    {row.mrn}
                  </div>
                  <div className="text-black  pt-2 pb-2 px-1 overflow-hidden whitespace-nowrap w-40">
                    <p>Cell: {row.contactNo}</p>
                    <p>Email: {row.email}</p>
                  </div>
                  <div className="text-black  pt-2 pb-2 px-1 overflow-hidden whitespace-nowrap w-80">
                    <div
                      dangerouslySetInnerHTML={{ __html: row.emailContent }}
                    />
                  </div>
                  <div className="text-black  pt-2 pb-2 px-1 overflow-hidden whitespace-nowrap w-80">
                    <div dangerouslySetInnerHTML={{ __html: row.text }} />
                  </div>
                  <div className="text-black  pt-2 pb-2 px-1 w-10">
                    <DeleteIcon
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleOpenDeleteModal()}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <DeleteMessageModal
        onConfirmDelete={onConfirmDelete}
        isDeleteModalOpen={isDeleteModalOpen}
        handleCloseDeleteModal={handleCloseDeleteModal}
      />
    </div>
  );
}
