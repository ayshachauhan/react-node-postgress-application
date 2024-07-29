import { CreateEvalInterface, UpdateEValInterface } from '@packages/entities';
import { ApiService } from '@root/services/apiclient';
import { getIpAddress } from '@root/utils';

const apiClient = new ApiService();

export const getEvals = async (
  payloadData: {
    practiceId: string;
    includeDeleted?: boolean;
    doctorId?: string;
    page: number;
    limit: number;
  },
  { rejectWithValue },
) => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/evals?includeDeleted=${
        payloadData.includeDeleted ?? false
      }&doctorId=${payloadData?.doctorId}&page=${payloadData?.page}&limit=${payloadData?.limit}`,
    );

    if (!response.ok) {
      throw new Error('Failed to get evals');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const getEvalInfo = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/evals/${payloadData.id}`,
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const addEval = async (payloadData: CreateEvalInterface) => {
  try {
    const response: Response = await apiClient.post(
      `/practices/${payloadData.practiceId}/evals`,
      {
        ...payloadData,
        ipAddress: await getIpAddress(),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const updateEval = async ({
  payloadData,
  id,
}: {
  payloadData: Partial<UpdateEValInterface>;
  id: string;
}) => {
  try {
    const response: Response = await apiClient.patch(
      `/practices/${payloadData.practiceId}/evals/${id}`,
      {
        ...payloadData,
        ipAddress: await getIpAddress(),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteEval = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response: Response = await apiClient.delete(
      `/practices/${payloadData.practiceId}/evals/${payloadData.id}`,
      {
        ipAddress: await getIpAddress(),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete eval');
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
