import { ApiService } from '@root/services/apiclient';
import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';
import { MediaInterface } from '.';

const apiClient = new ApiService();

export const getMedia = async (
  payloadData: { practiceId: string },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.get(
      `/practices/${payloadData.practiceId}/videos`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }

    console.log(response.json(), 'getmedia');

    const data = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const addMedia = async (
  payloadData: MediaInterface,
  { rejectWithValue },
) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/videos`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payloadData),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to add video');
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
