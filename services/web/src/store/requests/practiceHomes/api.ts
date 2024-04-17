import { IPracticeHomes } from '@packages/entities';
import { ApiService } from '@root/services/apiclient';
import { CreatePracticeHomeInterface } from '.';

const apiClient = new ApiService();

/**
 * Get Practice homes by practice id
 * @param payloadData
 * @param param1
 * @returns IPracticeHomes[]
 */
export const getPracticeHomes = async (
  payloadData: {
    practiceId: string;
  },
  { rejectWithValue },
): Promise<IPracticeHomes[]> => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/homes`,
    );
    if (!response.ok) {
      throw new Error('Failed to get templates');
    }
    const data: IPracticeHomes[] = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

/**
 * Add practice Hone
 * @param payloadData
 * @returns
 */
export const addPracticeHome = async (
  payloadData: CreatePracticeHomeInterface,
  { rejectWithValue },
): Promise<IPracticeHomes> => {
  try {
    const response: Response = await apiClient.post(
      `/practices/${payloadData.practiceId}/homes`,
      payloadData,
    );
    const data: IPracticeHomes = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

/**
 *
 * @param payloadData
 * @param param1
 * @returns
 */
export const deletePracticeHome = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.delete(
      `/practices/${payloadData.practiceId}/homes/${payloadData.id}`,
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

/**
 *
 * @param payloadData
 * @param param1
 * @returns
 */
export const getPracticeHomeInfo = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/homes/${payloadData.id}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};
