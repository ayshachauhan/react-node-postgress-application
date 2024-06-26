import {
  CreateInsuranceTypeInterface,
  IInsuranceType,
} from '@packages/entities';
import { ApiService } from '@root/services/apiclient';

const apiClient = new ApiService();

/**
 * @summary Get Insurance type
 * @param payloadData
 * @param param1
 * @returns IInsuranceType
 */
export const getInsuranceTypes = async (
  payloadData: {
    practiceId: string;
  },
  { rejectWithValue },
): Promise<IInsuranceType[]> => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/insurance-types`,
    );
    if (!response.ok) {
      throw new Error('Failed to get templates');
    }
    const data: IInsuranceType[] = await response.json();
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
export const addInsuranceType = async (
  payloadData: CreateInsuranceTypeInterface,
  { rejectWithValue },
): Promise<IInsuranceType> => {
  try {
    const response = await apiClient.post(
      `/practices/${payloadData.practiceId}/insurance-types`,
      payloadData,
    );
    const data: IInsuranceType = await response.json();
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
export const deleteInsuranceType = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.delete(
      `/practices/${payloadData.practiceId}/insurance-types/${payloadData.id}`,
      null,
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

export const getInsuranceTypeInfo = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
): Promise<IInsuranceType> => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/insurance-types/${payloadData.id}`,
    );
    const data: IInsuranceType = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};
