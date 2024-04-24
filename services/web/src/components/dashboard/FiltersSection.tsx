import DataTable, { ColumnConfig } from '@components/DataTable';
import { HomeIcon, RoundIcon } from '@root/components/Icons';
import { Input } from 'baseui/input';
import { Select } from 'baseui/select';
import React, { ReactNode, useState } from 'react';
import {
  CopyIcon,
  DeleteIcon,
  DisplayIcon,
  EditIcon,
  SearchIcon,
  StarIcon,
  ViewIcon,
} from '../Icons';

const FiltersSection: React.FC = () => {
  const actionIcons = (
    <div style={{ display: 'flex' }}>
      <StarIcon style={{ marginRight: '8px', cursor: 'pointer' }} />
      <CopyIcon style={{ marginRight: '8px', cursor: 'pointer' }} />
      <DisplayIcon style={{ marginRight: '8px', cursor: 'pointer' }} />
      <ViewIcon
        style={{ marginRight: '8px', cursor: 'pointer' }}
        onClick={() => handleViewClick(1)}
      />
      <EditIcon style={{ marginRight: '8px', cursor: 'pointer' }} />
      <DeleteIcon />
    </div>
  );
  const SURGERY_DATA = [
    {
      date: '2/29',
      home: 'w',
      age: 10,
      round: <RoundIcon />,
      status: 'Book',
      firstName: 'Wilson',
      lastName: 'Victoria',
      mrn: '3231',
      eye: 'Left',
      surgery: 'Cataract',
      am: 'AM',
      femto: 'Femto',
      ora: 'ORA',
      lens: 'Standard',
      implant: 'D1234',
      calcs: '5/6PC',
      action: actionIcons,
    },
    {
      date: '2/29',
      home: 'w',
      age: 15,
      round: <RoundIcon />,
      status: 'Pending',
      firstName: 'Wilson',
      lastName: 'Victoria',
      mrn: '3231',
      eye: 'Left',
      surgery: 'Cataract',
      am: 'AM',
      femto: 'Femto',
      ora: 'ORA',
      lens: 'Standard',
      implant: 'D1234',
      calcs: '5/6PC',
      action: actionIcons,
    },
    {
      date: '2/29',
      home: 'w',
      age: 13,
      round: <RoundIcon />,
      status: 'Cancel',
      firstName: 'Wilson',
      lastName: 'Victoria',
      mrn: '3231',
      eye: 'Left',
      surgery: 'Cataract',
      am: 'AM',
      femto: 'Femto',
      ora: 'ORA',
      lens: 'Standard',
      implant: 'D1234',
      calcs: '5/6PC',
      action: actionIcons,
    },
    {
      date: '2/29',
      home: 'w',
      age: 20,
      round: <RoundIcon />,
      status: 'Confirm',
      firstName: 'Wilson',
      lastName: 'Victoria',
      mrn: '3231',
      eye: 'Left',
      surgery: 'Cataract',
      am: 'AM',
      femto: 'Femto',
      ora: 'ORA',
      lens: 'Standard',
      implant: 'D1234',
      calcs: '5/6PC',
      action: actionIcons,
    },
  ];

  const appendAddSign = (cellValue: number) => {
    return '+' + cellValue;
  };

  const roundStyle = () => {
    return { color: 'rgba(239, 68, 68, 1)' };
  };

  const maxCellStyle = (cellValue: string | number) => {
    const isRed = cellValue === 'Cancel';
    const isBlue = cellValue === 'Book';
    const isYellow = cellValue === 'Pending';
    const isGreen = cellValue === 'Confirm';

    if (isBlue) {
      return {
        backgroundColor: 'rgba(99, 102, 241, 1)',
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
    } else if (isYellow) {
      return {
        backgroundColor: 'rgba(234, 179, 8, 1)',
        color: 'white',
        paddingLeft: '4px',
        paddingRight: '4px',
        paddingTop: '0px',
        paddingBottom: '0px',
        borderRadius: '5px',
        justifyContent: 'center',
      };
    } else if (isGreen) {
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
    } else {
      return {};
    }
  };

  const columnConfig: ColumnConfig<{
    date: string;
    age: number;
    round: ReactNode;
    status: string;
    home: string;
    firstName: string;
    lastName: string;
    mrn: string;
    eye: string;
    surgery: string;
    am: string;
    femto: string;
    ora: string;
    lens: string;
    implant: string;
    calcs: string;
    action: ReactNode;
  }>[] = [
    { title: 'Date', accessor: 'date', id: 'date' },
    { title: <HomeIcon />, accessor: 'home', id: 'home' },
    {
      title: <RoundIcon />,
      accessor: 'round',
      id: 'round',
      cellStyle: roundStyle,
    },
    {
      title: 'Status',
      accessor: 'status',
      id: 'status',
      cellStyle: maxCellStyle,
    },
    { title: 'Last Name', accessor: 'lastName', id: 'lastName' },
    { title: 'First Name', accessor: 'firstName', id: 'firstName' },
    { title: 'MRN', accessor: 'mrn', id: 'mrn' },
    { title: 'Eye', accessor: 'eye', id: 'eye' },
    { title: 'Surgery', accessor: 'surgery', id: 'surgery' },
    { title: 'AM', accessor: 'am', id: 'am' },
    { title: 'Femto', accessor: 'femto', id: 'femto' },
    { title: 'ORA', accessor: 'ora', id: 'ora' },
    { title: 'Lens', accessor: 'lens', id: 'lens' },
    { title: 'Implant', accessor: 'implant', id: 'implant' },
    { title: 'Details', id: 'age', accessor: (row) => appendAddSign(row.age) },
    { title: '#', accessor: 'age', id: 'age' },
    { title: 'Calcs', accessor: 'calcs', id: 'calcs' },
    { title: 'Auth', accessor: 'calcs', id: 'calcs' },
    { title: 'H&P', accessor: 'calcs', id: 'calcs' },
    { title: 'Consent', accessor: 'calcs', id: 'calcs' },
    { title: 'Prof', accessor: 'calcs', id: 'calcs' },
    { title: 'Hospital', accessor: 'age', id: 'age' },
    { title: 'Insurance', accessor: 'age', id: 'age' },
    { title: 'Action', accessor: 'action', id: 'action' },
  ];

  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const handleViewClick = (rowIndex: number) => {
    console.log(rowIndex, 2);
    setSelectedRow(selectedRow === rowIndex ? null : rowIndex);
  };

  return (
    <div>
      <div className="flex w-full bg-purple-50 p-2 border-t border-b border-gray-200 items-center">
        <div className="flex w-1/4 items-center">
          <div className="text-xl font-bold border-r border-gray-300 p-4">
            Filters
          </div>
          <div className="text-base font-bold p-4">March 2024</div>
        </div>
        <div className="flex w-3/4 justify-end gap-3 items-center">
          <div className="flex">
            <Input
              name="search"
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
          </div>
          <div>
            <Select
              required
              overrides={{
                ControlContainer: {
                  style: {
                    backgroundColor: 'rgba(250, 250, 250, 1)',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    color: '#52525B',
                    width: '250px',
                  },
                },
                ClearIcon: {
                  component: () => null,
                },
              }}
            />
          </div>
          <div>
            <Select
              required
              overrides={{
                ControlContainer: {
                  style: {
                    backgroundColor: 'rgba(250, 250, 250, 1)',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    color: '#52525B',
                    width: '250px',
                  },
                },
                ClearIcon: {
                  component: () => null,
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <div
          className="border border-solid rounded-t-lg p-2.5 mt-2 text-white text-base font-normal"
          style={{ backgroundColor: 'rgba(53, 165, 118, 1)' }}
        >
          Tuesday, 3/12/2024- 1 cases (14 Max)
        </div>
        <div className="text-xs">
          <DataTable data={SURGERY_DATA} columns={columnConfig} />
        </div>
        <div
          className="border border-solid rounded-t-lg py-2.5 px-2.5 mt-2 text-white text-base font-normal"
          style={{ backgroundColor: 'rgba(53, 165, 118, 1)' }}
        >
          Tuesday, 3/12/2024- 1 cases (14 Max)
        </div>
        <div className="text-xs">
          <DataTable data={SURGERY_DATA} columns={columnConfig} />
          {selectedRow !== null && (
            <div className="flex justify-between p-2.5">
              <div>
                <p>
                  <span className="font-bold">Date: </span>
                  <span>3/12/2024</span>
                </p>
                <p>
                  <span className="font-bold">Home Location: </span>
                  <span>Westwood</span>
                </p>
                <p>
                  <span className="font-bold">COVID Testing Status: </span>
                  <span>Needs COVID Test </span>
                </p>
                <p>
                  <span className="font-bold">Appointment Status: </span>
                  <span>Book</span>
                </p>
                <p>
                  <span className="font-bold">Calcs: </span>
                  <span>NA</span>
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Last Name: </span>
                  <span>Wilson</span>
                </p>
                <p>
                  <span className="font-bold">First Name: </span>
                  <span>Victoria</span>
                </p>
                <p>
                  <span className="font-bold">MRN: </span>
                  <span>321456987</span>
                </p>
                <p>
                  <span className="font-bold">Eye: </span>
                  <span>Left</span>
                </p>
                <p>
                  <span className="font-bold">Auth: </span>
                  <span>NA</span>
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Surgery: </span>
                  <span>Cataract</span>
                </p>
                <p>
                  <span className="font-bold">AM: </span>
                  <span>NA</span>
                </p>
                <p>
                  <span className="font-bold">Femto: </span>
                  <span>Femto</span>
                </p>
                <p>
                  <span className="font-bold">ORA: </span>
                  <span>NA</span>
                </p>
                <p>
                  <span className="font-bold">H&P: </span>
                  <span>NA</span>
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Lens: </span>
                  <span>NA</span>
                </p>
                <p>
                  <span className="font-bold">Implant: </span>
                  <span>NA</span>
                </p>
                <p>
                  <span className="font-bold">Details: </span>
                  <span>NA</span>
                </p>
                <p>
                  <span className="font-bold">#: </span>
                  <span>NA</span>
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold">Prof: </span>
                  <span>NA</span>
                </p>
                <p>
                  <span className="font-bold">Hospital: </span>
                  <span>NA</span>
                </p>
                <p>
                  <span className="font-bold">Insurance: </span>
                  <span>NA</span>
                </p>
                <p>
                  <span className="font-bold">Consent: </span>
                  <span>NA</span>
                </p>
                <p>
                  <span className="font-bold">Contact Info: </span>
                  <span>rfq@fantasticaltech.enigm</span>
                </p>
                <p>
                  <span>(246) 276 9618</span>
                </p>
              </div>
            </div>
          )}
        </div>
        <div
          className="border border-solid rounded-t-lg py-2.5 px-2.5 mt-2 text-white text-base font-normal"
          style={{ backgroundColor: 'rgba(53, 165, 118, 1)' }}
        >
          Tuesday, 3/12/2024- 1 cases (14 Max)
        </div>
        <div className="text-xs">
          <DataTable data={SURGERY_DATA} columns={columnConfig} />
        </div>
        <div
          className="border border-solid rounded-t-lg py-2.5 px-2.5 mt-2 text-white text-base font-normal"
          style={{ backgroundColor: 'rgba(53, 165, 118, 1)' }}
        >
          Tuesday, 3/12/2024- 1 cases (14 Max)
        </div>
        <div className="text-xs">
          <DataTable data={SURGERY_DATA} columns={columnConfig} />
        </div>
      </div>
    </div>
  );
};

export default FiltersSection;
