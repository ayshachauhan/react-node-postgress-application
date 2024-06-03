import { IEmailLog } from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';

const apiClient = new ApiService();

/**
 * @summary Get messages
 * @param payloadData
 * @param param1
 * @returns IEmailLog
 */
export const getMessages = async (
  payloadData: {
    practiceId: string;
    searchMRNName?: string;
  },
  { rejectWithValue },
): Promise<IEmailLog[]> => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/messages/search?searchMRNName=${payloadData.searchMRNName}`,
    );
    if (!response.ok) {
      throw new Error('Failed to get templates');
    }
    const data: IEmailLog[] = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const getMessageInfo = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
): Promise<IEmailLog> => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/messages/${payloadData.id}`,
    );
    const data: IEmailLog = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};
