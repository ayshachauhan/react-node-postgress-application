import { ISurgery } from '@packages/entities';
import { HomeIcon, RoundIcon } from '@root/components/Icons';
import { useAppSelector } from '@root/store';
import { usDateFormatter } from '@root/utils';
import { monthOptions } from '@root/utils/constants';
import { Input } from 'baseui/input';
import { Select } from 'baseui/select';
import React, { useEffect, useState } from 'react';
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

interface MonthOption {
  label: string;
  value: string;
}

// interface SurgeryRecord {
//   id: string;
//   date: string;
//   home: string;
//   hash: number;
//   round: JSX.Element;
//   status: string;
//   firstName: string;
//   lastName: string;
//   mrn: string;
//   eye: string;
//   surgery: string;
//   am: string;
//   femto: string;
//   ora: string;
//   lens: string;
//   implant: string;
//   calcs: string;
//   auth: string;
//   hospital: string;
//   prof: string;
//   insurance: string;
//   details: string;
//   hp: string;
//   consent: string;
//   action: (id: string) => JSX.Element;
// }

const FiltersSection: React.FC = () => {
  const surgeryList: ISurgery[] = useAppSelector((state) =>
    Object.values(state.surgeries.entities),
  );
  const actionIcons = (id: string) => (
    <div style={{ display: 'flex' }}>
      <StarIcon style={{ marginRight: '8px', cursor: 'pointer' }} />
      <CopyIcon
        style={{ marginRight: '8px', cursor: 'pointer' }}
        onClick={() => handleCloneClick(id)}
      />
      <DisplayIcon style={{ marginRight: '8px', cursor: 'pointer' }} />
      <ViewIcon
        style={{ marginRight: '8px', cursor: 'pointer' }}
        onClick={() => handleViewClick(id)}
      />
      <EditIcon
        style={{ marginRight: '8px', cursor: 'pointer' }}
        onClick={() => handleEditClick(id)}
      />
      <DeleteIcon
        style={{ cursor: 'pointer' }}
        onClick={() => handleOpenDeleteModal()}
      />
    </div>
  );
  const modifyEvalList = surgeryList
    .map((ele, index) => {
      const viewData = {
        id: ele.id,
        firstName: ele.patient.firstName,
        lastName: ele.patient.lastName,
        mrn: ele.patient.mrn,
        email: ele.patient.email,
        phoneNumber: ele.patient.phoneNumber,
        date: usDateFormatter(ele.date),
        surgery: ele.surgeryConfiguration.name,
        home: ele.practiceHome.name,
        insuranceDetails: ele.insuranceDetails,
        insurance: ele.insuranceType ? ele.insuranceType?.name : '',
        pcp: '',
        referrer: ele.patient.referrer ? ele.patient.referrer.email : '',
        details: ele.patient.details ? ele.patient.details : '',
        bodyPart: ele.bodyPart,
        index: index + 1,
        hospital: ele.totalHospitalPricing,
        prof: ele.totalProfessionalPricing,
        action: actionIcons,
        hash: 10,
        round: <RoundIcon />,
        status: 'booked',
        am: 'am',
        femto: 'Femto',
        ora: 'ORA',
        lens: 'Standard',
        implant: 'D1234',
        calcs: '5/6PC',
        auth: '5/6PC',
        hp: '5/6PC',
        consent: '5/6PC',
      };

      return viewData;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const currentMonthIndex = new Date().getMonth() + 1;
  const currentMonthOption = {
    label: monthOptions[currentMonthIndex - 1].label,
    value: monthOptions[currentMonthIndex - 1].value,
  };

  const [selectedMonth, setSelectedMonth] = React.useState<MonthOption[]>([
    currentMonthOption,
  ]);

  const handleChangeMonth = ({ value }) => {
    setSelectedMonth(value);
    // filterData();
  };

  const surgeryData = [
    {
      id: '1',
      date: '5/12',
      home: 'w',
      hash: 10,
      round: <RoundIcon />,
      status: 'Booked',
      firstName: 'Victoria',
      lastName: 'Wilson',
      mrn: '2231567',
      eye: 'Left',
      surgery: 'Cataract',
      am: 'AM',
      femto: 'Femto',
      ora: 'ORA',
      lens: 'Standard',
      implant: 'D1234',
      calcs: '5/6PC',
      auth: '5/6PC',
      hospital: '1800',
      prof: '5/6PC',
      insurance: 'PPO',
      details: '5.2',
      hp: '5/6PC',
      consent: '5/6PC',
      action: actionIcons,
    },
  ];

  // const [filteredData, setFilteredData] = useState<SurgeryRecord[]>([]);
  const [searchMRN, setSearchMRN] = useState('');
  // const [groupedData, setGroupedData] = useState<{
  //   [date: string]: SurgeryRecord[];
  // }>({});

  // const filterData = () => {
  //   let filtered = [...surgeryData];
  //   if (selectedMonth.length) {
  //     filtered = filtered.filter((item) => {
  //       const itemMonth = new Date(item.date).getMonth() + 1;
  //       return itemMonth.toString() === selectedMonth[0].value;
  //     });
  //   }
  //   if (searchMRN) {
  //     filtered = filtered.filter((row) =>
  //       row.mrn.toLowerCase().includes(searchMRN.toLowerCase()),
  //     );
  //   }
  //   setFilteredData(filtered);
  // };

  useEffect(() => {
    // filterData();
  }, [selectedMonth, searchMRN]);

  // const generateGroupedData = (data: SurgeryRecord[]) => {
  //   return data.reduce(
  //     (acc: { [date: string]: SurgeryRecord[] }, curr: SurgeryRecord) => {
  //       if (!acc[curr.date]) {
  //         acc[curr.date] = [curr];
  //       } else {
  //         acc[curr.date].push(curr);
  //       }
  //       return acc;
  //     },
  //     {},
  //   );
  // };

  // useEffect(() => {
  //   const newGroupedData = generateGroupedData(filteredData);
  //   setGroupedData(newGroupedData);
  // }, [filteredData]);

  const handleSearchMRNChange = (event) => {
    const mrn = event.target.value.toLowerCase();
    setSearchMRN(mrn);
    // filterData();
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = (): void => {
    setIsDeleteModalOpen(true);
  };

  const [clonedDivs, setClonedDivs] = useState<string[]>([]);

  const handleCloneClick = (rowId: string) => {
    setSelectedAction('clone');
    setSelectedRow(selectedRow === rowId ? null : rowId);
    const clonedDiv = document.getElementById(rowId);
    if (clonedDiv) {
      const clonedDivHTML = clonedDiv.outerHTML;
      setClonedDivs([clonedDivHTML]);
    }
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

  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const selectedSurgery = surgeryData.find(
    (surgery) => surgery.id === selectedRow,
  );

  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleViewClick = (rowId: string) => {
    setSelectedRow(selectedRow === rowId ? null : rowId);
    setSelectedAction('view');
  };

  const [editFormData, setEditFormData] = useState({
    date: '',
    home: '',
    hash: '',
    status: '',
    firstName: '',
    lastName: '',
    mrn: '',
    eye: '',
    surgery: '',
    am: '',
    femto: '',
    ora: '',
    lens: '',
    implant: '',
    calcs: '',
    auth: '',
    hospital: '',
    prof: '',
    insurance: '',
    details: '',
    hp: '',
    consent: '',
  });

  const handleEditClick = (rowId: string) => {
    setSelectedAction('edit');
    setSelectedRow(selectedRow === rowId ? null : rowId);
    const formValues = document.getElementById(rowId);
    if (formValues) {
      const formData: typeof editFormData = { ...editFormData };
      for (const key of Object.keys(editFormData)) {
        formData[key] = formValues[key]?.innerText ?? '';
      }
      setEditFormData(formData);
    }
  };

  const handleEditFormChange = () => (event) => {
    const fieldName = event.value;
    const fieldValue = event.value;
    setEditFormData({
      ...editFormData,
      [fieldName]: fieldValue,
    });
  };

  const handleCancelClick = () => {
    setSelectedAction('cancel');
    setSelectedRow(null);
  };

  return (
    <div>
      <div className="flex w-full bg-purple-50 px-2 border-t border-b border-gray-200 items-center">
        <div className="flex w-1/4 items-center">
          <div className="text-xl font-bold border-r border-gray-300 py-4 pr-4">
            Filters
          </div>
          {selectedMonth && selectedMonth.length > 0 && (
            <div className="text-base font-bold p-4">
              {selectedMonth[0].label} 2024
            </div>
          )}
        </div>
        <div className="flex w-3/4 justify-end gap-3 items-center text-sm">
          <div className="flex">
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
                    border: '0',
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
              options={monthOptions}
              value={selectedMonth}
              onChange={handleChangeMonth}
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
      {true && (
        <div className="w-full overflow-x-auto mt-2 border rounded-t-lg rounded-b-lg border-gray-200">
          {modifyEvalList.map((ele, index) => (
            <div key={index} className="w-max">
              <div
                className={`border-solid px-2.5 py-3 text-white text-base font-normal ${
                  index == 0 ? 'rounded-t-lg' : ''
                }`}
                style={{ backgroundColor: 'rgba(53, 165, 118, 1)' }}
              >
                {`${ele.date}/2024 - ${modifyEvalList.length} cases (${14} Max)`}
              </div>
              <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex gap-2 py-2 px-2.5 text-sm">
                <div className="font-bold text-white py-2 px-1 w-20">Date</div>
                <div className="font-bold text-white py-2 px-1 w-20">
                  <HomeIcon></HomeIcon>
                </div>
                <div className="font-bold text-white py-2 px-1 w-20">
                  <RoundIcon></RoundIcon>
                </div>
                <div className="font-bold text-white py-2 px-1 w-20">
                  Status
                </div>
                <div className="font-bold text-white py-2 px-1 w-20">
                  Last Name
                </div>
                <div className="font-bold text-white py-2 px-1 w-20">
                  First Name
                </div>
                <div className="font-bold text-white py-2 px-1 w-20">MRN</div>
                <div className="font-bold text-white py-2 px-1 w-20">
                  Body Part
                </div>
                <div className="font-bold text-white py-2 px-1 w-20">
                  Surgery
                </div>
                <div className="font-bold text-white py-2 px-1 w-20">AM</div>
                <div className="font-bold text-white py-2 px-1 w-20">Femto</div>
                <div className="font-bold text-white py-2 px-1 w-20">ORA</div>
                <div className="font-bold text-white py-2 px-1 w-20">Lens</div>
                <div className="font-bold text-white py-2 px-1 w-20">
                  Implant
                </div>
                <div className="font-bold text-white py-2 px-1 w-20">
                  Details
                </div>
                <div className="font-bold text-white py-2 px-1 w-20">#</div>
                <div className="font-bold text-white py-2 px-1 w-20">Calcs</div>
                <div className="font-bold text-white py-2 px-1 w-20">Auth</div>
                <div className="font-bold text-white py-2 px-1 w-20">H&P</div>
                <div className="font-bold text-white py-2 px-1 w-20">
                  Consent
                </div>
                <div className="font-bold text-white py-2 px-1 w-20">Prof</div>
                <div className="font-bold text-white py-2 px-1 w-20">
                  Hospital
                </div>
                <div className="font-bold text-white py-2 px-1 w-20">
                  Insurance
                </div>
                <div className="font-bold text-white py-2 px-1 w-40">
                  Action
                </div>
              </div>
              {modifyEvalList.map((row, index) =>
                selectedRow === row.id && selectedAction == 'edit' ? (
                  <EditableRow
                    key={row.id}
                    row={selectedSurgery}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                  />
                ) : (
                  <>
                    <div
                      key={row.id}
                      id={row.id}
                      className={`div-clone flex gap-2 px-2.5 text-xs items-center ${
                        index !== modifyEvalList.length - 1
                          ? 'border-b border-gray-300'
                          : ''
                      }`}
                    >
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {row.date}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {row.home}
                      </div>
                      <div className="text-red-500 bg-gray-50 pt-2 pb-2 px-1 w-20">
                        <RoundIcon></RoundIcon>
                      </div>
                      <div className="text-gray-900 bg-gray-50 py-2 px-0.5 flex text-center items-center w-20">
                        <div className="rounded-md text-white p-1 bg-indigo-500">
                          {row.status}
                        </div>
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 overflow-hidden whitespace-nowrap w-20">
                        {row.lastName}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 overflow-hidden whitespace-nowrap w-20">
                        {row.firstName}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 overflow-hidden whitespace-nowrap w-20">
                        {row.mrn}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {' '}
                        {row.bodyPart}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 overflow-hidden whitespace-nowrap w-20">
                        {row.surgery}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {' '}
                        {row.am}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {row.femto}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {' '}
                        {row.ora}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 overflow-hidden whitespace-nowrap w-20">
                        {row.lens}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {row.implant}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {row.details}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {row.hash}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {row.calcs}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {row.auth}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {row.hp}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {row.consent}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {row.prof}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {' '}
                        {row.hospital}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-20">
                        {' '}
                        {row.insurance}
                      </div>
                      <div className="text-black bg-gray-50 pt-2 pb-2 px-1 w-40">
                        {actionIcons(row.id)}
                      </div>
                    </div>
                    {selectedRow === row.id &&
                      selectedSurgery &&
                      selectedAction == 'view' && (
                        <div className="flex gap-2 p-2.5 text-xs">
                          <div className="flex-1">
                            <p>
                              <span className="font-bold">Date: </span>
                              <span>{selectedSurgery.date}</span>
                            </p>
                            <p>
                              <span className="font-bold">Home Location: </span>
                              <span>Westwood</span>
                            </p>
                            <p>
                              <span className="font-bold">
                                COVID Testing Status:{' '}
                              </span>
                              <span>Needs COVID Test </span>
                            </p>
                            <p>
                              <span className="font-bold">
                                Appointment Status:{' '}
                              </span>
                              <span>{selectedSurgery.status}</span>
                            </p>
                            <p>
                              <span className="font-bold">Calcs: </span>
                              <span>{selectedSurgery.calcs}</span>
                            </p>
                          </div>
                          <div className="flex-1">
                            <p>
                              <span className="font-bold">Last Name: </span>
                              <span>{selectedSurgery.firstName}</span>
                            </p>
                            <p>
                              <span className="font-bold">First Name: </span>
                              <span>{selectedSurgery.lastName}</span>
                            </p>
                            <p>
                              <span className="font-bold">MRN: </span>
                              <span>{selectedSurgery.mrn}</span>
                            </p>
                            <p>
                              <span className="font-bold">Eye: </span>
                              <span>{selectedSurgery.eye}</span>
                            </p>
                            <p>
                              <span className="font-bold">Auth: </span>
                              <span>{selectedSurgery.auth}</span>
                            </p>
                          </div>
                          <div className="flex-1">
                            <p>
                              <span className="font-bold">Surgery: </span>
                              <span>{selectedSurgery.surgery}</span>
                            </p>
                            <p>
                              <span className="font-bold">AM: </span>
                              <span>{selectedSurgery.am}</span>
                            </p>
                            <p>
                              <span className="font-bold">Femto: </span>
                              <span>{selectedSurgery.femto}</span>
                            </p>
                            <p>
                              <span className="font-bold">ORA: </span>
                              <span>{selectedSurgery.ora}</span>
                            </p>
                            <p>
                              <span className="font-bold">H&P: </span>
                              <span>{selectedSurgery.hp}</span>
                            </p>
                          </div>
                          <div className="flex-1">
                            <p>
                              <span className="font-bold">Lens: </span>
                              <span>{selectedSurgery.lens}</span>
                            </p>
                            <p>
                              <span className="font-bold">Implant: </span>
                              <span>{selectedSurgery.implant}</span>
                            </p>
                            <p>
                              <span className="font-bold">Details: </span>
                              <span>{selectedSurgery.details}</span>
                            </p>
                            <p>
                              <span className="font-bold">#: </span>
                              <span>{selectedSurgery.hash}</span>
                            </p>
                          </div>
                          <div className="flex-1">
                            <p>
                              <span className="font-bold">Prof: </span>
                              <span>{selectedSurgery.prof}</span>
                            </p>
                            <p>
                              <span className="font-bold">Hospital: </span>
                              <span>{selectedSurgery.hospital}</span>
                            </p>
                            <p>
                              <span className="font-bold">Insurance: </span>
                              <span>{selectedSurgery.insurance}</span>
                            </p>
                            <p>
                              <span className="font-bold">Consent: </span>
                              <span>{selectedSurgery.consent}</span>
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
                    {selectedRow === row.id &&
                      clonedDivs.length > 0 &&
                      selectedAction == 'clone' && (
                        <div className="border border-red-400 w-max text-xs">
                          {clonedDivs.map((clonedDivHTML, index) => (
                            <div
                              key={index}
                              dangerouslySetInnerHTML={{
                                __html: clonedDivHTML,
                              }}
                            />
                          ))}
                        </div>
                      )}
                  </>
                ),
              )}
            </div>
          ))}
          <DeleteFilterModal
            onConfirmDelete={onConfirmDelete}
            isDeleteModalOpen={isDeleteModalOpen}
            handleCloseDeleteModal={handleCloseDeleteModal}
          />
        </div>
      )}
    </div>
  );
};

export default FiltersSection;
