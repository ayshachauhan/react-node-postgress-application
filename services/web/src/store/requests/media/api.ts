import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';
import { MediaInterface } from '.';

export const getMedia = async (
  payloadData: { practiceId: string },
  { rejectWithValue },
) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/videos`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error); // Pass error message to payload
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
    return rejectWithValue(error); // Pass error message to payload
  }
};
