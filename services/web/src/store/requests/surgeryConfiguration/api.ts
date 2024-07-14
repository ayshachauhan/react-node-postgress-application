import {
  CreateSurgeryConfigurationPayload,
  UpdateSurgeryConfigPayload,
} from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';

const apiClient = new ApiService();

export const getSurgeryConfigurations = async (
  payloadData: {
    practiceId: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.get(
      `/practices/${payloadData.practiceId}/surgeryTypes/configurations`,
    );

    if (!response.ok) {
      throw new Error('Failed to get surgery configurations');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const deleteSurgeryConfiguration = async (
  payloadData: {
    practiceId: string;
    surgeryTypeId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.delete(
      `/practices/${payloadData.practiceId}/surgeryTypes/configurations/${payloadData.surgeryTypeId}/${payloadData.id}`,
      null,
    );
    if (!response.ok) {
      throw new Error('Failed to delete surgery configuration.');
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

export const getSurgeryConfigurationInfo = async (
  payloadData: {
    practiceId: string;
    id: string;
    surgeryTypeId: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.get(
      `/practices/${payloadData.practiceId}/surgeryTypes/configurations/${payloadData.surgeryTypeId}/${payloadData.id}`,
      payloadData,
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const addSurgeryConfiguration = async (
  {
    payloadData,
    practiceId,
  }: {
    payloadData: CreateSurgeryConfigurationPayload;
    practiceId: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.post(
      `/practices/${practiceId}/surgeryTypes/configurations/${payloadData.surgeryTypeId}`,
      payloadData,
    );

    if (!response?.ok) {
      if (response?.status === 406) {
        throw new Error('Surgery Name already exists for this type');
      }
      throw new Error('Failed to add surgery type');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error?.message);
    }
    return rejectWithValue('An unknown error.');
  }
};

export const editSurgeryConfiguration = async ({
  payloadData,
  practiceId,
  id,
}: {
  payloadData: UpdateSurgeryConfigPayload;
  practiceId: string;
  id: string;
}) => {
  try {
    const surgeryTypeId = payloadData.surgeryTypeId;
    delete payloadData.surgeryTypeId;
    const response = await apiClient.patch(
      `/practices/${practiceId}/surgeryTypes/configurations/${surgeryTypeId}/${id}`,
      payloadData,
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
