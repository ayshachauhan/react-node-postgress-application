import { IPermission } from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';

const apiClient = new ApiService();

/**
 * @summary Get Permission by PracticeId
 * @param payloadData
 * @param param1
 * @returns Permission object as a response
 */
export const getPermission = async (
  _,
  { rejectWithValue },
): Promise<IPermission[]> => {
  try {
    const response: Response = await apiClient.get(`/permissions`);

    if (!response.ok) {
      throw new Error('Failed to fetch permissions');
    }

    const data: IPermission[] = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

/**
 * @summary Add permission for a user
 * @param payloadData
 * @param param1
 * @returns IPermission
 */
export const addPermission = async (
  payloadData: IPermission,
  { rejectWithValue },
): Promise<IPermission> => {
  try {
    const response: Response = await apiClient.post(
      `/permissions`,
      payloadData,
    );
    if (!response.ok) {
      throw new Error('Failed to add permission');
    }
    const data: IPermission = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};
