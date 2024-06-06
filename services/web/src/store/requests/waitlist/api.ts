import { CreateWaitlist, IWaitlist } from '@packages/entities';
import { ApiService } from '@root/services/apiclient';

const apiClient = new ApiService();

/**
 * @summary Get waitlist
 * @param payloadData
 * @param param1
 * @returns IWaitlist[]
 */
export const getWaitlist = async (
  payloadData: {
    practiceId: string;
  },
  { rejectWithValue },
): Promise<IWaitlist[]> => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/waitlist`,
    );
    if (!response.ok) {
      throw new Error('Failed to get waitlist.');
    }
    const data: IWaitlist[] = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

/**
 *
 * @param payloadData
 * @returns IInsuranceType
 */
export const addWaitlist = async (
  payloadData: CreateWaitlist,
  { rejectWithValue },
): Promise<IWaitlist> => {
  try {
    const response = await apiClient.post(
      `/practices/${payloadData.practiceId}/waitlist`,
      payloadData,
    );
    const data: IWaitlist = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

/**
 * Delete Insurance type
 * @param payloadData
 * @param param1
 * @returns
 */
export const deleteWaitlist = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.delete(
      `/practices/${payloadData.practiceId}/waitlist/${payloadData.id}`,
    );
    if (!response.ok) {
      throw new Error('Failed to delete waitlist');
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

export const getWaitlistInfo = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
): Promise<IWaitlist> => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/waitlist/${payloadData.id}`,
    );
    const data: IWaitlist = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};
