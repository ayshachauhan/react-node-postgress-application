import { ApiService } from '@root/services/apiclient';

import { IHistory } from '@packages/entities';
import { GetHistoryPayload, HistoryPayload } from './types';

const apiClient = new ApiService();

export const getUrlPath = (payload: HistoryPayload) => {
  return `/practices/${payload.practiceId}/history?page=${payload?.page}&limit=${payload?.limit}`;
};

/**
 * @summary Get history by Practice, user and surgerytype id
 * @param payloadData
 * @param param1
 * @returns history entity array as a response
 */
export const getHistory = async (
  payload: GetHistoryPayload,
  { rejectWithValue },
): Promise<IHistory[]> => {
  try {
    const response: Response = await apiClient.get(getUrlPath(payload));

    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }

    const data: IHistory[] = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};
