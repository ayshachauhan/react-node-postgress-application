import { PracticeCreateInterface } from '@components/practices/types';
import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';

export const getPractices = async ({ rejectWithValue }) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(`${API_BASE_URL}/practices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get practices');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error); // Pass error message to payload
  }
};

export const getPracticeData = async (
  payloadData: {
    id: string;
  },
  { rejectWithValue },
) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to get practice data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error); // Pass error message to payload
  }
};

export const addPractice = async (payloadData: PracticeCreateInterface) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(`${API_BASE_URL}/practices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payloadData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
