import {
  ChatbotLogsEntity,
  EmailLogEntity,
  IChatbot,
} from '@packages/entities';
import { ApiService } from '@root/services/apiclient';
import { FetchChatParams, FetchMessageParams } from './types';

const apiClient = new ApiService();

export const getUrlPath = (params: FetchChatParams) => {
  const { practiceId, patientId, mrn, answer } = params;
  let url = `/ai?practiceId=${practiceId}`;

  if (patientId) {
    url += `&patientId=${patientId}`;
  }

  if (mrn) {
    url += `&mrn=${mrn}`;
  }

  if (answer) {
    url += `&answer=${answer}`;
  }

  return url;
};

export const getUnifiedUrlPath = (params: FetchMessageParams) => {
  const { practiceId, patientId, email } = params;
  let url = `/ai/logs?practiceId=${practiceId}`;

  if (patientId) {
    url += `&patientId=${patientId}`;
  }

  if (email) {
    url += `&email=${email}`;
  }

  url += `&all=true`;

  return url;
};

/**
 * @summary Get chat history by Practice
 * @param payloadData
 * @returns chat history entity array as a response
 */
export const getChat = async (
  params: FetchChatParams,
  { rejectWithValue },
): Promise<IChatbot[]> => {
  try {
    const response: Response = await apiClient.get(getUrlPath(params));

    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }

    const data: IChatbot[] = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

type LogEntity =
  | (ChatbotLogsEntity & { type: 'chatbot' })
  | (EmailLogEntity & { type: 'sms' });

export const getUnifiedChat = async (
  params: FetchMessageParams,
  { rejectWithValue },
): Promise<LogEntity[]> => {
  try {
    const response: Response = await apiClient.get(getUnifiedUrlPath(params));

    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }

    const data: LogEntity[] = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};
