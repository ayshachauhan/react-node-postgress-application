'use client';
import { HistoryEntity, ISurgery } from '@packages/entities';
import {
  ChangedValue,
  EntityChanges,
  HistoryAction,
  HistoryType,
  IEval,
  IHistory,
} from '@packages/entities/index.browser';
import Loader from '@root/components/loader';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { clearData, fetchHistory } from '@root/store/reducers/history';
import { PAGINATION_LIMIT } from '@root/utils/constants';
import {
  formatColumnDate,
  generateFullName,
  getPracticeId,
  // getUserId,
  toPascalCase,
} from '@utils/index';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  const [isHistoryLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [records, setRecords] = useState<HistoryEntity[]>([]);
  const patientId = searchParams.get('id') || undefined;
  const surgery = searchParams.get('surgery') || undefined;
  const showCaseHistory = !!patientId;

  const practiceId = getPracticeId();
  const [paginationReset, setPaginationReset] = useState(false);
  // const doctorId = getUserId();

  const { historyLogs, surgerySuccessMessage } = useAppSelector((state) => ({
    historyLogs: Object.values(state.history.entities),
    surgerySuccessMessage: state.surgeries.successMessage,
  }));
  const fetchedPages = useRef(new Set<number>());

  const getHistory = async (currentPage: number) => {
    if (
      isHistoryLoading ||
      !hasMore ||
      !practiceId ||
      fetchedPages.current.has(currentPage)
    )
      return;

    setIsLoading(true);
    fetchedPages.current.add(currentPage);

    try {
      const resultAction = await dispatch(
        fetchHistory({
          practiceId,
          page: currentPage,
          limit: PAGINATION_LIMIT,
          patientId, // Pass patientId
          surgery, // Pass surgery
        }),
      );

      if (fetchHistory.fulfilled.match(resultAction)) {
        const data = resultAction.payload as HistoryEntity[];

        if (Array.isArray(data)) {
          const filteredData = data;

          setRecords((prevRecords) => {
            const newRecords = filteredData.filter(
              (record) => !prevRecords.some((prev) => prev.id === record.id),
            );
            return [...prevRecords, ...newRecords];
          });

          if (filteredData.length < PAGINATION_LIMIT) {
            setHasMore(false); // No more records
          }
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPagination = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setRecords([]);
    fetchedPages.current.clear();
  }, []);

  useEffect(() => {
    if (practiceId) {
      dispatch(clearData());
      resetPagination();
      setPaginationReset(true);
    }
  }, [dispatch, practiceId, resetPagination]);

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  useEffect(() => {
    if (practiceId && paginationReset) {
      getHistory(1).then(() => setPaginationReset(false));
    }
  }, [practiceId, paginationReset, getHistory]);

  useEffect(() => {
    if (practiceId && page > 1) {
      getHistory(page);
    }
  }, [practiceId, page, getHistory]);

  useEffect(() => {
    const fetchAndReset = async () => {
      if (practiceId) {
        resetPagination();
        await getHistory(1);
      }
    };
    if (surgerySuccessMessage) {
      fetchAndReset();
    }
  }, [surgerySuccessMessage, dispatch, practiceId]);

  const loadMore = useCallback(() => {
    if (!isHistoryLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isHistoryLoading, hasMore]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isHistoryLoading
    )
      return;

    loadMore();
  }, [isHistoryLoading, loadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

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
    if (!entityData) {
      return [];
    }

    const historyData = {
      id: entityData.id,
      date: history.dateCreated,
      surgery: entityData.surgeryConfiguration?.name || '',
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

    const resolvedData: HistoryData[] = history.changes
      ? resolvedHistoryChanges(historyData, history.changes)
      : [historyData];

    return resolvedData;
  };

  /**
   *
   * @returns resolved history data for surgery and eval
   */
  const getResolvedHistoryData = (): HistoryData[] => {
    const filteredHistoryLogs = records as HistoryEntity[];

    return filteredHistoryLogs
      .map((history: HistoryEntity) => {
        const surgeryData = history.surgery;
        const evalData = history.eval;

        if (history.entityType === HistoryType.SURGERY) {
          return getTransformedHistoryData(surgeryData as ISurgery, history);
        } else if (history.entityType === HistoryType.EVAL) {
          return getTransformedHistoryData(evalData as IEval, history);
        }

        return [];
      })
      .flat();
  };

  return (
    <div className="my-4">
      {isHistoryLoading && <Loader />}
      <div className="flex justify-between border-gray-400">
        {showCaseHistory ? (
          <span className="text-xl font-bold">Case History</span>
        ) : (
          <span className="text-xl font-bold">All History</span>
        )}
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      {!isHistoryLoading && historyLogs && historyLogs.length > 0 && (
        <div className="table-responsive overflow-x-auto rounded-lg">
          <table className="">
            <tbody>
              <tr className="">
                <th className=""></th>
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
              {getResolvedHistoryData().map((row, index) => (
                <tr
                  key={row.id}
                  id={row.id}
                  className={`${
                    index !== historyLogs.length - 1
                      ? 'border-b border-gray-300'
                      : ''
                  }`}
                >
                  <td>{index + 1}</td>
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
