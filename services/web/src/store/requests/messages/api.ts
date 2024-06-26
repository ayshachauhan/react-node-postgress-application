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
      throw new Error('Failed to get messages');
    }
    const data: IEmailLog[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};
