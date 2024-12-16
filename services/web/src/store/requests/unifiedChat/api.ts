import { IChatbot, IEmailLog } from '@packages/entities';
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

type SmsLog = (IChatbot & { type: 'chatbot' }) | (IEmailLog & { type: 'sms' });

export const getUnifiedChat = async (
  params: FetchMessageParams,
  { rejectWithValue },
): Promise<SmsLog[]> => {
  try {
    const response: Response = await apiClient.get(getUrlPath(params));

    if (!response.ok) {
      throw new Error('Failed to fetch sms history');
    }

    const data: SmsLog[] = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};
