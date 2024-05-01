'use client';
import React from 'react';

const surgeryPercentage = [
  { name: 'Cataract', percentage: '10', id: '1' },
  { name: 'AM%', percentage: '15', id: '2' },
  { name: 'Kiera', percentage: '13', id: '3' },
  { name: 'Edna', percentage: '20', id: '4' },
  { name: 'Soraya', percentage: '18', id: '5' },
  { name: 'Dorris', percentage: '32', id: '6' },
  { name: 'Astrid', percentage: '26', id: '7' },
];

const SurgeryPercentage: React.FC = () => {
  const maxCellStyle = (cellValue: string) => {
    const numericValue =
      typeof cellValue === 'string'
        ? parseInt(cellValue.replace('%', ''), 10)
        : cellValue;
    const isRed = numericValue === 32;
    const isYellow = numericValue === 15;

    if (isRed) {
      return { color: 'rgba(239, 68, 68, 1)' };
    } else if (isYellow) {
      return { color: 'rgba(234, 179, 8, 1)' };
    } else {
      return {};
    }
  };

  const appendPercentageSign = (cellValue: string) => {
    return cellValue + '%';
  };

  return (
    <div>
      <div className="text-lg font-normal">
        Surgery Percentage
        <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      </div>
      <div className="mt-2 text-xs overflow-x-auto">
        <div className="text-gray-50 w-full items-center bg-gray-50 rounded-lg">
          <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
            <div className="font-bold text-white p-4 w-20">Surgery</div>
            <div className="font-bold text-white p-4 w-10">1</div>
            <div className="font-bold text-white p-4 w-10">2</div>
            <div className="font-bold text-white p-4 w-10">3</div>
            <div className="font-bold text-white p-4 w-10">6</div>
            <div className="font-bold text-white p-4 w-10">12</div>
            <div className="font-bold text-white p-4 w-10">All</div>
          </div>
          {surgeryPercentage.map((surgery, index) => (
            <React.Fragment key={surgery.id}>
              <div
                className={`flex ${
                  index !== surgeryPercentage.length - 1
                    ? 'border-b border-gray-300'
                    : ''
                }`}
              >
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-20">
                  {surgery.name}
                </div>
                <div
                  className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10"
                  style={maxCellStyle(appendPercentageSign(surgery.percentage))}
                >
                  {appendPercentageSign(surgery.percentage)}
                </div>
                <div
                  className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10"
                  style={maxCellStyle(appendPercentageSign(surgery.percentage))}
                >
                  {appendPercentageSign(surgery.percentage)}
                </div>
                <div
                  className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10"
                  style={maxCellStyle(appendPercentageSign(surgery.percentage))}
                >
                  {appendPercentageSign(surgery.percentage)}
                </div>
                <div
                  className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10"
                  style={maxCellStyle(appendPercentageSign(surgery.percentage))}
                >
                  {appendPercentageSign(surgery.percentage)}
                </div>
                <div
                  className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10"
                  style={maxCellStyle(appendPercentageSign(surgery.percentage))}
                >
                  {appendPercentageSign(surgery.percentage)}
                </div>
                <div
                  className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10"
                  style={maxCellStyle(appendPercentageSign(surgery.percentage))}
                >
                  {appendPercentageSign(surgery.percentage)}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurgeryPercentage;
