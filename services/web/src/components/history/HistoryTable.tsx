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
  const patientId = searchParams.get('id');
  const surgery = searchParams.get('surgery');
  const showCaseHistory = !!patientId;

  const practiceId = getPracticeId();
  // const doctorId = getUserId();

  const { historyLogs, surgeries, surgerySuccessMessage, evals } =
    useAppSelector((state) => ({
      historyLogs: Object.values(state.history.entities),
      evals: Object.values(state.evals.entities),
      surgeries: Object.values(state.surgeries.entities),
      surgerySuccessMessage: state.surgeries.successMessage,
    }));
  const fetchedPages = useRef(new Set<number>());

  const getHistory = async (currentPage: number) => {
    console.log(
      currentPage,
      2,
      isHistoryLoading,
      3,
      hasMore,
      4,
      practiceId,
      5,
      fetchedPages.current.has(currentPage),
    );
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
        }),
      );

      if (fetchHistory.fulfilled.match(resultAction)) {
        const data = resultAction.payload as HistoryEntity[];

        if (Array.isArray(data)) {
          setRecords((prevRecords) => {
            const newRecords = data.filter(
              (record) => !prevRecords.some((prev) => prev.id === record.id),
            );
            return [...prevRecords, ...newRecords];
          });

          if (data.length === PAGINATION_LIMIT) {
            setHasMore(true);
          } else {
            setHasMore(false);
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

  console.log(records.length, 2);

  const resetPagination = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setRecords([]);
    fetchedPages.current.clear();
  }, []);

  useEffect(() => {
    dispatch(clearData());
  }, [dispatch, practiceId]);

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  useEffect(() => {
    if (practiceId) {
      console.log('hi');
      resetPagination();
    }
  }, [practiceId]);

  useEffect(() => {
    console.log(page, page);
    getHistory(page);
  }, [page]);

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
    } else {
      const historyData = {
        id: history.entityId,
        date: history.dateCreated,
        surgery: 'Deleted Surgery',
        firstName: 'N/A',
        lastName: 'N/A',
        patientId: 'N/A',
        mrn: 123,
        user: history.user.fullName,
        ip: history.ipAddress ?? '',
        field: history.action === HistoryAction.CREATE ? 'Initial' : 'Delete',
        action: history.action,
        type: toPascalCase(history.entityType),
      };

      resolvedData = [historyData];
      return resolvedData;
    }
  };

  /**
   *
   * @returns resolved history data for surgery and eval
   */
  const getResolvedHistoryData = (): HistoryData[] => {
    let filteredHistoryLogs = records as HistoryEntity[];
    console.log(filteredHistoryLogs.length, 3);
    if (patientId) {
      filteredHistoryLogs = records.filter((history) => {
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
      .map((history: HistoryEntity) => {
        const entityData = history.entityData;

        if (history.entityType === HistoryType.SURGERY) {
          return getTransformedHistoryData(entityData as ISurgery, history);
        } else if (history.entityType === HistoryType.EVAL) {
          return getTransformedHistoryData(entityData as IEval, history);
        }

        return [];
      })
      .flat();
  };
  console.log(getResolvedHistoryData().length, 31);
  const getSortedHistoryData = (): HistoryData[] => {
    const resolvedHistoryData = getResolvedHistoryData();
    let sortedHistoryData = resolvedHistoryData;
    if (surgery) {
      sortedHistoryData = sortedHistoryData.filter(
        (ele) => ele.surgery === surgery,
      );
    }
    return sortedHistoryData;
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
