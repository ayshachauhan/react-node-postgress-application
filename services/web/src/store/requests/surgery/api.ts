import {
  CreateSurgeryPayload,
  SurgeryEntity,
  UpdateSurgeryPayload,
} from '@packages/entities';
import { ApiService } from '@root/services/apiclient';
import { getIpAddress } from '@root/utils';
import { constructQueryParams } from '@utils/index';

const apiClient = new ApiService();

interface SurgerySearchResult {
  surgeries: SurgeryEntity[];
  restricted: boolean;
}

export const getSurgeries = async (
  payloadData: {
    loggedInUserId?: string;
    practiceId: string;
    includeDeleted?: boolean;
    month?: string;
    searchMRNName?: string;
    option?: string;
    doctorId?: string;
    page?: number;
    limit?: number;
  },
  { rejectWithValue },
): Promise<SurgerySearchResult> => {
  const {
    loggedInUserId,
    practiceId,
    includeDeleted,
    month,
    searchMRNName,
    option,
    doctorId,
    page,
    limit,
  } = payloadData;

  try {
    const queryParams = constructQueryParams({
      includeDeleted: includeDeleted ?? false,
      month,
      searchMRNName,
      option,
      loggedInUserId,
      doctorId,
    });

    if (!queryParams) {
      throw new Error('No query parameters provided');
    }

    const response = await apiClient.get(
      `/practices/${practiceId}/surgery${queryParams}&page=${page}&limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error('Failed to get surgery');
    }

    const data: SurgerySearchResult = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const getAllSurgeries = async (
  payloadData: {
    practiceId: string;
    includeDeleted?: boolean;
  },
  { rejectWithValue },
) => {
  const { practiceId, includeDeleted } = payloadData;

  try {
    const queryParams = `?includeDeleted=${includeDeleted ?? false}`;

    if (!queryParams) {
      throw new Error('No query parameters provided');
    }

    const response = await apiClient.get(
      `/practices/${practiceId}/surgery/all${queryParams}`,
    );

    if (!response.ok) {
      throw new Error('Failed to get surgery');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const addSurgery = async (payloadData: CreateSurgeryPayload) => {
  try {
    const response = await apiClient.post(
      `/practices/${payloadData.practiceId}/surgery`,
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

export const deleteSurgery = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.delete(
      `/practices/${payloadData.practiceId}/surgery/${payloadData.id}`,
      {
        ipAddress: await getIpAddress(),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to delete surgery');
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

export const getSurgeryInfo = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.get(
      `/practices/${payloadData.practiceId}/surgery/${payloadData.id}`,
    );

    const data = await response.json();

    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const updateSurgery = async ({
  payload,
  id,
}: {
  payload: Partial<UpdateSurgeryPayload>;
  id: string;
}) => {
  try {
    const { practiceId } = payload;
    delete payload.practiceId;
    const response = await apiClient.patch(
      `/practices/${practiceId}/surgery/${id}`,
      { ...payload, ipAddress: await getIpAddress() },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
