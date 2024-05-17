import { IMessage, IMessageRequest } from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';

const apiClient = new ApiService();

/**
 * @summary Get messages
 * @param payloadData
 * @param param1
 * @returns IMessage
 */
export const getMessages = async (
  payloadData: {
    practiceId: string;
  },
  { rejectWithValue },
): Promise<IMessage[]> => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/messages`,
    );
    if (!response.ok) {
      throw new Error('Failed to get templates');
    }
    const data: IMessage[] = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

/**
 *
 * @param payloadData
 * @returns IMessage
 */
export const addMessage = async (
  payloadData: IMessageRequest,
  { rejectWithValue },
): Promise<IMessage> => {
  try {
    const response = await apiClient.post(
      `/practices/${payloadData.practiceId}/messages`,
      payloadData,
    );
    const data: IMessage = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

/**
 * Delete message
 * @param payloadData
 * @param param1
 * @returns
 */
export const deleteMessage = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.delete(
      `/practices/${payloadData.practiceId}/messages/${payloadData.id}`,
    );
    if (!response.ok) {
      throw new Error('Failed to delete template');
    }
    const responseData = await response.text();

    // Check if response body is empty
    if (!responseData.trim()) {
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const getMessageInfo = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
): Promise<IMessage> => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/messages/${payloadData.id}`,
    );
    const data: IMessage = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};
