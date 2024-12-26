'use client';
import { PatientEntity } from '@packages/entities';
import { useAppDispatch, useAppSelector } from '@root/store';
import { clearData, fetchUnifiedChat } from '@root/store/reducers/unifiedChat';
import { FetchMessageParams } from '@root/store/requests/unifiedChat';
import {
  formatColumnDate,
  generateFullName,
  getPracticeId,
} from '@utils/index';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
type Message = {
  dateCreated: string;
  type: string;
  question: string;
  answer: string;
  data: {
    text: string;
  };
  patient: PatientEntity;
};
type GroupedMessages = {
  [date: string]: Message[];
};
export default function DummySmsTable() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const practiceId = getPracticeId();
  const { chatLogs } = useAppSelector((state) => ({
    chatLogs: Object.values(state.unifiedChat.entities),
  }));
  const email = searchParams.get('email') || '';
  const patientId = searchParams.get('id') || undefined;
  const [loading, setLoading] = useState(true);
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  useEffect(() => {
    setLoading(true);
    dispatch(clearData());
    if (practiceId != null && email != null) {
      const FetchMessageParams: FetchMessageParams = {
        practiceId,
        patientId,
        email,
      };
      dispatch(fetchUnifiedChat(FetchMessageParams)).finally(() => {
        setLoading(false);
      });
    }
  }, [dispatch, practiceId, patientId, email]);
  const transformedChatLogs = chatLogs.flatMap((row) => {
    if (row.type === 'chatbot' && row.botQuestionAnswers?.length > 0) {
      return row.botQuestionAnswers.map((qa) => ({
        ...row,
        question: qa.question,
        answer: qa.answer,
        dateCreated: qa.dateCreated,
      }));
    }
    return [row];
  });
  const groupedMessages: GroupedMessages = transformedChatLogs.reduce(
    (acc, row) => {
      const date = formatColumnDate(new Date(row.dateCreated)).split(' ')[0]; // Extract only the date
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(row);
      return acc;
    },
    {},
  );
  const orderedGroupedMessages = Object.fromEntries(
    Object.entries(groupedMessages)
      .sort(
        ([dateA], [dateB]) =>
          new Date(dateB).getTime() - new Date(dateA).getTime(),
      )
      .map(([date, messages]) => [
        date,
        messages.sort(
          (a, b) =>
            new Date(b.dateCreated).getTime() -
            new Date(a.dateCreated).getTime(),
        ),
      ]),
  );
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };
  const stripHtmlTags = (inputText: string) => {
    const doc = new DOMParser().parseFromString(inputText, 'text/html');
    return doc.body.textContent || '';
  };
  return (
    <div className="my-4">
      <div className="flex justify-between border-gray-400">
        <span className="text-xl font-bold">Chat History</span>
        <div className="flex gap-6">
          <div className="flex items-center min-w-96"></div>
        </div>
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-700"></hr>
      {loading ? (
        <div className="rounded-lg text-center">
          <p>Loading...</p>
        </div>
      ) : Object.keys(orderedGroupedMessages).length > 0 ? (
        <div className="rounded-lg">
          {Object.entries(orderedGroupedMessages as GroupedMessages).map(
            ([date, messages]) => (
              <section key={date} className="">
                <div className="text-center">
                  <div className="flex-1 justify-between flex flex-col">
                    <div
                      id="messages"
                      className="flex flex-col space-y-4 overflow-y-auto"
                    >
                      <div className="flex items-center justify-center my-2">
                        <div className="bg-gray-300 text-gray-700 text-xs font-bold px-5 py-1 rounded-full">
                          {formatDate(new Date(date))}{' '}
                        </div>
                      </div>
                      {messages.map((row, index) => {
                        const dateObject = new Date(row.dateCreated);
                        const time = dateObject
                          .toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            timeZone: 'UTC',
                          })
                          .toUpperCase();
                        return (
                          <div key={index} className="chat-message">
                            {row.type === 'chatbot' ? (
                              <div>
                                <div className="flex items-end">
                                  <div className="flex flex-col space-y-2 text-xs max-w-md mx-2 order-2 items-start">
                                    <div>
                                      <div className="flex text-left items-center">
                                        <span className="text-sm font-bold text-gray-800 px-1">
                                          POD
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {time}
                                        </span>
                                      </div>
                                      <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600 text-left">
                                        {' '}
                                        {row.answer
                                          ? stripHtmlTags(row.answer)
                                          : 'Loading...'}
                                      </span>
                                    </div>
                                  </div>
                                  <img
                                    src="/images/favicon-new.ico"
                                    alt="My profile"
                                    className="w-7 h-7 rounded-full order-1"
                                  />
                                </div>
                                <div className="flex items-end mt-4">
                                  <div className="flex-shrink-0 bg-gradient-to-b from-primary-dark to-primary-light text-white rounded-full w-7 h-7 flex items-center justify-center order-2">
                                    {row.patient && row.patient?.firstName
                                      ? row.patient.firstName
                                          .charAt(0)
                                          .toUpperCase()
                                      : ''}
                                  </div>
                                  <div className="flex flex-col space-y-2 text-xs max-w-md mx-2 order-2 items-start">
                                    <div className="flex flex-col">
                                      <div className="flex text-left items-center">
                                        <span className="text-sm font-bold text-gray-800 px-1">
                                          {' '}
                                          {row.patient
                                            ? generateFullName(
                                                capitalizeFirstLetter(
                                                  row.patient?.firstName ?? '',
                                                ),
                                                capitalizeFirstLetter(
                                                  row.patient?.lastName ?? '',
                                                ),
                                              )
                                            : 'Patient'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {time}
                                        </span>
                                      </div>
                                      <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gradient-to-b from-primary-dark to-primary-light text-white text-left">
                                        {' '}
                                        {row.question
                                          ? stripHtmlTags(row.question)
                                          : 'Loading...'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : row.type === 'sms' ? (
                              <div className="flex items-end">
                                <div className="flex flex-col space-y-2 text-xs max-w-md mx-2 order-2 items-start">
                                  <div>
                                    <div className="flex text-left items-center">
                                      <span className="text-sm font-bold text-gray-800 px-1">
                                        POD
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {time}
                                      </span>
                                    </div>
                                    <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600 text-left">
                                      {' '}
                                      {stripHtmlTags(row?.data?.text)}
                                    </span>
                                  </div>
                                </div>
                                <img
                                  src="/images/favicon-new.ico"
                                  alt="My profile"
                                  className="w-7 h-7 rounded-full order-1"
                                />
                              </div>
                            ) : (
                              <div>Unsupported type</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            ),
          )}
        </div>
      ) : (
        <div className="rounded-lg text-center">
          <p>No data found</p>
        </div>
      )}
    </div>
  );
}
