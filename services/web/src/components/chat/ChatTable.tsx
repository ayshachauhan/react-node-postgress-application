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
import { formatDate, generateFullName, getPracticeId } from '@utils/index';
import { Select } from 'baseui/select';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ChatTable() {
  const dispatch = useAppDispatch();
  const [mrn, setMrn] = useState<string>('');
  const [iDontKnow, setIDontKnow] = useState<boolean>(false);
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

  const [loading, setLoading] = useState(true);

  const resetFilters = (): void => {
    dispatch(setSearchMRNName(null));
    setMrn('');
    dispatch(setSearchAnswer(null));
    setIDontKnow(false);
  };

  const handleIDontKnowToggle = () => {
    setIDontKnow((prev) => !prev);
    dispatch(setSearchAnswer("I don't know"));
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
  const formattedTime = (dateObject) => {
    // Get hours, minutes, seconds, and milliseconds
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    // Format hours in 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Return the formatted string with AM/PM and the formatted time
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  useEffect(() => {
    setLoading(true);
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

      if (iDontKnow) {
        chatFetchParams.answer = "I don't know";
      }

      dispatch(fetchChat(chatFetchParams)).finally(() => {
        setLoading(false);
      });
    }
  }, [dispatch, practiceId, patientId, mrn, iDontKnow]);
  return (
    <div className="my-4">
      <div className="flex justify-between border-gray-400">
        {showCaseHistory ? (
          <span className="text-xl font-bold">Case Chat History</span>
        ) : (
          <span className="text-xl font-bold">All Chat History</span>
        )}
        <div className="flex gap-6">
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
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={iDontKnow}
              onChange={handleIDontKnowToggle}
            />
            &nbsp; I don&apos;t know
          </div>
          <div>
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
      {loading ? (
        <div className="rounded-lg text-center">
          <p>Loading...</p>
        </div>
      ) : chatLogs.length > 0 ? (
        <div className="rounded-lg">
          <table className="table-fixed w-full">
            <tbody>
              <tr className="">
                <th className="w-1/12">S.No.</th>
                <th className="w-1/12">Date</th>
                <th className="w-1/12">Name</th>
                <th className="w-1/12">MRN</th>
                <th className="w-1/2">Question</th>
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
                  <td className="">{formatDate(new Date(row.dateCreated))}</td>
                  <td className="">
                    {row
                      ? generateFullName(
                          row.patient?.firstName ?? '',
                          row.patient?.lastName ?? '',
                        )
                      : null}
                  </td>
                  <td className="">{row?.patient?.mrn}</td>
                  <td>
                    {' '}
                    {row.botQuestionAnswers &&
                    row.botQuestionAnswers.length > 0 ? (
                      row.botQuestionAnswers
                        .filter((item) =>
                          iDontKnow
                            ? item.answer.toLowerCase().includes("i don't know")
                            : true,
                        )
                        .map((item, index) => (
                          <div key={index} className="mb-4">
                            <strong>Q{index + 1}</strong>: {item.question}{' '}
                            <br />
                            <strong>A:</strong> {item.answer}
                            <br />
                            <strong>Log Created At: </strong>{' '}
                            {formattedTime(new Date(item.dateCreated))}
                          </div>
                        ))
                    ) : (
                      <div>No questions and answers available</div>
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
      )}
    </div>
  );
}
