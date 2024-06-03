'use client';
import { ISurgery } from '@packages/entities';
import {
  ChangedValue,
  EntityChanges,
  HistoryAction,
  HistoryType,
  IEval,
  IHistory,
} from '@packages/entities/index.browser';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { fetchListings as fetchEvalsList } from '@root/store/reducers/evals';
import { fetchHistory } from '@root/store/reducers/history';
import { fetchListings as fetchSurgeryList } from '@root/store/reducers/surgery';
import {
  formatColumnDate,
  generateFullName,
  getPracticeId,
} from '@utils/index';
import React, { useEffect } from 'react';
import { SurgeryFields } from './constants';

export type HistoryData = {
  id: string;
  date: Date;
  surgery: string;
  firstName: string;
  lastName: string;
  mrn: number;
  field: string;
  user: string;
  prior?: string;
  new?: string;
  ip: string;
  action: HistoryAction;
};

export default function HistoryTable() {
  const dispatch = useAppDispatch();

  const practiceId = getPracticeId();

  const { historyLogs, surgeries, surgerySuccessMessage, evals } =
    useAppSelector((state) => ({
      historyLogs: Object.values(state.history.entities),
      evals: Object.values(state.evals.entities),
      surgeries: Object.values(state.surgeries.entities),
      surgerySuccessMessage: state.surgeries.successMessage,
    }));

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  useEffect(() => {
    if (practiceId) {
      dispatch(fetchHistory({ practiceId }));
      dispatch(fetchEvalsList({ practiceId }));
      dispatch(fetchSurgeryList({ practiceId }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    if (practiceId) {
      dispatch(fetchHistory({ practiceId }));
    }
  }, [surgerySuccessMessage, dispatch, practiceId]);

  const resolvedHistoryChanges = (
    historyData: HistoryData,
    changes: EntityChanges,
  ): HistoryData[] => {
    return Object.entries(changes).map(
      ([key, data]: [string, ChangedValue]) => ({
        ...historyData,
        field: SurgeryFields[key] ?? key,
        prior:
          typeof data.oldValue === 'string'
            ? data.oldValue
            : JSON.stringify(data.oldValue),
        new:
          typeof data.newValue === 'string'
            ? data.newValue
            : JSON.stringify(data.newValue),
      }),
    );
  };

  const getTransformedHistoryData = (
    entityData: ISurgery | IEval | undefined,
    history: IHistory,
  ): HistoryData[] => {
    let resolvedData: HistoryData[];

    if (entityData) {
      const historyData = {
        id: entityData.id,
        date:
          history.action === HistoryAction.CREATE
            ? entityData.dateCreated
            : history.action === HistoryAction.DELETE
              ? (entityData.dateDeleted as Date)
              : entityData.dateUpdated,
        surgery: entityData.surgeryConfiguration.name,
        firstName: entityData.patient.firstName,
        lastName: entityData.patient.lastName,
        mrn: entityData.patient.mrn,
        user: history.user.fullName,
        ip: history.ipAddress ?? '',
        field: history.action === HistoryAction.CREATE ? 'Initial' : 'Delete',
        action: history.action,
      };

      resolvedData = history.changes
        ? resolvedHistoryChanges(historyData, history.changes)
        : [historyData];

      return resolvedData;
    }
    return [];
  };

  /**
   *
   * @returns resolved history data for surgery and eval
   */
  const getResolvedHistoryData = (): HistoryData[] => {
    return historyLogs
      .sort(
        (a, b) =>
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
      )
      .map((history: IHistory) => {
        switch (history.entityType) {
          case HistoryType.SURGERY: {
            const surgeryData = surgeries.find(
              (surgery) => surgery.id === history.entityId,
            );

            return getTransformedHistoryData(surgeryData, history);
          }

          case HistoryType.EVAL: {
            const evalData = evals.find(
              (data: IEval) => data.id === history.entityId,
            );

            return getTransformedHistoryData(evalData, history);
          }

          default:
            return [];
        }
      })
      .flat();
  };

  return (
    <div className="my-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">History</span>
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      {historyLogs && historyLogs.length > 0 && (
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
          </div>
          {getResolvedHistoryData().map((row, index) => (
            <div
              key={row.id}
              id={row.id}
              className={`div-clone flex gap-2 px-2.5 text-xs ${
                index !== historyLogs.length - 1
                  ? 'border-b border-gray-300'
                  : ''
              }`}
            >
              <div className="text-black pt-2 pb-2 px-1 w-40">
                {formatColumnDate(new Date(row.date).toISOString())}
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
              <div className="text-black pt-2 pb-2 px-1 w-40">
                {row.ip ?? '58.84.62.123'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
