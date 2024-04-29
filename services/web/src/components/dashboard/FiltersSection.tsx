import { HomeIcon, RoundIcon } from '@root/components/Icons';
import { Input } from 'baseui/input';
import { Select } from 'baseui/select';
import React, { useState } from 'react';
import {
  CopyIcon,
  DeleteIcon,
  DisplayIcon,
  EditIcon,
  SearchIcon,
  StarIcon,
  ViewIcon,
} from '../Icons';
import DeleteFilterModal from './DeleteFilterModal';
import EditableRow from './EditableRow';

const FiltersSection: React.FC = () => {
  const actionIcons = (index: number) => (
    <div style={{ display: 'flex' }}>
      <StarIcon style={{ marginRight: '8px', cursor: 'pointer' }} />
      <CopyIcon
        style={{ marginRight: '8px', cursor: 'pointer' }}
        onClick={() => handleCloneClick(index)}
      />
      <DisplayIcon style={{ marginRight: '8px', cursor: 'pointer' }} />
      <ViewIcon
        style={{ marginRight: '8px', cursor: 'pointer' }}
        onClick={() => handleViewClick(index)}
      />
      <EditIcon
        style={{ marginRight: '8px', cursor: 'pointer' }}
        onClick={() => handleEditClick(index)}
      />
      <DeleteIcon
        style={{ cursor: 'pointer' }}
        onClick={() => handleOpenDeleteModal()}
      />
    </div>
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = (): void => {
    setIsDeleteModalOpen(true);
  };

  const [clonedDivs, setClonedDivs] = useState<string[]>([]);

  const handleCloneClick = (index: number) => {
    console.log(index, 2);
    // Logic to clone the specific div and add its HTML content to the state
    const clonedDivHTML =
      document.querySelectorAll('.div-clone')[index].outerHTML;
    setClonedDivs((prevClonedDivs) => [...prevClonedDivs, clonedDivHTML]);
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

  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const handleViewClick = (rowIndex: number) => {
    console.log(rowIndex, 2);
    setSelectedRow(selectedRow === rowIndex ? null : rowIndex);
  };

  const [editRowId, setEditRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', age: '' });

  const handleEditClick = (index) => {
    const formValues = document.querySelectorAll('.div-clone')[index];
    setEditRowId(index);
    setEditFormData(formValues);
  };

  const handleEditFormChange = () => (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    setEditFormData({
      ...editFormData,
      [fieldName]: fieldValue,
    });
  };

  const handleCancelClick = () => {
    setEditRowId(null);
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
      <div className="w-full overflow-x-auto">
        <div
          className="border-solid rounded-t-lg p-2.5 text-white text-base font-normal"
          style={{ backgroundColor: 'rgba(53, 165, 118, 1)' }}
        >
          Tuesday, 3/12/2024- 1 cases (14 Max)
        </div>
        <div className="text-xs">
          <div className="text-gray-50 w-full items-center bg-gray-50 rounded-lg">
            <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
              <div className="font-bold text-white p-4">Date</div>
              <div className="font-bold text-white p-4">
                <HomeIcon></HomeIcon>
              </div>
              <div className="font-bold text-white p-4">
                <RoundIcon></RoundIcon>
              </div>
              <div className="font-bold text-white p-4">Status</div>
              <div className="font-bold text-white p-4">Last Name</div>
              <div className="font-bold text-white p-4">First Name</div>
              <div className="font-bold text-white p-4">MRN</div>
              <div className="font-bold text-white p-4">Eye</div>
              <div className="font-bold text-white p-4">Surgery</div>
              <div className="font-bold text-white p-4">AM</div>
              <div className="font-bold text-white p-4">Femto</div>
              <div className="font-bold text-white p-4">ORA</div>
              <div className="font-bold text-white p-4">Lens</div>
              <div className="font-bold text-white p-4">Implant</div>
              <div className="font-bold text-white p-4">Details</div>
              <div className="font-bold text-white p-4">#</div>
              <div className="font-bold text-white p-4">Calcs</div>
              <div className="font-bold text-white p-4">Auth</div>
              <div className="font-bold text-white p-4">H&P</div>
              <div className="font-bold text-white p-4">Consent</div>
              <div className="font-bold text-white p-4">Prof</div>
              <div className="font-bold text-white p-4">Hospital</div>
              <div className="font-bold text-white p-4">Insurance</div>
              <div className="font-bold text-white p-4">Action</div>
            </div>
            {editRowId === 0 ? (
              <EditableRow
                key={0}
                row={editFormData}
                handleEditFormChange={handleEditFormChange}
                handleCancelClick={handleCancelClick}
              />
            ) : (
              <div key={0} className="flex border-b border-gray-300 div-clone">
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">2/29</div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">w</div>
                <div className="text-red-500 bg-gray-50 pt-2 pb-2 px-4">
                  <RoundIcon></RoundIcon>
                </div>
                <div className="text-gray-900 bg-gray-50 py-2 px-4 flex text-center items-center">
                  <div className="rounded-md text-white p-1 bg-indigo-500">
                    Booked
                  </div>
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                  Maxwell
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                  Wilson
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                  54777
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Left</div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                  Cataract
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">AM</div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                  Femto
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">ORA</div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                  Standard
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                  1|AM456
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                  +23.5
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">3</div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                  5/6PC
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                  5/6PC
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                  5/6PC
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                  5/6PC
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                  5/6PC
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">1345</div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">PPO</div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                  {actionIcons(0)}
                </div>
              </div>
            )}
            {clonedDivs.map((clonedDivHTML, index = 0) => (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: clonedDivHTML }}
                className="flex border-b border-gray-300"
              />
            ))}
            <div key={1} className="flex border-b border-gray-300 div-clone">
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">2/29</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">w</div>
              <div className="text-red-500 bg-gray-50 pt-2 pb-2 px-4">
                <RoundIcon></RoundIcon>
              </div>
              <div className="text-gray-900 bg-gray-50 py-2 px-4 flex text-center items-center">
                <div className="rounded-md text-white p-1 bg-indigo-500">
                  Booked
                </div>
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                Victoria
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Wilson</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">54777</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Left</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                Cataract
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">AM</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Femto</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">ORA</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                Standard
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                1|AM456
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">+23.5</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">3</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">1345</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">PPO</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                {actionIcons(1)}
              </div>
            </div>
            {clonedDivs.map((clonedDivHTML, index = 1) => (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: clonedDivHTML }}
                className="flex border-b border-gray-300"
              />
            ))}
            <div key={2} className="flex div-clone">
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">2/29</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">w</div>
              <div className="text-red-500 bg-gray-50 pt-2 pb-2 px-4">
                <RoundIcon></RoundIcon>
              </div>
              <div className="text-gray-900 bg-gray-50 py-2 px-4 flex text-center items-center">
                <div className="rounded-md text-white p-1 bg-indigo-500">
                  Booked
                </div>
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Hens</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Wilson</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">54777</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Left</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                Cataract
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">AM</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Femto</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">ORA</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                Standard
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                1|AM456
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">+23.5</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">3</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">1345</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">PPO</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                {actionIcons(2)}
              </div>
            </div>
            {clonedDivs.map((clonedDivHTML, index = 2) => (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: clonedDivHTML }}
                className="flex border-b border-gray-300"
              />
            ))}
          </div>
        </div>
        <div
          className="border-solid rounded-t-lg py-2.5 px-2.5 text-white text-base font-normal"
          style={{ backgroundColor: 'rgba(53, 165, 118, 1)' }}
        >
          Tuesday, 3/12/2024- 1 cases (14 Max)
        </div>
        <div className="text-xs">
          <div className="text-gray-50 w-full items-center bg-gray-50 rounded-lg">
            <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
              <div className="font-bold text-white p-4">Date</div>
              <div className="font-bold text-white p-4">
                <HomeIcon></HomeIcon>
              </div>
              <div className="font-bold text-white p-4">
                <RoundIcon></RoundIcon>
              </div>
              <div className="font-bold text-white p-4">Status</div>
              <div className="font-bold text-white p-4">Last Name</div>
              <div className="font-bold text-white p-4">First Name</div>
              <div className="font-bold text-white p-4">MRN</div>
              <div className="font-bold text-white p-4">Eye</div>
              <div className="font-bold text-white p-4">Surgery</div>
              <div className="font-bold text-white p-4">AM</div>
              <div className="font-bold text-white p-4">Femto</div>
              <div className="font-bold text-white p-4">ORA</div>
              <div className="font-bold text-white p-4">Lens</div>
              <div className="font-bold text-white p-4">Implant</div>
              <div className="font-bold text-white p-4">Details</div>
              <div className="font-bold text-white p-4">#</div>
              <div className="font-bold text-white p-4">Calcs</div>
              <div className="font-bold text-white p-4">Auth</div>
              <div className="font-bold text-white p-4">H&P</div>
              <div className="font-bold text-white p-4">Consent</div>
              <div className="font-bold text-white p-4">Prof</div>
              <div className="font-bold text-white p-4">Hospital</div>
              <div className="font-bold text-white p-4">Insurance</div>
              <div className="font-bold text-white p-4">Action</div>
            </div>
            <div key={3} className="flex div-clone">
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">2/29</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">w</div>
              <div className="text-red-500 bg-gray-50 pt-2 pb-2 px-4">
                <RoundIcon></RoundIcon>
              </div>
              <div className="text-gray-900 bg-gray-50 py-2 px-4 flex text-center items-center">
                <div className="rounded-md text-white p-1 bg-indigo-500">
                  Booked
                </div>
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                Stephen
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Wilson</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">54777</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Left</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                Cataract
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">AM</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Femto</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">ORA</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                Standard
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                1|AM456
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">+23.5</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">3</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">1345</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">PPO</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                {actionIcons(3)}
              </div>
            </div>
            {clonedDivs.map((clonedDivHTML, index = 3) => (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: clonedDivHTML }}
                className="flex border-b border-gray-300"
              />
            ))}
          </div>
        </div>
        <div
          className="border-solid rounded-t-lg py-2.5 px-2.5 text-white text-base font-normal"
          style={{ backgroundColor: 'rgba(53, 165, 118, 1)' }}
        >
          Tuesday, 3/12/2024- 1 cases (14 Max)
        </div>
        <div className="text-xs">
          <div className="text-gray-50 w-full items-center bg-gray-50 rounded-lg">
            <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
              <div className="font-bold text-white p-4">Date</div>
              <div className="font-bold text-white p-4">
                <HomeIcon></HomeIcon>
              </div>
              <div className="font-bold text-white p-4">
                <RoundIcon></RoundIcon>
              </div>
              <div className="font-bold text-white p-4">Status</div>
              <div className="font-bold text-white p-4">Last Name</div>
              <div className="font-bold text-white p-4">First Name</div>
              <div className="font-bold text-white p-4">MRN</div>
              <div className="font-bold text-white p-4">Eye</div>
              <div className="font-bold text-white p-4">Surgery</div>
              <div className="font-bold text-white p-4">AM</div>
              <div className="font-bold text-white p-4">Femto</div>
              <div className="font-bold text-white p-4">ORA</div>
              <div className="font-bold text-white p-4">Lens</div>
              <div className="font-bold text-white p-4">Implant</div>
              <div className="font-bold text-white p-4">Details</div>
              <div className="font-bold text-white p-4">#</div>
              <div className="font-bold text-white p-4">Calcs</div>
              <div className="font-bold text-white p-4">Auth</div>
              <div className="font-bold text-white p-4">H&P</div>
              <div className="font-bold text-white p-4">Consent</div>
              <div className="font-bold text-white p-4">Prof</div>
              <div className="font-bold text-white p-4">Hospital</div>
              <div className="font-bold text-white p-4">Insurance</div>
              <div className="font-bold text-white p-4">Action</div>
            </div>
            <div key={4} className="flex div-clone">
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">2/29</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">w</div>
              <div className="text-red-500 bg-gray-50 pt-2 pb-2 px-4">
                <RoundIcon></RoundIcon>
              </div>
              <div className="text-gray-900 bg-gray-50 py-2 px-4 flex text-center items-center">
                <div className="rounded-md text-white p-1 bg-indigo-500">
                  Booked
                </div>
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Alex</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Wilson</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">54777</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Left</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                Cataract
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">AM</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Femto</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">ORA</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                Standard
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                1|AM456
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">+23.5</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">3</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">1345</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">PPO</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                {actionIcons(4)}
              </div>
            </div>
            {clonedDivs.map((clonedDivHTML, index = 4) => (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: clonedDivHTML }}
                className="flex border-b border-gray-300"
              />
            ))}
          </div>
        </div>
        <div
          className="border border-solid rounded-t-lg py-2.5 px-2.5 text-white text-base font-normal"
          style={{ backgroundColor: 'rgba(53, 165, 118, 1)' }}
        >
          Tuesday, 3/12/2024- 1 cases (14 Max)
        </div>
        <div className="text-xs">
          <div className="text-gray-50 w-full items-center bg-gray-50 rounded-lg">
            <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
              <div className="font-bold text-white p-4">Date</div>
              <div className="font-bold text-white p-4">
                <HomeIcon></HomeIcon>
              </div>
              <div className="font-bold text-white p-4">
                <RoundIcon></RoundIcon>
              </div>
              <div className="font-bold text-white p-4">Status</div>
              <div className="font-bold text-white p-4">Last Name</div>
              <div className="font-bold text-white p-4">First Name</div>
              <div className="font-bold text-white p-4">MRN</div>
              <div className="font-bold text-white p-4">Eye</div>
              <div className="font-bold text-white p-4">Surgery</div>
              <div className="font-bold text-white p-4">AM</div>
              <div className="font-bold text-white p-4">Femto</div>
              <div className="font-bold text-white p-4">ORA</div>
              <div className="font-bold text-white p-4">Lens</div>
              <div className="font-bold text-white p-4">Implant</div>
              <div className="font-bold text-white p-4">Details</div>
              <div className="font-bold text-white p-4">#</div>
              <div className="font-bold text-white p-4">Calcs</div>
              <div className="font-bold text-white p-4">Auth</div>
              <div className="font-bold text-white p-4">H&P</div>
              <div className="font-bold text-white p-4">Consent</div>
              <div className="font-bold text-white p-4">Prof</div>
              <div className="font-bold text-white p-4">Hospital</div>
              <div className="font-bold text-white p-4">Insurance</div>
              <div className="font-bold text-white p-4">Action</div>
            </div>
            <div key={5} className="flex div-clone">
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">2/29</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">w</div>
              <div className="text-red-500 bg-gray-50 pt-2 pb-2 px-4">
                <RoundIcon></RoundIcon>
              </div>
              <div className="text-gray-900 bg-gray-50 py-2 px-4 flex text-center items-center">
                <div className="rounded-md text-white p-1 bg-indigo-500">
                  Booked
                </div>
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Nora</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Wilson</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">54777</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Left</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                Cataract
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">AM</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">Femto</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">ORA</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                Standard
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                1|AM456
              </div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">+23.5</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">3</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">5/6PC</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">1345</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">PPO</div>
              <div className="text-black bg-gray-50 pt-2 pb-2 px-4">
                {actionIcons(5)}
              </div>
            </div>
            {clonedDivs.map((clonedDivHTML, index = 5) => (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: clonedDivHTML }}
                className="flex border-b border-gray-300"
              />
            ))}
          </div>
        </div>
        {selectedRow !== null && (
          <div className="flex justify-between p-2.5 text-xs">
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
                <span>N/A</span>
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
        <DeleteFilterModal
          onConfirmDelete={onConfirmDelete}
          isDeleteModalOpen={isDeleteModalOpen}
          handleCloseDeleteModal={handleCloseDeleteModal}
        />
      </div>
    </div>
  );
};

export default FiltersSection;
