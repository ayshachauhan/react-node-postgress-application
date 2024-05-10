import { IReferrer } from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';
import { AddReferrer, EditReferrer } from '.';

const apiClient = new ApiService();

/**
 * @param payloadData
 * @param param1
 * @returns All Referrers by practiceid
 */
export const getReferrers = async (
  payloadData: { practiceId: string },
  { rejectWithValue },
) => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/referrer`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch referrers');
    }
    const data: IReferrer[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

/**
 * @param payloadData
 * @param param1
 * @returns Get referrer Info By Id
 */
export const getReferrerInfo = async (
  payloadData: {
    id: string;
    practiceId: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.get(
      `/practices/${payloadData.practiceId}/referrer/${payloadData.id}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch referrer');
    }
    const data: IReferrer = await response.json();
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
export const addReferrer = async (
  payloadData: AddReferrer,
  { rejectWithValue },
) => {
  try {
    const { practiceId, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    const response = await apiClient.post(
      `/practices/${practiceId}/referrer`,
      sanitizedPayload,
    );
    if (!response.ok) {
      throw new Error('Failed to add referrer');
    }
    const data: IReferrer = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const deleteReferrer = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.delete(
      `/practices/${payloadData.practiceId}/referrer/${payloadData.id}`,
    );
    if (!response.ok) {
      throw new Error('Failed to delete referrer');
    }
    const responseData = await response.text();

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
 * @summary Update referrer
 * @param payloadData
 * @param param1
 * @returns
 */
export const updateReferrer = async (
  payloadData: EditReferrer,
  { rejectWithValue },
) => {
  try {
    const { practiceId, id, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    const response = await apiClient.patch(
      `/practices/${practiceId}/referrer/${id}`,
      sanitizedPayload,
    );
    if (!response.ok) {
      throw new Error('Failed to update referrer');
    }
    const data: EditReferrer = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};
