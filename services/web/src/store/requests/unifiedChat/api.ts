import { IChatbot } from '@packages/entities';
import { IMessage } from '@packages/entities/message';
import { ApiService } from '@root/services/apiclient';
import { FetchMessageParams } from './types';

const apiClient = new ApiService();

export const getUrlPath = (params: FetchMessageParams) => {
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

type LogEntity =
  | (IChatbot & { type: 'chatbot' })
  | (IMessage & { type: 'sms' });

export const getUnifiedChat = async (
  params: FetchMessageParams,
  { rejectWithValue },
): Promise<LogEntity[]> => {
  try {
    const response: Response = await apiClient.get(getUrlPath(params));

    if (!response.ok) {
      throw new Error('Failed to fetch sms history');
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
