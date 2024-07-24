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
import Loader from '@root/components/loader';
import { useLoader } from '@root/hooks/useLoader';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { fetchListings as fetchEvalsList } from '@root/store/reducers/evals';
import { clearData, fetchHistory } from '@root/store/reducers/history';
import { fetchListings as fetchSurgeryList } from '@root/store/reducers/surgery';
import { PAGINATION_LIMIT } from '@root/utils/constants';
import {
  formatColumnDate,
  generateFullName,
  getPracticeId,
  // getUserId,
  toPascalCase,
} from '@utils/index';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { SurgeryFields } from './constants';

export type HistoryData = {
  id: string;
  date: Date;
  surgery: string;
  firstName: string;
  lastName: string;
  patientId: string;
  mrn: number;
  field: string;
  user: string;
  prior?: string;
  new?: string;
  ip: string;
  action: HistoryAction;
  type: string;
};

export default function HistoryTable() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('id');
  const surgery = searchParams.get('surgery');
  const showCaseHistory = !!patientId;
  const { isLoading, withLoader } = useLoader();

  const practiceId = getPracticeId();
  // const doctorId = getUserId();

  const { historyLogs, surgeries, surgerySuccessMessage, evals } =
    useAppSelector((state) => ({
      historyLogs: Object.values(state.history.entities),
      evals: Object.values(state.evals.entities),
      surgeries: Object.values(state.surgeries.entities),
      surgerySuccessMessage: state.surgeries.successMessage,
    }));

  useEffect(() => {
    dispatch(clearData());
  }, [dispatch, practiceId]);

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  useEffect(() => {
    if (practiceId) {
      const loadData = async () => {
        await withLoader(async () => {
          await dispatch(fetchHistory({ practiceId }));
        });
      };
      loadData();
      // TO DO later
      // dispatch(fetchEvalsList({ practiceId, doctorId: doctorId || '' }));
      dispatch(
        fetchEvalsList({ practiceId, page: 1, limit: PAGINATION_LIMIT }),
      );
      // dispatch(fetchSurgeryList({ practiceId, doctorId: doctorId || '' }));
      dispatch(fetchSurgeryList({ practiceId }));
    }
  }, [practiceId, dispatch]);

  useEffect(() => {
    if (practiceId) {
      const loadData = async () => {
        await withLoader(async () => {
          await dispatch(fetchHistory({ practiceId }));
        });
      };
      loadData();
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
        patientId: entityData.patient.id,
        mrn: entityData.patient.mrn,
        user: history.user.fullName,
        ip: history.ipAddress ?? '',
        field: history.action === HistoryAction.CREATE ? 'Initial' : 'Delete',
        action: history.action,
        type: toPascalCase(history.entityType),
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
    let filteredHistoryLogs = historyLogs;

    if (patientId) {
      filteredHistoryLogs = historyLogs.filter((history) => {
        if (history.entityType === HistoryType.SURGERY) {
          const surgeryData = surgeries.find(
            (surgery) => surgery.id === history.entityId,
          );
          if (surgeryData && surgeryData.patient.id === patientId) {
            return true;
          }
        } else if (history.entityType === HistoryType.EVAL) {
          const evalData = evals.find(
            (evaluation) => evaluation.id === history.entityId,
          );
          if (evalData && evalData.patient.id === patientId) {
            return true;
          }
        }
        return false;
      });
    }

    return filteredHistoryLogs
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

  const sortHistoryDataByDate = (historyData: HistoryData[]): HistoryData[] => {
    return historyData.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };
  const getSortedHistoryData = (): HistoryData[] => {
    const resolvedHistoryData = getResolvedHistoryData();
    let sortedHistoryData = sortHistoryDataByDate(resolvedHistoryData);
    if (surgery) {
      sortedHistoryData = sortedHistoryData.filter(
        (ele) => ele.surgery === surgery,
      );
    }
    return sortedHistoryData;
  };
  return (
    <div className="my-4">
      {isLoading && <Loader />}
      <div className="flex justify-between border-gray-400">
        {showCaseHistory ? (
          <span className="text-xl font-bold">Case History</span>
        ) : (
          <span className="text-xl font-bold">All History</span>
        )}
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      {!isLoading && historyLogs && historyLogs.length > 0 && (
        <div className="table-responsive overflow-x-auto rounded-lg">
          <table className="">
            <tbody>
              <tr className="">
                <th className="">Date</th>
                <th className="">Name</th>
                <th className="">MRN</th>
                <th className="">Type</th>
                <th className="">Surgery</th>
                <th className="">Field</th>
                <th className="">User</th>
                <th className="">Prior</th>
                <th className="">New</th>
                <th className="">IP</th>
              </tr>
              {getSortedHistoryData().map((row, index) => (
                <tr
                  key={row.id}
                  id={row.id}
                  className={`${
                    index !== historyLogs.length - 1
                      ? 'border-b border-gray-300'
                      : ''
                  }`}
                >
                  <td className="">{formatColumnDate(new Date(row.date))}</td>
                  <td className="">
                    {row ? generateFullName(row.firstName, row.lastName) : null}
                  </td>
                  <td className="">{row.mrn}</td>
                  <td className="">{row.type}</td>
                  <td className="">{row.surgery}</td>
                  <td className="">{row.field}</td>
                  <td className="">{row.user}</td>
                  <td className="">{row.prior}</td>
                  <td className="">{row.new}</td>
                  <td className="">{row.ip ?? '58.84.62.123'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
