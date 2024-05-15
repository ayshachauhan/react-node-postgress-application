'use client';
import { HistoryType, IHistory } from '@packages/entities/index.browser';
import { DeleteIcon } from '@root/components/Icons';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchHistory } from '@root/store/reducers/history';
import {
  formatColumnDate,
  generateFullName,
  getPracticeId,
  getUserId,
} from '@utils/index';
import React, { useEffect, useState } from 'react';
import DeleteHistoryModal from './DeleteHistoryModal';

export default function HistoryTable() {
  const dispatch = useAppDispatch();

  const practiceId = getPracticeId();
  const userId = getUserId() as string;

  const { historyLogs, evals, surgeries } = useAppSelector((state) => ({
    historyLogs: Object.values(state.history.entities),
    evals: Object.values(state.evals.entities),
    surgeries: Object.values(state.surgeries.entities),
  }));

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const handleOpenDeleteModal = (): void => {
  //   setIsDeleteModalOpen(true);
  // };
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

  useEffect(() => {
    if (practiceId) fetchHistory({ practiceId, userId });
  }, [practiceId, dispatch, userId]);

  const getResolvedHistoryData = () => {
    historyLogs.map((history: IHistory) => {
      switch (history.entityType) {
        case HistoryType.SURGERY: {
          const surgeryData = surgeries.find(
            (surgery) => surgery.id === history.entityId,
          );
          return {
            ...surgeryData,
          };
        }

        case HistoryType.EVAL: {
          const evalData = evals.find((data) => data.id === history.entityId);
          return {
            ...evalData,
          };
        }
      }
    });
  };

  const historyData = [
    {
      id: '1',
      date: '2024-04-20T03:43:06.686Z',
      surgery: 'Right Cataract',
      firstName: 'Victoria',
      lastName: 'Maxwell',
      mrn: '787125',
      field: 'Lens',
      user: 'thinksys',
      prior: 'Standard',
      new: 'Toric',
      ip: '58.84.62.123',
      deleteAction: <DeleteIcon />,
    },
    {
      id: '1',
      date: '2024-04-25T03:43:06.686Z',
      surgery: 'Right Cataract',
      firstName: 'Victoria',
      lastName: 'Maxwell',
      mrn: '787125',
      field: 'Lens',
      user: 'thinksys',
      prior: 'Standard',
      new: 'Toric',
      ip: '58.84.62.123',
      deleteAction: <DeleteIcon />,
    },
    {
      id: '1',
      date: '2024-04-15T03:43:06.686Z',
      surgery: 'Right Cataract',
      firstName: 'Victoria',
      lastName: 'Maxwell',
      mrn: '787125',
      field: 'Lens',
      user: 'thinksys',
      prior: 'Standard',
      new: 'Toric',
      ip: '58.84.62.123',
      deleteAction: <DeleteIcon />,
    },
    {
      id: '1',
      date: '2024-04-15T03:43:06.686Z',
      surgery: 'Right Cataract',
      firstName: 'Victoria',
      lastName: 'Maxwell',
      mrn: '787125',
      field: 'Lens',
      user: 'thinksys',
      prior: 'Standard',
      new: 'Toric',
      ip: '58.84.62.123',
      deleteAction: <DeleteIcon />,
    },
    {
      id: '2',
      date: '2024-04-15T03:43:06.686Z',
      surgery: 'Right Cataract',
      firstName: 'Victoria',
      lastName: 'Maxwell',
      mrn: '787125',
      field: 'Lens',
      user: 'thinksys',
      prior: 'Standard',
      new: 'Toric',
      ip: '58.84.62.123',
      deleteAction: <DeleteIcon />,
    },
  ];

  return (
    <div className="my-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">History</span>
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      {Object.keys(historyData).length !== 0 && (
        <div className="w-full overflow-x-auto mt-2 border border-gray-200 rounded-t-lg rounded-b-lg">
          <div className="bg-gradient-to-br from-teal-600 to-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex gap-2 py-2 px-2.5 text-sm">
            <div className="font-bold text-white py-2 px-1 w-40">Date</div>
            <div className="font-bold text-white py-2 px-1 w-40">Name</div>
            <div className="font-bold text-white py-2 px-1 w-40">MRN</div>
            <div className="font-bold text-white py-2 px-1 w-40">Surgery</div>
            <div className="font-bold text-white py-2 px-1 w-40">Field</div>
            <div className="font-bold text-white py-2 px-1 w-40">User</div>
            <div className="font-bold text-white py-2 px-1 w-40">Prior</div>
            <div className="font-bold text-white py-2 px-1 w-40">New</div>
            <div className="font-bold text-white py-2 px-1 w-40">IP</div>
            <div className="font-bold text-white py-2 px-1 w-40">Action</div>
          </div>
          {historyData.map((row, index) => (
            <div
              key={row.id}
              id={row.id}
              className={`div-clone flex gap-2 px-2.5 text-xs ${
                index !== historyData.length - 1
                  ? 'border-b border-gray-300'
                  : ''
              }`}
            >
              <div className="text-black pt-2 pb-2 px-1 w-40">
                {formatColumnDate(row.date)}
              </div>
              <div className="text-black pt-2 pb-2 px-1 w-40">
                {row ? generateFullName(row.firstName, row.lastName) : null}
              </div>
              <div className="text-black pt-2 pb-2 px-1 w-40">{row.mrn}</div>
              <div className="text-black pt-2 pb-2 px-1 w-40">
                {row.surgery}
              </div>
              <div className="text-black pt-2 pb-2 px-1 w-40">{row.field}</div>
              <div className="text-black pt-2 pb-2 px-1 w-40">{row.user}</div>
              <div className="text-black pt-2 pb-2 px-1 w-40">{row.prior}</div>
              <div className="text-black pt-2 pb-2 px-1 w-40">{row.new}</div>
              <div className="text-black pt-2 pb-2 px-1 w-40">{row.ip}</div>
              <div className="text-black pt-2 pb-2 px-1 w-40">
                <DeleteIcon style={{ cursor: 'pointer' }} />
              </div>
            </div>
          ))}
        </div>
      )}
      <DeleteHistoryModal
        onConfirmDelete={onConfirmDelete}
        isDeleteModalOpen={isDeleteModalOpen}
        handleCloseDeleteModal={handleCloseDeleteModal}
      />
    </div>
  );
}
