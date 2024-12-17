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

export default function SmsTable() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const practiceId = getPracticeId();
  const { chatLogs } = useAppSelector((state) => ({
    chatLogs: Object.values(state.unifiedChat.entities),
  }));
  const email = searchParams.get('email') || '';
  const patientId = searchParams.get('id') || undefined;
  const [loading, setLoading] = useState(true);

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
        <span className="text-xl font-bold">Message History</span>
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
              <div key={date} className="mb-6">
                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute left-0 right-0 border-t border-gray-300"></div>
                  <h2 className="text-lg font-semibold px-4 bg-white relative z-10">
                    {' '}
                    {formatDate(new Date(date))}{' '}
                  </h2>
                </div>
                {messages.map((row, index) => {
                  const dateObject = new Date(row.dateCreated);
                  const time = dateObject
                    .toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })
                    .toUpperCase();
                  return (
                    <div key={index} className="mb-2">
                      {row.type === 'chatbot' ? (
                        <div>
                          <div className="mb-2">
                            {' '}
                            <strong>POD</strong>{' '}
                            <span className=""> {time} </span>
                            <br />
                            {stripHtmlTags(row.answer)}
                          </div>
                          <div className="mb-2">
                            <strong>
                              {' '}
                              {row.patient
                                ? generateFullName(
                                    row.patient?.firstName ?? '',
                                    row.patient?.lastName ?? '',
                                  )
                                : 'Patient'}{' '}
                            </strong>{' '}
                            <span className=""> {time} </span>
                            <br />
                            {stripHtmlTags(row.question)}
                          </div>
                        </div>
                      ) : row.type === 'sms' ? (
                        <div>
                          <strong>POD</strong>{' '}
                          <span className=""> {time} </span>
                          <br />
                          {stripHtmlTags(row?.data?.text)}
                        </div>
                      ) : (
                        <div>Unsupported type</div>
                      )}
                    </div>
                  );
                })}
              </div>
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
