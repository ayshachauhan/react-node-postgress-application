'use client';
import DataTable, { ColumnConfig } from '@components/DataTable';
import React from 'react';

const DUMMY_DATA = [
  { name: 'Cataract', age: 10 },
  { name: 'AM%', age: 15 },
  { name: 'Kiera', age: 13 },
  { name: 'Edna', age: 20 },
  { name: 'Soraya', age: 18 },
  { name: 'Dorris', age: 32 },
  { name: 'Astrid', age: 26 },
];

const SurgeryPercentage: React.FC = () => {
  const maxCellStyle = (cellValue: number | string) => {
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

  const appendPercentageSign = (cellValue: number) => {
    return cellValue + '%';
  };

  const columnConfig: ColumnConfig<{ name: string; age: number }>[] = [
    { title: 'Surgery', accessor: 'name', id: 'name', width: 100 },
    {
      title: '1',
      id: 'age',
      width: 40,
      cellStyle: maxCellStyle,
      accessor: (row) => appendPercentageSign(row.age),
    },
    {
      title: '2',
      id: 'age',
      width: 40,
      cellStyle: maxCellStyle,
      accessor: (row) => appendPercentageSign(row.age),
    },
    {
      title: '3',
      id: 'age',
      width: 40,
      cellStyle: maxCellStyle,
      accessor: (row) => appendPercentageSign(row.age),
    },
    {
      title: '6',
      id: 'age',
      width: 40,
      cellStyle: maxCellStyle,
      accessor: (row) => appendPercentageSign(row.age),
    },
    {
      title: '12',
      id: 'age',
      width: 40,
      cellStyle: maxCellStyle,
      accessor: (row) => appendPercentageSign(row.age),
    },
    {
      title: 'All',
      id: 'age',
      width: 40,
      cellStyle: maxCellStyle,
      accessor: (row) => appendPercentageSign(row.age),
    },
  ];

  return (
    <div>
      <div className="text-lg font-normal">
        Surgery Percentage
        <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      </div>
      <div className="overflow-x-auto">
        <div className="mt-2 text-xs">
          <DataTable data={DUMMY_DATA} columns={columnConfig} />
        </div>
      </div>
    </div>
  );
};

export default SurgeryPercentage;
