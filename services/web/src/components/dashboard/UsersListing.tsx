'use client';
import DataTable, { ColumnConfig } from '@components/DataTable';
import React from 'react';

const DUMMY_DATA = [
  { name: 'Marlyn', age: 10 },
  { name: 'Luther', age: 15 },
  { name: 'Kiera', age: 13 },
  { name: 'Edna', age: 20 },
  { name: 'Soraya', age: 18 },
  { name: 'Dorris', age: 32 },
  { name: 'Astrid', age: 26 },
];

const UsersListing: React.FC = () => {
  const columnConfig: ColumnConfig<{ name: string; age: number }>[] = [
    { title: 'User', accessor: 'name', id: 'name', width: 70 },
    { title: 'Day', accessor: 'age', id: 'age', width: 50 },
    { title: 'Month', accessor: 'age', id: 'age', width: 50 },
  ];

  return (
    <div>
      <div className="text-lg font-normal">
        Users
        <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      </div>
      <div className="mt-2 text-xs">
        <DataTable data={DUMMY_DATA} columns={columnConfig} />
      </div>
    </div>
  );
};

export default UsersListing;
