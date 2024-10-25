'use client';
import Button from '@root/components/Button';
import { SearchIcon } from '@root/components/Icons';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearData,
  fetchChat,
  setSearchAnswer,
  setSearchMRNName,
} from '@root/store/reducers/chat';
import { fetchListings as fetchPatients } from '@root/store/reducers/patient';
import { FetchChatParams } from '@root/store/requests/chat';
import {
  formatColumnDate,
  generateFullName,
  getPracticeId,
} from '@utils/index';
import { Select } from 'baseui/select';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ChatTable() {
  const dispatch = useAppDispatch();
  const [mrn, setMrn] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const searchParams = useSearchParams();

  const practiceId = getPracticeId();
  const { patientsList } = useAppSelector((state) => ({
    patientsList: Object.values(state.patients.entities),
  }));
  const { chatLogs } = useAppSelector((state) => ({
    chatLogs: Object.values(state.chat.entities),
  }));
  const patientId = searchParams.get('id') || undefined;
  const showCaseHistory = !!patientId;

  const answersList = chatLogs
    .flatMap((log) => log.botQuestionAnswers)
    .map((botQuestion) => botQuestion.answer);

  const uniqueAnswers = Array.from(
    new Set(answersList.filter((ans) => ans.includes("I don't know"))),
  );

  const options = uniqueAnswers.map((answer) => ({
    id: answer,
    label: answer,
  }));

  const resetFilters = (): void => {
    dispatch(setSearchMRNName(null));
    setMrn('');
    dispatch(setSearchAnswer(null));
    setAnswer('');
  };

  const handleSearchAnswerChange = (value) => {
    if (value) {
      setAnswer(value);
      dispatch(setSearchAnswer(value));
    } else {
      setAnswer('');
      resetFilters();
    }
  };

  const handleSearchMRNNameChange = (value) => {
    if (value) {
      const selectedMrn = value;
      setMrn(selectedMrn);
      dispatch(setSearchMRNName(selectedMrn));
    } else {
      setMrn('');
      resetFilters();
    }
  };

  useEffect(() => {
    dispatch(clearData());
    if (practiceId != null) {
      dispatch(fetchPatients({ practiceId }));

      const chatFetchParams: FetchChatParams = { practiceId };

      if (patientId) {
        chatFetchParams.patientId = patientId;
      }

      if (mrn) {
        chatFetchParams.mrn = mrn;
      }

      if (answer) {
        chatFetchParams.answer = answer;
      }

      dispatch(fetchChat(chatFetchParams));
    }
  }, [dispatch, practiceId, patientId, mrn, answer]);

  return (
    <div className="my-4">
      <div className="flex justify-between border-gray-400">
        {showCaseHistory ? (
          <span className="text-xl font-bold">Case Chat History</span>
        ) : (
          <span className="text-xl font-bold">All Chat History</span>
        )}
        <div className="flex gap-10">
          <div className="flex items-center min-w-96">
            <Select
              backspaceClearsInputValue
              backspaceRemoves
              value={answer ? [{ id: answer, label: answer }] : []}
              onChange={({ value }) => handleSearchAnswerChange(value[0]?.id)}
              options={options}
              placeholder="Seach by answer"
              overrides={{
                ControlContainer: {
                  style: {
                    backgroundColor: 'rgba(250, 250, 250, 1)',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    color: '#52525B',
                    borderTopRightRadius: '0',
                    borderBottomRightRadius: '0',
                  },
                },
                ClearIcon: {
                  component: () => null,
                },
              }}
            />
            <div className="bg-gradient-to-br from-teal-600 to-green-500 text-white px-5 h-full items-center rounded-r-lg border-r border-gray-300 flex items-center">
              <SearchIcon></SearchIcon>
            </div>
          </div>
          <div className="flex items-center min-w-96">
            <Select
              backspaceClearsInputValue
              backspaceRemoves
              value={mrn ? [{ id: mrn, label: mrn }] : []}
              onChange={({ value }) => handleSearchMRNNameChange(value[0]?.id)}
              options={patientsList.map((patient) => ({
                id: patient.mrn,
                label: `${patient.lastName}, ${patient.firstName} | ${patient.mrn}`,
              }))}
              placeholder="Search MRN or Name"
              overrides={{
                ControlContainer: {
                  style: {
                    backgroundColor: 'rgba(250, 250, 250, 1)',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    color: '#52525B',
                    borderTopRightRadius: '0',
                    borderBottomRightRadius: '0',
                  },
                },
                ClearIcon: {
                  component: () => null,
                },
              }}
            />
            <div className="bg-gradient-to-br from-teal-600 to-green-500 text-white px-5 h-full items-center rounded-r-lg border-r border-gray-300 flex items-center">
              <SearchIcon></SearchIcon>
            </div>
            <Button
              onClick={resetFilters}
              type="button"
              kind="tertiary"
              title="Clear"
              style={{
                backgroundColor: 'rgba(212, 212, 216, 1)',
                color: 'black',
                marginLeft: '20px',
                padding: '10px 15px 10px 15px',
              }}
            />
          </div>
        </div>
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      {chatLogs ? (
        chatLogs.length > 0 ? (
          <div className="rounded-lg">
            <table className="">
              <tbody>
                <tr className="">
                  <th className="">S.No.</th>
                  <th className="">Date</th>
                  <th className="">Name</th>
                  <th className="">MRN</th>
                  <th className="">Question</th>
                </tr>
                {chatLogs.map((row, index) => (
                  <tr
                    key={row.id}
                    id={row.id}
                    className={`${
                      index !== chatLogs.length - 1
                        ? 'border-b border-gray-300'
                        : ''
                    }`}
                  >
                    <td>{index + 1}</td>
                    <td className="">
                      {formatColumnDate(new Date(row.dateCreated))}
                    </td>
                    <td className="">
                      {row
                        ? generateFullName(
                            row.patient?.firstName ?? '',
                            row.patient?.lastName ?? '',
                          )
                        : null}
                    </td>
                    <td className="">{row?.patient?.mrn}</td>
                    <td colSpan={2}>
                      {' '}
                      {row.botQuestionAnswers &&
                      row.botQuestionAnswers.length > 0 ? (
                        row.botQuestionAnswers.map((item, index) => (
                          <div key={index} style={{ marginBottom: '15px' }}>
                            <strong>Q{index + 1}</strong>: {item.question}{' '}
                            <br />
                            <strong>A:</strong> {item.answer}
                          </div>
                        ))
                      ) : (
                        <div>No question and answer available</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg text-center">
            <p>No data found</p>
          </div>
        )
      ) : (
        <div className="rounded-lg text-center">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}
