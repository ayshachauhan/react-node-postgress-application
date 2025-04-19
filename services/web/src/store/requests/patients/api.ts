import { ApiService } from '@root/services/apiclient';

const apiClient = new ApiService();

export const getPatients = async (
  payloadData: {
    practiceId: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.get(
      `/practices/${payloadData.practiceId}/patients`,
    );

    if (!response.ok) {
      throw new Error('Failed to get patients');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};
