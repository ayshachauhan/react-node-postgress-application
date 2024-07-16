import {
  ISurgeryTypeUpdate,
  SurgeryType,
} from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';

const apiClient = new ApiService();

export const getSurgeryTypes = async (
  payloadData: {
    practiceId: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.get(
      `/practices/${payloadData.practiceId}/surgery-types`,
    );

    if (!response.ok) {
      throw new Error('Failed to get surgery types');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const addSurgeryType = async (payloadData: SurgeryType) => {
  try {
    const response = await apiClient.post(
      `/practices/${payloadData.practiceId}/surgery-types`,
      payloadData,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

/**
 *
 * @param payloadData
 * @param param1
 * @returns
 */
export const editSurgeryLocation = async (
  payloadData: ISurgeryTypeUpdate,
  { rejectWithValue },
) => {
  try {
    const { practiceId, id, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    const response = await apiClient.patch(
      `/practices/${practiceId}/surgery-types/${id}`,
      sanitizedPayload,
    );
    if (!response.ok) {
      throw new Error('Failed to update surgery location');
    }
    const data: ISurgeryTypeUpdate = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const deleteSurgeryType = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.delete(
      `/practices/${payloadData.practiceId}/surgery-types/${payloadData.id}`,
      null,
    );
    if (!response.ok) {
      throw new Error('Failed to delete surgery type');
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

export const getSurgeryTypeInfo = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.post(
      `/practices/${payloadData.practiceId}/surgery-types/${payloadData.id}`,
      payloadData,
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};
