'use client';
import DataTable, { ColumnConfig } from '@components/DataTable';
import { EditIcon } from '@components/Icons';
import React, { useState } from 'react';

const UPCOMING_DATA = [
  { name: 'Thur 02/29', age: 10 },
  { name: 'Thur 02/29', age: 15 },
  { name: 'Thur 02/29', age: 13 },
  { name: 'Thur 02/29', age: 20 },
  { name: 'Thur 02/29', age: 18 },
  { name: 'Thur 02/29', age: 32 },
];

const UpcomingSection: React.FC = () => {
  const appendAddSign = (cellValue: number) => {
    return '+' + cellValue;
  };

  const maxCellStyle = (cellValue: number | string) => {
    const numericValue =
      typeof cellValue === 'string'
        ? parseInt(cellValue.replace('%', ''), 10)
        : cellValue;
    const isMax = numericValue === 32;
    const isRed = numericValue === 10;
    const isGreen = numericValue === 15;

    if (isMax) {
      return {
        backgroundColor: 'rgba(34, 197, 94, 1)',
        color: 'white',
        paddingLeft: '4px',
        paddingRight: '4px',
        paddingTop: '0px',
        paddingBottom: '0px',
        borderRadius: '5px',
        justifyContent: 'center',
      };
    } else if (isRed) {
      return {
        backgroundColor: 'rgba(239, 68, 68, 1)',
        color: 'white',
        paddingLeft: '4px',
        paddingRight: '4px',
        paddingTop: '0px',
        paddingBottom: '0px',
        borderRadius: '5px',
        justifyContent: 'center',
      };
    } else if (isGreen) {
      return { color: 'rgba(22, 163, 74, 1)' };
    } else {
      return {};
    }
  };

  const columnConfig: ColumnConfig<{ name: string; age: number }>[] = [
    { title: 'T', accessor: 'age', id: 'age' },
    {
      title: 'Date',
      accessor: 'name',
      id: 'name',
      cellStyle: { whiteSpace: 'nowrap' },
    },
    { title: 'Now', accessor: 'age', id: 'age' },
    { title: 'Max', accessor: 'age', id: 'age' },
    {
      title: '',
      id: 'age',
      cellStyle: maxCellStyle,
      accessor: (row) => appendAddSign(row.age),
    },
  ];

  const [activeButton, setActiveButton] = useState<number | null>(0);

  const toggleActive = (id: number) => {
    setActiveButton(id);
  };

  return (
    <div>
      <div className="text-lg font-normal flex justify-between">
        <span>Upcoming</span>
        <div className="cursor-pointer">
          <EditIcon className="mt-2"></EditIcon>
        </div>
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="flex w-full bg-green-50 pr-2 border-b border-green-200 items-center">
        <div className="flex items-center">
          {[
            'SURGERY',
            'LASIK',
            'YAG',
            'TEST SURGERY',
            'TEST SURGERY',
            'TEST SURGERY',
            'TEST SURGERY',
            'TEST SURGERY',
          ].map((item, index) => (
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
      <div className="mt-2 flex justify-between overflow-x-auto text-xs">
        <div className="border-r-4 border-gray-200 pr-4">
          <DataTable data={UPCOMING_DATA} columns={columnConfig} />
        </div>
        <div className="border-r-4 border-gray-200 pl-4 pr-4">
          <DataTable data={UPCOMING_DATA} columns={columnConfig} />
        </div>
        <div className="border-r-4 border-gray-200 pl-4 pr-4">
          <DataTable data={UPCOMING_DATA} columns={columnConfig} />
        </div>
        <div className="pl-4">
          <DataTable data={UPCOMING_DATA} columns={columnConfig} />
        </div>
      </div>
    </div>
  );
};

export default UpcomingSection;
