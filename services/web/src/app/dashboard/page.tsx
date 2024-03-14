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
  { name: 'Wendie', age: 17 },
  { name: 'Marna', age: 11 },
  { name: 'Malka', age: 14 },
  { name: 'Jospeh', age: 10 },
  { name: 'Roselee', age: 12 },
  { name: 'Justine', age: 35 },
  { name: 'Marlon', age: 30 },
  { name: 'Mellissa', age: 32 },
  { name: 'Fausto', age: 21 },
  { name: 'Alfredia', age: 22 },
  { name: 'Abel', age: 18 },
  { name: 'Winford', age: 19 },
  { name: 'Neil', age: 27 },
];

const Dashboard: React.FC = () => {
  const columnConfig: ColumnConfig<{ name: string; age: number }>[] = [
    { title: 'Name', accessor: 'name', id: 'name' },
    { title: 'Age', accessor: 'age', id: 'age' },
  ];

  return (
    <div>
      <h1>Welcome to Dashboard</h1>

      <div style={{ height: '500px', width: '400px' }}>
        <DataTable data={DUMMY_DATA} columns={columnConfig} />
      </div>
    </div>
  );
};

export default Dashboard;
