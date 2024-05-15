import { IPractice } from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';
import {
  PracticeCreateInterface,
  PracticesEditInterface,
  PracticesGetInterface,
} from '@store/requests/practices';

const apiClient = new ApiService();

/**
 * Get Practices
 * @param _
 * @param param1
 * @returns
 */
export const getPractices = async (
  _,
  { rejectWithValue },
): Promise<PracticesGetInterface[]> => {
  try {
    const response: Response = await apiClient.get(`/practices`);
    if (!response.ok) {
      throw new Error('Failed to get practices');
    }
    const data: PracticesGetInterface[] = await response.json();
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
export const getPracticeData = async (
  payloadData: {
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.get(`/practices/${payloadData.id}`);
    if (!response.ok) {
      throw new Error('Failed to get practice data');
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
export const addPractice = async (
  payloadData: PracticeCreateInterface,
  { rejectWithValue },
): Promise<IPractice> => {
  try {
    const response = await apiClient.post(`/practices`, payloadData);
    const data: IPractice = await response.json();
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
export const editPractice = async (
  payloadData: PracticesEditInterface,
  { rejectWithValue },
) => {
  try {
    const { id } = payloadData;
    delete payloadData.id;
    const response = await apiClient.patch(`/practices/${id}`, payloadData);
    const data = await response.json();
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
export const deletePractice = async (
  payloadData: {
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.delete(`/practices/${payloadData.id}`);
    if (!response.ok) {
      throw new Error('Failed to delete practice');
    }

    // this is to handle empty response.
    return null;
  } catch (error) {
    return rejectWithValue(error);
  }
};
