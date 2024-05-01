'use client';
import { EditIcon } from '@components/Icons';
import React, { useState } from 'react';

const upcomingData = [
  { date: 'Thur 02/29', age: '10', id: '1' },
  { date: 'Thur 02/29', age: '15', id: '2' },
  { date: 'Thur 02/29', age: '13', id: '3' },
  { date: 'Thur 02/29', age: '20', id: '4' },
  { date: 'Thur 02/29', age: '18', id: '5' },
  { date: 'Thur 02/29', age: '32', id: '6' },
];

const UpcomingSection: React.FC = () => {
  const appendAddSign = (cellValue: string) => {
    return '+' + cellValue;
  };

  const maxCellStyle = (cellValue: string) => {
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

  const [activeButton, setActiveButton] = useState<number | null>(0);

  const toggleActive = (id: number) => {
    setActiveButton(id);
  };

  const handleOpenEditModal = (): void => {};

  return (
    <div>
      <div className="text-lg font-normal flex justify-between">
        <span>Upcoming</span>
        <div className="cursor-pointer" onClick={() => handleOpenEditModal()}>
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
          <div className="mt-2 text-xs">
            <div className="text-gray-50 w-full items-center bg-gray-50 rounded-lg">
              <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
                <div className="font-bold text-white p-4 w-10">T</div>
                <div className="font-bold text-white p-4 w-40">Date</div>
                <div className="font-bold text-white p-4 w-10">Now</div>
                <div className="font-bold text-white p-4 w-10">Max</div>
                <div className="font-bold text-white p-4 w-10"></div>
              </div>
              {upcomingData.map((data, index) => (
                <React.Fragment key={data.id}>
                  <div
                    className={`flex items-center ${
                      index !== upcomingData.length - 1
                        ? 'border-b border-gray-300'
                        : ''
                    }`}
                  >
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                      B
                    </div>
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-40">
                      {data.date}
                    </div>
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                      {data.age}
                    </div>
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                      {data.age}
                    </div>
                    <div
                      className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10 text-center"
                      style={maxCellStyle(appendAddSign(data.age))}
                    >
                      {appendAddSign(data.age)}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="border-r-4 border-gray-200 pl-4 pr-4">
          <div className="mt-2 text-xs">
            <div className="text-gray-50 w-full items-center bg-gray-50 rounded-lg">
              <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
                <div className="font-bold text-white p-4 w-10">T</div>
                <div className="font-bold text-white p-4 w-40">Date</div>
                <div className="font-bold text-white p-4 w-10">Now</div>
                <div className="font-bold text-white p-4 w-10">Max</div>
                <div className="font-bold text-white p-4 w-10"></div>
              </div>
              {upcomingData.map((data, index) => (
                <React.Fragment key={data.id}>
                  <div
                    className={`flex items-center ${
                      index !== upcomingData.length - 1
                        ? 'border-b border-gray-300'
                        : ''
                    }`}
                  >
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                      B
                    </div>
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-40">
                      {data.date}
                    </div>
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                      {data.age}
                    </div>
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                      {data.age}
                    </div>
                    <div
                      className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10 text-center"
                      style={maxCellStyle(appendAddSign(data.age))}
                    >
                      {appendAddSign(data.age)}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="border-r-4 border-gray-200 pl-4 pr-4">
          <div className="mt-2 text-xs">
            <div className="text-gray-50 w-full items-center bg-gray-50 rounded-lg">
              <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
                <div className="font-bold text-white p-4 w-10">T</div>
                <div className="font-bold text-white p-4 w-40">Date</div>
                <div className="font-bold text-white p-4 w-10">Now</div>
                <div className="font-bold text-white p-4 w-10">Max</div>
                <div className="font-bold text-white p-4 w-10"></div>
              </div>
              {upcomingData.map((data, index) => (
                <React.Fragment key={data.id}>
                  <div
                    className={`flex items-center ${
                      index !== upcomingData.length - 1
                        ? 'border-b border-gray-300'
                        : ''
                    }`}
                  >
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                      B
                    </div>
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-40">
                      {data.date}
                    </div>
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                      {data.age}
                    </div>
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                      {data.age}
                    </div>
                    <div
                      className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10 text-center"
                      style={maxCellStyle(appendAddSign(data.age))}
                    >
                      {appendAddSign(data.age)}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="pl-4">
          <div className="mt-2 text-xs">
            <div className="text-gray-50 w-full items-center bg-gray-50 rounded-lg">
              <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
                <div className="font-bold text-white p-4 w-10">T</div>
                <div className="font-bold text-white p-4 w-40">Date</div>
                <div className="font-bold text-white p-4 w-10">Now</div>
                <div className="font-bold text-white p-4 w-10">Max</div>
                <div className="font-bold text-white p-4 w-10"></div>
              </div>
              {upcomingData.map((data, index) => (
                <React.Fragment key={data.id}>
                  <div
                    className={`flex items-center ${
                      index !== upcomingData.length - 1
                        ? 'border-b border-gray-300'
                        : ''
                    }`}
                  >
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                      B
                    </div>
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-40">
                      {data.date}
                    </div>
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                      {data.age}
                    </div>
                    <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                      {data.age}
                    </div>
                    <div
                      className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10 text-center"
                      style={maxCellStyle(appendAddSign(data.age))}
                    >
                      {appendAddSign(data.age)}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingSection;
